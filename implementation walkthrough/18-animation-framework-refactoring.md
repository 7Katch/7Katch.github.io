# Refactoring Animation Framework (P5.js + GSAP)

## Obiettivo
Ridurre lo spreco di token, il codice boilerplate, l'hardcoding visivo, e implementare il pattern Factory e Singleton per una migliore organizzazione architetturale nel canvas (aderendo al Low Coupling e Information Expert).

## Modifiche
1. **`shared/animation.js`**
   - Aggiunta in coda la classe `AnimFactory` (Factory pattern) responsabile di instanziare i disegni degli elementi standard come processi CPU, code d'attesa e logica visuale scanner.
   - Aggiunta la classe wrapper `KatchSimulation` che incapsula la configurazione base di P5.js, la chiamata a `p.noLoop()` per preservare i consumi CPU e il listener all'aggiornamento del `gsap.ticker.add`.
2. **`04-cpu-scheduling.html`**
   - Abbiamo effettuato il refactoring integrale degli sketch per tutti gli algoritmi (FCFS, SJF, RR, Priority, MLQ) sostituendo il costrutto procedurale basato su `let sketch = function(p) {...}` con le istanze `new KatchSimulation(...)`.
   - Il `draw` loop è diventato più astratto affidandosi alle callback della `AnimFactory`, diminuendo drasticamente l'hardcoding (come i pixel delle posizioni x/y espliciti di interfacce o le forme e testi ricalcolati proceduralmente in ogni pagina).

## Vantaggi
- Migliore pulizia del codice e adesione GRASP e MVC.
- Nessun peggioramento delle performance perché continua la regola di passività del rendering.
- Maggior coerenza visiva: cambiando una coordinata od offset su `AnimFactory` il sito aggiorna globalmente l'esperienza UI.
