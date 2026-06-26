# 11 - Evoluzione e Riuso Deep Dive

## Obiettivo della modifica
Espandere l'argomento "Evoluzione e Riuso" (Macroargomento 08) integrando i concetti ingegneristici formali relativi alla manutenzione, ai sistemi legacy, alle dipendenze e alla SBOM, come richiesto dall'utente sulla base del PDF del corso.

## Modifiche effettuate
File interessato: `EDIDS/argomenti/08-evoluzione-riuso.html`

- **Cause del Cambiamento**: Inserita una nuova card che elenca esplicitamente i motivi che portano un software a evolvere (nuovi requisiti, cambiamenti di business, nuovi servizi, fix di errori, obsolescenza hardware).
- **Sistemi Legacy**: Dettagliata la struttura in 4 componenti (System hardware, Support software, Application software, Application data). Aggiunta inoltre una card sui "Fattori di Valutazione" (linguaggio, configuration management, test data, personnel skills) necessari per l'analisi dei sistemi obsoleti.
- **AI e Manutenzione (TuringBots)**: Aggiunta una card che descrive il ruolo dell'Intelligenza Artificiale come *Refactoring Agent* e *Legacy Translator* (explain code, migrazione di linguaggio, refactoring intelligente).
- **Dipendenze Transitive**: Espanso il concetto di "Glue Code" introducendo l'impatto critico delle dipendenze transitive ("software you don't even know") e menzionando il comando pratico `mvn dependency:tree` per la loro gestione.
- **SBOM e Licenze**: Arricchito il blocco sulla sicurezza della Supply Chain. Inseriti i dettagli tecnici della SBOM (identificatori SPDXID, PackageChecksum, gerarchie), le 4 operazioni principali (Consume, Diff, Analyze, Transform) e l'importanza del Licencing (conformità legale del software open source).

## Conformità alle regole
- Mantenuto lo standard UI del progetto (carte, classi e layout).
- Nessun dato inserito in modo hardcoded (integrazione testuale pura in HTML).
- L'aggiornamento è tracciato correttamente all'interno della cartella "implementation walkthrough".
