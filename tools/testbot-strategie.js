/* Slimme testspeler. Draait in de pagina (window.__spel) en speelt volledige potjes zonder scherm.
   Speelt als een redelijke, voorzichtige speler: volgt het mysterie, verzamelt Aanwijzingen,
   sluit Scheuren, rust op tijd en koopt wapens. Gebruikt geen spreuken buiten gevechten,
   dus echte spelers doen het waarschijnlijk iets beter. */
window.__testbot = async function speel(godId, moeilijkheid, heldIds, seed) {
  const A = window.__spel.api;
  const S = () => window.__spel.S;
  const D = window.__spel.D;
  let havenDoel = null, stationDoel = null, rondkijkWens = null;
  const huidig = () => S().helden[S().actief];
  const isPlek = id => D.bord.plekken.some(p => p.id === id);

  window.__bot = {
    kies({ soort, titel, knoppen }) {
      const w = knoppen.map(k => k.waarde);
      const h = huidig();
      if (!knoppen.length) return null;
      if (soort.startsWith("Test")) {
        for (const v of ["zegen", "adem", "winnie", "zweep", "reis"]) if (w.includes(v)) return v;
        if (w.includes("aanw")) {
          const m = A.mysterie(), samen = S().helden.reduce((s, x) => s + x.aanw, 0);
          if (!m || m.type !== "aanwijzingen" || samen > m.aantal + 1) return "aanw";
        }
        return "ok";
      }
      if (soort.startsWith("Bootkaartje")) return havenDoel && w.includes(havenDoel) ? havenDoel : w[0];
      if (soort === "Slapeloze nachten") return w.includes("L") && (!w.includes("G") || h.L / h.maxL <= h.G / h.maxG) ? "L" : w[0];
      if (soort.startsWith("Trein")) return stationDoel && w.includes(stationDoel) ? stationDoel : w[0];
      if (soort === "Scheur") return w.includes("a") ? "a" : "z";
      if (soort === "Winkelen") {
        const spul = id => A.spulDef(id);
        const wapen = w.find(id => id && spul(id)?.bonus?.gevecht && A.wapenBonus(h, false) < 3);
        if (wapen) return wapen;
        const nuttig = w.find(id => id && ["carbol", "laudanum", "vlugzout", "kompas", "dier-paard", "bondgenoot-koetsier"].includes(id));
        if (nuttig && h.pond >= 3) return nuttig;
        return null;
      }
      if (soort === "Gevecht" || soort === "Episch monster") {
        if (w.includes("dyn")) return "dyn";
        if (w.includes("chl")) return "chl";
        if (w.includes("bekeer") && h.kenm.overtuiging >= 3 && h.G > 2) return "bekeer";
        if (w.includes("verban") && h.kenm.kennis > h.kenm.kracht + A.wapenBonus(h, false)) return "verban";
        return "vecht";
      }
      if (soort === "Ziekenhuis en bank") return w.includes("gewond") ? "gewond" : w.includes("heel") && h.L < h.maxL ? "heel" : null;
      if (soort === "Salon") return "pond";
      if (soort === "Scotland Yard") return w.includes("g") ? "g" : null;
      if (soort === "De abdij") return w.includes("b") ? "b" : w.includes("v") ? "v" : w.includes("z") ? "z" : null;
      if (soort === "Hulp van de Bleke Lantaarn") return "a";
      /* Sirrhae: een voorzichtige speler weigert haar gunsten, behalve als het team er goed voor staat en de prijs geen Mist kost */
      if (soort === "Een gunst van Sirrhae") return null;
      if (soort === "De klok stilzetten") return w[0];
      /* Kaarten van de Oude Wereld */
      if (soort === "Glasplaat") return true;
      if (soort === "Het hart") { const H = huidig(); const r = window.__spel.D.oudeWereld.regios.find(x => x.id === H.exp?.regio); if (!r) return w[0]; const best = r.hart.keuzes.map((c, i) => [i, H.kenm[c.test.kenmerk] + A.wapenBonus(H, false) * (c.test.kenmerk === "kracht" ? 0.5 : 0)]).sort((a, b) => b[1] - a[1])[0][0]; return best; }
      if (soort === "De schat") return w[0];
      if (soort === "Post naar huis") return null;
      if (soort === "Terughalen") return w[0];
      if (soort === "Doorvechter") return h.L > 3;
      if (soort === "Rondkijken") return knoppen.some(k => k.waarde === rondkijkWens && !k.uit) ? rondkijkWens : null;
      if (soort === "Brede schouders") { const ag = S().helden.find(x => x.id === "aggie-pruitt"); return !!ag && ag.L > 3; }
      if (soort === "Onderschepping") return w[0];
      if (soort === "Buit") return w.includes("spul") && A.wapenBonus(h, false) < 3 ? "spul" : w.includes("trofee") ? "trofee" : w[0];
      if (soort === "Beloningsronde") {
        const wapen = w.find(([s, id]) => (s === "spullen" ? A.spulDef(id) : s === "artefacten" ? window.__spel.D.artefacten.find(a => a.id === id) : null)?.bonus?.gevecht);
        if (wapen && A.wapenBonus(h, false) < 4) return wapen;
        return w.find(([s]) => s === "artefacten") || w[0];
      }
      if (soort === "Te veel bagage") return w[w.length - 1];
      if (soort.startsWith("Onheil") && w.includes(true)) return true;
      if (soort === "Theater") return h.kenm.overtuiging >= 3;
      if (soort === "De laatste nacht") return h.kenm.kennis + Math.min(2, h.spreuken.length) > h.kenm.kracht + A.wapenBonus(h, false) && w.includes("kennis") ? "kennis" : "kracht";
      const eerste = knoppen.find(k => !k.ghost);
      return (eerste || knoppen[0]).waarde;
    }
  };

  if (seed != null) A.zaai(seed);
  A.nieuwSpel(godId, moeilijkheid, heldIds, { klokken: window.__klokken || [], modus: window.__modus || "gewoon", oudeWereld: !!window.__oudeWereld });

  const dist = (van, naar) => A.afstanden(van)[naar] ?? 99;
  const dichtsbij = (h, filter) => {
    const van = A.isOverzee(h.plek) ? "st-katharine-docks" : h.plek;
    const d = A.afstanden(van);
    return Object.keys(S().plekken).filter(filter).sort((a, b) => (d[a] ?? 99) - (d[b] ?? 99))[0] || null;
  };
  const geld = h => h.pond >= 2;

  function doel(h) {
    const st = S(), m = A.mysterie();
    if (h.L <= 2 || A.heeft(h, "gewond")) return "city";
    if (h.G <= 2) return "spitalfields";
    const scheuren = Object.keys(st.plekken).filter(p => st.plekken[p].scheur);
    if (st.god === "ommeth" && (h.kenm.kracht + A.wapenBonus(h, false) >= 4 || h.kenm.overtuiging >= 3)) {
      const kudde = dichtsbij(h, p => st.plekken[p].monsters.filter(x => x.id === "cultist").length >= 2);
      if (kudde && dist(h.plek, kudde) <= 3) return kudde;
    }
    if (scheuren.length >= 4 && h.aanw > 0) return dichtsbij(h, p => st.plekken[p].scheur);
    if (st.ow && !A.isOverzee(h.plek)) {
      h.ronde.botOW ??= window.__botOW !== false && Math.random() < 0.3;
      const iemandWeg = st.helden.some(x => x !== h && A.isOverzee(x.plek));
      const regio = ["thebe", "himalaya", "yucatan"].find(r => !st.ow[r].hart);
      if (h.ronde.botOW && regio && !iemandWeg && h.pond >= 3 && h.L >= h.maxL - 1 && h.G >= 4 && st.ronde >= 2 && st.mist > st.mistStart / 2 && (!m || m.type !== "episch")) { h.botWil = true; return regio; }
    }
    if (!m) return null;
    if (m.type === "aanwijzingen") {
      const samen = st.helden.reduce((s, x) => s + x.aanw, 0);
      if (samen >= m.aantal) return m.plek;
      return dichtsbij(h, p => st.plekken[p].aanw > 0 && !st.plekken[p].monsters.length) || dichtsbij(h, p => st.plekken[p].aanw > 0) || dichtsbij(h, p => st.plekken[p].scheur);
    }
    if (m.type === "scheuren") return dichtsbij(h, p => st.plekken[p].scheur && (!m.rivier || D.bord.rivier.includes(p))) || dichtsbij(h, p => st.plekken[p].aanw > 0);
    const epischOp = Object.keys(st.plekken).find(p => st.plekken[p].monsters.some(x => D.epische.some(e => e.id === x.id)));
    if (m.type === "episch") return h.L >= h.maxL - 1 && h.G >= 3 ? (epischOp || m.plek) : (h.aanw < 2 ? dichtsbij(h, p => st.plekken[p].aanw > 0) : null);
    if (m.type === "test") return isPlek(m.plek) || geld(h) || A.isOverzee(h.plek) ? m.plek : "leicester-square";
    if (m.type === "artefacten") {
      const n = st.helden.reduce((s, x) => s + x.artefacten.length, 0);
      if (n >= m.aantal) return m.plek;
      if (h.artefacten.length && n >= m.aantal) return m.plek;
      return geld(h) || A.isOverzee(h.plek) ? (h.plek === "thebe" ? "himalaya" : "thebe") : "leicester-square";
    }
    if (m.type === "cultisten") return dichtsbij(h, p => st.plekken[p].monsters.some(x => x.id === "cultist")) || dichtsbij(h, p => st.plekken[p].scheur);
    if (m.type === "weigeren") return h.aanw < 3 ? dichtsbij(h, p => st.plekken[p].aanw > 0) : dichtsbij(h, p => st.plekken[p].scheur);
    if (m.type === "betaal") {
      const geld = st.helden.reduce((s, x) => s + x.pond, 0);
      if (geld >= m.aantal) return m.plek;
      return h.kenm.overtuiging >= 3 ? "mayfair" : "leicester-square";
    }
    if (m.type === "breng") {
      const drager = st.helden.find(x => x.mysterieVoorwerp);
      if (drager) return drager === h ? m.naar : dichtsbij(h, p => st.plekken[p].aanw > 0);
      return !A.isOverzee(m.van) || geld(h) || A.isOverzee(h.plek) ? m.van : "leicester-square";
    }
    return null;
  }

  function dienstNuttig(h) {
    if (A.isOverzee(h.plek)) return false;
    const d = A.plekDef(h.plek).dienst;
    if (d === "markt") return h.pond >= 2 && !A.heeft(h, "gezocht");
    if (d === "bibliotheek") return h.spreuken.length < 2;
    if (d === "theater") return h.pond < 3;
    if (d === "ziekenhuis") return A.heeft(h, "gewond") || (h.L < h.maxL - 1 && h.pond >= 1);
    if (d === "gaarkeuken") return h.G < h.maxG - 1;
    if (d === "kerk") return A.heeft(h, "vervloekt") || !A.heeft(h, "gezegend");
    if (d === "seance") return h.G > 4;
    if (d === "universiteit") return h.artefacten.length > 0 || h.spullen.some(id => A.spulDef(id).soort === "Boek");
    if (d === "kunstenaars") return h.toestanden.some(t => t.startsWith("waanzin"));
    if (d === "politie") return A.heeft(h, "gezocht") && h.pond >= 2;
    return false;
  }

  /* Kaarten van de Oude Wereld: dieper zolang het risico op een ramp klein is, anders terug */
  async function overzee(h) {
    const st = S(), regio = h.exp.regio, s = st.ow[regio], m = A.mysterie();
    for (let n = 0; n < 4 && h.exp && h.acties > 0; n++) {
      const ma = A.mysterieActie(h);
      if (ma && ma.kan && !h.gebruikt.includes("mysterie")) { A.gebruikActie(h, "mysterie"); await A.doeMysterie(h); if (S().einde) return; continue; }
      const wilMysterie = m && m.type === "test" && m.plek === regio;
      if (wilMysterie && h.exp.plek === "aankomst") { await A.owReis(h, "r1a"); continue; }
      if (wilMysterie) return;
      /* alleen wie vrijwillig ging, verkent verder; na een mysterie gaat de testspeler naar huis */
      if (!h.botWil) { h.botWil = false; await A.owTerug(h); return; }
      const moe = h.L <= 3 || h.G <= 2;
      const hier = h.exp.plek, buitHier = hier !== "aankomst" && !s.geplunderd.includes(hier) && !(hier === "hart" && s.hart);
      if (buitHier && !moe) return; /* blijf staan voor de ontmoeting */
      const opties = A.owBuren(hier).filter(k => k !== "aankomst" && !s.geplunderd.includes(k) && !(k === "hart" && s.hart));
      const nieuw = k => !s.ontdekt.includes(k);
      const risico = A.owRisico(h);
      if (moe || !opties.length || (opties.some(nieuw) && !opties.some(k => !nieuw(k)) && risico > 0.25)) { h.botWil = false; await A.owTerug(h); return; }
      const keus = opties.sort((a, b) => (nieuw(a) - nieuw(b)) || (A.OW_KNOPEN[b].ring - A.OW_KNOPEN[a].ring))[0];
      if (nieuw(keus) && risico > 0.25) { h.botWil = false; await A.owTerug(h); return; }
      await A.owReis(h, keus);
    }
  }
  async function beurt(h) {
    if (A.heeft(h, "verdwaald")) { await A.zoekWeg(h); return; }
    if (h.exp) { await overzee(h); return; }
    for (let n = 0; n < 8 && (h.acties > 0 || h.stappen > 0); n++) {
      while (h.trofee >= 3) await A.groei(h, h.kenm.kracht < 3 ? "kracht" : h.kenm.kennis < 4 ? "kennis" : "L");
      if (h.L <= 2 && h.spullen.includes("carbol")) await A.gebruikSpul(h, "carbol");
      if (h.G <= 2 && h.spullen.includes("vlugzout")) await A.gebruikSpul(h, "vlugzout");
      const ma = A.mysterieActie(h);
      if (ma && ma.kan && h.acties > 0 && !h.gebruikt.includes("mysterie")) { A.gebruikActie(h, "mysterie"); await A.doeMysterie(h); if (S().einde) return; continue; }
      const d = doel(h);
      if (h.spullen.includes("rijtuig") && d && isPlek(d) && !A.isOverzee(h.plek) && dist(h.plek, d) >= 2) await A.gebruikSpul(h, "rijtuig");
      if (d && d !== h.plek) {
        if (A.isOverzee(h.plek)) {
          if (h.acties > 0 && !h.gebruikt.includes("reizen")) { A.gebruikActie(h, "reizen"); h.plek = "st-katharine-docks"; continue; }
        } else if (!isPlek(d)) {
          if (h.plek === "st-katharine-docks") {
            if (h.pond >= A.bootPrijs() && h.acties > 0 && !h.gebruikt.includes("dienst")) { havenDoel = d; await A.dienst(h); continue; }
          } else if (A.bereikbaar(h).length) {
            const metro = A.metroDoelen(h).map(x => [x, dist(x, "st-katharine-docks")]).sort((a, b) => a[1] - b[1])[0];
            A.reis(metro && metro[1] + 1 < dist(h.plek, "st-katharine-docks") ? metro[0] : A.stapNaar(h.plek, "st-katharine-docks")); continue;
          }
        } else {
          if (A.plekDef(h.plek).dienst === "station" && !(window.__klokken || []).includes("gesloten-lijnen") && S().plekken[d]?.scheur && h.pond >= 1 && dist(h.plek, d) > 2 && h.acties > 0 && !h.gebruikt.includes("dienst")) { stationDoel = d; await A.dienst(h); continue; }
          const metro = A.metroDoelen(h).map(x => [x, dist(x, d)]).sort((a, b) => a[1] - b[1])[0];
          if (metro && metro[1] + 1 < dist(h.plek, d) && A.bereikbaar(h).length) { A.reis(metro[0]); continue; }
          if (A.bereikbaar(h).length) { A.reis(A.stapNaar(h.plek, d)); continue; }
        }
      }
      if (h.acties <= 0) break;
      if (!h.gebruikt.includes("dienst") && dienstNuttig(h)) { await A.dienst(h); continue; }
      /* Rondkijken als er verder niets nuttigs te doen is: kaartje of inkopen met geld over, anders rondhoren als je gezond bent */
      if (!h.gebruikt.includes("rondkijken") && !h.ronde.botRondkijken && h.acties > 0 && !A.isOverzee(h.plek)) {
        h.ronde.botRondkijken = true;
        rondkijkWens = h.pond >= 3 && !h.spullen.includes("rijtuig") ? "kaartje" : h.pond >= 3 && !A.heeft(h, "gezocht") ? "inkopen" : h.L >= h.maxL - 1 && h.G >= h.maxG - 1 && h.G > 2 ? "rondhoren" : null;
        if (S().god === "yth-nemora" && h.aanw - Math.min(h.aanwZeker || 0, h.aanw) >= 2 && h.kenm.scherpte < 4 && ["strand", "whitehall", "bloomsbury"].includes(h.plek)) rondkijkWens = "natrekken";
        if (S().god === "sirrhae" && S().helden.some(x => x !== h && x.plek === h.plek && A.heeft(x, "betoverd"))) rondkijkWens = "terughalen";
        if (rondkijkWens) { await A.rondkijken(h); continue; }
      }
      const mon = S().plekken[h.plek]?.monsters.length;
      if (mon && !h.ronde.voorbereid && !h.gebruikt.includes("voorbereiden")) { await A.voorbereiden(h); continue; }
      if (!h.gebruikt.includes("rusten") && !mon && (h.L < h.maxL || h.G < h.maxG)) { await A.rust(h); continue; }
      break;
    }
  }

  let stappen = 0;
  while (!S().einde && stappen++ < 400) {
    const st = S();
    if (st.fase !== "helden") break;
    await beurt(huidig());
    if (S().einde) break;
    await A.beurtKlaar();
  }
  const st = S();
  window.__bot = null;
  const g = D.goden.find(x => x.id === st.god);
  const actiefM = g.mysteries[st.mysterieVolgorde[Math.min(st.mysterieIndex, st.nodig - 1)]];
  return { opgelostNamen: st.mysterieVolgorde.slice(0, st.opgelost).map(i => g.mysteries[i].naam), vastOp: st.opgelost < st.nodig ? actiefM.naam : null, einde: st.einde, ronde: st.ronde, opgelost: st.opgelost, nodig: st.nodig, mist: st.mist, gevallen: st.gevallen || 0, verzet: st.verzet ?? null,
    owTel: st.owTel || null, waanzin: st.helden.reduce((s, h) => s + h.toestanden.filter(t => t.startsWith("waanzin")).length, 0) };
};
