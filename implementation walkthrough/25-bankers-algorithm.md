# Implementazione Animazioni Algoritmo del Banchiere

## Obiettivo
Aggiungere due simulazioni interattive e dinamiche in `06-deadlocks.html` per mostrare visivamente (in stile *Manim*) l'esecuzione del Safety Algorithm, sia in un caso di successo (Stato Sicuro) che in un caso di potenziale Deadlock (Stato Insicuro).

## Modifiche effettuate

### 1. `shared/animation.js`
In ottica **GRASP** e seguendo il **Factory Pattern** (come richiesto per evitare codice *hardcoded* o disordinato), abbiamo esteso il modulo condiviso di animazione:
- Creata la classe `KatchMatrix`: incapsula la logica strutturale di una matrice (headers di colonna, di riga, celle) e trasforma i dati numerici "grezzi" in un array di oggetti P5/GSAP-friendly, permettendo di animare dinamicamente i valori numerici.
- Creati i metodi `factory.createMatrix()` e `factory.drawMatrix(mat)` dentro `AnimFactory` per delegare l'effettivo rendering grafico della griglia e del testo sul Canvas.

### 2. `06-deadlocks.html`
- Aggiunti due div (`#banker-safe-anim` e `#banker-unsafe-anim`) corredati di due bottoni ("Simula Stato Sicuro" e "Simula Stato Insicuro") per richiamare le animazioni.
- Importato GSAP e P5.js.
- Nel fondo del file, implementato il ciclo di simulazione animata:
  - Vengono disegnate le 4 componenti principali come da richiesta utente: **Max**, **Allocation**, **Need**, e il vettore globale **Available** in alto a destra.
  - Sfruttando le potenti interpolazioni GSAP (`roundProps: "val"`), l'aggiornamento del vettore `Available` avviene in maniera fluida, sommando i valori dell'`Allocation` riga per riga quando il processo passa il check `Need <= Available`.
  - Lo *scanner* illumina la riga attiva:
    - Verde (`teal`): Il processo passa, ottiene le risorse e viene "barrato".
    - Rosso (`red`): Il processo viene saltato.
  - **Stato Safe**: Animata la sequenza sicura completa (P1, P3, P4, P0, P2), mostrando il messaggio finale `STATO SAFE`.
  - **Stato Unsafe**: Generata una situazione in cui l'`Available` iniziale è `[0,0,0]`, rendendo impossibile soddisfare alcuna richiesta. Lo scanner passa su tutti mostrando esito negativo e culmina nel drammatico messaggio `STATO UNSAFE (DEADLOCK POSSIBILE)`.
