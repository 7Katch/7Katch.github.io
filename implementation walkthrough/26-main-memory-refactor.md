# Main Memory Refactor

Questo walkthrough documenta le modifiche apportate alla pagina **07-main-memory.html** e al framework di animazione `animation.js` per migliorare la componente visuale e strutturale del capitolo sulla Main Memory.

## Interventi su 07-main-memory.html

1. **Aggiunta Diagramma Mermaid (Address Binding)**
   È stato inserito un diagramma in Mermaid (stile `LR`) nel blocco di *Background* per mostrare la gerarchia della memoria: `Disco -> RAM -> Cache -> CPU`. Sono state applicate classi personalizzate al flowchart per allinearlo al design system (colori neon, bordi tratteggiati per lo storage).
   
2. **Refactoring Strutturale Sezioni (Frammentazione e Spazio di Indirizzamento)**
   - La precedente sezione intitolata "Frammentazione Interna" è stata rinominata e corretta logicamente in **"Spazio di Indirizzamento"** poiché conteneva informazioni su User Space, Kernel Space e indirizzi virtuali.
   - La sezione che parlava di Frammentazione Esterna è stata ampliata e rinominata in **"Frammentazione Interna ed Esterna"**, in modo da contenere la spiegazione teorica di entrambe, compresa la regola del 50% e la compattazione.

3. **Animazione P5.js per la Frammentazione Interna**
   A corredo della spiegazione, è stata creata una *KatchMatrix* 1x4 (un array monodimensionale) in P5.js per simulare visivamente una pagina da 8 KB. L'esempio è stato parametrato in modo che un processo occupi 6 KB (3 blocchi da 2 KB in verde) sprecando 2 KB interni al blocco assegnato (ultimo blocco in rosso).

4. **Animazione Traduzione Indirizzi (Paginazione)**
   Sfruttando la logica di `KatchSimulation` e `AnimFactory`, abbiamo aggiunto un'animazione a loop infinito subito sotto il terminal-card per mostrare la traduzione fisica tra *Memoria Logica*, *Page Table*, e *Memoria Fisica*. Le tre matrici (verticali a 1 sola colonna) si evidenziano dinamicamente in verde (KatchKit Teal) tramite un sequenziatore GSAP, tracciando passo per passo dove risiedono in memoria le Pagine logiche (da P0 a P3).

5. **Animazione P5.js per la Frammentazione Interna ed Esterna**
   A corredo della spiegazione, sono state create animazioni P5.js per simulare visivamente:
   - La *Frammentazione Interna* (tramite KatchMatrix 1x4) con calcolo visivo dello spreco.
   - La *Frammentazione Esterna* (tramite KatchMatrix 1x3) per la regola del 50%.
   - **Novità Layout System**: È stato implementato un sistema di layout (`factory.layoutRow`) che calcola dinamicamente le coordinate (stile *flex-row*) senza *magic numbers*. Inoltre, le matrici ora supportano l'opzione `cellW = 'auto'` per espandersi in base al testo contenuto, e il colore di sfondo delle celle (`bgColor`) è pienamente animabile con le tinte di `KatchColors`.

## Aggiornamento del Framework P5.js / AnimFactory

Per consentire l'utilizzo della classe `KatchMatrix` per semplici diagrammi testuali senza arrotondamenti matematici forzati (che avrebbero reso `"2 KB"` come `NaN`), è stato apportato il seguente fix a `/shared/animation.js`:
- Il metodo `AnimFactory.drawMatrix` ora verifica il tipo del valore presente in `cell.val`. L'arrotondamento matematico (`Math.round`) viene eseguito solo se il valore è di tipo `number`. I tipi `string` (come le diciture delle partizioni di memoria) vengono renderizzati intatti.

Inoltre, per abilitare l'interazione spaziale tra i diagrammi, ogni cella restituita da `KatchMatrix` espone ora gli ancoraggi dinamici (come in `KatchEntity`):
- `dx` (centro-destra)
- `sx` (centro-sinistra)
- `top` (centro-alto)
- `bottom` (centro-basso)
- `cx` (centro esatto)
Questo permette di collegare specifiche celle di matrici con altri elementi tramite `factory.drawArrowBetween(matrix.getCell(0,1).dx, entity.sx)`.

## Architettura e Modelli di Progetto Riservati
Le modifiche hanno rispettato l'obiettivo del *Low Coupling e High Cohesion*: non abbiamo introdotto nuove funzioni personalizzate di disegno matrice all'interno dell'HTML, ma abbiamo invece esteso dinamicamente le capacità della factory generalizzata in modo da mantenere coerente il pattern riutilizzabile. L'istanziamento di `P5.js` è stato inoltre standardizzato caricando gli script senza modulo ES6 in linea con le pagine precedenti.
