# Fix Design Punta della Freccia (Arrow Head)

## Problema
Nelle animazioni GSAP e P5.js, il corpo della linea delle frecce (es. da un processo a una risorsa) si sovrapponeva visivamente alla punta del triangolo dell'arrow head, estendendosi oltre a causa dello spessore della linea (`strokeWeight(3)`) e dell'assenza di limitazione della lunghezza. Questo generava un design "piatto" o "sporco" in cui la freccia non terminava esattamente con una punta acuta.
Inoltre la vecchia logica della freccia gestiva la direzione del triangolo usando un semplice `Math.sign(x2 - x1)`, funzionando unicamente per frecce orizzontali in 2D e non per angoli arbitrari.

## Soluzione
All'interno del modulo centrale `shared/animation.js`, abbiamo riscritto l'implementazione del metodo `drawArrow()` introducendo un calcolo vettoriale robusto:

1. **Rotazione Flessibile**: La funzione adesso utilizza `p.atan2(y2 - y1, x2 - x1)` e `p.rotate(angle)` per permettere il rendering delle frecce con qualsiasi inclinazione e orientamento in un piano 2D.
2. **Ritrazione Dinamica del Corpo (Stroke Shrink)**: È stata implementata una misurazione della distanza tra l'inizio (`x1, y1`) e la fine della freccia (`x2, y2`) con `p.dist`. La retta viene ora tracciata decurtando appositamente un valore proporzionale alla testa del triangolo (`dist - headSize * 1.5`), in questo modo la linea si ferma *prima* della punta acuta, nascondendo completamente l'attaccatura quadrata dello stroke dentro la pancia del triangolo e preservandone l'eleganza estetica.
3. **Miglioramento dell'estetica generale**: Tutte le animazioni basate sulle code, CPU Scheduling e Semafori che fanno uso dell'elemento `AnimFactory.drawArrow()` e `.drawArrowBetween()` beneficeranno istantaneamente di questa miglioria.
