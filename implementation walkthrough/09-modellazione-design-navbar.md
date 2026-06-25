# 09 - Modellazione & Design: Navigazione e Sidebar

**Obiettivo:** Ottimizzare la navigazione interna ed esterna della pagina `EDIDS/argomenti/05-modellazione-design.html`, riempiendo i link interni ai pattern e assicurando che la UI sia coesa col resto del progetto.

## Modifiche effettuate
1. **Rifacimento "Concetti Chiave" (Inizio pagina):**
   - L'introduzione originariamente formattata come `checklist-box` (sprovvista di stili appropriati in `katchkit.css`) è stata completamente sostituita con una moderna `index-grid`.
   - I concetti su UML e Model-Driven sono stati convertiti in eleganti `card-def`, mantenendo i colori e i font coerenti col design system di base e mitigando l'impatto del bianco puro.
2. **Refactoring di tutti i Pattern GRASP e GoF (Corpo centrale):**
   - Ho eseguito uno script automatizzato per trasformare il codice legacy di tutte le 11 sezioni (9 GRASP + 2 GoF).
   - Le vecchie classi (`section`, `grasp-card`, `eyebrow`, `section-intro`) sono state aggiornate con la nuova sintassi Katchkit: `<div class="section-block">`, `<h2><span class="dot"></span>...</h2>`, e i contenitori `<div class="card-def">`.
   - Questo intervento risolve le instanze restanti di bianco puro che stonavano (es. `section-intro` e i vecchi `h3` senza colore specifico), garantendo un gradevole testo attenuato (`var(--text-secondary)`).
3. **Tabella Riassuntiva GRASP (Fine pagina):**
   - La classe `summary-table` non possedeva styling globali. È stato implementato uno stile di tabella inline custom, impostando i colori in base alle variabili del tema (es. `var(--kk-primary)`, `var(--text-secondary)`).
   - Questo ha risolto il fastidioso contrasto non voluto generato dal bianco puro (`#fff`) rispetto allo sfondo scuro, rispettando meglio la palette semantica del sito e garantendo ottima leggibilità.
4. **Sidebar Customizzata (`sb-sections`):**
   - L'elenco `sb-sections`, inizialmente vuoto o con semplici ancore `<a>`, è stato riscritto manualmente per supportare 12 sezioni.
   - Per non perdere lo stile coerente con gli altri file, ho utilizzato la sintassi standard richiesta da Katchkit: `<button class="sb-link" data-target="ie"><span class="sb-idx">05.01</span>...`.
   - Questo garantisce che i link laterali mostrino la tipica numerazione "05.XX", abbiano gli stessi stili hover e permettano allo script JS di attivare lo smooth-scrolling e l'evidenziazione dinamica della voce attiva.
5. **Aggiornamento logica auto-generazione Katchkit:**
   - Ho modificato il file core `shared/katchkit.js` introducendo il supporto a `data-no-sidebar="true"` per fare in modo che la griglia iniziale non distrugga più la nostra sidebar personalizzata da 12 elementi.
6. **Navigazione orizzontale a fondo pagina e Pulizia script:**
   - Introdotto il div `back-btn-wrap` alla fine dei contenuti principali.
   - Lo script esplicito per la sidebar è stato eliminato a favore dell'inclusione dinamica di `<script src="../../shared/katchkit.js"></script>`.

Questo intervento rende finalmente agibile l'utilizzo della sidebar nella lunga dispensa dedicata al design software e facilita lo scorrimento progressivo della guida didattica.
