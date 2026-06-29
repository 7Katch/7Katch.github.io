/**
 * KatchKit Markmap Loader (kmind.js)
 * Carica dinamicamente il file kmind.css e la libreria markmap-autoloader.
 */
(function () {
  // Trova il percorso corretto da cui è stato caricato questo script (così funziona a qualsiasi profondità di cartelle!)
  const scriptElement = document.currentScript;
  let cssUrl = '../shared/kmind.css'; // Fallback

  if (scriptElement && scriptElement.src) {
    // Sostituisce '.js' con '.css' mantenendo lo stesso identico percorso relativo/assoluto
    cssUrl = scriptElement.src.replace('.js', '.css');
  }

  // 1. Carica il file CSS kmind.css
  const linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.href = cssUrl;

  // FIX CRITICO: Markmap deve essere caricato SOLO DOPO che il CSS è stato applicato!
  // Se Markmap parte prima del CSS, calcola male le dimensioni dei box e i cerchi finiscono fuori posto.
  linkTag.onload = () => {
    // 1. Inietta gli span kk-node nel Markdown invisibilmente.
    // Questo garantisce che Markmap misuri gli ingombri esatti col padding e posizioni i cerchietti perfettamente!
    document.querySelectorAll('.markmap > script[type="text/template"]').forEach(script => {
      let inYaml = false;
      let newLines = script.textContent.split('\n').map(line => {
        if (line.trim() === '---') inYaml = !inYaml;
        if (inYaml || line.trim() === '---') return line;

        // Cerca righe che iniziano con #, -, *
        let match = line.match(/^(\s*(?:#+|-|\*)\s+)(.+)$/);
        if (match && !match[2].includes('kk-node')) {
          return match[1] + '<span class="kk-node">' + match[2] + '</span>';
        }
        return line;
      });
      script.textContent = newLines.join('\n');
    });

    // 2. Avvia Markmap
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://cdn.jsdelivr.net/npm/markmap-autoloader';
    document.body.appendChild(scriptTag);
  };
  linkTag.onerror = linkTag.onload; // Fallback di sicurezza
  document.head.appendChild(linkTag);

  // 3. Sincronizzazione Colori (Cyberpunk Energy Sync)
  // Osserva la mappa per "rubare" il colore dei fili vettoriali e passarlo ai box HTML
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (let m of mutations) {
      if (m.target.closest && m.target.closest('.markmap')) {
        shouldUpdate = true;
        break;
      }
    }
    if (!shouldUpdate) return;

    document.querySelectorAll('g.markmap-node').forEach(g => {
      // Trova la linea o il cerchio che possiede il colore del ramo
      const shape = g.querySelector('line') || g.querySelector('circle') || g.querySelector('path');
      const box = g.querySelector('.kk-node');

      if (shape && box) {
        const color = shape.getAttribute('stroke');
        // Se troviamo il colore, lo impostiamo come variabile CSS locale del box
        if (color && box.style.getPropertyValue('--node-color') !== color) {
          box.style.setProperty('--node-color', color);
        }
      }
    });
  });

  // Avvia l'osservatore non appena il DOM è pronto
  const startObserver = () => observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['stroke'] });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
