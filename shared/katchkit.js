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
    this.initCardsIcons();
    this.initLatex();
  },

  // Modulo 1: Scroll e navigazione (Spy & Flash)
  initScrollSpy: function () {
    // Trova tutti gli ID cablati nella sidebar (sia link principali che sub-link)
    const listItems = document.querySelectorAll('.sb-sections li[data-sid]');
    const IDS = Array.from(listItems).map(li => li.getAttribute('data-sid'));

    /* smooth scroll + flash */
    function goTo(id) {
      const el = document.getElementById(id);
      if (!el) return;
      
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        // Fallback per browser vecchi che non supportano l'oggetto options
        el.scrollIntoView();
      }
      
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
      // Rimuove sb-active da tutti i li
      document.querySelectorAll('.sb-sections li').forEach(function (li) {
        li.classList.remove('sb-active');
      });
      // Aggiunge sb-active al li corrente e, se è un sub-item, anche al suo genitore principale
      const activeLi = document.querySelector(`.sb-sections li[data-sid="${id}"]`);
      if (activeLi) {
        activeLi.classList.add('sb-active');
        const parentUl = activeLi.closest('.sb-sub-sections');
        if (parentUl && parentUl.closest('li')) {
          parentUl.closest('li').classList.add('sb-active');
        }
      }
      
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

    /* wire sidebar section links (main & sub) */
    document.querySelectorAll('.sb-link[data-target], .sb-sub-link[data-target]').forEach(function (el) {
      el.addEventListener('click', function (e) { 
        e.stopPropagation(); 
        
        // Logica per il toggle manuale dell'accordion
        const parentLi = el.closest('li');
        if (el.classList.contains('sb-link') && parentLi.querySelector('.sb-sub-sections')) {
          if (parentLi.classList.contains('sb-active')) {
            // Se è già attivo e lo clicco, lo chiudo forzatamente
            parentLi.classList.toggle('user-collapsed');
          } else {
            // Se non è attivo, naviga e si aprirà automaticamente senza user-collapsed
            parentLi.classList.remove('user-collapsed');
          }
        }
        
        goTo(el.dataset.target); 
      });
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
    const sidebar = document.querySelector('.so-sidebar');

    // LOGICA DI APERTURA (Event Delegation)
    document.addEventListener('click', function (e) {
      const toggleBtn = e.target.closest('#sidebar-toggle');
      
      if (toggleBtn && sidebar) {
        e.stopPropagation();
        sidebar.classList.toggle('open');
      } else if (sidebar && sidebar.classList.contains('open') && !sidebar.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    // LOGICA DI APERTURA DA TASTIERA (Tasto 'm')
    document.addEventListener('keydown', function (e) {
      // Ignora l'evento se l'utente sta scrivendo in un campo di testo
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if ((e.key === 'm' || e.key === 'M') && sidebar) {
        sidebar.classList.toggle('open');
      }
    });

    // INIEZIONE ICONA (Legacy per navbar statiche rimaste nel progetto)
    const toggleBtnStatic = document.getElementById('sidebar-toggle');
    if (toggleBtnStatic && !toggleBtnStatic.innerHTML.trim()) {
      toggleBtnStatic.innerHTML = `<i class="bi bi-list" style="font-size: 1.5rem;"></i>`;
    }
  },

  // Modulo 3: Iniezione icone nelle Cards (Definizioni, Tip, Formule)
  initCardsIcons: function () {
    // --- Definizioni ---
    const defHeaders = document.querySelectorAll('.card-def-header, .card-def .header');
    const libroIcona = `<i class="bi bi-bookmark-fill"></i> `;
    defHeaders.forEach(function (header) {
      if (!header.querySelector('.bi')) {
        header.innerHTML = libroIcona + header.innerHTML;
      }
    });

    // --- Tip ---
    const tipHeaders = document.querySelectorAll('.card-tip .header');
    const tipIcona = `<i class="bi bi-lightbulb-fill"></i> `;
    tipHeaders.forEach(function (header) {
      if (!header.querySelector('.bi')) {
        header.innerHTML = tipIcona + header.innerHTML;
      }
    });

    // --- Formule ---
    const formulaHeaders = document.querySelectorAll('.card-formula .header');
    const formulaIcona = `<i class="bi bi-calculator-fill"></i> `;
    formulaHeaders.forEach(function (header) {
      if (!header.querySelector('.bi')) {
        header.innerHTML = formulaIcona + header.innerHTML;
      }
    });

    // --- Warning ---
    const warningHeaders = document.querySelectorAll('.card-warning .header');
    const warningIcona = `<i class="bi bi-exclamation-triangle-fill"></i> `;
    warningHeaders.forEach(function (header) {
      if (!header.querySelector('.bi')) {
        header.innerHTML = warningIcona + header.innerHTML;
      }
    });
  },
  initLatex: function () {
    // 1. Diciamo a MathJax come vogliamo scrivere le formule
    window.MathJax = {
      options:{
        enableMenu: false
      },
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
    const indexGrid = document.querySelector('.index-grid');
    const sidebarList = document.querySelector('.sb-sections');

    if (!indexGrid) return;

    const prefix = indexGrid.getAttribute('data-prefix');
    if (!prefix) return;

    const noSidebar = indexGrid.hasAttribute('data-no-sidebar');
    const sourceList = indexGrid.querySelector('ul');
    if (!sourceList) return;

    const listItems = Array.from(sourceList.children); // Solo i figli diretti (no sub-li)

    indexGrid.innerHTML = '';
    if (sidebarList && !noSidebar) sidebarList.innerHTML = '';

    try {
      listItems.forEach((li, index) => {
      const num = String(index + 1).padStart(2, '0');
      const targetId = li.getAttribute('data-target') || `section-${index + 1}`;
      
      // Estrai testo ignorando eventuali ul annidati
      let titleTesto = '';
      Array.from(li.childNodes).forEach(node => {
        if (node.nodeType === 3) titleTesto += node.textContent;
      });
      titleTesto = titleTesto.trim();
      if (!titleTesto && li.firstElementChild && li.firstElementChild.tagName !== 'UL') {
        titleTesto = li.firstElementChild.textContent.trim();
      }

      // --- A. COSTRUISCE LA CARD NELLA GRIGLIA CENTRALE ---
      const gridItem = document.createElement('div');
      gridItem.className = 'index-item';
      gridItem.setAttribute('data-target', targetId);
      gridItem.setAttribute('tabindex', '0');
      gridItem.setAttribute('role', 'button');
      gridItem.setAttribute('aria-label', `Vai a: ${titleTesto}`);
      gridItem.innerHTML = `
        <div class="idx-num">${prefix}.${num}</div>
        <div class="idx-name">${titleTesto}</div>
      `;
      indexGrid.appendChild(gridItem);

      // --- B. COSTRUISCE IL BOTTONE NELLA SIDEBAR LATERALE ---
      if (sidebarList && !noSidebar) {
        const sidebarItem = document.createElement('li');
        sidebarItem.setAttribute('data-sid', targetId);
        sidebarItem.innerHTML = `
          <button class="sb-link" data-target="${targetId}">
            <span class="sb-idx">${prefix}.${num}</span>
            <span>${titleTesto}</span>
          </button>
        `;
        
        // --- C. GESTIONE SOTTOPARAGRAFI ---
        const nestedUl = li.querySelector('ul');
        if (nestedUl) {
          // Aggiunge la freccina al link principale
          const mainBtn = sidebarItem.querySelector('.sb-link');
          const chevron = document.createElement('i');
          chevron.className = 'bi bi-chevron-down';
          mainBtn.appendChild(chevron);

          const subList = document.createElement('ul');
          subList.className = 'sb-sub-sections';
          const subItems = Array.from(nestedUl.children);
          
          subItems.forEach((subLi, subIndex) => {
            const subTarget = subLi.getAttribute('data-target');
            const subText = subLi.textContent.trim();
            if(subTarget) {
              const subLiEl = document.createElement('li');
              subLiEl.setAttribute('data-sid', subTarget);
              subLiEl.innerHTML = `
                <button class="sb-sub-link" data-target="${subTarget}">
                  <span>${subText}</span>
                </button>
              `;
              subList.appendChild(subLiEl);
            }
          });
          sidebarItem.appendChild(subList);
        }

        sidebarList.appendChild(sidebarItem);
      }
      });
    } catch (e) {
      console.error("AutoNav Error:", e);
      // Fallback per non rompere il resto dello script
    }
  }
};



// ── WEB COMPONENTS ────────────────────────────────────────────────
// Componente per la Navbar superiore per evitare codice HTML ridondante
class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';

    const logoText = this.getAttribute('logo-text') || '// Logo';
    const backUrl = this.getAttribute('back-url') || '../teoria.html';
    const backText = this.getAttribute('back-text') || 'Indice';
    const homeUrl = this.getAttribute('home-url') || 'https://7Katch.github.io';

    this.innerHTML = `
      <nav>
        <div class="nav-left">
          <button id="sidebar-toggle" aria-label="Menu"><i class="bi bi-list"></i></button>
          <a href="${backUrl}" class="nav-logo">${logoText}</a>
        </div>

        <div class="nav-right">
          <a href="${backUrl}" class="nav-back"><i class="bi bi-arrow-left"></i> ${backText}</a>
          <a href="${homeUrl}" class="nav-back"><i class="bi bi-house"></i> Home</a>
        </div>
      </nav>
    `;
  }
}
customElements.define('site-navbar', SiteNavbar);

// Componente per l'Intestazione (Hero Section)
class SiteHero extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';

    const eyebrow = this.getAttribute('eyebrow');
    const topicNum = this.getAttribute('topic-num');
    const title = this.getAttribute('title') || 'Titolo Mancante';
    const sub = this.getAttribute('sub');
    const titleClass = this.getAttribute('title-class') || 'topic-hero-title';

    let eyebrowHtml = '';
    if (eyebrow && eyebrow !== "None") {
      eyebrowHtml = `<span class="hero-eyebrow">\n      ${eyebrow}\n    </span>`;
    }

    let topicNumHtml = '';
    if (topicNum && topicNum !== "None") {
      topicNumHtml = `<div class="topic-num">${topicNum}</div>`;
    }

    let subHtml = '';
    if (sub && sub !== "None") {
      subHtml = `<p class="hero-sub" style="max-width:640px">\n      ${sub}\n    </p>`;
    }

    this.innerHTML = `
      <div class="hero" style="min-height:55vh">
        <div class="hero-glow"></div>
        ${eyebrowHtml}
        ${topicNumHtml}
        <h1 class="${titleClass}">${title}</h1>
        ${subHtml}
      </div>
    `;
  }
}
customElements.define('site-hero', SiteHero);

// ── BOOTSTRAP DEL FRAMEWORK ───────────────────────────────────────
// Appena il DOM è caricato, KatchKitCore si avvia automaticamente
document.addEventListener('DOMContentLoaded', function () {
  KatchKitCore.init();
  
  // 1. Terminal Typing Effect (Generic Class: .type-animation)
  document.querySelectorAll('.type-animation').forEach(typingEl => {
    const text = typingEl.innerText;
    typingEl.innerText = '';
    typingEl.style.opacity = '1';
    let i = 0;
    function type() {
      if (i < text.length) {
        typingEl.innerHTML = text.substring(0, i+1);
        i++;
        setTimeout(type, Math.random() * 40 + 30);
      } else {
        typingEl.innerHTML = text;
      }
    }
    setTimeout(type, 300); // Start delay
  });
});

// 2. Neon Cursor Spotlight (Homepage)
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.materia-card').forEach(card => {
    const rect = card.getBoundingClientRect(),
          x = e.clientX - rect.left,
          y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// 3. Scroll Reveal per Card
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.materia-card, .section-card, .overview-card').forEach((card, index) => {
  card.classList.add('js-reveal');
  // Staggered delay basato sull'indice della riga (circa)
  card.style.transitionDelay = `${(index % 3) * 0.1}s`;
  observer.observe(card);
});
