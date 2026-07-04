/**
 * SO Index Engine — v2.0
 * Genera dinamicamente la griglia e gli accordion da SO_DATA.
 * Nessun contenuto hardcoded: tutto viene da so-data.js.
 */

/* ── Mappa ID → nome file reale ── */
const FILE_MAP = {
  "01": "01-sistemi-operativi.html",
  "02": "02-processi.html",
  "03": "03-thread.html",
  "04": "04-cpu-scheduling.html",
  "05": "05-sincronizzazione.html",
  "06": "06-deadlocks.html",
  "07": "07-main-memory.html",
  "08": "08-virtual-memory.html",
  "09": "09-io-systems.html",
  "10": "10-mass-storage.html",
  "11": "11-file-system.html",
  "12": "12-embedded-systems.html",
  "13": "13-sicurezza.html",
  "14": "14-laboratori-teoria.html"
};

document.addEventListener("DOMContentLoaded", () => {
  const data = (typeof SO_DATA !== 'undefined') ? SO_DATA : [];

  const gridEl   = document.getElementById("overview-grid-container");
  const accEl    = document.getElementById("accordion-container");
  const statMac  = document.getElementById("stat-macro");
  const statMic  = document.getElementById("stat-micro");

  if (!data.length) { console.error("SO_DATA non trovato!"); return; }

  /* ── 1. Counter dinamici ── */
  let totalSubs = 0;
  data.forEach(ch => { totalSubs += ch.subs.length; });
  if (statMac) statMac.textContent = data.length;
  if (statMic) statMic.textContent = totalSubs + "+";

  /* ── 2. Griglia overview ── */
  if (gridEl) {
    gridEl.innerHTML = data.map(ch => {
      const href = "argomenti/" + (FILE_MAP[ch.id] || (ch.id + ".html"));
      return `
        <a href="${href}" class="overview-card ov-${ch.theme}" style="cursor:pointer">
          <div class="ov-num">${ch.id} · ${ch.badge}</div>
          <div class="ov-title">${ch.title}</div>
          <div class="ov-sub">${ch.ovSub}</div>
        </a>`;
    }).join("");
  }

  /* ── 3. Accordion ── */
  if (accEl) {
    accEl.innerHTML = data.map(ch => {
      const subsHtml = ch.subs.map(sub => {
        const tagSpan = sub.tag ? `<span class="sub-tag">${sub.tag}</span>` : "";
        return `
          <div class="sub-item">
            <div class="sub-dot" style="background:var(--${ch.theme})"></div>
            <div>
              <div class="sub-title">${sub.title} ${tagSpan}</div>
              <div class="sub-desc">${sub.desc}</div>
            </div>
          </div>`;
      }).join("");

      return `
        <div class="acc-item ${ch.theme}-theme" onclick="toggle(this)">
          <div class="acc-header">
            <div class="acc-left">
              <span class="acc-num">${ch.id}</span>
              <span class="acc-title">${ch.title}</span>
              <span class="acc-badge ${ch.badgeClass}">${ch.badge}</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="acc-count">${ch.subs.length} argomenti</span>
              <span class="acc-chevron">▼</span>
            </div>
          </div>
          <div class="acc-body">
            <div class="sub-list">${subsHtml}</div>
          </div>
        </div>`;
    }).join("");
  }
});

/* ── Toggle Accordion ── */
window.toggle = function (el) { el.classList.toggle("open"); };
