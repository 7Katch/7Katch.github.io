# Documentazione JSDoc per l'Animation Framework

## Obiettivo
Migliorare l'esperienza di sviluppo (Developer Experience / DX) per chi utilizza i moduli condivisi e la factory dell'animazione GSAP e P5.js, senza costringere lo sviluppatore ad aprire il codice sorgente per comprendere cosa faccia un metodo.

## Modifiche
Abbiamo introdotto la sintassi **JSDoc** standard (`/** ... */`) sopra la definizione del metodo centrale `createEntity` all'interno di `shared/animation.js`. 
Grazie ai tag `@param` e `@returns`, gli IDE moderni (come VS Code, WebStorm) o server linguistici ora attiveranno *IntelliSense* quando si richiama o si fa hover su questo metodo, mostrando un utilissimo pop-up ("tooltip") con la spiegazione dei parametri:

- `id`: l'identificatore testuale visualizzato (es. "P0")
- `x, y`: il centro geometrico del blocco
- `w, h`: le dimensioni (e i loro fallback opzionali `[w=100]`)
- `colors`: un riferimento all'array RGB per il colore (es. `KatchColors.teal`)

Questa pratica aiuterà lo sviluppatore o i collaboratori a non usare i parametri "alla cieca".
