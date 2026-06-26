# 10 - Cloud AWS Deep Dive

## Obiettivo della modifica
Espandere l'argomento "Cloud AWS" (Macroargomento 07) introducendo nuovi concetti architetturali e operativi nel cloud, seguendo la richiesta dell'utente. 

## Modifiche effettuate
File interessato: `EDIDS/argomenti/07-cloud-aws.html`

- **Paradigma Cloud**: Ampliata la spiegazione della metafora **Pets vs Cattle**.
- **Storage**: Aggiunta la sezione *Storage Deep Dive* includendo una chiara distinzione tra Object Storage (S3), Block Storage (EBS) e File Storage (EFS).
- **Database Cloud**: Creata una nuova sezione dedicata per confrontare dettagliatamente i database relazionali (RDS e Aurora) con i database NoSQL (DynamoDB), includendo i vari trade-off per scalabilità e latenza.
- **Networking e Sicurezza**: Introdotto un confronto approfondito tra Security Groups e Network ACL. Inoltre, è stata inserita una nuova card sulla **Crittografia Avanzata** confrontando AWS KMS e AWS CloudHSM.
- **Infrastructure as Code (IaC) e Automazione**: Sezione dedicata a IaC estesa per confrontare Terraform e AWS CDK. Aggiunta infine una sezione riguardante i **Cloud TuringBots** per documentare l'avvento dell'Intelligenza Artificiale Generativa applicata al provisioning infrastrutturale.

## Conformità alle regole
- La separazione tra UI e dati/testo è rimasta consistente.
- Non ci sono modifiche a codice hardcoded, in quanto è stato integrato puramente il markup HTML.
- Questo file traccia l'implementazione come richiesto dalle regole di progetto (aggiornamento del "implementation walkthrough").
