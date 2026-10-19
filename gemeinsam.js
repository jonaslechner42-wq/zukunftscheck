// Kleine Helfer für Website und Verwaltung.
window.ZCG = (function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  // Sehr kleines Markdown: Absätze, Listen (- …), Überschriften (## …), **fett**, Links.
  function md(text) {
    var html = '', absatz = [], liste = false;
    function absatzEnde() { if (absatz.length) { html += '<p>' + absatz.join('<br>') + '</p>'; absatz = []; } }
    function listeEnde() { if (liste) { html += '</ul>'; liste = false; } }
    String(text || '').replace(/\r/g, '').split('\n').forEach(function (roh) {
      var z = roh.trim(), m;
      if (!z) { absatzEnde(); listeEnde(); return; }
      if ((m = z.match(/^[-*•]\s+(.*)$/))) {
        absatzEnde();
        if (!liste) { html += '<ul>'; liste = true; }
        html += '<li>' + inline(m[1]) + '</li>';
        return;
      }
      if ((m = z.match(/^#{1,4}\s+(.*)$/))) { absatzEnde(); listeEnde(); html += '<h3>' + inline(m[1]) + '</h3>'; return; }
      listeEnde();
      absatz.push(inline(z));
    });
    absatzEnde(); listeEnde();
    return html;
  }

  return { esc: esc, md: md };
})();
