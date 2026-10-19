// Zukunftscheck · Ablauf der Website. Texte stehen in fragen.js.
(function () {
  'use strict';
  var C = window.ZC, RUNDEN = window.ZC_RUNDEN, TEXTE = window.ZC_TEXTE, G = window.ZCG;
  var app = document.getElementById('app');
  var balken = document.getElementById('balken');
  var rundeLabel = document.getElementById('runde');
  var touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;

  var code = '', stand = null, rundeNr = 0, runde = null, i = -1, antworten = {}, startZeit = 0;

  // ---------- Server ----------
  function rpc(name, body) {
    return fetch(C.url + '/rest/v1/rpc/' + name, {
      method: 'POST',
      headers: { apikey: C.key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return null; }).then(function (d) {
        if (!r.ok) throw new Error((d && (d.message || d.hint)) || 'HTTP ' + r.status);
        return d;
      });
    });
  }

  // ---------- Entwurf im Browser ----------
  function schluessel() { return 'zc:' + code + ':' + rundeNr; }
  function entwurfLesen() { try { return JSON.parse(localStorage.getItem(schluessel())); } catch (e) { return null; } }
  function entwurfSchreiben() { try { localStorage.setItem(schluessel(), JSON.stringify({ i: i, antworten: antworten, startZeit: startZeit })); } catch (e) { /* egal */ } }
  function entwurfWeg() { try { localStorage.removeItem(schluessel()); } catch (e) { /* egal */ } }

  // ---------- Helfer ----------
  function kurz(s, n) { s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; }
  function fuell(s) {
    return String(s || '').replace(/\{(\w+)\}/g, function (_, k) {
      var v = stand && stand[k];
      return v ? kurz(v, k === 'name' ? 40 : 220) : '';
    });
  }
  function el(tag, attrs) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    for (var n = 2; n < arguments.length; n++) {
      [].concat(arguments[n]).forEach(function (c) { if (c != null && c !== false) e.append(c); });
    }
    return e;
  }
  function zeige(knoten, fokus) {
    app.replaceChildren(knoten);
    window.scrollTo(0, 0);
    var ziel = fokus || knoten.querySelector('h1');
    if (ziel) ziel.focus({ preventScroll: true });
  }
  function fortschritt(x) { balken.style.width = (x == null ? 0 : Math.round(x * 100)) + '%'; }
  function dazuId(q) { return q.dazuId || q.id + '_warum'; }
  function sichtbar(k) { var q = runde.fragen[k]; return !q.wenn || q.wenn(antworten); }
  function naechster(k) { for (var n = k + 1; n < runde.fragen.length; n++) if (sichtbar(n)) return n; return -1; }
  function vorheriger(k) { for (var n = k - 1; n >= 0; n--) if (sichtbar(n)) return n; return -1; }
  function leer(q) {
    var a = antworten[q.id];
    if (q.typ === 'lesen') return false;
    if (q.typ === 'mehrfach') return !(a && a.length);
    return !(a && String(a).trim());
  }
  function fehlt(q) {
    if (q.pflicht && leer(q)) return q.typ === 'text' ? 'Ein paar Worte reichen schon.' : 'Wähl bitte eine Antwort aus.';
    if (q.dazuPflicht && !leer(q) && !String(antworten[dazuId(q)] || '').trim()) return 'Magst du noch kurz sagen, warum?';
    return '';
  }

  // ---------- Seiten ----------
  function zeigeInfo(t, knopf) {
    fortschritt(null);
    var teile = [el('h1', { class: 'frage', tabindex: '-1', text: fuell(t.titel) })];
    [].concat(t.text || []).forEach(function (p) { teile.push(el('p', { class: 'text', text: fuell(p) })); });
    if (knopf) teile.push(el('div', { class: 'aktionen' }, el('button', { class: 'knopf haupt', type: 'button', text: knopf.text, onclick: knopf.aktion })));
    zeige(el('section', { class: 'karte' }, teile));
  }

  function zeigeLaden() {
    fortschritt(null);
    zeige(el('section', { class: 'karte laden', 'aria-busy': 'true' }, el('p', { class: 'text leise', text: 'Einen Moment …' })));
  }

  function textfeld(id, platzhalter, zeilen, beschriftetVon) {
    var t = el('textarea', {
      id: 'f-' + id, class: 'feld', rows: String(zeilen || 4),
      placeholder: platzhalter || 'Schreib einfach los …', 'aria-labelledby': beschriftetVon || null
    });
    t.value = antworten[id] || '';
    function groesse() { t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight + 2, Math.max(window.innerHeight * 0.5, 160)) + 'px'; }
    t.addEventListener('input', function () { antworten[id] = t.value; groesse(); entwurfSchreiben(); });
    requestAnimationFrame(groesse);
    return t;
  }

  function auswahl(q, nachWahl) {
    var mehr = q.typ === 'mehrfach';
    var box = el('div', { class: 'wahlen', role: 'group', 'aria-labelledby': 'frage' });
    function an(opt) { return mehr ? (antworten[q.id] || []).indexOf(opt) >= 0 : antworten[q.id] === opt; }
    function auffrischen() { box.querySelectorAll('.wahl').forEach(function (b, k) { b.setAttribute('aria-pressed', String(an(q.optionen[k]))); }); }
    q.optionen.forEach(function (opt) {
      box.append(el('button', {
        type: 'button', class: 'wahl', text: opt, 'aria-pressed': String(an(opt)),
        onclick: function () {
          if (mehr) {
            var liste = (antworten[q.id] || []).slice(), k = liste.indexOf(opt);
            if (k >= 0) liste.splice(k, 1); else liste.push(opt);
            antworten[q.id] = liste;
          } else {
            antworten[q.id] = (antworten[q.id] === opt && !q.pflicht) ? undefined : opt;
          }
          auffrischen(); entwurfSchreiben(); nachWahl();
        }
      }));
    });
    return box;
  }

  function beideAntworten() {
    var t = (stand && stand.texte) || [];
    return el('details', { class: 'nochmal' },
      el('summary', { text: 'Die beiden Antworten nochmal ansehen' }),
      el('h3', { text: 'Antwort 1' }), el('div', { class: 'lesetext', html: G.md(t[0]) }),
      el('h3', { text: 'Antwort 2' }), el('div', { class: 'lesetext', html: G.md(t[1]) }));
  }

  function vorspann(q) {
    if (!q.vorspann) return '';
    var braucht = (q.vorspann.match(/\{(\w+)\}/g) || []).some(function (p) { return !(stand && stand[p.slice(1, -1)]); });
    return braucht ? (q.vorspannSonst || '') : fuell(q.vorspann);
  }

  function zeigeFrage(q) {
    var sichtbare = runde.fragen.filter(function (_, k) { return sichtbar(k); }).length;
    var position = runde.fragen.slice(0, i).filter(function (_, k) { return sichtbar(k); }).length;
    fortschritt((position + 1) / (sichtbare + 1));

    var teile = [], fokus = null;
    var vs = vorspann(q);
    if (vs) teile.push(el('div', { class: 'vorspann' }, el('span', { class: 'avatar', 'aria-hidden': 'true', text: 'J' }), el('span', { text: vs })));
    teile.push(el('h1', { class: 'frage', id: 'frage', tabindex: '-1', text: fuell(q.frage) }));
    if (q.hilfe) teile.push(el('p', { class: 'hilfe', text: fuell(q.hilfe) }));

    var hinweis = el('p', { class: 'hinweis', role: 'status' });
    var weiter = el('button', { class: 'knopf haupt', type: 'button' });
    var letzte = naechster(i) === -1;
    function beschriften() {
      weiter.textContent = letzte ? 'Abschicken' : (leer(q) && !q.pflicht ? 'Überspringen' : 'Weiter');
    }
    function geaendert() { hinweis.textContent = ''; letzte = naechster(i) === -1; beschriften(); }

    if (q.typ === 'lesen') teile.push(el('div', { class: 'lesetext gross', html: G.md(((stand && stand.texte) || [])[q.text]) }));
    if (q.typ === 'text') { fokus = textfeld(q.id, q.platzhalter, 4, 'frage'); teile.push(fokus); }
    if (q.typ === 'wahl' || q.typ === 'mehrfach') {
      teile.push(auswahl(q, geaendert));
      if (q.dazu) {
        var id = dazuId(q);
        teile.push(el('label', { class: 'dazu', for: 'f-' + id, text: q.dazu }));
        teile.push(textfeld(id, 'Ein paar Worte …', 2));
      }
    }
    if (q.nochmalLesen && stand && stand.texte) teile.push(beideAntworten());
    teile.push(hinweis);

    beschriften();
    weiter.addEventListener('click', function () {
      var f = fehlt(q);
      if (f) { hinweis.textContent = f; return; }
      if (letzte) { senden(weiter, hinweis); return; }
      i = naechster(i); entwurfSchreiben(); zeigeSchritt();
    });
    var zurueck = el('button', {
      class: 'knopf zurueck', type: 'button', 'aria-label': 'Zurück', text: '←',
      onclick: function () { i = vorheriger(i); entwurfSchreiben(); zeigeSchritt(); }
    });
    teile.push(el('div', { class: 'aktionen' }, zurueck, weiter));

    var karte = el('section', { class: 'karte' }, teile);
    karte.addEventListener('input', geaendert);
    karte.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); weiter.click(); }
    });
    zeige(karte, touch ? null : fokus);
  }

  function zeigeSchritt() {
    if (i < 0) {
      zeigeInfo(runde.start, {
        text: runde.start.knopf || 'Los geht’s',
        aktion: function () {
          if (!startZeit) startZeit = Date.now();
          i = naechster(-1); entwurfSchreiben(); zeigeSchritt();
        }
      });
      return;
    }
    zeigeFrage(runde.fragen[i]);
  }

  function senden(knopf, hinweis) {
    knopf.disabled = true;
    knopf.textContent = 'Wird gesendet …';
    var daten = {};
    Object.keys(antworten).forEach(function (k) {
      var v = antworten[k];
      if (v == null) return;
      if (typeof v === 'string') { v = v.trim(); if (!v) return; }
      if (Array.isArray(v) && !v.length) return;
      daten[k] = v;
    });
    rpc('zc_speichern', {
      p_code: code, p_runde: rundeNr, p_daten: daten,
      p_dauer_sek: startZeit ? Math.round((Date.now() - startZeit) / 1000) : null
    }).then(function () {
      entwurfWeg();
      zeigeInfo(runde.ende);
      fortschritt(1);
      return rpc('zc_lade', { p_code: code }).then(function (s) { if (s) stand = s; }, function () {});
    }, function () {
      knopf.disabled = false;
      knopf.textContent = 'Nochmal versuchen';
      hinweis.textContent = 'Das hat nicht geklappt. Bist du online? Deine Antworten sind gespeichert, probier es gleich nochmal.';
    });
  }

  function starteRunde(n) {
    rundeNr = n;
    runde = RUNDEN[n];
    rundeLabel.textContent = runde.titel;
    var e = entwurfLesen();
    if (e && e.antworten) {
      antworten = e.antworten;
      i = typeof e.i === 'number' ? Math.min(e.i, runde.fragen.length - 1) : -1;
      startZeit = e.startZeit || 0;
    } else {
      antworten = {}; i = -1; startZeit = 0;
    }
    zeigeSchritt();
  }

  function los() {
    code = decodeURIComponent((location.hash || '').slice(1)).replace(/[^a-z0-9]/gi, '').toLowerCase();
    rundeLabel.textContent = '';
    if (!code) { zeigeInfo(TEXTE.ohneLink); return; }
    zeigeLaden();
    rpc('zc_lade', { p_code: code }).then(function (s) {
      stand = s;
      if (!stand) { zeigeInfo(TEXTE.falscherLink); return; }
      var f = stand.fertig || [];
      if (f.indexOf(1) < 0) return starteRunde(1);
      if (f.indexOf(2) < 0) return stand.texte ? starteRunde(2) : zeigeInfo(TEXTE.warten2);
      if (f.indexOf(3) < 0) return stand.runde3_frei ? starteRunde(3) : zeigeInfo(TEXTE.warten3);
      zeigeInfo(TEXTE.fertig);
    }, function () {
      zeigeInfo(TEXTE.fehler, { text: 'Nochmal versuchen', aktion: los });
    });
  }

  window.addEventListener('hashchange', los);
  los();
})();
