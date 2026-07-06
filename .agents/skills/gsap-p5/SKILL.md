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
