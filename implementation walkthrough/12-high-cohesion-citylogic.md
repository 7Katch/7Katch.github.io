# 12 - High Cohesion & Contextualizzazione Citylogic-Engine-BYZZ

**Data:** 2026-06-30
**Componente:** `05-modellazione-design.html`

**Obiettivo:**
Inserire un esempio pratico reale del progetto "Citylogic-Engine-BYZZ" all'interno della documentazione EDIDS (sezione GRASP: High Cohesion), rispettando la rigorosa divisione architetturale MVC imposta dalle regole di progetto.

**Azione:**
- Modificato il file `05-modellazione-design.html` nella sezione High Cohesion (righe 1044-1056).
- Sostituito il vecchio esempio generico (`GameManager`) con un caso di studio reale focalizzato sulla classe `MainView`.
- Viene illustrato chiaramente il problema di **Bassa Coesione** (l'anti-pattern in cui `MainView` tenta di gestire sia l'aggiornamento dell'interfaccia JavaFX sia i calcoli di business come le tasse della città) contrapposto alla **Alta Coesione** raggiunta grazie all'applicazione dei principi MVC.
- La soluzione delegata mostra che:
  - `MainView` (View) ha la singola responsabilità di disegnare l'interfaccia.
  - `GameController` (Controller) ha il ruolo di catturare l'input e smistarlo.
  - `Citta` (Model) ha la responsabilità esclusiva del calcolo (Information Expert per tasse e statistiche).

**Risultato:**
L'appunto didattico è ora intimamente legato al codice prodotto dallo studente, rinforzando la comprensione del pattern MVC applicato rigorosamente per implementare l'High Cohesion e diminuire l'accoppiamento della UI.
