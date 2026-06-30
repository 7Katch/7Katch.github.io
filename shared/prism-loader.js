/**
 * Prism Loader (prism-loader.js)
 * Carica dinamicamente Prism.js, il tema scuro e l'autoloader dei linguaggi.
 * Includendo questo file, qualsiasi blocco <code class="language-xyz"> verrà formattato in automatico.
 */
(function () {
  // 1. Carica il CSS del tema (Tomorrow Night)
  const linkTag = document.createElement('link');
  linkTag.rel = 'stylesheet';
  linkTag.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
  document.head.appendChild(linkTag);

  // 2. Carica il Core JavaScript di Prism
  const coreScript = document.createElement('script');
  coreScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js';
  
  coreScript.onload = () => {
    // 3. Una volta caricato il core, carica il plugin "Autoloader"
    // Questo plugin capisce da solo quale linguaggio hai scritto nel tag HTML e scarica
    // in tempo reale la grammatica (es. Java, Python, C) senza doverli importare a mano!
    const autoLoader = document.createElement('script');
    autoLoader.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js';
    
    autoLoader.onload = () => {
        // Forza l'highlighting una volta che tutto è pronto
        Prism.highlightAll();
    };
    
    document.body.appendChild(autoLoader);
  };
  
  document.body.appendChild(coreScript);
})();
