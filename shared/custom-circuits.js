// custom-circuits.js
// Script centralizzato per caricare automaticamente WaveDrom nelle pagine che lo richiedono.

// Funzione helper per caricare script in modo dinamico
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Al caricamento della pagina HTML
document.addEventListener("DOMContentLoaded", async () => {
    // Cerchiamo se ci sono effettivamente tag di tipo WaveDrom nella pagina
    const hasWaveDrom = document.querySelector('script[type="WaveDrom"]');
    
    if (hasWaveDrom) {
        try {
            // 1. Carica la Skin (stili di default)
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.3.0/skins/default.js');
            
            // 2. Carica il motore principale di WaveDrom
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/wavedrom/3.3.0/wavedrom.min.js');
            
            // 3. Processa e renderizza tutti i circuiti trovati!
            WaveDrom.ProcessAll();
            
            // Piccola pezza CSS per far risaltare meglio i colori scuri 
            // se il sito ha uno sfondo scuro
            const style = document.createElement('style');
            style.innerHTML = `
                .line { stroke: #fff !important; }
                .gate { fill: #333 !important; stroke: #0a84ff !important; }
                .text { fill: #fff !important; font-family: monospace !important; }
            `;
            document.head.appendChild(style);

        } catch (error) {
            console.error("Errore durante il caricamento di WaveDrom:", error);
        }
    }
});
