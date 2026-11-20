/* Londen 1888 — speelbare versie. Alle spelregels staan in ontwerp/spelregels.md. */
(() => {
"use strict";

const OPSLAG = "londen1888-spel-v1";
const KLEUREN = ["#b5552f", "#2d6e9e", "#7a8f2a", "#8a4fa3"];
const KENMERKEN = [["kennis", "Kennis"], ["scherpte", "Waarneming"], ["kracht", "Kracht"], ["overtuiging", "Charisma"]];
const KUITLEG = { kennis: "Boeken, oude talen, spreuken en gruwel doorstaan", scherpte: "Zoeken, opmerken en sporen volgen", kracht: "Vechten, klimmen en volhouden", overtuiging: "Praten, onderhandelen en indruk maken" };
const RUSTIG = (() => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { return false; } })();
const KNAAM = Object.fromEntries(KENMERKEN);
const STARTWAPENS = { "Bamboestok": 1, "Wandelstok met verborgen lemmet": 1, "Revolver": 2, "Damespistool": 1, "Dienstgeweer": 2, "Bijl van de opgraving": 1, "Gietijzeren pollepel": 1, "Wapenstok": 1, "Derringer in haar mof": 1 };
const DIENSTLABEL = { sterrenwacht: "Sterrenwacht", seance: "Seance bijwonen", station: "Trein nemen", bibliotheek: "Studeren", "occulte-boekwinkel": "Spreuken kopen", salon: "Salon bezoeken", markt: "Winkelen", theater: "Optreden", club: "Gerucht kopen", universiteit: "Laten onderzoeken", ziekenhuis: "Ziekenhuis", gaarkeuken: "Gaarkeuken", logementen: "Geruchten horen", politie: "Politie", kerk: "Abdij bezoeken", kunstenaars: "Laten schilderen", haven: "Op expeditie", rivierpolitie: "Roeiboot lenen" };
const STATIONS = ["marylebone", "kings-cross", "city", "westminster"];
const MOEILIJKHEID = {
  ontspannen: { naam: "Ontspannen", mist: 0, nodig: 2, scheuren: 2, test: 0 },
  normaal: { naam: "Normaal", mist: -2, nodig: 3, scheuren: 2, test: 0, finale: 1 },
  genadeloos: { naam: "Genadeloos", mist: -2, nodig: 3, scheuren: 3, test: 1 }
};

let D = null;      // speldata
let S = null;      // spelstand
let UI = { legendaOpen: (() => { try { return localStorage.getItem("londen1888-legenda") === "open"; } catch { return false; } })(), undo: [], bekeken: 0, aanpassen: false, start: { god: null, moeilijkheid: "ontspannen", aantal: 2, helden: [] } };
const app = document.getElementById("app");

/* ---------- hulpjes ---------- */
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
let rng = Math.random;
function zaai(seed) { let t = seed >>> 0; rng = () => { t += 0x6D2B79F5; let r = Math.imul(t ^ t >>> 15, 1 | t); r ^= r + Math.imul(r ^ r >>> 7, 61 | r); return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
const d6 = () => 1 + Math.floor(rng() * 6);
const kies1 = a => a[Math.floor(rng() * a.length)];
const schud = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const byId = (lijst, id) => lijst.find(x => x.id === id);
const plekDef = id => byId(D.bord.plekken, id) || byId(D.bord.overzee, id);
const plekNaam = id => plekDef(id)?.naam || id;
const isOverzee = id => !!byId(D.bord.overzee, id);
const heldDef = h => byId(D.helden, h.id);
const monsterDef = id => byId(D.monsters, id) || byId(D.epische, id);
const spulDef = id => byId(D.spullen, id);
const spreukDef = id => byId(D.spreuken, id);
const artDef = id => byId(D.artefacten, id);
const toestDef = id => byId(D.toestanden, id);
const god = () => byId(D.goden, S.god);
const heeft = (h, t) => h.toestanden.includes(t);
const actief = () => S.helden[S.actief];
const korteNaam = n => n.replace(/^(Professor|Dr\.|Madame|Lady|Sergeant|Detective Sergeant|Miss|Broeder|Constable)\s+/, "").replace(/"[^"]*"\s*/, "");
const initialen = n => korteNaam(n).split(" ").map(w => w[0]).slice(0, 2).join("");
const log = t => { S.log.unshift(`R${S.ronde}: ${t}`); S.log = S.log.slice(0, 80); };
function opslaan() { if (window.__bot) return; try { localStorage.setItem(OPSLAG, JSON.stringify(S)); } catch {} }
function laden() { try { return JSON.parse(localStorage.getItem(OPSLAG)); } catch { return null; } }
function wis() { try { localStorage.removeItem(OPSLAG); } catch {} }

/* afbeeldingen: gebruik art/... als het bestand bestaat, anders een tint met initialen */
const artCache = {};
function art(pad) {
  if (pad in artCache) return artCache[pad];
  artCache[pad] = null;
  const img = new Image();
  img.onload = () => { artCache[pad] = pad; teken(); };
  img.src = pad;
  return null;
}

/* ---------- geluid (zelf opgewekt, geen bestanden) ---------- */
const Geluid = (() => {
  let ctx = null, aan = true;
  try { aan = localStorage.getItem("londen1888-geluid") !== "uit"; } catch {}
  const c = () => { if (!aan || window.__bot) return null; try { ctx ??= new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); return ctx; } catch { return null; } };
  const toon = (f, t0, dur, type = "sine", vol = .15, f2) => {
    const a = c(); if (!a) return; const t = a.currentTime + t0;
    const o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + .05);
  };
  const ruis = (t0, dur, freq, vol = .2, q = 1, freq2) => {
    const a = c(); if (!a) return; const t = a.currentTime + t0;
    const n = Math.max(1, Math.floor(a.sampleRate * dur)), buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = a.createBufferSource(); src.buffer = buf;
    const f = a.createBiquadFilter(); f.type = "bandpass"; f.Q.value = q; f.frequency.setValueAtTime(freq, t); if (freq2) f.frequency.exponentialRampToValueAtTime(freq2, t + dur);
    const g = a.createGain(); g.gain.value = vol; src.connect(f).connect(g).connect(a.destination); src.start(t);
  };
  return {
    get aan() { return aan; },
    wissel() { aan = !aan; try { localStorage.setItem("londen1888-geluid", aan ? "aan" : "uit"); } catch {} },
    reis() { for (let i = 0; i < 5; i++) { ruis(i * .16, .06, 900, .4, 5); ruis(i * .16 + .07, .05, 650, .3, 5); } },
    kaart() { ruis(0, .4, 300, .25, .8, 2600); },
    dobbel() { for (let i = 0; i < 8; i++) ruis(i * .07 + Math.random() * .03, .03, 2400 + Math.random() * 1600, .35, 6); },
    goed() { toon(523, 0, .3, "triangle", .12); toon(784, .13, .5, "triangle", .12); },
    slecht() { toon(233, 0, .5, "sawtooth", .045, 150); },
    monster() { toon(70, 0, 1.2, "sawtooth", .05, 46); ruis(0, 1.1, 180, .14, 1); },
    onheil() { toon(98, 0, 2.2, "sine", .22); toon(146, .03, 1.8, "sine", .09); },
    klik() { ruis(0, .03, 1800, .2, 3); }
  };
})();

/* ---------- buren en afstanden ---------- */
let BUREN = {};
function maakBuren() {
  BUREN = Object.fromEntries(D.bord.plekken.map(p => [p.id, new Set()]));
  for (const [a, b] of D.bord.routes) { BUREN[a].add(b); BUREN[b].add(a); }
}
function burenVan(h, plek) {
  if (isOverzee(plek)) return ["st-katharine-docks"];
  const n = new Set(BUREN[plek]);
  if (h && h.id === "paddy-flynn" && D.bord.rivier.includes(plek)) for (const r of D.bord.rivier) if (r !== plek) n.add(r);
  return [...n];
}
function afstanden(van) {
  const dist = { [van]: 0 }, q = [van];
  while (q.length) { const p = q.shift(); for (const n of BUREN[p] || []) if (!(n in dist)) { dist[n] = dist[p] + 1; q.push(n); } }
  return dist;
}
function stapNaar(van, doel) {
  const dist = afstanden(doel);
  return [...(BUREN[van] || [])].sort((a, b) => (dist[a] ?? 99) - (dist[b] ?? 99))[0] || van;
}

/* ---------- modaal venster ---------- */
let modalResolve = null;
function venster({ soort = "", titel = "", beeld = null, zij = false, verhaal = "", html = "", breed = false, achterkant = null, animeer = null, geluid = null, knoppen = [{ label: "Verder", waarde: true }] }) {
  if (knoppen.length && knoppen.every(k => k.uit)) knoppen = [...knoppen, { label: "Verder", waarde: null, ghost: true }];
  if (window.__bot) return Promise.resolve(window.__bot.kies({ soort, titel, knoppen: knoppen.filter(k => !k.uit) }));
  return new Promise(res => {
    const m = document.getElementById("modal");
    const img = beeld ? art(beeld) : null;
    const rug = achterkant && !RUSTIG ? art(`art/achterkanten/${achterkant}.jpg`) : null;
    const toon = () => {
      m.innerHTML = `<div class="venster${breed ? " breed" : ""}${zij && img ? " zij" : ""}${rug ? " draai-in" : " kom-op"}" role="dialog" aria-modal="true" aria-label="${esc(titel)}">
        ${img ? `<img class="beeld" src="${esc(img)}" alt="">` : ""}
        <div class="inhoud">
          ${soort ? `<span class="soort">${esc(soort)}</span>` : ""}
          ${titel ? `<h2>${esc(titel)}</h2>` : ""}
          ${verhaal ? `<p class="verhaal">${esc(verhaal)}</p>` : ""}
          ${html}
          <div class="knoppen">${knoppen.map((k, i) => k.verberg ? "" : `<button class="btn${k.ghost ? " ghost" : ""}" data-knop="${i}" ${k.uit ? "disabled" : ""}>${esc(k.label)}</button>`).join("")}</div>
        </div></div>`;
      if (geluid) Geluid[geluid]?.();
      if (animeer) animeer(m);
      m.querySelector(".knoppen [data-knop]:not([disabled])")?.focus();
    };
    m.hidden = false;
    m.onclick = e => {
      const b = e.target.closest("[data-knop]"); if (!b || b.disabled || m.querySelector("[data-wacht]")) return;
      m.hidden = true; m.innerHTML = "";
      res(knoppen[+b.dataset.knop].waarde);
    };
    if (rug) { m.innerHTML = `<div class="kaartrug" aria-hidden="true"><img src="${esc(rug)}" alt=""></div>`; Geluid.kaart(); setTimeout(toon, 700); }
    else toon();
  });
}
const melding = (titel, tekst, soort = "") => venster({ soort, titel, html: `<p>${esc(tekst)}</p>` });

/* ---------- tests ---------- */
function bonusVoor(h, kenmerk, ctx) {
  let b = 0;
  const heb = id => h.spullen.includes(id);
  for (const id of h.spullen) { const s = spulDef(id); if (s?.bonus?.[kenmerk]) b += s.bonus[kenmerk]; if (isOverzee(h.plek) && s?.bonus?.overzee) b += s.bonus.overzee; }
  if (ctx === "ontmoeting" && kenmerk === "scherpte") b += (heb("stormlantaarn") ? 1 : 0) + (heb("dier-kat") ? 1 : 0);
  if (ctx === "ontmoeting") for (const id of h.spullen) b += spulDef(id)?.bonusOntmoeting?.[kenmerk] || 0;
  if (ctx === "ontmoeting" && kenmerk === "kracht" && heb("breekijzer")) b += 1;
  if (h.plek === "thebe" && heb("boek-egyptisch")) b += 2;
  if (isOverzee(h.plek) && kenmerk === "kracht" && heb("dier-paard")) b += 1;
  if (kenmerk === "kennis" && h.artefacten.includes("kristallen-schedel")) b += 2;
  if (kenmerk === "overtuiging" && h.artefacten.includes("jade-masker")) b += 2;
  return b;
}
function wapenBonus(h, mens) {
  const w = [...h.eigen.map(e => e.gevecht || 0), ...h.spullen.map(id => spulDef(id)?.bonus?.gevecht || 0)].sort((a, b) => b - a);
  let b = (w[0] || 0) + (w[1] || 0);
  if (mens) for (const id of h.spullen) b += spulDef(id)?.bonus?.gevechtMens || 0;
  return b;
}
function dobbelHtml(stenen, gehouden, extraBonus, doel, totaal) {
  return `<div class="dobbels">${stenen.map((v, i) => `<span class="dobbel${gehouden.includes(i) ? "" : " uit"}" data-waarde="${v}">${v}</span>`).join("")}
    <span class="som ${totaal >= doel ? "ok" : "nee"}">+ ${extraBonus} = <b>${totaal}</b> (nodig ${doel})${totaal >= doel ? " · gelukt" : " · mislukt"}</span></div>`;
}
function rolDobbels(m) {
  const stenen = [...m.querySelectorAll(".dobbel")], som = m.querySelector(".som"), doos = m.querySelector(".dobbels");
  const klaar = () => som && (som.classList.contains("ok") ? Geluid.goed() : Geluid.slecht());
  if (RUSTIG || !stenen.length) return klaar();
  doos.setAttribute("data-wacht", ""); som.classList.add("verborgen"); stenen.forEach(x => x.classList.add("rolt"));
  m.querySelectorAll(".knoppen .btn").forEach(b => b.classList.add("wacht"));
  Geluid.dobbel();
  let n = 0;
  const t = setInterval(() => {
    stenen.forEach(x => { x.textContent = 1 + Math.floor(Math.random() * 6); });
    if (++n > 11) {
      clearInterval(t);
      stenen.forEach(x => { x.textContent = x.dataset.waarde; x.classList.remove("rolt"); });
      doos.removeAttribute("data-wacht"); som.classList.remove("verborgen");
      m.querySelectorAll(".knoppen .btn").forEach(b => b.classList.remove("wacht"));
      klaar();
    }
  }, 70);
}
async function test(h, kenmerk, doel, titel, opt = {}) {
  const hd = heldDef(h);
  doel += MOEILIJKHEID[S.moeilijkheid].test;
  let extra = opt.extra || 0;
  if (kenmerk === "kennis" && h.id === "septimus-crane") extra += Math.min(2, h.aanw);
  if (heeft(h, "waanzin-stemmen") && opt.spreuk) extra += 1;
  if (S.tutorial) await coach("test");
  let kw = h.kenm[kenmerk] + bonusVoor(h, kenmerk, opt.context) + (opt.bonus || 0);
  if (opt.spreuk) for (const id of h.spullen) kw += spulDef(id)?.bonus?.spreuk || 0;
  const kat = h.spullen.includes("dier-kat");
  const gooi = () => { let v = d6(); if (heeft(h, "vervloekt") && !kat && v === 6) v = 1; return v; };
  let stenen = Array.from({ length: 2 + extra }, gooi);
  const reken = () => {
    const idx = stenen.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 2).map(x => x[1]);
    return { idx, totaal: idx.reduce((s, i) => s + stenen[i], 0) + kw };
  };
  const laagste = () => stenen.indexOf(Math.min(...stenen));
  while (true) {
    const { idx, totaal } = reken();
    const gelukt = totaal >= doel;
    const knoppen = [{ label: gelukt ? "Gelukt, verder" : "Accepteren", waarde: "ok" }];
    if (!gelukt) {
      const winnie = S.helden.find(x => x.id === "winnie-lusk" && x.plek === h.plek && !S.rondeGebruikt["kruisverwijzing"]);
      if (h.aanw > 0 && (kenmerk === "kennis" || kenmerk === "scherpte" || h.id === "silas-rook")) knoppen.push({ label: "Aanwijzing uitgeven: opnieuw", waarde: "aanw", ghost: true });
      if (heeft(h, "gezegend") && !kat && !h.ronde.gezegend) knoppen.push({ label: "Gezegend: opnieuw", waarde: "zegen", ghost: true });
      if (h.id === "hu-yiping" && kenmerk === "kracht" && !h.ronde.adem) knoppen.push({ label: "Ademdiscipline: opnieuw", waarde: "adem", ghost: true });
      if (winnie) knoppen.push({ label: "Kruisverwijzing (Winnie): opnieuw", waarde: "winnie", ghost: true });
      if (kenmerk === "kracht" && opt.context === "ontmoeting" && h.spullen.includes("ossenzweep") && !h.ronde.zweep) knoppen.push({ label: "Ossenzweep: opnieuw", waarde: "zweep", ghost: true });
      for (const id of h.spullen) { const sd = spulDef(id); if (sd?.herworp === kenmerk && !h.ronde["hw-" + id]) knoppen.push({ label: `${sd.naam}: opnieuw`, waarde: "hw-" + id, ghost: true }); }
      if (isOverzee(h.plek) && h.spullen.includes("boek-reisverslag")) knoppen.push({ label: "Reisverslag: +2", waarde: "reis", ghost: true });
    }
    const keuze = await venster({ soort: `Test · ${KNAAM[kenmerk] || kenmerk}`, titel, html: `<p class="muted">${esc(korteNaam(hd.naam))} gooit ${stenen.length} dobbelstenen en telt de twee hoogste, plus ${kw}.</p>` + dobbelHtml(stenen, idx, kw, doel, totaal), knoppen, animeer: rolDobbels });
    if (keuze === "ok") return gelukt;
    const i = laagste();
    if (keuze === "aanw") h.aanw--;
    if (keuze === "zegen") h.ronde.gezegend = true;
    if (keuze === "adem") h.ronde.adem = true;
    if (keuze === "winnie") S.rondeGebruikt["kruisverwijzing"] = true;
    if (keuze === "zweep") h.ronde.zweep = true;
    if (String(keuze).startsWith("hw-")) h.ronde[keuze] = true;
    if (keuze === "reis") { kw += 2; h.spullen = h.spullen.filter(x => x !== "boek-reisverslag"); h.aanw++; log(`${korteNaam(hd.naam)} raadpleegt het reisverslag`); continue; }
    stenen[i] = gooi();
  }
}

/* ---------- schade en toestanden ---------- */
function verliesLichaam(h, n) {
  if (n <= 0) return 0;
  if (h.ronde.pop) { log(`De sympathiepop vangt de klap op voor ${korteNaam(heldDef(h).naam)}`); return 0; }
  const paddy = S.helden.find(x => x.id === "paddy-flynn" && x.plek === h.plek && !x.ronde.admiraal);
  if (paddy) { paddy.ronde.admiraal = true; n--; log("Admiraal vangt 1 Lichaam op"); }
  h.L -= n; return n;
}
function geefToestand(h, id) {
  if (id === "gezegend") h.toestanden = h.toestanden.filter(t => t !== "vervloekt");
  if (id === "vervloekt") h.toestanden = h.toestanden.filter(t => t !== "gezegend");
  if (id === "gezocht" && h.spullen.includes("bondgenoot-agent")) { h.spullen = h.spullen.filter(x => x !== "bondgenoot-agent"); log("De agent op ronde vertrekt"); }
  if (!heeft(h, id)) h.toestanden.push(id);
}

/* ---------- effecten ---------- */
function trekUit(soort) {
  if (soort === "artefacten") {
    const vrij = D.artefacten.map(a => a.id).filter(id => !S.helden.some(h => h.artefacten.includes(id)));
    return vrij.length ? kies1(vrij) : null;
  }
  if (soort === "spreuken") {
    const vrij = D.spreuken.map(s => s.id).filter(id => !S.helden.some(h => h.spreuken.includes(id)));
    return vrij.length ? kies1(vrij) : null;
  }
  const basis = soort === "bondgenoot" ? (s => s.soort === "Bondgenoot") : soort === "dier" ? (s => s.soort === "Dier") : (() => true);
  const filter = s => !s.persoonlijk && basis(s);
  const vrij = D.spullen.filter(filter).map(s => s.id).filter(id => !S.helden.some(h => h.spullen.includes(id)));
  return vrij.length ? kies1(vrij) : null;
}
async function geefArtefact(h) {
  let id = trekUit("artefacten");
  if (!id) return "geen artefacten meer";
  if (h.id === "cornelius-bray") {
    const ander = D.artefacten.map(a => a.id).filter(x => x !== id && !S.helden.some(k => k.artefacten.includes(x)));
    if (ander.length) {
      const tweede = kies1(ander);
      id = await venster({ soort: "Opgraving", titel: "Kies één artefact", html: [id, tweede].map(x => `<p><b>${esc(artDef(x).naam)}.</b> ${esc(artDef(x).tekst)}</p>`).join(""), knoppen: [id, tweede].map(x => ({ label: artDef(x).naam, waarde: x })) });
    }
  }
  h.artefacten.push(id);
  return artDef(id).naam;
}
async function pasToe(h, effecten) {
  const regels = [];
  for (const e of effecten) {
    let [k, v] = Object.entries(e)[0];
    if (k === "pond") { h.pond = Math.max(0, h.pond + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Pond`]); }
    else if (k === "lichaam") { if (v < 0) v = -verliesLichaam(h, -v); else h.L = Math.min(h.maxL, h.L + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Lichaam`]); }
    else if (k === "geest") { h.G = Math.min(h.maxG, h.G + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Geest`]); }
    else if (k === "aanwijzing") { if (v < 0 && h.id === "hester-quayle" && !h.ronde.panizzi) { h.ronde.panizzi = true; regels.push([1, "Mr. Panizzi houdt de Aanwijzing vast"]); continue; } h.aanw = Math.max(0, h.aanw + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Aanwijzing`]); }
    else if (k === "trofee") { h.trofee += v; regels.push([v, `+${v} Trofee`]); }
    else if (k === "mist") { S.mist += v; regels.push([v, `Mist ${v > 0 ? "+" : ""}${v}`]); }
    else if (k === "toestand") { geefToestand(h, v); regels.push([v === "gezegend" ? 1 : -1, toestDef(v).naam]); }
    else if (k === "verwijder") { h.toestanden = h.toestanden.filter(t => t !== v); regels.push([1, `${toestDef(v).naam} verwijderd`]); }
    else if (k === "waanzin") { regels.push([-1, "Waanzin: " + geefWaanzin(h)]); }
    else if (k === "monster") { const m = spawnMonster(h.plek); if (m) regels.push([-1, `${monsterDef(m).naam} verschijnt`]); }
    else if (k === "scheur") { openScheurOp(h.plek); regels.push([-1, "Er opent een Scheur"]); }
    else if (k === "reis") { h.plek = v; regels.push([0, `Naar ${plekNaam(v)}`]); }
    else if (k === "trek") {
      if (v === "artefacten") { regels.push([1, "Artefact: " + await geefArtefact(h)]); }
      else if (v === "spreuken") { const id = trekUit("spreuken"); if (id) { h.spreuken.push(id); regels.push([1, "Spreuk: " + spreukDef(id).naam]); } }
      else { const id = trekUit(v); if (id) { h.spullen.push(id); regels.push([1, spulDef(id).naam]); } }
    }
  }
  regels.forEach(([, t]) => log(`${korteNaam(heldDef(h).naam)}: ${t}`));
  return regels.length ? `<div class="effecten">${regels.map(([v, t]) => `<span class="effect ${v > 0 ? "plus" : v < 0 ? "min" : ""}">${esc(t)}</span>`).join("")}</div>` : `<p class="muted">Geen gevolgen.</p>`;
}
function geefWaanzin(h) {
  const vrij = D.toestanden.filter(t => t.soort === "Waanzin" && !heeft(h, t.id));
  if (!vrij.length) return "geen nieuwe";
  const t = kies1(vrij); h.toestanden.push(t.id); return t.naam.replace("Waanzin: ", "");
}
async function controleerHeld(h) {
  const naam = korteNaam(heldDef(h).naam);
  if (h.L <= 0 && h.artefacten.includes("scarabee")) {
    h.artefacten = h.artefacten.filter(x => x !== "scarabee"); h.L = 1;
    await melding("De scarabee breekt", "Op het moment dat je valt, wordt de scarabee warm en barst. Je blijft overeind met 1 Lichaam.");
  }
  if (h.L <= 0 && heeft(h, "gewond")) return valtAf(h, "lichaam");
  if (h.G <= 0 && h.toestanden.filter(t => t.startsWith("waanzin")).length >= 2) return valtAf(h, "geest");
  if (h.L <= 0) {
    if (S.tutorial) await coach("lichaam0");
    h.L = 2; h.plek = "city"; if (!heeft(h, "gewond")) h.toestanden.push("gewond");
    log(`${naam} raakt gewond en wordt naar Barts gebracht`);
    await melding(`${naam} is gewond`, "Je wordt bewusteloos naar het ziekenhuis in The City gebracht. Je hebt 2 Lichaam en de toestand Gewond.", "Lichaam op 0");
  }
  if (h.G <= 0) {
    if (S.tutorial) await coach("geest0");
    const w = geefWaanzin(h); h.G = Math.ceil(h.maxG / 2);
    log(`${naam} krijgt waanzin: ${w}`);
    await melding(`${naam} verliest grip`, `Je krijgt de waanzin "${w}". Je Geest gaat terug naar ${h.G}.`, "Geest op 0");
  }
  while (telBagage(h) > 6 + (h.spullen.includes("gladstonetas") ? 1 : 0)) {
    const k = await venster({ soort: "Te veel bagage", titel: `${naam} draagt te veel`, html: "<p>Je kunt maximaal 6 spullen en spreuken dragen (7 met een Gladstonetas). Wat leg je af?</p>",
      knoppen: [...h.spullen.filter(id => !spulDef(id).persoonlijk).map(id => ({ label: spulDef(id).naam, waarde: ["spullen", id] })), ...h.spreuken.map(id => ({ label: spreukDef(id).naam, waarde: ["spreuken", id], ghost: true }))] });
    const [soort, id] = k || ["spullen", h.spullen[0]];
    h[soort] = h[soort].filter(x => x !== id); log(`${naam} legt ${soort === "spullen" ? spulDef(id).naam : spreukDef(id).naam} af`);
  }
}
async function valtAf(h, oorzaak) {
  const naam = korteNaam(heldDef(h).naam), idx = S.helden.indexOf(h), plek = isOverzee(h.plek) ? "st-katharine-docks" : h.plek;
  S.plekken[plek].aanw += h.aanw;
  S.mist -= 1; S.gevallen = (S.gevallen || 0) + 1;
  (S.uitgevallen ??= []).push(h.id);
  log(`${naam} valt af. De Mist daalt met 1.`);
  const vrij = schud(D.helden.filter(x => !S.helden.some(y => y.id === x.id) && !S.uitgevallen.includes(x.id))).slice(0, 4);
  const tekst = oorzaak === "lichaam" ? `${naam} is te zwaar gewond om nog verder te gaan.` : `${naam} wordt opgenomen in een gesticht en komt niet meer terug.`;
  const nieuw = vrij.length ? await venster({ soort: "Een held valt af", titel: tekst, html: `<p>De Aanwijzingen van ${esc(naam)} blijven achter in ${esc(plekNaam(plek))}, en de Mist daalt met 1. Kies een nieuwe held. Die begint in The City.</p>`,
    knoppen: vrij.map(x => ({ label: `${x.naam} (${x.rol})`, waarde: x.id })) }) : null;
  if (nieuw) {
    const n = maakHeld(nieuw); n.plek = "city"; n.acties = 0; S.helden[idx] = n;
    log(`${korteNaam(heldDef(n).naam)} sluit zich aan in The City`);
  } else { h.L = 1; h.G = 1; }
}
async function controleerAlles() { for (const h of S.helden) await controleerHeld(h); }

/* ---------- bord: scheuren, monsters, aanwijzingen ---------- */
function trekScheurPlek() {
  if (!S.scheurStapel.length) S.scheurStapel = schud(D.bord.plekken.map(p => p.id));
  return S.scheurStapel.pop();
}
function openScheurOp(plek) {
  const p = S.plekken[plek];
  if (!p) return;
  if (p.scheur) { spawnMonster(plek); S.mist -= 1; log(`Dubbele scheur in ${plekNaam(plek)}: extra monster en de Mist daalt`); return; }
  p.scheur = true; log(`Er opent een Scheur in ${plekNaam(plek)}`);
  if (S.god === "vathrun" && D.bord.rivier.includes(plek)) spawnMonster(plek);
}
function beschermd(plek) { return S.plekken[plek]?.beschermd === S.ronde; }
function volgendMonster(plek) {
  if (!S.monsterStapel || !S.monsterStapel.length) S.monsterStapel = schud(god().monsters.flatMap(id => [id, id, id]));
  for (let i = S.monsterStapel.length - 1; i >= 0; i--) {
    const id = S.monsterStapel[i];
    if (!(monsterDef(id).alleenRivier && plek && !D.bord.rivier.includes(plek))) return i;
  }
  return S.monsterStapel.length - 1;
}
function spawnMonster(plek, voorkeur) {
  if (isOverzee(plek)) return null;
  if (beschermd(plek)) { const ander = D.bord.plekken.map(p => p.id).filter(x => !beschermd(x)); if (!ander.length) return null; plek = kies1(ander); }
  let id;
  if (voorkeur) id = voorkeur;
  else { const i = volgendMonster(plek); id = S.monsterStapel.splice(i, 1)[0]; }
  if (monsterDef(id).alleenRivier && !D.bord.rivier.includes(plek)) plek = kies1(D.bord.rivier);
  S.plekken[plek].monsters.push({ uid: ++S.teller, id, leven: monsterDef(id).leven });
  return id;
}
function spawnEpisch(plek) {
  const e = byId(D.epische, god().episch);
  if (Object.values(S.plekken).some(p => p.monsters.some(m => m.id === e.id))) return;
  S.plekken[plek].monsters.push({ uid: ++S.teller, id: e.id, leven: e.leven + (S.helden.length === 4 ? 2 : 0) });
  log(`${e.naam} verschijnt in ${plekNaam(plek)}`);
}
function legAanwijzing(n) { for (let i = 0; i < n; i++) S.plekken[kies1(D.bord.plekken).id].aanw++; }
function alleMonsters() { return Object.entries(S.plekken).flatMap(([plek, p]) => p.monsters.map(m => ({ plek, m }))); }
function verwijderMonster(plek, uid) { S.plekken[plek].monsters = S.plekken[plek].monsters.filter(m => m.uid !== uid); }

/* ---------- mysteries ---------- */
function mysterie() { return god().mysteries[S.mysterieVolgorde[S.mysterieIndex]]; }
async function losOp() {
  const m = mysterie();
  S.opgelost++; log(`Mysterie opgelost: ${m.naam}`);
  if (S.opgelost >= S.nodig) { S.einde = "winst"; opslaan(); teken(); return; }
  S.mysterieIndex++; S.voortgang = { scheuren: [] };
  Geluid.goed();
  await melding("Mysterie opgelost", `"${m.naam}" is opgelost. Het volgende mysterie: ${mysterie().naam}. ${mysterie().doel}`, `${S.opgelost} van ${S.nodig}`);
  activeerMysterie();
}
function activeerMysterie() {
  const m = mysterie();
  if (m.type === "episch") spawnEpisch(m.plek);
  if (m.type === "scheuren") {
    const past = p => (!m.rivier || D.bord.rivier.includes(p)) && (!m.minstensEen || m.minstensEen.includes(p));
    if (!Object.keys(S.plekken).some(p => S.plekken[p].scheur && past(p))) {
      const plek = kies1(D.bord.plekken.map(p => p.id).filter(past));
      S.plekken[plek].scheur = true; log(`Er opent een Scheur in ${plekNaam(plek)}`);
    }
  }
}
function mysterieActie(h) {
  const m = mysterie(); if (!m) return null;
  if (m.type === "aanwijzingen" && h.plek === m.plek) {
    const totaal = S.helden.filter(x => x.plek === m.plek).reduce((s, x) => s + x.aanw, 0);
    return { label: `Mysterie: ${m.naam}`, kan: totaal >= m.aantal, uitleg: `Samen ${totaal} van ${m.aantal} Aanwijzingen hier` };
  }
  if (m.type === "test" && h.plek === m.plek) return { label: `Mysterie: ${m.naam}`, kan: true };
  if (m.type === "artefacten" && h.plek === m.plek) {
    const n = S.helden.filter(x => x.plek === m.plek).reduce((s, x) => s + x.artefacten.length, 0);
    return { label: `Mysterie: ${m.naam}`, kan: n >= m.aantal, uitleg: `${n} van ${m.aantal} Artefacten hier` };
  }
  if (m.type === "breng" && h.plek === m.van && !S.helden.some(x => x.mysterieVoorwerp)) return { label: `Mysterie: zoek ${m.voorwerp}`, kan: true };
  if (m.type === "breng" && h.plek === m.naar && h.mysterieVoorwerp) return { label: `Mysterie: lever ${m.voorwerp} in`, kan: true };
  return null;
}
async function doeMysterie(h) {
  const m = mysterie();
  if (m.type === "aanwijzingen") {
    if (await test(h, m.kenmerk, m.moeilijkheid, m.naam)) {
      let nog = m.aantal;
      for (const x of [h, ...S.helden.filter(x => x !== h && x.plek === m.plek)]) { const n = Math.min(nog, x.aanw); x.aanw -= n; nog -= n; }
      await losOp();
    } else await melding(m.naam, "Het lukt nog niet. Je houdt je Aanwijzingen en kunt het een volgende beurt opnieuw proberen.");
  } else if (m.type === "test") {
    if (await test(h, m.kenmerk, m.moeilijkheid, m.naam)) await losOp();
    else await melding(m.naam, "Het lukt nog niet. Probeer het een volgende beurt opnieuw.");
  } else if (m.type === "artefacten") {
    let nog = m.aantal;
    for (const x of [h, ...S.helden.filter(x => x !== h && x.plek === m.plek)]) while (nog > 0 && x.artefacten.length) { x.artefacten.pop(); nog--; }
    await losOp();
  } else if (m.type === "breng") {
    if (h.plek === m.van) {
      if (await test(h, m.kenmerk, m.moeilijkheid, `Zoek ${m.voorwerp}`)) { h.mysterieVoorwerp = true; await melding(m.voorwerp, `${korteNaam(heldDef(h).naam)} draagt nu ${m.voorwerp}. Breng het naar ${plekNaam(m.naar)}.`); }
      else await melding(m.naam, "Je vindt het nog niet.");
    } else { h.mysterieVoorwerp = false; await losOp(); }
  }
}
function scheurGesloten(plek) {
  const m = mysterie(); if (!m || m.type !== "scheuren") return false;
  if (m.rivier && !D.bord.rivier.includes(plek)) return false;
  S.voortgang.scheuren.push(plek);
  const n = S.voortgang.scheuren.length;
  if (n < m.aantal) return false;
  if (m.minstensEen && !S.voortgang.scheuren.some(p => m.minstensEen.includes(p))) return false;
  return true;
}

/* ---------- start ---------- */
function nieuwSpel(godId, moeilijkheid, heldIds, opties = {}) {
  const mo = MOEILIJKHEID[moeilijkheid], g = byId(D.goden, godId);
  S = {
    versie: 1, god: godId, moeilijkheid, ronde: 1, mist: g.mist + mo.mist - (heldIds.length === 4 ? 3 : 0), nodig: mo.nodig, opgelost: 0, teller: 0,
    mysterieVolgorde: schud([0, 1, 2]), mysterieIndex: 0, voortgang: { scheuren: [] },
    plekken: Object.fromEntries(D.bord.plekken.map(p => [p.id, { aanw: 0, scheur: false, monsters: [] }])),
    overzee: Object.fromEntries(D.bord.overzee.map(o => [o.id, { artefact: false }])),
    scheurStapel: schud(D.bord.plekken.map(p => p.id)),
    onheil: schud(D.onheil.map(o => o.id)), onheilAfleg: [],
    geruchten: [], rondeGebruikt: {}, fase: "helden", actief: 0, log: [], einde: null, voorgevoel: false,
    tutorial: !!opties.tutorial, coachGezien: []
  };
  S.mistStart = S.mist;
  S.helden = [];
  for (const id of heldIds) S.helden.push(maakHeld(id));
  const n = mo.scheuren + (heldIds.length === 4 ? 1 : 0);
  for (let i = 0; i < n; i++) { const p = trekScheurPlek(); S.plekken[p].scheur = true; spawnMonster(p); }
  legAanwijzing(3);
  activeerMysterie();
  log(`Het spel begint. ${g.naam} roert zich.`);
  startHeldenbeurt();
  if (!window.__bot) setTimeout(() => veilig(() => godIntro(true)), 10);
  try { window.scrollTo(0, 0); } catch {}
}
function maakHeld(id) {
  {
    const d = byId(D.helden, id);
    const h = { id, plek: null,
      L: d.lichaam, G: d.geest, maxL: d.lichaam, maxG: d.geest, pond: 2, aanw: 0, trofee: 0, kenm: { ...d.kenmerken },
      spullen: [], spreuken: [], artefacten: [], toestanden: [], eigen: [], ronde: {}, acties: 2, gebruikt: [], stappen: 0 };
    h.plek = D.bord.plekken.find(p => p.naam === d.start).id;
    for (const u of d.uitrusting) {
      if (/^\d+ spreuk/.test(u)) { const s = trekUit("spreuken"); if (s) h.spreuken.push(s); }
      else if (/^\d+ Pond$/.test(u)) h.pond += parseInt(u, 10);
      else {
        const pk = D.persoonlijk.find(x => x.held === id && x.naam === u);
        if (pk) { h.spullen.push(pk.id); if (pk.start?.aanw) h.aanw += pk.start.aanw; }
        else h.eigen.push({ naam: u, gevecht: STARTWAPENS[u] || 0 });
      }
    }
    return h;
  }
}

/* ---------- heldenfase ---------- */
function startHeldenbeurt() {
  UI.undo = [];
  const h = actief();
  h.acties = heeft(h, "gewond") ? 1 : 2; h.gebruikt = []; h.stappen = 0;
  if (h.id === "owen-marsh") h.stappen++;
  for (const id of h.spullen) h.stappen += spulDef(id)?.bonus?.stap || 0;
  delete h.ronde.wake; delete h.ronde.doodsmasker;
  UI.bekeken = S.actief;
  opslaan(); teken();
  if (S.tutorial) { UI.coachWacht = S.ronde === 1 && S.actief === 0 ? "start" : S.ronde === 2 && S.actief === 0 ? "ronde2" : "beurt"; if (!bezig) setTimeout(coachUitWachtrij, 30); }
}
function bereikbaar(h) {
  if (S.fase !== "helden" || h !== actief()) return [];
  const kanActie = h.acties > 0 && !h.gebruikt.includes("reizen");
  if (h.stappen <= 0 && !kanActie) return [];
  return burenVan(h, h.plek);
}
function reis(doel) {
  const h = actief();
  if (!bereikbaar(h).includes(doel)) return;
  UI.undo.push({ staat: JSON.stringify(S), label: `reizen naar ${plekNaam(doel)}`, ronde: S.ronde, actief: S.actief });
  if (h.stappen > 0) h.stappen--;
  else { h.acties--; h.gebruikt.push("reizen"); }
  const van = plekDef(h.plek);
  UI.reis = { i: S.actief, van: { x: van.x, y: van.y }, naar: doel, t: Date.now() };
  Geluid.reis(); verbergPlekInfo();
  h.plek = doel; log(`${korteNaam(heldDef(h).naam)} reist naar ${plekNaam(doel)}`);
  if (doel === "pall-mall") geruchtBezoek(doel);
  opslaan(); teken();
}
function gebruikActie(h, soort) { h.acties--; h.gebruikt.push(soort); }
async function zoekWeg(h) {
  h.acties = 0;
  if (await test(h, "scherpte", 8, "De weg terug vinden")) { h.toestanden = h.toestanden.filter(t => t !== "verdwaald"); h.plek = kies1(D.bord.plekken).id; await melding("Terug", `Je stapt uit een steeg en staat in ${plekNaam(h.plek)}.`); }
  else await melding("Nog steeds verdwaald", "De straten blijven onbekend. Volgende ronde probeer je het opnieuw.");
  opslaan();
}
async function albertHandigheid(h) {
  const anderen = S.helden.filter(x => x !== h);
  const x = anderen.length === 1 ? anderen[0] : await venster({ soort: "Handigheid", titel: "Met wie ruil je?", knoppen: anderen.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })) });
  const k = await venster({ soort: "Handigheid", titel: `Eén voorwerp met ${korteNaam(heldDef(x).naam)}`, knoppen: [
    ...h.spullen.map(id => ({ label: `Geef ${spulDef(id).naam}`, waarde: ["geef", id] })),
    ...x.spullen.map(id => ({ label: `Neem ${spulDef(id).naam}`, waarde: ["neem", id], ghost: true })), { label: "Toch niet", waarde: null, ghost: true }] });
  if (!k) return;
  h.ronde.handigheid = true;
  if (k[0] === "geef") { h.spullen = h.spullen.filter(i => i !== k[1]); x.spullen.push(k[1]); } else { x.spullen = x.spullen.filter(i => i !== k[1]); h.spullen.push(k[1]); }
  log(`Orsini laat ${spulDef(k[1]).naam} verdwijnen en weer opduiken`); await controleerAlles(); opslaan();
}
async function molly(h) {
  const doel = S.helden.filter(x => x !== h && burenVan(null, h.plek).includes(x.plek));
  if (!doel.length || !h.spullen.length) return melding("Molly", "Er is niemand op een aangrenzende plek, of je hebt niets om te brengen.");
  const x = doel.length === 1 ? doel[0] : await venster({ soort: "Molly", titel: "Naar wie vliegt Molly?", knoppen: doel.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })) });
  const id = await venster({ soort: "Molly", titel: "Wat brengt ze?", knoppen: [...h.spullen.map(i => ({ label: spulDef(i).naam, waarde: i })), { label: "Toch niet", waarde: null, ghost: true }] });
  if (!id) return;
  h.ronde.molly = true; h.spullen = h.spullen.filter(i => i !== id); x.spullen.push(id); log(`Molly brengt ${spulDef(id).naam} naar ${korteNaam(heldDef(x).naam)}`); await controleerAlles(); opslaan();
}
async function garibaldi(h) {
  const d = await venster({ soort: "Garibaldi", titel: "Waar brengt de duif je bericht?", knoppen: [...D.bord.plekken.filter(p => p.id !== h.plek).map(p => ({ label: p.naam, waarde: p.id })), { label: "Toch niet", waarde: null, ghost: true }] });
  if (!d) return;
  h.garibaldiGebruikt = true; h.plek = d; log(`Albert volgt Garibaldi naar ${plekNaam(d)}`); opslaan();
}
async function raaf(h) {
  h.ronde.raaf = true;
  const i = volgendMonster(null);
  await melding("De raaf", `De raaf krast. Het volgende monster wordt: ${monsterDef(S.monsterStapel[i]).naam}.`);
  opslaan();
}
async function journalist(h) {
  const g = S.geruchten.length === 1 ? S.geruchten[0] : await venster({ soort: "Journaliste", titel: "Welk gerucht ontkracht je?", knoppen: S.geruchten.map(g => ({ label: g.naam, waarde: g })) });
  h.aanw -= 2; S.geruchten = S.geruchten.filter(x => x !== g); log(`De avondkrant ontkracht "${g.naam}"`); opslaan();
}
async function rust(h) {
  if (S.plekken[h.plek]?.monsters.length) return melding("Niet veilig", "Je kunt niet rusten met een monster op je plek.");
  UI.undo.push({ staat: JSON.stringify(S), label: "rusten", ronde: S.ronde, actief: S.actief });
  gebruikActie(h, "rusten");
  h.L = Math.min(h.maxL, h.L + 1); if (!heeft(h, "waanzin-slapeloos")) h.G = Math.min(h.maxG, h.G + 1);
  if (h.id === "ezra-whitlock") for (const x of S.helden) if (x.plek === h.plek) x.L = Math.min(x.maxL, x.L + 1);
  log(`${korteNaam(heldDef(h).naam)} rust uit`);
  opslaan(); teken();
}
const telBagage = h => h.spullen.filter(id => !spulDef(id)?.persoonlijk).length + h.spreuken.length;
function kanDragen(h) { return telBagage(h) < 6 + (h.spullen.includes("gladstonetas") ? 1 : 0); }
async function winkel(h, kaarten, soortNaam, prijsVan) {
  let gekocht = false;
  while (true) {
    const rest = kaarten.filter(Boolean);
    if (!rest.length) break;
    const knoppen = rest.map(id => {
      const d = soortNaam === "spreuk" ? spreukDef(id) : spulDef(id);
      const p = prijsVan(d);
      return { label: `Koop ${d.naam} (${p} Pond)`, waarde: id, uit: p > h.pond || !kanDragen(h), verberg: true };
    });
    knoppen.push({ label: gekocht ? "Klaar" : "Niets kopen", waarde: null, ghost: true });
    const map = soortNaam === "spreuk" ? "spreuken" : "spullen";
    const html = `<p class="muted">Je hebt <b>${h.pond} Pond</b>.${kanDragen(h) ? " Tik op een kaart om hem te kopen." : " Je kunt niets meer dragen."}</p><div class="winkelraster">` + rest.map((id, i) => {
      const d = soortNaam === "spreuk" ? spreukDef(id) : spulDef(id), img = art(`art/${map}/${id}.jpg`), k = knoppen[i];
      return `<button class="winkeltegel" data-knop="${i}" ${k.uit ? "disabled" : ""}>${img ? `<img src="${img}" alt="">` : ""}<b>${esc(d.naam)}</b><span class="muted">${esc(d.soort)}</span><span class="wt-tekst">${esc(d.tekst)}</span><span class="prijs">${prijsVan(d)} Pond${k.uit ? "" : " · kopen"}</span></button>`;
    }).join("") + `</div>`;
    const keuze = await venster({ soort: "Winkelen", titel: plekNaam(h.plek), beeld: `art/plekken/${h.plek}.jpg`, html, knoppen });
    if (!keuze) break;
    const d = soortNaam === "spreuk" ? spreukDef(keuze) : spulDef(keuze);
    h.pond -= prijsVan(d); (soortNaam === "spreuk" ? h.spreuken : h.spullen).push(keuze);
    kaarten[kaarten.indexOf(keuze)] = null; gekocht = true; log(`${korteNaam(heldDef(h).naam)} koopt ${d.naam}`);
  }
}
function trekMeerdere(soort, n) {
  const uit = [];
  for (let i = 0; i < n; i++) { const pool = (soort === "spreuken" ? D.spreuken : D.spullen.filter(x => !x.persoonlijk)).map(x => x.id).filter(id => !uit.includes(id) && !S.helden.some(h => h.spullen.includes(id) || h.spreuken.includes(id))); if (pool.length) uit.push(kies1(pool)); }
  return uit;
}
async function dienst(h) {
  const p = plekDef(h.plek), soort = p.dienst, naam = korteNaam(heldDef(h).naam);
  if (heeft(h, "gezocht") && (soort === "markt" || soort === "occulte-boekwinkel")) return melding("Gezocht", "Met je gezicht op elk politiebericht kun je hier niet winkelen. Ga eerst naar de politie in Whitehall.");
  gebruikActie(h, "dienst");
  if (S.tutorial) await coach("dienst");
  const korting = h.id === "cordelia-vane" ? 1 : 0;
  switch (soort) {
    case "sterrenwacht": await kijkOnheil(2, true); break;
    case "seance": await venster({ soort: "Seance", titel: p.naam, html: await pasToe(h, [{ geest: -1 }, { aanwijzing: 1 }]) }); break;
    case "station": {
      const doelen = Object.entries(S.plekken).filter(([, x]) => x.scheur).map(([id]) => id);
      if (h.pond < 1 || !doelen.length) { await melding("Station", h.pond < 1 ? "Je hebt geen geld voor een kaartje." : "Er is nergens een Scheur."); break; }
      const d = await venster({ soort: "Trein (1 Pond)", titel: "Waarheen?", knoppen: [...doelen.map(id => ({ label: plekNaam(id), waarde: id })), { label: "Toch niet", waarde: null, ghost: true }] });
      if (d) { h.pond--; h.plek = d; log(`${naam} neemt de trein naar ${plekNaam(d)}`); }
      break;
    }
    case "bibliotheek": {
      if (await test(h, "kennis", 8, "Studeren in de leeszaal")) {
        const opties = trekMeerdere("spreuken", h.id === "hester-quayle" ? 3 : 2);
        if (opties.length) { const k = await venster({ soort: "Studeren", titel: "Kies een spreuk", html: opties.map(id => `<p><b>${esc(spreukDef(id).naam)}.</b> ${esc(spreukDef(id).tekst)}</p>`).join(""), knoppen: opties.map(id => ({ label: spreukDef(id).naam, waarde: id })) }); h.spreuken.push(k); log(`${naam} leert ${spreukDef(k).naam}`); }
      }
      break;
    }
    case "occulte-boekwinkel": await winkel(h, trekMeerdere("spreuken", 3), "spreuk", () => 2 - korting); break;
    case "markt": await winkel(h, trekMeerdere("spullen", h.id === "hester-quayle" ? 4 : 3), "spul", d => Math.max(d.prijs ? 1 : 0, d.prijs - korting)); break;
    case "salon": {
      if (await test(h, "overtuiging", 8, "In de salon")) {
        const k = await venster({ soort: "Salon", titel: "Wat vraag je?", knoppen: [{ label: "2 Pond", waarde: "pond" }, { label: "Een bondgenoot", waarde: "bg" }] });
        await venster({ soort: "Salon", titel: p.naam, html: await pasToe(h, [k === "pond" ? { pond: 2 } : { trek: "bondgenoot" }]) });
      }
      break;
    }
    case "theater": {
      await pasToe(h, [{ pond: 2 }]);
      const k = await venster({ soort: "Theater", titel: "Je verdient 2 Pond", html: "<p>Wil je een extra nummer doen voor 1 Pond meer? (Charisma 9)</p>", knoppen: [{ label: "Ja", waarde: true }, { label: "Nee", waarde: false, ghost: true }] });
      if (k && await test(h, "overtuiging", 9, "Een extra nummer")) await pasToe(h, [{ pond: 1 }]);
      break;
    }
    case "club": {
      if (h.pond < 3) { await melding("Club", "Je hebt 3 Pond nodig."); break; }
      h.pond -= 3; h.artefactGerucht = true;
      await melding("Een gerucht in de club", "Je betaalt 3 Pond. Bij je volgende expeditie overzee vind je zeker een artefact.");
      break;
    }
    case "universiteit": {
      const boek = h.spullen.some(id => spulDef(id).soort === "Boek") || h.artefacten.length;
      if (!boek) { await melding("King's College", "Je hebt een Boek of Artefact nodig om te laten onderzoeken."); h.acties++; h.gebruikt.pop(); break; }
      await venster({ soort: "Onderzoek", titel: p.naam, html: await pasToe(h, [{ aanwijzing: 1 }]) });
      break;
    }
    case "ziekenhuis": {
      const k = await venster({ soort: "Ziekenhuis en bank", titel: "The City", knoppen: [{ label: "Verzorgen: alle Lichaam (1 Pond)", waarde: "heel", uit: h.pond < 1 }, { label: "Gewond laten verwijderen", waarde: "gewond", uit: !heeft(h, "gewond") }, { label: "Lenen: +3 Pond (Schuld)", waarde: "leen", uit: heeft(h, "schuld") }, { label: "Schuld aflossen (4 Pond)", waarde: "los", uit: !heeft(h, "schuld") || h.pond < 4 }, { label: "Niets", waarde: null, ghost: true }] });
      if (k === "heel") { h.pond--; h.L = h.maxL; log(`${naam} wordt verzorgd`); }
      if (k === "gewond") h.toestanden = h.toestanden.filter(t => t !== "gewond");
      if (k === "leen") { h.pond += 3; geefToestand(h, "schuld"); log(`${naam} leent 3 Pond`); }
      if (k === "los") { h.pond -= 4; h.toestanden = h.toestanden.filter(t => t !== "schuld"); log(`${naam} lost de schuld af`); }
      break;
    }
    case "gaarkeuken": {
      const extra = heeft(h, "verslaafd") ? [{ label: "Verslaving bestrijden (Charisma 9)", waarde: "v" }] : [];
      const k = extra.length ? await venster({ soort: "Gaarkeuken", titel: p.naam, knoppen: [{ label: "Eten en rusten (+2 Geest)", waarde: "e" }, ...extra] }) : "e";
      if (k === "e") await venster({ soort: "Gaarkeuken", titel: p.naam, html: await pasToe(h, [{ geest: 2 }]) });
      else if (await test(h, "overtuiging", 9, "Afkicken")) await pasToe(h, [{ verwijder: "verslaafd" }]);
      break;
    }
    case "logementen": {
      if (!S.scheurStapel.length) S.scheurStapel = schud(D.bord.plekken.map(p => p.id));
      await melding("Geruchten in de logementen", `Men fluistert dat de volgende Scheur zal openen in ${plekNaam(S.scheurStapel.at(-1))}.`);
      break;
    }
    case "politie": {
      const k = await venster({ soort: "Scotland Yard", titel: p.naam, knoppen: [{ label: "Gezocht laten vervallen (2 Pond)", waarde: "g", uit: !heeft(h, "gezocht") || h.pond < 2 }, { label: "Agent op ronde meenemen", waarde: "a", uit: S.helden.some(x => x.spullen.includes("bondgenoot-agent")) || heeft(h, "gezocht") }, { label: "Niets", waarde: null, ghost: true }] });
      if (k === "g") { h.pond -= 2; h.toestanden = h.toestanden.filter(t => t !== "gezocht"); }
      if (k === "a") h.spullen.push("bondgenoot-agent");
      if (!k) { h.acties++; h.gebruikt.pop(); }
      break;
    }
    case "kerk": {
      const k = await venster({ soort: "De abdij", titel: p.naam, knoppen: [{ label: "Vloek laten opheffen", waarde: "v", uit: !heeft(h, "vervloekt") }, { label: "Zegen ontvangen", waarde: "z", uit: heeft(h, "gezegend") }, { label: "Niets", waarde: null, ghost: true }] });
      if (k) await pasToe(h, [k === "v" ? { verwijder: "vervloekt" } : { toestand: "gezegend" }]); else { h.acties++; h.gebruikt.pop(); }
      break;
    }
    case "kunstenaars": {
      await pasToe(h, [{ geest: 1 }]);
      const w = h.toestanden.filter(t => t.startsWith("waanzin"));
      if (w.length && await test(h, "kennis", 9, "Een portret dat je terugbrengt")) { h.toestanden = h.toestanden.filter(t => t !== w[0]); log(`${naam} raakt ${toestDef(w[0]).naam} kwijt`); }
      else if (!w.length) await melding("Atelier", "Je poseert een uur en voelt je rustiger. +1 Geest.");
      break;
    }
    case "haven": {
      if (h.pond < 2) { await melding("De dokken", "Een bootkaartje kost 2 Pond."); h.acties++; h.gebruikt.pop(); break; }
      const d = await venster({ soort: "Bootkaartje (2 Pond)", titel: "Op expeditie", knoppen: [...D.bord.overzee.map(o => ({ label: o.naam, waarde: o.id })), { label: "Toch niet", waarde: null, ghost: true }] });
      if (d) { h.pond -= 2; h.plek = d; log(`${naam} vaart naar ${plekNaam(d)}`); } else { h.acties++; h.gebruikt.pop(); }
      break;
    }
    case "rivierpolitie": {
      const d = await venster({ soort: "Roeiboot", titel: "Waarheen over de rivier?", knoppen: D.bord.rivier.filter(r => r !== h.plek).map(id => ({ label: plekNaam(id), waarde: id })) });
      h.plek = d; log(`${naam} roeit naar ${plekNaam(d)}`);
      break;
    }
  }
  await controleerHeld(h);
  opslaan(); teken();
}
async function ruil(h) {
  const anderen = S.helden.filter(x => x !== h && x.plek === h.plek);
  const naar = anderen.length === 1 ? anderen[0] : await venster({ soort: "Ruilen", titel: "Met wie?", knoppen: anderen.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })) });
  gebruikActie(h, "ruilen");
  while (true) {
    const opties = [
      ...h.spullen.map(id => ({ label: `Geef ${spulDef(id).naam}`, waarde: ["spullen", id] })),
      ...h.spreuken.map(id => ({ label: `Geef ${spreukDef(id).naam}`, waarde: ["spreuken", id] })),
      ...h.artefacten.map(id => ({ label: `Geef ${artDef(id).naam}`, waarde: ["artefacten", id] })),
      { label: "Geef 1 Pond", waarde: ["pond"], uit: h.pond < 1 }, { label: "Geef 1 Aanwijzing", waarde: ["aanw"], uit: h.aanw < 1 },
      ...naar.spullen.map(id => ({ label: `Neem ${spulDef(id).naam}`, waarde: ["neem", "spullen", id], ghost: true })),
      { label: "Klaar", waarde: null, ghost: true }
    ];
    const k = await venster({ soort: "Ruilen", titel: `${korteNaam(heldDef(h).naam)} en ${korteNaam(heldDef(naar).naam)}`, knoppen: opties });
    if (!k) break;
    if (k[0] === "pond") { h.pond--; naar.pond++; }
    else if (k[0] === "aanw") { h.aanw--; naar.aanw++; }
    else if (k[0] === "neem") { naar[k[1]] = naar[k[1]].filter(x => x !== k[2]); h[k[1]].push(k[2]); }
    else { h[k[0]] = h[k[0]].filter(x => x !== k[1]); naar[k[0]].push(k[1]); }
  }
  await controleerAlles(); opslaan(); teken();
}

/* ---------- spullen en spreuken gebruiken ---------- */
async function gebruikSpul(h, id) {
  const s = spulDef(id), naam = korteNaam(heldDef(h).naam);
  const weg = () => { h.spullen = h.spullen.filter(x => x !== id); };
  const mon = S.plekken[h.plek]?.monsters || [];
  switch (s.gebruik) {
    case "laudanum": weg(); h.G = Math.min(h.maxG, h.G + 2); if (d6() === 1 && !heeft(h, "verslaafd")) { geefToestand(h, "verslaafd"); await melding("Laudanum", "Het helpt, maar je wilt meer. Je bent Verslaafd."); } break;
    case "carbol": weg(); h.L = Math.min(h.maxL, h.L + 2); break;
    case "vlugzout": weg(); h.G = Math.min(h.maxG, h.G + 2); break;
    case "dynamiet": {
      const doel = mon.filter(m => !byId(D.epische, m.id));
      if (!doel.length) return melding("Dynamiet", "Er is hier geen gewoon monster.");
      weg(); verwijderMonster(h.plek, doel[0].uid); verliesLichaam(h, 1); h.trofee++; log(`${naam} blaast ${monsterDef(doel[0].id).naam} op`); break;
    }
    case "chloroform": {
      const doel = mon.filter(m => monsterDef(m.id).mens);
      if (!doel.length) return melding("Chloroform", "Er is hier geen menselijke tegenstander.");
      weg(); verwijderMonster(h.plek, doel[0].uid); h.trofee++; log(`${naam} verdooft een ${monsterDef(doel[0].id).naam}`); break;
    }
    case "stappen2": if (S.fase !== "helden" || h !== actief()) return melding(s.naam, "Dit kun je alleen in je eigen beurt gebruiken."); weg(); h.stappen += 2; break;
    case "ondergronds": {
      if (S.fase !== "helden" || h !== actief() || !STATIONS.includes(h.plek)) return melding(s.naam, "Je moet in je beurt op een station van de Ondergrondse staan.");
      const d = await venster({ soort: "De Ondergrondse", titel: "Naar welk station?", knoppen: STATIONS.filter(x => x !== h.plek).map(x => ({ label: plekNaam(x), waarde: x })) });
      weg(); h.plek = d; break;
    }
    case "grimoire": {
      if (h.ronde.grimoire) return melding(s.naam, "Eén keer per ronde.");
      h.ronde.grimoire = true; h.G--;
      if (await test(h, "kennis", 8, "Lezen in de grimoire")) await pasToe(h, [{ trek: "spreuken" }]);
      break;
    }
    case "straatjongens": {
      if (S.rondeGebruikt["straatjongens"]) return melding(s.naam, "Eén keer per ronde.");
      S.rondeGebruikt["straatjongens"] = true;
      const dist = afstanden(h.plek);
      const plek = Object.keys(S.plekken).filter(p => S.plekken[p].aanw > 0 && (dist[p] ?? 9) <= 2).sort((a, b) => dist[a] - dist[b])[0];
      if (!plek) return melding(s.naam, "De jochies vinden niets binnen twee straten.");
      S.plekken[plek].aanw--; h.aanw++; await melding(s.naam, `De jochies brengen een Aanwijzing uit ${plekNaam(plek)}.`); break;
    }
    case "gember": weg(); h.L = Math.min(h.maxL, h.L + 2); h.G = Math.min(h.maxG, h.G + 1); break;
    case "kleitablet": weg(); h.aanw += 2; await melding(s.naam, "De tekens vallen op hun plaats. Je krijgt 2 Aanwijzingen."); break;
    case "volgendeScheur": {
      if (h.ronde[id]) return melding(s.naam, "Eén keer per ronde.");
      h.ronde[id] = true; if (!S.scheurStapel.length) S.scheurStapel = schud(D.bord.plekken.map(p => p.id));
      await melding(s.naam, `Volgens je kaarten opent de volgende Scheur in ${plekNaam(S.scheurStapel.at(-1))}.`); break;
    }
    case "kijk1": if (h.ronde[id]) return melding(s.naam, "Eén keer per ronde."); h.ronde[id] = true; await kijkOnheil(1); break;
    case "tafeltje": if (h.ronde[id]) return melding(s.naam, "Eén keer per ronde."); h.ronde[id] = true; h.G--; h.aanw++; await melding(s.naam, "Het tafeltje kantelt, en een stem fluistert een aanwijzing. −1 Geest, +1 Aanwijzing."); break;
    case "lied": {
      if (h.ronde[id]) return melding(s.naam, "Eén keer per ronde.");
      h.ronde[id] = true; for (const x of S.helden) if (x.plek === h.plek) x.G = Math.min(x.maxG, x.G + 1);
      await melding(s.naam, "Iedereen die je hoort, voelt zich even lichter. Alle helden hier herstellen 1 Geest."); break;
    }
    case "partituur": weg(); for (const x of S.helden) x.G = Math.min(x.maxG, x.G + 2); await melding(s.naam, "De muziek klinkt door de hele stad. Alle helden herstellen 2 Geest."); break;
    case "fluit": {
      const doel = mon.filter(m => monsterDef(m.id).mens);
      if (!doel.length) return melding(s.naam, "Er is hier geen menselijke tegenstander.");
      weg(); verwijderMonster(h.plek, doel[0].uid); await melding(s.naam, `De ${monsterDef(doel[0].id).naam} hoort het fluitje en slaat op de vlucht.`); break;
    }
    case "brood": {
      const x = await kiesHeldBereik(h, s.naam); weg(); geefToestand(x, "gezegend"); x.L = Math.min(x.maxL, x.L + 1);
      await melding(s.naam, `${korteNaam(heldDef(x).naam)} eet van het brood en is Gezegend.`); break;
    }
    default: return;
  }
  log(`${naam} gebruikt ${s.naam}`);
  await controleerHeld(h); opslaan(); teken();
}
function spreukPrijs(h, s) {
  let p = { geest: 0, lichaam: 0 };
  const m = /^(\d+) (Geest|Lichaam)/.exec(s.prijs);
  if (m) p[m[2] === "Geest" ? "geest" : "lichaam"] = +m[1];
  if (S.god === "azh-ilareth") p.geest++;
  if (heeft(h, "waanzin-stemmen")) p.geest++;
  if (alleMonsters().some(({ m }) => monsterDef(m.id).spreukDuurder)) p.geest++;
  return p;
}
async function spreek(h, id) {
  const s = spreukDef(id), naam = korteNaam(heldDef(h).naam), p = spreukPrijs(h, s);
  if (S.fase !== "helden" || h !== actief() || h.acties < 1 || h.gebruikt.includes("spreuk")) return melding(s.naam, "Een spreuk uitspreken kost een actie in je eigen beurt (één keer per beurt).");
  if (s.auto === "gevecht") return melding(s.naam, "Deze spreuk gebruik je tijdens een gevecht. De app biedt hem dan aan.");
  if (s.auto === "aanwijzing" && S.rondeGebruikt.theebladeren) return melding(s.naam, "Deze ronde zijn de theebladeren al gelezen.");
  gebruikActie(h, "spreuk");
  h.G -= p.geest; h.L -= p.lichaam;
  log(`${naam} spreekt ${s.naam} uit`);
  let gelukt = await test(h, s.test, s.moeilijkheid, s.naam, { spreuk: true });
  if (!gelukt && h.id === "bridie-kavanagh" && h.spullen.length) {
    const offer = await venster({ soort: "Theebladeren", titel: "Opnieuw proberen?", html: "<p>Je mag een voorwerp afleggen om de spreuk meteen opnieuw te proberen.</p>", knoppen: [...h.spullen.map(x => ({ label: `Leg ${spulDef(x).naam} af`, waarde: x })), { label: "Nee", waarde: null, ghost: true }] });
    if (offer) { h.spullen = h.spullen.filter(x => x !== offer); gelukt = await test(h, s.test, s.moeilijkheid, s.naam, { spreuk: true }); }
  }
  const mon = S.plekken[h.plek]?.monsters || [];
  if (!gelukt) {
    if (s.auto === "sluit") spawnMonster(h.plek);
    if (s.auto === "versla") geefWaanzin(h);
    if (s.id === "zout-en-ijzer") h.G--;
    if (s.auto === "reisOveral") geefToestand(h, "verdwaald");
    await melding(s.naam, "De spreuk mislukt. " + (s.tekst.includes("Mislukt") ? s.tekst.split("Mislukt:")[1] : ""));
  } else {
    switch (s.auto) {
      case "sluit": if (S.plekken[h.plek]?.scheur) await sluitScheur(h); else await melding(s.naam, "Hier is geen Scheur."); break;
      case "reisOveral": { const d = await venster({ soort: s.naam, titel: "Door welke spiegel stap je uit?", knoppen: D.bord.plekken.filter(x => x.id !== h.plek).map(x => ({ label: x.naam, waarde: x.id })) }); h.plek = d; break; }
      case "kijk3": await kijkOnheil(3, false, true); break;
      case "aanwijzing": S.rondeGebruikt.theebladeren = true; await pasToe(h, [{ aanwijzing: 1 }]); break;
      case "versla": {
        if (!mon.length) { await melding(s.naam, "Er is hier geen monster."); break; }
        const m = mon[0], ep = !!byId(D.epische, m.id);
        m.leven -= ep ? 2 : m.leven;
        if (m.leven <= 0) await monsterVerslagen(h, h.plek, m); else await melding(s.naam, `${monsterDef(m.id).naam} wankelt, maar staat nog.`);
        break;
      }
      case "mesmerisme": {
        const mens = mon.find(m => monsterDef(m.id).mens);
        if (!mens) { await melding(s.naam, "Er is hier geen mens om te beïnvloeden."); break; }
        const k = await venster({ soort: s.naam, titel: monsterDef(mens.id).naam, knoppen: [{ label: "Laat hem vertrekken", waarde: "weg" }, { label: "Laat hem praten (+2 Aanwijzingen)", waarde: "praat" }] });
        verwijderMonster(h.plek, mens.uid);
        if (k === "weg") S.plekken[kies1(D.bord.plekken).id].monsters.push(mens); else h.aanw += 2;
        break;
      }
      case "genees3": { const x = await kiesHeldBereik(h, s.naam); x.L = Math.min(x.maxL, x.L + 3); log(`${korteNaam(heldDef(x).naam)} herstelt 3 Lichaam`); break; }
      case "wake": for (const x of S.helden) if (x.plek === h.plek || (h.id === "esme-valentine" && burenVan(null, h.plek).includes(x.plek))) x.ronde.wake = true; break;
      case "pentagram": h.ronde.pentagram = true; break;
      case "doodsmasker": h.ronde.doodsmasker = true; break;
      default:
        if (s.id === "zout-en-ijzer") { S.plekken[h.plek].beschermd = S.ronde; await melding(s.naam, "Geen monster kan deze ronde jouw plek binnenkomen."); }
        else if (s.id === "sympathiepop") { const x = await kiesHeldBereik(h, s.naam); x.ronde.pop = true; await melding(s.naam, `De pop neemt deze ronde alle Lichaamsschade van ${korteNaam(heldDef(x).naam)} over.`); }
        else if (s.id === "astrale-reis") { const d = await venster({ soort: s.naam, titel: "Waar ga je in je droom heen?", knoppen: [...D.bord.plekken, ...D.bord.overzee].filter(x => x.id !== h.plek).map(x => ({ label: x.naam, waarde: x.id })) }); h.ronde.astraal = d; await melding(s.naam, `Deze ronde heb je je ontmoeting in ${plekNaam(d)}.`); }
    }
  }
  await controleerHeld(h); opslaan(); teken();
}
async function kiesHeldBereik(h, titel) {
  const bereik = S.helden.filter(x => x.plek === h.plek || (h.id === "esme-valentine" && burenVan(null, h.plek).includes(x.plek)));
  if (bereik.length === 1) return bereik[0];
  return venster({ soort: titel, titel: "Voor wie?", knoppen: bereik.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })) });
}
async function gebruikArtefact(h, id) {
  const a = artDef(id), naam = korteNaam(heldDef(h).naam);
  const weg = () => { h.artefacten = h.artefacten.filter(x => x !== id); };
  if (id === "zwarte-spiegel") {
    if (h.ronde.spiegel) return melding(a.naam, "Eén keer per ronde.");
    h.ronde.spiegel = true;
    if (h.spiegelRonde === S.ronde - 1) { verliesGeestDirect(h, 1); log(`${naam} kijkt te vaak in de spiegel: −1 Geest`); }
    h.spiegelRonde = S.ronde;
    const k = await venster({ soort: a.naam, titel: "Wat wil je zien?", knoppen: [{ label: "De volgende onheilskaart", waarde: "o" }, { label: "De volgende Scheur", waarde: "s" }] });
    if (k === "o") await kijkOnheil(1);
    else { if (!S.scheurStapel.length) S.scheurStapel = schud(D.bord.plekken.map(p => p.id)); await melding(a.naam, `In het zwarte glas zie je ${plekNaam(S.scheurStapel.at(-1))}.`); }
  } else if (id === "klokkenbel") {
    if (h.ronde.bel) return melding(a.naam, "Eén keer per ronde.");
    if (isOverzee(h.plek)) return melding(a.naam, "Luid de bel in Londen.");
    h.ronde.bel = true; S.plekken[h.plek].belRonde = S.ronde;
    for (const x of S.helden) if (x.plek === h.plek) x.G = Math.min(x.maxG, x.G + 2);
    await melding(a.naam, "De klank vult de straat. Iedereen hier herstelt 2 Geest, en de monsters hier verliezen deze ronde hun Gruwel.");
  } else if (id === "sterrenkaart") {
    const doelen = Object.keys(S.plekken).filter(p => S.plekken[p].scheur);
    if (!doelen.length) return melding(a.naam, "Er is nergens een Scheur.");
    const d = await venster({ soort: a.naam, titel: "Welke Scheur sluit je?", knoppen: [...doelen.map(x => ({ label: plekNaam(x), waarde: x })), { label: "Nog niet", waarde: null, ghost: true }] });
    if (!d) return;
    weg(); await sluitScheur(h, d);
  } else if (id === "verzegelde-kruik") {
    const e = alleMonsters().find(({ m }) => byId(D.epische, m.id));
    if (!e) return melding(a.naam, "Er is geen episch monster om op te sluiten.");
    weg(); verwijderMonster(e.plek, e.m.uid); h.trofee++;
    await melding(a.naam, `${monsterDef(e.m.id).naam} wordt in de kruik gezogen. Het zegel sluit zich.`);
    if (mysterie()?.type === "episch") await losOp();
  }
  await controleerHeld(h); opslaan(); teken();
}
function verliesGeestDirect(h, n) { h.G -= n; }
async function kijkOnheil(n, ordenen, eenOnderop) {
  if (S.onheil.length < n) { S.onheil = [...schud(S.onheilAfleg), ...S.onheil]; S.onheilAfleg = []; }
  const top = S.onheil.slice(-n).reverse();
  const html = top.map((id, i) => `<p><b>${i + 1}. ${esc(byId(D.onheil, id).naam)}.</b> ${esc(byId(D.onheil, id).tekst)}</p>`).join("");
  if (eenOnderop) {
    const k = await venster({ soort: "Onheil voorzien", titel: "Welke leg je onderop?", html, knoppen: [...top.map(id => ({ label: byId(D.onheil, id).naam, waarde: id })), { label: "Geen", waarde: null, ghost: true }] });
    if (k) { S.onheil = S.onheil.filter(x => x !== k); S.onheil.unshift(k); }
  } else if (ordenen && n === 2) {
    const k = await venster({ soort: "De sterrenwacht", titel: "De komende onheilskaarten", html, knoppen: [{ label: "Zo laten", waarde: false }, { label: "Omwisselen", waarde: true, ghost: true }] });
    if (k) { const l = S.onheil.length; [S.onheil[l - 1], S.onheil[l - 2]] = [S.onheil[l - 2], S.onheil[l - 1]]; }
  } else await venster({ soort: "Onheil voorzien", titel: n === 1 ? "De volgende onheilskaart" : "De komende onheilskaarten", html });
}
async function pellVermogen(h) {
  if (h.ronde.sterrenkaart) return;
  h.ronde.sterrenkaart = true;
  if (!S.onheil.length) { S.onheil = schud(S.onheilAfleg); S.onheilAfleg = []; }
  const id = S.onheil.at(-1), c = byId(D.onheil, id);
  const k = await venster({ soort: "Sterrenkaart", titel: c.naam, verhaal: c.tekst, knoppen: [{ label: "Bovenop laten", waarde: false }, { label: "Onderop leggen", waarde: true, ghost: true }] });
  if (k) { S.onheil.pop(); S.onheil.unshift(id); }
  opslaan(); teken();
}
async function clementine(h) {
  if (h.ronde.droom) return;
  const doel = S.helden.filter(x => x.plek === h.plek && x.G < x.maxG);
  if (!doel.length) return melding("Droommelodie", "Niemand hier heeft Geest nodig.");
  const x = doel.length === 1 ? doel[0] : await venster({ soort: "Droommelodie", titel: "Voor wie speel je?", knoppen: doel.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })) });
  h.ronde.droom = true; x.G++; opslaan(); teken();
}

/* ---------- gevecht ---------- */
async function monsterVerslagen(h, plek, m) {
  const d = monsterDef(m.id), naam = korteNaam(heldDef(h).naam);
  verwijderMonster(plek, m.uid);
  if (!d.geenTrofee) h.trofee++;
  if (d.beloning) await pasToe(h, Object.entries(d.beloning).map(([k, v]) => ({ [k]: v })));
  log(`${naam} verslaat ${d.naam}`);
  if (d.komtTerug && d6() <= 2) { const p = kies1(D.bord.rivier); S.plekken[p].monsters.push({ uid: ++S.teller, id: m.id, leven: d.leven }); log(`${d.naam} komt terug in ${plekNaam(p)}`); }
  const mys = mysterie();
  if (byId(D.epische, m.id) && mys?.type === "episch") await losOp();
}
async function vecht(h, plek, m) {
  const d = monsterDef(m.id), naam = korteNaam(heldDef(h).naam), ep = !!byId(D.epische, m.id);
  const hoogmoed = heeft(h, "waanzin-hoogmoed");
  if (h.ronde.doodsmasker && !hoogmoed) { log(`${naam} wordt genegeerd door ${d.naam}`); return true; }
  if (S.tutorial) await coach("gevecht");
  const opties = [{ label: "Vechten", waarde: "vecht" }];
  if (h.artefacten.includes("hand-van-glorie") && !h.ronde.glorie && !hoogmoed) opties.push({ label: "Hand van glorie: ontwijken", waarde: "glorie", ghost: true });
  if (h.spreuken.includes("verbanning")) opties.push({ label: "Hermetische verbanning", waarde: "verban" });
  if (!ep && h.spullen.includes("dynamiet")) opties.push({ label: "Dynamiet", waarde: "dyn", ghost: true });
  if (d.mens && h.spullen.includes("chloroform")) opties.push({ label: "Chloroform", waarde: "chl", ghost: true });
  const kenmerk = d.vechtMet || "kracht";
  const k = await venster({ soort: ep ? "Episch monster" : "Gevecht", titel: d.naam, beeld: `art/monsters/${d.id}.jpg`, zij: true, achterkant: "monster", geluid: "monster", verhaal: d.eigenschap,
    html: `<p>Gruwel <b>${d.gruwel}</b> · Taaiheid <b>${d.taaiheid}</b> · Schade <b>${d.schade}</b> · Leven <b>${m.leven}</b></p><p class="muted">${esc(naam)} vecht met ${KNAAM[kenmerk]}.</p>`, knoppen: opties });
  if (k === "dyn") { await gebruikSpul(h, "dynamiet"); return true; }
  if (k === "chl") { await gebruikSpul(h, "chloroform"); return true; }
  if (k === "glorie") { h.ronde.glorie = true; log(`${naam} glipt ongezien langs ${d.naam}`); return false; }
  const gruwel = S.plekken[plek]?.belRonde === S.ronde ? 0 : d.gruwel;
  if (gruwel > 0 && !h.ronde.wake) {
    const extra = h.ronde.pentagram ? 1 : 0; delete h.ronde.pentagram;
    if (!await test(h, "kennis", 8, `Gruwel van ${d.naam}`, { extra, bonus: (h.artefacten.includes("jade-masker") ? 2 : 0) + h.spullen.reduce((t, id) => t + (spulDef(id)?.bonus?.gruwel || 0), 0) })) { h.G -= gruwel; log(`${naam} verliest ${gruwel} Geest door gruwel`); }
    await controleerHeld(h);
    if (h.plek !== plek) return false;
  }
  let gelukt;
  const nebet = S.god === "nebet-ankhu" && h.artefacten.length ? 1 : 0;
  if (k === "verban") {
    const p = spreukPrijs(h, spreukDef("verbanning")); h.G -= p.geest;
    gelukt = await test(h, "kennis", d.taaiheid, `Verbanning tegen ${d.naam}`, { bonus: 2 + nebet, spreuk: true });
  } else {
    const vuurwapen = h.spullen.some(x => x === "webley" || x === "olifantengeweer" || spulDef(x)?.vuurwapen) || h.eigen.some(e => /Revolver|geweer|pistool|Derringer/i.test(e.naam));
    const kogels = kenmerk === "kracht" && vuurwapen && d.gruwel >= 2 && h.spullen.includes("zilveren-kogels") ? 2 : 0;
    if (kogels) { h.spullen = h.spullen.filter(x => x !== "zilveren-kogels"); log(`${naam} laadt zilveren kogels`); }
    const terrier = h.spullen.includes("dier-terrier") && D.bord.rivier.includes(plek) ? 1 : 0;
    const bonus = (kenmerk === "kracht" ? wapenBonus(h, d.mens) : 0) + nebet + kogels + terrier;
    gelukt = await test(h, kenmerk, d.taaiheid, `Gevecht tegen ${d.naam}`, { bonus });
  }
  if (gelukt) {
    m.leven--;
    if (m.leven <= 0) { await monsterVerslagen(h, plek, m); await melding("Verslagen", `${d.naam} is verslagen.`, "Gevecht"); return true; }
    await melding("Raak", `${d.naam} is gewond maar staat nog (${m.leven} leven).`, "Gevecht");
    return false;
  }
  const verloren = verliesLichaam(h, d.schade); log(`${naam} verliest ${verloren} Lichaam tegen ${d.naam}`);
  let extra = "";
  if (d.verliesWaanzin) extra = ` Je krijgt waanzin: ${geefWaanzin(h)}.`;
  if (d.id === "rivierwiedde") { const r = burenVan(null, plek).filter(x => D.bord.rivier.includes(x)); if (r.length) { h.plek = kies1(r); extra += ` Je wordt meegesleurd naar ${plekNaam(h.plek)}.`; } }
  await melding("Verloren", `${d.naam} raakt je: −${verloren} Lichaam.${extra}`, "Gevecht");
  await controleerHeld(h);
  return false;
}

/* ---------- scheuren ---------- */
async function sluitScheur(h, plek = h.plek) {
  S.plekken[plek].scheur = false; h.trofee++;
  log(`${korteNaam(heldDef(h).naam)} sluit de Scheur in ${plekNaam(plek)}`);
  await melding("Scheur gesloten", `De Scheur in ${plekNaam(plek)} trekt dicht. +1 Trofee.`);
  if (scheurGesloten(plek)) await losOp();
}

/* ---------- kaarten trekken ---------- */
function trekKaart(lijst, filter) {
  S.gespeeld ??= [];
  const past = lijst.filter(e => (!e.god || e.god === S.god) && filter(e));
  const vers = past.filter(e => !S.gespeeld.includes(e.id));
  const pool = vers.length ? vers : past;
  const gewogen = pool.flatMap(e => e.god ? [e, e, e] : [e]);
  const kaart = kies1(gewogen);
  if (kaart) { S.gespeeld.push(kaart.id); if (S.gespeeld.length > 60) S.gespeeld.shift(); }
  return kaart;
}

/* ---------- ontmoetingsfase ---------- */
async function ontmoeting(h) {
  const naam = korteNaam(heldDef(h).naam);
  if (heeft(h, "verdwaald")) { await melding(`${naam} is verdwaald`, "Je dwaalt door straten die niet op de kaart staan. Deze ronde geen ontmoeting."); return; }
  if (S.tutorial) await coach("ontmoeting");
  const eigen = S.plekken[h.plek];
  if (eigen && eigen.monsters.length && !(h.ronde.doodsmasker && !heeft(h, "waanzin-hoogmoed"))) {
    for (const m of [...eigen.monsters]) {
      if (S.einde) return;
      const plek0 = h.plek;
      let klaar = await vecht(h, plek0, m);
      while (klaar && h.id === "tobias-hale" && S.plekken[plek0].monsters.length && h.plek === plek0) {
        const verder = await venster({ soort: "Doorvechter", titel: "Nog een monster aanvallen?", knoppen: [{ label: "Ja", waarde: true }, { label: "Nee", waarde: false, ghost: true }] });
        if (!verder) break;
        klaar = await vecht(h, plek0, S.plekken[plek0].monsters[0]);
      }
      if (h.plek !== plek0) return;
    }
    if (S.plekken[h.plek].monsters.length) return;
  }
  const plek = h.ronde.astraal || h.plek;
  if (h.ronde.astraal) await melding("Astrale reis", `Je geest zweeft naar ${plekNaam(plek)}.`);
  if (isOverzee(plek)) {
    const kaart = trekKaart(D.ontmoetingen.expeditie, e => e.plek === plek);
    await speelKaart(h, kaart, "Expeditie", `art/plekken/${plek}.jpg`, "expeditie");
    if (S.overzee[plek].artefact || h.artefactGerucht) {
      S.overzee[plek].artefact = false; h.artefactGerucht = false;
      await venster({ soort: "Vondst", titel: "Een artefact", achterkant: "artefacten", html: await pasToe(h, [{ trek: "artefacten" }]) });
    }
    return;
  }
  const p = S.plekken[plek];
  if (p.scheur) {
    if (S.tutorial) await coach("scheur");
    const kaart = trekKaart(D.ontmoetingen.scheur, () => true);
    await speelKaart(h, kaart, "Aan de andere kant", "art/fiches/scheur.jpg", "scheur");
    if ((h.plek !== plek && !h.ronde.astraal) || !p.scheur) return;
    const lens = h.artefacten.includes("vuurtoren-lens") && h.kenm.scherpte > h.kenm.kennis ? "scherpte" : "kennis";
    const k = await venster({ soort: "Scheur", titel: `De Scheur in ${plekNaam(plek)}`, html: `<p>Probeer je hem te sluiten? (${KNAAM[lens]})</p>`,
      knoppen: [{ label: `Sluiten met 1 Aanwijzing (8)`, waarde: "a", uit: h.aanw < 1 }, { label: "Sluiten zonder Aanwijzing (10)", waarde: "z" }, { label: "Laten", waarde: null, ghost: true }] });
    if (k) {
      if (k === "a") h.aanw--;
      if (await test(h, lens, k === "a" ? 8 : 10, "De Scheur sluiten")) await sluitScheur(h, plek);
      else await melding("De Scheur blijft open", "Het lukt niet. De randen trillen nog na.");
    }
    return;
  }
  if (p.aanw > 0) {
    const kaart = trekKaart(D.ontmoetingen.aanwijzing, () => true);
    const k = await venster({ soort: "Aanwijzing", titel: plekNaam(plek), beeld: `art/plekken/${plek}.jpg`, achterkant: "mysterie", verhaal: kaart.tekst, knoppen: [{ label: "Onderzoeken (Waarneming 7)", waarde: true }] });
    if (k && await test(h, "scherpte", 7, "Een spoor volgen", { context: "ontmoeting" })) { p.aanw--; h.aanw++; log(`${naam} vindt een Aanwijzing in ${plekNaam(plek)}`); }
    return;
  }
  const kaart = trekKaart(D.ontmoetingen.stad, e => e.plek === plek);
  await speelKaart(h, kaart, plekNaam(plek), `art/plekken/${plek}.jpg`, "stad");
}
async function speelKaart(h, kaart, soort, beeld, rug) {
  const naam = korteNaam(heldDef(h).naam);
  const persoon = kaart.persoon ? byId(D.personen, kaart.persoon) : null;
  const pBeeld = persoon && art(`art/personen/${persoon.id}.jpg`) ? `art/personen/${persoon.id}.jpg` : null;
  const kop = { soort, titel: naam, beeld: pBeeld || beeld, zij: !!pBeeld, achterkant: rug, verhaal: kaart.tekst };
  const metWie = persoon ? `<p class="persoonregel"><b>${esc(persoon.naam)}</b> · ${esc(persoon.rol)}</p>` : "";
  const uitkomst = async (ok, uit) => {
    const html = await pasToe(h, uit.effect || []);
    await venster({ soort: ok === null ? soort : ok ? "Gelukt" : "Mislukt", titel: naam, beeld: pBeeld, zij: !!pBeeld, verhaal: uit.tekst, html });
    await controleerHeld(h);
  };
  const doeTest = async t => test(h, t.kenmerk, t.moeilijkheid, t.kenmerk === "kracht" ? "Doorzetten" : "Wat doe je?", { context: "ontmoeting" });
  if (kaart.keuzes) {
    const i = await venster({ ...kop, html: metWie + `<p class="muted">Wat doe je?</p>`, knoppen: kaart.keuzes.map((k, i) => ({ label: k.test ? k.label.replace(/\((\w+) (\d+)\)/, (_, kn, n) => `(${kn} ${+n + MOEILIJKHEID[S.moeilijkheid].test})`) : k.label, waarde: i, uit: !k.test && (k.effect || []).some(e => e.pond < 0 && -e.pond > h.pond) })) });
    const k = kaart.keuzes[i ?? 0];
    if (!k.test) return uitkomst(null, { tekst: k.tekst, effect: k.effect });
    const ok = await doeTest(k.test);
    return uitkomst(ok, ok ? k.gelukt : k.mislukt);
  }
  if (!kaart.test) {
    const html = await pasToe(h, kaart.effect);
    await venster({ ...kop, html: metWie + (kaart.slot ? `<p class="verhaal">${esc(kaart.slot)}</p>` : "") + html });
    await controleerHeld(h); return;
  }
  await venster({ ...kop, html: metWie, knoppen: [{ label: `${KNAAM[kaart.test.kenmerk]}-test (${kaart.test.moeilijkheid + MOEILIJKHEID[S.moeilijkheid].test})`, waarde: true }] });
  const ok = await doeTest(kaart.test);
  await uitkomst(ok, ok ? kaart.gelukt : kaart.mislukt);
}
async function ontmoetingsfase(start = 0) {
  S.fase = "ontmoeting";
  if (start === 0) S.ontmoetingIndex = -1;
  for (let i = start; i < S.helden.length; i++) {
    if (S.einde) return;
    S.actief = i; UI.bekeken = i; opslaan(); teken();
    await ontmoeting(S.helden[i]);
    S.ontmoetingIndex = i;
    geruchtBezoek(S.helden[i].plek);
    if (S.mist <= 0) break;
  }
  if (!S.einde) await onheilsfase();
}

/* ---------- onheilsfase ---------- */
function geruchtBezoek(plek) { S.geruchten = S.geruchten.filter(g => !(g.soort === "bezoek" && g.plek === plek)); }
async function onheilsfase() {
  S.fase = "onheil"; opslaan(); teken();
  if (S.mist <= 0) return ontwaken();
  if (S.tutorial) await coach("onheil");
  if (!S.onheil.length) { S.onheil = schud(S.onheilAfleg); S.onheilAfleg = []; }
  let id = S.onheil.pop();
  let c = byId(D.onheil, id);
  const odile = S.helden.find(h => h.id === "odile-fairweather");
  const knoppen = [{ label: "Uitvoeren", waarde: false }];
  if (odile && !S.voorgevoel) knoppen.push({ label: "Voorgevoel (Odile): negeren", waarde: true, ghost: true });
  const detail = [c.mist ? `Mist −${c.mist}` : "", c.scheur ? `${c.scheur} Scheur${c.scheur > 1 ? "en" : ""}` : "", c.monster ? `${c.monster} monster${c.monster > 1 ? "s" : ""}` : "", c.extra || "", c.gerucht ? "Gerucht: " + c.gerucht : ""].filter(Boolean).join(" · ");
  if (await venster({ soort: `Onheil · ronde ${S.ronde}`, titel: c.naam, beeld: "art/fiches/mist.jpg", zij: true, achterkant: "onheil", geluid: "onheil", verhaal: c.tekst, html: `<p>${esc(detail)}</p>`, knoppen })) {
    S.voorgevoel = true; S.onheilAfleg.push(id);
    if (!S.onheil.length) { S.onheil = schud(S.onheilAfleg); S.onheilAfleg = []; }
    id = S.onheil.pop(); c = byId(D.onheil, id);
    await venster({ soort: "Nieuwe onheilskaart", titel: c.naam, verhaal: c.tekst, html: `<p>${esc([c.mist ? `Mist −${c.mist}` : "", c.extra || "", c.gerucht ? "Gerucht: " + c.gerucht : ""].filter(Boolean).join(" · "))}</p>` });
  }
  S.onheilAfleg.push(id);
  S.mist -= c.mist;
  let voorkeur = null;
  for (const a of c.acties) if (a.type === "voorkeurMonster") voorkeur = a.id;
  for (let i = 0; i < c.scheur; i++) openScheurOp(trekScheurPlek());
  const scheurPlekken = () => Object.keys(S.plekken).filter(p => S.plekken[p].scheur);
  for (let i = 0; i < c.monster; i++) { const sp = scheurPlekken(); spawnMonster(sp.length ? kies1(sp) : kies1(D.bord.plekken).id, voorkeur); }
  for (const a of c.acties) {
    if (a.type === "monsterOp") spawnMonster(a.plek);
    if (a.type === "monsterRivier") spawnMonster(kies1(D.bord.rivier));
    if (a.type === "aanwijzingOp") S.plekken[a.plek].aanw += a.aantal;
    if (a.type === "aanwijzingWillekeurig") legAanwijzing(a.aantal);
    if (a.type === "geestAlle") for (const h of S.helden) { if (a.waarde < 0 && h.spullen.includes("dier-kanarie")) continue; h.G = Math.min(h.maxG, h.G + a.waarde); }
    if (a.type === "lichaamOp") for (const h of S.helden) if (a.plekken.includes(h.plek)) verliesLichaam(h, -a.waarde);
    if (a.type === "artefactKlaar") S.overzee[kies1(D.bord.overzee).id].artefact = true;
    if (a.type === "gezochtRijkste") { const h = [...S.helden].sort((x, y) => y.pond - x.pond)[0]; geefToestand(h, "gezocht"); log(`${korteNaam(heldDef(h).naam)} wordt gezocht`); }
    if (a.type === "monstersBewegen") beweegMonsters(true);
    if (a.type === "keuzeSpreukAanwijzing") for (const h of S.helden) {
      const k = await venster({ soort: "Hulp van de Bleke Lantaarn", titel: korteNaam(heldDef(h).naam), knoppen: [{ label: "Een spreuk", waarde: "s", uit: !kanDragen(h) }, { label: "Een Aanwijzing", waarde: "a" }] });
      await pasToe(h, [k === "s" ? { trek: "spreuken" } : { aanwijzing: 1 }]);
    }
    if (a.type === "gerucht") { S.geruchten.push({ ...a, naam: c.naam }); if (a.soort === "ophalen") S.plekken[a.plek].aanw += a.aantal; }
  }
  /* vaste gevolgen elke ronde */
  beweegMonsters(false);
  for (const { plek, m } of alleMonsters()) { const d = monsterDef(m.id); if (d.aura) for (const h of S.helden) if (h.plek === plek) h.G += d.aura.geest; }
  for (const h of S.helden) {
    if (S.god === "nebet-ankhu" && h.artefacten.length) h.G--;
    if (S.god === "azh-ilareth" && h.plek === "hampstead") h.G = Math.min(h.maxG, h.G + 1);
    if (h.artefacten.includes("kristallen-schedel") && d6() === 1) h.G--;
    if (heeft(h, "verslaafd")) { if (h.pond > 0) h.pond--; else h.G--; }
    if (heeft(h, "schuld") && d6() === 1) verliesLichaam(h, 1);
    if (h.spullen.includes("bondgenoot-straatjongens") && S.ronde % 2 === 0) { if (h.pond > 0) h.pond--; else { h.spullen = h.spullen.filter(x => x !== "bondgenoot-straatjongens"); log("De straatjochies gaan ervandoor: geen penny"); } }
    if (heeft(h, "waanzin-tekenen") && d6() === 1) openScheurOp(h.plek);
  }
  for (const g of S.geruchten) {
    if (g.soort === "ophalen" && S.plekken[g.plek].aanw === 0) g.klaar = true;
    g.rondes--;
    if (!g.klaar && g.rondes <= 0) { S.mist -= g.straf; log(`Gerucht "${g.naam}" loopt slecht af: Mist −${g.straf}`); await melding("Een gerucht wordt waar", `${g.naam}: de Mist daalt met ${g.straf}.`); }
  }
  S.geruchten = S.geruchten.filter(g => !g.klaar && g.rondes > 0);
  const violet = S.helden.find(h => h.id === "violet-thorne" && !isOverzee(h.plek) && S.plekken[h.plek].monsters.length);
  if (violet) {
    const d = await venster({ soort: "Onderschepping", titel: "Violet glipt weg?", html: "<p>Er staat een monster op Violets plek. Ze mag meteen één plek verder reizen.</p>", knoppen: [...burenVan(violet, violet.plek).map(x => ({ label: plekNaam(x), waarde: x })), { label: "Blijven", waarde: null, ghost: true }] });
    if (d) { violet.plek = d; log(`Violet glipt weg naar ${plekNaam(d)}`); }
  }
  await controleerAlles();
  if (S.mist <= 0) return ontwaken();
  S.ronde++; S.rondeGebruikt = {};
  for (const h of S.helden) { h.ronde = { wake: h.ronde.wake }; }
  S.fase = "helden"; S.actief = 0;
  startHeldenbeurt();
}
function beweegMonsters(iedereen) {
  for (const { plek, m } of alleMonsters()) {
    const d = monsterDef(m.id);
    if (S.helden.some(h => h.plek === plek && !iedereen && d.beweging?.type !== "springNaarHeld")) continue;
    let doel = plek;
    const heldPlekken = S.helden.filter(h => !heeft(h, "verdwaald")).map(h => h.plek).filter(p => !isOverzee(p));
    if (iedereen && !d.beweging) { if (heldPlekken.length) { const dist = afstanden(plek); doel = stapNaar(plek, heldPlekken.sort((a, b) => (dist[a] ?? 99) - (dist[b] ?? 99))[0]); } }
    else if (!d.beweging) continue;
    else if (d.beweging.type === "naarHeld" && heldPlekken.length) { const dist = afstanden(plek); doel = stapNaar(plek, heldPlekken.sort((a, b) => (dist[a] ?? 99) - (dist[b] ?? 99))[0]); }
    else if (d.beweging.type === "willekeurig") { for (let i = 0; i < d.beweging.stappen; i++) doel = kies1([...BUREN[doel]]); }
    else if (d.beweging.type === "naarArtefact") { const h = [...S.helden].filter(h => !isOverzee(h.plek)).sort((a, b) => b.artefacten.length - a.artefacten.length)[0]; if (h && h.artefacten.length) doel = stapNaar(plek, h.plek); }
    else if (d.beweging.type === "springNaarHeld" && heldPlekken.length) doel = kies1(heldPlekken);
    if (d.alleenRivier && !D.bord.rivier.includes(doel)) continue;
    if (beschermd(doel)) continue;
    if (doel !== plek) { verwijderMonster(plek, m.uid); S.plekken[doel].monsters.push(m); }
  }
}
function einde() { S.einde = S.mist <= 0 ? "verlies" : "winst"; opslaan(); teken(); }
async function ontwaken() {
  const g = god();
  if (S.moeilijkheid === "genadeloos") return einde();
  S.fase = "finale";
  if (S.verzet == null) {
    S.verzet = (S.nodig - S.opgelost) * 3 + 3 + (S.helden.length === 4 ? 2 : 0);
    log(`${g.naam} ontwaakt. De laatste nacht begint.`);
    const img = art(`art/goden/${g.id}.jpg`);
    await venster({ soort: "De Mist is op", titel: `${g.naam} ontwaakt`, breed: true, html: `${img ? `<img class="godintro" src="${img}" alt="">` : ""}
      <p class="verhaal">${esc(g.ontwaken.replace(/ Jullie verliezen\.?$/, ""))}</p>
      <p><b>De laatste nacht.</b> Er is nog één kans. ${esc(g.naam)} heeft <b>${S.verzet} verzet</b>. Om de beurt weerstaat elke held de blik van de god (Kennis 9, anders −2 Geest) en valt aan (Kracht met wapens, of Kennis met +1 per spreuk, tegen ${10 + (MOEILIJKHEID[S.moeilijkheid].finale || 0)}). Elke geslaagde aanval kost de god 1 verzet. Na elke ronde verliest iedereen 1 Lichaam en 1 Geest. Wie op 0 komt, valt af.</p>
      <p class="muted">Elk opgelost mysterie maakt deze nacht makkelijker.</p>`, knoppen: [{ label: "De laatste nacht in", waarde: true }] });
  }
  opslaan(); teken();
  const levend = () => S.helden.filter(h => !h.uit);
  let veiligheid = 0;
  while (S.verzet > 0 && levend().length && veiligheid++ < 30) {
    for (const h of levend()) {
      S.actief = S.helden.indexOf(h); UI.bekeken = S.actief; teken();
      const naam = korteNaam(heldDef(h).naam);
      if (!await test(h, "kennis", 9, `De blik van ${g.naam}`)) h.G -= 2;
      if (h.G <= 0) { h.uit = true; await melding(`${naam} valt`, `${naam} kan de blik van ${g.naam} niet verdragen.`, "De laatste nacht"); continue; }
      const spreuk = Math.min(2, h.spreuken.length);
      const opties = [{ label: `Kracht + wapens (+${wapenBonus(h, false)})`, waarde: "kracht" }];
      if (spreuk) opties.push({ label: `Kennis + spreuken (+${spreuk})`, waarde: "kennis" });
      const k = opties.length > 1 ? await venster({ soort: "De laatste nacht", titel: `${naam} valt aan`, html: `<p>Nog <b>${S.verzet}</b> verzet.</p>`, knoppen: opties }) : "kracht";
      if (await test(h, k, 10 + (MOEILIJKHEID[S.moeilijkheid].finale || 0), `Aanval op ${g.naam}`, { bonus: k === "kracht" ? wapenBonus(h, false) : spreuk })) { S.verzet--; log(`${naam} raakt ${g.naam}: nog ${S.verzet} verzet`); }
      opslaan();
      if (S.verzet <= 0) break;
    }
    if (S.verzet <= 0) break;
    for (const h of levend()) { verliesLichaam(h, 1); h.G -= 1; if (h.L <= 0 || h.G <= 0) { h.uit = true; log(`${korteNaam(heldDef(h).naam)} valt in de laatste nacht`); } }
    if (levend().length) await melding("De god slaat terug", `${g.naam} beukt op jullie in. Iedereen verliest 1 Lichaam en 1 Geest. Nog ${S.verzet} verzet.`, "De laatste nacht");
  }
  S.einde = S.verzet <= 0 ? "nipt" : "verlies"; opslaan(); teken();
}

/* ---------- beurtverloop ---------- */
async function beurtKlaar() {
  if (S.actief < S.helden.length - 1) { S.actief++; startHeldenbeurt(); return; }
  await ontmoetingsfase(0);
}

/* ---------- tutorial en tips ---------- */
const COACH = {
  start: ["Welkom in Londen, 1888", `<p>Jullie spelen samen tegen <b>Vathrûn</b>, iets dat onder de Theems ademt. Bovenaan zie je de <b>Mist</b>: elke ronde daalt hij. Staat hij op 0, dan verliezen jullie.</p><p>Jullie winnen door <b>2 mysteries</b> op te lossen. Het huidige mysterie staat rechts, in het groene kader.</p><p>Je speelt met <b>Hester</b> (bibliothecaris) en <b>Silas</b> (detective). Hester is als eerste aan de beurt.</p>`],
  beurt: ["Jouw beurt", `<p>Elke held doet <b>2 verschillende acties</b> per ronde. Plekken waar je heen kunt, lichten groen op: tik erop om te reizen.</p><p>De knoppen rechts zijn de andere acties: <b>rusten</b>, de <b>dienst</b> van de plek (winkelen, studeren, genezen…), <b>ruilen</b> met een held op dezelfde plek en het <b>mysterie</b>. Spreuken spreek je uit bij je kaarten.</p><p>Ben je klaar? Tik op <b>Beurt klaar</b>. Onder <b>Tip</b> zie je steeds een suggestie.</p>`],
  dienst: ["Diensten", `<p>Elke plek heeft een eigen dienst. In Bloomsbury studeer je spreuken, op markten koop je spullen, in The City laat je je verzorgen of leen je geld. In de handleiding staat het hele overzicht.</p>`],
  ontmoeting: ["Ontmoetingen", `<p>Na de heldenfase krijgt elke held een <b>ontmoeting</b> op de plek waar hij staat:</p><ol><li>Staat er een monster? Dan vecht je.</li><li>Is er een Scheur? Dan stap je erdoor, en daarna mag je hem proberen te sluiten.</li><li>Ligt er een Aanwijzing (groen bolletje)? Dan volg je het spoor.</li><li>Anders trek je een verhaal van die wijk. Lees het gerust hardop voor.</li></ol>`],
  test: ["Een test", `<p>Bij een test gooi je <b>twee dobbelstenen</b> en tel je je <b>kenmerk</b> erbij, bijvoorbeeld Kennis of Kracht. Haal je het getal achter "nodig", dan lukt het.</p><p>Mislukt het? Soms kun je opnieuw gooien: met een <b>Aanwijzing</b> (bij Kennis en Waarneming), als je <b>Gezegend</b> bent of met een vermogen van je held.</p>`],
  gevecht: ["Een gevecht", `<p>Eerst de <b>Gruwel</b>: een Kennis-test. Mislukt die, dan verlies je Geest.</p><p>Daarna vecht je met <b>Kracht plus je wapens</b> tegen de <b>Taaiheid</b> van het monster. Win je, dan verliest het monster 1 leven. Verlies je, dan verlies je Lichaam. Een verslagen monster levert een <b>Trofee</b> op.</p>`],
  scheur: ["Een Scheur", `<p>Een paars omrande plek heeft een <b>Scheur</b>: een opening naar ergens anders. Na de ontmoeting mag je hem sluiten met een Kennis-test (8) en 1 Aanwijzing, of zonder Aanwijzing (10). Elke gesloten Scheur is een Trofee waard, en soms hoort het bij een mysterie.</p>`],
  onheil: ["Onheil", `<p>Aan het eind van elke ronde trekt de app een <b>Onheilskaart</b>. De Mist daalt, Scheuren gaan open, monsters verschijnen of bewegen. Soms komt er een <b>gerucht</b>: een opdracht met een deadline.</p>`],
  ronde2: ["Ronde 2", `<p>Je kent nu de hele ronde. Een paar tips:</p><ul><li>Verzamel <b>Aanwijzingen</b>. Je hebt ze nodig voor het mysterie en om Scheuren te sluiten.</li><li>Met <b>3 Trofeeën</b> kun je groeien: een beter kenmerk, meer Lichaam of Geest, of een spreuk.</li><li>Is je Lichaam of Geest laag? Rust dan, of ga naar The City of de gaarkeuken in Spitalfields.</li></ul><p>Je kunt de tutorial altijd uitzetten. De tips blijven dan nog wel staan.</p>`],
  lichaam0: ["Lichaam op 0", `<p>Je held raakt gewond en wordt naar het ziekenhuis in The City gebracht. Je speelt gewoon verder, maar met de toestand <b>Gewond</b> heb je maar 1 actie per ronde, tot je die in The City laat verwijderen.</p>`],
  geest0: ["Geest op 0", `<p>Je held krijgt een <b>Waanzin</b>-kaart. Die geeft een nadeel tot je hem in Chelsea laat wegschilderen. Je Geest gaat terug naar de helft.</p>`]
};
async function coach(id) {
  if (!S || !S.tutorial || !COACH[id]) return;
  S.coachGezien ??= [];
  if (S.coachGezien.includes(id)) return;
  S.coachGezien.push(id); opslaan();
  const [titel, html] = COACH[id];
  const k = await venster({ soort: "Uitleg", titel, html, knoppen: [{ label: "Begrepen", waarde: true }, { label: "Tutorial uitzetten", waarde: false, ghost: true }] });
  if (k === false) { S.tutorial = false; UI.tips = true; opslaan(); }
}
function dichtsbij(h, filter) {
  const dist = afstanden(isOverzee(h.plek) ? "st-katharine-docks" : h.plek);
  return Object.keys(S.plekken).filter(filter).sort((a, b) => (dist[a] ?? 99) - (dist[b] ?? 99)).map(p => [p, dist[p] ?? 99])[0];
}
function advies(h) {
  const m = mysterie(), ma = mysterieActie(h), p = S.plekken[h.plek];
  if (heeft(h, "verdwaald")) return "Je bent verdwaald. Doe de Waarneming-test om de weg terug te vinden.";
  if (ma && ma.kan) return `Je staat op de goede plek: gebruik de knop <b>${esc(ma.label)}</b>.`;
  if (p && p.monsters.length && (h.L <= 2 || h.G <= 2)) return "Er staat een monster op je plek en je bent verzwakt. Reis weg voordat de ontmoetingen beginnen.";
  if (h.L <= 2) return "Je Lichaam is laag. Rust, of laat je verzorgen in The City.";
  if (h.G <= 2) return "Je Geest is laag. Rust, of ga eten in de gaarkeuken in Spitalfields.";
  if (h.trofee >= 3) return "Je hebt 3 Trofeeën: tik op <b>Groeien</b> voor een verbetering.";
  if (m?.type === "aanwijzingen") {
    const samen = S.helden.reduce((s, x) => s + x.aanw, 0);
    if (samen >= m.aantal) return `Jullie hebben samen genoeg Aanwijzingen. Ga met ${m.aantal} Aanwijzingen naar <b>${esc(plekNaam(m.plek))}</b>.`;
    const d = dichtsbij(h, x => S.plekken[x].aanw > 0);
    if (d) return `Jullie hebben ${samen} van ${m.aantal} Aanwijzingen. De dichtstbijzijnde ligt in <b>${esc(plekNaam(d[0]))}</b> (${d[1]} stap${d[1] === 1 ? "" : "pen"}). Sta je daar aan het eind van de ronde, dan krijg je een ontmoeting om hem te vinden.`;
  }
  if (m?.type === "scheuren") { const d = dichtsbij(h, x => S.plekken[x].scheur && (!m.rivier || D.bord.rivier.includes(x))); if (d) return `Sluit Scheuren voor het mysterie. De dichtstbijzijnde is in <b>${esc(plekNaam(d[0]))}</b>. Neem een Aanwijzing mee: dan is sluiten makkelijker.`; }
  if (m?.type === "episch") return `Het epische monster staat in <b>${esc(plekNaam(m.plek))}</b>. Ga er samen heen met wapens of spreuken, en het liefst met volle Lichaam en Geest.`;
  if (m?.type === "test") return isOverzee(h.plek) ? `Je bent overzee.` : `Reis naar St Katharine Docks en koop daar een bootkaartje (2 Pond) naar <b>${esc(plekNaam(m.plek))}</b>.`;
  if (m?.type === "artefacten") return `Verzamel ${m.aantal} Artefacten en breng ze naar <b>${esc(plekNaam(m.plek))}</b>. Artefacten vind je vooral overzee, via St Katharine Docks.`;
  if (m?.type === "breng") return S.helden.some(x => x.mysterieVoorwerp) ? `Breng ${esc(m.voorwerp)} naar <b>${esc(plekNaam(m.naar))}</b>.` : `Reis via St Katharine Docks naar <b>${esc(plekNaam(m.van))}</b> en zoek daar ${esc(m.voorwerp)}.`;
  if (h.pond >= 2 && h.spullen.length < 2) return "Je hebt geld en weinig spullen. Op een markt (Covent Garden, Southwark, Limehouse) kun je winkelen.";
  return "Verzamel Aanwijzingen en sluit Scheuren voordat de Mist op is.";
}

/* ---------- handleiding ---------- */
function md(src) {
  const out = []; let list = null, table = null;
  const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const flush = () => {
    if (list) { out.push(`<${list.t}>${list.items.map(i => `<li>${i}</li>`).join("")}</${list.t}>`); list = null; }
    if (table) { out.push(`<div class="tabelvlak"><table>${table.map((r, i) => `<tr>${r.map(c => i ? `<td>${inline(c)}</td>` : `<th>${inline(c)}</th>`).join("")}</tr>`).join("")}</table></div>`); table = null; }
  };
  for (const line of src.split("\n")) {
    let m;
    if (/^\|/.test(line)) { if (/^\|[-| :]+\|$/.test(line)) continue; (table ??= []).push(line.slice(1, -1).split("|").map(x => x.trim())); continue; }
    if ((m = line.match(/^(#{1,3}) (.*)/))) { flush(); if (m[1].length === 1) continue; out.push(`<h${m[1].length + 1}>${inline(m[2])}</h${m[1].length + 1}>`); continue; }
    if ((m = line.match(/^- (.*)/))) { if (!list || list.t !== "ul") { flush(); list = { t: "ul", items: [] }; } list.items.push(inline(m[1])); continue; }
    if ((m = line.match(/^\d+\. (.*)/))) { if (!list || list.t !== "ol") { flush(); list = { t: "ol", items: [] }; } list.items.push(inline(m[1])); continue; }
    if (!line.trim()) { flush(); continue; }
    flush(); out.push(`<p>${inline(line)}</p>`);
  }
  flush(); return out.join("");
}
const HTABS = [["handleiding", "Handleiding"], ["helden", "Helden"], ["plekken", "Plekken"], ["monsters", "Monsters"], ["spreuken", "Spreuken"], ["spullen", "Spullen"], ["artefacten", "Artefacten"], ["toestanden", "Toestanden"]];
function tekenHandleiding() {
  const el = document.getElementById("handboek");
  if (!UI.handboek) { el.hidden = true; el.innerHTML = ""; return; }
  const t = UI.handboek;
  const kaart = (kind, titel, body) => `<div class="kaartje"><span class="muted">${esc(kind)}</span><b>${esc(titel)}</b>${body}</div>`;
  const views = {
    handleiding: () => `<article class="tekst">${md(D.handleiding)}</article>`,
    helden: () => `<div class="raster">${D.helden.map(h => `<div class="kaartje">${art(`art/helden/${h.id}.jpg`) ? `<img class="mini-portret" src="art/helden/${h.id}.jpg" alt="">` : ""}<b>${esc(h.naam)}</b><span class="muted">${esc(h.rol)} · start ${esc(h.start)} · Lichaam ${h.lichaam} · Geest ${h.geest}</span><span>${KENMERKEN.map(([k, l]) => `${l} ${h.kenmerken[k]}`).join(" · ")}</span><span><b>${esc(h.vermogen.naam)}.</b> ${esc(h.vermogen.tekst)}</span>${h.bondgenoot ? `<span><b>${esc(h.bondgenoot.naam)}.</b> ${esc(h.bondgenoot.tekst)}</span>` : ""}</div>`).join("")}</div>`,
    plekken: () => `<div class="raster">${D.bord.plekken.map(p => kaart(DIENSTLABEL[p.dienst] || p.dienst, p.naam, `<span>${esc(D.bord.diensten[p.dienst])}</span><span class="muted">${esc(p.sfeer)}</span>`)).join("")}${D.bord.overzee.map(o => kaart("Overzee", o.naam, `<span class="muted">${esc(o.sfeer)}</span>`)).join("")}</div>`,
    monsters: () => `<div class="raster">${[...D.epische, ...D.monsters].map(m => kaart(byId(D.epische, m.id) ? "Episch" : "Monster", m.naam, `<span>Gruwel ${m.gruwel} · Taaiheid ${m.taaiheid} · Schade ${m.schade} · Leven ${m.leven}</span><span>${esc(m.eigenschap)}</span>`)).join("")}</div>`,
    spreuken: () => `<div class="raster">${D.spreuken.map(x => kaart(x.soort, x.naam, `<span class="muted">${KNAAM[x.test]} ${x.moeilijkheid} · prijs: ${esc(x.prijs)}</span><span>${esc(x.tekst)}</span>`)).join("")}</div>`,
    spullen: () => `<div class="raster">${D.spullen.map(x => kaart(`${x.soort} · ${x.prijs} Pond`, x.naam, `<span>${esc(x.tekst)}</span>`)).join("")}</div>`,
    artefacten: () => `<div class="raster">${D.artefacten.map(x => kaart(x.herkomst, x.naam, `<span>${esc(x.tekst)}</span>`)).join("")}</div>`,
    toestanden: () => `<div class="raster">${D.toestanden.map(x => kaart(x.soort, x.naam, `<span>${esc(x.tekst)}</span>`)).join("")}</div>`
  };
  el.hidden = false;
  el.innerHTML = `<div class="hb-kop"><h2>Handleiding</h2><button class="btn small" data-hb="sluit">Sluiten</button></div>
    <nav class="hb-tabs">${HTABS.map(([id, l]) => `<button class="tab" data-hb="${id}" aria-pressed="${t === id}">${l}</button>`).join("")}</nav>
    <div class="hb-inhoud">${views[t]()}</div>`;
}

async function godIntro(begin) {
  const g = god(), img = art(`art/goden/${g.id}.jpg`), mys = mysterie();
  await venster({ soort: begin ? "Een nieuw spel begint" : "De oude god", titel: `${g.naam}, ${g.titel}`, breed: true,
    html: `${img ? `<img class="godintro" src="${img}" alt="">` : ""}<p class="verhaal">${esc(g.verhaal)}</p>
      <p><b>Speciale regel:</b> ${esc(g.regel)}</p><p><b>Tegenspelers:</b> ${esc(g.verdachten)}</p>
      ${mys ? `<p><b>Eerste mysterie: ${esc(mys.naam)}.</b> ${esc(mys.doel)}</p>` : ""}
      <p class="muted">Los ${S.nodig} mysteries op voordat de Mist (nu ${S.mist}) op 0 staat.</p>`,
    knoppen: [{ label: begin ? "Aan de slag" : "Sluiten", waarde: true }] });
}

function kiesGroei(h) {
  const pips = (n, max = 5) => `<span class="pips">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? "aan" : ""}"></i>`).join("")}</span>`;
  const opties = [...KENMERKEN.map(([k, l]) => ({ label: l, waarde: k, nu: h.kenm[k], max: 5, uitleg: KUITLEG[k], pips: true })),
    { label: "Lichaam", waarde: "L", nu: h.maxL, max: 12, uitleg: "Hoeveel klappen je kunt opvangen" },
    { label: "Geest", waarde: "G", nu: h.maxG, max: 12, uitleg: "Hoeveel gruwel je kunt verdragen" }];
  const knoppen = [...opties.map(o => ({ label: o.label, waarde: o.waarde, uit: o.nu >= o.max, verberg: true })), { label: "Een nieuwe spreuk", waarde: "S", ghost: true }, { label: "Toch niet", waarde: null, ghost: true }];
  const html = `<p>Je hebt <b>${h.trofee} Trofeeën</b>. Voor 3 Trofeeën verhoog je één waarde met 1. Tik aan wat je wilt verbeteren.</p>
    <div class="groeilijst">${opties.map((o, i) => `<button class="groeirij" data-knop="${i}" ${o.nu >= o.max ? "disabled" : ""}>
      <span class="gn"><b>${o.label}</b><small>${esc(o.uitleg)}</small></span>${o.pips ? pips(o.nu) : `<span></span>`}
      <span class="gw">${o.nu} → <b>${o.nu + 1}</b></span></button>`).join("")}</div>`;
  return venster({ soort: "Groei", titel: `${korteNaam(heldDef(h).naam)} wordt sterker`, html, knoppen });
}
async function groei(h, k) {
  if (h.trofee < 3) return;
  h.trofee -= 3;
  if (k === "L") { h.maxL++; h.L++; } else if (k === "G") { h.maxG++; h.G++; } else if (k === "S") await pasToe(h, [{ trek: "spreuken" }]); else h.kenm[k] = Math.min(5, h.kenm[k] + 1);
  log(`${korteNaam(heldDef(h).naam)} groeit`); await controleerHeld(h); opslaan();
}

/* ---------- heldenprofiel bij de keuze ---------- */
function profielHtml(h) {
  const img = art(`art/helden/${h.id}.jpg`);
  const pips = n => `<span class="pips">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? "aan" : ""}"></i>`).join("")}</span>`;
  const uitrusting = h.uitrusting.map(u => {
    const pk = D.persoonlijk.find(x => x.held === h.id && x.naam === u);
    if (pk) { const pimg = art(`art/persoonlijk/${pk.id}.jpg`); return `<li>${pimg ? `<img class="uitr-ico" src="${pimg}" alt="">` : ""}<b>${esc(u)}</b>: ${esc(pk.tekst)}</li>`; }
    const w = STARTWAPENS[u];
    return `<li>${esc(u)}${w ? ` <span class="muted">(+${w} bij gevechten)</span>` : /spreuk/.test(u) ? ` <span class="muted">(een willekeurige spreuk)</span>` : ""}</li>`;
  }).join("");
  return `<div class="profiel">
    <div class="profiel-beeld">${img ? `<img src="${img}" alt="Portret van ${esc(h.naam)}">` : `<span class="leeg">${esc(initialen(h.naam))}</span>`}</div>
    <div class="profiel-info">
      <p class="muted">${esc(h.rol)} · ${h.leeftijd} jaar · ${esc(h.beroep)}<br>Begint in <b>${esc(h.start)}</b></p>
      <p class="verhaal">${esc(h.achtergrond)}</p>
      <div class="profiel-stats">
        ${KENMERKEN.map(([k, l]) => `<span>${l}<small>${esc(KUITLEG[k])}</small></span>${pips(h.kenmerken[k])}<b>${h.kenmerken[k]}</b>`).join("")}
      </div>
      <div class="pools"><div>Lichaam<b>${h.lichaam}</b></div><div>Geest<b>${h.geest}</b></div><div>Pond<b>${2 + (h.uitrusting.some(u => /Pond$/.test(u)) ? parseInt(h.uitrusting.find(u => /Pond$/.test(u)), 10) : 0)}</b></div></div>
      <div class="vermogen"><b>Vermogen: ${esc(h.vermogen.naam)}.</b> ${esc(h.vermogen.tekst)}</div>
      ${h.bondgenoot ? `<div class="vermogen"><b>${esc(h.bondgenoot.naam)}</b> (${esc(h.bondgenoot.soort)}). ${esc(h.bondgenoot.tekst)}</div>` : ""}
      <div><b>Uitrusting</b><ul class="kort">${uitrusting}</ul></div>
      <p><b>Eigenaardigheid:</b> ${esc(h.eigenaardigheid)}</p>
    </div></div>`;
}
async function toonHeld(id) {
  const u = UI.start;
  while (id) {
    const h = byId(D.helden, id), i = D.helden.indexOf(h);
    const gekozen = u.helden.includes(id), vol = u.helden.length >= u.aantal;
    const keuze = await venster({ soort: `Held ${i + 1} van ${D.helden.length}`, titel: h.naam, html: profielHtml(h), breed: true, knoppen: [
      gekozen ? { label: "Niet meer kiezen", waarde: "uit", ghost: true } : { label: vol ? `Al ${u.aantal} helden gekozen` : "Kies deze held", waarde: "kies", uit: vol },
      { label: "‹ Vorige", waarde: "vorige", ghost: true }, { label: "Volgende ›", waarde: "volgende", ghost: true }, { label: "Sluiten", waarde: null, ghost: true }] });
    if (keuze === "kies") { u.helden = [...u.helden, id]; teken(); }
    else if (keuze === "uit") { u.helden = u.helden.filter(x => x !== id); teken(); }
    else if (keuze === "vorige") id = D.helden[(i - 1 + D.helden.length) % D.helden.length].id;
    else if (keuze === "volgende") id = D.helden[(i + 1) % D.helden.length].id;
    else id = null;
    if (keuze === "kies" && u.helden.length >= u.aantal) id = null;
  }
}

/* ---------- tekenen ---------- */
function teken() {
  if (!D || window.__bot) return;
  if (!S) return tekenStart();
  if (S.einde) return tekenEinde();
  const g = god(), mys = mysterie();
  app.innerHTML = `<div class="spel">
    <header class="balk">
      <button class="godknop" data-act="god" title="Over ${esc(g.naam)}"><h1>${esc(g.naam)}</h1></button>
      <span class="stat">Ronde <b>${S.ronde}</b></span>
      <span class="stat">${{ helden: "Heldenfase", ontmoeting: "Ontmoetingen", onheil: "Onheil", finale: "De laatste nacht" }[S.fase]}</span>
      <span class="stat" title="Mist">Mist <b>${S.mist}</b></span>
      <span class="mistbalk" aria-hidden="true">${Array.from({ length: S.mistStart || g.mist }, (_, i) => `<i class="${i < S.mist ? "" : "weg"}"></i>`).join("")}</span>
      <span class="stat">Mysteries <b>${S.opgelost}/${S.nodig}</b>${mys ? `: ${esc(mys.naam)}` : ""}</span>
      ${S.fase === "helden" ? `<span class="stat beurtchip" style="--kleur:${KLEUREN[S.actief]}">Aan de beurt: <b>${esc(korteNaam(heldDef(actief()).naam))}</b></span>` : ""}
      <div class="rechts"><button class="btn small ghost" data-act="geluid" aria-pressed="${Geluid.aan}">${Geluid.aan ? "Geluid uit" : "Geluid aan"}</button><button class="btn small ghost" data-act="tips" aria-pressed="${!!(S.tutorial || UI.tips)}">${S.tutorial || UI.tips ? "Tips uit" : "Tips aan"}</button><button class="btn small ghost" data-act="handboek">Handleiding</button><button class="btn small ghost" data-act="stoppen">Stoppen</button></div>
    </header>
    <div class="bordvlak">${tekenBord()}<div id="plekinfo" class="plekinfo" hidden></div>${legendaHtml()}</div>
    <aside class="paneel">${tekenPaneel()}</aside>
  </div>`;
}
function tekenBord() {
  const b = D.bord, h = actief(), reik = bereikbaar(h);
  const bg = art("art/bord/londen.jpg");
  const anim = UI.reis && Date.now() - UI.reis.t < 1500 ? UI.reis : null; UI.reis = null;
  const P = Object.fromEntries(b.plekken.map(p => [p.id, p]));
  const mistDikte = Math.max(0, Math.min(1, 1 - S.mist / (S.mistStart || 12)));
  const tokens = b.plekken.map(p => {
    const s = S.plekken[p.id], hier = S.helden.map((x, i) => [x, i]).filter(([x]) => x.plek === p.id && !x.uit);
    const img = art(`art/plekken/${p.id}.jpg`), bereik = reik.includes(p.id);
    return `<g class="plek${bereik ? " bereik" : ""}${s.scheur ? " open" : ""}" data-plek="${p.id}" tabindex="0" role="button" aria-label="${bereik ? "Reis naar " : ""}${esc(p.naam)}">
      ${bereik ? `<circle class="reikring" cx="${p.x}" cy="${p.y}" r="28"/>` : ""}
      ${s.scheur ? `<circle class="scheurgloed" cx="${p.x}" cy="${p.y}" r="31"/><circle class="scheurring" cx="${p.x}" cy="${p.y}" r="26"/>` : ""}
      <clipPath id="pk-${p.id}"><circle cx="${p.x}" cy="${p.y}" r="19"/></clipPath>
      <circle class="medaillon${p.rivier ? " rivier" : ""}" cx="${p.x}" cy="${p.y}" r="21"/>
      ${img ? `<image href="${img}" x="${p.x - 19}" y="${p.y - 19}" width="38" height="38" clip-path="url(#pk-${p.id})" preserveAspectRatio="xMidYMid slice"/>` : `<circle class="kern" cx="${p.x}" cy="${p.y}" r="17"/>`}
      <text class="plaatsnaam" x="${p.x}" y="${p.y + 40}" text-anchor="middle">${esc(p.naam)}</text>
      ${STATIONS.includes(p.id) ? `<g class="station"><rect x="${p.x + 13}" y="${p.y - 31}" width="15" height="15" rx="3"/><text x="${p.x + 20.5}" y="${p.y - 19.5}" text-anchor="middle">U</text></g>` : ""}
      ${s.aanw ? aanwToken(p.x - 27, p.y - 21, s.aanw, p.id) : ""}
      ${s.monsters.map((m, i) => monsterToken(m, p.x + 27 + i * 21, p.y - 22)).join("")}
      ${hier.map(([x, i], k) => heldFiche(x, i, p.x - 18 + k * 24, p.y + 6, anim)).join("")}
    </g>`;
  }).join("");
  const overzee = b.overzee.map((o, i) => {
    const y = 34 + i * 70, hier = S.helden.map((x, j) => [x, j]).filter(([x]) => x.plek === o.id && !x.uit), img = art(`art/plekken/${o.id}.jpg`), bereik = reik.includes(o.id);
    return `<g class="overzee${bereik ? " bereik" : ""}" data-plek="${o.id}" tabindex="0" role="button" aria-label="${esc(o.naam)}">
      <clipPath id="oz-${o.id}"><rect x="772" y="${y}" width="212" height="58" rx="5"/></clipPath>
      <rect class="oz-rand" x="770" y="${y - 2}" width="216" height="62" rx="6"/>
      ${img ? `<image href="${img}" x="772" y="${y}" width="212" height="58" clip-path="url(#oz-${o.id})" preserveAspectRatio="xMidYMid slice"/>` : ""}
      <rect class="oz-band" x="772" y="${y + 34}" width="212" height="24" clip-path="url(#oz-${o.id})"/>
      <text class="oz-naam" x="782" y="${y + 51}">${esc(o.naam.split(",")[0])}</text>
      ${S.overzee[o.id].artefact ? `<text class="oz-vondst" x="976" y="${y + 51}" text-anchor="end">artefact!</text>` : ""}
      ${hier.map(([x, j], k) => heldFiche(x, j, 960 - k * 26, y + 18, anim)).join("")}</g>`;
  }).join("");
  const spoor = anim ? (() => { const naar = P[anim.naar] || { x: 870, y: 100 }; return `<line class="spoor" x1="${anim.van.x}" y1="${anim.van.y}" x2="${naar.x}" y2="${naar.y}"/>`; })() : "";
  return `<svg class="bord" viewBox="0 0 ${b.breedte} ${b.hoogte}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Speelbord van Londen">
    <defs>
      <radialGradient id="vignet" cx="50%" cy="50%" r="70%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient>
      <radialGradient id="mistvlek"><stop offset="0%" stop-color="#d9cf9a" stop-opacity=".55"/><stop offset="100%" stop-color="#d9cf9a" stop-opacity="0"/></radialGradient>
    </defs>
    ${bg ? `<image href="${bg}" x="0" y="0" width="${b.breedte}" height="${b.hoogte}" preserveAspectRatio="xMidYMid slice"/>` : `<rect width="${b.breedte}" height="${b.hoogte}" class="bordgrond"/><path d="${b.rivierpad}" fill="none" stroke="var(--river)" stroke-width="40" opacity=".75" stroke-linecap="round"/>`}
    <rect width="${b.breedte}" height="${b.hoogte}" fill="url(#vignet)" pointer-events="none"/>
    <line class="bootlijn" x1="${P["st-katharine-docks"].x}" y1="${P["st-katharine-docks"].y}" x2="770" y2="160"/>
    ${b.routes.map(([a, c]) => `<line class="weg-onder" x1="${P[a].x}" y1="${P[a].y}" x2="${P[c].x}" y2="${P[c].y}"/><line class="weg" x1="${P[a].x}" y1="${P[a].y}" x2="${P[c].x}" y2="${P[c].y}"/>`).join("")}
    ${spoor}
    ${tokens}${overzee}
    <g class="mistlaag" pointer-events="none" style="opacity:${(0.12 + 0.55 * mistDikte).toFixed(2)}">
      <ellipse class="mist1" cx="300" cy="420" rx="420" ry="160" fill="url(#mistvlek)"/>
      <ellipse class="mist2" cx="700" cy="300" rx="380" ry="140" fill="url(#mistvlek)"/>
      <ellipse class="mist3" cx="520" cy="600" rx="460" ry="120" fill="url(#mistvlek)"/>
    </g>
  </svg>`;
}
function aanwToken(x, y, n, id) {
  const img = art("art/fiches/aanwijzing.jpg");
  return `<g class="aanwtoken"><clipPath id="aw-${id}"><circle cx="${x}" cy="${y}" r="11"/></clipPath>
    ${img ? `<image href="${img}" x="${x - 14}" y="${y - 14}" width="28" height="28" clip-path="url(#aw-${id})"/>` : `<circle class="aanw" cx="${x}" cy="${y}" r="11"/>`}
    <circle class="aanwrand" cx="${x}" cy="${y}" r="11"/>${n > 1 ? `<circle class="telbol" cx="${x - 9}" cy="${y - 9}" r="7"/><text class="teltekst" x="${x - 9}" y="${y - 5.5}" text-anchor="middle">${n}</text>` : ""}</g>`;
}
function monsterToken(m, x, y) {
  const d = monsterDef(m.id), ep = !!byId(D.epische, m.id), r = ep ? 14 : 11, img = art(`art/monsters/${m.id}.jpg`);
  return `<g class="montoken${ep ? " episch" : ""}"><title>${esc(d.naam)} (Gruwel ${d.gruwel}, Taaiheid ${d.taaiheid}, nog ${m.leven} leven)</title>
    <clipPath id="mt-${m.uid}"><circle cx="${x}" cy="${y}" r="${r}"/></clipPath>
    <circle class="monrand" cx="${x}" cy="${y}" r="${r + 2}"/>
    ${img ? `<image href="${img}" x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}" clip-path="url(#mt-${m.uid})" preserveAspectRatio="xMidYMin slice"/>` : `<text class="mon-t" x="${x}" y="${y + 4}" text-anchor="middle">${ep ? "★" : esc(d.naam[0])}</text>`}</g>`;
}
function heldFiche(x, i, cx, cy, anim) {
  const img = art(`art/helden/${x.id}.jpg`), beurt = i === S.actief && S.fase === "helden", r = beurt ? 16 : 12;
  const reist = anim && anim.i === i;
  return `<g class="held${beurt ? " beurt" : ""}${reist ? " reist" : ""}"${reist ? ` style="--dx:${(anim.van.x - cx).toFixed(1)}px;--dy:${(anim.van.y - cy).toFixed(1)}px"` : ""}><title>${esc(heldDef(x).naam)}${beurt ? " (aan de beurt)" : ""}</title>
    ${beurt ? `<circle class="beurtgloed" cx="${cx}" cy="${cy}" r="${r + 8}" fill="${KLEUREN[i]}"/>` : ""}
    <clipPath id="clip-${x.id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>
    <circle class="heldrand" cx="${cx}" cy="${cy}" r="${r + 2.5}" fill="${KLEUREN[i]}"/>
    ${img ? `<image href="${img}" x="${cx - r}" y="${cy - r * 0.8}" width="${r * 2}" height="${r * 2.67}" clip-path="url(#clip-${x.id})" preserveAspectRatio="xMidYMin slice"/>` : `<text class="held-t" x="${cx}" y="${cy + 4}" text-anchor="middle">${esc(initialen(heldDef(x).naam))}</text>`}</g>`;
}
function legendaHtml() {
  const ico = inhoud => `<svg viewBox="-14 -14 28 28" width="24" height="24" aria-hidden="true">${inhoud}</svg>`;
  const items = [
    [ico(`<circle r="11" class="lg-beurt"/><circle r="7" fill="${KLEUREN[S.actief]}"/>`), "Held die aan de beurt is"],
    [ico(`<circle r="10" class="lg-reik"/>`), "Hier kun je heen reizen"],
    [ico(`<circle r="10" class="lg-scheur"/>`), "Scheur (open poort)"],
    [ico(`<circle r="8" class="lg-aanw"/>`), "Aanwijzing"],
    [ico(`<circle r="8" class="lg-mon"/>`), "Monster"],
    [ico(`<circle r="10" class="lg-episch"/>`), "Episch monster"],
    [ico(`<rect x="-7" y="-7" width="14" height="14" rx="3" class="lg-station"/>`), "Station van de Ondergrondse"],
    [ico(`<circle r="9" class="lg-rivier"/>`), "Plek aan de Theems"],
    [ico(`<line x1="-11" y1="0" x2="11" y2="0" class="lg-boot"/>`), "Bootroute naar overzee"]
  ];
  return `<details class="legenda"${UI.legendaOpen ? " open" : ""}><summary>Legenda</summary><div class="lg-lijst">${items.map(([i, t]) => `<span>${i}${t}</span>`).join("")}<span class="lg-noot">De mist wordt dikker naarmate de Mist daalt. Tik op een plek voor uitleg; tik nog een keer om erheen te reizen.</span></div></details>`;
}
function plekInfoHtml(id) {
  const p = plekDef(id), over = isOverzee(id), s = S.plekken[id], h = actief();
  const img = art(`art/plekken/${id}.jpg`), bereik = bereikbaar(h).includes(id);
  const hier = S.helden.filter(x => x.plek === id && !x.uit).map(x => korteNaam(heldDef(x).naam));
  const afst = !over && !isOverzee(h.plek) ? afstanden(h.plek)[id] : null;
  const status = [];
  if (s?.scheur) status.push(`<li class="paars">Scheur: wie hier staat, stapt erdoor en kan hem sluiten.</li>`);
  if (s?.aanw) status.push(`<li class="groen">${s.aanw} Aanwijzing${s.aanw > 1 ? "en" : ""}: sta hier bij de ontmoetingen om te zoeken.</li>`);
  for (const m of s?.monsters || []) { const d = monsterDef(m.id); status.push(`<li class="rood">${esc(d.naam)}: Gruwel ${d.gruwel}, Taaiheid ${d.taaiheid}, nog ${m.leven} leven.</li>`); }
  if (over && S.overzee[id].artefact) status.push(`<li class="groen">Hier ligt een artefact klaar.</li>`);
  if (hier.length) status.push(`<li>Hier: ${hier.map(esc).join(", ")}</li>`);
  return `<div class="pi-kop">${img ? `<img src="${img}" alt="">` : ""}<div><b>${esc(p.naam)}</b><span>${over ? "Overzee" : esc(DIENSTLABEL[p.dienst] || p.dienst)}${STATIONS.includes(id) ? " · station" : ""}${p.rivier ? " · aan de Theems" : ""}</span></div></div>
    <p>${over ? "Expedities met kans op artefacten. Bereik je met een bootkaartje (2 Pond) vanaf St Katharine Docks." : esc(D.bord.diensten[p.dienst])}</p>
    ${status.length ? `<ul class="pi-status">${status.join("")}</ul>` : ""}
    <p class="pi-voet">${bereik ? (UI.wijzer === "mouse" ? "Klik om hierheen te reizen." : "") : afst != null && afst > 0 ? `${afst} stap${afst > 1 ? "pen" : ""} van ${esc(korteNaam(heldDef(h).naam))}.` : ""}</p>
    ${bereik && UI.plekVast === id ? `<button class="btn pi-reis" data-act="reis-hier" data-doel="${id}">Reis hierheen</button>` : ""}`;
}
function toonPlekInfo(id, x, y, vast) {
  const el = document.getElementById("plekinfo"), vlak = document.querySelector(".bordvlak"); if (!el || !vlak) return;
  el.innerHTML = plekInfoHtml(id) + (vast ? `<button class="btn small ghost pi-sluit" data-act="pi-sluit">Sluiten</button>` : "");
  el.hidden = false; el.classList.toggle("vast", !!vast);
  const r = vlak.getBoundingClientRect(), w = el.offsetWidth, hgt = el.offsetHeight;
  let left = x - r.left + 18, top = y - r.top + 18;
  if (left + w > r.width - 8) left = Math.max(8, x - r.left - w - 18);
  if (top + hgt > r.height - 8) top = Math.max(8, r.height - hgt - 8);
  el.style.left = left + vlak.scrollLeft + "px"; el.style.top = top + vlak.scrollTop + "px";
}
function verbergPlekInfo() { const el = document.getElementById("plekinfo"); if (el) el.hidden = true; UI.plekVast = null; }
function tekenPaneel() {
  const h = S.helden[UI.bekeken] || actief(), d = heldDef(h), isActief = h === actief() && S.fase === "helden";
  const portret = art(`art/helden/${h.id}.jpg`);
  const idx = S.helden.indexOf(h);
  const mys = mysterie();
  const ma = isActief ? mysterieActie(h) : null;
  const dienstNaam = isOverzee(h.plek) ? null : plekDef(h.plek).dienst;
  const anderenHier = S.helden.some(x => x !== h && x.plek === h.plek);
  const kanActie = soort => isActief && h.acties > 0 && !h.gebruikt.includes(soort);
  const hint = S.fase === "helden"
    ? (isActief ? `${korteNaam(d.naam)} heeft nog <b>${h.acties}</b> ${h.acties === 1 ? "actie" : "acties"}${h.stappen ? ` en ${h.stappen} gratis stap${h.stappen > 1 ? "pen" : ""}` : ""}. Tik op een oplichtende plek om te reizen.` : `Het is de beurt van ${esc(korteNaam(heldDef(actief()).naam))}.`)
    : "De ontmoetingen worden gespeeld.";
  const beurtH = actief(), bi = S.helden.indexOf(beurtH), bimg = art(`art/helden/${beurtH.id}.jpg`);
  const banner = S.fase === "helden" ? `<div class="beurtbanner" style="--kleur:${KLEUREN[bi]}">
      <div class="bb-portret">${bimg ? `<img src="${bimg}" alt="">` : esc(initialen(heldDef(beurtH).naam))}</div>
      <div><span class="bb-label">Aan de beurt</span><b>${esc(heldDef(beurtH).naam)}</b>
        <span class="bb-acties">${Array.from({ length: heeft(beurtH, "gewond") ? 1 : 2 }, (_, k) => `<i class="${k < beurtH.acties ? "aan" : ""}"></i>`).join("")} ${beurtH.acties} ${beurtH.acties === 1 ? "actie" : "acties"} over${beurtH.stappen ? ` · ${beurtH.stappen} gratis stap${beurtH.stappen > 1 ? "pen" : ""}` : ""}</span></div></div>` : "";
  return `
    ${banner}
    <div class="heldentabs">${S.helden.map((x, i) => `<button class="heldentab${i === S.actief && S.fase === "helden" ? " beurt" : ""}" data-bekijk="${i}" aria-pressed="${i === UI.bekeken}"><span class="dot" style="background:${KLEUREN[i]}"></span>${esc(korteNaam(heldDef(x).naam))}</button>`).join("")}</div>
    <div class="hint">${hint}</div>
    ${S.fase !== "helden" && !bezig ? `<button class="btn breed" data-act="doorgaan">Doorgaan met ${{ ontmoeting: "de ontmoetingen", onheil: "het onheil", finale: "de laatste nacht" }[S.fase]}</button>` : ""}
    ${(S.tutorial || UI.tips) && isActief ? `<div class="tip"><b>Tip.</b> ${advies(h)}</div>` : ""}
    ${mys ? `<div class="kaartje goed"><b>Mysterie: ${esc(mys.naam)}</b><span>${esc(mys.doel)}</span></div>` : ""}
    ${S.geruchten.map(g => `<div class="kaartje toestand"><b>${esc(g.naam)}</b><span>Nog ${g.rondes} ronde${g.rondes > 1 ? "s" : ""}. ${g.soort === "bezoek" ? `Bezoek ${plekNaam(g.plek)}.` : `Haal de Aanwijzingen in ${plekNaam(g.plek)} op.`}</span></div>`).join("")}
    <div class="blad">
      <div class="kop">
        <div class="portret" style="background:${KLEUREN[idx]}">${portret ? `<img src="${esc(portret)}" alt="">` : esc(initialen(d.naam))}</div>
        <div><h2>${esc(d.naam)}</h2><div class="muted">${esc(d.rol)} · ${esc(plekNaam(h.plek))}</div></div>
      </div>
      <div class="pools">
        <div>Lichaam<b>${h.L}/${h.maxL}</b></div><div>Geest<b>${h.G}/${h.maxG}</b></div><div>Pond<b>${h.pond}</b></div><div>Aanwijz.<b>${h.aanw}</b></div><div>Trofee<b>${h.trofee}</b></div>
      </div>
      <div class="kenm">${KENMERKEN.map(([k, l]) => `<div title="${esc(KUITLEG[k])}">${l}<b>${h.kenm[k]}${bonusVoor(h, k) ? `<small>+${bonusVoor(h, k)}</small>` : ""}</b></div>`).join("")}</div>
      ${isActief && heeft(h, "verdwaald") ? `<div class="acties"><button class="btn breed" data-act="zoekweg" ${h.acties > 0 ? "" : "disabled"}>Zoek de weg terug (Waarneming 8)</button><button class="btn ghost breed" data-act="klaar">Beurt klaar</button></div>` : isActief ? `<div class="acties">
        <button class="btn" data-act="rust" ${kanActie("rusten") ? "" : "disabled"}>Rusten</button>
        <button class="btn" data-act="dienst" ${kanActie("dienst") && dienstNaam ? "" : "disabled"}>${dienstNaam ? esc(DIENSTLABEL[dienstNaam] || dienstNaam) : "Geen dienst"}</button>
        <button class="btn" data-act="ruil" ${kanActie("ruilen") && anderenHier && !heeft(h, "waanzin-paranoia") ? "" : "disabled"}>Ruilen</button>
        ${isOverzee(h.plek) ? `<button class="btn" data-act="terug" ${kanActie("reizen") ? "" : "disabled"}>Terug naar de dokken</button>` : `<button class="btn" data-act="groei" ${h.trofee >= 3 ? "" : "disabled"}>Groeien (3 trofeeën)</button>`}
        ${ma ? `<button class="btn breed" data-act="mysterie" ${ma.kan && h.acties > 0 && !h.gebruikt.includes("mysterie") ? "" : "disabled"}>${esc(ma.label)}${ma.uitleg ? ` (${esc(ma.uitleg)})` : ""}</button>` : ""}
        ${UI.undo.length && UI.undo.at(-1).ronde === S.ronde && UI.undo.at(-1).actief === S.actief ? `<button class="btn ghost breed terugknop" data-act="undo">↶ Ongedaan maken: ${esc(UI.undo.at(-1).label)}</button>` : ""}
        <button class="btn ghost breed" data-act="klaar">Beurt klaar</button>
      </div>` : ""}
      <div class="vermogen"><b>${esc(d.vermogen.naam)}.</b> ${esc(d.vermogen.tekst)}
        ${h.id === "ambrose-pell" && isActief && !h.ronde.sterrenkaart ? `<div><button class="btn small" data-act="pell">Gebruik</button></div>` : ""}
        ${h.id === "clementine-ashby" && isActief && !h.ronde.droom ? `<div><button class="btn small" data-act="clementine">Gebruik</button></div>` : ""}
        ${h.id === "albert-gosling" && isActief && !h.ronde.handigheid && !heeft(h, "waanzin-paranoia") ? `<div><button class="btn small" data-act="albert">Gebruik</button></div>` : ""}</div>
      ${d.bondgenoot ? `<div class="vermogen"><b>${esc(d.bondgenoot.naam)}</b> (${esc(d.bondgenoot.soort)}). ${esc(d.bondgenoot.tekst)}
        ${h.id === "bridie-kavanagh" && isActief && !h.ronde.molly && !heeft(h, "waanzin-paranoia") ? `<div><button class="btn small" data-act="molly">Molly sturen</button></div>` : ""}
        ${h.id === "albert-gosling" && isActief && !h.garibaldiGebruikt && !isOverzee(h.plek) ? `<div><button class="btn small" data-act="garibaldi">Garibaldi loslaten</button></div>` : ""}</div>` : ""}
      <div class="sectie"><h3>Tableau <span class="muted">· tik op een kaart</span></h3><div class="tableau">
        ${h.eigen.map((e, i) => tegel("eigen", i, h)).join("")}${h.spullen.map(id => tegel("spullen", id, h)).join("")}${h.spreuken.map(id => tegel("spreuken", id, h)).join("")}${h.artefacten.map(id => tegel("artefacten", id, h)).join("")}
        ${h.mysterieVoorwerp ? `<div class="tegel mysterie"><span class="tegel-leeg">✦</span><span class="tegel-naam">${esc(mysterie()?.voorwerp || "")}</span><span class="tegel-tag">Mysterie</span></div>` : ""}
      </div></div>
      ${sectie("Toestanden", h.toestanden.map(id => `<div class="kaartje ${id === "gezegend" ? "goed" : "toestand"}"><b>${esc(toestDef(id).naam)}</b><span>${esc(toestDef(id).tekst)}</span></div>`).join(""))}
      <div class="sectie"><button class="btn small ghost" data-act="aanpas">${UI.aanpassen ? "Aanpassen sluiten" : "Aanpassen"}</button>${UI.aanpassen ? tekenAanpas(h) : ""}</div>
    </div>
    <div class="log" aria-label="Logboek">${S.log.slice(0, 30).map(l => `<span>${esc(l)}</span>`).join("")}</div>`;
}
function kaartDef(soort, id, h) {
  if (soort === "eigen") { const e = h.eigen[+id]; return { naam: e.naam, soort: "Startuitrusting", tekst: e.gevecht ? `Een persoonlijk wapen: +${e.gevecht} bij gevechten. Je beste twee wapens tellen mee.` : "Een persoonlijk bezit van deze held. Het geeft geen spelvoordeel, maar hoort bij het verhaal." }; }
  return soort === "spullen" ? spulDef(id) : soort === "spreuken" ? spreukDef(id) : artDef(id);
}
const kaartArt = (soort, id) => soort === "eigen" ? null : soort === "spullen" && spulDef(id)?.persoonlijk ? `art/persoonlijk/${id}.jpg` : `art/${soort}/${id}.jpg`;
function tegel(soort, id, h) {
  const d = kaartDef(soort, id, h), pad = kaartArt(soort, id), img = pad ? art(pad) : null;
  const tag = soort === "eigen" ? (h.eigen[+id].gevecht ? `+${h.eigen[+id].gevecht} gevecht` : "Bezit")
    : soort === "spullen" ? (d.bonus?.gevecht ? `+${d.bonus.gevecht} gevecht` : d.gebruik ? "Te gebruiken" : d.persoonlijk ? "Persoonlijk" : d.soort)
    : soort === "spreuken" ? `${KNAAM[d.test]} ${d.moeilijkheid}` : "Artefact";
  return `<button class="tegel ${soort}${d.persoonlijk ? " persoonlijk" : ""}" data-kaart="${soort}:${id}">${img ? `<img src="${img}" alt="">` : `<span class="tegel-leeg">${soort === "eigen" || d.persoonlijk ? "◆" : "✦"}</span>`}<span class="tegel-naam">${esc(d.naam)}</span><span class="tegel-tag">${esc(tag)}</span></button>`;
}
async function toonKaart(h, soort, id) {
  const d = kaartDef(soort, id, h), isActief = h === actief() && S.fase === "helden";
  const knoppen = [];
  let extra = "";
  if (soort === "spullen") {
    extra = d.persoonlijk ? `<p class="muted">Persoonlijk bezit van ${esc(heldDef({ id: d.held }).naam)} · telt niet mee voor wat je kunt dragen</p>` : `<p class="muted">${esc(d.soort)} · waarde ${d.prijs} Pond</p>`;
    if (d.gebruik) knoppen.push({ label: "Gebruik", waarde: "gebruik" });
    if (id === "dier-raaf" && !h.ronde.raaf) knoppen.push({ label: "Vraag de raaf", waarde: "raaf" });
    if (id === "bondgenoot-journalist" && S.geruchten.length && h.aanw >= 2) knoppen.push({ label: "Gerucht ontkrachten (2 Aanwijzingen)", waarde: "journalist" });
  } else if (soort === "spreuken") {
    const pr = spreukPrijs(h, d);
    extra = `<p class="muted">${esc(d.soort)} · test: ${KNAAM[d.test]} ${d.moeilijkheid} · kost ${pr.geest ? pr.geest + " Geest" : pr.lichaam ? pr.lichaam + " Lichaam" : "niets"} · kost een actie</p>`;
    if (isActief && d.auto !== "gevecht") knoppen.push({ label: "Uitspreken", waarde: "spreek", uit: h.acties < 1 || h.gebruikt.includes("spreuk") });
    if (d.auto === "gevecht") extra += `<p class="muted">Deze spreuk biedt het spel vanzelf aan tijdens een gevecht.</p>`;
  } else if (soort === "artefacten") {
    extra = `<p class="verhaal">${esc(d.herkomst)}.</p>`;
    if (["zwarte-spiegel", "klokkenbel", "sterrenkaart", "verzegelde-kruik"].includes(id)) knoppen.push({ label: "Gebruik", waarde: "artefact" });
  }
  knoppen.push({ label: "Sluiten", waarde: null, ghost: true });
  const k = await venster({ soort: soort === "eigen" ? "Startuitrusting" : { spullen: "Spul", spreuken: "Spreuk", artefacten: "Artefact" }[soort], titel: d.naam, beeld: kaartArt(soort, id), zij: true, html: extra + `<p>${esc(d.tekst)}</p>`, knoppen });
  if (k === "gebruik") await gebruikSpul(h, id);
  if (k === "spreek") await spreek(h, id);
  if (k === "artefact") await gebruikArtefact(h, id);
  if (k === "raaf") await raaf(h);
  if (k === "journalist") await journalist(h);
}
const sectie = (titel, inhoud) => inhoud ? `<div class="sectie"><h3>${titel}</h3><div class="kaartjes">${inhoud}</div></div>` : "";
function tekenAanpas(h) {
  const r = (k, l) => `<div class="rij"><span>${l}</span><span><button class="btn small ghost" data-pas="${k}:-1">−</button> <button class="btn small ghost" data-pas="${k}:1">+</button></span></div>`;
  return `<div class="aanpas"><p class="muted">Voor kaarten die je zelf afhandelt.</p>${r("L", "Lichaam")}${r("G", "Geest")}${r("pond", "Pond")}${r("aanw", "Aanwijzing")}${r("trofee", "Trofee")}${r("mist", "Mist")}
    <div class="rij"><select id="pas-toestand">${D.toestanden.map(t => `<option value="${t.id}">${esc(t.naam)}</option>`).join("")}</select><button class="btn small ghost" data-act="toestand-plus">Geef</button><button class="btn small ghost" data-act="toestand-min">Haal weg</button></div>
    <div class="rij"><select id="pas-plek">${[...D.bord.plekken, ...D.bord.overzee].map(p => `<option value="${p.id}" ${p.id === h.plek ? "selected" : ""}>${esc(p.naam)}</option>`).join("")}</select><button class="btn small ghost" data-act="verplaats">Verplaats</button></div>
    <div class="rij"><select id="pas-kaart">${[...h.spullen.map(id => ["spullen", id, spulDef(id).naam]), ...h.spreuken.map(id => ["spreuken", id, spreukDef(id).naam]), ...h.artefacten.map(id => ["artefacten", id, artDef(id).naam])].map(([s, id, n]) => `<option value="${s}:${id}">${esc(n)}</option>`).join("")}</select><button class="btn small ghost" data-act="afleggen">Afleggen</button></div>
    <div class="rij"><span>Monster op deze plek</span><span><button class="btn small ghost" data-act="mon-plus">+</button> <button class="btn small ghost" data-act="mon-min">−</button></span></div></div>`;
}
function tekenEinde() {
  const winst = S.einde === "winst" || S.einde === "nipt", g = god();
  const gb = art(`art/goden/${g.id}.jpg`);
  app.innerHTML = `<div class="start">${gb ? `<img class="hero-art${winst ? " gered" : ""}" src="${gb}" alt="">` : ""}<span class="muted">Na ${S.ronde} rondes</span><h1>${S.einde === "nipt" ? "Op het nippertje" : winst ? "Londen is gered" : `${esc(g.naam)} heeft gewonnen`}</h1>
    <p class="verhaal" style="font-family:var(--letter);font-size:20px;max-width:60ch">${S.einde === "nipt" ? "In de laatste nacht drijven jullie het terug de diepte in. Londen zal nooit weten hoe dichtbij het was. " : ""}${winst ? "De Mist trekt op boven de Theems. De kranten schrijven morgen over een koude nacht, en verder over niets. Jullie weten beter." : esc(g.ontwaken)}</p>
    <div><button class="btn" data-act="nieuw">Nieuw spel</button></div></div>`;
}
function tekenStart() {
  const opgeslagen = laden();
  const u = UI.start;
  const titel = art("art/scherm/titel.jpg");
  app.innerHTML = `<div class="start">
    ${titel ? `<img class="hero-art" src="${titel}" alt="">` : ""}
    <div><span class="muted">Een coöperatief spel voor 2 of 4 helden</span><h1>Londen, 1888</h1></div>
    <div class="opties"><button class="btn" data-act="tutorial">Leer spelen (tutorial)</button><button class="btn ghost" data-act="handboek">Handleiding</button><a class="btn ghost" href="lore/index.html">Lore-boek</a></div>
    ${opgeslagen && !opgeslagen.einde ? `<div class="hint">Er is een spel bezig tegen ${esc(byId(D.goden, opgeslagen.god)?.naam)}, ronde ${opgeslagen.ronde}. <button class="btn small" data-act="verder">Verder spelen</button></div>` : ""}
    <section><h2>Tegen wie?</h2><div class="goden">${D.goden.map(g => `<button class="optie" data-god="${g.id}" aria-pressed="${u.god === g.id}">${art(`art/goden/${g.id}.jpg`) ? `<img class="godbeeld" src="art/goden/${g.id}.jpg" alt="">` : ""}<b>${esc(g.naam)}</b><span class="muted">${esc(g.titel)}</span><span>${esc(g.regel)}</span></button>`).join("")}</div></section>
    <section><h2>Moeilijkheid</h2><div class="opties">${Object.entries(MOEILIJKHEID).map(([k, m]) => `<button class="optie" data-moeilijk="${k}" aria-pressed="${u.moeilijkheid === k}">${m.naam}: ${m.nodig} mysteries</button>`).join("")}</div></section>
    <section><h2>Hoeveel helden?</h2><div class="opties">${[2, 4].map(n => `<button class="optie" data-aantal="${n}" aria-pressed="${u.aantal === n}">${n} helden</button>`).join("")}</div></section>
    <section><h2>Kies ${u.aantal} helden <span class="muted" style="font-size:16px">(${u.helden.length} gekozen)</span></h2>
      <div class="opties"><button class="btn small ghost" data-act="willekeurig">Willekeurig kiezen</button></div>
      <p class="muted">Tik op een held om het verhaal, de kenmerken, het vermogen en de uitrusting te bekijken.</p>
      <div class="heldenkeus">${D.helden.map(h => `<button class="optie heldkaart" data-held="${h.id}" aria-pressed="${u.helden.includes(h.id)}">
        ${art(`art/helden/${h.id}.jpg`) ? `<img class="mini" src="art/helden/${h.id}.jpg" alt="">` : `<span class="mini leeg">${esc(initialen(h.naam))}</span>`}
        <span class="info"><b>${esc(h.naam)}</b><small>${esc(h.rol)} · ${esc(h.start)}</small>
        <small class="getallen">${KENMERKEN.map(([k, l]) => `${l.slice(0, 3)} ${h.kenmerken[k]}`).join(" · ")}<br>Lichaam ${h.lichaam} · Geest ${h.geest}${h.bondgenoot ? ` · met ${esc(h.bondgenoot.soort)}` : ""}</small></span>
        ${u.helden.includes(h.id) ? `<span class="gekozen" aria-label="Gekozen">✓</span>` : ""}</button>`).join("")}</div></section>
    <div><button class="btn" data-act="begin" ${u.god && u.helden.length === u.aantal ? "" : "disabled"}>Begin het spel</button></div>
  </div>`;
}

/* ---------- invoer ---------- */
let bezig = false;
async function veilig(fn) { if (bezig) return; bezig = true; UI.undo = []; try { await fn(); } catch (e) { console.error(e); UI.fout = String(e && e.message || e); } finally { bezig = false; teken(); if (UI.coachWacht) setTimeout(coachUitWachtrij, 30); } }
function coachUitWachtrij() { const c = UI.coachWacht; if (!c || bezig) return; UI.coachWacht = null; veilig(() => coach(c)); }
app.addEventListener("click", e => {
  const t = e.target.closest("button, [data-plek]"); if (!t) return;
  const u = UI.start;
  if (t.dataset.god) { u.god = t.dataset.god; return teken(); }
  if (t.dataset.moeilijk) { u.moeilijkheid = t.dataset.moeilijk; return teken(); }
  if (t.dataset.aantal) { u.aantal = +t.dataset.aantal; u.helden = u.helden.slice(0, u.aantal); return teken(); }
  if (t.dataset.held) return veilig(() => toonHeld(t.dataset.held));
  if (t.dataset.bekijk) { UI.bekeken = +t.dataset.bekijk; return teken(); }
  if (t.dataset.plek && S && !S.einde) {
    const kanReizen = bereikbaar(actief()).includes(t.dataset.plek);
    if (kanReizen && (UI.wijzer === "mouse" || UI.plekVast === t.dataset.plek)) return reis(t.dataset.plek);
    if (UI.plekVast === t.dataset.plek) return verbergPlekInfo();
    UI.plekVast = t.dataset.plek; Geluid.klik();
    const r = t.getBoundingClientRect(); return toonPlekInfo(t.dataset.plek, r.right, r.top, true);
  }
  if (t.dataset.spul) return veilig(() => gebruikSpul(S.helden[UI.bekeken], t.dataset.spul));
  if (t.dataset.artefact) return veilig(() => gebruikArtefact(S.helden[UI.bekeken], t.dataset.artefact));
  if (t.dataset.kaart) { const [soort, id] = t.dataset.kaart.split(":"); return veilig(() => toonKaart(S.helden[UI.bekeken], soort, id)); }
  if (t.dataset.spreuk) return veilig(() => spreek(actief(), t.dataset.spreuk));
  if (t.dataset.pas) { const [k, v] = t.dataset.pas.split(":"); const h = S.helden[UI.bekeken]; if (k === "mist") S.mist += +v; else h[k] = Math.max(0, h[k] + +v); opslaan(); return teken(); }
  const h = S ? S.helden[UI.bekeken] : null;
  switch (t.dataset.act) {
    case "willekeurig": u.helden = schud(D.helden.map(x => x.id)).slice(0, u.aantal); if (!u.god) u.god = kies1(D.goden).id; return teken();
    case "begin": nieuwSpel(u.god, u.moeilijkheid, u.helden); return;
    case "verder": S = laden(); if (S.fase === "finale") veilig(() => ontwaken()); else if (S.fase === "ontmoeting") veilig(() => ontmoetingsfase((S.ontmoetingIndex ?? -1) + 1)); else if (S.fase === "onheil") veilig(() => onheilsfase()); else teken(); return;
    case "nieuw": wis(); S = null; UI.start.helden = []; return teken();
    case "tutorial": zaai(1888); nieuwSpel("vathrun", "ontspannen", ["hester-quayle", "silas-rook"], { tutorial: true }); rng = Math.random; return;
    case "handboek": UI.handboek = "handleiding"; return tekenHandleiding();
    case "god": return veilig(() => godIntro(false));
    case "tips": if (S.tutorial) { S.tutorial = false; UI.tips = false; } else UI.tips = !UI.tips; opslaan(); return teken();
    case "stoppen": return veilig(async () => { if (await venster({ titel: "Stoppen?", html: "<p>Het spel blijft bewaard op dit apparaat. Je kunt later verder spelen.</p>", knoppen: [{ label: "Naar het beginscherm", waarde: true }, { label: "Doorspelen", waarde: false, ghost: true }] })) { opslaan(); S = null; } });
    case "regels": return veilig(() => venster({ soort: "Hoe werkt het?", titel: "Een ronde", html: `<ol><li><b>Heldenfase:</b> elke held doet 2 verschillende acties: reizen (tik op een plek), rusten, de dienst van de plek, ruilen, een spreuk of het mysterie.</li><li><b>Ontmoetingen:</b> vecht met monsters op je plek, ga door een Scheur, volg een Aanwijzing of trek een stadskaart.</li><li><b>Onheil:</b> de Mist daalt, Scheuren openen en monsters bewegen.</li></ol><p>Een test: 2 dobbelstenen plus je kenmerk, haal de moeilijkheid. Een Aanwijzing laat je bij Kennis en Waarneming één steen opnieuw gooien.</p><p>Los ${S.nodig} mysteries op voordat de Mist op 0 staat.</p>` }));
    case "rust": return veilig(() => rust(actief()));
    case "dienst": return veilig(() => dienst(actief()));
    case "ruil": return veilig(() => ruil(actief()));
    case "terug": { const a = actief(); gebruikActie(a, "reizen"); a.plek = "st-katharine-docks"; log(`${korteNaam(heldDef(a).naam)} keert terug naar de dokken`); opslaan(); return teken(); }
    case "mysterie": return veilig(async () => { gebruikActie(actief(), "mysterie"); await doeMysterie(actief()); opslaan(); });
    case "klaar": return veilig(beurtKlaar);
    case "pell": return veilig(() => pellVermogen(actief()));
    case "clementine": return veilig(() => clementine(actief()));
    case "albert": return veilig(() => albertHandigheid(actief()));
    case "molly": return veilig(() => molly(actief()));
    case "garibaldi": return veilig(() => garibaldi(actief()));
    case "raaf": return veilig(() => raaf(h));
    case "journalist": return veilig(() => journalist(h));
    case "zoekweg": return veilig(() => zoekWeg(actief()));
    case "doorgaan": UI.fout = null; return veilig(() => S.fase === "ontmoeting" ? ontmoetingsfase((S.ontmoetingIndex ?? -1) + 1) : S.fase === "finale" ? ontwaken() : onheilsfase());
    case "groei": return veilig(async () => {
      const k = await kiesGroei(h); if (!k) return; await groei(h, k);
    });
    case "aanpas": UI.aanpassen = !UI.aanpassen; return teken();
    case "pi-sluit": return verbergPlekInfo();
    case "reis-hier": { const d = t.dataset.doel; verbergPlekInfo(); return reis(d); }
    case "undo": { const u = UI.undo.pop(); if (!u) return; S = JSON.parse(u.staat); verbergPlekInfo(); log(`Ongedaan gemaakt: ${u.label}`); opslaan(); return teken(); }
    case "geluid": Geluid.wissel(); return teken();
    case "toestand-plus": { const v = document.getElementById("pas-toestand").value; if (!heeft(h, v)) h.toestanden.push(v); opslaan(); return teken(); }
    case "toestand-min": { const v = document.getElementById("pas-toestand").value; h.toestanden = h.toestanden.filter(x => x !== v); opslaan(); return teken(); }
    case "verplaats": h.plek = document.getElementById("pas-plek").value; opslaan(); return teken();
    case "afleggen": { const v = document.getElementById("pas-kaart").value; if (!v) return; const [s, id] = v.split(":"); h[s] = h[s].filter(x => x !== id); if (id === "dier-raaf") { S.mist--; log("De raaf vliegt weg. De Mist daalt met 1."); } opslaan(); return teken(); }
    case "mon-plus": if (!isOverzee(h.plek)) spawnMonster(h.plek); opslaan(); return teken();
    case "mon-min": if (!isOverzee(h.plek)) S.plekken[h.plek].monsters.pop(); opslaan(); return teken();
  }
});
document.getElementById("handboek").addEventListener("click", e => {
  const b = e.target.closest("[data-hb]"); if (!b) return;
  UI.handboek = b.dataset.hb === "sluit" ? null : b.dataset.hb; tekenHandleiding();
  if (UI.handboek) document.querySelector("#handboek .hb-inhoud")?.scrollTo(0, 0);
});
app.addEventListener("pointerdown", e => { UI.wijzer = e.pointerType; }, true);
app.addEventListener("toggle", e => { if (e.target.classList?.contains("legenda")) { UI.legendaOpen = e.target.open; try { localStorage.setItem("londen1888-legenda", e.target.open ? "open" : "dicht"); } catch {} } }, true);
app.addEventListener("pointerover", e => {
  if (e.pointerType !== "mouse" || UI.plekVast) return;
  const g = e.target.closest?.("[data-plek]"); if (!g || !S) return;
  toonPlekInfo(g.dataset.plek, e.clientX, e.clientY, false);
});
app.addEventListener("pointermove", e => {
  if (e.pointerType !== "mouse" || UI.plekVast) return;
  const g = e.target.closest?.("[data-plek]"), el = document.getElementById("plekinfo");
  if (!g) { if (el) el.hidden = true; return; }
  toonPlekInfo(g.dataset.plek, e.clientX, e.clientY, false);
});
app.addEventListener("pointerleave", () => { if (!UI.plekVast) { const el = document.getElementById("plekinfo"); if (el) el.hidden = true; } }, true);
app.addEventListener("keydown", e => { const p = e.target.closest?.("[data-plek]"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); reis(p.dataset.plek); } });

/* ---------- laden ---------- */
const BESTANDEN_MD = { handleiding: "handleiding" };
const BESTANDEN = { bord: "bord", helden: "helden", goden: "oude-goden", monsters: "monsters", epische: "epische-monsters", spullen: "spullen", spreuken: "spreuken", artefacten: "artefacten", toestanden: "toestanden", onheil: "onheil", personen: "personen", persoonlijk: "persoonlijk",
  o_stad: "ontmoetingen/stad", o_verhaal: "ontmoetingen/verhaal", o_expeditie: "ontmoetingen/expeditie", o_scheur: "ontmoetingen/scheur", o_aanwijzing: "ontmoetingen/aanwijzing" };
Promise.all(Object.entries(BESTANDEN).map(([k, f]) => fetch(`data/${f}.json`).then(r => { if (!r.ok) throw new Error(f); return r.json(); }).then(j => [k, j])))
  .then(lijst => Promise.all(Object.entries(BESTANDEN_MD).map(([k, f]) => fetch(`data/${f}.md`).then(r => r.ok ? r.text() : "").then(t => [k, t]))).then(md => [...lijst, ...md]))
  .then(lijst => {
    D = Object.fromEntries(lijst);
    D.spullen = [...D.spullen, ...D.persoonlijk.map(x => ({ ...x, persoonlijk: true, prijs: 0 }))];
    D.ontmoetingen = { stad: [...D.o_stad, ...D.o_verhaal], expeditie: D.o_expeditie, scheur: D.o_scheur, aanwijzing: D.o_aanwijzing };
    maakBuren(); teken(); registreerSW();
  })
  .catch(err => { app.innerHTML = `<div class="start"><h1>Londen, 1888</h1><p>De speldata kon niet worden geladen (${esc(err.message)}). Open het spel via een webserver, niet als los bestand.</p></div>`; });
function registreerSW() {
  try { if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost") && !location.hostname.endsWith("claude.ai") && !location.hostname.endsWith("claudeusercontent.com")) navigator.serviceWorker.register("sw.js").catch(() => {}); } catch {}
}
window.__spel = { get S() { return S; }, get D() { return D; }, get bezig() { return bezig; },
  api: { speelKaart, nieuwSpel, zaai, reis, rust, dienst, doeMysterie, mysterieActie, beurtKlaar, gebruikActie, gebruikSpul, zoekWeg, bereikbaar, burenVan, afstanden, stapNaar, actief, groei, mysterie, heeft, isOverzee, spulDef, monsterDef, wapenBonus, plekDef } };
})();
