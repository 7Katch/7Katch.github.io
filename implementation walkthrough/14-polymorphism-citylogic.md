# 14 - Polimorfismo nel calcolo delle Tasse (Citylogic)

**Data:** 2026-06-30
**Componente:** `05-modellazione-design.html`

**Obiettivo:**
Sostituire gli esempi generici sul Polimorfismo con l'applicazione diretta e pratica tratta da `Citylogic-Engine-BYZZ` relativa al calcolo delle tasse degli edifici.

**Azione:**
- Eliminazione degli esempi 1-4 (Gioco, Pagamenti, Forme, Report).
- Modifica del blocco "Sbagliato vs Corretto": 
  - Mostrato un approccio errato basato sul confronto di stringhe (`edificio.getTipo().equals("Residenziale")`), sottolineando l'elevato rischio di refusi e la violazione dell'Open/Closed Principle.
  - Mostrato l'approccio corretto basato sul polimorfismo (`edificio.calcolaTassa()`).
- Riscrittura del blocco di codice in Java mostrando la dichiarazione dell'interfaccia `Tassabile`, le due implementazioni concrete (`EdificioResidenziale` e `EdificioCommerciale`) e infine il ciclo for in cui la classe `Citta` usa il polimorfismo senza preoccuparsi dell'implementazione concreta.

**Risultato:**
I principi GRASP sono ora al 100% integrati e allineati con la logica del progetto di riferimento, facilitando l'apprendimento e il ripasso dell'architettura stessa per l'esame/progetto.
