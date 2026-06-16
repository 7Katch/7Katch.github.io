/**
 * KatchKit UI Framework - v1.0.0
 * Core JavaScript Library
 */

const KatchKitCore = {

  // Funzione principale che avvia tutto
  init: function () {
    this.initAutoNavigation(); // l'auto-numerazione della barra laterale
    this.initScrollSpy();
    this.initSidebarToggle();
    this.initDefinitions();
    this.initLatex();
  },

  // Modulo 1: Scroll e navigazione (Spy & Flash)
  initScrollSpy: function () {
    // Trova automaticamente tutti gli ID delle sezioni presenti nella pagina
    const sectionElements = document.querySelectorAll('.section-block[id]');
    const IDS = Array.from(sectionElements).map(el => el.id);

    if (IDS.length === 0) return; // Se non ci sono sezioni, interrompi

    /* smooth scroll + flash */
    function goTo(id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.remove('sb-flash');
      void el.offsetWidth; // force reflow
      el.classList.add('sb-flash');
      el.addEventListener('animationend', function () {
        el.classList.remove('sb-flash');
      }, { once: true });
      setActive(id);
    }

    /* highlight sidebar item */
    function setActive(id) {
      document.querySelectorAll('.sb-sections li').forEach(function (li) {
        li.classList.toggle('sb-active', li.getAttribute('data-sid') === id);
      });
      /* auto-scroll sidebar so active item is visible */
      const sb = document.querySelector('.so-sidebar');
      const act = document.querySelector('.sb-sections li.sb-active');
      if (sb && act) {
        const liTop = act.offsetTop;
        const liH = act.offsetHeight;
        if (liTop < sb.scrollTop || liTop + liH > sb.scrollTop + sb.clientHeight) {
          sb.scrollTop = liTop - sb.clientHeight / 2 + liH / 2;
        }
      }
    }

    /* wire index-grid cards */
    document.querySelectorAll('.index-item[data-target]').forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      const name = (card.querySelector('.idx-name') || {}).textContent || '';
      card.setAttribute('aria-label', 'Vai a: ' + name.trim());
      card.addEventListener('click', function () { goTo(card.dataset.target); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(card.dataset.target); }
      });
    });

    /* wire sidebar section links */
    document.querySelectorAll('.sb-link[data-target]').forEach(function (el) {
      el.addEventListener('click', function () { goTo(el.dataset.target); });
    });

    /* IntersectionObserver — aggiorna active mentre scorri */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setActive(e.target.id);
        });
      }, { rootMargin: '-8% 0px -72% 0px', threshold: 0 });

      IDS.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }

    /* attivo iniziale */
    if (IDS.length) setActive(IDS[0]);
  },

  // Modulo 2: Toggle Sidebar (Stile Gemini) + Iniezione Icona
  initSidebarToggle: function () {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.so-sidebar');

    if (toggleBtn) {
      // 1. INIEZIONE ICONA: Se il bottone è vuoto, disegna l'SVG
      if (!toggleBtn.innerHTML.trim()) {
        toggleBtn.innerHTML = `
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        `;
      }

      // 2. LOGICA DI APERTURA (solo se esiste anche la sidebar)
      if (sidebar) {
        toggleBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          sidebar.classList.toggle('open');
        });

        // Chiude la sidebar se clicchi fuori (comodissimo su mobile!)
        document.addEventListener('click', function (e) {
          if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
          }
        });
      }
    }
  },

  // Modulo 3: Iniezione icone nelle Definizioni
  initDefinitions: function () {
    const defHeaders = document.querySelectorAll('.card-def-header');

    const libroIcona = `
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    `;

    defHeaders.forEach(function (header) {
      // Controllo di sicurezza: inserisce l'icona solo se non c'è già
      if (!header.querySelector('svg')) {
        const testoAttuale = header.innerHTML;
        header.innerHTML = libroIcona + testoAttuale;
      }
    });
  },
  initLatex: function () {
    // 1. Diciamo a MathJax come vogliamo scrivere le formule
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
      },
      chtml: {
        scale: 1.1 // Rende le formule leggermente più grandi e leggibili
      }
    };

    // 2. Creiamo il tag <script> virtuale che punta al server di MathJax
    const scriptMathJax = document.createElement('script');
    scriptMathJax.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    scriptMathJax.async = true; // Non blocca il caricamento del resto della pagina

    // 3. Iniettiamo lo script nella "testa" della pagina
    document.head.appendChild(scriptMathJax);
  },

  // Modulo 5: Auto-Generazione (Dalla Griglia -> Alla Sidebar)
  initAutoNavigation: function () {
    // 1. Trova i due contenitori
    const indexGrid = document.querySelector('.index-grid');
    const sidebarList = document.querySelector('.sb-sections');

    if (!indexGrid) return;

    // 2. Legge il prefisso dal div della griglia
    const prefix = indexGrid.getAttribute('data-prefix');
    if (!prefix) return;

    // 3. Trova la lista <ul> semplice che hai scritto nell'HTML
    const sourceList = indexGrid.querySelector('ul');
    if (!sourceList) return;

    const listItems = sourceList.querySelectorAll('li');

    // 4. Svuota fisicamente l'HTML della griglia e della sidebar
    indexGrid.innerHTML = '';
    if (sidebarList) sidebarList.innerHTML = '';

    // 5. Ricostruisce tutto in modo dinamico
    listItems.forEach((li, index) => {
      const num = String(index + 1).padStart(2, '0');
      const targetId = `section-${index + 1}`;
      const titleTesto = li.textContent.trim();

      // --- A. COSTRUISCE LA CARD NELLA GRIGLIA CENTRALE ---
      const gridItem = document.createElement('div');
      gridItem.className = 'index-item';
      gridItem.setAttribute('data-target', targetId);

      // Accessibilità
      gridItem.setAttribute('tabindex', '0');
      gridItem.setAttribute('role', 'button');
      gridItem.setAttribute('aria-label', `Vai a: ${titleTesto}`);

      gridItem.innerHTML = `
        <div class="idx-num">${prefix}.${num}</div>
        <div class="idx-name">${titleTesto}</div>
      `;
      indexGrid.appendChild(gridItem);

      // --- B. COSTRUISCE IL BOTTONE NELLA SIDEBAR LATERALE ---
      if (sidebarList) {
        const sidebarItem = document.createElement('li');
        sidebarItem.setAttribute('data-sid', targetId);
        sidebarItem.innerHTML = `
          <button class="sb-link" data-target="${targetId}">
            <span class="sb-idx">${prefix}.${num}</span>
            <span>${titleTesto}</span>
          </button>
        `;
        sidebarList.appendChild(sidebarItem);
      }
    });
  }
};



// ── BOOTSTRAP DEL FRAMEWORK ───────────────────────────────────────
// Appena il DOM è caricato, KatchKitCore si avvia automaticamente
document.addEventListener('DOMContentLoaded', function () {
  KatchKitCore.init();
});



