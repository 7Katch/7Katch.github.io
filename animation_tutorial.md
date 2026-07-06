# Tutorial Framework Animazioni (P5.js + GSAP)

Questo documento illustra le linee guida e il funzionamento del framework di animazioni `KatchSimulation` implementato all'interno di `shared/animation.js`. Il framework unisce le potenzialità di **P5.js** per il rendering al motore **GSAP** per l'interpolazione, assicurando performance ottimali (passive rendering) e consistenza visiva tramite la `AnimFactory`.

## 1. Principi Fondamentali

1. **Passive Rendering**: Evitiamo l'uso del `p.draw()` loop infinito nativo di P5.js. Utilizziamo invece `p.noLoop()` associato a `gsap.ticker.add(() => p.redraw())`. Questo riduce al minimo l'uso della CPU limitando i draw call solo a quando c'è effettivamente un'animazione in corso.
2. **Factory Pattern (Low Coupling)**: Ogni entità visiva standard (CPU, Processi, Code, Frecce) è demandata alla `AnimFactory`, evitando hardcoding negli script HTML.
3. **Singleton Color Palette**: Uso esclusivo dell'oggetto `KatchColors` per palette omogenea e coerente (Cyberpunk style: Amber, Teal, Pink, Slate).

---

## 2. Palette Colori Base (`KatchColors`)

La palette di base globale è incapsulata nell'oggetto `KatchColors`. Usa sempre questi array per i canali RGB:
```javascript
const KatchColors = {
  slate: [148, 163, 184], // Grigio bluastro (Processi standard in attesa)
  teal:  [34, 211, 238],  // Azzurro neon (Code d'attesa)
  amber: [251, 191, 36],  // Giallo/Ambra (CPU, esecuzioni in corso)
  pink:  [236, 72, 153],  // Rosa neon (Highlight, Scanner)
  bg:    [10, 10, 20]     // Sfondo principale del Canvas
};
```

---

## 3. Uso di `KatchSimulation`

`KatchSimulation` funge da incapsulatore. Evita il boiler-plate dell'inizializzazione standard di P5 in "Instance Mode".

### Sintassi
```javascript
let instNome = new KatchSimulation(
  'html-container-id', 
  width, 
  height, 
  (p, factory) => { 
    // SETUP function: qui dichiari e resetti le variabili
  },
  (p, factory) => { 
    // DRAW function: qui invochi i metodi della factory per disegnare
  }
);
```

### Event Hooks
Il wrapper ti espone due property fondamentali che puoi (e devi) assegnare per gestire il comportamento Start/Reset:
- `instNome.onAnimReset = (p) => { ... }`: Hook eseguito per killare i tween (`gsap.killTweensOf(...)`) e resettare le coordinate.
- `instNome.onAnimStart = (p) => { ... }`: Hook eseguito all'avvio. Ricordati sempre di invocare qui dentro il reset e definire le `gsap.timeline()`.

### Global Hooks per HTML
Le funzioni che vengono chiamate dai pulsanti (es: `<button onclick="animStart()">`) dovranno essere reindirizzate verso l'istanza:
```javascript
function animStart() { instNome.animStart(); }
function animReset() { instNome.animReset(); }
```

---

## 4. AnimFactory (Disegno degli Elementi)

All'interno della funzione `drawFn`, hai a disposizione il parametro `factory` (istanza di `AnimFactory`). 

### `factory.drawCPU(x, y, label, w = 160, h = 120, labelOffset = -40)`
Disegna una CPU color ambra. Usa `p.rectMode(CENTER)`.
```javascript
factory.drawCPU(p.cpu.x, p.cpu.y, "CPU");
```

### `factory.drawQueue(x, y, w, h, label, labelOffset = -70)`
Disegna una scatola con bordi `Teal` rappresentante una coda. Usa `p.rectMode(CORNER)`.
```javascript
factory.drawQueue(p.readyQueue.x, p.readyQueue.y, 300, 100, "READY QUEUE");
```

### `factory.drawProcess(pr, drawExtra)`
Prende in ingresso l'oggetto processo (`pr`). Le proprietà che legge da `pr` sono:
- `pr.x`, `pr.y`, `pr.w`: Coordinate standard.
- `pr.h` (default 60): Altezza.
- `pr.r`, `pr.g`, `pr.b`, `pr.alpha`: Colore primario e trasparenza (usati per sfumature GSAP).
- `pr.id`, `pr.timeLeft`: Testi renderizzati all'interno e sotto al box.
- `pr.labelOffset`, `pr.timeOffset`: Spostamento custom dei testi rispetto al `y` di base.

Il secondo parametro opzionale `drawExtra(p, pObj)` è una callback utile se devi renderizzare testi aggiuntivi nel processo (es: numero di priorità):
```javascript
factory.drawProcess(p.p1, (p, pObj) => {
    p.textSize(10);
    p.text("Priority: " + pObj.pri, pObj.x, pObj.y + 7);
});
```

### `factory.drawArrow(x1, y1, x2, y2, headSize = 5)`
Disegna una freccia bianca con bassa opacità.
```javascript
factory.drawArrow(360, 150, 560, 150);
```

### `factory.drawScanner(scannerObj, color = KatchColors.teal)`
Disegna un riquadro (scanner vuoto) tipicamente usato negli algoritmi per mostrare visivamente una comparazione (come in SJF). Lo `scannerObj` dev'essere opaco solo durante l'animazione (`alpha`). Supporta:
- `scannerObj.strokeWeight` (spessore, def. 2)
- `scannerObj.center` (boolean, se true disegna col rectMode CENTER invece che CORNER).

### `factory.createMatrix(id, x, y, title, colHeaders, rowHeaders, data, cellW, cellH)`
Crea e restituisce un'istanza di `KatchMatrix`, convertendo una normale array 2D di numeri (es. `[[1,2], [3,4]]`) in oggetti GSAP-animable. Restituisce la matrice che poi puoi conservare (es. in `p.matrix`).
```javascript
p.myMatrix = factory.createMatrix('Mat1', 100, 100, 'Allocation', ['A','B','C'], ['P0','P1'], [[0,1,0], [2,0,0]]);
```

### `factory.drawMatrix(mat)`
Disegna l'istanza `KatchMatrix` (testi, headers, griglia leggera) a schermo. Tutti i colori e dimensioni delle singole celle sono renderizzati reattivamente in base alle loro attuali proprietà.

### Helper per Animazioni Matrici e Scanner
Per evitare lunghi e complessi loop `for` nei tuoi script di simulazione (es. Algoritmo del Banchiere), usa i metodi nativi della factory per accodare animazioni alla Timeline GSAP:
- `factory.animMatrixRowStyle(tl, matrix, rowIndex, { color, scale, alpha }, duration, position)`: Cambia visivamente lo stile di tutti gli elementi in una singola riga.
- `factory.animMatrixRowAdd(tl, sourceArr, targetMatrix, targetRowIndex, duration, position)`: Aggiorna dinamicamente in stile "contatore" (tramite `roundProps: "val"`) i numeri in una riga bersaglio sommandovi un array sorgente.
- `factory.animScannerMove(tl, scanner, targetY, duration, position)`: Muove fluidamente un oggetto scanner.
- `factory.animScannerColor(tl, scanner, color, duration, position)`: Cambia il colore dello scanner in un flash (es. rosso/verde).

---

## 5. Esempio Base Completo

```javascript
let instDemo = new KatchSimulation('demo-container', 800, 300, 
  (p, factory) => {
    p.cpu = { x: 600, y: 150 };
    p.resetVars = () => {
      p.proc = { id: "P1", timeLeft: 3.0, w: 70, x: 100, y: 150, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2], alpha: 255 };
    };
    p.resetVars();
  },
  (p, factory) => {
    factory.drawCPU(p.cpu.x, p.cpu.y, "CPU");
    factory.drawProcess(p.proc);
  }
);

instDemo.onAnimReset = (p) => {
  gsap.killTweensOf(p.proc);
  p.resetVars();
};

instDemo.onAnimStart = (p) => {
  instDemo.onAnimReset(p); // Reset safety
  let tl = gsap.timeline();
  tl.to(p.proc, { 
    x: p.cpu.x, 
    r: KatchColors.amber[0], g: KatchColors.amber[1], b: KatchColors.amber[2], 
    duration: 1, ease: "power2.inOut" 
  })
  .to(p.proc, { timeLeft: 0, duration: 1, ease: "linear" })
  .to(p.proc, { alpha: 0, duration: 0.5 });
};

function startDemo() { instDemo.animStart(); }
function resetDemo() { instDemo.animReset(); }
```
