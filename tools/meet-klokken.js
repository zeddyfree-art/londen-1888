// Meet de Klokken van Westminster en fit het kansmodel dat het spel en het gedeelde scorebord gebruiken.
//
// De testspeler speelt potjes met willekeurige instellingen: god, stand, 2 of 4 helden, gewoon of De Lange
// Nacht, en een willekeurige set klokken (van geen tot alle dertien). Daarop wordt één model gefit:
//
//   logit(winkans) = basis[speelduur][god][stand][helden] − A[stand] · (1 − e^(−T / A[stand]))
//   T = som van de zwaarte van de gekozen klokken in die stand (elke klok ≥ 0)
//
// Elke klok heeft dus per stand een eigen zwaarte, en A zorgt dat klokken samen minder hard optellen
// dan los (een potje dat al bijna onwinbaar is, wordt door nog een klok niet veel onwinbaarder).
// Het model wordt gefit op 80% van de potjes en gecontroleerd op de andere 20%.
//
// Gebruik: node tools/bouw.js && node tools/meet-klokken.js [aantal potjes, standaard 40000]
// Schrijft data/klokken.json en ontwerp/klokkenmodel.md. Zet daarna het scorebord online:
//   NODE_USE_ENV_PROXY=1 node tools/zet-scorebord-online.js
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const root = path.join(__dirname, "..");
const site = path.join(root, "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".md": "text/markdown", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(site, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
  if (!p.startsWith(site) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
const GODEN = JSON.parse(fs.readFileSync(path.join(root, "data", "oude-goden.json"), "utf8")).map(g => g.id);
const STANDEN = ["ontspannen", "normaal", "genadeloos"], MODI = ["gewoon", "lang"], AANTALLEN = [2, 4];
/* Geen genade doet niets op Genadeloos: die stand heeft al geen laatste nacht */
const telt = (id, stand) => !(id === "geen-genade" && stand === "genadeloos");
const sig = x => 1 / (1 + Math.exp(-x)), softplus = x => x > 30 ? x : Math.log1p(Math.exp(x));

/* ---------- het model (dezelfde formule als schatKans in app/spel.js en kansVoor in de Worker) ---------- */
function voorspel(m, g) {
  const b = m.basis[g.modus][g.god][g.stand][g.aantal];
  let T = 0; for (const id of g.klokken) if (telt(id, g.stand)) T += m.zwaarte[id][g.stand];
  const A = m.plafond[g.stand];
  return sig(Math.log(b / (1 - b)) - A * (1 - Math.exp(-T / A)));
}

/* ---------- fitten: gradiënt-afdaling (Adam) op de log-likelihood ---------- */
function fit(potjes, KLOK) {
  const cel = g => `${g.modus}|${g.god}|${g.stand}|${g.aantal}`;
  const P = {}; /* ruwe parameters */
  for (const mo of MODI) for (const god of GODEN) for (const st of STANDEN) for (const n of AANTALLEN) P[`b|${mo}|${god}|${st}|${n}`] = 1;
  for (const id of KLOK) for (const st of STANDEN) P[`z|${id}|${st}`] = 0;   /* zwaarte = softplus(z) */
  for (const st of STANDEN) P[`a|${st}`] = 1.5;                               /* plafond = 0.5 + softplus(a) */
  const sleutels = Object.keys(P), m1 = {}, m2 = {}; for (const k of sleutels) { m1[k] = 0; m2[k] = 0; }
  const RIDGE_B = 0.02, RIDGE_Z = 0.01; /* lichte trek naar het midden, tegen uitschieters bij weinig potjes */
  for (let it = 1; it <= 1500; it++) {
    const gr = {}; for (const k of sleutels) gr[k] = 0;
    for (const g of potjes) {
      const bk = `b|${cel(g)}`, ak = `a|${g.stand}`;
      const A = 0.5 + softplus(P[ak]);
      const kl = g.klokken.filter(id => telt(id, g.stand));
      let T = 0; const zs = kl.map(id => { const z = P[`z|${id}|${g.stand}`]; T += softplus(z); return z; });
      const e = Math.exp(-T / A), straf = A * (1 - e);
      const p = sig(P[bk] - straf), r = g.w - p;      /* d logL / d logit */
      gr[bk] += r;
      /* d straf / d T = e ; d straf / d A = 1 − e − (T/A)·e */
      kl.forEach((id, i) => { gr[`z|${id}|${g.stand}`] += -r * e * sig(zs[i]); });
      gr[ak] += -r * (1 - e - (T / A) * e) * sig(P[ak]);
    }
    for (const k of sleutels) {
      const c = k[0] === "b" ? RIDGE_B * (P[k] - 1) : k[0] === "z" ? RIDGE_Z * P[k] : 0;
      const g = gr[k] / potjes.length * 100 - c;
      m1[k] = 0.9 * m1[k] + 0.1 * g; m2[k] = 0.999 * m2[k] + 0.001 * g * g;
      P[k] += 0.05 * (m1[k] / (1 - 0.9 ** it)) / (Math.sqrt(m2[k] / (1 - 0.999 ** it)) + 1e-8);
    }
  }
  const m = { basis: {}, zwaarte: {}, plafond: {} };
  for (const mo of MODI) for (const god of GODEN) for (const st of STANDEN) for (const n of AANTALLEN)
    (((m.basis[mo] ??= {})[god] ??= {})[st] ??= {})[n] = +sig(P[`b|${mo}|${god}|${st}|${n}`]).toFixed(3);
  for (const id of KLOK) for (const st of STANDEN) (m.zwaarte[id] ??= {})[st] = telt(id, st) ? +softplus(P[`z|${id}|${st}`]).toFixed(3) : 0;
  for (const st of STANDEN) m.plafond[st] = +(0.5 + softplus(P[`a|${st}`])).toFixed(3);
  return m;
}
/* het oude model: per klok één vaste logit (gemeten op normaal), opgeteld */
function oudVoorspel(oud, g) {
  const basis = g.modus === "lang" && oud.basisLang ? oud.basisLang : oud.basis;
  const b = basis[g.god][g.stand][g.aantal]; let l = Math.log(b / (1 - b));
  for (const id of g.klokken) if (!(id === "geen-genade" && g.stand === "genadeloos")) l += Math.min(0, oud.klokken.find(k => k.id === id)?.logit || 0);
  return sig(l);
}
const logLoss = (ps, potjes) => -potjes.reduce((s, g, i) => s + Math.log(Math.max(1e-6, g.w ? ps[i] : 1 - ps[i])), 0) / potjes.length;

(async () => {
  const N = +(process.argv[2] || 40000), PAGINAS = 4;
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch();
  const KLOK = await (async () => { const p = await browser.newPage(); await p.goto(`http://localhost:${server.address().port}/index.html`); await p.waitForFunction(() => window.__spel && window.__spel.D); const k = await p.evaluate(() => window.__spel.KLOKKEN.map(k => k.id)); await p.close(); return k; })();

  /* willekeurige instellingen; een kwart zonder klokken, de rest met 1 tot 13 klokken */
  const kies = a => a[Math.floor(Math.random() * a.length)];
  const opdrachten = Array.from({ length: N }, () => {
    const k = Math.random() < 0.25 ? 0 : 1 + Math.floor(Math.random() * KLOK.length);
    return { god: kies(GODEN), stand: kies(STANDEN), aantal: kies(AANTALLEN), modus: Math.random() < 0.7 ? "gewoon" : "lang", klokken: KLOK.slice().sort(() => Math.random() - 0.5).slice(0, k) };
  });
  const potjes = []; let fouten = 0, klaar = 0; const t0 = Date.now();
  await Promise.all(Array.from({ length: PAGINAS }, async (_, p) => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${server.address().port}/index.html`);
    await page.waitForFunction(() => window.__spel && window.__spel.D);
    await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, "testbot-strategie.js"), "utf8") });
    const mijn = opdrachten.filter((_, i) => i % PAGINAS === p);
    for (let i = 0; i < mijn.length; i += 200) {
      const blok = mijn.slice(i, i + 200);
      const uit = await page.evaluate(async blok => {
        const helden = window.__spel.D.helden.map(h => h.id), out = [];
        for (const o of blok) {
          window.__klokken = o.klokken; window.__modus = o.modus;
          const gekozen = helden.slice().sort(() => Math.random() - 0.5).slice(0, o.aantal);
          try { const u = await window.__testbot(o.god, o.stand, gekozen); out.push(u.einde ? (u.einde === "winst" || u.einde === "nipt" ? 1 : 0) : null); } catch (e) { out.push(null); }
        }
        window.__klokken = []; window.__modus = "gewoon";
        return out;
      }, blok);
      blok.forEach((o, j) => { if (uit[j] == null) fouten++; else potjes.push({ ...o, w: uit[j] }); });
      klaar += blok.length;
      if (p === 0) process.stdout.write(`\r${klaar} van ${N} potjes (${Math.round((Date.now() - t0) / 1000)} s)   `);
    }
  }));
  await browser.close(); server.close();
  console.log(`\n${potjes.length} potjes gespeeld, ${fouten} niet afgemaakt`);

  /* fit op 80%, controleer op 20% */
  const schud = potjes.slice().sort(() => Math.random() - 0.5), grens = Math.floor(schud.length * 0.8);
  const train = schud.slice(0, grens), test = schud.slice(grens);
  const proef = fit(train, KLOK);
  const oudBestand = path.join(root, "data", "klokken.json");
  const oud = JSON.parse(fs.readFileSync(oudBestand, "utf8"));
  const pNieuw = test.map(g => voorspel(proef, g)), pOud = oud.versie >= 2 ? null : test.map(g => oudVoorspel(oud, g));
  const regels = [];
  const r = s => { console.log(s); regels.push(s); };
  r(`# Klokkenmodel`, ""); regels.push("");
  r(`Gemeten op ${new Date().toISOString().slice(0, 10)} met \`node tools/meet-klokken.js ${N}\`: ${potjes.length} potjes van de testspeler met willekeurige god, stand, aantal helden, speelduur en klokken.`); regels.push("");
  r(`## Controle op ${test.length} potjes die niet voor het fitten zijn gebruikt`); regels.push("");
  r(`Log-loss (lager is beter): nieuw model ${logLoss(pNieuw, test).toFixed(3)}${pOud ? `, oud model ${logLoss(pOud, test).toFixed(3)}` : ""}.`); regels.push("");
  r(`| Klokken | Potjes | Gemeten | Nieuw model |${pOud ? " Oud model |" : ""}`); r(`|---|---|---|---|${pOud ? "---|" : ""}`);
  for (const [van, tot] of [[0, 0], [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 13]]) {
    const idx = test.map((g, i) => [g, i]).filter(([g]) => g.klokken.length >= van && g.klokken.length <= tot).map(([, i]) => i);
    if (!idx.length) continue;
    const pct = a => Math.round(100 * idx.reduce((s, i) => s + a[i], 0) / idx.length) + "%";
    r(`| ${van === tot ? van : `${van} tot ${tot}`} | ${idx.length} | ${pct(test.map(g => g.w))} | ${pct(pNieuw)} |${pOud ? ` ${pct(pOud)} |` : ""}`);
  }
  regels.push("");
  r(`Per voorspelde kans (ijking):`); regels.push("");
  r(`| Model zegt | Potjes | Gemeten |`); r(`|---|---|---|`);
  for (let b = 0; b < 10; b++) {
    const idx = pNieuw.map((p, i) => [p, i]).filter(([p]) => p >= b / 10 && p < (b + 1) / 10 + (b === 9 ? 1e-9 : 0)).map(([, i]) => i);
    if (idx.length) r(`| ${b * 10} tot ${(b + 1) * 10}% | ${idx.length} | ${Math.round(100 * idx.reduce((s, i) => s + test[i].w, 0) / idx.length)}% |`);
  }
  regels.push("");

  /* definitief model: fit op alle potjes */
  const m = fit(potjes, KLOK);
  r(`## Zwaarte per klok (in logit; hoger is zwaarder)`); regels.push("");
  r(`| Klok | Ontspannen | Normaal | Genadeloos |`); r(`|---|---|---|---|`);
  for (const id of KLOK) r(`| ${id} | ${STANDEN.map(st => m.zwaarte[id][st].toFixed(2)).join(" | ")} |`);
  regels.push(""); r(`Plafond (hoeveel logit alle klokken samen hoogstens kosten): ${STANDEN.map(st => `${st} ${m.plafond[st].toFixed(2)}`).join(", ")}.`);
  const uit = { versie: 2, datum: new Date().toISOString().slice(0, 10), potjes: potjes.length,
    formule: "logit(kans) = logit(basis[speelduur][god][stand][helden]) - plafond[stand] * (1 - exp(-T / plafond[stand])), T = som van zwaarte[klok][stand]",
    basis: m.basis.gewoon, basisLang: m.basis.lang, plafond: m.plafond, klokken: KLOK.map(id => ({ id, zwaarte: m.zwaarte[id] })) };
  fs.writeFileSync(oudBestand, JSON.stringify(uit, null, 2) + "\n");
  fs.writeFileSync(path.join(root, "ontwerp", "klokkenmodel.md"), regels.join("\n") + "\n");
  console.log("geschreven: data/klokken.json en ontwerp/klokkenmodel.md");
})();
