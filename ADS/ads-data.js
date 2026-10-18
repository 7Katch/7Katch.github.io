const ADS_DATA = [
  {
    "id": "01",
    "href": "#",
    "title": "Introduzione ai DBMS",
    "theme": "teal",
    "badge": "Core",
    "badgeClass": "ab-teal",
    "ovSub": "Evolution · Data Independence · Transaction · ACID properties",
    "subs": [
      {
        "title": "Evolution of Data Management",
        "tag": "Storia",
        "desc": "Dai manual record managers fino ai database relazionali, distribuiti, paralleli, e NoSQL."
      },
      {
        "title": "Data Independence e Transazioni",
        "tag": "Fondamenti",
        "desc": "Isolamento logico e fisico dei dati (Data Independence) e proprietà delle transazioni (ACID: Atomicity, Consistency, Isolation, Durability)."
      }
    ]
  },
  {
    "id": "02",
    "href": "#",
    "title": "Modelli Dati e Architettura",
    "theme": "amber",
    "badge": "Theory",
    "badgeClass": "ab-amber",
    "ovSub": "Hierarchical · Network · Relational · Levels of Abstraction",
    "subs": [
      {
        "title": "Generazioni di Modelli Dati",
        "tag": "Modelli",
        "desc": "Modello gerarchico, a rete e modello relazionale introdotto da E.F. Codd, basato su tabelle e tuple."
      },
      {
        "title": "Architettura di un DBMS",
        "tag": "Architettura",
        "desc": "Struttura Client/Server (2-tier e 3-tier) e livelli di astrazione: Physical Schema, Conceptual Schema e Views multiple."
      }
    ]
  },
  {
    "id": "03",
    "href": "#",
    "title": "Modello E-R (Entity-Relationship)",
    "theme": "coral",
    "badge": "Design",
    "badgeClass": "ab-coral",
    "ovSub": "Entities · Relationships · Keys · Weak Entities · Aggregation",
    "subs": [
      {
        "title": "Costrutti di Base",
        "tag": "Costrutti",
        "desc": "Definizione di Entità, attributi, e set di Relazioni, introdotte da Peter Chen."
      },
      {
        "title": "Chiavi e Vincoli",
        "tag": "Vincoli",
        "desc": "Superkey, candidate key, primary key, e la distinzione tra entità forti ed entità deboli (Weak Entities)."
      }
    ]
  },
  {
    "id": "04",
    "href": "#",
    "title": "ER-to-Relational Mapping",
    "theme": "green",
    "badge": "Design",
    "badgeClass": "ab-green",
    "ovSub": "Mapping 1:1, 1:N, M:N · Weak Entities Mapping",
    "subs": [
      {
        "title": "Traduzione del Modello",
        "tag": "Mapping",
        "desc": "Regole per convertire entità forti, entità deboli e associazioni (1:1, 1:N, M:N) in tabelle del modello relazionale."
      }
    ]
  },
  {
    "id": "05",
    "href": "#",
    "title": "Linguaggio SQL",
    "theme": "purple",
    "badge": "Practice",
    "badgeClass": "ab-purple",
    "ovSub": "DDL · DML · SELECT · JOIN · GROUP BY · INSERT/UPDATE/DELETE",
    "subs": [
      {
        "title": "Data Manipulation (DML)",
        "tag": "Query",
        "desc": "Istruzioni per l'interrogazione dei dati (SELECT, WHERE, JOIN, Outer Join) e operatori insiemistici."
      },
      {
        "title": "Funzioni e Modifiche",
        "tag": "Operazioni",
        "desc": "Funzioni di aggregazione (COUNT, SUM, AVG) con GROUP BY/HAVING e comandi di manipolazione: INSERT, UPDATE, DELETE."
      },
      {
        "title": "Data Definition (DDL)",
        "tag": "Schema",
        "desc": "Creazione e modifica delle strutture del database: CREATE TABLE, ALTER, DROP, e definizione dell'integrità referenziale."
      }
    ]
  },
  {
    "id": "06",
    "href": "#",
    "title": "Indicizzazione",
    "theme": "blue",
    "badge": "Perf",
    "badgeClass": "ab-blue",
    "ovSub": "CREATE INDEX · Primary vs Secondary · Clustered vs Unclustered",
    "subs": [
      {
        "title": "Gestione Indici",
        "tag": "Strutture",
        "desc": "Utilizzo di CREATE INDEX per velocizzare le letture. Classificazione degli indici: primari vs secondari, clusterizzati vs non clusterizzati."
      }
    ]
  },
  {
    "id": "06b",
    "href": "06-kdtree-intro.html",
    "title": "kd-tree da Zero",
    "theme": "teal",
    "badge": "Fondamenti",
    "badgeClass": "ab-teal",
    "ovSub": "Spazio 2D · Tagli alternati · Mediana · Nearest Neighbor · Range Query",
    "subs": [
      {
        "title": "Perché il BST 1D fallisce",
        "tag": "Motivazione",
        "desc": "Ordinare su una sola dimensione alla volta perde la correlazione spaziale; serve partizionare su più assi contemporaneamente."
      },
      {
        "title": "Costruzione e Tagli Alternati",
        "tag": "Struttura",
        "desc": "Alternanza delle dimensioni X e Y ad ogni livello e scelta della mediana per garantire altezza logaritmica."
      },
      {
        "title": "Nearest Neighbor & Range Search",
        "tag": "Query",
        "desc": "Come il cerchio di tolleranza nel backtracking pota interi sottoalberi e come funzionano i filtri a finestra rettangolare."
      }
    ]
  },
  {
    "id": "07",
    "href": "07-pkd-tree.html",
    "title": "Parallel kd-tree (Pkd-tree)",
    "theme": "teal",
    "badge": "SIGMOD '25",
    "badgeClass": "ab-teal",
    "ovSub": "kd-tree · Log-tree vs Pkd · Work-Span · Ideal-Cache · Weight-balance α",
    "subs": [
      {
        "title": "Motivation & Overview",
        "tag": "Sec. 1",
        "desc": "Why parallelize kd-trees, shortcomings of CGAL, BHL-tree, and Log-tree, and Pkd-tree contributions."
      },
      {
        "title": "Preliminaries",
        "tag": "Sec. 2",
        "desc": "Fork-join work-span model, ideal-cache model, formal kd-tree definition, and weight-balancing."
      }
    ]
  }
];
