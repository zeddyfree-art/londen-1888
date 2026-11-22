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
/* Uitleg per dienst: in de ballon bij de knop (muis erboven, of op de iPad lang drukken) */
const DIENSTUITLEG = {
  sterrenwacht: "Bekijk de volgende 2 Onheilskaarten en wissel ze eventueel om.",
  seance: "−1 Geest, +1 Aanwijzing.",
  station: "Voor 1 Pond met de trein naar een plek met een Scheur. Toch niet? Dan kost het geen actie.",
  bibliotheek: "Kennis 8: lukt het, dan kies je een nieuwe spreuk.",
  "occulte-boekwinkel": "Bekijk 3 spreuken van 2 Pond. Koop je niets, dan kost het geen actie.",
  markt: "Bekijk de spullen en koop wat je wilt. Koop je niets, dan kost het geen actie.",
  salon: "Charisma 8: lukt het, dan krijg je 2 Pond of een bondgenoot.",
  theater: "+2 Pond. Daarna kun je een extra nummer wagen (Charisma 9) voor 1 Pond meer.",
  club: "Betaal 3 Pond: bij je volgende expeditie overzee vind je zeker een artefact.",
  universiteit: "Heb je een Boek of Artefact? Dan krijg je 1 Aanwijzing.",
  ziekenhuis: "Verzorgen (1 Pond), Gewond laten verwijderen, geld lenen of je schuld aflossen.",
  gaarkeuken: "+2 Geest, of je verslaving bestrijden (Charisma 9).",
  logementen: "Hoor waar de volgende Scheur opent.",
  politie: "Gezocht laten vervallen (2 Pond) of een agent meenemen.",
  kerk: "Een vloek laten opheffen of een zegen ontvangen.",
  kunstenaars: "+1 Geest. Heb je waanzin, dan kun je die kwijtraken (Kennis 9).",
  haven: "Koop een bootkaartje en vaar op expeditie overzee. Toch niet? Dan kost het geen actie.",
  rivierpolitie: "Roei naar een andere plek aan de rivier."
};
const STATIONS = ["marylebone", "kings-cross", "city", "westminster"];
const LANGE_NACHT = { mist: 2 };
const MOEILIJKHEID = {
  ontspannen: { naam: "Ontspannen", mist: 0, nodig: 2, scheuren: 2, test: 0 },
  normaal: { naam: "Normaal", mist: -3, nodig: 3, scheuren: 2, test: 0, finale: 1 },
  genadeloos: { naam: "Genadeloos", mist: -4, nodig: 3, scheuren: 3, test: 1 }
};

let D = null;      // speldata
let S = null;      // spelstand
let UI = { legendaOpen: (() => { try { return localStorage.getItem("londen1888-legenda") === "open"; } catch { return false; } })(), undo: [], bekeken: 0, aanpassen: false, start: { god: null, moeilijkheid: "ontspannen", modus: "gewoon", aantal: 2, helden: [], klokken: (() => { try { return JSON.parse(localStorage.getItem("londen1888-klokken")) || []; } catch { return []; } })() } };
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
/* ---------- De Klokken van Westminster: uitdagingen die je bij de start aanzet ---------- */
const KLOKKEN = [
  { id: "dikke-mist", naam: "Dikke mist", tekst: "De Mist begint 2 lager." },
  { id: "lege-zakken", naam: "Lege zakken", tekst: "Helden beginnen zonder Pond." },
  { id: "gesloten-lijnen", naam: "Gesloten lijnen", tekst: "De Ondergrondse en de trein rijden niet, en een bootkaartje kost 4 Pond." },
  { id: "zware-benen", naam: "Zware benen", tekst: "Je mag maar één actie per beurt aan reizen besteden." },
  { id: "zwijgende-getuigen", naam: "Zwijgende getuigen", tekst: "Bij de start liggen er geen Aanwijzingen op het bord." },
  { id: "taaie-wezens", naam: "Taaie wezens", tekst: "Elk monster heeft 1 Taaiheid meer." },
  { id: "huiveringwekkend", naam: "Huiveringwekkend", tekst: "Elk monster heeft 1 Leven en 1 Gruwel meer." },
  { id: "scheurende-stad", naam: "Scheurende stad", tekst: "Bij de start staat er 1 Scheur meer open, met monster." },
  { id: "slapeloze-nachten", naam: "Slapeloze nachten", tekst: "Elke derde ronde daalt de Mist 1 extra." },
  { id: "geen-tweede-worp", naam: "Geen tweede worp", tekst: "Aanwijzingen geven geen herworp meer." },
  { id: "ongeduldige-god", naam: "Ongeduldige god", tekst: "Je moet 1 mysterie meer oplossen." },
  { id: "dertien-slagen", naam: "Dertien slagen", tekst: "Elke test vraagt 1 meer." },
  { id: "geen-genade", naam: "Geen genade", tekst: "Geen laatste nacht: is de Mist op, dan is het voorbij." }
];
const klok = id => !!S?.klokken?.includes(id);
const bootPrijs = () => klok("gesloten-lijnen") ? 4 : 2;
const ROMEINS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];
/* Uit data/klokken.json (gemeten met tools/meet-klokken.js): de winkans zonder klokken en het effect van elke klok, als logit. */
const klokEffect = (id, stand) => { if (id === "geen-genade" && stand === "genadeloos") return 0; return Math.min(0, D.klokmodel?.klokken.find(k => k.id === id)?.logit || 0); };
const klokSlagen = id => Math.max(1, Math.min(4, Math.round(-klokEffect(id, "normaal") / 0.35)));
function schatKans(god, stand, aantal, klokken) {
  const m = D.klokmodel; if (!m) return null;
  const goden = god && m.basis[god] ? [god] : Object.keys(m.basis);
  const ps = goden.map(g => { const b = m.basis[g][stand][aantal]; let l = Math.log(b / (1 - b)); for (const id of klokken) l += klokEffect(id, stand); return 1 / (1 + Math.exp(-l)); });
  return ps.reduce((a, b) => a + b, 0) / ps.length;
}
/* Punten bij winst: hoe kleiner de kans vooraf, hoe meer punten. Op het nippertje (laatste nacht) telt voor driekwart. */
const puntenVoor = (kans, nipt) => Math.max(1, Math.round(100 * Math.log(1 / Math.max(kans, 0.002)) * (nipt ? 0.75 : 1)));
const SCORES = "londen1888-scores", KLOKKEUZE = "londen1888-klokken", SPELERNAAM = "londen1888-naam";
const leesScores = () => { try { return JSON.parse(localStorage.getItem(SCORES)) || []; } catch { return []; } };
const schrijfScores = l => { try { localStorage.setItem(SCORES, JSON.stringify(l.slice(-200))); } catch {} };
const SCOREBORD_URL = "https://londen1888-scorebord.zeddyfree.workers.dev/scores";
const apparaat = () => { try { let a = localStorage.getItem("londen1888-apparaat"); if (!a) { a = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem("londen1888-apparaat", a); } return a; } catch { return "onbekend" + Date.now(); } };
async function haalGedeeld() {
  const c = new AbortController(), t = setTimeout(() => c.abort(), 6000);
  try { const r = await fetch(`${SCOREBORD_URL}?limiet=25`, { signal: c.signal }); if (!r.ok) throw new Error(r.status); return (await r.json()).scores; } catch { return null; } finally { clearTimeout(t); }
}
async function deelUitslag(e) {
  try {
    const r = await fetch(SCOREBORD_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ naam: e.naam, god: e.god, stand: e.stand, helden: e.helden, klokken: e.klokken, ronde: e.ronde, uitslag: e.uitslag, datum: e.datum, sleutel: `${apparaat()}-${e.id}` }) });
    const d = await r.json().catch(() => ({}));
    return r.ok ? d : { fout: d.fout || `Het scorebord antwoordt niet (${r.status}).` };
  } catch { return { fout: "Geen verbinding met het gedeelde scorebord. Probeer het later opnieuw." }; }
}
/* Alle overwinningen van dit apparaat met een naam die nog niet gedeeld zijn, gaan vanzelf naar het
   gedeelde scorebord: bij het opstarten, op het eindscherm en bij het openen van het scorebord.
   Mislukt het (geen verbinding), dan volgt de volgende keer een nieuwe poging. */
let deelLoopt = null;
const AUTODELEN = "londen1888-autodelen";
const autoDelen = () => { try { return localStorage.getItem(AUTODELEN) !== "uit"; } catch { return true; } };
const delenSchuif = () => `<label class="schuif"><input type="checkbox" role="switch" id="autodelen" ${autoDelen() ? "checked" : ""}><span class="schuif-baan" aria-hidden="true"></span>Overwinningen automatisch delen op het gedeelde scorebord</label>`;
/* Het schuifje werkt overal, ook in een venster */
if (typeof document !== "undefined") document.addEventListener("change", e => {
  if (e.target.id !== "autodelen") return;
  try { localStorage.setItem(AUTODELEN, e.target.checked ? "aan" : "uit"); } catch {}
  if (e.target.checked) deelOpenstaande();
  if (S?.einde) teken();
});
/* alleen: id van één uitslag (de knop op het eindscherm); zonder alleen alles wat openstaat, mits automatisch delen aan staat */
function deelOpenstaande(alleen) {
  if (window.__bot || typeof fetch === "undefined" || (!alleen && !autoDelen())) return Promise.resolve();
  return deelLoopt ??= (async () => {
    let standaard = ""; try { standaard = localStorage.getItem(SPELERNAAM) || ""; } catch {}
    const open = leesScores().filter(x => (!alleen || x.id === alleen) && x.punten > 0 && !x.aangepast && !x.gedeeld && x.modus !== "lang" && ["winst", "nipt"].includes(x.uitslag) && (x.naam || standaard)).slice(-15);
    for (const x of open) {
      const d = await deelUitslag({ ...x, naam: x.naam || standaard });
      const l = leesScores(), e = l.find(y => y.id === x.id); if (!e) continue;
      if (d.ok || /al op het scorebord/.test(d.fout || "")) { e.gedeeld = true; e.gedeeldPlaats = d.plaats || null; e.naam ||= standaard; if (e.id === S?.uitslagId) UI.deelFout = null; }
      else if (e.id === S?.uitslagId) UI.deelFout = d.fout;
      schrijfScores(l);
      if (!d.ok && /Te veel|verbinding/.test(d.fout || "")) break;
    }
  })().finally(() => { deelLoopt = null; if (S?.einde && document.activeElement?.id !== "spelernaam") teken(); });
}
const ranglijst = () => leesScores().filter(x => x.punten > 0 && !x.aangepast).sort((a, b) => b.punten - a.punten || a.ronde - b.ronde);
const monsterBasis = id => byId(D.monsters, id) || byId(D.epische, id);
const monsterDef = id => {
  const d = monsterBasis(id), t = klok("taaie-wezens"), g = klok("huiveringwekkend");
  /* De Lange Nacht: vanaf het tweede bedrijf hebben gewone monsters 1 Leven meer, vanaf het derde ook 1 Schade meer */
  const b = S?.modus === "lang" && !byId(D.epische, id) ? (S.bedrijf || 1) : 1;
  const lv = (g ? 1 : 0) + (b >= 2 ? 1 : 0), sc = b >= 3 ? 1 : 0;
  return d && (t || g || lv || sc) ? { ...d, taaiheid: d.taaiheid + (t ? 1 : 0), gruwel: d.gruwel + (g ? 1 : 0), leven: d.leven + lv, schade: d.schade + sc } : d;
};
/* Overslag: elke 3 boven het doel telt 1 extra (schade in een gevecht, verzet in de laatste nacht) */
const overslag = () => Math.max(0, Math.floor((laatsteWorp.totaal - laatsteWorp.doel) / 3));
let laatsteWorp = { totaal: 0, doel: 0 };
/* Wat een artefact geeft: dezelfde bonusvelden als spullen */
const artBonus = (h, k) => h.artefacten.reduce((t, id) => t + (artDef(id)?.bonus?.[k] || 0), 0);
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
  let ctx = null, aan = true, muziekAan = true;
  try { aan = localStorage.getItem("londen1888-geluid") !== "uit"; muziekAan = localStorage.getItem("londen1888-muziek") !== "uit"; } catch {}
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
  /* Geluidsbestanden: art/geluid/<naam>.mp3. Ontbreekt een bestand, dan klinkt de ingebouwde klank. */
  const EFFECTEN = { klik: .5, reis: .6, kaart: .6, dobbel: .7, goed: .7, slecht: .7, monster: .8, onheil: .8, mysterie: .8, scheur: .8, winst: .8, verlies: .8 };
  const bestand = {};
  function laad() {
    if (window.__bot || typeof Audio === "undefined") return;
    fetch("data/geluiden.json").then(r => r.ok ? r.json() : []).catch(() => []).then(namen => { for (const naam of namen) laadEen(naam); });
  }
  function laadEen(naam) {
    const el = new Audio(); el.preload = "auto";
    const b = bestand[naam] = { el, ok: false };
    el.addEventListener("canplaythrough", () => { b.ok = true; if (naam === sfeerNaam) sfeer(sfeerNaam.replace("sfeer-", ""), true); if (naam === "muziek" && muziekGewenst) muziek(true, true); }, { once: true });
    el.addEventListener("error", () => { b.ok = false; }, { once: true });
    el.src = `art/geluid/${naam}.mp3`;
  }
  const speel = (naam, synth) => {
    if (!aan || window.__bot) return;
    const b = bestand[naam];
    if (b?.ok) { const k = b.el.cloneNode(); k.volume = EFFECTEN[naam] ?? .7; k.play().catch(() => synth?.()); }
    else synth?.();
  };
  /* Volume van de lange lussen. Safari op iPad negeert el.volume, dus waar het kan loopt het
     via een GainNode van Web Audio; anders via el.volume. */
  const mengers = new Map();
  /* iOS zet de AudioContext stil na het vergrendelen: elke tik maakt hem weer wakker */
  if (typeof document !== "undefined") document.addEventListener("pointerdown", () => { if (ctx && ctx.state !== "running") ctx.resume().catch(() => {}); }, true);
  function zetVolume(el, vol) {
    const a = c();
    if (a && !mengers.has(el)) { try { const g = a.createGain(); a.createMediaElementSource(el).connect(g).connect(a.destination); mengers.set(el, g); } catch {} }
    const g = mengers.get(el);
    if (g) { el.volume = 1; g.gain.setTargetAtTime(vol, a.currentTime, .4); } else el.volume = vol;
  }
  /* de sfeer gaat zachter als de muziek eronder speelt, zodat ze niet botsen */
  const sfeerVolume = () => muziekEl ? .1 : .25;
  /* sfeer: een zachte achtergrondlus per oude god, of op het startscherm */
  let sfeerNaam = null, sfeerEl = null;
  function sfeer(id, opnieuw) {
    const naam = id ? `sfeer-${id}` : null;
    if (naam === sfeerNaam && !opnieuw && (sfeerEl || !naam)) return;
    if (sfeerEl) { sfeerEl.pause(); sfeerEl = null; }
    sfeerNaam = naam;
    /* een god zonder eigen sfeerlus krijgt de algemene */
    const b = naam && (bestand[naam] || bestand["sfeer-start"]);
    if (!aan || !b?.ok) return;
    sfeerEl = b.el; sfeerEl.loop = true; zetVolume(sfeerEl, sfeerVolume()); sfeerEl.currentTime = 0; sfeerEl.play().catch(() => { sfeerEl = null; });
  }
  /* achtergrondmuziek: één lange, zachte track onder de sfeer */
  let muziekGewenst = false, muziekEl = null;
  function muziek(spelen, opnieuw) {
    muziekGewenst = spelen;
    const b = bestand.muziek;
    if (!spelen || !aan || !muziekAan || !b?.ok) { if (muziekEl) { muziekEl.pause(); muziekEl = null; } if (sfeerEl) zetVolume(sfeerEl, sfeerVolume()); return; }
    if (muziekEl && !opnieuw) return;
    muziekEl = b.el; muziekEl.loop = true; zetVolume(muziekEl, .18); muziekEl.play().catch(() => { muziekEl = null; if (sfeerEl) zetVolume(sfeerEl, sfeerVolume()); });
    if (sfeerEl) zetVolume(sfeerEl, sfeerVolume());
  }
  return {
    get aan() { return aan; },
    get muziekAan() { return muziekAan; },
    get heeftMuziek() { return !!bestand.muziek?.ok; },
    laad, sfeer, muziek,
    wisselMuziek() { muziekAan = !muziekAan; try { localStorage.setItem("londen1888-muziek", muziekAan ? "aan" : "uit"); } catch {} muziek(muziekGewenst, true); },
    wissel() { aan = !aan; try { localStorage.setItem("londen1888-geluid", aan ? "aan" : "uit"); } catch {} if (!aan && sfeerEl) { sfeerEl.pause(); sfeerEl = null; } else if (aan && sfeerNaam) sfeer(sfeerNaam.replace("sfeer-", ""), true); muziek(muziekGewenst, true); },
    reis() { speel("reis", () => { for (let i = 0; i < 5; i++) { ruis(i * .16, .06, 900, .4, 5); ruis(i * .16 + .07, .05, 650, .3, 5); } }); },
    kaart() { speel("kaart", () => ruis(0, .4, 300, .25, .8, 2600)); },
    dobbel() { speel("dobbel", () => { for (let i = 0; i < 8; i++) ruis(i * .07 + Math.random() * .03, .03, 2400 + Math.random() * 1600, .35, 6); }); },
    goed() { speel("goed", () => { toon(523, 0, .3, "triangle", .12); toon(784, .13, .5, "triangle", .12); }); },
    slecht() { speel("slecht", () => toon(233, 0, .5, "sawtooth", .045, 150)); },
    monster() { speel("monster", () => { toon(70, 0, 1.2, "sawtooth", .05, 46); ruis(0, 1.1, 180, .14, 1); }); },
    onheil() { speel("onheil", () => { toon(98, 0, 2.2, "sine", .22); toon(146, .03, 1.8, "sine", .09); }); },
    mysterie() { speel("mysterie", () => { toon(392, 0, .4, "triangle", .12); toon(523, .15, .4, "triangle", .12); toon(659, .3, .8, "triangle", .12); }); },
    scheur() { speel("scheur", () => ruis(0, 1.4, 120, .3, 1.5, 900)); },
    winst() { speel("winst", () => { toon(523, 0, .5, "triangle", .12); toon(659, .2, .5, "triangle", .12); toon(784, .4, 1.2, "triangle", .12); }); },
    verlies() { speel("verlies", () => { toon(147, 0, 2.5, "sine", .2, 98); }); },
    klik() { speel("klik", () => ruis(0, .03, 1800, .2, 3)); }
  };
})();

/* ---------- licht of donker ---------- */
/* Zonder keuze volgt de app het apparaat. Een keuze wordt onthouden en zet data-theme op <html>. */
const Thema = (() => {
  let keuze = null;
  try { keuze = localStorage.getItem("londen1888-thema"); } catch {}
  const mq = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: dark)") : null;
  const donker = () => keuze ? keuze === "dark" : !!mq?.matches;
  function pas() {
    if (typeof document === "undefined") return;
    const r = document.documentElement;
    if (keuze) r.dataset.theme = keuze; else delete r.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", donker() ? "#0d1416" : "#e7ecea");
  }
  pas();
  mq?.addEventListener?.("change", pas);
  return {
    get donker() { return donker(); },
    wissel() { keuze = donker() ? "light" : "dark"; try { localStorage.setItem("londen1888-thema", keuze); } catch {} pas(); }
  };
})();
/* ---------- uitlegballon ----------
   Elk element met data-uitleg krijgt een ballon. Met een muis: erboven hangen.
   Op een aanraakscherm: lang drukken (een gewone tik voert de actie gewoon uit). */
const Uitleg = (() => {
  if (typeof document === "undefined") return {};
  let el = null, huidig = null, timer = null, verberg = null, slikKlik = false;
  function toon(doel) {
    const t = doel?.dataset?.uitleg; if (!t) return;
    el ??= Object.assign(document.createElement("div"), { className: "uitlegballon", role: "tooltip" });
    if (!el.isConnected) document.body.append(el);
    el.textContent = t; el.hidden = false; huidig = doel;
    const r = doel.getBoundingClientRect(), b = el.getBoundingClientRect(), m = 8;
    let x = Math.min(Math.max(m, r.left + r.width / 2 - b.width / 2), innerWidth - b.width - m);
    let y = r.top - b.height - m; if (y < m) y = r.bottom + m;
    el.style.left = x + "px"; el.style.top = y + "px";
  }
  function weg() { if (el) el.hidden = true; huidig = null; clearTimeout(verberg); }
  document.addEventListener("pointerover", e => { if (e.pointerType !== "mouse") return; const d = e.target.closest?.("[data-uitleg]"); if (d !== huidig) d ? toon(d) : weg(); });
  document.addEventListener("pointerleave", weg);
  document.addEventListener("pointerdown", e => {
    clearTimeout(timer); if (e.pointerType === "mouse") return weg();
    weg(); const d = e.target.closest?.("[data-uitleg]"); if (!d) return;
    timer = setTimeout(() => { toon(d); slikKlik = true; verberg = setTimeout(weg, 4000); }, 450);
  }, true);
  for (const t of ["pointerup", "pointercancel"]) document.addEventListener(t, () => clearTimeout(timer), true);
  document.addEventListener("pointermove", e => { if (e.pointerType !== "mouse" && timer && Math.hypot(e.movementX, e.movementY) > 6) clearTimeout(timer); }, true);
  /* na lang drukken mag de klik de actie niet uitvoeren */
  document.addEventListener("click", e => { if (slikKlik) { slikKlik = false; e.preventDefault(); e.stopPropagation(); } else weg(); }, true);
  document.addEventListener("contextmenu", e => { if (e.target.closest?.("[data-uitleg]")) e.preventDefault(); });
  addEventListener("scroll", weg, true);
  return { weg };
})();
const themaKnop = (cls = "btn small ghost") => `<button class="${cls}" data-act="thema">${Thema.donker ? "Lichte modus" : "Donkere modus"}</button>`;

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
function venster({ soort = "", titel = "", beeld = null, zij = false, verhaal = "", html = "", breed = false, achterkant = null, animeer = null, geluid = null, terug = false, thema = "", portaal = false, knoppen = [{ label: "Verder", waarde: true }] }) {
  if (knoppen.length && knoppen.every(k => k.uit)) knoppen = [...knoppen, { label: "Verder", waarde: null, ghost: true }];
  if (window.__bot) return Promise.resolve(window.__bot.kies({ soort, titel, knoppen: knoppen.filter(k => !k.uit) }));
  return new Promise(res => {
    const m = document.getElementById("modal");
    const img = beeld ? art(beeld) : null;
    const rug = achterkant && !RUSTIG ? art(`art/achterkanten/${achterkant}.jpg`) : null;
    const toon = () => {
      m.innerHTML = `<div class="venster${breed ? " breed" : ""}${thema ? ` thema-${thema}` : ""}${zij && img && !portaal ? " zij" : ""}${rug ? " draai-in" : " kom-op"}" role="dialog" aria-modal="true" aria-label="${esc(titel)}">
        ${beeld && portaal ? portaalHtml(img || beeld) : img ? `<img class="beeld" src="${esc(img)}" alt="">` : ""}
        <div class="inhoud">
          ${terug ? `<button class="btn ghost terug-boven" data-knop="terug">← Terug</button>` : ""}
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
      res(b.dataset.knop === "terug" ? null : knoppen[+b.dataset.knop].waarde);
    };
    if (rug) { m.innerHTML = `<div class="kaartrug" aria-hidden="true"><img src="${esc(rug)}" alt=""></div>`; Geluid.kaart(); setTimeout(toon, 700); }
    else toon();
  });
}
const melding = (titel, tekst, soort = "") => venster({ soort, titel, html: `<p>${esc(tekst)}</p>` });

/* ---------- overgangen: korte animatie voor elke ontmoeting ---------- */
/* Beeld voor de Scheurkaart: eerst dat van de oude god, dan het algemene, anders de fiche. art() laadt op de achtergrond. */
function scheurBeeld() {
  const god = art(`art/scheur/${S.god}.jpg`), alg = art("art/scheur/portaal.jpg");
  return god || alg || "art/fiches/scheur.jpg";
}
function portaalHtml(img) {
  const vonken = Array.from({ length: 14 }, (_, i) => `<i style="--a:${(i * 360 / 14).toFixed(0)}deg;--v:${(i * .37 % 2.6).toFixed(2)}s"></i>`).join("");
  return `<div class="portaal" aria-hidden="true"><div class="portaal-nevel"></div><div class="portaal-vonken">${vonken}</div><div class="portaal-ring"></div><img${img.includes("fiches/") ? ' class="fiche"' : ""} src="${esc(img)}" alt=""></div>`;
}
const OVERGANG = {
  scheur: { duur: 2300, html: t => `<svg class="og-spleet" viewBox="0 0 100 400" preserveAspectRatio="none"><path d="M50 0 L44 50 L56 95 L41 150 L58 205 L45 260 L55 315 L47 360 L50 400"/></svg>
    <div class="og-kolk"></div><div class="og-zuig">${Array.from({ length: 18 }, (_, i) => `<i style="--a:${i * 20}deg;--v:${(i % 6) * .08}s"></i>`).join("")}</div><div class="og-flits"></div><p class="og-tekst">${esc(t)}</p>`, geluid: "scheur" },
  dicht: { duur: 1500, html: t => `<div class="og-kolk"></div><div class="og-flits"></div><p class="og-tekst">${esc(t)}</p>` },
  monster: { duur: 1300, html: t => `<div class="og-vignet"></div>${[0, 1, 2].map(i => `<span class="og-klauw" style="--i:${i}"></span>`).join("")}<p class="og-tekst">${esc(t)}</p>` },
  stad: { duur: 1500, html: t => `<div class="og-mist"></div><div class="og-mist twee"></div><div class="og-lamp"></div><p class="og-tekst">${esc(t)}</p>` },
  aanwijzing: { duur: 1500, html: t => `<div class="og-mist"></div>${[0, 1, 2, 3].map(i => `<span class="og-stap" style="--i:${i}"></span>`).join("")}<div class="og-loep"></div><p class="og-tekst">${esc(t)}</p>` },
  expeditie: { duur: 1600, html: t => `<div class="og-zee"></div><svg class="og-roos" viewBox="-50 -50 100 100"><circle r="44"/><circle r="36"/><path d="M0-46 6-6 46 0 6 6 0 46-6 6-46 0-6-6Z"/><path class="noord" d="M0-46 6-6-6-6Z"/></svg><p class="og-tekst">${esc(t)}</p>` }
};
function overgang(soort, tekst = "") {
  const o = OVERGANG[soort];
  if (!o || RUSTIG || window.__bot) return Promise.resolve();
  return new Promise(res => {
    const el = document.createElement("div");
    el.className = `overgang og-${soort}`; el.setAttribute("aria-live", "polite"); el.style.setProperty("--duur", o.duur + "ms");
    el.innerHTML = o.html(tekst);
    let klaar = false;
    const stop = () => { if (klaar) return; klaar = true; el.classList.add("weg"); setTimeout(() => { el.remove(); res(); }, 220); };
    el.addEventListener("click", stop);
    document.body.appendChild(el);
    if (o.geluid) Geluid[o.geluid]?.();
    setTimeout(stop, o.duur);
  });
}

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
  b += artBonus(h, kenmerk); if (isOverzee(h.plek)) b += artBonus(h, "overzee");
  if (kenmerk === "kennis" && h.artefacten.includes("kristallen-schedel")) b += 2;
  if (kenmerk === "overtuiging" && h.artefacten.includes("jade-masker")) b += 2;
  return b;
}
function wapenBonus(h, mens) {
  const w = [...h.eigen.map(e => e.gevecht || 0), ...h.spullen.map(id => spulDef(id)?.bonus?.gevecht || 0), ...h.artefacten.map(id => artDef(id)?.bonus?.gevecht || 0)].sort((a, b) => b - a);
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
/* Wat telt er bij een test op, en met hoeveel stenen gooi je? Gedeeld door test() en kans(). */
function testOpzet(h, kenmerk, doel, opt = {}) {
  doel += MOEILIJKHEID[S.moeilijkheid].test + (klok("dertien-slagen") ? 1 : 0) + (window.__doelPlus || 0);
  let extra = opt.extra || 0;
  if (kenmerk === "kennis" && h.id === "septimus-crane") extra += Math.min(2, h.aanw);
  if (heeft(h, "waanzin-stemmen") && opt.spreuk) extra += 1;
  let kw = h.kenm[kenmerk] + bonusVoor(h, kenmerk, opt.context) + (opt.bonus || 0);
  if (opt.spreuk) { for (const id of h.spullen) kw += spulDef(id)?.bonus?.spreuk || 0; kw += artBonus(h, "spreuk"); }
  const vloek = heeft(h, "vervloekt") && !h.spullen.includes("dier-kat");
  return { doel, kw, stenen: 2 + extra, vloek };
}
/* Kans in procenten dat de eerste worp lukt (zonder herworpen). */
function kans(h, kenmerk, doel, opt = {}) {
  const o = testOpzet(h, kenmerk, doel, opt);
  let goed = 0, alle = 0;
  const loop = (rest, worp) => {
    if (!rest) { const t = worp.sort((a, b) => b - a); alle++; if (t[0] + t[1] + o.kw >= o.doel) goed++; return; }
    for (let v = 1; v <= 6; v++) loop(rest - 1, [...worp, o.vloek && v === 6 ? 1 : v]);
  };
  loop(Math.min(o.stenen, 5), []);
  return Math.round(100 * goed / alle);
}
const kansTxt = (h, kenmerk, doel, opt) => ` · ${kans(h, kenmerk, doel, opt)}%`;
const metStand = doel => doel + MOEILIJKHEID[S.moeilijkheid].test + (klok("dertien-slagen") ? 1 : 0);
async function test(h, kenmerk, doel, titel, opt = {}) {
  const hd = heldDef(h);
  if (S.tutorial) await coach("test");
  const opzet = testOpzet(h, kenmerk, doel, opt);
  doel = opzet.doel;
  let kw = opzet.kw;
  const extra = opzet.stenen - 2;
  const kat = h.spullen.includes("dier-kat");
  const gooi = () => { let v = d6(); if (heeft(h, "vervloekt") && !kat && v === 6) v = 1; return v; };
  let stenen = Array.from({ length: 2 + extra }, gooi);
  const reken = () => {
    const idx = stenen.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 2).map(x => x[1]);
    return { idx, totaal: idx.reduce((s, i) => s + stenen[i], 0) + kw };
  };
  const laagste = () => stenen.indexOf(Math.min(...stenen));
  /* meting voor tools/meet-tests.js: alleen actief als de meetlijst bestaat */
  const meting = window.__testlog ? { kenmerk, waarde: h.kenm[kenmerk], kw, doel, stenen: stenen.length, titel, held: h.id, herworpen: 0, eerste: null } : null;
  while (true) {
    const { idx, totaal } = reken();
    const gelukt = totaal >= doel;
    if (meting && meting.eerste === null) meting.eerste = totaal;
    const knoppen = [{ label: gelukt ? "Gelukt, verder" : "Accepteren", waarde: "ok" }];
    if (!gelukt) {
      const winnie = S.helden.find(x => x.id === "winnie-lusk" && x.plek === h.plek && !S.rondeGebruikt["kruisverwijzing"]);
      if (h.aanw > 0 && !klok("geen-tweede-worp") && (kenmerk === "kennis" || kenmerk === "scherpte" || opt.gevecht || h.id === "silas-rook")) knoppen.push({ label: opt.gevecht && kenmerk === "kracht" ? "Aanwijzing: je kent zijn zwakke plek, opnieuw" : "Aanwijzing uitgeven: opnieuw", waarde: "aanw", ghost: true });
      if (heeft(h, "gezegend") && !kat && !h.ronde.gezegend) knoppen.push({ label: "Gezegend: opnieuw", waarde: "zegen", ghost: true });
      if (h.id === "hu-yiping" && kenmerk === "kracht" && !h.ronde.adem) knoppen.push({ label: "Ademdiscipline: opnieuw", waarde: "adem", ghost: true });
      if (winnie) knoppen.push({ label: "Kruisverwijzing (Winnie): opnieuw", waarde: "winnie", ghost: true });
      if (kenmerk === "kracht" && opt.context === "ontmoeting" && h.spullen.includes("ossenzweep") && !h.ronde.zweep) knoppen.push({ label: "Ossenzweep: opnieuw", waarde: "zweep", ghost: true });
      for (const id of h.spullen) { const sd = spulDef(id); if (sd?.herworp === kenmerk && !h.ronde["hw-" + id]) knoppen.push({ label: `${sd.naam}: opnieuw`, waarde: "hw-" + id, ghost: true }); }
      if (isOverzee(h.plek) && h.spullen.includes("boek-reisverslag")) knoppen.push({ label: "Reisverslag: +2", waarde: "reis", ghost: true });
    }
    const ruim = gelukt && opt.context === "ontmoeting" && totaal - doel >= 3;
    const overHtml = gelukt && totaal - doel >= 3 ? `<p class="overslag">${opt.gevecht ? `Overslag: ${totaal - doel} boven het doel, dus ${1 + Math.floor((totaal - doel) / 3)} schade.` : ruim ? "Ruim gehaald: +1 Pond." : "Ruim gehaald."}</p>` : "";
    const keuze = await venster({ soort: `Test · ${KNAAM[kenmerk] || kenmerk}`, titel, html: `<p class="muted">${esc(korteNaam(hd.naam))} gooit ${stenen.length} dobbelstenen en telt de twee hoogste, plus ${kw}.</p>` + dobbelHtml(stenen, idx, kw, doel, totaal) + overHtml, knoppen, animeer: rolDobbels });
    if (keuze === "ok") {
      if (meting) { meting.kw = kw; meting.totaal = totaal; meting.gelukt = gelukt; window.__testlog.push(meting); }
      laatsteWorp = { totaal, doel };
      if (ruim) { h.pond++; log(`${korteNaam(hd.naam)} haalt het ruim: +1 Pond`); }
      return gelukt;
    }
    if (meting) meting.herworpen++;
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
    else if (k === "vlag") { (S.vlaggen ??= {})[v] = true; regels.push([0, "Dit verhaal is nog niet af"]); }
    else if (k === "wisVlag") { if (S.vlaggen) delete S.vlaggen[v]; }
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
  while (telBagage(h) > 6 + h.spullen.reduce((t, id) => t + (spulDef(id)?.bonus?.draag || 0), 0)) {
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
  p.scheur = true; log(`Er opent een Scheur in ${plekNaam(plek)}`); Geluid.scheur();
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
  Geluid.mysterie();
  await melding("Mysterie opgelost", `"${m.naam}" is opgelost. Het volgende mysterie: ${mysterie().naam}. ${mysterie().doel}`, `${S.opgelost} van ${S.nodig}`);
  await mysterieBuit();
  if (S.modus === "lang") await nieuwBedrijf();
  activeerMysterie();
}
/* Buit na een opgelost mysterie. Gewoon: elke held kiest een spul of een Trofee, en het team krijgt één artefact.
   De Lange Nacht: een beloningsronde, elke held kiest één uit drie (een spul, een spreuk of een artefact). */
const kaartNaam = ([soort, id]) => soort === "spullen" ? spulDef(id).naam : soort === "spreuken" ? spreukDef(id).naam : artDef(id).naam;
const kaartTekst = ([soort, id]) => (soort === "spullen" ? spulDef(id) : soort === "spreuken" ? spreukDef(id) : artDef(id)).tekst;
async function mysterieBuit() {
  const levend = S.helden.filter(h => !h.uit);
  for (const h of levend) {
    const naam = korteNaam(heldDef(h).naam);
    if (S.modus === "lang") {
      const aanbod = [["spullen", trekUit("spullen")], ["spreuken", trekUit("spreuken")], ["artefacten", trekUit("artefacten")]].filter(x => x[1]);
      if (!aanbod.length) continue;
      const label = { spullen: "Spul", spreuken: "Spreuk", artefacten: "Artefact" };
      const k = await venster({ soort: "Beloningsronde", titel: `${naam} kiest een beloning`, breed: true,
        html: `<div class="beloningen">${aanbod.map(x => { const img = art(kaartArt(x[0], x[1])); return `<div class="beloning">${img ? `<img src="${img}" alt="">` : ""}<p><span class="muted">${label[x[0]]}${x[0] === "artefacten" && artDef(x[1]).episch ? " · episch" : ""}</span><br><b>${esc(kaartNaam(x))}</b></p><p>${esc(kaartTekst(x))}</p></div>`; }).join("")}</div>`,
        knoppen: aanbod.map(x => ({ label: kaartNaam(x), waarde: x })) });
      h[k[0]].push(k[1]); log(`${naam} kiest ${kaartNaam(k)}`);
    } else {
      const k = await venster({ soort: "Buit", titel: `${naam}: wat neem je mee?`, html: "<p>Het mysterie is opgelost, en er blijft iets voor je achter.</p>",
        knoppen: [{ label: "Trek een spul", waarde: "spul" }, { label: "+1 Trofee", waarde: "trofee" }] });
      await venster({ soort: "Buit", titel: naam, html: await pasToe(h, k === "spul" ? [{ trek: "spullen" }] : [{ trofee: 1 }]) });
    }
    await controleerHeld(h);
  }
  if (S.modus !== "lang" && levend.length && trekUit("artefacten")) {
    const volgorde = [...levend].sort((a, b) => a.artefacten.length - b.artefacten.length);
    const h = volgorde.length === 1 ? volgorde[0] : await venster({ soort: "Buit", titel: "Wie neemt het artefact mee?", html: "<p>Tussen de resten van het mysterie ligt een artefact.</p>",
      knoppen: volgorde.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })) });
    const nm = await geefArtefact(h);
    await melding("Een artefact", `${korteNaam(heldDef(h).naam)} neemt ${nm} mee. ${artDef(h.artefacten.at(-1))?.tekst || ""}`);
  }
}
/* De Lange Nacht: na elk mysterie begint een nieuw bedrijf, en Londen wordt grimmiger */
async function nieuwBedrijf() {
  S.bedrijf = S.opgelost + 1;
  const laatste = S.bedrijf >= S.nodig;
  if (S.bedrijf === 2) for (const { m } of alleMonsters()) if (!byId(D.epische, m.id)) m.leven++;
  const regels = [];
  if (S.bedrijf >= 2) regels.push("Gewone monsters hebben 1 Leven meer.");
  if (S.bedrijf >= 3) regels.push("Gewone monsters doen 1 Schade meer.");
  if (laatste) {
    const e = byId(D.epische, god().episch);
    const al = alleMonsters().some(({ m }) => m.id === e.id);
    if (!al && mysterie()?.type !== "episch") { const p = kies1(D.bord.plekken.filter(x => !S.plekken[x.id].monsters.length)).id; spawnEpisch(p); regels.push(`${e.naam} waakt over het laatste geheim en verschijnt in ${plekNaam(p)}.`); }
  }
  const titel = laatste ? "Het laatste bedrijf" : ["", "", "Het tweede bedrijf", "Het derde bedrijf"][S.bedrijf] || `Bedrijf ${S.bedrijf}`;
  const verhaal = laatste ? "De stad houdt haar adem in. Alles wat jullie verzameld hebben, is nu nodig." : S.bedrijf === 2 ? "Londen merkt dat jullie zoeken. Wat in de mist woont, wordt taaier." : "De stad bloedt. De wezens in de straten slaan harder toe.";
  log(`${titel} begint`);
  await venster({ soort: "De Lange Nacht", titel, verhaal, html: `<ul>${regels.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` });
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
    mysterieVolgorde: schud(g.mysteries.map((_, i) => i)), mysterieIndex: 0, voortgang: { scheuren: [] },
    plekken: Object.fromEntries(D.bord.plekken.map(p => [p.id, { aanw: 0, scheur: false, monsters: [] }])),
    overzee: Object.fromEntries(D.bord.overzee.map(o => [o.id, { artefact: false }])),
    scheurStapel: schud(D.bord.plekken.map(p => p.id)),
    onheil: schud(D.onheil.filter(o => !o.god || o.god === godId).map(o => o.id)), onheilAfleg: [],
    geruchten: [], rondeGebruikt: {}, fase: "helden", actief: 0, log: [], einde: null, voorgevoel: false,
    tutorial: !!opties.tutorial, coachGezien: [], klokken: (opties.klokken || []).filter(id => KLOKKEN.some(k => k.id === id)),
    modus: opties.modus === "lang" ? "lang" : "gewoon", bedrijf: 1
  };
  /* De Lange Nacht: één mysterie meer en een ruimere Mist */
  if (S.modus === "lang") { S.nodig += 1; S.mist += LANGE_NACHT.mist; }
  S.kans = schatKans(godId, moeilijkheid, heldIds.length, S.klokken);
  if (klok("dikke-mist")) S.mist -= 2;
  if (klok("ongeduldige-god")) S.nodig += 1;
  S.mistStart = S.mist;
  S.helden = [];
  for (const id of heldIds) S.helden.push(maakHeld(id));
  if (klok("lege-zakken")) for (const h of S.helden) h.pond = 0;
  const n = mo.scheuren + (heldIds.length === 4 ? 1 : 0) + (klok("scheurende-stad") ? 1 : 0);
  for (let i = 0; i < n; i++) { const p = trekScheurPlek(); S.plekken[p].scheur = true; spawnMonster(p); }
  legAanwijzing(klok("zwijgende-getuigen") ? 0 : 3);
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
  UI.undo = []; S.aanbod = {};
  const h = actief();
  h.acties = heeft(h, "gewond") ? 1 : 2; h.gebruikt = []; h.stappen = 0; h.reisActies = 0;
  if (h.id === "owen-marsh") h.stappen++;
  for (const id of h.spullen) h.stappen += spulDef(id)?.bonus?.stap || 0;
  h.stappen += artBonus(h, "stap");
  delete h.ronde.wake; delete h.ronde.doodsmasker;
  UI.bekeken = S.actief;
  opslaan(); teken();
  if (S.tutorial) { UI.coachWacht = S.ronde === 1 && S.actief === 0 ? "start" : S.ronde === 2 && S.actief === 0 ? "ronde2" : "beurt"; if (!bezig) setTimeout(coachUitWachtrij, 30); }
}
function bereikbaar(h) {
  if (S.fase !== "helden" || h !== actief()) return [];
  const kanActie = h.acties > 0 && !(klok("zware-benen") && h.reisActies >= 1); /* reizen mag met beide acties */
  if (h.stappen <= 0 && !kanActie) return [];
  return [...new Set([...burenVan(h, h.plek), ...metroDoelen(h)])];
}
/* De Ondergrondse: vanaf een station reis je voor 1 Pond naar elk ander station, als gewone reisstap. */
function metroDoelen(h) {
  if (!STATIONS.includes(h.plek) || h.pond < 1 || klok("gesloten-lijnen")) return [];
  const buren = burenVan(h, h.plek);
  return STATIONS.filter(x => x !== h.plek && !buren.includes(x));
}
const isMetro = (h, doel) => !burenVan(h, h.plek).includes(doel) && metroDoelen(h).includes(doel);
function reis(doel) {
  const h = actief();
  if (!bereikbaar(h).includes(doel)) return;
  const metro = isMetro(h, doel);
  UI.undo.push({ staat: JSON.stringify(S), label: `${metro ? "de Ondergrondse naar" : "reizen naar"} ${plekNaam(doel)}`, ronde: S.ronde, actief: S.actief });
  if (h.stappen > 0) h.stappen--;
  else { h.acties--; h.reisActies = (h.reisActies || 0) + 1; }
  if (metro) h.pond--;
  const van = plekDef(h.plek);
  UI.reis = { i: S.actief, van: { x: van.x, y: van.y }, naar: doel, t: Date.now() };
  Geluid.reis(); verbergPlekInfo();
  h.plek = doel; log(`${korteNaam(heldDef(h).naam)} ${metro ? "neemt de Ondergrondse" : "reist"} naar ${plekNaam(doel)}`);
  if (doel === "pall-mall") geruchtBezoek(doel);
  opslaan(); teken();
}
function gebruikActie(h, soort) { h.acties--; h.gebruikt.push(soort); }
/* Geannuleerd of niets gedaan: de actie komt terug. */
function geefActieTerug(h) { h.acties++; h.gebruikt.pop(); }
/* Een actie zonder toeval en zonder nieuwe verborgen informatie mag ongedaan worden gemaakt.
   voor is de spelstand van vóór de actie (JSON). */
function terugPunt(voor, label) { UI.undo.push({ staat: voor, label, ronde: S.ronde, actief: S.actief }); }
/* Wat een winkel deze beurt aanbiedt, blijft hetzelfde: opnieuw binnenlopen of ongedaan maken trekt geen nieuwe kaarten. */
function aanbod(h, sleutel, soort, n) {
  S.aanbod ??= {};
  const k = `${S.ronde}:${S.actief}:${h.plek}:${sleutel}`;
  S.aanbod[k] ??= trekMeerdere(soort, n);
  return S.aanbod[k].filter(id => !S.helden.some(x => x.spullen.includes(id) || x.spreuken.includes(id)));
}
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
/* Rondkijken: op elke plek in Londen, één keer per beurt, kost een actie. Zodat een beurt nooit leeg is.
   Zie ontwerp/voorstel-overal-iets-te-doen.md. */
async function rondkijken(h) {
  if (isOverzee(h.plek)) return;
  const k = await venster({ soort: "Rondkijken", titel: plekNaam(h.plek), beeld: `art/plekken/${h.plek}.jpg`,
    html: `<p class="muted">Je hebt ${h.pond} Pond. Kies één ding; het kost een actie.</p>`,
    knoppen: [
      { label: "Inkopen: trek 2 spullen, koop er één voor 1 Pond meer", waarde: "inkopen", uit: heeft(h, "gezocht") || !kanDragen(h) || h.pond < 1 },
      { label: "Rijtuigkaartje kopen (1 Pond): later 2 stappen zonder actie", waarde: "kaartje", uit: h.pond < 1 || !kanDragen(h) },
      { label: `Rondhoren (Waarneming ${metStand(9)}${kansTxt(h, "scherpte", 9, { context: "ontmoeting" })}): 1 Aanwijzing, mislukt −1 Geest`, waarde: "rondhoren" },
      { label: "Toch niet", waarde: null, ghost: true }] });
  if (!k) return;
  const voor = JSON.stringify(S);
  gebruikActie(h, "rondkijken");
  const naam = korteNaam(heldDef(h).naam);
  if (k === "inkopen") {
    const gekocht = await winkel(h, aanbod(h, "inkopen", "spullen", 2), "spul", d => d.prijs + 1);
    if (gekocht) terugPunt(voor, `inkopen: ${gekocht}`); else geefActieTerug(h);
  }
  if (k === "kaartje") { h.pond--; h.spullen.push("rijtuig"); log(`${naam} koopt een rijtuigkaartje`); terugPunt(voor, "rijtuigkaartje kopen"); await melding("Rijtuigkaartje", "Je koopt een kaartje bij een koetsier op de hoek. Gebruik het in een eigen beurt: 2 stappen zonder actie."); }
  if (k === "rondhoren") {
    if (await test(h, "scherpte", 9, "Rondhoren in de buurt", { context: "ontmoeting" })) { h.aanw++; log(`${naam} hoort iets en krijgt 1 Aanwijzing`); await melding("Rondhoren", "In een kroeg, bij een pomp of op de trap van een kerk vang je iets op dat je verder helpt. +1 Aanwijzing."); }
    else { h.G--; log(`${naam} praat met de verkeerde mensen: −1 Geest`); await melding("Rondhoren", "Je stelt je vragen aan de verkeerde mensen. Ze kijken je na tot je om de hoek bent. −1 Geest."); }
  }
  await controleerHeld(h); opslaan(); teken();
}
async function voorbereiden(h) {
  UI.undo.push({ staat: JSON.stringify(S), label: "voorbereiden", ronde: S.ronde, actief: S.actief });
  gebruikActie(h, "voorbereiden");
  h.ronde.voorbereid = true;
  log(`${korteNaam(heldDef(h).naam)} bereidt zich voor op een gevecht`);
  opslaan(); teken();
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
/* Geeft de namen van wat je kocht terug, of "" als je niets kocht. */
async function winkel(h, kaarten, soortNaam, prijsVan) {
  let gekocht = false; const namen = [];
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
    kaarten[kaarten.indexOf(keuze)] = null; gekocht = true; namen.push(d.naam); log(`${korteNaam(heldDef(h).naam)} koopt ${d.naam}`);
  }
  return namen.join(", ");
}
function trekMeerdere(soort, n) {
  const uit = [];
  for (let i = 0; i < n; i++) { const pool = (soort === "spreuken" ? D.spreuken : D.spullen.filter(x => !x.persoonlijk)).map(x => x.id).filter(id => !uit.includes(id) && !S.helden.some(h => h.spullen.includes(id) || h.spreuken.includes(id))); if (pool.length) uit.push(kies1(pool)); }
  return uit;
}
async function dienst(h) {
  const p = plekDef(h.plek), soort = p.dienst, naam = korteNaam(heldDef(h).naam);
  if (heeft(h, "gezocht") && (soort === "markt" || soort === "occulte-boekwinkel")) return melding("Gezocht", "Met je gezicht op elk politiebericht kun je hier niet winkelen. Ga eerst naar de politie in Whitehall.");
  const voor = JSON.stringify(S);
  gebruikActie(h, "dienst");
  if (S.tutorial) await coach("dienst");
  const korting = h.id === "cordelia-vane" ? 1 : 0;
  switch (soort) {
    case "sterrenwacht": await kijkOnheil(2, true); break;
    case "seance": await venster({ soort: "Seance", titel: p.naam, html: await pasToe(h, [{ geest: -1 }, { aanwijzing: 1 }]) }); break;
    case "station": {
      if (klok("gesloten-lijnen")) { await melding("Station", "De klok heeft geslagen: de treinen rijden niet."); h.acties++; h.gebruikt.pop(); break; }
      const doelen = Object.entries(S.plekken).filter(([, x]) => x.scheur).map(([id]) => id);
      if (h.pond < 1 || !doelen.length) { await melding("Station", h.pond < 1 ? "Je hebt geen geld voor een kaartje." : "Er is nergens een Scheur."); geefActieTerug(h); break; }
      const d = await venster({ soort: "Trein (1 Pond)", titel: "Waarheen?", knoppen: [...doelen.map(id => ({ label: plekNaam(id), waarde: id })), { label: "Toch niet", waarde: null, ghost: true }] });
      if (d) { h.pond--; h.plek = d; log(`${naam} neemt de trein naar ${plekNaam(d)}`); terugPunt(voor, `de trein naar ${plekNaam(d)}`); } else geefActieTerug(h);
      break;
    }
    case "bibliotheek": {
      if (await test(h, "kennis", 8, "Studeren in de leeszaal")) {
        const opties = trekMeerdere("spreuken", h.id === "hester-quayle" ? 3 : 2);
        if (opties.length) { const k = await venster({ soort: "Studeren", titel: "Kies een spreuk", html: opties.map(id => `<p><b>${esc(spreukDef(id).naam)}.</b> ${esc(spreukDef(id).tekst)}</p>`).join(""), knoppen: opties.map(id => ({ label: spreukDef(id).naam, waarde: id })) }); h.spreuken.push(k); log(`${naam} leert ${spreukDef(k).naam}`); }
      }
      break;
    }
    case "occulte-boekwinkel": case "markt": {
      const gekocht = soort === "markt"
        ? await winkel(h, aanbod(h, "markt", "spullen", h.id === "hester-quayle" ? 4 : 3), "spul", d => Math.max(d.prijs ? 1 : 0, d.prijs - korting))
        : await winkel(h, aanbod(h, "boekwinkel", "spreuken", 3), "spreuk", () => 2 - korting);
      if (gekocht) terugPunt(voor, `kopen: ${gekocht}`); else geefActieTerug(h);
      break;
    }
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
      if (h.pond < 3) { await melding("Club", "Je hebt 3 Pond nodig."); geefActieTerug(h); break; }
      h.pond -= 3; h.artefactGerucht = true; terugPunt(voor, "een gerucht kopen in de club");
      await melding("Een gerucht in de club", "Je betaalt 3 Pond. Bij je volgende expeditie overzee vind je zeker een artefact.");
      break;
    }
    case "universiteit": {
      const boek = h.spullen.some(id => spulDef(id).soort === "Boek") || h.artefacten.length;
      if (!boek) { await melding("King's College", "Je hebt een Boek of Artefact nodig om te laten onderzoeken."); geefActieTerug(h); break; }
      await venster({ soort: "Onderzoek", titel: p.naam, html: await pasToe(h, [{ aanwijzing: 1 }]) });
      break;
    }
    case "ziekenhuis": {
      const k = await venster({ soort: "Ziekenhuis en bank", titel: "The City", knoppen: [{ label: "Verzorgen: alle Lichaam (1 Pond)", waarde: "heel", uit: h.pond < 1 }, { label: "Gewond laten verwijderen", waarde: "gewond", uit: !heeft(h, "gewond") }, { label: "Lenen: +3 Pond (Schuld)", waarde: "leen", uit: heeft(h, "schuld") }, { label: "Schuld aflossen (4 Pond)", waarde: "los", uit: !heeft(h, "schuld") || h.pond < 4 }, { label: "Niets", waarde: null, ghost: true }] });
      if (k === "heel") { h.pond--; h.L = h.maxL; log(`${naam} wordt verzorgd`); }
      if (k === "gewond") h.toestanden = h.toestanden.filter(t => t !== "gewond");
      if (k === "leen") { h.pond += 3; geefToestand(h, "schuld"); log(`${naam} leent 3 Pond`); }
      if (k === "los") { h.pond -= 4; h.toestanden = h.toestanden.filter(t => t !== "schuld"); log(`${naam} lost de schuld af`); }
      if (k) terugPunt(voor, { heel: "verzorgen", gewond: "Gewond laten verwijderen", leen: "lenen", los: "schuld aflossen" }[k]); else geefActieTerug(h);
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
      if (k) terugPunt(voor, k === "g" ? "Gezocht laten vervallen" : "een agent meenemen"); else geefActieTerug(h);
      break;
    }
    case "kerk": {
      const k = await venster({ soort: "De abdij", titel: p.naam, knoppen: [{ label: "Vloek laten opheffen", waarde: "v", uit: !heeft(h, "vervloekt") }, { label: "Zegen ontvangen", waarde: "z", uit: heeft(h, "gezegend") }, { label: "Niets", waarde: null, ghost: true }] });
      if (k) { await pasToe(h, [k === "v" ? { verwijder: "vervloekt" } : { toestand: "gezegend" }]); terugPunt(voor, k === "v" ? "de vloek laten opheffen" : "de zegen ontvangen"); } else geefActieTerug(h);
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
      if (h.pond < bootPrijs()) { await melding("De dokken", `Een bootkaartje kost ${bootPrijs()} Pond.`); geefActieTerug(h); break; }
      const d = await venster({ soort: `Bootkaartje (${bootPrijs()} Pond)`, titel: "Op expeditie", knoppen: [...D.bord.overzee.map(o => ({ label: o.naam, waarde: o.id })), { label: "Toch niet", waarde: null, ghost: true }] });
      if (d) { h.pond -= bootPrijs(); h.plek = d; log(`${naam} vaart naar ${plekNaam(d)}`); terugPunt(voor, `de boot naar ${plekNaam(d)}`); } else geefActieTerug(h);
      break;
    }
    case "rivierpolitie": {
      const d = await venster({ soort: "Roeiboot", titel: "Waarheen over de rivier?", knoppen: [...D.bord.rivier.filter(r => r !== h.plek).map(id => ({ label: plekNaam(id), waarde: id })), { label: "Toch niet", waarde: null, ghost: true }] });
      if (d) { h.plek = d; log(`${naam} roeit naar ${plekNaam(d)}`); terugPunt(voor, `de roeiboot naar ${plekNaam(d)}`); } else geefActieTerug(h);
      break;
    }
  }
  await controleerHeld(h);
  opslaan(); teken();
}
async function ruil(h) {
  const anderen = S.helden.filter(x => x !== h && x.plek === h.plek);
  const naar = anderen.length === 1 ? anderen[0] : await venster({ soort: "Ruilen", titel: "Met wie?", knoppen: [...anderen.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })), { label: "Toch niet", waarde: null, ghost: true }] });
  if (!naar) return;
  const voor = JSON.stringify(S);
  gebruikActie(h, "ruilen");
  let geruild = false;
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
    geruild = true;
    if (k[0] === "pond") { h.pond--; naar.pond++; }
    else if (k[0] === "aanw") { h.aanw--; naar.aanw++; }
    else if (k[0] === "neem") { naar[k[1]] = naar[k[1]].filter(x => x !== k[2]); h[k[1]].push(k[2]); }
    else { h[k[0]] = h[k[0]].filter(x => x !== k[1]); naar[k[0]].push(k[1]); }
  }
  if (geruild) terugPunt(voor, `ruilen met ${korteNaam(heldDef(naar).naam)}`); else geefActieTerug(h);
  await controleerAlles(); opslaan(); teken();
}

/* ---------- spullen en spreuken gebruiken ---------- */
async function gebruikSpul(h, id) {
  const s = spulDef(id), naam = korteNaam(heldDef(h).naam);
  const weg = () => { h.spullen = h.spullen.filter(x => x !== id); };
  const mon = S.plekken[h.plek]?.monsters || [];
  switch (s.gebruik) {
    case "effect": {
      if (s.perRonde) { if (h.ronde["gb-" + id]) return melding(s.naam, "Eén keer per ronde."); h.ronde["gb-" + id] = true; } else weg();
      await venster({ soort: s.soort, titel: s.naam, html: await pasToe(h, s.effect || []) });
      break;
    }
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
      if (klok("gesloten-lijnen")) return melding(s.naam, "De Ondergrondse rijdt niet.");
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
    case "breien": {
      if (h.ronde.breien) return melding(s.naam, "Eén keer per ronde.");
      const doel = S.helden.filter(x => x.plek === h.plek && x.G < x.maxG);
      if (!doel.length) return melding(s.naam, "Niemand hier heeft het koud.");
      const x = doel.length === 1 ? doel[0] : await venster({ soort: s.naam, titel: "Voor wie is de sjaal?", knoppen: doel.map(x => ({ label: korteNaam(heldDef(x).naam), waarde: x })) });
      h.ronde.breien = true; x.G = Math.min(x.maxG, x.G + 1); await melding(s.naam, `${korteNaam(heldDef(x).naam)} slaat de warme sjaal om en herstelt 1 Geest.`); break;
    }
    case "horloge": weg(); h.pond += 3; await melding(s.naam, "Een heler in Petticoat Lane bekijkt het horloge met een loep en telt drie pond uit. Hij vraagt niet waar het vandaan komt."); break;
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
  if (s.perRonde && h.ronde["sp-" + id]) return melding(s.naam, "Deze spreuk werkt maar één keer per ronde.");
  if (s.perRonde) h.ronde["sp-" + id] = true;
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
    if (s.mislukt) { await venster({ soort: "Spreuk", titel: `${s.naam} mislukt`, html: await pasToe(h, s.mislukt) }); }
    else await melding(s.naam, "De spreuk mislukt. " + (s.tekst.includes("Mislukt") ? s.tekst.split("Mislukt:")[1] : ""));
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
      case "effect": await venster({ soort: "Spreuk", titel: s.naam, html: await pasToe(h, s.effect || []) }); break;
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
  } else if (a.gebruik) {
    /* algemeen: prijs, test of gok, effect; per ronde of eenmalig (dan leg je hem af) */
    const g = a.gebruik;
    if (g.perRonde) { if (h.ronde["art-" + id]) return melding(a.naam, "Eén keer per ronde."); }
    else if (!await venster({ soort: "Artefact", titel: a.naam, html: `<p>${esc(a.tekst)}</p><p class="muted">Daarna leg je ${esc(a.naam)} af.</p>`, knoppen: [{ label: "Gebruiken", waarde: true }, { label: "Nog niet", waarde: false, ghost: true }] })) return;
    if (g.perRonde) h.ronde["art-" + id] = true; else weg();
    let html = g.prijs ? await pasToe(h, g.prijs) : "";
    if (g.vlag) h.ronde[g.vlag] = true;
    if (g.test) {
      const ok = await test(h, g.test.kenmerk, g.test.moeilijkheid, a.naam);
      html += await pasToe(h, ok ? g.effect || [] : g.mislukt || []);
    } else if (g.gok) {
      const w = d6(), ok = w >= 4;
      html += `<p>Je gooit een <b>${w}</b>.</p>` + await pasToe(h, ok ? g.gok.goed : g.gok.slecht);
    } else if (g.effect) html += await pasToe(h, g.effect);
    log(`${naam} gebruikt ${a.naam}`);
    await venster({ soort: "Artefact", titel: a.naam, html: html || "<p>Het werkt.</p>" });
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
  /* Morghast: de doden blijven niet liggen */
  if (S.god === "morghast" && !byId(D.epische, m.id) && !d.komtTerug && d6() === 1) { const p = kies1(D.bord.plekken).id; S.plekken[p].monsters.push({ uid: ++S.teller, id: m.id, leven: d.leven }); log(`${d.naam} staat weer op in ${plekNaam(p)}`); await melding("De doden blijven niet liggen", `${d.naam} staat weer op, in ${plekNaam(p)}.`); }
  if (d.komtTerug && d6() <= 2) { const p = d.id === "knekelman" ? kies1(D.bord.plekken).id : kies1(D.bord.rivier); S.plekken[p].monsters.push({ uid: ++S.teller, id: m.id, leven: d.leven }); log(`${d.naam} komt terug in ${plekNaam(p)}`); }
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
  const zwaard = h.id === "julian-hartwell" && !d.vechtMet; /* Zwaard van licht: Kennis in plaats van Kracht, wapens tellen mee */
  const kenmerk = d.vechtMet || (zwaard ? "kennis" : "kracht");
  const nebet = S.god === "nebet-ankhu" && h.artefacten.length ? 1 : 0;
  const vuurwapen = h.spullen.some(x => x === "webley" || x === "olifantengeweer" || spulDef(x)?.vuurwapen) || h.eigen.some(e => /Revolver|geweer|pistool|Derringer/i.test(e.naam));
  const kogels = (kenmerk === "kracht" || zwaard) && vuurwapen && d.gruwel >= 2 && h.spullen.includes("zilveren-kogels") ? 2 : 0;
  const terrier = h.spullen.includes("dier-terrier") && D.bord.rivier.includes(plek) ? 1 : 0;
  const bonus = (kenmerk === "kracht" || zwaard ? wapenBonus(h, d.mens) : 0) + nebet + kogels + terrier;
  const voorbereid = h.ronde.voorbereid ? 1 : 0;
  const gruwel = S.plekken[plek]?.belRonde === S.ronde ? 0 : d.gruwel;
  const gruwelOpt = () => ({ extra: h.ronde.pentagram ? 1 : 0, bonus: (h.artefacten.includes("jade-masker") ? 2 : 0) + artBonus(h, "gruwel") + h.spullen.reduce((t, id) => t + (spulDef(id)?.bonus?.gruwel || 0), 0) });
  const kansen = [gruwel > 0 && !h.ronde.wake ? `gruwel weerstaan ${kans(h, "kennis", 8, gruwelOpt())}%` : "", `raken ${kans(h, kenmerk, d.taaiheid, { bonus, extra: voorbereid })}%`].filter(Boolean).join(" · ");
  if (h.spreuken.includes("verbanning")) opties.find(o => o.waarde === "verban").label += kansTxt(h, "kennis", d.taaiheid, { bonus: nebet, spreuk: true, extra: voorbereid });
  const k = await venster({ soort: ep ? "Episch monster" : "Gevecht", thema: "monster", titel: d.naam, beeld: `art/monsters/${d.id}.jpg`, zij: true, achterkant: "monster", geluid: "monster", verhaal: d.eigenschap,
    html: `<p>Gruwel <b>${d.gruwel}</b> · Taaiheid <b>${d.taaiheid}</b> · Schade <b>${d.schade}</b> · Leven <b>${m.leven}</b></p><p class="muted">${esc(naam)} vecht met ${KNAAM[kenmerk]}${voorbereid ? ", voorbereid (+1 dobbelsteen)" : ""}. Kans: ${kansen}.${h.aanw > 0 && !klok("geen-tweede-worp") ? " Mislukt je worp, dan mag je een Aanwijzing uitgeven om opnieuw te gooien." : ""}</p>`, knoppen: opties });
  if (k === "dyn") { await gebruikSpul(h, "dynamiet"); return true; }
  if (k === "chl") { await gebruikSpul(h, "chloroform"); return true; }
  if (k === "glorie") { h.ronde.glorie = true; log(`${naam} glipt ongezien langs ${d.naam}`); return false; }
  if (gruwel > 0 && !h.ronde.wake) {
    const go = gruwelOpt(); delete h.ronde.pentagram;
    if (!await test(h, "kennis", 8, `Gruwel van ${d.naam}`, go)) { const g = gruwel + (h.id === "julian-hartwell" ? 1 : 0); h.G -= g; log(`${naam} verliest ${g} Geest door gruwel`); }
    await controleerHeld(h);
    if (h.plek !== plek) return false;
  }
  let gelukt;
  if (k === "verban") {
    const p = spreukPrijs(h, spreukDef("verbanning")); h.G -= p.geest;
    gelukt = await test(h, "kennis", d.taaiheid, `Verbanning tegen ${d.naam}`, { bonus: nebet, spreuk: true, extra: voorbereid, gevecht: true });
  } else {
    if (kogels) { h.spullen = h.spullen.filter(x => x !== "zilveren-kogels"); log(`${naam} laadt zilveren kogels`); }
    gelukt = await test(h, kenmerk, d.taaiheid, `Gevecht tegen ${d.naam}`, { bonus, extra: voorbereid, gevecht: true });
  }
  if (gelukt) {
    const schade = 1 + overslag();
    m.leven -= schade;
    const extraTxt = schade > 1 ? ` Overslag: ${schade} schade.` : "";
    if (m.leven <= 0) { await monsterVerslagen(h, plek, m); await melding("Verslagen", `${d.naam} is verslagen.${extraTxt}`, "Gevecht"); return true; }
    await melding("Raak", `${d.naam} is gewond maar staat nog (${m.leven} leven).${extraTxt}`, "Gevecht");
    return false;
  }
  /* artefacten met een prijs bij een misser (het Zwaard van de Tempeliers) */
  const misPrijs = h.artefacten.flatMap(id => artDef(id)?.gevechtMis || []);
  if (misPrijs.length) { await pasToe(h, misPrijs); log(`${naam} betaalt de prijs van een wapen dat bloed wil`); }
  /* Brede schouders: Aggie mag de klap opvangen voor een andere held op haar plek */
  const aggie = S.helden.find(x => x.id === "aggie-pruitt" && x !== h && x.plek === plek && x.L > 0);
  const vanger = aggie && await venster({ soort: "Brede schouders", titel: "Vangt Aggie de klap op?", html: `<p>${esc(d.naam)} raakt ${esc(naam)} voor ${d.schade} Lichaam. Aggie heeft ${aggie.L} Lichaam.</p>`, knoppen: [{ label: "Aggie vangt hem op", waarde: true }, { label: "Nee", waarde: false, ghost: true }] }) ? aggie : h;
  const verloren = verliesLichaam(vanger, d.schade); log(`${korteNaam(heldDef(vanger).naam)} verliest ${verloren} Lichaam tegen ${d.naam}`);
  if (vanger !== h) { log(`Aggie vangt de klap op voor ${naam}`); await melding("Brede schouders", `Aggie stapt ervoor en vangt de klap op: −${verloren} Lichaam.`, "Gevecht"); await controleerHeld(vanger); return false; }
  let extra = "";
  if (d.verliesWaanzin) extra = ` Je krijgt waanzin: ${geefWaanzin(h)}.`;
  if (d.verliesPond && h.pond > 0) { h.pond = Math.max(0, h.pond - d.verliesPond); extra += ` Het steelt ${d.verliesPond} Pond.`; }
  if (d.herstelt && m.leven < d.leven + (S.helden.length === 4 && byId(D.epische, m.id) ? 2 : 0)) { m.leven += d.herstelt; extra += ` ${d.naam} naait zichzelf dicht: +${d.herstelt} leven.`; }
  if (d.id === "rivierwiedde") { const r = burenVan(null, plek).filter(x => D.bord.rivier.includes(x)); if (r.length) { h.plek = kies1(r); extra += ` Je wordt meegesleurd naar ${plekNaam(h.plek)}.`; } }
  await melding("Verloren", `${d.naam} raakt je: −${verloren} Lichaam.${extra}`, "Gevecht");
  await controleerHeld(h);
  return false;
}

/* ---------- scheuren ---------- */
async function sluitScheur(h, plek = h.plek) {
  S.plekken[plek].scheur = false; h.trofee++;
  log(`${korteNaam(heldDef(h).naam)} sluit de Scheur in ${plekNaam(plek)}`);
  await overgang("dicht", "De Scheur trekt dicht");
  await melding("Scheur gesloten", `De Scheur in ${plekNaam(plek)} trekt dicht. +1 Trofee.`);
  if (scheurGesloten(plek)) await losOp();
}

/* ---------- kaarten trekken ---------- */
/* Voorwaarden op een kaart: vlag (een eerdere kaart zette een verhaal in gang), nietVlag,
   mistTot (pas als de Mist zo laag staat: de stad wordt grimmiger) en vanafRonde. */
function kaartMagMee(e) {
  const v = S.vlaggen || {};
  if (e.vlag && !v[e.vlag]) return false;
  if (e.nietVlag && v[e.nietVlag]) return false;
  if (e.mistTot != null && S.mist > e.mistTot) return false;
  if (e.vanafRonde != null && S.ronde < e.vanafRonde) return false;
  return true;
}
function trekKaart(lijst, filter) {
  S.gespeeld ??= [];
  const past = lijst.filter(e => (!e.god || e.god === S.god) && kaartMagMee(e) && filter(e));
  const vers = past.filter(e => !S.gespeeld.includes(e.id));
  const pool = vers.length ? vers : past.filter(e => !e.vlag);
  /* verhaalkaarten van deze god tellen 3 keer, vervolgkaarten 4 keer: een verhaal dat loopt, komt snel terug */
  const gewogen = pool.flatMap(e => e.vlag ? [e, e, e, e] : e.god ? [e, e, e] : [e]);
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
  if (eigen && eigen.monsters.length && h.id === "lottie-finch" && !h.ronde.verstopt && !heeft(h, "waanzin-hoogmoed")) {
    const v = await venster({ soort: "Verstoppen", titel: "Verstopt Lottie zich?", html: `<p>Er staat een monster op je plek. Verstop je je, dan vecht je niet, maar heb je wel je ontmoeting. Eén keer per ronde.</p>`, knoppen: [{ label: "Verstoppen", waarde: true }, { label: "Vechten", waarde: false, ghost: true }] });
    if (v) { h.ronde.verstopt = true; log(`${naam} verstopt zich`); }
  }
  if (eigen && eigen.monsters.length && !h.ronde.verstopt && !(h.ronde.doodsmasker && !heeft(h, "waanzin-hoogmoed"))) {
    await overgang("monster", eigen.monsters.length > 1 ? "Monsters!" : monsterDef(eigen.monsters[0].id).naam);
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
    await overgang("expeditie", plekNaam(plek));
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
    scheurBeeld();
    await overgang("scheur", `${naam} stapt door de Scheur`);
    await speelKaart(h, kaart, "Aan de andere kant", scheurBeeld(), "scheur");
    if ((h.plek !== plek && !h.ronde.astraal) || !p.scheur) return;
    const lens = h.artefacten.includes("vuurtoren-lens") && h.kenm.scherpte > h.kenm.kennis ? "scherpte" : "kennis";
    const k = await venster({ soort: "Scheur", thema: "scheur", portaal: true, beeld: scheurBeeld(), titel: `De Scheur in ${plekNaam(plek)}`, html: `<p>Probeer je hem te sluiten? (${KNAAM[lens]})</p>`,
      knoppen: [{ label: `Sluiten met 1 Aanwijzing (${metStand(8)}${kansTxt(h, lens, 8)})`, waarde: "a", uit: h.aanw < 1 }, { label: `Sluiten zonder Aanwijzing (${metStand(10)}${kansTxt(h, lens, 10)})`, waarde: "z" }, { label: "Laten", waarde: null, ghost: true }] });
    if (k) {
      if (k === "a") h.aanw--;
      if (await test(h, lens, k === "a" ? 8 : 10, "De Scheur sluiten")) await sluitScheur(h, plek);
      else await melding("De Scheur blijft open", "Het lukt niet. De randen trillen nog na.");
    }
    return;
  }
  if (p.aanw > 0) {
    const kaart = trekKaart(D.ontmoetingen.aanwijzing, () => true);
    await overgang("aanwijzing", "Een spoor");
    /* een aanwijzingskaart kan een eigen test hebben (een getuige: Charisma, een geheimschrift: Kennis); anders Waarneming 7 */
    const t = kaart.test || { kenmerk: "scherpte", moeilijkheid: 7 };
    const k = await venster({ soort: "Aanwijzing", thema: "aanwijzing", titel: plekNaam(plek), beeld: `art/plekken/${plek}.jpg`, achterkant: "mysterie", verhaal: kaart.tekst, knoppen: [{ label: `${kaart.actie || "Onderzoeken"} (${KNAAM[t.kenmerk]} ${metStand(t.moeilijkheid)}${kansTxt(h, t.kenmerk, t.moeilijkheid, { context: "ontmoeting" })})`, waarde: true }] });
    if (k && await test(h, t.kenmerk, t.moeilijkheid, "Een spoor volgen", { context: "ontmoeting" })) { p.aanw--; h.aanw++; log(`${naam} vindt een Aanwijzing in ${plekNaam(plek)}`); }
    else if (k && kaart.mislukt) await venster({ soort: "Mislukt", titel: naam, thema: "aanwijzing", verhaal: kaart.mislukt.tekst, html: await pasToe(h, kaart.mislukt.effect || []) }), await controleerHeld(h);
    return;
  }
  /* plek "overal": vervolgkaarten die je vinden waar je ook bent */
  const kaart = trekKaart(D.ontmoetingen.stad, e => e.plek === plek || e.plek === "overal");
  await overgang("stad", plekNaam(plek));
  await speelKaart(h, kaart, plekNaam(plek), `art/plekken/${plek}.jpg`, "stad");
}
async function speelKaart(h, kaart, soort, beeld, rug) {
  const naam = korteNaam(heldDef(h).naam);
  const persoon = kaart.persoon ? byId(D.personen, kaart.persoon) : null;
  const pBeeld = persoon && art(`art/personen/${persoon.id}.jpg`) ? `art/personen/${persoon.id}.jpg` : null;
  const kop = { soort, titel: naam, beeld: pBeeld || beeld, zij: !!pBeeld, achterkant: rug, thema: rug, portaal: rug === "scheur" && !pBeeld, verhaal: kaart.tekst };
  const metWie = persoon ? `<p class="persoonregel"><b>${esc(persoon.naam)}</b> · ${esc(persoon.rol)}</p>` : "";
  const uitkomst = async (ok, uit) => {
    const html = await pasToe(h, uit.effect || []);
    await venster({ soort: ok === null ? soort : ok ? "Gelukt" : "Mislukt", titel: naam, beeld: pBeeld, zij: !!pBeeld, thema: rug, verhaal: uit.tekst, html });
    await controleerHeld(h);
  };
  const doeTest = async t => test(h, t.kenmerk, t.moeilijkheid, t.kenmerk === "kracht" ? "Doorzetten" : "Wat doe je?", { context: "ontmoeting" });
  if (kaart.keuzes) {
    /* een keuze met "held" verschijnt alleen voor die helden, een keuze met "spul" alleen als je het bij je hebt */
    const mag = k => (!k.held || k.held.includes(h.id)) && (!k.spul || h.spullen.includes(k.spul) || h.eigen.some(e => e.id === k.spul));
    const teKort = k => !k.test && (k.effect || []).some(e => (e.pond < 0 && -e.pond > h.pond) || (e.aanwijzing < 0 && -e.aanwijzing > h.aanw));
    const i = await venster({ ...kop, html: metWie + `<p class="muted">Wat doe je?</p>`, knoppen: kaart.keuzes.map((k, i) => [k, i]).filter(([k]) => mag(k)).map(([k, i]) => ({ label: (k.held || k.spul ? "★ " : "") + (k.test ? k.label.replace(/\((\w+) (\d+)\)/, (_, kn, n) => `(${kn} ${metStand(+n)}${kansTxt(h, k.test.kenmerk, k.test.moeilijkheid, { context: "ontmoeting" })})`) : k.label), waarde: i, uit: teKort(k) })) });
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
  await venster({ ...kop, html: metWie, knoppen: [{ label: `${KNAAM[kaart.test.kenmerk]}-test (${metStand(kaart.test.moeilijkheid)}${kansTxt(h, kaart.test.kenmerk, kaart.test.moeilijkheid, { context: "ontmoeting" })})`, waarde: true }] });
  const ok = await doeTest(kaart.test);
  await uitkomst(ok, ok ? kaart.gelukt : kaart.mislukt);
}
async function ontmoetingsfase(start = 0) {
  S.fase = "ontmoeting";
  scheurBeeld();
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
function geruchtDoel(g) {
  const p = plekNaam(g.plek);
  return { bezoek: `Bezoek ${p}.`, ophalen: `Haal de Aanwijzingen in ${p} op.`, sluiten: `Sluit de Scheur in ${p}.`, verslaan: `Versla het monster in ${p}.` }[g.soort] || "";
}
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
  const onheilBeeld = c => { const p = c.persoon && byId(D.personen, c.persoon); return p ? `art/personen/${p.id}.jpg` : "art/fiches/mist.jpg"; };
  const metWie = c => { const p = c.persoon && byId(D.personen, c.persoon); return p ? `<p class="persoonregel"><b>${esc(p.naam)}</b> · ${esc(p.rol)}</p>` : ""; };
  const detail = [c.mist ? `Mist −${c.mist}` : "", c.scheur ? `${c.scheur} Scheur${c.scheur > 1 ? "en" : ""}` : "", c.monster ? `${c.monster} monster${c.monster > 1 ? "s" : ""}` : "", c.extra || "", c.gerucht ? "Gerucht: " + c.gerucht : ""].filter(Boolean).join(" · ");
  if (await venster({ soort: `Onheil · ronde ${S.ronde}`, titel: c.naam, beeld: onheilBeeld(c), zij: true, achterkant: "onheil", geluid: "onheil", verhaal: c.tekst, html: `${metWie(c)}<p>${esc(detail)}</p>`, knoppen })) {
    S.voorgevoel = true; S.onheilAfleg.push(id);
    if (!S.onheil.length) { S.onheil = schud(S.onheilAfleg); S.onheilAfleg = []; }
    id = S.onheil.pop(); c = byId(D.onheil, id);
    await venster({ soort: "Nieuwe onheilskaart", titel: c.naam, beeld: onheilBeeld(c), zij: true, verhaal: c.tekst, html: `${metWie(c)}<p>${esc([c.mist ? `Mist −${c.mist}` : "", c.extra || "", c.gerucht ? "Gerucht: " + c.gerucht : ""].filter(Boolean).join(" · "))}</p>` });
  }
  S.onheilAfleg.push(id);
  S.mist -= c.mist;
  let voorkeur = null;
  for (const a of c.acties) if (a.type === "voorkeurMonster") voorkeur = a.id;
  for (let i = 0; i < c.scheur; i++) openScheurOp(trekScheurPlek());
  const scheurPlekken = () => Object.keys(S.plekken).filter(p => S.plekken[p].scheur);
  for (let i = 0; i < c.monster; i++) { const sp = scheurPlekken(); spawnMonster(sp.length ? kies1(sp) : kies1(D.bord.plekken).id, voorkeur); }
  for (const a of c.acties) {
    const opPlek = h => (a.plekken === "rivier" ? D.bord.rivier : a.plekken).includes(h.plek);
    if (a.type === "monsterOp") spawnMonster(a.plek, a.id);
    if (a.type === "vlag") (S.vlaggen ??= {})[a.vlag] = true;
    if (a.type === "scheurOp") openScheurOp(a.plek);
    if (a.type === "geestOp") for (const h of S.helden) if (opPlek(h)) h.G = Math.min(h.maxG, h.G + a.waarde);
    if (a.type === "aanwijzingOpHelden") for (const h of S.helden) if (opPlek(h)) h.aanw += a.aantal;
    if (a.type === "pondAlle") for (const h of S.helden) h.pond = Math.max(0, h.pond + a.waarde);
    if (a.type === "verwijderAlle") for (const h of S.helden) h.toestanden = h.toestanden.filter(t => t !== a.toestand);
    if (a.type === "geestMetSpreuk") for (const h of S.helden) if (h.spreuken.length) h.G = Math.min(h.maxG, h.G + a.waarde);
    if (a.type === "aanwijzingRijkste") { const h = [...S.helden].sort((x, y) => y.aanw - x.aanw)[0]; if (h && h.aanw > 0) { h.aanw = Math.max(0, h.aanw + a.waarde); log(`${korteNaam(heldDef(h).naam)} raakt een Aanwijzing kwijt`); } }
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
    if (a.type === "gerucht") {
      S.geruchten.push({ ...a, naam: c.naam });
      if (a.soort === "ophalen") S.plekken[a.plek].aanw += a.aantal;
      if (a.soort === "sluiten" && !S.plekken[a.plek].scheur) openScheurOp(a.plek);
      if (a.soort === "verslaan") { const p = beschermd(a.plek) ? null : a.plek; if (p) S.plekken[p].monsters.push({ uid: ++S.teller, id: a.id, leven: monsterDef(a.id).leven }); else spawnMonster(a.plek, a.id); }
    }
  }
  /* vaste gevolgen elke ronde */
  beweegMonsters(false);
  for (const { plek, m } of alleMonsters()) { const d = monsterDef(m.id); if (d.aura) for (const h of S.helden) if (h.plek === plek) h.G += d.aura.geest; }
  for (const h of S.helden) {
    if (S.god === "nebet-ankhu" && h.artefacten.length) h.G--;
    if (S.god === "azh-ilareth" && h.plek === "hampstead") h.G = Math.min(h.maxG, h.G + 1);
    if (S.god === "ysmara" && !isOverzee(h.plek) && S.helden.filter(x => x.plek === h.plek).length === 1) { h.G--; log(`${korteNaam(heldDef(h).naam)} staat alleen en hoort de Doornkoningin roepen: −1 Geest`); }
    if (h.artefacten.includes("kristallen-schedel") && d6() === 1) h.G--;
    for (const id of h.artefacten) { const v = artDef(id)?.vloek; if (v && d6() <= v.kans) { await pasToe(h, v.effect); log(`${artDef(id).naam} eist zijn prijs van ${korteNaam(heldDef(h).naam)}`); } }
    if (heeft(h, "verslaafd")) { if (h.pond > 0) h.pond--; else h.G--; }
    if (heeft(h, "schuld") && d6() === 1) verliesLichaam(h, 1);
    if (h.spullen.includes("bondgenoot-straatjongens") && S.ronde % 2 === 0) { if (h.pond > 0) h.pond--; else { h.spullen = h.spullen.filter(x => x !== "bondgenoot-straatjongens"); log("De straatjochies gaan ervandoor: geen penny"); } }
    if (heeft(h, "waanzin-tekenen") && d6() === 1) openScheurOp(h.plek);
  }
  for (const g of S.geruchten) {
    if (g.soort === "ophalen" && S.plekken[g.plek].aanw === 0) g.klaar = true;
    if (g.soort === "sluiten" && !S.plekken[g.plek].scheur) g.klaar = true;
    if (g.soort === "verslaan" && !S.plekken[g.plek].monsters.length) g.klaar = true;
    g.rondes--;
    if (!g.klaar && g.rondes <= 0) { S.mist -= g.straf; log(`Gerucht "${g.naam}" loopt slecht af: Mist −${g.straf}`); await melding("Een gerucht wordt waar", `${g.naam}: de Mist daalt met ${g.straf}.`); }
  }
  S.geruchten = S.geruchten.filter(g => !g.klaar && g.rondes > 0);
  const violet = S.helden.find(h => h.id === "violet-thorne" && !isOverzee(h.plek) && S.plekken[h.plek].monsters.length);
  if (violet) {
    const d = await venster({ soort: "Onderschepping", titel: "Violet glipt weg?", html: "<p>Er staat een monster op Violets plek. Ze mag meteen één plek verder reizen.</p>", knoppen: [...burenVan(violet, violet.plek).map(x => ({ label: plekNaam(x), waarde: x })), { label: "Blijven", waarde: null, ghost: true }] });
    if (d) { violet.plek = d; log(`Violet glipt weg naar ${plekNaam(d)}`); }
  }
  if (klok("slapeloze-nachten") && S.ronde % 3 === 0) { S.mist -= 1; log("Big Ben slaat dertien: de Mist daalt 1 extra"); await melding("Slapeloze nachten", "Big Ben slaat dertien. De Mist daalt 1 extra.", "De Klokken van Westminster"); }
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
  if (S.moeilijkheid === "genadeloos" || klok("geen-genade")) return einde();
  S.fase = "finale";
  if (S.verzet == null) {
    S.verzet = (S.nodig - S.opgelost) * 4 + 4 + (S.helden.length === 4 ? 2 : 0);
    log(`${g.naam} ontwaakt. De laatste nacht begint.`);
    const img = art(`art/goden/${g.id}.jpg`);
    await venster({ soort: "De Mist is op", titel: `${g.naam} ontwaakt`, breed: true, html: `${img ? `<img class="godintro" src="${img}" alt="">` : ""}
      <p class="verhaal">${esc(g.ontwaken.replace(/ Jullie verliezen\.?$/, ""))}</p>
      <p><b>De laatste nacht.</b> Er is nog één kans. ${esc(g.naam)} heeft <b>${S.verzet} verzet</b>. Om de beurt weerstaat elke held de blik van de god (Kennis 9, anders −2 Geest) en valt aan (Kracht met wapens, of Kennis met +1 per spreuk, tegen ${10 + (MOEILIJKHEID[S.moeilijkheid].finale || 0)}). Elke geslaagde aanval kost de god 1 verzet, en 1 extra voor elke 3 boven het doel. Na elke ronde verliest iedereen 1 Lichaam en 1 Geest. Wie op 0 komt, valt af.</p>
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
      if (await test(h, k, 10 + (MOEILIJKHEID[S.moeilijkheid].finale || 0), `Aanval op ${g.naam}`, { bonus: k === "kracht" ? wapenBonus(h, false) : spreuk })) { S.verzet = Math.max(0, S.verzet - 1 - overslag()); log(`${naam} raakt ${g.naam}: nog ${S.verzet} verzet`); }
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
  beurt: ["Jouw beurt", `<p>Elke held doet <b>2 acties</b> per ronde. Reizen mag je twee keer doen; de andere acties één keer per beurt. Plekken waar je heen kunt, lichten groen op: tik erop om te reizen.</p><p>De knoppen rechts zijn de andere acties: <b>rusten</b>, de <b>dienst</b> van de plek (winkelen, studeren, genezen…), <b>rondkijken</b> (overal: inkopen, een rijtuigkaartje of rondhoren), <b>ruilen</b> met een held op dezelfde plek en het <b>mysterie</b>. Spreuken spreek je uit bij je kaarten.</p><p>Ben je klaar? Tik op <b>Beurt klaar</b>. Onder <b>Tip</b> zie je steeds een suggestie.</p>`],
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
  if (m?.type === "breng") return S.helden.some(x => x.mysterieVoorwerp) ? `Breng ${esc(m.voorwerp)} naar <b>${esc(plekNaam(m.naar))}</b>.` : isOverzee(m.van) ? `Reis via St Katharine Docks naar <b>${esc(plekNaam(m.van))}</b> en zoek daar ${esc(m.voorwerp)}.` : `Ga naar <b>${esc(plekNaam(m.van))}</b> en zoek daar ${esc(m.voorwerp)}.`;
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
  el.innerHTML = `<div class="hb-kop"><button class="btn ghost terug-boven" data-hb="sluit" aria-label="Terug">← Terug</button><h2>Handleiding</h2></div>
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
  Geluid.sfeer(!S ? "start" : S.einde ? null : S.god);
  Geluid.muziek(!S || !S.einde);
  if (!S) return tekenStart();
  if (S.einde) { if (UI.eindeGeluid !== S.einde) { UI.eindeGeluid = S.einde; S.einde === "verlies" ? Geluid.verlies() : Geluid.winst(); } return tekenEinde(); }
  UI.eindeGeluid = null;
  const g = god(), mys = mysterie();
  app.innerHTML = `<div class="spel">
    <header class="balk">
      <button class="godknop" data-act="god" title="Over ${esc(g.naam)}"><h1>${esc(g.naam)}</h1></button>
      <span class="stat">Ronde <b>${S.ronde}</b>${S.modus === "lang" ? ` · bedrijf <b>${S.bedrijf || 1}</b>` : ""}</span>
      <span class="stat">${{ helden: "Heldenfase", ontmoeting: "Ontmoetingen", onheil: "Onheil", finale: "De laatste nacht" }[S.fase]}</span>
      <span class="stat" title="Mist">Mist <b>${S.mist}</b></span>
      <span class="mistbalk" aria-hidden="true">${Array.from({ length: S.mistStart || g.mist }, (_, i) => `<i class="${i < S.mist ? "" : "weg"}"></i>`).join("")}</span>
      <span class="stat">Mysteries <b>${S.opgelost}/${S.nodig}</b>${mys ? `: ${esc(mys.naam)}` : ""}</span>
      ${S.klokken?.length ? `<button class="stat klokchip" data-act="klokken-info" title="${esc(S.klokken.map(id => KLOKKEN.find(k => k.id === id)?.naam).join(", "))}">Klokken <b>${S.klokken.map(id => ROMEINS[KLOKKEN.findIndex(k => k.id === id)]).join(" ")}</b></button>` : ""}
      ${S.fase === "helden" ? `<span class="stat beurtchip" style="--kleur:${KLEUREN[S.actief]}">Aan de beurt: <b>${esc(korteNaam(heldDef(actief()).naam))}</b></span>` : ""}
      <div class="rechts"><button class="btn small ghost" data-act="geluid" aria-pressed="${Geluid.aan}">${Geluid.aan ? "Geluid uit" : "Geluid aan"}</button>${Geluid.heeftMuziek && Geluid.aan ? `<button class="btn small ghost" data-act="muziek" aria-pressed="${Geluid.muziekAan}">${Geluid.muziekAan ? "Muziek uit" : "Muziek aan"}</button>` : ""}<button class="btn small ghost" data-act="tips" aria-pressed="${!!(S.tutorial || UI.tips)}">${S.tutorial || UI.tips ? "Tips uit" : "Tips aan"}</button>${themaKnop()}<button class="btn small ghost" data-act="handboek">Handleiding</button><button class="btn small ghost" data-act="stoppen">Stoppen</button></div>
    </header>
    <div class="bordvlak">${tekenBord()}<div id="plekinfo" class="plekinfo" hidden></div>${legendaHtml()}
      <div class="zoomknoppen"><button class="btn small ghost" data-act="zoom-in" aria-label="Inzoomen" title="Inzoomen (of scrollen)">+</button><button class="btn small ghost" data-act="zoom-uit" aria-label="Uitzoomen" title="Uitzoomen">−</button>${(UI.zoom?.s || 1) > 1 ? `<button class="btn small ghost" data-act="zoom-reset" title="Hele kaart">Hele kaart</button>` : ""}</div></div>
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
  return `<svg class="bord${(UI.zoom?.s || 1) > 1 ? " ingezoomd" : ""}" viewBox="${zoomBox()}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Speelbord van Londen">
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
  if (STATIONS.includes(id)) status.push(`<li>Ondergrondse: sta je hier, dan reis je voor 1 Pond in één stap naar elk ander station.</li>`);
  if (s?.scheur) status.push(`<li class="paars">Scheur: wie hier staat, stapt erdoor en kan hem sluiten.</li>`);
  if (s?.aanw) status.push(`<li class="groen">${s.aanw} Aanwijzing${s.aanw > 1 ? "en" : ""}: sta hier bij de ontmoetingen om te zoeken.</li>`);
  for (const m of s?.monsters || []) { const d = monsterDef(m.id); status.push(`<li class="rood">${esc(d.naam)}: Gruwel ${d.gruwel}, Taaiheid ${d.taaiheid}, nog ${m.leven} leven.</li>`); }
  if (over && S.overzee[id].artefact) status.push(`<li class="groen">Hier ligt een artefact klaar.</li>`);
  if (hier.length) status.push(`<li>Hier: ${hier.map(esc).join(", ")}</li>`);
  return `<div class="pi-kop">${img ? `<img src="${img}" alt="">` : ""}<div><b>${esc(p.naam)}</b><span>${over ? "Overzee" : esc(DIENSTLABEL[p.dienst] || p.dienst)}${STATIONS.includes(id) ? " · station van de Ondergrondse" : ""}${p.rivier ? " · aan de Theems" : ""}</span></div></div>
    <p>${over ? "Expedities met kans op artefacten. Bereik je met een bootkaartje (2 Pond) vanaf St Katharine Docks." : esc(D.bord.diensten[p.dienst])}</p>
    ${status.length ? `<ul class="pi-status">${status.join("")}</ul>` : ""}
    <p class="pi-voet">${bereik ? (UI.wijzer === "mouse" ? (isMetro(h, id) ? "Klik om met de Ondergrondse hierheen te reizen (1 Pond)." : "Klik om hierheen te reizen.") : "") : afst != null && afst > 0 ? `${afst} stap${afst > 1 ? "pen" : ""} van ${esc(korteNaam(heldDef(h).naam))}.` : ""}</p>
    ${bereik && UI.plekVast === id ? `<button class="btn pi-reis" data-act="reis-hier" data-doel="${id}">${isMetro(h, id) ? "Ondergrondse hierheen (1 Pond)" : "Reis hierheen"}</button>` : ""}`;
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
    ${S.geruchten.map(g => `<div class="kaartje toestand"><b>${esc(g.naam)}</b><span>Nog ${g.rondes} ronde${g.rondes > 1 ? "s" : ""}. ${geruchtDoel(g)}</span></div>`).join("")}
    <div class="blad">
      <div class="kop">
        <div class="portret" style="background:${KLEUREN[idx]}">${portret ? `<img src="${esc(portret)}" alt="">` : esc(initialen(d.naam))}</div>
        <div><h2>${esc(d.naam)}</h2><div class="muted">${esc(d.rol)} · ${esc(plekNaam(h.plek))}</div></div>
      </div>
      <div class="pools">
        <div>Lichaam<b>${h.L}/${h.maxL}</b></div><div>Geest<b>${h.G}/${h.maxG}</b></div><div>Pond<b>${h.pond}</b></div><div>Aanwijz.<b>${h.aanw}</b></div><div>Trofee<b>${h.trofee}</b></div>
      </div>
      <div class="kenm">${KENMERKEN.map(([k, l]) => `<div title="${esc(KUITLEG[k])}">${l}<b>${h.kenm[k]}${bonusVoor(h, k) ? `<small>+${bonusVoor(h, k)}</small>` : ""}</b></div>`).join("")}</div>
      ${isActief && heeft(h, "verdwaald") ? `<div class="acties"><button class="btn breed" data-act="zoekweg" ${h.acties > 0 ? "" : "disabled"} data-uitleg="Kost al je acties. Lukt het, dan sta je op een willekeurige plek in Londen.">Zoek de weg terug (Waarneming 8)</button><button class="btn ghost breed" data-act="klaar">Beurt klaar</button></div>` : isActief ? `<div class="acties">
        <button class="btn" data-act="rust" ${kanActie("rusten") ? "" : "disabled"} data-uitleg="+1 Lichaam en +1 Geest. Niet als er een monster op je plek is.">Rusten</button>
        <button class="btn" data-act="voorbereiden" ${kanActie("voorbereiden") && !h.ronde.voorbereid ? "" : "disabled"} data-uitleg="+1 dobbelsteen in je gevechten tot het eind van de ronde.">${h.ronde.voorbereid ? "Voorbereid" : "Voorbereiden"}</button>
        <button class="btn" data-act="dienst" ${kanActie("dienst") && dienstNaam ? "" : "disabled"} data-uitleg="${esc(dienstNaam ? DIENSTUITLEG[dienstNaam] || "" : "Hier is geen dienst. Kijk rond of reis verder.")}">${dienstNaam ? esc(DIENSTLABEL[dienstNaam] || dienstNaam) : "Geen dienst"}</button>
        <button class="btn" data-act="rondkijken" ${kanActie("rondkijken") && !isOverzee(h.plek) ? "" : "disabled"} data-uitleg="Inkopen, een rijtuigkaartje of rondhoren: één keer per beurt, op elke plek in Londen. Koop je bij inkopen niets, dan kost het geen actie.">Rondkijken</button>
        <button class="btn" data-act="ruil" ${kanActie("ruilen") && anderenHier && !heeft(h, "waanzin-paranoia") ? "" : "disabled"} data-uitleg="Geef of neem spullen, Pond en Aanwijzingen met een held op dezelfde plek. Ruil je niets, dan kost het geen actie.">Ruilen</button>
        ${isOverzee(h.plek) ? `<button class="btn" data-act="terug" ${isActief && h.acties > 0 ? "" : "disabled"} data-uitleg="Kost een actie: je vaart terug naar St Katharine Docks.">Terug naar de dokken</button>` : `<button class="btn" data-act="groei" ${h.trofee >= 3 ? "" : "disabled"} data-uitleg="Lever 3 trofeeën in om je held sterker te maken. Kost geen actie.">Groeien (3 trofeeën)</button>`}
        ${ma ? `<button class="btn breed" data-act="mysterie" ${ma.kan && h.acties > 0 && !h.gebruikt.includes("mysterie") ? "" : "disabled"} data-uitleg="Werk aan het huidige mysterie. Kost een actie.">${esc(ma.label)}${ma.uitleg ? ` (${esc(ma.uitleg)})` : ""}</button>` : ""}
        ${UI.undo.length && UI.undo.at(-1).ronde === S.ronde && UI.undo.at(-1).actief === S.actief ? `<button class="btn ghost breed terugknop" data-act="undo" data-uitleg="Maak je laatste actie ongedaan. Dat kan alleen bij acties zonder dobbelstenen of nieuwe kaarten.">↶ Ongedaan maken: ${esc(UI.undo.at(-1).label)}</button>` : ""}
        <button class="btn ghost breed" data-act="klaar" data-uitleg="Beëindig je beurt. Acties die je over hebt, vervallen.">Beurt klaar</button>
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
    : soort === "spreuken" ? `${KNAAM[d.test]} ${d.moeilijkheid}` : d.episch ? "Episch" : "Artefact";
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
    if (["zwarte-spiegel", "klokkenbel", "sterrenkaart", "verzegelde-kruik"].includes(id) || d.gebruik) knoppen.push({ label: "Gebruik", waarde: "artefact" });
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
  bewaarUitslag();
  /* één automatische poging per eindscherm; daarna kan het met de knop */
  if (UI.deelGeprobeerd !== S.uitslagId) { UI.deelGeprobeerd = S.uitslagId; setTimeout(deelOpenstaande, 0); }
  const winst = S.einde === "winst" || S.einde === "nipt", g = god();
  const mijn = leesScores().find(x => x.id === S.uitslagId), lijst = ranglijst(), plaats = mijn ? lijst.findIndex(x => x.id === mijn.id) + 1 : 0;
  let naam = ""; try { naam = localStorage.getItem(SPELERNAAM) || ""; } catch {}
  const scoreHtml = !mijn ? "" : `<section class="eindscore">
    ${winst ? `<div class="punten groot"><span class="muted">Punten</span><b>${mijn.punten}</b><small>winkans vooraf ≈ ${Math.round((mijn.kans || 0) * 100)}%${S.einde === "nipt" ? ", op het nippertje: driekwart" : ""}${mijn.klokken.length ? ` · ${mijn.klokken.length} ${mijn.klokken.length === 1 ? "klok" : "klokken"}` : ""}</small></div>
      ${mijn.aangepast ? `<p class="muted">Je hebt spelwaarden met de hand aangepast, dus dit potje telt niet mee voor het scorebord.</p>` : `<p><b>Plaats ${plaats}</b> op het scorebord van dit apparaat.</p>
      ${delenSchuif()}
      ${mijn.gedeeld ? `<p class="gedeeld">Staat op het gedeelde scorebord als <b>${esc(mijn.naam)}</b>${mijn.gedeeldPlaats ? `: plaats ${mijn.gedeeldPlaats}` : ""}.</p>`
        : autoDelen() && (mijn.naam || naam) ? `<p class="muted">${deelLoopt ? "Wordt op het gedeelde scorebord gezet…" : `Gaat naar het gedeelde scorebord als <b>${esc(mijn.naam || naam)}</b>.`} <button class="btn small ghost" data-act="deel-score">${UI.deelFout ? "Opnieuw proberen" : "Nu delen"}</button></p>`
        : `<div class="naamrij"><label for="spelernaam">Naam op het gedeelde scorebord</label><input id="spelernaam" maxlength="30" value="${esc(mijn.naam || naam)}" placeholder="Wie speelde er?" enterkeyhint="send"><button class="btn small" data-act="deel-score" ${deelLoopt ? "disabled" : ""}>${deelLoopt ? "Bezig…" : autoDelen() ? "Opslaan en delen" : "Op het gedeelde scorebord zetten"}</button></div>`}
      ${UI.deelFout ? `<p class="fout">${esc(UI.deelFout)}</p>` : ""}`}
      ${scoreTabel(lijst.slice(0, 10), mijn.id)}` : `<p class="muted">Geen punten voor dit potje. Je winkans was ongeveer ${Math.round((mijn.kans || 0) * 100)}%.</p>`}
  </section>`;
  const gb = art(`art/goden/${g.id}.jpg`);
  app.innerHTML = `<div class="start">${gb ? `<img class="hero-art${winst ? " gered" : ""}" src="${gb}" alt="">` : ""}<span class="muted">Na ${S.ronde} rondes</span><h1>${S.einde === "nipt" ? "Op het nippertje" : winst ? "Londen is gered" : `${esc(g.naam)} heeft gewonnen`}</h1>
    <p class="verhaal" style="font-family:var(--letter);font-size:20px;max-width:60ch">${S.einde === "nipt" ? "In de laatste nacht drijven jullie het terug de diepte in. Londen zal nooit weten hoe dichtbij het was. " : ""}${winst ? "De Mist trekt op boven de Theems. De kranten schrijven morgen over een koude nacht, en verder over niets. Jullie weten beter." : esc(g.ontwaken)}</p>
    ${scoreHtml}
    <div><button class="btn" data-act="nieuw">Nieuw spel</button> <button class="btn ghost" data-act="scorebord">Scorebord</button></div></div>`;
}
function tekenStart() {
  const opgeslagen = laden();
  const u = UI.start;
  const titel = art("art/scherm/titel.jpg");
  app.innerHTML = `<div class="start">
    ${titel ? `<img class="hero-art" src="${titel}" alt="">` : ""}
    <div><span class="muted">Een coöperatief spel voor 2 of 4 helden</span><h1>Londen, 1888</h1></div>
    <div class="opties"><button class="btn" data-act="tutorial">Leer spelen (tutorial)</button><button class="btn ghost" data-act="handboek">Handleiding</button><a class="btn ghost" href="lore/index.html">Lore-boek</a><button class="btn ghost" data-act="nieuws">Wat is er nieuw</button><button class="btn ghost" data-act="scorebord">Scorebord</button>${themaKnop("btn ghost")}</div>
    ${opgeslagen && !opgeslagen.einde ? `<div class="hint">Er is een spel bezig tegen ${esc(byId(D.goden, opgeslagen.god)?.naam)}, ronde ${opgeslagen.ronde}. <button class="btn small" data-act="verder">Verder spelen</button></div>` : ""}
    <section><h2>Tegen wie?</h2><div class="goden">${D.goden.map(g => `<button class="optie" data-god="${g.id}" aria-pressed="${u.god === g.id}">${art(`art/goden/${g.id}.jpg`) ? `<img class="godbeeld" src="art/goden/${g.id}.jpg" alt="">` : ""}<b>${esc(g.naam)}</b><span class="muted">${esc(g.titel)}</span><span>${esc(g.regel)}</span></button>`).join("")}</div></section>
    <section><h2>Moeilijkheid</h2><div class="opties">${Object.entries(MOEILIJKHEID).map(([k, m]) => `<button class="optie" data-moeilijk="${k}" aria-pressed="${u.moeilijkheid === k}">${m.naam}: ${m.nodig} mysteries</button>`).join("")}</div></section>
    <section><h2>Speelduur</h2><div class="opties"><button class="optie" data-modus="gewoon" aria-pressed="${u.modus !== "lang"}">Gewoon: ongeveer 45 minuten</button><button class="optie" data-modus="lang" aria-pressed="${u.modus === "lang"}">De Lange Nacht: 90 tot 120 minuten</button></div>
      ${u.modus === "lang" ? `<p class="muted">Eén mysterie meer en een ruimere Mist. Na elk mysterie een beloningsronde, en Londen wordt per bedrijf grimmiger.</p>` : ""}</section>
    <section><h2>Hoeveel helden?</h2><div class="opties">${[2, 4].map(n => `<button class="optie" data-aantal="${n}" aria-pressed="${u.aantal === n}">${n} helden</button>`).join("")}</div></section>
    <section><h2>Kies ${u.aantal} helden <span class="muted" style="font-size:16px">(${u.helden.length} gekozen)</span></h2>
      <div class="opties"><button class="btn small ghost" data-act="willekeurig">Willekeurig kiezen</button></div>
      <p class="muted">Tik op een held om het verhaal, de kenmerken, het vermogen en de uitrusting te bekijken.</p>
      <div class="heldenkeus">${D.helden.map(h => `<button class="optie heldkaart" data-held="${h.id}" aria-pressed="${u.helden.includes(h.id)}">
        ${art(`art/helden/${h.id}.jpg`) ? `<img class="mini" src="art/helden/${h.id}.jpg" alt="">` : `<span class="mini leeg">${esc(initialen(h.naam))}</span>`}
        <span class="info"><b>${esc(h.naam)}</b><small>${esc(h.rol)} · ${esc(h.start)}</small>
        <small class="getallen">${KENMERKEN.map(([k, l]) => `${l.slice(0, 3)} ${h.kenmerken[k]}`).join(" · ")}<br>Lichaam ${h.lichaam} · Geest ${h.geest}${h.bondgenoot ? ` · met ${esc(h.bondgenoot.soort)}` : ""}</small></span>
        ${u.helden.includes(h.id) ? `<span class="gekozen" aria-label="Gekozen">✓</span>` : ""}</button>`).join("")}</div></section>
    ${klokSectie(u)}
    <div><button class="btn" data-act="begin" ${u.god && u.helden.length === u.aantal ? "" : "disabled"}>Begin het spel${u.klokken.length ? ` · ${u.klokken.length} ${u.klokken.length === 1 ? "klok" : "klokken"}` : ""}</button></div>
  </div>`;
}

/* ---------- De Klokken van Westminster: keuze, wijzerplaat en dreigingsmeter ---------- */
function bewaarKlokkeuze() { try { localStorage.setItem(KLOKKEUZE, JSON.stringify(UI.start.klokken)); } catch {} }
function wisselKlok(id) {
  const u = UI.start;
  u.klokken = u.klokken.includes(id) ? u.klokken.filter(x => x !== id) : [...u.klokken, id];
  u.klokLaatst = u.klokken.includes(id) ? id : null;
  bewaarKlokkeuze(); Geluid.klik(); teken();
}
function klokSvg(aan, laatst) {
  const slagen = aan.reduce((t, id) => t + klokSlagen(id), 0);
  const beeld = art("art/scherm/klok.jpg");
  const R = beeld ? 117 : 118, n = KLOKKEN.length; /* op het schilderij staan de dertien vakken op 74% van de straal (158) */
  const hoek = i => ((i + 1) / n) * 2 * Math.PI - Math.PI / 2; /* XIII staat bovenaan */
  const pos = (i, r) => [Math.cos(hoek(i)) * r, Math.sin(hoek(i)) * r];
  const streepjes = Array.from({ length: n * 5 }, (_, j) => { const a = (j / (n * 5)) * 2 * Math.PI - Math.PI / 2, l = j % 5 ? 4 : 9; return `<line x1="${(Math.cos(a) * 146).toFixed(1)}" y1="${(Math.sin(a) * 146).toFixed(1)}" x2="${(Math.cos(a) * (146 - l)).toFixed(1)}" y2="${(Math.sin(a) * (146 - l)).toFixed(1)}" class="${j % 5 ? "kl-fijn" : "kl-grof"}"/>`; }).join("");
  const traceer = Array.from({ length: n }, (_, i) => { const [x1, y1] = pos(i + 0.5, 40), [x2, y2] = pos(i + 0.5, 96); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`; }).join("");
  const vakken = KLOKKEN.map((k, i) => { const [x, y] = pos(i, R), op = aan.includes(k.id);
    return `<g class="klokslot${op ? " aan" : ""}${laatst === k.id ? " net" : ""}" data-klok="${k.id}" role="button" tabindex="0" aria-pressed="${op}" aria-label="${ROMEINS[i]}: ${esc(k.naam)}. ${esc(k.tekst)}">
      <title>${ROMEINS[i]} · ${esc(k.naam)}: ${esc(k.tekst)}</title>
      <circle class="kl-gloed" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="25"/><circle class="kl-vak" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19"/>
      <text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle">${ROMEINS[i]}</text></g>`; }).join("");
  const wijzer = (aan.length / n) * 360, kort = aan.length ? ((KLOKKEN.findIndex(k => k.id === aan.at(-1)) + 1) / n) * 360 : 0;
  return `<svg class="klokvlak${beeld ? " met-beeld" : ""}" viewBox="-160 -160 320 320" role="group" aria-label="De klokken van Westminster">
    <defs>
      <radialGradient id="kl-plaat"><stop offset="0" stop-color="#2a1338"/><stop offset=".55" stop-color="#140c1c"/><stop offset="1" stop-color="#07060a"/></radialGradient>
      <radialGradient id="kl-dreig"><stop offset="0" stop-color="#c58cf0" stop-opacity=".85"/><stop offset=".6" stop-color="#7b3fa0" stop-opacity=".25"/><stop offset="1" stop-color="#7b3fa0" stop-opacity="0"/></radialGradient>
      <linearGradient id="kl-goud" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d58a"/><stop offset=".5" stop-color="#a77b2c"/><stop offset="1" stop-color="#5e4316"/></linearGradient>
      <clipPath id="kl-rond"><circle r="157"/></clipPath>
    </defs>
    ${beeld ? `<image href="${beeld}" x="-158" y="-158" width="316" height="316" clip-path="url(#kl-rond)" class="kl-schilderij"/>
      <circle r="78" fill="url(#kl-dreig)" class="kl-dreiging" style="opacity:${(aan.length / n * 0.95).toFixed(2)}"/>`
    : `<circle r="158" class="kl-rand"/><circle r="150" fill="url(#kl-plaat)"/>
      <circle r="150" fill="url(#kl-dreig)" class="kl-dreiging" style="opacity:${(aan.length / n * 0.9 + 0.1).toFixed(2)}"/>
      <g class="kl-traceer">${traceer}<circle r="96"/><circle r="40"/></g>
      <g class="kl-streep">${streepjes}</g><circle r="146" class="kl-ring"/>`}
    ${vakken}
    <g class="kl-wijzer kort" style="transform:rotate(${kort}deg)"><path d="M0 12 L-5 0 L0 -62 L5 0 Z"/><circle cy="-50" r="5"/></g>
    <g class="kl-wijzer lang" style="transform:rotate(${wijzer}deg)"><path d="M0 16 L-3.5 0 L0 -92 L3.5 0 Z"/><path d="M0 -70 l6 -8 l-6 -8 l-6 8 z"/></g>
    <circle r="11" class="kl-as"/><text class="kl-tal" y="40" text-anchor="middle">${slagen ? `${slagen} ${slagen === 1 ? "SLAG" : "SLAGEN"}` : "STIL"}</text>
  </svg>`;
}
function klokSectie(u) {
  const kans = schatKans(u.god, u.moeilijkheid, u.aantal, u.klokken), basis = schatKans(u.god, u.moeilijkheid, u.aantal, []);
  const pct = kans == null ? null : Math.round(kans * 100), dreig = kans == null ? 0 : 1 - kans;
  const slagen = u.klokken.reduce((t, id) => t + klokSlagen(id), 0);
  const pips = n => `<span class="klokpips" aria-label="${n} ${n === 1 ? "slag" : "slagen"}">${"<i></i>".repeat(n)}</span>`;
  const bg = art("art/scherm/big-ben.jpg");
  return `<section class="klokken-sectie">
    <div class="klokkop">${bg ? `<img class="klokbanner" src="${bg}" alt="">` : ""}<h2>De Klokken van Westminster</h2><p class="muted">Big Ben slaat dertien. Zet klokken aan voor een zwaarder potje: tik op een uur van de klok of op een klok in de lijst. Hoe kleiner je kans, hoe meer punten je verdient als je wint.</p></div>
    <div class="klokrij-boven">
      <div class="klokhouder">${klokSvg(u.klokken, u.klokLaatst)}</div>
      <div class="dreiging" style="--dreiging:${dreig.toFixed(3)}" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct ?? 0}" aria-label="Winkans">
        <span class="dr-label">Dreiging</span><div class="dr-buis"><div class="dr-vulling"></div>${[25, 50, 75].map(t => `<i style="bottom:${t}%"></i>`).join("")}</div>
      </div>
      <div class="klokstand">
        ${pct == null ? "" : `<div class="kans"><span class="muted">Winkans${u.god ? "" : " (gemiddeld over de goden)"}</span><b>≈ ${pct}%</b>${u.klokken.length ? `<small>zonder klokken ${Math.round(basis * 100)}%</small>` : ""}</div>
        <div class="punten"><span class="muted">Punten bij winst</span><b>${puntenVoor(kans, false)}</b></div>`}
        <div class="punten"><span class="muted">Klokken</span><b>${u.klokken.length} van 13</b></div>
        <div class="opties"><button class="btn small ghost" data-act="klokken-alle">Alle dertien</button><button class="btn small ghost" data-act="klokken-uit" ${u.klokken.length ? "" : "disabled"}>Alles stil</button><button class="btn small ghost" data-act="scorebord">Scorebord</button></div>
        ${pct != null && pct < 3 ? `<p class="klokwaarschuwing">Bijna onwinbaar. Maar wie het toch haalt, staat bovenaan.</p>` : ""}
      </div>
    </div>
    <div class="kloklijst">${KLOKKEN.map((k, i) => { const op = u.klokken.includes(k.id), ic = art(`art/klokken/${k.id}.jpg`), nut = klokEffect(k.id, u.moeilijkheid) === 0 && k.id === "geen-genade";
      return `<button class="klokkaart${op ? " aan" : ""}" data-klok="${k.id}" aria-pressed="${op}">
        ${ic ? `<img src="${ic}" alt="">` : `<span class="klokcijfer">${ROMEINS[i]}</span>`}
        <span class="kk-tekst"><b>${ic ? `${ROMEINS[i]} · ` : ""}${esc(k.naam)}</b><small>${esc(k.tekst)}${nut ? " (Genadeloos heeft al geen laatste nacht.)" : ""}</small></span>${pips(klokSlagen(k.id))}</button>`; }).join("")}</div>
  </section>`;
}
async function toonKlokkenInfo() {
  await venster({ soort: "De Klokken van Westminster", titel: `${S.klokken.length} ${S.klokken.length === 1 ? "klok luidt" : "klokken luiden"}`, breed: true,
    html: `<ul class="klokinfo">${S.klokken.map(id => { const i = KLOKKEN.findIndex(k => k.id === id), k = KLOKKEN[i], ic = art(`art/klokken/${id}.jpg`); return `<li>${ic ? `<img src="${ic}" alt="">` : `<span class="klokcijfer">${ROMEINS[i]}</span>`}<span><b>${ROMEINS[i]} · ${esc(k.naam)}.</b> ${esc(k.tekst)}</span></li>`; }).join("")}</ul>
      ${S.kans != null ? `<p class="muted">Winkans bij de start: ongeveer ${Math.round(S.kans * 100)}%. Winnen levert ${puntenVoor(S.kans, false)} punten op.</p>` : ""}` });
}

/* ---------- Scorebord: bewaard op dit apparaat, in de browser (localStorage) ---------- */
function bewaarUitslag() {
  if (!S?.einde || S.uitslagId || S.tutorial || window.__bot) return;
  const winst = S.einde === "winst" || S.einde === "nipt";
  const kans = S.kans ?? schatKans(S.god, S.moeilijkheid, S.helden.length, S.klokken || []);
  let naam = ""; try { naam = localStorage.getItem(SPELERNAAM) || ""; } catch {}
  const e = { id: Date.now(), datum: new Date().toISOString().slice(0, 10), naam, god: S.god, stand: S.moeilijkheid, helden: S.helden.map(h => h.id), klokken: S.klokken || [],
    ronde: S.ronde, uitslag: S.einde, modus: S.modus || "gewoon", kans: kans == null ? null : +kans.toFixed(3), punten: winst && kans != null ? puntenVoor(kans, S.einde === "nipt") : 0, aangepast: !!S.aangepast };
  S.uitslagId = e.id; const l = leesScores(); l.push(e); schrijfScores(l); opslaan();
}
function scoreTabel(rijen, licht, leeg = "Nog geen overwinningen op dit apparaat.") {
  if (!rijen.length) return `<p class="muted">${leeg}</p>`;
  return `<div class="tabelvlak"><table class="scoretabel"><tr><th>#</th><th>Naam</th><th>Punten</th><th>Tegen</th><th>Stand</th><th>Klokken</th><th>Helden</th><th>Rondes</th><th>Datum</th></tr>
    ${rijen.map((x, i) => `<tr class="${x.id === licht ? "licht" : ""}"><td>${i + 1}</td><td>${esc(x.naam || "Naamloos")}</td><td><b>${x.punten}</b></td><td>${esc(byId(D.goden, x.god)?.naam || x.god)}</td><td>${esc(MOEILIJKHEID[x.stand]?.naam || x.stand)}${x.modus === "lang" ? " · Lange Nacht" : ""}</td>
      <td title="${esc(x.klokken.map(id => KLOKKEN.find(k => k.id === id)?.naam).join(", "))}">${x.klokken.length ? x.klokken.map(id => ROMEINS[KLOKKEN.findIndex(k => k.id === id)]).join(" ") : "–"}</td>
      <td>${x.helden.map(id => esc(korteNaam(heldDef({ id }).naam))).join(", ")}</td><td>${x.ronde}</td><td>${esc(x.datum)}</td></tr>`).join("")}</table></div>`;
}
async function toonScorebord() {
  await deelOpenstaande();
  const r = ranglijst(), alle = leesScores(), gedeeld = await haalGedeeld();
  await venster({ soort: "Het register van de Club", titel: "Scorebord", breed: true, terug: true, beeld: "art/scherm/scorebord.jpg",
    html: `<h3>Iedereen</h3>${gedeeld ? scoreTabel(gedeeld.map((x, i) => ({ ...x, id: "g" + i })), null, "Nog niemand heeft een overwinning gedeeld. Win een potje en zet het erop.") : `<p class="muted">Het gedeelde scorebord is nu niet bereikbaar.</p>`}
      <h3>Op dit apparaat</h3>${delenSchuif()}${scoreTabel(r.slice(0, 15))}
      <p class="muted">${alle.length} ${alle.length === 1 ? "potje" : "potjes"} gespeeld op dit apparaat, ${r.length} gewonnen. Punten krijg je alleen voor een overwinning: hoe kleiner je kans vooraf, hoe meer punten. Op het nippertje (in de laatste nacht) telt voor driekwart. Potjes waarin je spelwaarden met de hand hebt aangepast, tellen niet mee.</p>
      <p class="muted">Het scorebord van dit apparaat staat in deze browser. Staat automatisch delen aan, dan gaat een overwinning vanzelf naar het gedeelde scorebord zodra er een naam bij staat. Staat het uit, dan kies je het zelf op het eindscherm. Daar staan dan je naam, de god, de stand, de helden, de klokken en het aantal rondes. De punten rekent de server zelf uit.</p>` });
}

/* ---------- invoer ---------- */
let bezig = false;
async function veilig(fn) { if (bezig) return; bezig = true; UI.undo = []; try { await fn(); } catch (e) { console.error(e); UI.fout = String(e && e.message || e); } finally { bezig = false; teken(); if (UI.coachWacht) setTimeout(coachUitWachtrij, 30); } }
function coachUitWachtrij() { const c = UI.coachWacht; if (!c || bezig) return; UI.coachWacht = null; veilig(() => coach(c)); }
app.addEventListener("click", e => {
  if (UI.zoomRust && Date.now() - UI.zoomRust < 350 && e.target.closest?.("svg.bord")) return; /* na slepen of knijpen geen klik */
  const t = e.target.closest("button, [data-plek], [data-klok]"); if (!t) return;
  const u = UI.start;
  if (t.dataset.klok && !S) { wisselKlok(t.dataset.klok); return; }
  if (t.dataset.god) { u.god = t.dataset.god; return teken(); }
  if (t.dataset.moeilijk) { u.moeilijkheid = t.dataset.moeilijk; return teken(); }
  if (t.dataset.modus) { u.modus = t.dataset.modus; return teken(); }
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
  if (t.dataset.pas && S) S.aangepast = true;
  if (t.dataset.pas) { const [k, v] = t.dataset.pas.split(":"); const h = S.helden[UI.bekeken]; if (k === "mist") S.mist += +v; else h[k] = Math.max(0, h[k] + +v); opslaan(); return teken(); }
  const h = S ? S.helden[UI.bekeken] : null;
  switch (t.dataset.act) {
    case "willekeurig": u.helden = schud(D.helden.map(x => x.id)).slice(0, u.aantal); if (!u.god) u.god = kies1(D.goden).id; return teken();
    case "begin": nieuwSpel(u.god, u.moeilijkheid, u.helden, { klokken: u.klokken, modus: u.modus }); return;
    case "zoom-in": case "zoom-uit": { const b = D.bord, z = UI.zoom || { s: 1, x: 0, y: 0 }; return zoomNaar(z.s * (t.dataset.act === "zoom-in" ? 1.5 : 1 / 1.5), z.x + b.breedte / z.s / 2, z.y + b.hoogte / z.s / 2, true); }
    case "zoom-reset": UI.zoom = { s: 1, x: 0, y: 0 }; return teken();
    case "klokken-uit": u.klokken = []; bewaarKlokkeuze(); return teken();
    case "klokken-alle": u.klokken = KLOKKEN.map(k => k.id); bewaarKlokkeuze(); return teken();
    case "klokken-info": return veilig(toonKlokkenInfo);
    case "scorebord": return veilig(() => toonScorebord());
    case "deel-score": {
      const veld = document.getElementById("spelernaam");
      const l = leesScores(), e = l.find(x => x.id === S.uitslagId); if (!e) return;
      if (veld) {
        const v = veld.value.trim().slice(0, 30);
        if (!v) { UI.deelFout = "Vul eerst een naam in."; return teken(); }
        try { localStorage.setItem(SPELERNAAM, v); } catch {}
        e.naam = v; schrijfScores(l);
      }
      UI.deelFout = null; deelOpenstaande(S.uitslagId); return teken();
    }
    case "verder": S = laden(); if (S.fase === "finale") veilig(() => ontwaken()); else if (S.fase === "ontmoeting") veilig(() => ontmoetingsfase((S.ontmoetingIndex ?? -1) + 1)); else if (S.fase === "onheil") veilig(() => onheilsfase()); else teken(); return;
    case "nieuw": wis(); S = null; UI.zoom = null; UI.start.helden = []; UI.deelFout = null; return teken();
    case "tutorial": zaai(1888); nieuwSpel("vathrun", "ontspannen", ["hester-quayle", "silas-rook"], { tutorial: true }); rng = Math.random; return;
    case "handboek": UI.handboek = "handleiding"; return tekenHandleiding();
    case "nieuws": return toonNieuws(true);
    case "god": return veilig(() => godIntro(false));
    case "tips": if (S.tutorial) { S.tutorial = false; UI.tips = false; } else UI.tips = !UI.tips; opslaan(); return teken();
    case "stoppen": return veilig(async () => { if (await venster({ titel: "Stoppen?", html: "<p>Het spel blijft bewaard op dit apparaat. Je kunt later verder spelen.</p>", knoppen: [{ label: "Naar het beginscherm", waarde: true }, { label: "Doorspelen", waarde: false, ghost: true }] })) { opslaan(); S = null; } });
    case "regels": return veilig(() => venster({ soort: "Hoe werkt het?", titel: "Een ronde", terug: true, html: `<ol><li><b>Heldenfase:</b> elke held doet 2 acties: reizen (tik op een plek, mag twee keer), rusten, de dienst van de plek, ruilen, een spreuk of het mysterie.</li><li><b>Ontmoetingen:</b> vecht met monsters op je plek, ga door een Scheur, volg een Aanwijzing of trek een stadskaart.</li><li><b>Onheil:</b> de Mist daalt, Scheuren openen en monsters bewegen.</li></ol><p>Een test: 2 dobbelstenen plus je kenmerk, haal de moeilijkheid. Een Aanwijzing laat je bij Kennis en Waarneming één steen opnieuw gooien.</p><p>Los ${S.nodig} mysteries op voordat de Mist op 0 staat.</p>` }));
    case "rust": return veilig(() => rust(actief()));
    case "voorbereiden": return veilig(() => voorbereiden(actief()));
    case "rondkijken": return veilig(() => rondkijken(actief()));
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
    case "undo": { const u = UI.undo.pop(); if (!u) return; const ab = S.aanbod; S = JSON.parse(u.staat); S.aanbod = ab; verbergPlekInfo(); log(`Ongedaan gemaakt: ${u.label}`); opslaan(); return teken(); }
    case "geluid": Geluid.wissel(); return teken();
    case "muziek": Geluid.wisselMuziek(); return teken();
    case "thema": Thema.wissel(); return teken();
    case "toestand-plus": { S.aangepast = true; const v = document.getElementById("pas-toestand").value; if (!heeft(h, v)) h.toestanden.push(v); opslaan(); return teken(); }
    case "toestand-min": { S.aangepast = true; const v = document.getElementById("pas-toestand").value; h.toestanden = h.toestanden.filter(x => x !== v); opslaan(); return teken(); }
    case "verplaats": S.aangepast = true; h.plek = document.getElementById("pas-plek").value; opslaan(); return teken();
    case "afleggen": { S.aangepast = true; const v = document.getElementById("pas-kaart").value; if (!v) return; const [s, id] = v.split(":"); h[s] = h[s].filter(x => x !== id); if (id === "dier-raaf") { S.mist--; log("De raaf vliegt weg. De Mist daalt met 1."); } opslaan(); return teken(); }
    case "mon-plus": S.aangepast = true; if (!isOverzee(h.plek)) spawnMonster(h.plek); opslaan(); return teken();
    case "mon-min": S.aangepast = true; if (!isOverzee(h.plek)) S.plekken[h.plek].monsters.pop(); opslaan(); return teken();
  }
});
app.addEventListener("keydown", e => { if (e.key === "Enter" && e.target.id === "spelernaam") { e.preventDefault(); app.querySelector('[data-act="deel-score"]')?.click(); } });
document.addEventListener("keydown", e => { if (e.key === "Escape" && UI.handboek) { UI.handboek = null; tekenHandleiding(); } });
document.getElementById("handboek").addEventListener("click", e => {
  const b = e.target.closest("[data-hb]"); if (!b) return;
  UI.handboek = b.dataset.hb === "sluit" ? null : b.dataset.hb; tekenHandleiding();
  if (UI.handboek) document.querySelector("#handboek .hb-inhoud")?.scrollTo(0, 0);
});
app.addEventListener("pointerdown", e => { UI.wijzer = e.pointerType; }, true);

/* ---------- inzoomen op de kaart: scrollwiel, knijpen met twee vingers, slepen om te verschuiven ---------- */
function zoomBox() { const b = D.bord, z = UI.zoom || { s: 1, x: 0, y: 0 }; return `${z.x.toFixed(1)} ${z.y.toFixed(1)} ${(b.breedte / z.s).toFixed(1)} ${(b.hoogte / z.s).toFixed(1)}`; }
function zoomNaar(s, px, py, opnieuw) {
  const b = D.bord, z = UI.zoom || { s: 1, x: 0, y: 0 };
  s = Math.max(1, Math.min(4, s));
  const x = px - (px - z.x) * (z.s / s), y = py - (py - z.y) * (z.s / s);
  UI.zoom = { s, x: Math.max(0, Math.min(b.breedte - b.breedte / s, x)), y: Math.max(0, Math.min(b.hoogte - b.hoogte / s, y)) };
  const svg = document.querySelector("svg.bord");
  const wasIn = svg?.classList.contains("ingezoomd"), isIn = s > 1;
  if (opnieuw || !svg || wasIn !== isIn) return teken();
  svg.setAttribute("viewBox", zoomBox());
}
function bordPunt(svg, cx, cy) { const m = svg.getScreenCTM(); if (!m) return null; const p = new DOMPoint(cx, cy).matrixTransform(m.inverse()); return [p.x, p.y]; }
app.addEventListener("wheel", e => {
  const svg = e.target.closest?.("svg.bord"); if (!svg || !S) return;
  e.preventDefault();
  const p = bordPunt(svg, e.clientX, e.clientY); if (!p) return;
  zoomNaar((UI.zoom?.s || 1) * Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0015)), p[0], p[1]);
}, { passive: false });
const vingers = new Map(); let gebaar = null;
app.addEventListener("pointerdown", e => {
  const svg = e.target.closest?.("svg.bord"); if (!svg || !S) return;
  vingers.set(e.pointerId, [e.clientX, e.clientY]);
  const z = UI.zoom || { s: 1, x: 0, y: 0 };
  if (vingers.size === 2) {
    const [a, b] = [...vingers.values()], mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    gebaar = { soort: "knijp", d0: Math.hypot(a[0] - b[0], a[1] - b[1]), s0: z.s, p0: bordPunt(svg, ...mid), bewogen: true };
  } else if (vingers.size === 1 && z.s > 1) gebaar = { soort: "schuif", start: [e.clientX, e.clientY], z0: { ...z }, bewogen: false };
});
app.addEventListener("pointermove", e => {
  if (!gebaar || !vingers.has(e.pointerId)) return;
  vingers.set(e.pointerId, [e.clientX, e.clientY]);
  const svg = document.querySelector("svg.bord"); if (!svg) return;
  if (gebaar.soort === "knijp" && vingers.size >= 2) {
    const [a, b] = [...vingers.values()];
    if (gebaar.p0) zoomNaar(gebaar.s0 * Math.hypot(a[0] - b[0], a[1] - b[1]) / gebaar.d0, ...gebaar.p0);
  } else if (gebaar.soort === "schuif") {
    const dx = e.clientX - gebaar.start[0], dy = e.clientY - gebaar.start[1];
    if (!gebaar.bewogen && Math.hypot(dx, dy) < 6) return;
    gebaar.bewogen = true;
    const schaal = (D.bord.breedte / gebaar.z0.s) / svg.getBoundingClientRect().width, b = D.bord, z0 = gebaar.z0;
    UI.zoom = { s: z0.s, x: Math.max(0, Math.min(b.breedte - b.breedte / z0.s, z0.x - dx * schaal)), y: Math.max(0, Math.min(b.hoogte - b.hoogte / z0.s, z0.y - dy * schaal)) };
    svg.setAttribute("viewBox", zoomBox());
  }
});
const eindGebaar = e => {
  vingers.delete(e.pointerId);
  if (gebaar && gebaar.bewogen) UI.zoomRust = Date.now();
  if (!vingers.size) gebaar = null;
  else if (gebaar?.soort === "knijp") gebaar = null;
};
app.addEventListener("pointerup", eindGebaar); app.addEventListener("pointercancel", eindGebaar);
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
app.addEventListener("keydown", e => { const k = e.target.closest?.("svg [data-klok]"); if (k && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); wisselKlok(k.dataset.klok); return; } const p = e.target.closest?.("[data-plek]"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); reis(p.dataset.plek); } });

/* ---------- laden ---------- */
const BESTANDEN_MD = { handleiding: "handleiding" };
const BESTANDEN = { bord: "bord", helden: "helden", goden: "oude-goden", monsters: "monsters", epische: "epische-monsters", spullen: "spullen", spreuken: "spreuken", artefacten: "artefacten", toestanden: "toestanden", onheil: "onheil", personen: "personen", persoonlijk: "persoonlijk", nieuws: "nieuws", klokmodel: "klokken",
  o_stad: "ontmoetingen/stad", o_verhaal: "ontmoetingen/verhaal", o_expeditie: "ontmoetingen/expeditie", o_scheur: "ontmoetingen/scheur", o_aanwijzing: "ontmoetingen/aanwijzing" };
Promise.all(Object.entries(BESTANDEN).map(([k, f]) => fetch(`data/${f}.json`).then(r => { if (!r.ok) throw new Error(f); return r.json(); }).then(j => [k, j])))
  .then(lijst => Promise.all(Object.entries(BESTANDEN_MD).map(([k, f]) => fetch(`data/${f}.md`).then(r => r.ok ? r.text() : "").then(t => [k, t]))).then(md => [...lijst, ...md]))
  .then(lijst => {
    D = Object.fromEntries(lijst);
    D.spullen = [...D.spullen, ...D.persoonlijk.map(x => ({ ...x, persoonlijk: true, prijs: 0 }))];
    D.ontmoetingen = { stad: [...D.o_stad, ...D.o_verhaal], expeditie: D.o_expeditie, scheur: D.o_scheur, aanwijzing: D.o_aanwijzing };
    maakBuren(); teken(); registreerSW();
    /* portretten en het mistfiche vooraf laden, zodat ze al bij de eerste kaart verschijnen */
    if (!window.__bot) { for (const p of D.personen) art(`art/personen/${p.id}.jpg`); art("art/fiches/mist.jpg"); art("art/scherm/scorebord.jpg"); Geluid.laad(); setTimeout(() => toonNieuws(false), 400); setTimeout(deelOpenstaande, 2000); }
  })
  .catch(err => { app.innerHTML = `<div class="start"><h1>Londen, 1888</h1><p>De speldata kon niet worden geladen (${esc(err.message)}). Open het spel via een webserver, niet als los bestand.</p></div>`; });
/* Wat is er nieuw: na een update één keer tonen, daarna via de knop op het startscherm */
const NIEUWS = "londen1888-nieuws-gezien";
async function toonNieuws(altijd) {
  const lijst = D.nieuws || []; if (!lijst.length) return;
  const nieuwste = lijst[0].id;
  let gezien = null;
  try { gezien = localStorage.getItem(NIEUWS); } catch {}
  if (!altijd) {
    if (gezien === null) {
      /* nieuwe speler: niets tonen; terugkerende speler zonder vinkje: alleen het laatste nieuws */
      let eerder = false;
      try { eerder = Object.keys(localStorage).some(k => k.startsWith("londen1888-") && k !== NIEUWS); } catch {}
      if (!eerder) { try { localStorage.setItem(NIEUWS, String(nieuwste)); } catch {} return; }
      gezien = String(nieuwste - 1);
    }
    if (+gezien >= nieuwste) return;
    if (document.querySelector("#modal .venster")) return;
  }
  const tonen = altijd ? lijst.slice(0, 3) : lijst.filter(n => n.id > +gezien).slice(0, 3);
  try { localStorage.setItem(NIEUWS, String(nieuwste)); } catch {}
  await venster({ soort: "Wat is er nieuw", titel: tonen[0].titel, breed: true, terug: true,
    html: tonen.map((n, i) => `${i ? `<h3>${esc(n.titel)}</h3>` : ""}<p class="muted">${esc(n.datum)}</p><ul>${n.punten.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`).join(""),
    knoppen: [{ label: "Verder", waarde: true }] });
}
function registreerSW() {
  try {
    if (!("serviceWorker" in navigator) || !(location.protocol === "https:" || location.hostname === "localhost") || location.hostname.endsWith("claude.ai") || location.hostname.endsWith("claudeusercontent.com")) return;
    /* Had de pagina al een service worker? Dan betekent een nieuwe controller: er staat een nieuwe versie online. */
    const hadVersie = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadVersie) toonUpdate(); });
    navigator.serviceWorker.register("sw.js").then(reg => {
      /* Een app die lang openstaat (iPad-beginscherm) kijkt bij terugkomen en elk halfuur of er een update is. */
      const kijk = () => reg.update().catch(() => {});
      document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") kijk(); });
      setInterval(kijk, 30 * 60 * 1000);
    }).catch(() => {});
  } catch {}
}
function toonUpdate() {
  if (document.getElementById("updatebalk")) return;
  const el = document.createElement("button");
  el.id = "updatebalk"; el.className = "updatebalk"; el.type = "button";
  el.innerHTML = `<b>Er is een nieuwe versie.</b> <span>Tik hier om hem te laden. Je spel blijft bewaard.</span>`;
  el.addEventListener("click", () => { opslaan(); location.reload(); });
  document.body.appendChild(el);
}
window.__spel = { KLOKKEN, get S() { return S; }, get D() { return D; }, get bezig() { return bezig; },
  api: { rondkijken, voorbereiden, bootPrijs, metroDoelen, overgang, venster, scheurBeeld, toonUpdate, kans, speelKaart, onheilsfase, nieuwSpel, zaai, reis, rust, dienst, doeMysterie, mysterieActie, beurtKlaar, gebruikActie, gebruikSpul, zoekWeg, bereikbaar, burenVan, afstanden, stapNaar, actief, groei, mysterie, heeft, isOverzee, spulDef, monsterDef, wapenBonus, plekDef } };
})();
