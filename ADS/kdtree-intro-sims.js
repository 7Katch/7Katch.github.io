/* ==========================================================================
   kd-tree da Zero: Fondamenti & Intuizione Visiva
   Framework: KatchSimulation + AnimFactory (shared/animation.js)
   Pattern: Passive Rendering + GSAP Timeline
   ========================================================================== */

const KDI_W = 1000;
const KDI_H = 430;
const KDI_MARGIN = 28;

// --- Helper riusabili delegati alla libreria comune shared/animation.js ---
const kdiCaption = (tl, cap, text, pos = '>', hold = 2.2) => AnimFactory.prototype.animCaption(tl, cap, text, pos, hold);
const kdiDrawCaption = (p, cap) => AnimFactory.prototype.drawCaption.call({ p }, cap);
const kdiLabel = (p, txt, x, y, col = KatchColors.slate, size = 12, align = 'LEFT', alpha = 255) => 
  AnimFactory.prototype.drawLabel.call({ p }, txt, x, y, { col, size, align, alpha });
const kdiMakeSim = (containerId, resetFn, drawFn, timelineFn) => 
  KatchSimulation.create(containerId, KDI_W, KDI_H, resetFn, drawFn, timelineFn);


/* ==========================================================================
   SIMULAZIONE 1: Il Fallimento del BST 1D su dati Multi-dimensionali
   Mostra che ordinare solo su X o solo su Y rende cieca la ricerca sull'altro asse.
   ========================================================================== */
const RAW_POINTS_1D = [
  { id: 'A', x: 20, y: 80 },
  { id: 'B', x: 35, y: 25 },
  { id: 'C', x: 50, y: 70 },
  { id: 'D', x: 65, y: 15 },
  { id: 'E', x: 80, y: 85 },
  { id: 'F', x: 90, y: 40 }
];

const simFail1D = kdiMakeSim('sim-fail-1d',
  (p) => {
    const s = 280;
    p.L = { x: 30, y: 24, s };
    p.X = v => p.L.x + (v / 100) * s;
    p.Y = v => p.L.y + s - (v / 100) * s;

    p.pts = RAW_POINTS_1D.map(pt => ({
      ...pt,
      r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2],
      alpha: 255, size: 10
    }));

    // Barra 1D ordinata solo per X
    p.barX = { x: 350, y: 120, w: 600, h: 36 };
    // Scanner per mostrare la query
    p.scanner = { x: p.barX.x, y: p.barX.y, w: 90, h: 42, alpha: 0 };
    p.queryBox = { x0: 30, x1: 70, y0: 60, y1: 95, alpha: 0 };
    p.status = { inspected: 0, matches: 0 };
  },
  (p, f) => {
    const { L, barX, queryBox } = p;
    // Piano Cartesiano
    p.stroke(255, 35); p.strokeWeight(1); p.noFill(); p.rectMode(p.CORNER);
    p.rect(L.x, L.y, L.s, L.s, 4);
    kdiLabel(p, 'Coordinata X →', L.x + L.s - 85, L.y + L.s + 15, KatchColors.slate);
    kdiLabel(p, '↑ Y', L.x - 5, L.y - 12, KatchColors.slate);

    // Box della query desiderata (Età 30..70 e Stipendio 60..95)
    if (queryBox.alpha > 0) {
      const qx = p.X(queryBox.x0), qy = p.Y(queryBox.y1);
      const qw = p.X(queryBox.x1) - qx, qh = p.Y(queryBox.y0) - qy;
      p.stroke(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], queryBox.alpha);
      p.strokeWeight(2);
      p.fill(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], queryBox.alpha * 0.15);
      p.rect(qx, qy, qw, qh, 4);
      kdiLabel(p, 'Target (X ∈ [30,70], Y ∈ [60,95])', qx + 8, qy - 10, KatchColors.amber, 11, 'LEFT', queryBox.alpha);
    }

    // Punti nel piano cartesiano
    p.pts.forEach(pt => {
      p.noStroke();
      p.fill(pt.r, pt.g, pt.b, pt.alpha);
      p.circle(p.X(pt.x), p.Y(pt.y), pt.size);
      kdiLabel(p, `${pt.id}(${pt.x},${pt.y})`, p.X(pt.x) + 9, p.Y(pt.y) - 6, [pt.r, pt.g, pt.b], 10, 'LEFT', pt.alpha);
    });

    // Sezione destra: BST 1D ordinato per sola coordinata X
    kdiLabel(p, 'BST 1D: Indicizzato SOLO su coordinata X', barX.x, barX.y - 45, KatchColors.teal, 13);
    kdiLabel(p, 'I punti sono ordinati lungo un unico asse orizzontale:', barX.x, barX.y - 25, KatchColors.slate, 11);

    p.stroke(255, 30); p.strokeWeight(1); p.noFill();
    p.rect(barX.x, barX.y, barX.w, barX.h, 6);

    // Tacche dei punti ordinati per X
    const sorted = [...p.pts].sort((a, b) => a.x - b.x);
    sorted.forEach((pt, i) => {
      const px = barX.x + (i + 0.5) * (barX.w / sorted.length);
      p.stroke(pt.r, pt.g, pt.b, pt.alpha);
      p.strokeWeight(2);
      p.line(px, barX.y + 4, px, barX.y + barX.h - 4);
      kdiLabel(p, pt.id, px, barX.y + barX.h + 14, [pt.r, pt.g, pt.b], 11, 'CENTER', pt.alpha);
      kdiLabel(p, `x=${pt.x}`, px, barX.y - 10, KatchColors.slate, 9, 'CENTER', pt.alpha);
    });

    // Scanner
    if (p.scanner.alpha > 0) {
      p.stroke(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], p.scanner.alpha);
      p.strokeWeight(2); p.noFill();
      p.rect(p.scanner.x, p.scanner.y - 2, p.scanner.w, p.scanner.h + 4, 4);
    }

    // Risultati statistici
    kdiLabel(p, `Punti filtrati da X: ${p.status.inspected}`, barX.x, barX.y + 105, KatchColors.amber, 13);
    kdiLabel(p, `Punti validi su ENTRAMBI (X e Y): ${p.status.matches}`, barX.x, barX.y + 130, KatchColors.green, 13);
    kdiLabel(p, `Problema: Il BST su X non sa nulla di Y → spreco di controlli!`, barX.x, barX.y + 160, KatchColors.red || [239, 68, 68], 11);
  },
  (p, f, tl) => {
    kdiCaption(tl, p.cap, 'Immagina di voler trovare punti con X tra 30..70 e Y tra 60..95');
    tl.to(p.queryBox, { alpha: 255, duration: 0.6 });

    kdiCaption(tl, p.cap, 'Un normale indice 1D ordina i punti solo in base a X (A < B < C < D < E < F)');
    const sorted = [...p.pts].sort((a, b) => a.x - b.x);

    // Mostra scansione nell'intervallo X: B (35), C (50), D (65)
    tl.set(p.scanner, { x: p.barX.x + 1 * (p.barX.w / 6) - 4, y: p.barX.y, w: p.barX.w / 6 + 8, alpha: 255 });

    kdiCaption(tl, p.cap, '1) Punto B (x=35): cade dentro il range X, ma Y=25 è fuori! Scartato.');
    const ptB = p.pts.find(x => x.id === 'B');
    tl.to(ptB, { r: KatchColors.red[0], g: KatchColors.red[1], b: KatchColors.red[2], size: 14, duration: 0.4 })
      .to(p.status, { inspected: 1, duration: 0.2 }, '<');

    kdiCaption(tl, p.cap, '2) Punto C (x=50): X è valido e Y=70 è valido! Trovato MATCH.');
    const ptC = p.pts.find(x => x.id === 'C');
    tl.to(p.scanner, { x: p.barX.x + 2 * (p.barX.w / 6) - 4, duration: 0.6, ease: 'power2.inOut' })
      .to(ptC, { r: KatchColors.green[0], g: KatchColors.green[1], b: KatchColors.green[2], size: 16, duration: 0.4 })
      .to(p.status, { inspected: 2, matches: 1, duration: 0.2 }, '<');

    kdiCaption(tl, p.cap, '3) Punto D (x=65): X è valido, ma Y=15 è lontanissimo! Scartato.');
    const ptD = p.pts.find(x => x.id === 'D');
    tl.to(p.scanner, { x: p.barX.x + 3 * (p.barX.w / 6) - 4, duration: 0.6, ease: 'power2.inOut' })
      .to(ptD, { r: KatchColors.red[0], g: KatchColors.red[1], b: KatchColors.red[2], size: 14, duration: 0.4 })
      .to(p.status, { inspected: 3, duration: 0.2 }, '<');

    kdiCaption(tl, p.cap, 'CONCLUSIONE: Un albero 1D costringe a scansionare falsi positivi. Serve il kd-tree!');
  }
);

/* ==========================================================================
   SIMULAZIONE 2: Costruzione Passo-Passo del kd-tree 2D (Alternanza X/Y)
   Mostra la suddivisione geometrica dello spazio sincronizzata con i nodi dell'albero.
   ========================================================================== */
const KD_TUTORIAL_PTS = [
  { id: 'P1', x: 0.25, y: 0.45 },
  { id: 'P2', x: 0.50, y: 0.70 },
  { id: 'P3', x: 0.75, y: 0.25 },
  { id: 'P4', x: 0.15, y: 0.80 },
  { id: 'P5', x: 0.35, y: 0.20 },
  { id: 'P6', x: 0.85, y: 0.75 }
];

const simBuild2D = kdiMakeSim('sim-build-2d',
  (p) => {
    const s = 280;
    p.L = { x: 30, y: 24, s };
    p.X = v => p.L.x + v * s;
    p.Y = v => p.L.y + s - v * s;

    p.pts = KD_TUTORIAL_PTS.map(pt => ({
      ...pt,
      r: KatchColors.teal[0], g: KatchColors.teal[1], b: KatchColors.teal[2],
      alpha: 255, size: 12
    }));

    // Definizione dei 3 tagli:
    // 1. Livello 0: Taglio X a x=0.42 (Divide sinistra e destra)
    // 2. Livello 1a (sinistra): Taglio Y a y=0.45
    // 3. Livello 1b (destra): Taglio Y a y=0.50
    p.lines = [
      { id: 'L1', dim: 'X', val: 0.42, r: { x0: 0, x1: 1, y0: 0, y1: 1 }, progress: 0, alpha: 0, label: 'x = 0.42' },
      { id: 'L2', dim: 'Y', val: 0.45, r: { x0: 0, x1: 0.42, y0: 0, y1: 1 }, progress: 0, alpha: 0, label: 'y = 0.45' },
      { id: 'L3', dim: 'Y', val: 0.50, r: { x0: 0.42, x1: 1, y0: 0, y1: 1 }, progress: 0, alpha: 0, label: 'y = 0.50' }
    ];

    // Nodi dell'albero a destra con spaziatura orizzontale generosa
    const tx = 660;
    p.treeNodes = [
      { id: 'N0', text: '⟨X, 0.42⟩', x: tx, y: 65, alpha: 0, dim: 'X' },
      { id: 'N1', text: '⟨Y, 0.45⟩', x: tx - 120, y: 145, alpha: 0, dim: 'Y', parent: 0 },
      { id: 'N2', text: '⟨Y, 0.50⟩', x: tx + 120, y: 145, alpha: 0, dim: 'Y', parent: 0 },
      { id: 'Lf1', text: 'P4', x: tx - 180, y: 225, alpha: 0, leaf: true, parent: 1 },
      { id: 'Lf2', text: 'P1,P5', x: tx - 60, y: 225, alpha: 0, leaf: true, parent: 1 },
      { id: 'Lf3', text: 'P3', x: tx + 60, y: 225, alpha: 0, leaf: true, parent: 2 },
      { id: 'Lf4', text: 'P2,P6', x: tx + 180, y: 225, alpha: 0, leaf: true, parent: 2 }
    ];
  },
  (p, f) => {
    const { L, lines, treeNodes } = p;
    // Piano Cartesiano
    p.stroke(255, 30); p.strokeWeight(1); p.noFill(); p.rectMode(p.CORNER);
    p.rect(L.x, L.y, L.s, L.s, 4);
    kdiLabel(p, 'Spazio 2D continuo', L.x + 8, L.y + 14, KatchColors.slate, 11);
    kdiLabel(p, 'x →', L.x + L.s - 22, L.y + L.s + 15, KatchColors.slate);
    kdiLabel(p, '↑ y', L.x - 5, L.y - 10, KatchColors.slate);

    // Linee di taglio animate
    lines.forEach(line => {
      if (line.alpha <= 0) return;
      const isX = line.dim === 'X';
      const col = isX ? KatchColors.violet : KatchColors.amber;
      p.stroke(col[0], col[1], col[2], line.alpha);
      p.strokeWeight(2.5);

      if (isX) {
        const lx = p.X(line.val);
        const y0 = p.Y(line.r.y0);
        const y1 = p.Y(line.r.y0 + (line.r.y1 - line.r.y0) * line.progress);
        p.line(lx, y0, lx, y1);
        kdiLabel(p, line.label, lx, p.Y(line.r.y1) - 10, col, 10, 'CENTER', line.alpha);
      } else {
        const ly = p.Y(line.val);
        const x0 = p.X(line.r.x0);
        const x1 = p.X(line.r.x0 + (line.r.x1 - line.r.x0) * line.progress);
        p.line(x0, ly, x1, ly);
        kdiLabel(p, line.label, p.X(line.r.x1) + 8, ly, col, 10, 'LEFT', line.alpha);
      }
    });

    // Punti
    p.pts.forEach(pt => {
      p.noStroke();
      p.fill(pt.r, pt.g, pt.b, pt.alpha);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = `rgb(${pt.r},${pt.g},${pt.b})`;
      p.circle(p.X(pt.x), p.Y(pt.y), pt.size);
      p.drawingContext.shadowBlur = 0;
      kdiLabel(p, pt.id, p.X(pt.x) + 9, p.Y(pt.y) - 6, [255, 255, 255], 11, 'LEFT', pt.alpha);
    });

    // Albero a destra
    kdiLabel(p, 'Albero Binario kd-tree corrispondente', 660, 24, KatchColors.teal, 13, 'CENTER');

    // Rami (linee tra genitori e figli)
    treeNodes.forEach(node => {
      if (node.alpha > 0 && node.parent !== undefined) {
        const parent = treeNodes[node.parent];
        p.stroke(255, 255, 255, node.alpha * 0.3); p.strokeWeight(1.5);
        p.line(parent.x, parent.y, node.x, node.y);
      }
    });

    // Nodi interni e foglie
    treeNodes.forEach(node => {
      if (node.alpha <= 0) return;
      p.rectMode(p.CENTER);
      if (node.leaf) {
        p.stroke(KatchColors.green[0], KatchColors.green[1], KatchColors.green[2], node.alpha);
        p.fill(16, 185, 129, node.alpha * 0.2); p.strokeWeight(1.5);
        p.rect(node.x, node.y, 44, 22, 4);
        kdiLabel(p, node.text, node.x, node.y, KatchColors.green, 10, 'CENTER', node.alpha);
      } else {
        const col = node.dim === 'X' ? KatchColors.violet : KatchColors.amber;
        p.stroke(col[0], col[1], col[2], node.alpha);
        p.fill(20, 20, 32, node.alpha); p.strokeWeight(1.5);
        p.rect(node.x, node.y, 76, 26, 6);
        kdiLabel(p, node.text, node.x, node.y, [255, 255, 255], 11, 'CENTER', node.alpha);
      }
    });
  },
  (p, f, tl) => {
    kdiCaption(tl, p.cap, 'Iniziamo con 6 punti nello spazio 2D (coordinate X e Y)');

    kdiCaption(tl, p.cap, 'LIVELLO 0: Taglio su asse X (linea verticale) sulla mediana dei punti');
    tl.to(p.lines[0], { alpha: 255, duration: 0.2 })
      .to(p.lines[0], { progress: 1, duration: 0.7, ease: 'power2.inOut' })
      .to(p.treeNodes[0], { alpha: 255, duration: 0.4 }, '>-0.2');

    kdiCaption(tl, p.cap, 'I punti a sinistra (X < 0.42) vanno nel sottoalbero sinistro; gli altri a destra');
    const leftPts = p.pts.filter(pt => pt.x < 0.42);
    const rightPts = p.pts.filter(pt => pt.x >= 0.42);
    tl.to(leftPts, { r: KatchColors.violet[0], g: KatchColors.violet[1], b: KatchColors.violet[2], duration: 0.4 })
      .to(rightPts, { r: KatchColors.amber[0], g: KatchColors.amber[1], b: KatchColors.amber[2], duration: 0.4 }, '<');

    kdiCaption(tl, p.cap, 'LIVELLO 1: Alterniamo asse! Ora si taglia orizzontalmente sull asse Y');
    tl.to(p.lines[1], { alpha: 255, duration: 0.2 })
      .to(p.lines[1], { progress: 1, duration: 0.6, ease: 'power2.inOut' })
      .to(p.treeNodes[1], { alpha: 255, duration: 0.3 }, '>-0.2')
      .to(p.lines[2], { alpha: 255, duration: 0.2 }, '+=0.2')
      .to(p.lines[2], { progress: 1, duration: 0.6, ease: 'power2.inOut' })
      .to(p.treeNodes[2], { alpha: 255, duration: 0.3 }, '>-0.2');

    kdiCaption(tl, p.cap, 'LIVELLO 2 (Foglie): Ogni cella finale contiene al massimo pochi punti');
    tl.to([p.treeNodes[3], p.treeNodes[4], p.treeNodes[5], p.treeNodes[6]], {
      alpha: 255, duration: 0.5, stagger: 0.1
    });

    kdiCaption(tl, p.cap, 'STRUTTURA COMPLETATA: Ogni livello alterna X → Y → X → Y dividendo geometricamente il piano.');
  }
);

/* ==========================================================================
   SIMULAZIONE 3: Nearest Neighbor Search (1-NN) e il Trucco del Cerchio
   Mostra la discesa nel sottoalbero e il pruning mediante il raggio di tolleranza.
   ========================================================================== */
const simNN = kdiMakeSim('sim-nn-search',
  (p) => {
    const s = 280;
    p.L = { x: 30, y: 24, s };
    p.X = v => p.L.x + v * s;
    p.Y = v => p.L.y + s - v * s;

    p.pts = [
      { id: 'A', x: 0.20, y: 0.70, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: 'B', x: 0.35, y: 0.25, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: 'C', x: 0.70, y: 0.80, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: 'D', x: 0.85, y: 0.30, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] }
    ];

    p.query = { x: 0.80, y: 0.20, alpha: 0 };
    p.splitX = 0.50; // linea spartiacque verticale
    p.circleR = { r: 0, alpha: 0 };
    p.prunedBranch = { alpha: 0 };
  },
  (p, f) => {
    const { L, query, circleR, prunedBranch } = p;
    // Piano
    p.stroke(255, 30); p.strokeWeight(1); p.noFill(); p.rectMode(p.CORNER);
    p.rect(L.x, L.y, L.s, L.s, 4);

    // Iperpiano verticale di split x = 0.50
    p.stroke(KatchColors.violet[0], KatchColors.violet[1], KatchColors.violet[2], 180);
    p.strokeWeight(2);
    p.line(p.X(p.splitX), p.Y(0), p.X(p.splitX), p.Y(1));
    kdiLabel(p, 'Split X = 0.50', p.X(p.splitX), p.Y(1) - 10, KatchColors.violet, 11, 'CENTER');

    // Se l'area sinistra viene potata (pruning), oscuriamola
    if (prunedBranch.alpha > 0) {
      p.noStroke();
      p.fill(239, 68, 68, prunedBranch.alpha * 0.12);
      p.rect(L.x, L.y, p.X(p.splitX) - L.x, L.s);
      kdiLabel(p, '✖ RAMO POTATO (Pruned)', L.x + (p.X(p.splitX) - L.x) / 2, L.y + L.s / 2, KatchColors.red, 13, 'CENTER', prunedBranch.alpha);
    }

    // Punti nel database
    p.pts.forEach(pt => {
      p.noStroke();
      p.fill(pt.r, pt.g, pt.b);
      p.circle(p.X(pt.x), p.Y(pt.y), 12);
      kdiLabel(p, `${pt.id}`, p.X(pt.x) + 10, p.Y(pt.y) - 6, [pt.r, pt.g, pt.b], 11);
    });

    // Cerchio di ricerca attorno alla query
    if (circleR.alpha > 0) {
      p.stroke(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], circleR.alpha);
      p.strokeWeight(2);
      p.fill(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], circleR.alpha * 0.15);
      p.circle(p.X(query.x), p.Y(query.y), circleR.r * 2);
    }

    // Punto Query Q
    if (query.alpha > 0) {
      p.fill(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], query.alpha);
      p.noStroke();
      p.circle(p.X(query.x), p.Y(query.y), 14);
      kdiLabel(p, 'Q (Query)', p.X(query.x) + 11, p.Y(query.y) + 4, KatchColors.amber, 12, 'LEFT', query.alpha);
    }

    // Spiegazione a destra con ampio spazio (650px)
    const rx = 350;
    kdiLabel(p, 'Come funziona il Nearest Neighbor (1-NN):', rx, 48, KatchColors.teal, 13);
    kdiLabel(p, '1. Discesa: Q(x=0.8) > 0.5 → esplora subito il ramo DX.', rx, 85, KatchColors.slate, 11.5);
    kdiLabel(p, '2. Foglia DX: trova candidato D. Distanza iniziale = R.', rx, 115, KatchColors.slate, 11.5);
    kdiLabel(p, '3. Il Test del Cerchio: Disegna una sfera con raggio R.', rx, 145, KatchColors.amber, 11.5);
    kdiLabel(p, '4. La sfera NON attraversa la retta di taglio x=0.50!', rx, 175, KatchColors.green, 11.5);
    kdiLabel(p, '→ NESSUN punto nel ramo SX può essere più vicino di D.', rx, 205, KatchColors.green, 11.5);
    kdiLabel(p, '→ Visita di A e B saltata in O(1): pruning riuscito!', rx, 235, KatchColors.teal, 11.5);
  },
  (p, f, tl) => {
    kdiCaption(tl, p.cap, 'Vogliamo trovare il punto più vicino a Q = (0.80, 0.20)');
    tl.to(p.query, { alpha: 255, duration: 0.5 });

    kdiCaption(tl, p.cap, '1) Confronto con la radice (x = 0.50): Q.x (0.80) >= 0.50 → andiamo a DESTRA');
    tl.to(p.pts[3], { r: KatchColors.teal[0], g: KatchColors.teal[1], b: KatchColors.teal[2], duration: 0.4 });

    kdiCaption(tl, p.cap, '2) Raggiungiamo la foglia D: calcoliamo dist(Q, D). Attuale miglior vicino = D!');
    const distPx = p.dist(p.X(p.query.x), p.Y(p.query.y), p.X(p.pts[3].x), p.Y(p.pts[3].y));
    tl.to(p.circleR, { alpha: 255, duration: 0.3 })
      .to(p.circleR, { r: distPx, duration: 0.8, ease: 'power2.out' })
      .to(p.pts[3], { r: KatchColors.green[0], g: KatchColors.green[1], b: KatchColors.green[2], duration: 0.3 }, '<');

    kdiCaption(tl, p.cap, '3) BACKTRACKING: dobbiamo controllare se c è un punto ancora migliore a SINISTRA?');

    kdiCaption(tl, p.cap, '4) REGOLA D ORO: Il cerchio tocca la linea x=0.50? NO! Distanza alla linea > Raggio');

    kdiCaption(tl, p.cap, '5) POTATURA (Pruning): possiamo ignorare TUTTO il sottoalbero sinistro senza guardarlo!');
    tl.to(p.prunedBranch, { alpha: 255, duration: 0.6 });

    kdiCaption(tl, p.cap, 'RISULTATO: Trovato punto D in tempo O(log n) senza toccare metà dei dati!');
  }
);

/* ==========================================================================
   SIMULAZIONE 4: Orthogonal Range Search (Finestra Rettangolare)
   Mostra come i sottoalberi che non intersecano la finestra vengono saltati.
   ========================================================================== */
const simRange = kdiMakeSim('sim-range-search',
  (p) => {
    const s = 280;
    p.L = { x: 30, y: 24, s };
    p.X = v => p.L.x + v * s;
    p.Y = v => p.L.y + s - v * s;

    p.pts = [
      { id: '1', x: 0.15, y: 0.30, in: false, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: '2', x: 0.25, y: 0.80, in: false, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: '3', x: 0.55, y: 0.40, in: true,  r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: '4', x: 0.70, y: 0.65, in: true,  r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: '5', x: 0.85, y: 0.20, in: false, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] },
      { id: '6', x: 0.90, y: 0.85, in: false, r: KatchColors.slate[0], g: KatchColors.slate[1], b: KatchColors.slate[2] }
    ];

    p.box = { x0: 0.45, x1: 0.80, y0: 0.30, y1: 0.75, alpha: 0 };
    p.leftHalfPruned = { alpha: 0 };
    p.status = { count: 0 };
  },
  (p, f) => {
    const { L, box, leftHalfPruned } = p;
    // Piano
    p.stroke(255, 30); p.strokeWeight(1); p.noFill(); p.rectMode(p.CORNER);
    p.rect(L.x, L.y, L.s, L.s, 4);

    // Divisione centrale x=0.40
    p.stroke(KatchColors.violet[0], KatchColors.violet[1], KatchColors.violet[2], 120);
    p.strokeWeight(2);
    p.line(p.X(0.40), p.Y(0), p.X(0.40), p.Y(1));

    // Area sinistra scartata
    if (leftHalfPruned.alpha > 0) {
      p.noStroke();
      p.fill(239, 68, 68, leftHalfPruned.alpha * 0.12);
      p.rect(L.x, L.y, p.X(0.40) - L.x, L.s);
      kdiLabel(p, 'Nessuna sovrapposizione con la finestra', L.x + (p.X(0.40) - L.x) / 2, L.y + L.s / 2, KatchColors.red, 11, 'CENTER', leftHalfPruned.alpha);
    }

    // Finestra Range Box
    if (box.alpha > 0) {
      const bx = p.X(box.x0), by = p.Y(box.y1);
      const bw = p.X(box.x1) - bx, bh = p.Y(box.y0) - by;
      p.stroke(KatchColors.teal[0], KatchColors.teal[1], KatchColors.teal[2], box.alpha);
      p.strokeWeight(2);
      p.fill(KatchColors.teal[0], KatchColors.teal[1], KatchColors.teal[2], box.alpha * 0.18);
      p.rect(bx, by, bw, bh, 4);
      kdiLabel(p, 'Range Query Box', bx + 6, by - 8, KatchColors.teal, 11, 'LEFT', box.alpha);
    }

    // Punti
    p.pts.forEach(pt => {
      p.noStroke();
      p.fill(pt.r, pt.g, pt.b);
      p.circle(p.X(pt.x), p.Y(pt.y), 12);
      kdiLabel(p, `P${pt.id}`, p.X(pt.x) + 9, p.Y(pt.y) - 6, [pt.r, pt.g, pt.b], 10);
    });

    // Spiegazione a destra con ampio spazio (650px)
    const rx = 350;
    kdiLabel(p, 'Orthogonal Range Query (Filtro a Rettangolo):', rx, 48, KatchColors.teal, 13);
    kdiLabel(p, 'Obiettivo: trovare tutti i punti dentro [X_min..X_max] × [Y_min..Y_max]', rx, 80, KatchColors.slate, 11.5);
    kdiLabel(p, '1. Se la cella di un nodo non tocca il box: POTA il ramo.', rx, 118, KatchColors.red, 11.5);
    kdiLabel(p, '2. Se la cella è COMPLETAMENTE dentro: prendi tutti i punti in O(1).', rx, 148, KatchColors.green, 11.5);
    kdiLabel(p, '3. Se la cella tocca il bordo: scendi ed esamina i figli.', rx, 178, KatchColors.amber, 11.5);
    kdiLabel(p, `Punti trovati nel range: ${p.status.count}`, rx, 225, KatchColors.green, 15);
  },
  (p, f, tl) => {
    kdiCaption(tl, p.cap, 'Vogliamo selezionare tutti i punti all interno del rettangolo ciano');
    tl.to(p.box, { alpha: 255, duration: 0.6 });

    kdiCaption(tl, p.cap, 'Radice con split a x = 0.40: il box inizia a x=0.45 → la parte sinistra (x < 0.40) non si tocca!');
    tl.to(p.leftHalfPruned, { alpha: 255, duration: 0.6 });

    kdiCaption(tl, p.cap, 'Esploriamo solo la parte destra: P3 e P4 cadono perfettamente dentro il box!');
    const matchPts = p.pts.filter(pt => pt.in);
    tl.to(matchPts, { r: KatchColors.green[0], g: KatchColors.green[1], b: KatchColors.green[2], duration: 0.5 })
      .to(p.status, { count: 2, duration: 0.3 }, '<');

    kdiCaption(tl, p.cap, 'P5 e P6 sono esclusi dai limiti su Y. Risultato: trovati 2 punti saltando metà dello spazio!');
  }
);

window.KDI = { fail1D: simFail1D, build2D: simBuild2D, nn: simNN, range: simRange };
