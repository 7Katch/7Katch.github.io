# Aggiornamento: Fix Theming Dinamico e Rimozione Hardcoding

**Data**: 24 Giugno 2026

## Dettagli Modifica
È stato rilevato che il tema della pagina (es. `theme-green`) non veniva applicato completamente ai componenti visivi della Hero Section (Sfondo pallini `dot-grid` ed etichetta `hero-eyebrow`).

- **Aggiornamento CSS**: Nel file condiviso `katchkit.css`, la classe `.dot-grid::before` è stata modificata rimuovendo il colore viola hardcoded (`rgba(124, 92, 252, 0.06)`) e introducendo l'uso della variabile dinamica di tema `rgba(var(--kk-rgb), 0.06)`.
- **Pulizia HTML**: È stato eseguito uno script automatizzato su tutti i file `.html` all'interno di `EDIDS/argomenti/` e `EDIDS/` per rimuovere gli stili inline (`style="..."`) presenti sul tag `<span class="hero-eyebrow">`. Gli stili inline andavano infatti a forzare (override) colori statici (purple, teal, ecc.) impedendo al componente di ereditare le variabili definite in `katchkit.css`.

Da questo momento in poi, cambiando la classe `theme-*` nel `body`, l'intera gerarchia visiva della pagina si adatterà istantaneamente e coerentemente ai nuovi colori semantici!
