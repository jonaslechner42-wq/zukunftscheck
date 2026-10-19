// Alle Texte der Website. Hier ändern, dann veröffentlichen (../veroeffentlichen.sh).
// Platzhalter: {name} = Vorname, {frage} = Frage aus Runde 1, {schritt} = gewählter Versuch aus Runde 2.
// Typen: text · wahl (eine Antwort) · mehrfach (mehrere) · lesen (Antwort 1/2 anzeigen).
// Die id nie ändern, wenn schon Antworten da sind – sie verbindet Antwort und Frage.

window.ZC_RUNDEN = {
  1: {
    titel: 'Runde 1 von 3',
    start: {
      titel: 'Hi {name}!',
      text: [
        'Danke, dass du mitmachst. Es geht um eine Frage zu deiner Zukunft: Schule, Ausbildung, Studium, Arbeit oder was dich gerade sonst beschäftigt.',
        'Es gibt drei kurze Runden. Das hier ist Runde 1 und dauert ca. 8 Minuten. Es gibt keine falschen Antworten, Stichworte reichen.',
        'Tipp: Statt zu tippen kannst du auch aufs Mikrofon auf deiner Tastatur drücken und einfach reden.'
      ],
      knopf: 'Los geht’s'
    },
    fragen: [
      { id: 'frage', typ: 'text', pflicht: true,
        vorspann: 'Erste Frage.',
        frage: 'Was beschäftigt dich gerade wirklich, wenn du an die nächsten ein, zwei Jahre denkst?',
        hilfe: 'Eine Entscheidung, eine Unsicherheit oder etwas, das sich noch nicht geklärt anfühlt.' },
      { id: 'richtung', typ: 'text', pflicht: true,
        vorspann: 'Okay.',
        frage: 'Was würdest du wahrscheinlich machen, wenn du niemanden fragst und einfach so weitermachst?' },
      { id: 'moment1', typ: 'text', pflicht: true,
        vorspann: 'Jetzt was Konkretes.',
        frage: 'Erzähl von einem Moment aus den letzten Wochen, der mit deiner Frage zu tun hat. Was hast du da gemacht?',
        hilfe: 'Nicht, was es über dich aussagt – einfach, was passiert ist.' },
      { id: 'moment2', typ: 'text',
        vorspann: 'Und noch einer.',
        frage: 'Gibt es einen zweiten Moment oder eine Entscheidung dazu?',
        hilfe: 'Wenn dir nichts einfällt, kannst du das überspringen.' },
      { id: 'abwaegung', typ: 'text',
        frage: 'Wann hast du dich zuletzt für etwas entschieden und dafür bewusst auf etwas anderes verzichtet?',
        hilfe: 'Zum Beispiel: Projekt statt Party, Kurs statt Job, Sport statt Lernen …' },
      { id: 'unsicher', typ: 'text', pflicht: true,
        vorspann: 'Fast die Hälfte.',
        frage: 'Bei welchen Dingen bist du dir am unsichersten?',
        hilfe: 'Höchstens drei. Zum Beispiel: ob dir etwas wirklich Spaß macht, ob du gut genug bist, ob es das in ein paar Jahren noch gibt.' },
      { id: 'klarheit', typ: 'wahl', pflicht: true,
        frage: 'Wie klar ist dir gerade, was du machen willst?',
        optionen: ['Gar nicht klar', 'Eher unklar', 'Halb-halb', 'Eher klar', 'Ziemlich klar'],
        dazu: 'Magst du kurz sagen, warum? (freiwillig)', dazuId: 'klarheit_warum' },
      { id: 'schon', typ: 'text',
        frage: 'Machst du schon etwas, das mit deiner Frage zu tun hat?',
        hilfe: 'Ein Projekt, ein Job, ein Kurs, ein Verein, etwas Selbstgebautes … Ein Link ist auch gut.' },
      { id: 'offen', typ: 'text',
        frage: 'Gibt es etwas, das du jetzt auf keinen Fall schon festlegen willst?' },
      { id: 'gefuehl1', typ: 'wahl',
        vorspann: 'Letzte Frage für heute.',
        frage: 'Wie war das Ausfüllen?',
        optionen: ['Angenehm', 'Okay', 'Zu lang', 'Anstrengend'],
        dazu: 'Was würdest du anders machen? (freiwillig)', dazuId: 'gefuehl1_warum' }
    ],
    ende: {
      titel: 'Danke, {name}!',
      text: [
        'Jonas schaut sich deine Antworten an und schickt dir in ein paar Tagen Runde 2: zwei kurze Antworten auf deine Frage.',
        'Dafür brauchst du wieder genau diesen Link.'
      ]
    }
  },

  2: {
    titel: 'Runde 2 von 3',
    start: {
      titel: 'Hi {name}, Runde 2!',
      text: [
        'Deine Frage war: „{frage}“',
        'Dazu gibt es jetzt zwei verschiedene Antworten. Lies beide in Ruhe, danach kommen ein paar kurze Fragen. Dauert ca. 8 Minuten.'
      ],
      knopf: 'Zur ersten Antwort'
    },
    fragen: [
      { id: 'lesen1', typ: 'lesen', text: 0, frage: 'Antwort 1' },
      { id: 'lesen2', typ: 'lesen', text: 1, frage: 'Antwort 2' },
      { id: 'besser', typ: 'wahl', pflicht: true, nochmalLesen: true,
        frage: 'Welche Antwort hilft dir bei deiner Frage mehr?',
        optionen: ['Antwort 1', 'Antwort 2', 'Beide gleich', 'Keine von beiden'],
        dazu: 'Warum?', dazuId: 'besser_warum', dazuPflicht: true },
      { id: 'falsch', typ: 'text',
        frage: 'Was stimmt nicht, passt nicht zu dir oder fehlt dir?',
        hilfe: 'Ehrlich ist am hilfreichsten.' },
      { id: 'satz', typ: 'text', nochmalLesen: true,
        frage: 'Gab es einen Gedanken, der dich wirklich zum Nachdenken gebracht hat?',
        hilfe: 'Du kannst den Satz auch einfach reinkopieren.' },
      { id: 'schritt', typ: 'wahl', pflicht: true,
        vorspann: 'Jetzt wird’s praktisch.',
        frage: 'Was könntest du in den nächsten ein bis drei Wochen ausprobieren?',
        optionen: ['Einen Vorschlag aus den Antworten', 'Etwas, das ich eh schon mache', 'Etwas ganz anderes', 'Gerade nichts'],
        dazu: 'Was genau?', dazuId: 'schritt_was' },
      { id: 'merken', typ: 'text',
        wenn: function (a) { return a.schritt !== 'Gerade nichts'; },
        frage: 'Woran würdest du merken, ob dir das etwas bringt?',
        hilfe: 'Zum Beispiel: ob du Lust auf mehr hast, ob es dich nervt, was andere dazu sagen.' },
      { id: 'gefuehl2', typ: 'wahl',
        frage: 'Wie war diese Runde?',
        optionen: ['Angenehm', 'Okay', 'Zu lang', 'Anstrengend'],
        dazu: 'Noch was dazu? (freiwillig)', dazuId: 'gefuehl2_warum' }
    ],
    ende: {
      titel: 'Danke!',
      text: [
        'In ein bis drei Wochen kommt die letzte kurze Runde (ca. 5 Minuten), wieder über diesen Link.',
        'Bis dahin viel Spaß beim Ausprobieren!'
      ]
    }
  },

  3: {
    titel: 'Runde 3 von 3',
    start: {
      titel: 'Hi {name}, letzte Runde!',
      text: ['Ein kurzer Rückblick, ca. 5 Minuten.'],
      knopf: 'Los geht’s'
    },
    fragen: [
      { id: 'versuch', typ: 'text', pflicht: true,
        vorspann: 'Du wolltest ausprobieren: „{schritt}“', vorspannSonst: 'Seit Runde 2 ist etwas Zeit vergangen.',
        frage: 'Was ist daraus geworden? Was ist passiert?',
        hilfe: 'Auch „hab’s nicht gemacht“ ist eine gute Antwort. Dann: Warum nicht?' },
      { id: 'frage_neu', typ: 'text', pflicht: true,
        vorspann: 'Am Anfang war deine Frage: „{frage}“',
        frage: 'Wie würdest du deine Frage heute formulieren?' },
      { id: 'anders', typ: 'text', pflicht: true,
        frage: 'Siehst du jetzt etwas anders als am Anfang? Und was ist noch offen?' },
      { id: 'geholfen', typ: 'mehrfach', pflicht: true,
        frage: 'Was hat dich am meisten weitergebracht?',
        hilfe: 'Mehrere Antworten gehen.',
        optionen: ['Die Fragen in Runde 1', 'Eine der zwei Antworten', 'Die Gedanken zur Zukunft', 'Das Ausprobieren', 'Mit jemandem darüber reden', 'Nichts davon'],
        dazu: 'Magst du das kurz erklären? (freiwillig)', dazuId: 'geholfen_warum' },
      { id: 'naechster', typ: 'text',
        frage: 'Was ist jetzt dein nächster Schritt?' },
      { id: 'wieder', typ: 'wahl', pflicht: true,
        frage: 'Würdest du so etwas wieder machen, z. B. bei der nächsten großen Entscheidung?',
        optionen: ['Ja', 'Vielleicht', 'Nein'],
        dazu: 'Warum? (freiwillig)', dazuId: 'wieder_warum' },
      { id: 'wert', typ: 'wahl',
        frage: 'Angenommen, das wäre ein richtiges Angebot: Was wäre es dir wert?',
        hilfe: 'Nur zum Einschätzen, du zahlst natürlich nichts. Darfst du auch überspringen.',
        optionen: ['Nur gratis', 'Bis 10 €', '10–30 €', '30–60 €', 'Mehr als 60 €'] },
      { id: 'sonst', typ: 'text',
        vorspann: 'Zum Schluss.',
        frage: 'Gibt es noch etwas, das Jonas wissen sollte?' }
    ],
    ende: {
      titel: 'Fertig, danke {name}!',
      text: ['Du hast Jonas damit echt geholfen.']
    }
  }
};

window.ZC_TEXTE = {
  ohneLink: { titel: 'Zukunftscheck', text: ['Für diese Seite brauchst du deinen persönlichen Link von Jonas.'] },
  falscherLink: { titel: 'Hm, dieser Link passt nicht', text: ['Schau, ob du den ganzen Link kopiert hast, oder frag Jonas nach einem neuen.'] },
  fehler: { titel: 'Gerade klemmt’s', text: ['Die Seite erreicht den Server nicht. Probier’s in ein paar Minuten nochmal oder sag Jonas Bescheid.'] },
  warten2: { titel: 'Danke, {name}!', text: ['Runde 1 ist angekommen. Jonas bereitet gerade deine zwei Antworten vor und meldet sich, sobald Runde 2 bereit ist. Gleicher Link.'] },
  warten3: { titel: 'Danke, {name}!', text: ['Runde 2 ist angekommen. Die letzte Runde kommt in ein bis drei Wochen. Jonas sagt dir Bescheid.'] },
  fertig: { titel: 'Alles erledigt, danke {name}!', text: ['Du hast alle drei Runden gemacht.'] }
};
