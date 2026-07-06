# Regole Generali del Progetto 7Katch.github.io

Queste regole si applicano a tutto il workspace e hanno la priorit√† su qualsiasi altra impostazione.

## 1. Iconografia e Simboli
- **MAI usare emoji testuali o simboli Unicode** (come üõë, ‚ñ∂, ‚è∏, ‚Ñπ, ecc.) all'interno del codice HTML per l'interfaccia utente.
- Il progetto utilizza esclusivamente le **Bootstrap Icons (`bi`)**.
- Quando ti viene richiesto di aggiungere un'icona (ad esempio "freccia", "play", "pausa", "info"), inserisci sempre l'elemento `<i>` corrispondente.
  - Esempi corretti: `<i class="bi bi-play-fill"></i>`, `<i class="bi bi-arrow-right"></i>`, `<i class="bi bi-arrow-counterclockwise"></i>`.

## 2. Completezza e Approfondimento
- **Mai tralasciare contenuti**: Quando viene richiesto di riassumere o estrarre teoria da un PDF/documento sorgente (come .Lezioni.md), Ë assolutamente vietato omettere concetti. Ogni argomento affrontato nel documento sorgente deve essere riportato, spiegato e approfondito, senza scorciatoie.

## 3. Rappresentazioni Visive e Interattive
- **Uso proattivo di diagrammi e animazioni**: Ogni volta che un concetto complesso (algoritmi, flussi di dati, architetture) puÚ essere spiegato meglio visivamente, DEVI integrare esempi interattivi o grafici. Utilizza **Mermaid.js** per diagrammi statici/schemi architetturali e **P5.js + GSAP** (seguendo l'apposita skill) per simulazioni interattive e animazioni fluide. L'obiettivo Ë stupire l'utente e rendere l'apprendimento pi˘ intuitivo possibile.

## 4. Sincronizzazione Documentazione Animazioni
- **Aggiornamento Tutorial**: Ogni volta che viene modificato o aggiornato il file `shared/animation.js`, DEVI obbligatoriamente aggiornare in parallelo il documento `animation_tutorial.md` (situato nella root del repository, allo stesso livello di `README.md`) per riflettere le nuove aggiunte, classi, metodi o modifiche al framework di animazione.

## 5. Stile dei Diagrammi Mermaid
- **Uso dei preset personalizzati**: Quando si costruiscono diagrammi lowchart con Mermaid.js, NON usare stili manuali inline (es. `style Nodo fill:...`).
- Assicurati di includere sempre lo script `<script type="module" src="/shared/custom-diagrams.js"></script>` alla fine della pagina HTML.
- Utilizza le classi CSS personalizzate gi pronte tramite la sintassi di stile: `style NomeNodo :::colore`. I colori disponibili sono: `bad` (rosso), `good` (verde), `blue`, `purple`, `yellow`, `grey`.
