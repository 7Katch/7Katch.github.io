# Aggiornamento TIMING Animazioni

## Modifiche Effettuate
- Aggiunta la costante `TIMING` nel framework di animazione all'interno di `shared/animation.js` per standardizzare le velocità delle animazioni. Le velocità dichiarate sono:
  - `FAST`: 0.2
  - `NORMAL`: 0.4
  - `SLOW`: 0.6
- Sostituiti i valori hardcoded `0.2` e `0.4` nel file `SO/argomenti/07-main-memory.html` con `TIMING.FAST` e `TIMING.NORMAL` nelle chiamate all'animazione GSAP.

## Pattern Architetturali e Principi
- **Information Expert e Low Coupling**: Invece di avere i valori temporali delle animazioni hardcoded e sparsi nei vari file HTML (alto accoppiamento e vulnerabilità ai cambiamenti), li abbiamo estratti e centralizzati in `shared/animation.js`. In questo modo la singola fonte di verità (Information Expert) per i token del design delle animazioni risiede in un unico punto, diminuendo l'accoppiamento dei componenti visuali con dettagli implementativi grezzi.
- **No Hardcoded Code**: Abbiamo eliminato i "magic numbers" (`0.2` e `0.4`) rimpiazzandoli con costanti ben nominate (`TIMING.FAST`, `TIMING.NORMAL`).
