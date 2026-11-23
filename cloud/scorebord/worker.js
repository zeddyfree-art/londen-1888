// Gedeeld scorebord van Londen 1888, als Cloudflare Worker met een D1-database (binding DB).
// tools/zet-scorebord-online.js vult MODEL hieronder in uit data/ en zet de Worker online.
//
//   GET  /scores            de beste overwinningen (standaard 50)
//   POST /scores            een overwinning insturen
//
// De server rekent de winkans en de punten zelf uit met het klokkenmodel. Wat het apparaat
// opgeeft als kans of punten wordt genegeerd. Per afzender mogen er 20 inzendingen per uur zijn.

const MODEL = /*MODEL*/ null;
const TOEGESTAAN = ["https://zeddyfree-art.github.io", "http://localhost:8000", "http://localhost:8765"];
const LIMIET_PER_UUR = 20;

const kop = origin => ({
  "Access-Control-Allow-Origin": TOEGESTAAN.includes(origin) ? origin : TOEGESTAAN[0],
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
  "Vary": "Origin"
});
const json = (data, status, origin) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...kop(origin) } });

/* Zelfde formule als schatKans in app/spel.js */
function kansVoor(god, stand, aantal, klokken, modus) {
  const basis = modus === "lang" && MODEL.basisLang ? MODEL.basisLang : MODEL.basis;
  const b = basis[god][stand][aantal];
  let T = 0;
  for (const id of klokken) if (!(id === "geen-genade" && stand === "genadeloos")) T += Math.max(0, MODEL.klokken.find(k => k.id === id).zwaarte[stand] || 0);
  const A = MODEL.plafond[stand];
  return 1 / (1 + Math.exp(-(Math.log(b / (1 - b)) - A * (1 - Math.exp(-T / A)))));
}
const puntenVoor = (kans, nipt) => Math.max(1, Math.round(100 * Math.log(1 / Math.max(kans, 0.002)) * (nipt ? 0.75 : 1)));
const schoon = t => String(t || "").replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 30);

async function hash(tekst) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(tekst));
  return [...new Uint8Array(d)].slice(0, 12).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function lijst(env, limiet) {
  const { results } = await env.DB.prepare("SELECT naam, god, stand, helden, klokken, ronde, uitslag, kans, punten, datum FROM scores ORDER BY punten DESC, ronde ASC, id ASC LIMIT ?").bind(limiet).all();
  return results.map(r => ({ ...r, helden: JSON.parse(r.helden), klokken: JSON.parse(r.klokken) }));
}

async function instuur(request, env, origin) {
  let e;
  try { e = await request.json(); } catch { return json({ fout: "Geen geldige JSON." }, 400, origin); }
  const fout = m => json({ fout: m }, 400, origin);
  const naam = schoon(e.naam);
  if (!naam) return fout("Vul een naam in.");
  if (!MODEL.basis[e.god]) return fout("Onbekende god.");
  if (!MODEL.standen.includes(e.stand)) return fout("Onbekende stand.");
  if (!Array.isArray(e.helden) || ![2, 4].includes(e.helden.length) || new Set(e.helden).size !== e.helden.length || !e.helden.every(h => MODEL.helden.includes(h))) return fout("Ongeldige helden.");
  if (!Array.isArray(e.klokken) || new Set(e.klokken).size !== e.klokken.length || !e.klokken.every(k => MODEL.klokken.some(x => x.id === k))) return fout("Ongeldige klokken.");
  if (!["winst", "nipt"].includes(e.uitslag)) return fout("Alleen overwinningen komen op het scorebord.");
  const ronde = Math.round(Number(e.ronde));
  if (!(ronde >= 1 && ronde <= 60)) return fout("Ongeldig aantal rondes.");
  const sleutel = String(e.sleutel || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 60);
  if (sleutel.length < 8) return fout("Ontbrekende sleutel.");
  const datum = /^\d{4}-\d{2}-\d{2}$/.test(e.datum) ? e.datum : new Date().toISOString().slice(0, 10);

  const bron = await hash((request.headers.get("CF-Connecting-IP") || "?") + "londen1888");
  const uurGeleden = new Date(Date.now() - 3600e3).toISOString();
  const { n } = await env.DB.prepare("SELECT COUNT(*) AS n FROM scores WHERE bron = ? AND ingestuurd > ?").bind(bron, uurGeleden).first();
  if (n >= LIMIET_PER_UUR) return json({ fout: "Te veel inzendingen. Probeer het over een uur opnieuw." }, 429, origin);

  const kans = kansVoor(e.god, e.stand, e.helden.length, e.klokken, e.modus === "lang" ? "lang" : "gewoon");
  const punten = puntenVoor(kans, e.uitslag === "nipt");
  try {
    await env.DB.prepare("INSERT INTO scores (ingestuurd, datum, naam, god, stand, helden, klokken, ronde, uitslag, kans, punten, sleutel, bron) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(new Date().toISOString(), datum, naam, e.god, e.stand, JSON.stringify(e.helden), JSON.stringify(e.klokken), ronde, e.uitslag, +kans.toFixed(4), punten, sleutel, bron).run();
  } catch (err) {
    if (/UNIQUE/.test(String(err))) return fout("Dit potje staat al op het scorebord.");
    throw err;
  }
  const { plaats } = await env.DB.prepare("SELECT COUNT(*) + 1 AS plaats FROM scores WHERE punten > ?").bind(punten).first();
  return json({ ok: true, punten, kans: +kans.toFixed(4), plaats }, 201, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: kop(origin) });
    try {
      if (url.pathname === "/scores" && request.method === "GET") {
        const limiet = Math.max(1, Math.min(100, parseInt(url.searchParams.get("limiet") || "50", 10) || 50));
        return json({ scores: await lijst(env, limiet) }, 200, origin);
      }
      if (url.pathname === "/scores" && request.method === "POST") return await instuur(request, env, origin);
      if (url.pathname === "/") return json({ naam: "Scorebord van Londen 1888", scores: "/scores" }, 200, origin);
      return json({ fout: "Niet gevonden." }, 404, origin);
    } catch (err) {
      return json({ fout: "Er ging iets mis op de server." }, 500, origin);
    }
  }
};
