/* ==========================================================================
   Pkd-tree (Parallel kd-tree) — Simulations for Chapters 1-2
   Framework: KatchSteppedSimulation + AnimFactory (shared/animation.js)
   Pattern: User-controlled sequential slides (Next / Prev / Reset)
   ========================================================================== */

const PKD_W = 1000;
const PKD_H = 430;
const PKD_MARGIN = 30;

/* ---------- Common Helpers ---------- */
const pkdDrawCaption = (p, cap) => AnimFactory.prototype.drawCaption.call({ p }, cap);
const pkdLabel = (p, txt, x, y, col = KatchColors.slate, size = 12, align = 'LEFT', alpha = 255) => 
  AnimFactory.prototype.drawLabel.call({ p }, txt, x, y, { col, size, align, alpha });
const pkdRGB = (c) => KatchColors.rgb(c);
const pkdMakeSteppedSim = (containerId, setupFn, drawFn, steps, uiConfig) => 
  KatchSteppedSimulation.create(containerId, PKD_W, PKD_H, setupFn, drawFn, steps, uiConfig);


/* ==========================================================================
   SIM 1 — 2D kd-tree Recursive Partitioning (Plane + Tree)
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
  const d = span(0) >= span(1) ? 0 : 1;                // widest dimension
  const sorted = ids.slice().sort((a, b) => pts[a][d] - pts[b][d]);
  const m = Math.floor(sorted.length / 2);
  const c = (pts[sorted[m - 1]][d] + pts[sorted[m]][d]) / 2; // median
  Object.assign(node, { d, c, rect, progress: 0, left: sorted.slice(0, m), right: sorted.slice(m) });
  out.splits.push(node);
  const mid = (x0 + x1) / 2;
  const lr = d === 0 ? { ...rect, x1: c } : { ...rect, y1: c };
  const rr = d === 0 ? { ...rect, x0: c } : { ...rect, y0: c };
  kdBuild(pts, node.left, lr, depth + 1, x0, mid, out, node);
  kdBuild(pts, node.right, rr, depth + 1, mid, x1, out, node);
  return node;
}

const simKd = pkdMakeSteppedSim('sim-kd',
  (p) => {
    const s = 280;
    p.L = { x: 30, y: 24, s };
    p.T = { x0: p.L.x + s + 60, x1: p.width - 40, y0: 55, gap: (s - 30) / 3 };
    p.X = v => p.L.x + v * s;
    p.Y = v => p.L.y + s - v * s;
    p.pts = KD_POINTS.map(([x, y]) => ({ x, y, ...pkdRGB(KatchColors.slate), alpha: 255 }));
    p.kd = { splits: [], leaves: [] };
    kdBuild(KD_POINTS, KD_POINTS.map((_, i) => i), { x0: 0, x1: 1, y0: 0, y1: 1 }, 0, p.T.x0, p.T.x1, p.kd, null);
    p.kd.splits.sort((a, b) => a.depth - b.depth);
  },
  (p) => {
    const { L, T } = p;
    // Cartesian plane
    p.noFill(); p.stroke(255, 40); p.strokeWeight(1); p.rectMode(p.CORNER);
    p.rect(L.x, L.y, L.s, L.s, 4);
    pkdLabel(p, 'x →', L.x + L.s - 24, L.y + L.s + 12);
    pkdLabel(p, '↑ y', L.x - 4, L.y - 10);

    // Splitting hyperplanes
    p.kd.splits.forEach(sp => {
      if (sp.alpha <= 0) return;
      const r = sp.rect;
      p.stroke(KatchColors.violet[0], KatchColors.violet[1], KatchColors.violet[2], sp.alpha);
      p.strokeWeight(Math.max(1, 3 - sp.depth * 0.7));
      if (sp.d === 0) p.line(p.X(sp.c), p.Y(r.y0), p.X(sp.c), p.Y(r.y0 + (r.y1 - r.y0) * sp.progress));
      else p.line(p.X(r.x0), p.Y(sp.c), p.X(r.x0 + (r.x1 - r.x0) * sp.progress), p.Y(sp.c));
    });

    // Data points
    p.noStroke();
    p.pts.forEach(pt => {
      p.fill(pt.r, pt.g, pt.b, pt.alpha);
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = `rgb(${pt.r},${pt.g},${pt.b})`;
      p.circle(p.X(pt.x), p.Y(pt.y), 11);
    });
    p.drawingContext.shadowBlur = 0;

    // Tree hierarchy
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

    p.rectMode(p.CORNER);
  },
  [
    {
      caption: '1/5 · Initial Dataset: 12 points distributed in a normalized 2D space [0, 1]².',
      run: (p, f, dur, tl) => {
        tl.to(p.pts, { alpha: 255, duration: dur });
      }
    },
    {
      caption: '2/5 · Root (depth 0): Widest dimension (x) → Split at median coordinate x = 0.50.',
      run: (p, f, dur, tl) => {
        const sp0 = p.kd.splits[0];
        tl.to(sp0, { alpha: 255, duration: dur * 0.4 })
          .to(sp0, { progress: 1, duration: dur * 0.7, ease: 'power2.inOut' }, '<')
          .to(sp0.left.map(i => p.pts[i]), { ...pkdRGB(KatchColors.teal), duration: dur * 0.4 }, '>-0.2')
          .to(sp0.right.map(i => p.pts[i]), { ...pkdRGB(KatchColors.amber), duration: dur * 0.4 }, '<');
      }
    },
    {
      caption: '3/5 · Left recursion (depth 1): Left subspace is split along y at median coordinate y = 0.48.',
      run: (p, f, dur, tl) => {
        const sp1 = p.kd.splits[1];
        tl.to(sp1, { alpha: 255, duration: dur * 0.4 })
          .to(sp1, { progress: 1, duration: dur * 0.7, ease: 'power2.inOut' }, '<')
          .to(sp1.left.map(i => p.pts[i]), { ...pkdRGB(KatchColors.blue), duration: dur * 0.4 }, '>-0.2')
          .to(sp1.right.map(i => p.pts[i]), { ...pkdRGB(KatchColors.violet), duration: dur * 0.4 }, '<');
      }
    },
    {
      caption: '4/5 · Right recursion & completion: Successive partitions alternating widest spread axes.',
      run: (p, f, dur, tl) => {
        p.kd.splits.slice(2).forEach(sp => {
          tl.to(sp, { alpha: 255, progress: 1, duration: dur * 0.6, ease: 'power2.inOut' }, '<0.1');
        });
      }
    },
    {
      caption: '5/5 · Leaves (threshold φ = 2): Points (≤ 2 per cell) reside directly in leaves for cache efficiency.',
      run: (p, f, dur, tl) => {
        p.kd.leaves.forEach((lf, i) => {
          const c = KD_LEAF_COLORS[i % KD_LEAF_COLORS.length];
          tl.to(lf, { alpha: 255, duration: dur * 0.4 }, i === 0 ? '>' : '<0.06')
            .to(lf.ids.map(id => p.pts[id]), { ...pkdRGB(c), duration: dur * 0.4 }, '<');
        });
      }
    }
  ],
  { prevBtn: 'btn-kd-prev', nextBtn: 'btn-kd-next', badge: 'badge-kd-step', resetBtn: 'btn-kd-reset' }
);



/* ==========================================================================
   SIM 2 — Logarithmic Method (Log-tree) vs Single Tree (Pkd-tree)
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

const simLog = pkdMakeSteppedSim('sim-log',
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
  [
    {
      caption: '1/5 · Log-tree: Maintains O(log n) static trees of power-of-two sizes (11 = 8 + 2 + 1).',
      run: (p, f, dur, tl) => {
        // Base state with trees 1, 2, 8
      }
    },
    {
      caption: '2/5 · Insertion: 1 new point arrives into the size-1 partition.',
      run: (p, f, dur, tl) => {
        tl.to(p.ins, { alpha: 255, duration: dur * 0.3 })
          .to(p.ins, { y: p.rowY, duration: dur * 0.7, ease: 'power2.inOut' });
      }
    },
    {
      caption: '3/5 · Cascading Merges: 1+1=2, then 2+2=4. Cascading rebuilds analogous to binary addition carries.',
      run: (p, f, dur, tl) => {
        const [t1, t2, t4] = p.trees;
        tl.to([p.ins, t1], { x: p.slotX[1], alpha: 0, duration: dur * 0.5, ease: 'power2.inOut' })
          .to(t2, { scale: 1.35, duration: dur * 0.25, yoyo: true, repeat: 1 })
          .to(t2, { x: p.slotX[2], alpha: 0, duration: dur * 0.5, ease: 'power2.inOut' })
          .fromTo(t4, { scale: 0.4 }, { alpha: 255, scale: 1, duration: dur * 0.5, ease: 'back.out(2)' }, '<0.2');
      }
    },
    {
      caption: '4/5 · k-NN Query on Log-tree: The search MUST query all O(log n) trees and merge intermediate results!',
      run: (p, f, dur, tl) => {
        const [, , t4, t8] = p.trees;
        tl.set(p.scan, { x: t4.x, y: p.rowY, alpha: 255 })
          .to(p.st, { visits: 1, duration: dur * 0.3 })
          .to(p.scan, { x: t8.x, duration: dur * 0.7, ease: 'power2.inOut' }, `+=${dur * 0.2}`)
          .to(p.st, { visits: 2, duration: dur * 0.3 });
      }
    },
    {
      caption: '5/5 · Pkd-tree: ALWAYS maintains a single coherent tree → 1 search traversal, zero merge overhead.',
      run: (p, f, dur, tl) => {
        tl.set(p.st, { visits: 0 })
          .to(p.scan, { x: p.pkd.x, y: p.pkd.y, w: 140, h: 140, duration: dur * 0.8, ease: 'power2.inOut' })
          .to(p.st, { visits: 1, duration: dur * 0.3 });
      }
    }
  ],
  { prevBtn: 'btn-log-prev', nextBtn: 'btn-log-next', badge: 'badge-log-step', resetBtn: 'btn-log-reset' }
);


/* ==========================================================================
   SIM 3 — Table 1: Pkd-tree vs Baselines (10^9 2D points, Uniform)
   ========================================================================== */
const simTable = pkdMakeSteppedSim('sim-table',
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
  [
    {
      caption: '1/3 · Reference Baselines: Log-tree, BHL-tree (ParGeo), and CGAL (computational standard).',
      run: (p, f, dur, tl) => {
        [1, 2, 3].forEach(r => f.animMatrixRowStyle(tl, p.mat, r, { alpha: 255, color: KatchColors.slate }, dur * 0.4, '>'));
      }
    },
    {
      caption: '2/3 · Pkd-tree: Dominant performance across all operations (construction, updates, and queries).',
      run: (p, f, dur, tl) => {
        f.animMatrixRowStyle(tl, p.mat, 0, { alpha: 255, color: KatchColors.green, bgColor: [...KatchColors.green, 45], scale: 1.1 }, dur * 0.6, '>');
      }
    },
    {
      caption: '3/3 · Quantitative Gains: Build ~10×, batch updates up to 400×, k-NN queries 6–12× faster vs Log-tree.',
      run: (p, f, dur, tl) => {
        tl.to(p.mat.getCell(3, 1), { r: KatchColors.red[0], g: KatchColors.red[1], b: KatchColors.red[2], duration: dur * 0.4 }, '<')
          .to(p.mat.getCell(2, 1), { r: KatchColors.red[0], g: KatchColors.red[1], b: KatchColors.red[2], duration: dur * 0.4 }, '<')
          .to(p.mat.getCell(1, 3), { r: KatchColors.amber[0], g: KatchColors.amber[1], b: KatchColors.amber[2], duration: dur * 0.4 }, '<');
      }
    }
  ],
  { prevBtn: 'btn-table-prev', nextBtn: 'btn-table-next', badge: 'badge-table-step', resetBtn: 'btn-table-reset' }
);


/* ==========================================================================
   SIM 4 — Work–Span Model (Binary Fork-Join DAG)
   ========================================================================== */
const FJ_LEVELS = [1, 2, 4, 8, 4, 2, 1];

const simFJ = pkdMakeSteppedSim('sim-forkjoin',
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
    p.rectMode(p.CORNER);
  },
  [
    {
      caption: '1/5 · Fork: A parent thread recursively spawns 2 child threads that execute in parallel.',
      run: (p, f, dur, tl) => {
        [0, 1, 2].forEach(l => {
          tl.to(p.levels[l], { alpha: 255, duration: dur * 0.35, stagger: dur * 0.04 }, '<')
            .to(p.st, { W: '+=' + p.levels[l].length, roundProps: 'W', duration: dur * 0.25 }, '<');
        });
      }
    },
    {
      caption: '2/5 · Task (DAG leaves): Parallel execution of computational workload (e.g. chunk partitioning).',
      run: (p, f, dur, tl) => {
        tl.to(p.levels[3], { alpha: 255, duration: dur * 0.45, stagger: dur * 0.04 }, '>')
          .to(p.st, { W: '+=' + p.levels[3].length, roundProps: 'W', duration: dur * 0.3 }, '<');
      }
    },
    {
      caption: '3/5 · Join: Parallel branches synchronize; parent thread resumes only when both children finish.',
      run: (p, f, dur, tl) => {
        [4, 5, 6].forEach(l => {
          tl.to(p.levels[l], { alpha: 255, duration: dur * 0.35, stagger: dur * 0.04 }, '<')
            .to(p.st, { W: '+=' + p.levels[l].length, roundProps: 'W', duration: dur * 0.25 }, '<');
        });
      }
    },
    {
      caption: '4/5 · Span S: The longest critical path in the DAG (chain of non-parallelizable serial dependencies).',
      run: (p, f, dur, tl) => {
        const path = p.levels.map(l => l[0]);
        const pathEdges = p.edges.filter(e => path.includes(e.a) && path.includes(e.b));
        path.forEach((n, k) => {
          tl.to(n, { ...pkdRGB(KatchColors.amber), duration: dur * 0.2 }, k === 0 ? '>' : '<0.05')
            .to(p.st, { S: k + 1, duration: dur * 0.15 }, '<');
          if (pathEdges[k]) tl.to(pathEdges[k], { hl: 255, duration: dur * 0.2 }, '<');
        });
      }
    },
    {
      caption: '5/5 · Brent\'s Theorem: On ρ processors, Time T ≈ W/ρ + O(S) → scaling requires polylogarithmic Span!',
      run: (p, f, dur, tl) => {
        tl.to(p.st, { rho: 255, duration: dur * 0.5 });
      }
    }
  ],
  { prevBtn: 'btn-fj-prev', nextBtn: 'btn-fj-next', badge: 'badge-fj-step', resetBtn: 'btn-fj-reset' }
);


/* ==========================================================================
   SIM 5 — Ideal-Cache Model (M, B, Block Transfers)
   ========================================================================== */
const IC_BLOCKS = 6, IC_B = 4, IC_SLOTS = 2;

const simCache = pkdMakeSteppedSim('sim-cache',
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
  [
    {
      caption: '1/5 · Ideal-Cache Model: CPU accesses cache with zero penalty (capacity M = 2 blocks of B = 4).',
      run: (p, f, dur, tl) => {
        tl.to(p.ptr, { alpha: 255, duration: dur * 0.3 });
      }
    },
    {
      caption: '2/5 · Cache Miss (Block 0): Entire block loaded from memory (cost 1 I/O); remaining B-1 accesses cost 0.',
      run: (p, f, dur, tl) => {
        const j = 0;
        tl.to(p.ptr, { x: p.blockX(j) + p.cellW / 2, duration: dur * 0.2 })
          .to(p.cells[j * IC_B], { read: 255, duration: dur * 0.2 }, '<')
          .set(p.copies[j], { alpha: 255 })
          .to(p.copies[j], { x: p.slotX(0), y: p.cacheY, duration: dur * 0.5, ease: 'power2.inOut' }, '<')
          .to(p.st, { io: 1, duration: dur * 0.2 }, '<');
        for (let k = 1; k < IC_B; k++) {
          tl.to(p.ptr, { x: p.blockX(j) + k * p.cellW + p.cellW / 2, duration: dur * 0.15 })
            .to(p.cells[j * IC_B + k], { read: 255, duration: dur * 0.15 }, '<')
            .to(p.st, { hit: '+=' + 1, roundProps: 'hit', duration: dur * 0.1 }, '<');
        }
      }
    },
    {
      caption: '3/5 · Second Block (Block 1): Loaded into the second available cache slot (I/O = 2, Hits = 6).',
      run: (p, f, dur, tl) => {
        const j = 1;
        tl.to(p.ptr, { x: p.blockX(j) + p.cellW / 2, duration: dur * 0.2 })
          .to(p.cells[j * IC_B], { read: 255, duration: dur * 0.2 }, '<')
          .set(p.copies[j], { alpha: 255 })
          .to(p.copies[j], { x: p.slotX(1), y: p.cacheY, duration: dur * 0.5, ease: 'power2.inOut' }, '<')
          .to(p.st, { io: 2, duration: dur * 0.2 }, '<');
        for (let k = 1; k < IC_B; k++) {
          tl.to(p.ptr, { x: p.blockX(j) + k * p.cellW + p.cellW / 2, duration: dur * 0.15 })
            .to(p.cells[j * IC_B + k], { read: 255, duration: dur * 0.15 }, '<')
            .to(p.st, { hit: '+=' + 1, roundProps: 'hit', duration: dur * 0.1 }, '<');
        }
      }
    },
    {
      caption: '4/5 · Cache Full & Eviction (Block 2): Cache capacity reached! Evicting block 0 to load block 2.',
      run: (p, f, dur, tl) => {
        const j = 2;
        tl.to(p.copies[0], { alpha: 0, y: p.cacheY - 30, duration: dur * 0.4 })
          .to(p.ptr, { x: p.blockX(j) + p.cellW / 2, duration: dur * 0.2 }, '<')
          .to(p.cells[j * IC_B], { read: 255, duration: dur * 0.2 }, '<')
          .set(p.copies[j], { alpha: 255 })
          .to(p.copies[j], { x: p.slotX(0), y: p.cacheY, duration: dur * 0.5, ease: 'power2.inOut' }, '<')
          .to(p.st, { io: 3, duration: dur * 0.2 }, '<');
        for (let k = 1; k < IC_B; k++) {
          tl.to(p.ptr, { x: p.blockX(j) + k * p.cellW + p.cellW / 2, duration: dur * 0.15 })
            .to(p.cells[j * IC_B + k], { read: 255, duration: dur * 0.15 }, '<')
            .to(p.st, { hit: '+=' + 1, roundProps: 'hit', duration: dur * 0.1 }, '<');
        }
      }
    },
    {
      caption: '5/5 · Full Scan Complexity: For n = 24 elements, total block transfers Q = n / B = 24 / 4 = 6 blocks.',
      run: (p, f, dur, tl) => {
        for (let j = 3; j < IC_BLOCKS; j++) {
          const slot = j % IC_SLOTS;
          const prevInSlot = j - IC_SLOTS;
          tl.to(p.copies[prevInSlot], { alpha: 0, y: p.cacheY - 30, duration: dur * 0.2 }, '<')
            .to(p.ptr, { x: p.blockX(j) + p.cellW / 2, duration: dur * 0.15 }, '<')
            .set(p.copies[j], { alpha: 255 })
            .to(p.copies[j], { x: p.slotX(slot), y: p.cacheY, duration: dur * 0.25, ease: 'power2.inOut' }, '<')
            .to(p.st, { io: j + 1, duration: dur * 0.1 }, '<');
          for (let k = 0; k < IC_B; k++) {
            tl.to(p.cells[j * IC_B + k], { read: 255, duration: dur * 0.05 }, '<')
              .to(p.st, { hit: '+=' + (k > 0 ? 1 : 0), roundProps: 'hit', duration: dur * 0.05 }, '<');
          }
        }
      }
    }
  ],
  { prevBtn: 'btn-cache-prev', nextBtn: 'btn-cache-next', badge: 'badge-cache-step', resetBtn: 'btn-cache-reset' }
);


/* ==========================================================================
   SIM 6 — Weight-Balanced Invariant (Parameter α)
   ========================================================================== */
const WB_ALPHA = 0.2;

const simBal = pkdMakeSteppedSim('sim-balance',
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

    // Tree visualization
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

    // Ratio progress bar
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
  [
    {
      caption: '1/4 · Perfectly Balanced Tree: 10 elements on left and 10 on right → Ratio |T.lc|/|T| = 0.50.',
      run: (p, f, dur, tl) => {
        tl.set(p.st, { lc: 10, rc: 10, flash: 0 });
      }
    },
    {
      caption: '2/4 · Moderate Batch Insertion: 4 elements added to left (14 | 10) → Ratio = 0.58 (Tolerated within ±α).',
      run: (p, f, dur, tl) => {
        tl.to(p.st, { lc: 14, duration: dur * 0.8, ease: 'power1.inOut' });
      }
    },
    {
      caption: '3/4 · Invariant Violation: Another skewed batch brings left to 30 (30 | 10) → Ratio = 0.75 > 0.70 (Unbalanced)!',
      run: (p, f, dur, tl) => {
        tl.to(p.st, { lc: 30, duration: dur * 0.9, ease: 'power1.inOut' });
      }
    },
    {
      caption: '4/4 · Lazy Local Reconstruction: Only the unbalanced subtree is reconstructed in parallel (Sec. 4).',
      run: (p, f, dur, tl) => {
        tl.to(p.st, { flash: 255, duration: dur * 0.25, yoyo: true, repeat: 3 })
          .to(p.st, { lc: 20, rc: 20, duration: dur * 0.7, ease: 'power3.inOut' });
      }
    }
  ],
  { prevBtn: 'btn-bal-prev', nextBtn: 'btn-bal-next', badge: 'badge-bal-step', resetBtn: 'btn-bal-reset' }
);

window.PKD = { kd: simKd, table: simTable, log: simLog, fj: simFJ, cache: simCache, bal: simBal };
