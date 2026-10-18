/* ==========================================================================
   Pkd-tree (Parallel kd-tree) — Simulazioni Capitoli 1-2
   Framework: KatchSimulation + AnimFactory (shared/animation.js)
   Pattern passivo: draw() legge soltanto, GSAP muove.
   ========================================================================== */

const PKD_W = 1000;
const PKD_H = 430;
const PKD_MARGIN = 30;
const PKD_CAPTION_HOLD = 2.2; // seconds each caption stays on screen

/* ---------- Helper comuni delegati alla libreria comune shared/animation.js ---------- */
const pkdCaption = (tl, cap, text, pos = '>', hold = PKD_CAPTION_HOLD) => 
  AnimFactory.prototype.animCaption(tl, cap, text, pos, hold);
const pkdDrawCaption = (p, cap) => AnimFactory.prototype.drawCaption.call({ p }, cap);
const pkdLabel = (p, txt, x, y, col = KatchColors.slate, size = 12, align = 'LEFT', alpha = 255) => 
  AnimFactory.prototype.drawLabel.call({ p }, txt, x, y, { col, size, align, alpha });
const pkdRGB = (c) => KatchColors.rgb(c);
const pkdMakeSim = (containerId, resetFn, drawFn, timelineFn) => 
  KatchSimulation.create(containerId, PKD_W, PKD_H, resetFn, drawFn, timelineFn);


/* ==========================================================================
   SIM 1 — Costruzione di un kd-tree (piano 2D + albero)
   ========================================================================== */
const KD_POINTS = [
  [0.10, 0.20], [0.25, 0.75], [0.35, 0.42], [0.45, 0.90], [0.55, 0.15], [0.62, 0.60],
  [0.70, 0.35], [0.80, 0.82], [0.88, 0.52], [0.95, 0.10], [0.18, 0.55], [0.40, 0.08]
];
const KD_PHI = 2; // leaf wrap threshold φ
const KD_LEAF_COLORS = [KatchColors.teal, KatchColors.amber, KatchColors.pink, KatchColors.green,
  KatchColors.violet, KatchColors.blue, KatchColors.orange, KatchColors.red];

function kdBuild(pts, ids, rect, depth, x0, x1, out, parent) {
  const node = { depth, tx: (x0 + x1) / 2, parent, alpha: 0 };
  if (ids.length <= KD_PHI) {
    node.leaf = true; node.ids = ids;
    out.leaves.push(node);
    return node;
  }
  const span = d => Math.max(...ids.map(i => pts[i][d])) - Math.min(...ids.map(i => pts[i][d]));
  const d = span(0) >= span(1) ? 0 : 1;                // dimensione più "larga"
  const sorted = ids.slice().sort((a, b) => pts[a][d] - pts[b][d]);
  const m = Math.floor(sorted.length / 2);
  const c = (pts[sorted[m - 1]][d] + pts[sorted[m]][d]) / 2; // mediana
  Object.assign(node, { d, c, rect, progress: 0, left: sorted.slice(0, m), right: sorted.slice(m) });
  out.splits.push(node);
  const mid = (x0 + x1) / 2;
  const lr = d === 0 ? { ...rect, x1: c } : { ...rect, y1: c };
  const rr = d === 0 ? { ...rect, x0: c } : { ...rect, y0: c };
  kdBuild(pts, node.left, lr, depth + 1, x0, mid, out, node);
  kdBuild(pts, node.right, rr, depth + 1, mid, x1, out, node);
  return node;
}

const simKd = pkdMakeSim('sim-kd',
  (p) => {
    const s = p.height - 2 * PKD_MARGIN - 30;
    p.L = { x: PKD_MARGIN, y: PKD_MARGIN, s };
    p.T = { x0: p.L.x + s + PKD_MARGIN, x1: p.width - PKD_MARGIN / 2, y0: PKD_MARGIN + 20, gap: (s - 30) / 3 };
    p.X = v => p.L.x + v * s;
    p.Y = v => p.L.y + s - v * s;
    p.pts = KD_POINTS.map(([x, y]) => ({ x, y, ...pkdRGB(KatchColors.slate), alpha: 255 }));
    p.kd = { splits: [], leaves: [] };
    kdBuild(KD_POINTS, KD_POINTS.map((_, i) => i), { x0: 0, x1: 1, y0: 0, y1: 1 }, 0, p.T.x0, p.T.x1, p.kd, null);
    p.kd.splits.sort((a, b) => a.depth - b.depth);
  },
  (p) => {
    const { L, T } = p;
    // Piano
    p.noFill(); p.stroke(255, 40); p.strokeWeight(1); p.rectMode(p.CORNER);
    p.rect(L.x, L.y, L.s, L.s, 4);
    pkdLabel(p, 'x →', L.x + L.s - 24, L.y + L.s + 12);
    pkdLabel(p, '↑ y', L.x - 4, L.y - 10);

    // Iperpiani di split
    p.kd.splits.forEach(sp => {
      if (sp.alpha <= 0) return;
      const r = sp.rect;
      p.stroke(KatchColors.violet[0], KatchColors.violet[1], KatchColors.violet[2], sp.alpha);
      p.strokeWeight(Math.max(1, 3 - sp.depth * 0.7));
      if (sp.d === 0) p.line(p.X(sp.c), p.Y(r.y0), p.X(sp.c), p.Y(r.y0 + (r.y1 - r.y0) * sp.progress));
      else p.line(p.X(r.x0), p.Y(sp.c), p.X(r.x0 + (r.x1 - r.x0) * sp.progress), p.Y(sp.c));
    });

    // Punti
    p.noStroke();
    p.pts.forEach(pt => {
      p.fill(pt.r, pt.g, pt.b, pt.alpha);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = `rgb(${pt.r},${pt.g},${pt.b})`;
      p.circle(p.X(pt.x), p.Y(pt.y), 11);
    });
    p.drawingContext.shadowBlur = 0;

    // Albero
    const ny = n => T.y0 + n.depth * T.gap;
    const all = [...p.kd.splits, ...p.kd.leaves];
    all.forEach(n => {
      if (n.alpha <= 0 || !n.parent) return;
      p.stroke(255, 255, 255, n.alpha * 0.25); p.strokeWeight(1.5);
      p.line(n.parent.tx, ny(n.parent), n.tx, ny(n));
    });
    p.rectMode(p.CENTER); p.textFont('JetBrains Mono'); p.textAlign(p.CENTER, p.CENTER);
    p.kd.splits.forEach(n => {
      if (n.alpha <= 0) return;
      p.stroke(KatchColors.violet[0], KatchColors.violet[1], KatchColors.violet[2], n.alpha);
      p.fill(20, 20, 34, n.alpha); p.strokeWeight(1.5);
      p.rect(n.tx, ny(n), 70, 24, 6);
      p.noStroke(); p.fill(255, n.alpha); p.textSize(11);
      p.text(`⟨${n.d === 0 ? 'x' : 'y'}, ${n.c.toFixed(2)}⟩`, n.tx, ny(n));
    });
    p.kd.leaves.forEach((n, i) => {
      if (n.alpha <= 0) return;
      const c = KD_LEAF_COLORS[i % KD_LEAF_COLORS.length];
      p.noStroke(); p.fill(c[0], c[1], c[2], n.alpha * 0.85);
      p.rect(n.tx, ny(n), 34, 22, 4);
      p.fill(10, 10, 20, n.alpha); p.textSize(11);
      p.text(n.ids.length + 'p', n.tx, ny(n));
    });
  },
  (p, f, tl) => {
    pkdCaption(tl, p.cap, 'n = 12 points in D = 2 dimensions');
    p.kd.splits.forEach((sp, k) => {
      if (k === 0) pkdCaption(tl, p.cap, 'Root: widest dimension → split at the median');
      if (k === 1) pkdCaption(tl, p.cap, 'Recursion: each subtree splits its own sub-space');
      tl.to(sp, { alpha: 255, duration: 0.3 })
        .to(sp, { progress: 1, duration: 0.6, ease: 'power2.inOut' }, '<')
        .to(sp.left.map(i => p.pts[i]), { ...pkdRGB(KatchColors.teal), duration: 0.3, stagger: 0.03 }, '>-0.15')
        .to(sp.right.map(i => p.pts[i]), { ...pkdRGB(KatchColors.amber), duration: 0.3, stagger: 0.03 }, '<');
    });
    pkdCaption(tl, p.cap, `Leaves: ≤ φ = ${KD_PHI} points stored directly · height ≈ log₂ n`);
    p.kd.leaves.forEach((lf, i) => {
      const c = KD_LEAF_COLORS[i % KD_LEAF_COLORS.length];
      tl.to(lf, { alpha: 255, duration: 0.3 }, i === 0 ? '>' : '<0.08')
        .to(lf.ids.map(id => p.pts[id]), { ...pkdRGB(c), duration: 0.3 }, '<');
    });
  }
);

/* ==========================================================================
   SIM 2 — Tabella 1: Pkd-tree vs baseline (10^9 punti 2D, Uniform)
   ========================================================================== */
const simTable = pkdMakeSim('sim-table',
  (p, f) => {
    p.mat = f.createMatrix('T1', 0, 0, 'Time (s) · 10⁹ 2D points · 96 cores',
      ['Build', 'Ins 1%', 'Del 1%', '10-NN'],
      ['Pkd', 'Log', 'BHL', 'CGAL'],
      [['3.15', '.104', '.121', '.381'],
       ['37.9', '2.16', '.396', '2.96'],
       ['31.7', '31.4', '30.9', '.487'],
       ['1147', '1631', '41.2', '1.04']], 'auto', 40);
    f.layoutRow([p.mat], (p.width - p.mat.w) / 2, PKD_MARGIN + 60);
    p.mat.data.forEach(row => row.forEach(c => { c.alpha = 0; }));
  },
  (p, f) => { f.drawMatrix(p.mat); },
  (p, f, tl) => {
    pkdCaption(tl, p.cap, 'Baseline: Log-tree, BHL-tree (ParGeo), CGAL');
    [1, 2, 3].forEach(r => f.animMatrixRowStyle(tl, p.mat, r, { alpha: 255, color: KatchColors.slate }, 0.4, '>'));
    pkdCaption(tl, p.cap, 'Pkd-tree: fastest on every operation');
    f.animMatrixRowStyle(tl, p.mat, 0, { alpha: 255, color: KatchColors.green, bgColor: [...KatchColors.green, 45], scale: 1.1 }, 0.6, '>');
    pkdCaption(tl, p.cap, 'Build ~10× · updates up to 400× · queries 6–12× vs Log-tree', '+=0.6');
    tl.to(p.mat.getCell(3, 1), { r: KatchColors.red[0], g: KatchColors.red[1], b: KatchColors.red[2], duration: 0.4 }, '<')
      .to(p.mat.getCell(2, 1), { r: KatchColors.red[0], g: KatchColors.red[1], b: KatchColors.red[2], duration: 0.4 }, '<')
      .to(p.mat.getCell(1, 3), { r: KatchColors.amber[0], g: KatchColors.amber[1], b: KatchColors.amber[2], duration: 0.4 }, '<');
  }
);

/* ==========================================================================
   SIM 3 — Metodo logaritmico (Log-tree) vs albero singolo (Pkd-tree)
   ========================================================================== */
const LOG_SIZES = [1, 2, 4, 8];

function pkdDrawTree(p, t, col) {
  if (t.alpha <= 0) return;
  const h = 34 + 46 * Math.sqrt(t.size / 8) * t.scale;
  const w = h * 1.1;
  p.push();
  p.stroke(col[0], col[1], col[2], t.alpha); p.strokeWeight(2);
  p.fill(col[0], col[1], col[2], t.alpha * 0.18);
  p.triangle(t.x, t.y - h / 2, t.x - w / 2, t.y + h / 2, t.x + w / 2, t.y + h / 2);
  pkdLabel(p, t.label || String(t.size), t.x, t.y + h / 2 + 14, col, 12, 'CENTER', t.alpha);
  p.pop();
}

const simLog = pkdMakeSim('sim-log',
  (p) => {
    const rowY = p.height * 0.30;
    p.slotX = LOG_SIZES.map((_, i) => p.width * (0.32 + i * 0.17));
    p.trees = LOG_SIZES.map((s, i) => ({ size: s, x: p.slotX[i], y: rowY, alpha: [1, 2, 8].includes(s) ? 255 : 0, scale: 1 }));
    p.ins = { size: 1, x: p.slotX[0], y: rowY - 95, alpha: 0, scale: 1, label: 'new' };
    p.pkd = { size: 12, x: p.slotX[0] + (p.slotX[3] - p.slotX[0]) / 2, y: p.height * 0.72, alpha: 255, scale: 1.1, label: 'Pkd-tree · n = 12' };
    p.scan = { x: 0, y: 0, w: 120, h: 120, alpha: 0, center: true };
    p.st = { visits: 0 };
    p.rowY = rowY;
  },
  (p, f) => {
    pkdLabel(p, 'Log-tree', PKD_MARGIN, p.rowY, KatchColors.violet, 14);
    pkdLabel(p, 'O(log n) trees', PKD_MARGIN, p.rowY + 18, KatchColors.slate, 11);
    pkdLabel(p, 'Pkd-tree', PKD_MARGIN, p.pkd.y, KatchColors.green, 14);
    pkdLabel(p, '1 tree', PKD_MARGIN, p.pkd.y + 18, KatchColors.slate, 11);
    p.stroke(255, 25); p.line(PKD_MARGIN, p.height * 0.53, p.width - PKD_MARGIN, p.height * 0.53);
    p.trees.forEach(t => pkdDrawTree(p, t, KatchColors.violet));
    pkdDrawTree(p, p.ins, KatchColors.amber);
    pkdDrawTree(p, p.pkd, KatchColors.green);
    f.drawScanner(p.scan, KatchColors.amber);
    pkdLabel(p, `trees visited by the query: ${Math.round(p.st.visits)}`, p.width - PKD_MARGIN, PKD_MARGIN - 8, KatchColors.amber, 12, 'RIGHT');
  },
  (p, f, tl) => {
    const [t1, t2, t4, t8] = p.trees;
    pkdCaption(tl, p.cap, 'n = 11 = 8 + 2 + 1 → one perfect tree per 1-bit');
    pkdCaption(tl, p.cap, 'Inserting 1 point…', '+=0.6');
    tl.to(p.ins, { alpha: 255, duration: 0.3 })
      .to(p.ins, { y: p.rowY, duration: 0.6, ease: 'power2.inOut' });
    pkdCaption(tl, p.cap, '1 + 1 → 2 · 2 + 2 → 4 : cascading merges (like a binary carry)');
    tl.to([p.ins, t1], { x: p.slotX[1], alpha: 0, duration: 0.7, ease: 'power2.inOut' })
      .to(t2, { scale: 1.35, duration: 0.25, yoyo: true, repeat: 1 })
      .to(t2, { x: p.slotX[2], alpha: 0, duration: 0.7, ease: 'power2.inOut' })
      .fromTo(t4, { scale: 0.4 }, { alpha: 255, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<0.4');
    pkdCaption(tl, p.cap, 'k-NN query: must search ALL trees and combine the results', '+=0.4');
    tl.set(p.scan, { x: t4.x, y: p.rowY, alpha: 255 })
      .to(p.st, { visits: 1, duration: 0.2 })
      .to(p.scan, { x: t8.x, duration: 0.7, ease: 'power2.inOut' }, '+=0.4')
      .to(p.st, { visits: 2, duration: 0.2 });
    pkdCaption(tl, p.cap, 'Pkd-tree: a single balanced kd-tree → one visit', '+=0.5');
    tl.set(p.st, { visits: 0 })
      .to(p.scan, { x: p.pkd.x, y: p.pkd.y, w: 140, h: 140, duration: 0.8, ease: 'power2.inOut' })
      .to(p.st, { visits: 1, duration: 0.2 });
  }
);

/* ==========================================================================
   SIM 4 — Modello Work–Span (fork-join binario, DAG)
   ========================================================================== */
const FJ_LEVELS = [1, 2, 4, 8, 4, 2, 1];

const simFJ = pkdMakeSim('sim-forkjoin',
  (p) => {
    const top = PKD_MARGIN + 20;
    const gap = (p.height - top - 60) / (FJ_LEVELS.length - 1);
    const x0 = p.width * 0.28, x1 = p.width - PKD_MARGIN;
    p.levels = FJ_LEVELS.map((cnt, l) => Array.from({ length: cnt }, (_, i) => {
      const kind = l < 3 ? 'fork' : (l === 3 ? 'task' : 'join');
      const col = kind === 'fork' ? KatchColors.violet : (kind === 'task' ? KatchColors.teal : KatchColors.slate);
      return { x: x0 + (i + 0.5) * (x1 - x0) / cnt, y: top + l * gap, kind, ...pkdRGB(col), alpha: 0, l, i };
    }));
    p.edges = [];
    for (let l = 0; l < FJ_LEVELS.length - 1; l++) {
      p.levels[l + 1].forEach((n, i) => {
        if (FJ_LEVELS[l + 1] > FJ_LEVELS[l]) p.edges.push({ a: p.levels[l][Math.floor(i / 2)], b: n, hl: 0 });
      });
      if (FJ_LEVELS[l + 1] < FJ_LEVELS[l]) p.levels[l].forEach((n, i) => p.edges.push({ a: n, b: p.levels[l + 1][Math.floor(i / 2)], hl: 0 }));
    }
    p.st = { W: 0, S: 0, rho: 0 };
  },
  (p) => {
    p.edges.forEach(e => {
      const a = Math.min(e.a.alpha, e.b.alpha);
      if (a <= 0) return;
      p.strokeWeight(e.hl > 0 ? 3 : 1.5);
      p.stroke(255, 255, 255, a * 0.25);
      p.line(e.a.x, e.a.y, e.b.x, e.b.y);
      if (e.hl > 0) {
        p.stroke(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], e.hl);
        p.line(e.a.x, e.a.y, e.b.x, e.b.y);
      }
    });
    p.noStroke();
    p.levels.flat().forEach(n => {
      if (n.alpha <= 0) return;
      p.fill(n.r, n.g, n.b, n.alpha);
      if (n.kind === 'task') { p.rectMode(p.CENTER); p.rect(n.x, n.y, 18, 18, 4); }
      else p.circle(n.x, n.y, 16);
    });
    const lx = PKD_MARGIN;
    pkdLabel(p, '● fork', lx, PKD_MARGIN + 10, KatchColors.violet);
    pkdLabel(p, '■ task', lx, PKD_MARGIN + 28, KatchColors.teal);
    pkdLabel(p, '● join', lx, PKD_MARGIN + 46, KatchColors.slate);
    pkdLabel(p, `Work  W = ${Math.round(p.st.W)}`, lx, p.height * 0.45, KatchColors.teal, 15);
    pkdLabel(p, `Span  S = ${Math.round(p.st.S)}`, lx, p.height * 0.45 + 26, KatchColors.amber, 15);
    if (p.st.rho > 0) {
      pkdLabel(p, 'ρ = 4 processors', lx, p.height * 0.45 + 62, KatchColors.slate, 12, 'LEFT', p.st.rho);
      pkdLabel(p, 'T ≈ W/ρ + O(S)', lx, p.height * 0.45 + 82, KatchColors.green, 13, 'LEFT', p.st.rho);
      pkdLabel(p, '  ≈ 22/4 + 7', lx, p.height * 0.45 + 100, KatchColors.green, 13, 'LEFT', p.st.rho);
    }
  },
  (p, f, tl) => {
    pkdCaption(tl, p.cap, 'Fork: a thread spawns 2 children that run in parallel');
    p.levels.forEach((lvl, l) => {
      if (l === 3) pkdCaption(tl, p.cap, 'DAG leaves are the actual work (e.g. partitioning a chunk)');
      if (l === 4) pkdCaption(tl, p.cap, 'Join: the parent resumes only when both children finish');
      tl.to(lvl, { alpha: 255, duration: 0.3, stagger: 0.05 })
        .to(p.st, { W: '+=' + lvl.length, roundProps: 'W', duration: 0.3 }, '<');
    });
    pkdCaption(tl, p.cap, 'Work W = total number of nodes (= sequential time)', '+=0.3');
    pkdCaption(tl, p.cap, 'Span S = longest path in the DAG (dependence chain)', '+=0.8');
    const path = p.levels.map(l => l[0]);
    const pathEdges = p.edges.filter(e => path.includes(e.a) && path.includes(e.b));
    path.forEach((n, k) => {
      tl.to(n, { ...pkdRGB(KatchColors.amber), duration: 0.2 }, k === 0 ? '>' : '>-0.05')
        .to(p.st, { S: k + 1, duration: 0.15 }, '<');
      if (pathEdges[k]) tl.to(pathEdges[k], { hl: 255, duration: 0.2 });
    });
    pkdCaption(tl, p.cap, 'Work-stealing: time W/ρ + O(S) whp → we need small (polylog) span', '+=0.3');
    tl.to(p.st, { rho: 255, duration: 0.5 }, '<');
  }
);

/* ==========================================================================
   SIM 5 — Ideal-cache model (M, B, trasferimenti di blocchi)
   ========================================================================== */
const IC_BLOCKS = 6, IC_B = 4, IC_SLOTS = 2;

const simCache = pkdMakeSim('sim-cache',
  (p) => {
    p.cellW = 22;
    const blockW = p.cellW * IC_B, gap = 14;
    const total = IC_BLOCKS * blockW + (IC_BLOCKS - 1) * gap;
    const mx0 = (p.width - total) / 2;
    p.memY = p.height * 0.76;
    p.cacheY = p.height * 0.45;
    p.cpuY = p.height * 0.14;
    p.blockX = j => mx0 + j * (blockW + gap);
    const cTotal = IC_SLOTS * blockW + (IC_SLOTS - 1) * 40;
    p.slotX = s => (p.width - cTotal) / 2 + s * (blockW + 40);
    p.blockW = blockW;
    p.cells = Array.from({ length: IC_BLOCKS * IC_B }, () => ({ read: 0 }));
    p.copies = Array.from({ length: IC_BLOCKS }, (_, j) => ({ x: p.blockX(j), y: p.memY, alpha: 0 }));
    p.ptr = { x: p.blockX(0) + p.cellW / 2, alpha: 0 };
    p.st = { io: 0, hit: 0 };
  },
  (p, f) => {
    f.drawCPU(p.width / 2, p.cpuY, 'CPU', 110, 44, 0);
    f.drawQueue(p.width / 2, p.cacheY + 11, IC_SLOTS * p.blockW + 80, 54, 'CACHE · size M = 2B · access cost 0', -42);
    p.stroke(255, 25); p.strokeWeight(1);
    p.line(p.width / 2, p.cpuY + 22, p.width / 2, p.cacheY - 16);
    p.line(p.width / 2, p.cacheY + 38, p.width / 2, p.memY - 24);
    pkdLabel(p, 'MAIN MEMORY (infinite) · blocks of B = 4', p.width / 2, p.memY - 34, KatchColors.slate, 12, 'CENTER');

    p.rectMode(p.CORNER);
    for (let j = 0; j < IC_BLOCKS; j++) {
      for (let k = 0; k < IC_B; k++) {
        const c = p.cells[j * IC_B + k];
        p.stroke(255, 50); p.strokeWeight(1);
        p.fill(KatchColors.teal[0], KatchColors.teal[1], KatchColors.teal[2], 20 + c.read * 0.5);
        p.rect(p.blockX(j) + k * p.cellW, p.memY, p.cellW, p.cellW);
      }
    }
    p.copies.forEach(c => {
      if (c.alpha <= 0) return;
      p.stroke(KatchColors.teal[0], KatchColors.teal[1], KatchColors.teal[2], c.alpha);
      p.fill(KatchColors.teal[0], KatchColors.teal[1], KatchColors.teal[2], c.alpha * 0.35);
      for (let k = 0; k < IC_B; k++) p.rect(c.x + k * p.cellW, c.y, p.cellW, p.cellW);
    });
    if (p.ptr.alpha > 0) {
      p.noStroke(); p.fill(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], p.ptr.alpha);
      const y = p.memY + p.cellW + 6;
      p.triangle(p.ptr.x, y, p.ptr.x - 6, y + 10, p.ptr.x + 6, y + 10);
    }
    pkdLabel(p, `Block transfer (I/O): ${Math.round(p.st.io)}`, PKD_MARGIN, p.cpuY - 8, KatchColors.coral || KatchColors.red, 14);
    pkdLabel(p, `Cache hits:          ${Math.round(p.st.hit)}`, PKD_MARGIN, p.cpuY + 16, KatchColors.green, 14);
  },
  (p, f, tl) => {
    pkdCaption(tl, p.cap, 'Sequential scan of n = 24 elements');
    tl.to(p.ptr, { alpha: 255, duration: 0.2 });
    for (let j = 0; j < IC_BLOCKS; j++) {
      if (j === 0) pkdCaption(tl, p.cap, 'Miss: a whole block is transferred (cost 1)');
      if (j === 1) pkdCaption(tl, p.cap, 'The other B−1 elements are already cached (cost 0)');
      if (j === IC_SLOTS) pkdCaption(tl, p.cap, 'Cache full: evict a block (optimal offline policy)');
      tl.to(p.ptr, { x: p.blockX(j) + p.cellW / 2, duration: 0.25 })
        .to(p.cells[j * IC_B], { read: 255, duration: 0.2 }, '<')
        .set(p.copies[j], { alpha: 255 });
      if (j >= IC_SLOTS) tl.to(p.copies[j - IC_SLOTS], { alpha: 0, y: p.cacheY - 30, duration: 0.4 });
      tl.to(p.copies[j], { x: p.slotX(j % IC_SLOTS), y: p.cacheY, duration: 0.55, ease: 'power2.inOut' }, '<')
        .to(p.st, { io: '+=1', roundProps: 'io', duration: 0.2 }, '<');
      for (let k = 1; k < IC_B; k++) {
        tl.to(p.ptr, { x: p.blockX(j) + k * p.cellW + p.cellW / 2, duration: 0.16 })
          .to(p.cells[j * IC_B + k], { read: 255, duration: 0.15 }, '<')
          .to(p.st, { hit: '+=1', roundProps: 'hit', duration: 0.1 }, '<');
      }
    }
    pkdCaption(tl, p.cap, 'Cache complexity of the scan = n / B = 24 / 4 = 6');
  }
);

/* ==========================================================================
   SIM 6 — Bilanciamento per peso (parametro α)
   ========================================================================== */
const WB_ALPHA = 0.2;

const simBal = pkdMakeSim('sim-balance',
  (p) => {
    p.st = { lc: 10, rc: 10, flash: 0 };
    p.root = { x: p.width * 0.27, y: p.height * 0.2 };
    p.bar = { x: p.width * 0.56, y: p.height * 0.42, w: p.width * 0.36, h: 24 };
  },
  (p) => {
    const { st, root, bar } = p;
    const lc = Math.round(st.lc), rc = Math.round(st.rc);
    const ratio = lc / (lc + rc);
    const ok = ratio >= 0.5 - WB_ALPHA && ratio <= 0.5 + WB_ALPHA;
    const col = ok ? KatchColors.green : KatchColors.red;

    // Albero
    const childY = p.height * 0.55, dx = p.width * 0.14;
    [[-1, lc, 'T.lc'], [1, rc, 'T.rc']].forEach(([s, n, name]) => {
      const h = 50 + 90 * Math.sqrt(n / 30), w = h * 0.95, cx = root.x + s * dx;
      p.stroke(255, 40); p.strokeWeight(1.5); p.line(root.x, root.y, cx, childY - h / 2);
      p.stroke(KatchColors.teal[0], KatchColors.teal[1], KatchColors.teal[2]); p.strokeWeight(2);
      p.fill(KatchColors.teal[0], KatchColors.teal[1], KatchColors.teal[2], 35);
      p.triangle(cx, childY - h / 2, cx - w / 2, childY + h / 2, cx + w / 2, childY + h / 2);
      pkdLabel(p, `${name} = ${n}`, cx, childY + h / 2 + 16, KatchColors.teal, 12, 'CENTER');
    });
    if (st.flash > 0) {
      p.noStroke(); p.fill(KatchColors.amber[0], KatchColors.amber[1], KatchColors.amber[2], st.flash * 0.4);
      p.circle(root.x, root.y, 70);
    }
    p.noStroke(); p.fill(col[0], col[1], col[2]); p.circle(root.x, root.y, 26);
    pkdLabel(p, 'T', root.x, root.y, [10, 10, 20], 13, 'CENTER');

    // Barra rapporto
    const X = v => bar.x + v * bar.w;
    p.rectMode(p.CORNER); p.noStroke();
    p.fill(255, 15); p.rect(bar.x, bar.y, bar.w, bar.h, 4);
    p.fill(KatchColors.green[0], KatchColors.green[1], KatchColors.green[2], 50);
    p.rect(X(0.5 - WB_ALPHA), bar.y, X(0.5 + WB_ALPHA) - X(0.5 - WB_ALPHA), bar.h);
    p.stroke(255, 60); p.line(X(0.5), bar.y - 4, X(0.5), bar.y + bar.h + 4);
    [0, 0.5 - WB_ALPHA, 0.5, 0.5 + WB_ALPHA, 1].forEach(v => pkdLabel(p, v.toFixed(1), X(v), bar.y + bar.h + 14, KatchColors.slate, 10, 'CENTER'));
    p.noStroke(); p.fill(col[0], col[1], col[2]);
    p.drawingContext.shadowBlur = 12; p.drawingContext.shadowColor = `rgb(${col.join(',')})`;
    p.rect(X(ratio) - 3, bar.y - 8, 6, bar.h + 16, 2);
    p.drawingContext.shadowBlur = 0;

    pkdLabel(p, `|T.lc| / |T| = ${ratio.toFixed(2)}`, bar.x, bar.y - 40, [255, 255, 255], 15);
    pkdLabel(p, `α = ${WB_ALPHA}  →  allowed range [${0.5 - WB_ALPHA}, ${0.5 + WB_ALPHA}]`, bar.x, bar.y - 20, KatchColors.slate, 11);
    pkdLabel(p, ok ? '✔ BALANCED' : '✖ UNBALANCED', bar.x, bar.y + bar.h + 50, col, 16);
  },
  (p, f, tl) => {
    pkdCaption(tl, p.cap, 'Perfect tree: 10 | 10 → ratio 0.50');
    pkdCaption(tl, p.cap, 'Batch insertion into the left subtree: 14 | 10', '+=0.8');
    tl.to(p.st, { lc: 14, duration: 1, ease: 'power1.inOut' });
    pkdCaption(tl, p.cap, 'Lazy strategy: within ±α the imbalance is tolerated, no action', '+=0.2');
    pkdCaption(tl, p.cap, 'Another skewed batch: 30 | 10 → out of bounds!', '+=1.2');
    tl.to(p.st, { lc: 30, duration: 1.2, ease: 'power1.inOut' });
    pkdCaption(tl, p.cap, 'Rebalancing = local reconstruction of the subtree (Sec. 4)', '+=0.6');
    tl.to(p.st, { flash: 255, duration: 0.3, yoyo: true, repeat: 3 })
      .to(p.st, { lc: 20, rc: 20, duration: 0.9, ease: 'power3.inOut' });
  }
);

window.PKD = { kd: simKd, table: simTable, log: simLog, fj: simFJ, cache: simCache, bal: simBal };
