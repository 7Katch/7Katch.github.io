# 15 - Pure Fabrication tramite SaveManager in Citylogic

**Data:** 2026-06-30
**Componente:** `05-modellazione-design.html`

**Obiettivo:**
Fondere il concetto di Pure Fabrication con un caso di studio reale individuato dallo studente nel progetto `Citylogic-Engine-BYZZ`: l'astrazione del salvataggio del gioco tramite un `SaveManager`.

**Azione:**
- Sostituzione dei generici esempi su Pure Fabrication con una narrazione incentrata esclusivamente su `Simulatore` e `SaveManager`.
- Sviluppo di un blocco visivo duale con diagrammi Mermaid basati sulle classi stilistiche globali appena create (`:::good` e `:::bad`):
  - *Errore di progettazione (Senza Pure Fabrication)*: Realizzato un diagramma Mermaid `flowchart TD` simulante una classe UML gigante (God Class). Mostra il nodo `Simulatore` contenente sia i metodi di logica core (`avanzaTempo()`) sia i metodi tecnici spuri (`salvaPartita()`, `caricaPartita()`), dipinto di rosso.
  - *Design Architetturale (Con Pure Fabrication)*: Realizzato un `flowchart LR` in verde in cui un `Simulatore` reso "puro" delega unicamente il File I/O a una classe esterna inventata per il task: il `SaveManager`.

**Risultato:**
Il principio Pure Fabrication è ora spiegato e documentato attraverso la soluzione esatta impiegata (e compresa perfettamente) dallo studente nel suo codice reale. Questo rinforza ulteriormente l'aderenza documentale all'implementazione GRASP nel progetto.
