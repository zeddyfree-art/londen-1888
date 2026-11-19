/* Londen 1888 — speelbare versie. Alle spelregels staan in ontwerp/spelregels.md. */
(() => {
"use strict";

const OPSLAG = "londen1888-spel-v1";
const KLEUREN = ["#b5552f", "#2d6e9e", "#7a8f2a", "#8a4fa3"];
const KENMERKEN = [["kennis", "Kennis"], ["scherpte", "Scherpte"], ["kracht", "Kracht"], ["overtuiging", "Overtuiging"]];
const KNAAM = Object.fromEntries(KENMERKEN);
const STARTWAPENS = { "Bamboestok": 1, "Wandelstok met verborgen lemmet": 1, "Revolver": 2, "Damespistool": 1, "Dienstgeweer": 2, "Bijl van de opgraving": 1, "Gietijzeren pollepel": 1, "Wapenstok": 1, "Derringer in haar mof": 1 };
const STATIONS = ["marylebone", "kings-cross", "city", "westminster"];
const MOEILIJKHEID = {
  ontspannen: { naam: "Ontspannen", mist: 0, nodig: 2, scheuren: 2, test: 0 },
  normaal: { naam: "Normaal", mist: -2, nodig: 3, scheuren: 2, test: 0 },
  genadeloos: { naam: "Genadeloos", mist: -3, nodig: 3, scheuren: 3, test: 1 }
};

let D = null;      // speldata
let S = null;      // spelstand
let UI = { bekeken: 0, aanpassen: false, start: { god: null, moeilijkheid: "ontspannen", aantal: 2, helden: [] } };
const app = document.getElementById("app");

/* ---------- hulpjes ---------- */
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const d6 = () => 1 + Math.floor(Math.random() * 6);
const kies1 = a => a[Math.floor(Math.random() * a.length)];
const schud = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
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
function opslaan() { try { localStorage.setItem(OPSLAG, JSON.stringify(S)); } catch {} }
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
function venster({ soort = "", titel = "", beeld = null, verhaal = "", html = "", knoppen = [{ label: "Verder", waarde: true }] }) {
  return new Promise(res => {
    modalResolve = res;
    const m = document.getElementById("modal");
    const img = beeld ? art(beeld) : null;
    m.innerHTML = `<div class="venster" role="dialog" aria-modal="true" aria-label="${esc(titel)}">
      ${img ? `<img class="beeld" src="${esc(img)}" alt="">` : ""}
      <div class="inhoud">
        ${soort ? `<span class="soort">${esc(soort)}</span>` : ""}
        ${titel ? `<h2>${esc(titel)}</h2>` : ""}
        ${verhaal ? `<p class="verhaal">${esc(verhaal)}</p>` : ""}
        ${html}
        <div class="knoppen">${knoppen.map((k, i) => `<button class="btn${k.ghost ? " ghost" : ""}" data-knop="${i}" ${k.uit ? "disabled" : ""}>${esc(k.label)}</button>`).join("")}</div>
      </div></div>`;
    m.hidden = false;
    m.onclick = e => {
      const b = e.target.closest("[data-knop]"); if (!b) return;
      m.hidden = true; m.innerHTML = ""; modalResolve = null;
      res(knoppen[+b.dataset.knop].waarde);
    };
    m.querySelector("[data-knop]")?.focus();
  });
}
const melding = (titel, tekst, soort = "") => venster({ soort, titel, html: `<p>${esc(tekst)}</p>` });

/* ---------- tests ---------- */
function bonusVoor(h, kenmerk) {
  let b = 0;
  for (const id of h.spullen) { const s = spulDef(id); if (s?.bonus?.[kenmerk]) b += s.bonus[kenmerk]; if (isOverzee(h.plek) && s?.bonus?.overzee) b += s.bonus.overzee; }
  if (kenmerk === "kennis" && h.artefacten.includes("kristallen-schedel")) b += 2;
  if (kenmerk === "overtuiging" && h.artefacten.includes("jade-masker")) b += 2;
  return b;
}
function wapenBonus(h, mens) {
  const w = [...h.eigen.map(e => e.gevecht || 0), ...h.spullen.map(id => spulDef(id)?.bonus?.gevecht || 0)].sort((a, b) => b - a);
  let b = (w[0] || 0) + (w[1] || 0);
  if (mens && h.spullen.includes("bondgenoot-agent")) b += 1;
  return b;
}
function dobbelHtml(stenen, gehouden, extraBonus, doel, totaal) {
  return `<div class="dobbels">${stenen.map((v, i) => `<span class="dobbel rol${gehouden.includes(i) ? "" : " uit"}">${v}</span>`).join("")}
    <span class="som ${totaal >= doel ? "ok" : "nee"}">+ ${extraBonus} = <b>${totaal}</b> (nodig ${doel})</span></div>`;
}
async function test(h, kenmerk, doel, titel, opt = {}) {
  const hd = heldDef(h);
  doel += MOEILIJKHEID[S.moeilijkheid].test;
  let extra = opt.extra || 0;
  if (kenmerk === "kennis" && h.id === "septimus-crane") extra += Math.min(2, h.aanw);
  if (heeft(h, "waanzin-stemmen") && opt.spreuk) extra += 1;
  const kw = h.kenm[kenmerk] + bonusVoor(h, kenmerk) + (opt.bonus || 0);
  const gooi = () => { let v = d6(); if (heeft(h, "vervloekt") && v === 6) v = 1; return v; };
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
      if (heeft(h, "gezegend") && !h.ronde.gezegend) knoppen.push({ label: "Gezegend: opnieuw", waarde: "zegen", ghost: true });
      if (h.id === "hu-yiping" && kenmerk === "kracht" && !h.ronde.adem) knoppen.push({ label: "Ademdiscipline: opnieuw", waarde: "adem", ghost: true });
      if (winnie) knoppen.push({ label: "Kruisverwijzing (Winnie): opnieuw", waarde: "winnie", ghost: true });
    }
    const keuze = await venster({ soort: `Test · ${KNAAM[kenmerk] || kenmerk}`, titel, html: `<p class="muted">${esc(korteNaam(hd.naam))} gooit ${stenen.length} dobbelstenen en telt de twee hoogste, plus ${kw}.</p>` + dobbelHtml(stenen, idx, kw, doel, totaal), knoppen });
    if (keuze === "ok") return gelukt;
    const i = laagste();
    if (keuze === "aanw") h.aanw--;
    if (keuze === "zegen") h.ronde.gezegend = true;
    if (keuze === "adem") h.ronde.adem = true;
    if (keuze === "winnie") S.rondeGebruikt["kruisverwijzing"] = true;
    stenen[i] = gooi();
  }
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
  const filter = soort === "bondgenoot" ? (s => s.soort === "Bondgenoot") : soort === "dier" ? (s => s.soort === "Dier") : (() => true);
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
    const [k, v] = Object.entries(e)[0];
    if (k === "pond") { h.pond = Math.max(0, h.pond + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Pond`]); }
    else if (k === "lichaam") { h.L = Math.min(h.maxL, h.L + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Lichaam`]); }
    else if (k === "geest") { h.G = Math.min(h.maxG, h.G + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Geest`]); }
    else if (k === "aanwijzing") { h.aanw = Math.max(0, h.aanw + v); regels.push([v, `${v > 0 ? "+" : ""}${v} Aanwijzing`]); }
    else if (k === "trofee") { h.trofee += v; regels.push([v, `+${v} Trofee`]); }
    else if (k === "mist") { S.mist += v; regels.push([v, `Mist ${v > 0 ? "+" : ""}${v}`]); }
    else if (k === "toestand") { if (v === "gezegend") h.toestanden = h.toestanden.filter(t => t !== "vervloekt"); if (v === "vervloekt") h.toestanden = h.toestanden.filter(t => t !== "gezegend"); if (!heeft(h, v)) h.toestanden.push(v); regels.push([v === "gezegend" ? 1 : -1, toestDef(v).naam]); }
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
  if (h.L <= 0) {
    h.L = 2; h.plek = "city"; if (!heeft(h, "gewond")) h.toestanden.push("gewond");
    log(`${naam} raakt gewond en wordt naar Barts gebracht`);
    await melding(`${naam} is gewond`, "Je wordt bewusteloos naar het ziekenhuis in The City gebracht. Je hebt 2 Lichaam en de toestand Gewond.", "Lichaam op 0");
  }
  if (h.G <= 0) {
    const w = geefWaanzin(h); h.G = Math.ceil(h.maxG / 2);
    log(`${naam} krijgt waanzin: ${w}`);
    await melding(`${naam} verliest grip`, `Je krijgt de waanzin "${w}". Je Geest gaat terug naar ${h.G}.`, "Geest op 0");
  }
}
async function controleerAlles() { for (const h of S.helden) await controleerHeld(h); }

/* ---------- bord: scheuren, monsters, aanwijzingen ---------- */
function trekScheurPlek() {
  if (!S.scheurStapel.length) S.scheurStapel = schud(D.bord.plekken.map(p => p.id));
  return S.scheurStapel.pop();
}
function openScheurOp(plek) {
  const p = S.plekken[plek];
  if (p.scheur) { spawnMonster(plek); S.mist -= 1; log(`Dubbele scheur in ${plekNaam(plek)}: extra monster en de Mist daalt`); return; }
  p.scheur = true; log(`Er opent een Scheur in ${plekNaam(plek)}`);
  if (S.god === "vathrun" && D.bord.rivier.includes(plek)) spawnMonster(plek);
}
function spawnMonster(plek, voorkeur) {
  if (isOverzee(plek)) return null;
  let keuzes = god().monsters.filter(id => !(monsterDef(id).alleenRivier && !D.bord.rivier.includes(plek)));
  let id = voorkeur && keuzes.includes(voorkeur) ? voorkeur : kies1(keuzes);
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
  await melding("Mysterie opgelost", `"${m.naam}" is opgelost. Het volgende mysterie: ${mysterie().naam}. ${mysterie().doel}`, `${S.opgelost} van ${S.nodig}`);
  activeerMysterie();
}
function activeerMysterie() {
  const m = mysterie();
  if (m.type === "episch") spawnEpisch(m.plek);
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
function nieuwSpel(godId, moeilijkheid, heldIds) {
  const mo = MOEILIJKHEID[moeilijkheid], g = byId(D.goden, godId);
  S = {
    versie: 1, god: godId, moeilijkheid, ronde: 1, mist: g.mist + mo.mist, nodig: mo.nodig, opgelost: 0, teller: 0,
    mysterieVolgorde: schud([0, 1, 2]), mysterieIndex: 0, voortgang: { scheuren: [] },
    plekken: Object.fromEntries(D.bord.plekken.map(p => [p.id, { aanw: 0, scheur: false, monsters: [] }])),
    overzee: Object.fromEntries(D.bord.overzee.map(o => [o.id, { artefact: false }])),
    scheurStapel: schud(D.bord.plekken.map(p => p.id)),
    onheil: schud(D.onheil.map(o => o.id)), onheilAfleg: [],
    geruchten: [], rondeGebruikt: {}, fase: "helden", actief: 0, log: [], einde: null, voorgevoel: false
  };
  S.helden = [];
  for (const id of heldIds) S.helden.push((() => {
    const d = byId(D.helden, id);
    const h = { id, plek: null,
      L: d.lichaam, G: d.geest, maxL: d.lichaam, maxG: d.geest, pond: 2, aanw: 0, trofee: 0, kenm: { ...d.kenmerken },
      spullen: [], spreuken: [], artefacten: [], toestanden: [], eigen: [], ronde: {}, acties: 2, gebruikt: [], stappen: 0 };
    h.plek = D.bord.plekken.find(p => p.naam === d.start).id;
    for (const u of d.uitrusting) {
      if (/^\d+ spreuk/.test(u)) { const s = trekUit("spreuken"); if (s) h.spreuken.push(s); }
      else if (/^\d+ Pond$/.test(u)) h.pond += parseInt(u, 10);
      else h.eigen.push({ naam: u, gevecht: STARTWAPENS[u] || 0 });
    }
    return h;
  })());
  const n = mo.scheuren + (heldIds.length === 4 ? 1 : 0);
  for (let i = 0; i < n; i++) { const p = trekScheurPlek(); S.plekken[p].scheur = true; spawnMonster(p); }
  legAanwijzing(3);
  activeerMysterie();
  log(`Het spel begint. ${g.naam} roert zich.`);
  startHeldenbeurt();
}

/* ---------- heldenfase ---------- */
function startHeldenbeurt() {
  const h = actief();
  h.acties = heeft(h, "gewond") ? 1 : 2; h.gebruikt = []; h.stappen = 0;
  if (h.id === "owen-marsh") h.stappen++;
  for (const id of h.spullen) h.stappen += spulDef(id)?.bonus?.stap || 0;
  delete h.ronde.wake; delete h.ronde.doodsmasker;
  UI.bekeken = S.actief;
  opslaan(); teken();
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
  if (h.stappen > 0) h.stappen--;
  else { h.acties--; h.gebruikt.push("reizen"); }
  h.plek = doel; log(`${korteNaam(heldDef(h).naam)} reist naar ${plekNaam(doel)}`);
  if (doel === "pall-mall") geruchtBezoek(doel);
  opslaan(); teken();
}
function gebruikActie(h, soort) { h.acties--; h.gebruikt.push(soort); }
async function rust(h) {
  if (S.plekken[h.plek]?.monsters.length) return melding("Niet veilig", "Je kunt niet rusten met een monster op je plek.");
  gebruikActie(h, "rusten");
  h.L = Math.min(h.maxL, h.L + 1); h.G = Math.min(h.maxG, h.G + 1);
  if (h.id === "ezra-whitlock") for (const x of S.helden) if (x.plek === h.plek) x.L = Math.min(x.maxL, x.L + 1);
  log(`${korteNaam(heldDef(h).naam)} rust uit`);
  opslaan(); teken();
}
function kanDragen(h) { return h.spullen.length + h.spreuken.length < 6 + (h.spullen.includes("gladstonetas") ? 1 : 0); }
async function winkel(h, kaarten, soortNaam, prijsVan) {
  let gekocht = false;
  while (true) {
    const rest = kaarten.filter(Boolean);
    if (!rest.length) break;
    const knoppen = rest.map(id => {
      const d = soortNaam === "spreuk" ? spreukDef(id) : spulDef(id);
      const p = prijsVan(d);
      return { label: `Koop ${d.naam} (${p} Pond)`, waarde: id, uit: p > h.pond || !kanDragen(h) };
    });
    knoppen.push({ label: gekocht ? "Klaar" : "Niets kopen", waarde: null, ghost: true });
    const html = `<p class="muted">Je hebt ${h.pond} Pond.${kanDragen(h) ? "" : " Je kunt niets meer dragen."}</p>` + rest.map(id => {
      const d = soortNaam === "spreuk" ? spreukDef(id) : spulDef(id);
      return `<div class="kaartje"><div class="k"><b>${esc(d.naam)}</b><span class="muted">${esc(d.soort)}</span></div><span>${esc(d.tekst)}</span></div>`;
    }).join("");
    const keuze = await venster({ soort: "Winkelen", titel: plekNaam(h.plek), beeld: `art/plekken/${h.plek}.png`, html, knoppen });
    if (!keuze) break;
    const d = soortNaam === "spreuk" ? spreukDef(keuze) : spulDef(keuze);
    h.pond -= prijsVan(d); (soortNaam === "spreuk" ? h.spreuken : h.spullen).push(keuze);
    kaarten[kaarten.indexOf(keuze)] = null; gekocht = true; log(`${korteNaam(heldDef(h).naam)} koopt ${d.naam}`);
  }
}
function trekMeerdere(soort, n) {
  const uit = [];
  for (let i = 0; i < n; i++) { const pool = (soort === "spreuken" ? D.spreuken : D.spullen).map(x => x.id).filter(id => !uit.includes(id) && !S.helden.some(h => h.spullen.includes(id) || h.spreuken.includes(id))); if (pool.length) uit.push(kies1(pool)); }
  return uit;
}
async function dienst(h) {
  const p = plekDef(h.plek), soort = p.dienst, naam = korteNaam(heldDef(h).naam);
  gebruikActie(h, "dienst");
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
      const k = await venster({ soort: "Theater", titel: "Je verdient 2 Pond", html: "<p>Wil je een extra nummer doen voor 1 Pond meer? (Overtuiging 9)</p>", knoppen: [{ label: "Ja", waarde: true }, { label: "Nee", waarde: false, ghost: true }] });
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
      const k = await venster({ soort: "Ziekenhuis", titel: "Barts", knoppen: [{ label: "Verzorgen: alle Lichaam (1 Pond)", waarde: "heel", uit: h.pond < 1 }, { label: "Gewond laten verwijderen", waarde: "gewond", uit: !heeft(h, "gewond") }, { label: "Niets", waarde: null, ghost: true }] });
      if (k === "heel") { h.pond--; h.L = h.maxL; log(`${naam} wordt verzorgd`); }
      if (k === "gewond") h.toestanden = h.toestanden.filter(t => t !== "gewond");
      break;
    }
    case "gaarkeuken": {
      const extra = heeft(h, "verslaafd") ? [{ label: "Verslaving bestrijden (Overtuiging 9)", waarde: "v" }] : [];
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
      const k = await venster({ soort: "Scotland Yard", titel: p.naam, knoppen: [{ label: "Gezocht laten vervallen (2 Pond)", waarde: "g", uit: !heeft(h, "gezocht") || h.pond < 2 }, { label: "Agent op ronde meenemen", waarde: "a", uit: S.helden.some(x => x.spullen.includes("bondgenoot-agent")) || heeft(h, "gezocht") }] });
      if (k === "g") { h.pond -= 2; h.toestanden = h.toestanden.filter(t => t !== "gezocht"); }
      if (k === "a") h.spullen.push("bondgenoot-agent");
      break;
    }
    case "kerk": {
      const k = await venster({ soort: "De abdij", titel: p.naam, knoppen: [{ label: "Vloek laten opheffen", waarde: "v", uit: !heeft(h, "vervloekt") }, { label: "Zegen ontvangen", waarde: "z", uit: heeft(h, "gezegend") }] });
      await pasToe(h, [k === "v" ? { verwijder: "vervloekt" } : { toestand: "gezegend" }]);
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
  opslaan(); teken();
}

/* ---------- spullen en spreuken gebruiken ---------- */
async function gebruikSpul(h, id) {
  const s = spulDef(id), naam = korteNaam(heldDef(h).naam);
  const weg = () => { h.spullen = h.spullen.filter(x => x !== id); };
  const mon = S.plekken[h.plek]?.monsters || [];
  switch (s.gebruik) {
    case "laudanum": weg(); h.G = Math.min(h.maxG, h.G + 2); if (d6() === 1 && !heeft(h, "verslaafd")) { h.toestanden.push("verslaafd"); await melding("Laudanum", "Het helpt, maar je wilt meer. Je bent Verslaafd."); } break;
    case "carbol": weg(); h.L = Math.min(h.maxL, h.L + 2); break;
    case "vlugzout": weg(); h.G = Math.min(h.maxG, h.G + 2); break;
    case "dynamiet": {
      const doel = mon.filter(m => !byId(D.epische, m.id));
      if (!doel.length) return melding("Dynamiet", "Er is hier geen gewoon monster.");
      weg(); verwijderMonster(h.plek, doel[0].uid); h.L--; h.trofee++; log(`${naam} blaast ${monsterDef(doel[0].id).naam} op`); break;
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
  const gelukt = await test(h, s.test, s.moeilijkheid, s.naam, { spreuk: true });
  const mon = S.plekken[h.plek]?.monsters || [];
  if (!gelukt) {
    if (s.auto === "sluit") spawnMonster(h.plek);
    if (s.auto === "versla") geefWaanzin(h);
    if (s.id === "zout-en-ijzer") h.G--;
    if (s.auto === "reisOveral") { h.plek = h.plek; }
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
      case "genees3": h.L = Math.min(h.maxL, h.L + 3); break;
      case "wake": for (const x of S.helden) if (x.plek === h.plek) x.ronde.wake = true; break;
      case "pentagram": h.ronde.pentagram = true; break;
      case "doodsmasker": h.ronde.doodsmasker = true; break;
      default: await melding(s.naam, `Gelukt. ${s.tekst} Pas het effect zelf toe met Aanpassen als dat nodig is.`);
    }
  }
  await controleerHeld(h); opslaan(); teken();
}
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
  } else await venster({ soort: "Onheil voorzien", titel: "De volgende onheilskaart", html });
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
  if (h.ronde.doodsmasker) { log(`${naam} wordt genegeerd door ${d.naam}`); return true; }
  const opties = [{ label: "Vechten", waarde: "vecht" }];
  if (h.spreuken.includes("verbanning")) opties.push({ label: "Hermetische verbanning", waarde: "verban" });
  if (!ep && h.spullen.includes("dynamiet")) opties.push({ label: "Dynamiet", waarde: "dyn", ghost: true });
  if (d.mens && h.spullen.includes("chloroform")) opties.push({ label: "Chloroform", waarde: "chl", ghost: true });
  const kenmerk = d.vechtMet || "kracht";
  const k = await venster({ soort: ep ? "Episch monster" : "Gevecht", titel: d.naam, beeld: `art/monsters/${d.id}.png`, verhaal: d.eigenschap,
    html: `<p>Gruwel <b>${d.gruwel}</b> · Taaiheid <b>${d.taaiheid}</b> · Schade <b>${d.schade}</b> · Leven <b>${m.leven}</b></p><p class="muted">${esc(naam)} vecht met ${KNAAM[kenmerk]}.</p>`, knoppen: opties });
  if (k === "dyn") { await gebruikSpul(h, "dynamiet"); return true; }
  if (k === "chl") { await gebruikSpul(h, "chloroform"); return true; }
  if (d.gruwel > 0 && !h.ronde.wake) {
    const extra = h.ronde.pentagram ? 1 : 0; delete h.ronde.pentagram;
    if (!await test(h, "kennis", 8, `Gruwel van ${d.naam}`, { extra })) { h.G -= d.gruwel; log(`${naam} verliest ${d.gruwel} Geest door gruwel`); }
    await controleerHeld(h);
    if (h.plek !== plek) return false;
  }
  let gelukt;
  const nebet = S.god === "nebet-ankhu" && h.artefacten.length ? 1 : 0;
  if (k === "verban") {
    const p = spreukPrijs(h, spreukDef("verbanning")); h.G -= p.geest;
    gelukt = await test(h, "kennis", d.taaiheid, `Verbanning tegen ${d.naam}`, { bonus: 2 + nebet, spreuk: true });
  } else {
    const bonus = (kenmerk === "kracht" ? wapenBonus(h, d.mens) : 0) + nebet;
    gelukt = await test(h, kenmerk, d.taaiheid, `Gevecht tegen ${d.naam}`, { bonus });
  }
  if (gelukt) {
    m.leven--;
    if (m.leven <= 0) { await monsterVerslagen(h, plek, m); await melding("Verslagen", `${d.naam} is verslagen.`, "Gevecht"); return true; }
    await melding("Raak", `${d.naam} is gewond maar staat nog (${m.leven} leven).`, "Gevecht");
    return false;
  }
  h.L -= d.schade; log(`${naam} verliest ${d.schade} Lichaam tegen ${d.naam}`);
  let extra = "";
  if (d.verliesWaanzin) extra = ` Je krijgt waanzin: ${geefWaanzin(h)}.`;
  await melding("Verloren", `${d.naam} raakt je: −${d.schade} Lichaam.${extra}`, "Gevecht");
  await controleerHeld(h);
  return false;
}

/* ---------- scheuren ---------- */
async function sluitScheur(h) {
  S.plekken[h.plek].scheur = false; h.trofee++;
  log(`${korteNaam(heldDef(h).naam)} sluit de Scheur in ${plekNaam(h.plek)}`);
  await melding("Scheur gesloten", `De Scheur in ${plekNaam(h.plek)} trekt dicht. +1 Trofee.`);
  if (scheurGesloten(h.plek)) await losOp();
}

/* ---------- ontmoetingsfase ---------- */
async function ontmoeting(h) {
  const naam = korteNaam(heldDef(h).naam), plek = h.plek;
  if (isOverzee(plek)) {
    const kaart = kies1(D.ontmoetingen.expeditie.filter(e => e.plek === plek));
    await speelKaart(h, kaart, "Expeditie", `art/plekken/${plek}.png`);
    if (S.overzee[plek].artefact || h.artefactGerucht) {
      S.overzee[plek].artefact = false; h.artefactGerucht = false;
      await venster({ soort: "Vondst", titel: "Een artefact", html: await pasToe(h, [{ trek: "artefacten" }]) });
    }
    return;
  }
  const p = S.plekken[plek];
  if (p.monsters.length && !h.ronde.doodsmasker) {
    for (const m of [...p.monsters]) {
      if (S.einde) return;
      let klaar = await vecht(h, plek, m);
      while (klaar && h.id === "tobias-hale" && S.plekken[plek].monsters.length && h.plek === plek) {
        const verder = await venster({ soort: "Doorvechter", titel: "Nog een monster aanvallen?", knoppen: [{ label: "Ja", waarde: true }, { label: "Nee", waarde: false, ghost: true }] });
        if (!verder) break;
        klaar = await vecht(h, plek, S.plekken[plek].monsters[0]);
      }
      if (h.plek !== plek) return;
    }
    if (S.plekken[plek].monsters.length) return;
  }
  if (p.scheur) {
    const kaart = kies1(D.ontmoetingen.scheur);
    await speelKaart(h, kaart, "Aan de andere kant", null);
    if (h.plek !== plek || !p.scheur) return;
    const lens = h.artefacten.includes("vuurtoren-lens") && h.kenm.scherpte > h.kenm.kennis ? "scherpte" : "kennis";
    const k = await venster({ soort: "Scheur", titel: `De Scheur in ${plekNaam(plek)}`, html: `<p>Probeer je hem te sluiten? (${KNAAM[lens]})</p>`,
      knoppen: [{ label: `Sluiten met 1 Aanwijzing (8)`, waarde: "a", uit: h.aanw < 1 }, { label: "Sluiten zonder Aanwijzing (10)", waarde: "z" }, { label: "Laten", waarde: null, ghost: true }] });
    if (k) {
      if (k === "a") h.aanw--;
      if (await test(h, lens, k === "a" ? 8 : 10, "De Scheur sluiten")) await sluitScheur(h);
      else await melding("De Scheur blijft open", "Het lukt niet. De randen trillen nog na.");
    }
    return;
  }
  if (p.aanw > 0) {
    const kaart = kies1(D.ontmoetingen.aanwijzing);
    const k = await venster({ soort: "Aanwijzing", titel: plekNaam(plek), beeld: `art/plekken/${plek}.png`, verhaal: kaart.tekst, knoppen: [{ label: "Onderzoeken (Scherpte 7)", waarde: true }] });
    if (k && await test(h, "scherpte", 7, "Een spoor volgen")) { p.aanw--; h.aanw++; log(`${naam} vindt een Aanwijzing in ${plekNaam(plek)}`); }
    return;
  }
  const kaarten = D.ontmoetingen.stad.filter(e => e.plek === plek && e.id !== S.laatsteKaart);
  const kaart = kies1(kaarten);
  S.laatsteKaart = kaart.id;
  await speelKaart(h, kaart, plekNaam(plek), `art/plekken/${plek}.png`);
}
async function speelKaart(h, kaart, soort, beeld) {
  const naam = korteNaam(heldDef(h).naam);
  if (!kaart.test) {
    const html = await pasToe(h, kaart.effect);
    await venster({ soort, titel: naam, beeld, verhaal: kaart.tekst, html: (kaart.slot ? `<p class="verhaal">${esc(kaart.slot)}</p>` : "") + html });
    await controleerHeld(h); return;
  }
  await venster({ soort, titel: naam, beeld, verhaal: kaart.tekst, knoppen: [{ label: `${KNAAM[kaart.test.kenmerk]}-test (${kaart.test.moeilijkheid + MOEILIJKHEID[S.moeilijkheid].test})`, waarde: true }] });
  const ok = await test(h, kaart.test.kenmerk, kaart.test.moeilijkheid, kaart.test.kenmerk === "kracht" ? "Doorzetten" : "Wat doe je?");
  const uit = ok ? kaart.gelukt : kaart.mislukt;
  const html = await pasToe(h, uit.effect);
  await venster({ soort: ok ? "Gelukt" : "Mislukt", titel: naam, verhaal: uit.tekst, html });
  await controleerHeld(h);
}
async function ontmoetingsfase(start = 0) {
  S.fase = "ontmoeting";
  for (let i = start; i < S.helden.length; i++) {
    if (S.einde) return;
    S.actief = i; UI.bekeken = i; S.ontmoetingIndex = i; opslaan(); teken();
    await ontmoeting(S.helden[i]);
    geruchtBezoek(S.helden[i].plek);
    if (S.mist <= 0) break;
  }
  if (!S.einde) await onheilsfase();
}

/* ---------- onheilsfase ---------- */
function geruchtBezoek(plek) { S.geruchten = S.geruchten.filter(g => !(g.soort === "bezoek" && g.plek === plek)); }
async function onheilsfase() {
  S.fase = "onheil"; opslaan(); teken();
  if (S.mist <= 0) return einde();
  if (!S.onheil.length) { S.onheil = schud(S.onheilAfleg); S.onheilAfleg = []; }
  let id = S.onheil.pop();
  let c = byId(D.onheil, id);
  const odile = S.helden.find(h => h.id === "odile-fairweather");
  const knoppen = [{ label: "Uitvoeren", waarde: false }];
  if (odile && !S.voorgevoel) knoppen.push({ label: "Voorgevoel (Odile): negeren", waarde: true, ghost: true });
  const detail = [c.mist ? `Mist −${c.mist}` : "", c.scheur ? `${c.scheur} Scheur${c.scheur > 1 ? "en" : ""}` : "", c.monster ? `${c.monster} monster${c.monster > 1 ? "s" : ""}` : "", c.extra || "", c.gerucht ? "Gerucht: " + c.gerucht : ""].filter(Boolean).join(" · ");
  if (await venster({ soort: `Onheil · ronde ${S.ronde}`, titel: c.naam, verhaal: c.tekst, html: `<p>${esc(detail)}</p>`, knoppen })) {
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
    if (a.type === "geestAlle") for (const h of S.helden) h.G = Math.min(h.maxG, h.G + a.waarde);
    if (a.type === "lichaamOp") for (const h of S.helden) if (a.plekken.includes(h.plek)) h.L += a.waarde;
    if (a.type === "artefactKlaar") S.overzee[kies1(D.bord.overzee).id].artefact = true;
    if (a.type === "gezochtRijkste") { const h = [...S.helden].sort((x, y) => y.pond - x.pond)[0]; if (!heeft(h, "gezocht")) h.toestanden.push("gezocht"); log(`${korteNaam(heldDef(h).naam)} wordt gezocht`); }
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
    if (heeft(h, "schuld") && d6() === 1) h.L--;
    if (heeft(h, "waanzin-tekenen") && d6() === 1) openScheurOp(h.plek);
  }
  for (const g of S.geruchten) {
    if (g.soort === "ophalen" && S.plekken[g.plek].aanw === 0) g.klaar = true;
    g.rondes--;
    if (!g.klaar && g.rondes <= 0) { S.mist -= g.straf; log(`Gerucht "${g.naam}" loopt slecht af: Mist −${g.straf}`); await melding("Een gerucht wordt waar", `${g.naam}: de Mist daalt met ${g.straf}.`); }
  }
  S.geruchten = S.geruchten.filter(g => !g.klaar && g.rondes > 0);
  await controleerAlles();
  if (S.mist <= 0) return einde();
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
    const heldPlekken = S.helden.map(h => h.plek).filter(p => !isOverzee(p));
    if (iedereen && !d.beweging) { if (heldPlekken.length) { const dist = afstanden(plek); doel = stapNaar(plek, heldPlekken.sort((a, b) => (dist[a] ?? 99) - (dist[b] ?? 99))[0]); } }
    else if (!d.beweging) continue;
    else if (d.beweging.type === "naarHeld" && heldPlekken.length) { const dist = afstanden(plek); doel = stapNaar(plek, heldPlekken.sort((a, b) => (dist[a] ?? 99) - (dist[b] ?? 99))[0]); }
    else if (d.beweging.type === "willekeurig") { for (let i = 0; i < d.beweging.stappen; i++) doel = kies1([...BUREN[doel]]); }
    else if (d.beweging.type === "naarArtefact") { const h = [...S.helden].filter(h => !isOverzee(h.plek)).sort((a, b) => b.artefacten.length - a.artefacten.length)[0]; if (h && h.artefacten.length) doel = stapNaar(plek, h.plek); }
    else if (d.beweging.type === "springNaarHeld" && heldPlekken.length) doel = kies1(heldPlekken);
    if (d.alleenRivier && !D.bord.rivier.includes(doel)) continue;
    if (doel !== plek) { verwijderMonster(plek, m.uid); S.plekken[doel].monsters.push(m); }
  }
}
function einde() { S.einde = S.mist <= 0 ? "verlies" : "winst"; opslaan(); teken(); }

/* ---------- beurtverloop ---------- */
async function beurtKlaar() {
  if (S.actief < S.helden.length - 1) { S.actief++; startHeldenbeurt(); return; }
  await ontmoetingsfase(0);
}

/* ---------- tekenen ---------- */
function teken() {
  if (!D) return;
  if (!S) return tekenStart();
  if (S.einde) return tekenEinde();
  const g = god(), mys = mysterie();
  app.innerHTML = `<div class="spel">
    <header class="balk">
      <h1>${esc(g.naam)}</h1>
      <span class="stat">Ronde <b>${S.ronde}</b></span>
      <span class="stat">${{ helden: "Heldenfase", ontmoeting: "Ontmoetingen", onheil: "Onheil" }[S.fase]}</span>
      <span class="stat" title="Mist">Mist <b>${S.mist}</b></span>
      <span class="mistbalk" aria-hidden="true">${Array.from({ length: g.mist + MOEILIJKHEID[S.moeilijkheid].mist }, (_, i) => `<i class="${i < S.mist ? "" : "weg"}"></i>`).join("")}</span>
      <span class="stat">Mysteries <b>${S.opgelost}/${S.nodig}</b>${mys ? `: ${esc(mys.naam)}` : ""}</span>
      <div class="rechts"><button class="btn small ghost" data-act="regels">Hoe werkt het?</button><button class="btn small ghost" data-act="stoppen">Stoppen</button></div>
    </header>
    <div class="bordvlak">${tekenBord()}</div>
    <aside class="paneel">${tekenPaneel()}</aside>
  </div>`;
}
function tekenBord() {
  const b = D.bord, h = actief(), reik = bereikbaar(h);
  const bg = art("art/bord/londen.png");
  const tokens = D.bord.plekken.map(p => {
    const s = S.plekken[p.id], hier = S.helden.map((x, i) => [x, i]).filter(([x]) => x.plek === p.id);
    const mons = s.monsters;
    return `<g class="plek${p.rivier ? " rivier" : ""}${reik.includes(p.id) ? " bereik" : ""}" data-plek="${p.id}" ${reik.includes(p.id) ? `tabindex="0" role="button" aria-label="Reis naar ${esc(p.naam)}"` : ""}>
      ${s.scheur ? `<circle class="scheurring" cx="${p.x}" cy="${p.y}" r="22"/>` : ""}
      <circle class="kern" cx="${p.x}" cy="${p.y}" r="14"/>
      <text x="${p.x}" y="${p.y + 36}" text-anchor="middle" font-size="16">${esc(p.naam)}</text>
      ${s.aanw ? `<circle class="aanw" cx="${p.x - 22}" cy="${p.y - 18}" r="10"/><text class="aanw-t" x="${p.x - 22}" y="${p.y - 14}" text-anchor="middle">${s.aanw}</text>` : ""}
      ${mons.map((m, i) => `<g><circle class="mon" cx="${p.x + 24 + i * 16}" cy="${p.y - 18}" r="9"/><text class="mon-t" x="${p.x + 24 + i * 16}" y="${p.y - 14}" text-anchor="middle">${byId(D.epische, m.id) ? "★" : esc(monsterDef(m.id).naam[0])}</text></g>`).join("")}
      ${hier.map(([x, i], k) => `<g class="held${i === S.actief ? " actief" : ""}"><circle cx="${p.x - 14 + k * 18}" cy="${p.y + 2}" r="11" fill="${KLEUREN[i]}"/><text class="held-t" x="${p.x - 14 + k * 18}" y="${p.y + 6}" text-anchor="middle">${esc(initialen(heldDef(x).naam))}</text></g>`).join("")}
    </g>`;
  }).join("");
  const overzee = D.bord.overzee.map((o, i) => {
    const y = 40 + i * 62, hier = S.helden.map((x, j) => [x, j]).filter(([x]) => x.plek === o.id);
    return `<g class="overzee${reik.includes(o.id) ? " bereik" : ""}" data-plek="${o.id}"><rect x="770" y="${y}" width="215" height="50" rx="4"/>
      <text x="782" y="${y + 21}" font-size="15">${esc(o.naam.split(",")[0])}</text><text x="782" y="${y + 40}" font-size="12" style="font-family:var(--body);fill:var(--muted)">${S.overzee[o.id].artefact ? "Artefact ligt klaar" : "overzee"}</text>
      ${hier.map(([x, j], k) => `<circle cx="${960 - k * 20}" cy="${y + 25}" r="10" fill="${KLEUREN[j]}"/><text class="held-t" x="${960 - k * 20}" y="${y + 29}" text-anchor="middle">${esc(initialen(heldDef(x).naam))}</text>`).join("")}</g>`;
  }).join("");
  const P = Object.fromEntries(b.plekken.map(p => [p.id, p]));
  return `<svg class="bord" viewBox="0 0 ${b.breedte} ${b.hoogte}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Speelbord van Londen">
    ${bg ? `<image href="${bg}" x="0" y="0" width="${b.breedte}" height="${b.hoogte}" preserveAspectRatio="xMidYMid slice" opacity=".9"/>` : `<path d="${b.rivierpad}" fill="none" stroke="var(--river)" stroke-width="40" opacity=".75" stroke-linecap="round"/>`}
    <line x1="${P["st-katharine-docks"].x}" y1="${P["st-katharine-docks"].y}" x2="770" y2="140" stroke="var(--road)" stroke-width="2" stroke-dasharray="6 6"/>
    ${b.routes.map(([a, c]) => `<line class="weg" x1="${P[a].x}" y1="${P[a].y}" x2="${P[c].x}" y2="${P[c].y}"/>`).join("")}
    ${STATIONS.map(id => `<rect x="${P[id].x + 9}" y="${P[id].y - 25}" width="11" height="11" fill="var(--seal)"><title>Station van de Ondergrondse</title></rect>`).join("")}
    ${tokens}${overzee}
  </svg>`;
}
function tekenPaneel() {
  const h = S.helden[UI.bekeken] || actief(), d = heldDef(h), isActief = h === actief() && S.fase === "helden";
  const portret = art(`art/helden/${h.id}.png`);
  const idx = S.helden.indexOf(h);
  const mys = mysterie();
  const ma = isActief ? mysterieActie(h) : null;
  const dienstNaam = isOverzee(h.plek) ? null : plekDef(h.plek).dienst;
  const anderenHier = S.helden.some(x => x !== h && x.plek === h.plek);
  const kanActie = soort => isActief && h.acties > 0 && !h.gebruikt.includes(soort);
  const hint = S.fase === "helden"
    ? (isActief ? `${korteNaam(d.naam)} heeft nog <b>${h.acties}</b> ${h.acties === 1 ? "actie" : "acties"}${h.stappen ? ` en ${h.stappen} gratis stap${h.stappen > 1 ? "pen" : ""}` : ""}. Tik op een oplichtende plek om te reizen.` : `Het is de beurt van ${esc(korteNaam(heldDef(actief()).naam))}.`)
    : "De ontmoetingen worden gespeeld.";
  return `
    <div class="heldentabs">${S.helden.map((x, i) => `<button class="heldentab" data-bekijk="${i}" aria-pressed="${i === UI.bekeken}"><span class="dot" style="background:${KLEUREN[i]}"></span>${esc(korteNaam(heldDef(x).naam))}</button>`).join("")}</div>
    <div class="hint">${hint}</div>
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
      <div class="kenm">${KENMERKEN.map(([k, l]) => `<div>${l}<b>${h.kenm[k]}${bonusVoor(h, k) ? `<small>+${bonusVoor(h, k)}</small>` : ""}</b></div>`).join("")}</div>
      ${isActief ? `<div class="acties">
        <button class="btn" data-act="rust" ${kanActie("rusten") ? "" : "disabled"}>Rusten</button>
        <button class="btn" data-act="dienst" ${kanActie("dienst") && dienstNaam ? "" : "disabled"}>${dienstNaam ? esc(dienstNaam.replace(/-/g, " ")) : "Geen dienst"}</button>
        <button class="btn" data-act="ruil" ${kanActie("ruilen") && anderenHier ? "" : "disabled"}>Ruilen</button>
        ${isOverzee(h.plek) ? `<button class="btn" data-act="terug" ${kanActie("reizen") ? "" : "disabled"}>Terug naar de dokken</button>` : `<button class="btn" data-act="groei" ${h.trofee >= 3 ? "" : "disabled"}>Groeien (3 trofeeën)</button>`}
        ${ma ? `<button class="btn breed" data-act="mysterie" ${ma.kan && h.acties > 0 && !h.gebruikt.includes("mysterie") ? "" : "disabled"}>${esc(ma.label)}${ma.uitleg ? ` (${esc(ma.uitleg)})` : ""}</button>` : ""}
        <button class="btn ghost breed" data-act="klaar">Beurt klaar</button>
      </div>` : ""}
      <div class="vermogen"><b>${esc(d.vermogen.naam)}.</b> ${esc(d.vermogen.tekst)}
        ${h.id === "ambrose-pell" && isActief && !h.ronde.sterrenkaart ? `<div><button class="btn small" data-act="pell">Gebruik</button></div>` : ""}
        ${h.id === "clementine-ashby" && isActief && !h.ronde.droom ? `<div><button class="btn small" data-act="clementine">Gebruik</button></div>` : ""}</div>
      ${d.bondgenoot ? `<div class="vermogen"><b>${esc(d.bondgenoot.naam)}</b> (${esc(d.bondgenoot.soort)}). ${esc(d.bondgenoot.tekst)}</div>` : ""}
      ${sectie("Uitrusting", h.eigen.map(e => `<div class="kaartje"><div class="k"><b>${esc(e.naam)}</b>${e.gevecht ? `<span class="muted">+${e.gevecht} gevecht</span>` : ""}</div></div>`).join("") +
        h.spullen.map(id => { const s = spulDef(id); return `<div class="kaartje"><div class="k"><b>${esc(s.naam)}</b>${s.gebruik ? `<button class="btn small" data-spul="${id}">Gebruik</button>` : `<span class="muted">${esc(s.soort)}</span>`}</div><span>${esc(s.tekst)}</span></div>`; }).join(""))}
      ${sectie("Spreuken", h.spreuken.map(id => { const s = spreukDef(id), p = spreukPrijs(h, s); return `<div class="kaartje"><div class="k"><b>${esc(s.naam)}</b>${isActief ? `<button class="btn small" data-spreuk="${id}" ${h.acties > 0 && !h.gebruikt.includes("spreuk") ? "" : "disabled"}>Uitspreken</button>` : ""}</div><span class="muted">${KNAAM[s.test]} ${s.moeilijkheid} · kost ${p.geest ? p.geest + " Geest" : p.lichaam ? p.lichaam + " Lichaam" : "niets"}</span><span>${esc(s.tekst)}</span></div>`; }).join(""))}
      ${sectie("Artefacten", h.artefacten.map(id => `<div class="kaartje goed"><b>${esc(artDef(id).naam)}</b><span>${esc(artDef(id).tekst)}</span></div>`).join("") + (h.mysterieVoorwerp ? `<div class="kaartje goed"><b>${esc(mysterie()?.voorwerp || "")}</b><span>Breng het naar ${esc(plekNaam(mysterie()?.naar))}.</span></div>` : ""))}
      ${sectie("Toestanden", h.toestanden.map(id => `<div class="kaartje ${id === "gezegend" ? "goed" : "toestand"}"><b>${esc(toestDef(id).naam)}</b><span>${esc(toestDef(id).tekst)}</span></div>`).join(""))}
      <div class="sectie"><button class="btn small ghost" data-act="aanpas">${UI.aanpassen ? "Aanpassen sluiten" : "Aanpassen"}</button>${UI.aanpassen ? tekenAanpas(h) : ""}</div>
    </div>
    <div class="log" aria-label="Logboek">${S.log.slice(0, 30).map(l => `<span>${esc(l)}</span>`).join("")}</div>`;
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
  const winst = S.einde === "winst", g = god();
  app.innerHTML = `<div class="start"><span class="muted">Na ${S.ronde} rondes</span><h1>${winst ? "Londen is gered" : `${esc(g.naam)} ontwaakt`}</h1>
    <p class="verhaal" style="font-family:var(--letter);font-size:20px;max-width:60ch">${winst ? "De Mist trekt op boven de Theems. De kranten schrijven morgen over een koude nacht, en verder over niets. Jullie weten beter." : esc(g.ontwaken)}</p>
    <div><button class="btn" data-act="nieuw">Nieuw spel</button></div></div>`;
}
function tekenStart() {
  const opgeslagen = laden();
  const u = UI.start;
  const titel = art("art/scherm/titel.png");
  app.innerHTML = `<div class="start">
    ${titel ? `<img class="hero-art" src="${titel}" alt="">` : ""}
    <div><span class="muted">Een coöperatief spel voor 2 of 4 helden</span><h1>Londen, 1888</h1></div>
    ${opgeslagen && !opgeslagen.einde ? `<div class="hint">Er is een spel bezig tegen ${esc(byId(D.goden, opgeslagen.god)?.naam)}, ronde ${opgeslagen.ronde}. <button class="btn small" data-act="verder">Verder spelen</button></div>` : ""}
    <section><h2>Tegen wie?</h2><div class="goden">${D.goden.map(g => `<button class="optie" data-god="${g.id}" aria-pressed="${u.god === g.id}"><b>${esc(g.naam)}</b><span class="muted">${esc(g.titel)}</span><span>${esc(g.regel)}</span></button>`).join("")}</div></section>
    <section><h2>Moeilijkheid</h2><div class="opties">${Object.entries(MOEILIJKHEID).map(([k, m]) => `<button class="optie" data-moeilijk="${k}" aria-pressed="${u.moeilijkheid === k}">${m.naam}: ${m.nodig} mysteries</button>`).join("")}</div></section>
    <section><h2>Hoeveel helden?</h2><div class="opties">${[2, 4].map(n => `<button class="optie" data-aantal="${n}" aria-pressed="${u.aantal === n}">${n} helden</button>`).join("")}</div></section>
    <section><h2>Kies ${u.aantal} helden <span class="muted" style="font-size:16px">(${u.helden.length} gekozen)</span></h2>
      <div class="opties"><button class="btn small ghost" data-act="willekeurig">Willekeurig kiezen</button></div>
      <div class="heldenkeus">${D.helden.map(h => `<button class="optie" data-held="${h.id}" aria-pressed="${u.helden.includes(h.id)}"><span><b>${esc(h.naam)}</b><small>${esc(h.rol)} · ${esc(h.start)}</small></span></button>`).join("")}</div></section>
    <div><button class="btn" data-act="begin" ${u.god && u.helden.length === u.aantal ? "" : "disabled"}>Begin het spel</button></div>
  </div>`;
}

/* ---------- invoer ---------- */
let bezig = false;
async function veilig(fn) { if (bezig) return; bezig = true; try { await fn(); } catch (e) { console.error(e); } finally { bezig = false; teken(); } }
app.addEventListener("click", e => {
  const t = e.target.closest("button, [data-plek]"); if (!t) return;
  const u = UI.start;
  if (t.dataset.god) { u.god = t.dataset.god; return teken(); }
  if (t.dataset.moeilijk) { u.moeilijkheid = t.dataset.moeilijk; return teken(); }
  if (t.dataset.aantal) { u.aantal = +t.dataset.aantal; u.helden = u.helden.slice(0, u.aantal); return teken(); }
  if (t.dataset.held) { const id = t.dataset.held; u.helden = u.helden.includes(id) ? u.helden.filter(x => x !== id) : u.helden.length < u.aantal ? [...u.helden, id] : u.helden; return teken(); }
  if (t.dataset.bekijk) { UI.bekeken = +t.dataset.bekijk; return teken(); }
  if (t.dataset.plek && S && !S.einde) return reis(t.dataset.plek);
  if (t.dataset.spul) return veilig(() => gebruikSpul(S.helden[UI.bekeken], t.dataset.spul));
  if (t.dataset.spreuk) return veilig(() => spreek(actief(), t.dataset.spreuk));
  if (t.dataset.pas) { const [k, v] = t.dataset.pas.split(":"); const h = S.helden[UI.bekeken]; if (k === "mist") S.mist += +v; else h[k] = Math.max(0, h[k] + +v); opslaan(); return teken(); }
  const h = S ? S.helden[UI.bekeken] : null;
  switch (t.dataset.act) {
    case "willekeurig": u.helden = schud(D.helden.map(x => x.id)).slice(0, u.aantal); if (!u.god) u.god = kies1(D.goden).id; return teken();
    case "begin": nieuwSpel(u.god, u.moeilijkheid, u.helden); return;
    case "verder": S = laden(); if (S.fase === "ontmoeting") veilig(() => ontmoetingsfase(S.ontmoetingIndex || 0)); else if (S.fase === "onheil") veilig(() => onheilsfase()); else teken(); return;
    case "nieuw": wis(); S = null; UI.start.helden = []; return teken();
    case "stoppen": return veilig(async () => { if (await venster({ titel: "Stoppen?", html: "<p>Het spel blijft bewaard op dit apparaat. Je kunt later verder spelen.</p>", knoppen: [{ label: "Naar het beginscherm", waarde: true }, { label: "Doorspelen", waarde: false, ghost: true }] })) { opslaan(); S = null; } });
    case "regels": return veilig(() => venster({ soort: "Hoe werkt het?", titel: "Een ronde", html: `<ol><li><b>Heldenfase:</b> elke held doet 2 verschillende acties: reizen (tik op een plek), rusten, de dienst van de plek, ruilen, een spreuk of het mysterie.</li><li><b>Ontmoetingen:</b> vecht met monsters op je plek, ga door een Scheur, volg een Aanwijzing of trek een stadskaart.</li><li><b>Onheil:</b> de Mist daalt, Scheuren openen en monsters bewegen.</li></ol><p>Een test: 2 dobbelstenen plus je kenmerk, haal de moeilijkheid. Een Aanwijzing laat je bij Kennis en Scherpte één steen opnieuw gooien.</p><p>Los ${S.nodig} mysteries op voordat de Mist op 0 staat.</p>` }));
    case "rust": return veilig(() => rust(actief()));
    case "dienst": return veilig(() => dienst(actief()));
    case "ruil": return veilig(() => ruil(actief()));
    case "terug": { const a = actief(); gebruikActie(a, "reizen"); a.plek = "st-katharine-docks"; log(`${korteNaam(heldDef(a).naam)} keert terug naar de dokken`); opslaan(); return teken(); }
    case "mysterie": return veilig(async () => { gebruikActie(actief(), "mysterie"); await doeMysterie(actief()); opslaan(); });
    case "klaar": return veilig(beurtKlaar);
    case "pell": return veilig(() => pellVermogen(actief()));
    case "clementine": return veilig(() => clementine(actief()));
    case "groei": return veilig(async () => {
      const k = await venster({ soort: "Groei", titel: "Kies een verbetering", knoppen: [...KENMERKEN.map(([k, l]) => ({ label: `+1 ${l}`, waarde: k, uit: h.kenm[k] >= 5 })), { label: "+1 max Lichaam", waarde: "L" }, { label: "+1 max Geest", waarde: "G" }, { label: "Een spreuk", waarde: "S" }, { label: "Toch niet", waarde: null, ghost: true }] });
      if (!k) return; h.trofee -= 3;
      if (k === "L") { h.maxL++; h.L++; } else if (k === "G") { h.maxG++; h.G++; } else if (k === "S") await pasToe(h, [{ trek: "spreuken" }]); else h.kenm[k]++;
      log(`${korteNaam(heldDef(h).naam)} groeit`); opslaan();
    });
    case "aanpas": UI.aanpassen = !UI.aanpassen; return teken();
    case "toestand-plus": { const v = document.getElementById("pas-toestand").value; if (!heeft(h, v)) h.toestanden.push(v); opslaan(); return teken(); }
    case "toestand-min": { const v = document.getElementById("pas-toestand").value; h.toestanden = h.toestanden.filter(x => x !== v); opslaan(); return teken(); }
    case "verplaats": h.plek = document.getElementById("pas-plek").value; opslaan(); return teken();
    case "afleggen": { const v = document.getElementById("pas-kaart").value; if (!v) return; const [s, id] = v.split(":"); h[s] = h[s].filter(x => x !== id); opslaan(); return teken(); }
    case "mon-plus": if (!isOverzee(h.plek)) spawnMonster(h.plek); opslaan(); return teken();
    case "mon-min": if (!isOverzee(h.plek)) S.plekken[h.plek].monsters.pop(); opslaan(); return teken();
  }
});
app.addEventListener("keydown", e => { const p = e.target.closest?.("[data-plek]"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); reis(p.dataset.plek); } });

/* ---------- laden ---------- */
const BESTANDEN = { bord: "bord", helden: "helden", goden: "oude-goden", monsters: "monsters", epische: "epische-monsters", spullen: "spullen", spreuken: "spreuken", artefacten: "artefacten", toestanden: "toestanden", onheil: "onheil", ontmoetingen: "ontmoetingen" };
Promise.all(Object.entries(BESTANDEN).map(([k, f]) => fetch(`data/${f}.json`).then(r => { if (!r.ok) throw new Error(f); return r.json(); }).then(j => [k, j])))
  .then(lijst => { D = Object.fromEntries(lijst); maakBuren(); teken(); })
  .catch(err => { app.innerHTML = `<div class="start"><h1>Londen, 1888</h1><p>De speldata kon niet worden geladen (${esc(err.message)}). Open het spel via een webserver, niet als los bestand.</p></div>`; });
window.__spel = { get S() { return S; }, get D() { return D; } };
})();
