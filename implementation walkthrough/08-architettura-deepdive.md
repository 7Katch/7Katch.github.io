# 08 - Approfondimento Architettura Software

**Obiettivo:** Trasformare l'elenco puntato sintetico presente in `EDIDS/argomenti/04-architettura.html` in una serie di sezioni informative complete e strutturate, in modo da essere in linea con i moduli precedenti per la consultazione e lo studio.

## Modifiche effettuate
1. **Sostituzione dell'Interfaccia Appunti:**
   - La `checklist-box` è stata rimossa per fare spazio al consueto `index-grid` iniziale.
   - Sono stati creati 4 `section-block` tematici principali.
2. **Dettaglio delle Sezioni:**
   - **Architettura vs Design:** Differenza esplicitata (struttura ad alto livello vs implementazione locale).
   - **Modelli di Rappresentazione:** Descrizione approfondita delle viste del modello 4+1 di Philippe Kruchten e dei 4 livelli di astrazione del Modello C4. Inseriti due `card-def` per raggruppare i rispettivi modelli per un migliore impatto visivo.
   - **Pattern e Stili:** Spiegazione più estesa dei vari stili (Layered, MVC, Client-Server, Pipe-Filter, Event-Bus).
   - **Evoluzione all'Architettura Distribuita:** Espansione del percorso storico dal Monolite alla SOA, fino alla svolta moderna verso l'architettura a Microservizi e i suoi pro/contro (indipendenza dei db vs complessità di rete).
3. **Ottimizzazione Codice & Consistenza:**
   - Inserita la navigazione tra le pagine `03 · Requisiti` e `05 · Modellazione & Design` in fondo al documento.
   - Lo script JavaScript "inline" rimosso a favore dell'integrazione di `<script src="../../shared/katchkit.js"></script>`, mantenendo la filosofia del riuso per MVC/Shared components.

Tutti gli sviluppi sono stati allineati ai principi di design GRASP (Low Coupling) e alle user rules, sfruttando logica e stili della cartella "shared".
