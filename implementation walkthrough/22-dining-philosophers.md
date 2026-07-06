# Implementazione Animazione Cinque Filosofi

## Obiettivo
Illustrare visivamente il celebre problema dei 5 filosofi a cena utilizzando le primitive del nostro `KatchSimulation` e il motore GSAP + P5.js per mostrare in tempo reale la condizione di *deadlock*.

## Modifiche
- Aggiunto il contenitore `div#philosophers-example-animation` nel file `05-sincronizzazione.html`, accostato da un pulsante interattivo "Simula Deadlock".
- Nel blocco `<script>` del file, inizializzata una nuova istanza di `KatchSimulation` con:
  - Un layout circolare in cui 5 filosofi (`P0...P4`) sono disposti ad angolo equidistante attorno al centro (raggio 160).
  - 5 bacchette/forchette (`F0...F4`) poste a metà strada (angolo sfalsato) tra ogni coppia di filosofi.
  - Implementazione del rendering dei processi sovrapponendo i nodi alle frecce per nascondere i vettori sotto di essi.
- Programmazione della GSAP `timeline` per mostrare l'algoritmo *naïve* del deadlock:
  1. Tutti i filosofi estendono contemporaneamente una freccia verso la loro bacchetta sinistra (colorandosi in `KatchColors.amber`).
  2. Viene introdotta una breve pausa di *hold*.
  3. Tutti i filosofi tentano poi di acquisire la rispettiva bacchetta destra con una freccia rossa, ma trovano la risorsa già bloccata dal filosofo vicino.
  4. La transizione si chiude ricolorando tutti i nodi di rosso (`KatchColors.red`) per indicare la condizione di **deadlock circolare**. Allo stesso momento compare drammaticamente a schermo intero la scritta "DEADLOCK" rossa in dissolvenza (fade-in in grande) per poi svanire lentamente sfumando.

## Refactoring e Clean Code
Per evitare l'uso di "Magic Strings" poco intuitive nella creazione delle entità, abbiamo sostituito l'utilizzo diretto di `"P"` e `"F"` con l'enumeratore costante `EntityPrefix` (`PHILOSOPHER: "P"`, `FORK: "F"`), migliorando la leggibilità e la semantica del codice.
