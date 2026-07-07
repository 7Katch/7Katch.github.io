# Diagramma del Virtual Address Space

## Modifiche Effettuate
- Sostituita l'importazione passiva dell'immagine e ripristinata la libreria `animation.js` e GSAP.
- Inserita una `KatchSimulation` senza animazioni (`p.onAnimStart` vuoto) che si occupa *esclusivamente* di ridisegnare da codice la matrice illustrata nel file `img2.png` (Stack, Hole, Heap, Data, Text con frecce interne e label).
- Questo previene l'utilizzo del "copia-incolla" di un'immagine `png`, renderizzando nativamente nel canvas con la palette richiesta.

## Pattern Architetturali e Principi
- **Nessuna dipendenza da asset statici ("No Hardcoded Image")**: Seguendo la richiesta utente, abbiamo evitato di utilizzare l'immagine png precalcolata. Abbiamo sfruttato le potenzialità di p5.js e l'infrastruttura di `KatchSimulation` per tracciare a livello vettoriale la struttura della matrice, mantenendo il codice pulito e consistente.
