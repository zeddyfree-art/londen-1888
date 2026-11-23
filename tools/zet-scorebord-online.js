// Zet de Worker van het gedeelde scorebord online (cloud/scorebord/worker.js).
// Vult het klokkenmodel in uit data/klokken.json, data/oude-goden.json en data/helden.json,
// en uploadt de Worker met de D1-database als binding DB.
//
// Gebruik: node tools/zet-scorebord-online.js
// Vereist een Cloudflare API-token met "Workers Scripts: Edit". In de cloudomgeving voegt de
// netwerkproxy dat token toe; elders zet je CLOUDFLARE_API_TOKEN.
// Draai dit opnieuw als data/klokken.json verandert, anders rekent de server met het oude model.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const ACCOUNT = "029f77b6947099ed4baeac15a3ff8667";
const NAAM = "londen1888-scorebord";
const DATABASE = "67cca7e1-168e-4217-af32-b539495fb9d4";
const lees = f => JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));

(async () => {
  const k = lees("data/klokken.json");
  const model = { basis: k.basis, basisLang: k.basisLang, plafond: k.plafond, klokken: k.klokken.map(x => ({ id: x.id, zwaarte: x.zwaarte })), standen: ["ontspannen", "normaal", "genadeloos"], helden: lees("data/helden.json").map(h => h.id) };
  for (const g of lees("data/oude-goden.json")) if (!model.basis[g.id]) throw new Error(`Geen basis voor ${g.id} in data/klokken.json`);
  const code = fs.readFileSync(path.join(root, "cloud/scorebord/worker.js"), "utf8").replace("/*MODEL*/ null", JSON.stringify(model));

  const kop = process.env.CLOUDFLARE_API_TOKEN ? { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` } : {};
  const api = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers`;
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify({ main_module: "worker.js", compatibility_date: "2025-01-01", bindings: [{ type: "d1", name: "DB", id: DATABASE }] })], { type: "application/json" }));
  form.append("worker.js", new Blob([code], { type: "application/javascript+module" }), "worker.js");
  const r = await fetch(`${api}/scripts/${NAAM}`, { method: "PUT", headers: kop, body: form });
  const d = await r.json();
  if (!d.success) { console.error("Uploaden mislukt:", JSON.stringify(d.errors)); process.exit(1); }
  const s = await fetch(`${api}/scripts/${NAAM}/subdomain`, { method: "POST", headers: { ...kop, "Content-Type": "application/json" }, body: JSON.stringify({ enabled: true, previews_enabled: false }) }).then(r => r.json());
  if (!s.success) { console.error("workers.dev aanzetten mislukt:", JSON.stringify(s.errors)); process.exit(1); }
  const sub = (await fetch(`${api}/subdomain`, { headers: kop }).then(r => r.json())).result.subdomain;
  console.log(`Online: https://${NAAM}.${sub}.workers.dev/scores`);
})();
