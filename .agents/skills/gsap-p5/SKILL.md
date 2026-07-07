---
name: gsap-p5-animation
description: Istruzioni per l'assistente IA su come implementare simulazioni e animazioni interattive nel sito usando P5.js in combinazione con GSAP.
---

# Linee Guida per Animazioni GSAP + P5.js

Quando il programmatore (USER) ti chiede di creare una nuova animazione didattica, simulazione o transizione di stato, DEVI sempre seguire questo pattern consolidato per il progetto `7Katch.github.io`.

## 1. Architettura HTML
- Assicurati che le dipendenze siano caricate: `<script src="[path]/shared/animation.js"></script>` (fai attenzione al livello di profondità delle cartelle).
- Usa un contenitore pulito per il canvas (es. `<div id="p5-sim-container"></div>`).
- Aggiungi sempre una plancia di comando interattiva. Usa le classi del framework `katchkit.css`:
  ```html
  <div class="sim-controls">
    <button class="btn btn-primary" onclick="animStart()">Inizia</button>
    <button class="btn btn-ghost" onclick="animReset()">Reset</button>
  </div>
  ```

## 2. Architettura Javascript (Il Pattern Passivo)
- **NON USARE `lerp()`** per le animazioni matematiche.
- La funzione `draw()` di P5.js deve essere **esclusivamente un renderizzatore passivo**. Disegna solo gli oggetti Javascript leggendo le loro coordinate (`x`, `y`, `r`, `g`, `b`) senza mai alterarle.
- **RISPARMIO RISORSE CPU:** Per evitare drain di CPU e batteria da loop inutili, in `p.setup()` devi **sempre** inserire `p.noLoop();` seguito da `gsap.ticker.add(() => p.redraw());`. Questo fa sì che `draw()` venga eseguita solo ed esclusivamente quando GSAP sta interpolando valori.

## 3. Gestione delle Transizioni (GSAP)
Tutta la logica di movimento deve essere delegata a GSAP (GreenSock):
- Associa le funzioni Javascript ai bottoni HTML.
- Prima di ogni animazione, previeni i glitch uccidendo i vecchi tween sull'oggetto: `gsap.killTweensOf(mioOggetto);`.
- Usa `gsap.timeline()` per creare sequenze (es. muovi a destra, poi illumina, poi cambia colore).
- Sfrutta parametri professionali come `ease: "power2.inOut"`.
- Se stai animando un array di oggetti, usa sempre l'effetto cascata con `stagger: 0.1` per dare un look premium e hi-tech alla simulazione.

## 4. Design System Cromatico (Cyberpunk Neon)
I colori delle simulazioni devono rispettare il tema del sito. I valori RGB standard per gli stati e i blocchi sono:
- Neutro / Disco: `[148, 163, 184]` (Slate)
- Memoria Virtuale / Page Table: `[167, 139, 250]` (Purple)
- RAM / I-O Attivo: `[34, 211, 238]` (Teal)
- CPU / Running: `[251, 191, 36]` (Amber)
- Terminato / Errore: `[248, 113, 113]` (Coral)

## 5. Layout e Posizionamento (No Magic Numbers)
- **DIVIETO ASSOLUTO DI MAGIC NUMBERS**: Non usare valori numerici assoluti "hardcoded" (`x: 120`, `y: 350`) per posizionare entità o matrici affiancate. Questo è fragile e non rispetta le best-practice del frontend.
- Utilizza sempre il sistema di impaginazione dinamico stile "flexbox" esposto dalla classe `AnimFactory`:
  1. Inizializza gli elementi con `x: 0, y: 0`.
  2. A fine costruzione, usa `factory.layoutRow([elem1, elem2, elem3], startX, y, gap)` per allinearli orizzontalmente in modo automatico calcolandone l'ingombro reale.
- **Larghezza Dinamica (Auto-Sizing)**: Se stai creando una `KatchMatrix` in cui le celle devono contenere testo, imposta `cellW = 'auto'` nel costruttore. La classe misurerà automaticamente la larghezza del testo più lungo usando `p.textWidth()` e imposterà la larghezza della cella per farcelo stare perfettamente (aggiungendo il padding), evitando collisioni visive!

## 6. Disegnare Grafici Cartesiani (KatchGraph)
Se l'utente richiede di tracciare un grafico (es. per illustrare l'Anomalia di Belady o le prestazioni degli algoritmi), utilizza il componente standardizzato **`KatchGraph`** piuttosto che disegnare assi e linee a mano in P5.js.

1. **Creazione (nel resetAnim)**:
   ```javascript
   p.mioGrafico = factory.createGraph("id", originX, originY, widthX, heightY, "Etichetta X", "Etichetta Y", 
       { min: 0, max: 10, step: 1 },  // Ticks X
       { min: 0, max: 20, step: 2 }   // Ticks Y
   );
   ```

2. **Definizione dei Punti**:
   Aggiungi un array di oggetti in `p.mioGrafico.points`. Il formato atteso per i punti è:
   `{ xVal: numero, yVal: numero, alpha: 0, r, g, b, lineAlpha: 0, drawX, drawY, isAnomaly }`

   *Importante*: `drawX` e `drawY` vengono interpolati con GSAP per tracciare progressivamente la linea tra un punto e il precedente.
   Usa il metodo `getCoords(xVal, yVal)` fornito da `KatchGraph` per ottenere le coordinate fisiche (pixel) esatte a cui un punto logico corrisponde sul canvas:
   ```javascript
   p.mioGrafico.points.forEach((pt, index) => {
      let coords = p.mioGrafico.getCoords(pt.xVal, pt.yVal);
      // Da usare in setup per allineare pt.drawX = coords.x del punto precedente
   });
   ```

3. **Disegno (nel blocco draw)**:
   Richiama semplicemente: `factory.drawGraph(p.mioGrafico);`
