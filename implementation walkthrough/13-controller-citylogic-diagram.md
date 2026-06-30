# 13 - Diagramma Pattern Controller Citylogic-Engine-BYZZ

**Data:** 2026-06-30
**Componente:** `05-modellazione-design.html`

**Obiettivo:**
Inserire un diagramma Mermaid al termine della sezione "GRASP: Controller" per illustrare visivamente l'architettura MVC applicata nel progetto `Citylogic-Engine-BYZZ`.

**Azione:**
- Sfruttate le classi globali Mermaid (`:::good`, `:::purple`, `:::grey`) definite in precedenza.
- Inserito un `flowchart LR` che posiziona:
  - **A sinistra**: La logica core del gioco (Modello), rappresentata dalle classi esperte `Citta`, `Griglia` ed `EntityFactory`.
  - **Al centro**: Il `GameController`, evidenziato in viola come mediatore del flusso.
  - **A destra**: Le azioni dell'utente (View), come il menu tasse, click per la costruzione e l'avanzamento del giorno.
- I collegamenti evidenziano il flusso di informazioni bidirezionale per cui tutti i nodi si rivolgono al Controller per lo smistamento (disaccoppiando Model e View).

**Risultato:**
Il principio Controller del GRASP è ora ancorato visivamente all'architettura effettiva sviluppata nel progetto dello studente, fornendo un caso d'uso esplicativo eccellente.
