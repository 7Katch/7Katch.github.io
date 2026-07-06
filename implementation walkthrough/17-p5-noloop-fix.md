# Walkthrough: Fix CPU Consumption in P5.js Animations

## Modifiche effettuate
- Modificato il file `SO/argomenti/04-cpu-scheduling.html` per limitare il consumo di CPU e batteria da parte delle tre istanze p5.js (`sketchRR`, `sketchPriority`, `sketchMLQ`).
- All'interno della funzione `p.setup()` di ogni istanza, è stato aggiunto il comando `p.noLoop()` per fermare l'esecuzione continua e non necessaria della funzione `draw()` a 60 fps.
- Per mantenere la compatibilità con le animazioni GSAP (che modificano i valori degli oggetti in background in modo asincrono), è stata aggiunta la riga `gsap.ticker.add(() => p.redraw());` in ogni `p.setup()`. 

## Risultato
Il global ticker di GSAP ora gestisce in automatico le chiamate a `p.redraw()`. Dato che il ticker di GSAP va automaticamente in "sleep" (si addormenta) quando non ci sono animazioni in corso, i tre canvas di P5 vengono renderizzati *solo* quando effettivamente serve. Questo elimina lo spreco di risorse (CPU/GPU) pur preservando la fluidità delle simulazioni interattive.
