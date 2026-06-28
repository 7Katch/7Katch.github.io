/**
 * KatchKit Markmap Loader (kmind.js)
 * Carica dinamicamente il file kmind.css e la libreria markmap-autoloader.
 */
(function() {
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
  document.head.appendChild(linkTag);

  // 2. Carica dinamicamente il JS di markmap-autoloader
  const scriptTag = document.createElement('script');
  scriptTag.src = 'https://cdn.jsdelivr.net/npm/markmap-autoloader';
  scriptTag.defer = true;
  document.body.appendChild(scriptTag);

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
