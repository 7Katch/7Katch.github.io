const SO_DATA = [
  {
    "id": "01",
    "title": "Sistemi Operativi",
    "theme": "amber",
    "badge": "Base",
    "badgeClass": "ab-amber",
    "ovSub": "Definizione · Struttura · Multiprocessori · NUMA · Servizi · System calls · Microkernels",
    "subs": [
      {
        "title": "Definizione",
        "tag": "fondamento",
        "desc": "Il SO è il software che gestisce l'hardware e fornisce servizi alle applicazioni. Fa da intermediario tra l'utente e le risorse fisiche della macchina."
      },
      {
        "title": "Struttura \"Computer System\"",
        "tag": null,
        "desc": "Architettura a strati: hardware  kernel  sistema operativo  applicazioni  utente. Ogni livello espone servizi al livello superiore."
      },
      {
        "title": "Sistemi Multiprocessori",
        "tag": null,
        "desc": "Più CPU condividono memoria e bus. Aumentano throughput e affidabilità. Si distinguono in sistemi simmetrici (SMP) e asimmetrici."
      },
      {
        "title": "Architettura SMP & Multicore design",
        "tag": null,
        "desc": "Symmetric Multi-Processing: tutte le CPU hanno uguale accesso alla memoria. Il multicore integra più core nello stesso chip, riducendo latenza e consumo."
      },
      {
        "title": "Non-Uniform Memory Access (NUMA)",
        "tag": null,
        "desc": "In sistemi con molte CPU, ogni processore ha memoria \"locale\" (accesso rapido) e memoria \"remota\" (accesso più lento). Il SO deve minimizzare accessi remoti."
      },
      {
        "title": "Servizi OS",
        "tag": null,
        "desc": "Gestione processi, memoria, file system, I/O, comunicazione inter-processo, protezione e sicurezza, interfaccia utente (CLI/GUI)."
      },
      {
        "title": "System Calls",
        "tag": null,
        "desc": "Interfaccia programmabile tra applicazione e kernel. Esempi: fork(), read(), write(), open(), exit(). Causano un cambio di contesto da user mode a kernel mode."
      },
      {
        "title": "Implementazione delle System Calls",
        "tag": null,
        "desc": "Tramite trap/interrupt software: l'applicazione carica un numero di syscall in un registro e genera un'interruzione. Il kernel legge il numero e chiama l'handler corretto."
      },
      {
        "title": "Esempi di System Calls",
        "tag": null,
        "desc": "Categorie: Process control (fork, exec), File management (open, read, write), Device management (ioctl), Communications (socket, send)."
      },
      {
        "title": "Struttura OS",
        "tag": null,
        "desc": "Approcci architetturali: monolitico (Linux), a strati, a microkernel, modulare. Ogni approccio bilancia performance, manutenibilità e sicurezza."
      },
      {
        "title": "Microkernels",
        "tag": null,
        "desc": "Solo le funzioni essenziali nel kernel (IPC, gestione memoria base, scheduling). Tutto il resto (driver, filesystem) gira in user space come server. Più sicuro, ma overhead di comunicazione."
      },
      {
        "title": "Moduli",
        "tag": null,
        "desc": "I kernel moderni (Linux) supportano moduli caricabili dinamicamente: driver e funzionalità aggiuntive aggiunte/rimosse a runtime senza riavviare il sistema."
      }
    ]
  },
  {
    "id": "02",
    "title": "Processi",
    "theme": "amber",
    "badge": "Core",
    "badgeClass": "ab-amber",
    "ovSub": "PCB · Stati · Context switch · IPC · Shared memory · Message passing · Pipes · Buffering",
    "subs": [
      {
        "title": "Concetti del processo",
        "tag": "fondamento",
        "desc": "Un processo è un programma in esecuzione. Include il codice (text section), i dati (heap, stack) e le informazioni di contesto. Ogni processo ha il proprio spazio di indirizzi."
      },
      {
        "title": "Process Control Block (PCB)",
        "tag": null,
        "desc": "Struttura dati nel kernel che rappresenta un processo: PID, stato, program counter, registri CPU, informazioni di scheduling, gestione memoria, lista file aperti."
      },
      {
        "title": "Stato del processo",
        "tag": null,
        "desc": "Ciclo di vita: New  Ready  Running  Waiting  Terminated. Le transizioni sono gestite dallo scheduler e dagli eventi I/O."
      },
      {
        "title": "Context Switch",
        "tag": null,
        "desc": "Salvataggio del PCB del processo corrente e ripristino del PCB del prossimo processo da eseguire. È overhead puro: durante il switch la CPU non esegue lavoro utile."
      },
      {
        "title": "Creazione dei processi",
        "tag": null,
        "desc": "In Unix/Linux tramite fork() che crea un processo figlio (copia del padre). Il figlio può poi usare exec() per caricare un nuovo programma. Il padre può attendere il figlio con wait()."
      },
      {
        "title": "Albero dei processi in Linux",
        "tag": null,
        "desc": "Ogni processo (tranne PID 1 — init/systemd) ha un processo padre. Si forma una gerarchia ad albero ispezionabile con pstree."
      },
      {
        "title": "Terminazione processo",
        "tag": null,
        "desc": "Tramite exit() (normale) o segnali (SIGKILL, SIGSEGV). I processi terminati diventano zombie finché il padre non chiama wait() per raccogliere il valore di uscita."
      },
      {
        "title": "IPC — Shared Memory",
        "tag": null,
        "desc": "Due o più processi condividono una regione di memoria fisica. Comunicazione velocissima (nessuna copia), ma richiede sincronizzazione esplicita per evitare race condition."
      },
      {
        "title": "IPC — Message Passing",
        "tag": null,
        "desc": "I processi si scambiano messaggi tramite send/receive. Più sicuro della shared memory (nessuna memoria condivisa), ma overhead per la copia del messaggio nel kernel."
      },
      {
        "title": "Implementazione del Communication Link",
        "tag": null,
        "desc": "Il link può essere diretto (processi si nominano esplicitamente) o indiretto (tramite mailbox/porta). Può essere unidirezionale o bidirezionale, sincrono o asincrono."
      },
      {
        "title": "Sincronizzazione dei messaggi",
        "tag": null,
        "desc": "Bloccante (sincrona): il mittente aspetta che il ricevente riceva. Non bloccante (asincrona): il mittente continua dopo l'invio. La combinazione più comune: send non bloccante + receive bloccante."
      },
      {
        "title": "Buffering",
        "tag": null,
        "desc": "I messaggi sono accodati in un buffer prima della ricezione. Capacità zero (rendez-vous), limitata o illimitata. Determina il comportamento del blocco del mittente."
      },
      {
        "title": "Pipes",
        "tag": null,
        "desc": "Canale di comunicazione unidirezionale tra processi correlati (ordinarie) o non correlati (named pipe/FIFO). Implementa un buffer FIFO nel kernel. Usate intensamente nelle shell Unix (ls | grep foo)."
      },
      {
        "title": "THREADS",
        "tag": "anticipa cap.03",
        "desc": "Unità di esecuzione all'interno di un processo. Condividono codice, dati e file aperti con gli altri thread dello stesso processo, ma hanno stack e registri propri."
      }
    ]
  },
  {
    "id": "03",
    "title": "Thread",
    "theme": "amber",
    "badge": "Core",
    "badgeClass": "ab-amber",
    "ovSub": "User/Kernel threads · Many-to-one · One-to-one · Many-to-many · Thread pool · Parallelismo",
    "subs": [
      {
        "title": "Benefici del multithreading",
        "tag": null,
        "desc": "Responsività (UI sempre reattiva), condivisione risorse (nessuna IPC necessaria), economia (creare thread costa meno che creare processi), scalabilità su sistemi multicore."
      },
      {
        "title": "Concorrenza vs Parallelismo",
        "tag": null,
        "desc": "Concorrenza: più task in progresso nello stesso tempo (anche su singola CPU, con interleaving). Parallelismo: task eseguiti letteralmente nello stesso istante su più core."
      },
      {
        "title": "Parallelismo dei dati e dei task",
        "tag": null,
        "desc": "Data parallelism: stesso calcolo su sottoinsieme di dati su ogni core (es. somma di array). Task parallelism: operazioni diverse su dati diversi su ogni core."
      },
      {
        "title": "Legge di Amdahl",
        "tag": null,
        "desc": "Speedup massimo = 1 / (S + (1-S)/N) dove S è la frazione seriale e N il numero di core. Anche con infiniti core, la parte seriale limita il guadagno. Mostra l'importanza di ridurre le sezioni sequenziali."
      },
      {
        "title": "User e Kernel Threads",
        "tag": null,
        "desc": "User threads: gestiti dalla libreria a livello utente (es. pthreads), invisibili al kernel. Kernel threads: gestiti direttamente dal kernel, possono essere schedulati su core diversi."
      },
      {
        "title": "Modelli di multithreading",
        "tag": null,
        "desc": "Definisce come i thread utente si mappano sui thread kernel. Determina parallelismo reale e overhead."
      },
      {
        "title": "Many-to-One",
        "tag": null,
        "desc": "Molti thread utente  1 thread kernel. La libreria gestisce il multiplexing. Se un thread si blocca in I/O, tutti si bloccano. Nessun parallelismo reale. Usato in sistemi senza supporto kernel ai thread."
      },
      {
        "title": "One-to-One",
        "tag": null,
        "desc": "Ogni thread utente  1 thread kernel. Parallelismo reale su multicore. Overhead maggiore per ogni creazione. Modello usato da Linux e Windows."
      },
      {
        "title": "Many-to-Many",
        "tag": null,
        "desc": "N thread utente  M thread kernel (M ≤ N). Compromesso: parallelismo reale + flessibilità. Il kernel crea thread sufficienti e la libreria li gestisce. Thread pool pattern."
      }
    ]
  },
  {
    "id": "04",
    "title": "CPU Scheduling",
    "theme": "teal",
    "badge": "Gestione CPU",
    "badgeClass": "ab-teal",
    "ovSub": "FCFS · SJF · Round Robin · Priority · Multilevel Queue · CFS Linux",
    "subs": [
      {
        "title": "Concetti base & Criteri",
        "tag": "fondamento",
        "desc": "Lo scheduler decide quale processo/thread occupa la CPU. Criteri: CPU utilization (max), Throughput (max), Turnaround time (min), Waiting time (min), Response time (min)."
      },
      {
        "title": "FCFS — First Come First Served",
        "tag": null,
        "desc": "Il primo processo nella ready queue viene eseguito fino al termine (non preemptive). Semplice ma soffre dell'effetto convoy: un processo lungo blocca tutti i brevi dietro di sé."
      },
      {
        "title": "SJF — Shortest Job First",
        "tag": null,
        "desc": "Esegue prima il processo con CPU burst più breve. Minimizza il waiting time medio, ma richiede previsione del burst (spesso tramite media esponenziale). Può causare starvation dei processi lunghi."
      },
      {
        "title": "Round Robin (RR)",
        "tag": null,
        "desc": "Ogni processo riceve un quanto di tempo fisso (time quantum, tipicamente 10-100ms). Alla scadenza viene preempted e rimesso in fondo alla coda. Ottimo per time-sharing, il quantum influenza il tradeoff context switch / response time."
      },
      {
        "title": "Priority Scheduling",
        "tag": null,
        "desc": "Ogni processo ha una priorità; la CPU va al processo a priorità più alta. Problema: starvation dei processi a bassa priorità. Soluzione: aging (la priorità aumenta col tempo di attesa)."
      },
      {
        "title": "Multilevel Queue",
        "tag": null,
        "desc": "Più code separate per categorie di processi (foreground, background, batch). Ogni coda ha il proprio algoritmo e priorità. I processi non si spostano tra code."
      },
      {
        "title": "Multilevel Feedback Queue",
        "tag": null,
        "desc": "Come Multilevel Queue ma i processi possono muoversi tra code in base al comportamento. Un processo CPU-bound scende di priorità; uno interattivo sale. Il più flessibile e usato nella pratica."
      },
      {
        "title": "CFS — Completely Fair Scheduler (Linux)",
        "tag": null,
        "desc": "Lo scheduler di Linux moderno. Usa un albero rosso-nero ordinato per virtual runtime: esegue sempre il processo con meno vruntime. Garantisce equità e ottima interattività senza quantum fisso."
      }
    ]
  },
  {
    "id": "05",
    "title": "Sincronizzazione",
    "theme": "purple",
    "badge": "Concorrenza",
    "badgeClass": "ab-purple",
    "ovSub": "Race condition · Mutex · Semafori · Monitor · Problema produttore-consumatore",
    "subs": [
      {
        "title": "Race Condition",
        "tag": "problema",
        "desc": "Situazione in cui il risultato dipende dall'ordine di esecuzione di thread/processi concorrenti. Esempio classico: due thread incrementano la stessa variabile senza sincronizzazione  risultato non deterministico."
      },
      {
        "title": "Sezione critica & Mutual Exclusion",
        "tag": null,
        "desc": "Una sezione critica è codice che accede a risorse condivise. Tre requisiti: Mutua esclusione (un solo processo alla volta), Progress (decisione non indefinita), Bounded waiting (nessuna starvation)."
      },
      {
        "title": "Mutex Lock",
        "tag": null,
        "desc": "Lock binario: acquire() prima della sezione critica, release() dopo. Se il lock è occupato, il thread attende (busy waiting con spinlock, o sospensione con mutex blocking)."
      },
      {
        "title": "Semafori",
        "tag": null,
        "desc": "Variabile intera con due operazioni atomiche: wait(S) (P) decrementa e blocca se S≤0, signal(S) (V) incrementa e sveglia un thread in attesa. Binario (0/1) o contatore (gestisce N risorse)."
      },
      {
        "title": "Monitor",
        "tag": null,
        "desc": "Costrutto di alto livello (Java: synchronized). Garantisce che un solo thread alla volta esegua un metodo del monitor. Usa condition variables per wait()/notify()."
      },
      {
        "title": "Problema Produttore-Consumatore",
        "tag": null,
        "desc": "Il produttore genera dati, il consumatore li usa. Buffer condiviso di dimensione N. Soluzione con semafori: empty (slot liberi), full (slot pieni), mutex (accesso esclusivo al buffer)."
      },
      {
        "title": "Problema dei Lettori-Scrittori",
        "tag": null,
        "desc": "Più lettori possono leggere simultaneamente; uno scrittore richiede accesso esclusivo. Varianti: priorità ai lettori (possibile starvation scrittori) o priorità agli scrittori."
      },
      {
        "title": "Problema dei 5 Filosofi",
        "tag": null,
        "desc": "Classico problema di sincronizzazione: 5 filosofi, 5 bacchette condivise. Ogni filosofo ne serve 2. Naive solution  deadlock. Soluzioni: asimmetria, pickup atomico, semaforo limite (max 4 filosofi a tavola)."
      }
    ]
  },
  {
    "id": "06",
    "title": "Deadlocks",
    "theme": "coral",
    "badge": "Problemi",
    "badgeClass": "ab-coral",
    "ovSub": "Condizioni necessarie · Grafo di allocazione · Prevenzione · Evitamento · Banker's algorithm · Rilevamento",
    "subs": [
      {
        "title": "Condizioni necessarie (Coffman)",
        "tag": "fondamento",
        "desc": "Tutte e 4 devono verificarsi simultaneamente: Mutual exclusion, Hold and wait (tieni e aspetti), No preemption (risorse non sottraibili), Circular wait (catena circolare di attesa)."
      },
      {
        "title": "Grafo di Allocazione delle Risorse",
        "tag": null,
        "desc": "Grafo diretto: processi (cerchi) e risorse (rettangoli). Arco PR = richiesta; arco RP = assegnazione. Se il grafo ha un ciclo con risorse a istanza singola  deadlock. Con istanze multiple  possibile ma non certo."
      },
      {
        "title": "Prevenzione del Deadlock",
        "tag": null,
        "desc": "Elimina almeno una delle 4 condizioni Coffman. Esempio: imponi ordine globale sulle risorse (elimina circular wait). Oppure: richiedi tutte le risorse in anticipo (elimina hold-and-wait). Conservativa, riduce l'utilizzo delle risorse."
      },
      {
        "title": "Algoritmo del Banchiere (Avoidance)",
        "tag": null,
        "desc": "Dijkstra. Prima di concedere una risorsa, simula l'allocazione e verifica se il sistema rimane in uno stato sicuro (esiste una sequenza sicura di completamento). Richiede di conoscere le risorse massime di ogni processo."
      },
      {
        "title": "Rilevamento del Deadlock",
        "tag": null,
        "desc": "Permette al deadlock di avvenire, poi lo rileva periodicamente tramite un algoritmo simile al banchiere ma senza la dichiarazione massima. Overhead ridotto, ma serve recovery."
      },
      {
        "title": "Recovery dal Deadlock",
        "tag": null,
        "desc": "Process termination: termina tutti i processi nel deadlock, o uno alla volta finché il ciclo si rompe. Resource preemption: sottrai risorse a un processo scelto (con possibile rollback al checkpoint)."
      }
    ]
  },
  {
    "id": "07",
    "title": "Main Memory",
    "theme": "teal",
    "badge": "Memoria",
    "badgeClass": "ab-teal",
    "ovSub": "Paginazione · Segmentazione · TLB · Protezione · Allocazione contigua · Frammentazione",
    "subs": [
      {
        "title": "Allocazione contigua",
        "tag": "base",
        "desc": "Ogni processo occupa un blocco contiguo di memoria fisica. Semplice ma soffre di frammentazione esterna. Strategie: first-fit, best-fit, worst-fit per scegliere il buco libero."
      },
      {
        "title": "Frammentazione",
        "tag": null,
        "desc": "Esterna: spazio totale libero sufficiente, ma non contiguo. Interna: la memoria allocata è leggermente più grande di quella richiesta (spreco all'interno del blocco). La paginazione elimina la frammentazione esterna."
      },
      {
        "title": "Paginazione",
        "tag": null,
        "desc": "La memoria fisica è divisa in frame di dimensione fissa; lo spazio logico in pagine della stessa dimensione. La page table mappa pagine logiche  frame fisici. Elimina la frammentazione esterna ma introduce overhead della tabella."
      },
      {
        "title": "TLB — Translation Lookaside Buffer",
        "tag": null,
        "desc": "Cache hardware delle traduzioni paginaframe più recenti. Riduce drasticamente il costo della traduzione degli indirizzi. TLB hit: 1 ciclo. TLB miss: accesso alla page table in memoria (~100 cicli). Hit rate tipico: 99%+."
      },
      {
        "title": "Protezione della memoria",
        "tag": null,
        "desc": "Ogni entry della page table include bit di protezione: read/write/execute. Il tentativo di accesso non autorizzato genera una trap (segmentation fault). Isola i processi tra loro e dal kernel."
      },
      {
        "title": "Pagine condivise",
        "tag": null,
        "desc": "Più processi possono mappare lo stesso frame fisico. Usato per librerie condivise (libc), copy-on-write dopo fork(), e memoria condivisa IPC. Risparmio significativo di RAM."
      },
      {
        "title": "Segmentazione",
        "tag": null,
        "desc": "Lo spazio logico è diviso in segmenti di dimensione variabile (codice, stack, heap, dati). La segment table mappa ogni segmento con base + limite. Più naturale per il programmatore, ma soffre di frammentazione esterna."
      },
      {
        "title": "Segmentazione con paginazione",
        "tag": null,
        "desc": "Ibrido usato da x86: ogni segmento ha la propria page table. Combina la visione logica della segmentazione con l'assenza di frammentazione esterna della paginazione."
      }
    ]
  },
  {
    "id": "08",
    "title": "Virtual Memory",
    "theme": "teal",
    "badge": "Memoria",
    "badgeClass": "ab-teal",
    "ovSub": "Demand paging · Page fault · Sostituzione pagine · Thrashing · Working set",
    "subs": [
      {
        "title": "Demand Paging",
        "tag": "fondamento",
        "desc": "Le pagine vengono caricate in memoria solo quando necessarie (lazy loading). Il valid bit nella page table indica se la pagina è in RAM. Se non lo è, si genera un page fault."
      },
      {
        "title": "Page Fault",
        "tag": null,
        "desc": "Trap generata quando si accede a una pagina non in RAM. Il SO localizza la pagina su disco, trova un frame libero (o lo libera), carica la pagina, aggiorna la page table, e riprende il processo. Costo: ~10ms vs ~100ns per accesso RAM."
      },
      {
        "title": "Sostituzione delle Pagine",
        "tag": null,
        "desc": "Quando non ci sono frame liberi, il SO deve scegliere una vittima. Algoritmi: FIFO, OPT (ottimale, non implementabile), LRU (Least Recently Used), Clock (approssimazione LRU usata in pratica)."
      },
      {
        "title": "Allocazione dei frame",
        "tag": null,
        "desc": "Equal allocation: stessi frame per ogni processo. Proportional allocation: in base alla dimensione del processo. Priority allocation: processi con priorità alta ricevono più frame."
      },
      {
        "title": "Thrashing",
        "tag": null,
        "desc": "Il processo spende più tempo a gestire page fault che a eseguire codice utile. Accade quando i frame assegnati sono insufficienti per il working set del processo. Il SO deve rilevarlo e ridurre il grado di multiprogramming."
      },
      {
        "title": "Working Set Model",
        "tag": null,
        "desc": "Il working set è l'insieme di pagine accedute nelle ultime Δ referenze. Se la somma dei working set supera i frame disponibili  thrashing imminente. Il SO monitora i working set per allocare frame adeguati."
      },
      {
        "title": "Memory-Mapped Files",
        "tag": null,
        "desc": "Un file su disco viene mappato nello spazio di indirizzi virtuale del processo. L'accesso al file avviene tramite normali istruzioni di memoria. Il SO gestisce il caricamento lazy tramite demand paging. Base di mmap() su Unix."
      }
    ]
  },
  {
    "id": "09",
    "title": "I/O Systems",
    "theme": "green",
    "badge": "Hardware",
    "badgeClass": "ab-green",
    "ovSub": "DMA · Polling vs Interrupt · Driver · Kernel I/O · Buffering · Caching · Spooling",
    "subs": [
      {
        "title": "Hardware I/O",
        "tag": "fondamento",
        "desc": "Porte, bus e device controller. Il controller ha registri di stato, controllo e dati. Il SO comunica con il controller tramite I/O port-mapped (istruzioni IN/OUT) o memory-mapped I/O (registri mappati in RAM)."
      },
      {
        "title": "Polling vs Interrupt-driven I/O",
        "tag": null,
        "desc": "Polling: la CPU controlla periodicamente se il dispositivo è pronto (busy-wait, spreca cicli CPU). Interrupt: il dispositivo notifica la CPU quando ha finito. La CPU può fare altro nel frattempo."
      },
      {
        "title": "DMA — Direct Memory Access",
        "tag": null,
        "desc": "Il controller DMA trasferisce blocchi di dati tra dispositivo e RAM senza coinvolgere la CPU. La CPU inizia il trasferimento e viene interrotta solo al completamento. Essenziale per dischi, schede di rete, audio."
      },
      {
        "title": "Kernel I/O Subsystem",
        "tag": null,
        "desc": "Strato del kernel che astrae i dispositivi. Fornisce: scheduling I/O, buffering, caching, spooling (per dispositivi che accettano un job alla volta, es. stampanti), gestione degli errori."
      },
      {
        "title": "Buffering I/O",
        "tag": null,
        "desc": "Buffer in memoria per adattare velocità diverse tra produttore e consumatore, tra dati e dimensione dei trasferimenti, e per la semantica copy-on-write. Single buffer, double buffer, circular buffer."
      },
      {
        "title": "Driver di dispositivo",
        "tag": null,
        "desc": "Modulo del kernel che traduce le richieste generiche del kernel I/O subsystem in comandi specifici per il controller hardware. Fornisce un'interfaccia uniforme (open, read, write, ioctl) indipendente dall'hardware sottostante."
      },
      {
        "title": "I/O sincrono vs asincrono",
        "tag": null,
        "desc": "Sincrono: il processo si blocca fino al completamento dell'I/O. Asincrono: il processo continua; viene notificato al completamento (callback, signal, future/promise). Fondamentale per I/O ad alto throughput."
      }
    ]
  },
  {
    "id": "10",
    "title": "Mass-Storage Systems",
    "theme": "green",
    "badge": "Storage",
    "badgeClass": "ab-green",
    "ovSub": "",
    "subs": [
      {
        "title": "HDD vs SSD",
        "tag": "fondamento",
        "desc": "HDD: piatti magnetici rotanti, testine mobili. Accesso sequenziale veloce, random lento (seek time + rotational latency). SSD: memoria flash NAND, nessun componente meccanico. Accesso random uniforme, bassa latenza, ma usura per scritture."
      },
      {
        "title": "Disk Scheduling",
        "tag": null,
        "desc": "Ottimizza l'ordine delle richieste I/O su HDD per minimizzare il movimento delle testine. Non necessario per SSD. Algoritmi: FCFS (semplice), SSTF (nearest first, rischio starvation), SCAN/C-SCAN (elevatore)."
      },
      {
        "title": "SCAN & C-SCAN",
        "tag": null,
        "desc": "SCAN: la testina va avanti e indietro come un ascensore, servendo le richieste in direzione. C-SCAN: va solo in una direzione; al bordo salta all'inizio. Distribuzione più uniforme dei tempi di attesa."
      },
      {
        "title": "RAID",
        "tag": null,
        "desc": "Redundant Array of Independent Disks. Livelli: RAID 0 (striping, performance), RAID 1 (mirroring, affidabilità), RAID 5 (striping + parità distribuita, bilanciamento), RAID 6 (doppia parità, resiste a 2 guasti)."
      },
      {
        "title": "Storage Area Network (SAN)",
        "tag": null,
        "desc": "Rete dedicata ad alta velocità per collegare server a storage centralizzato. I dischi appaiono come locali al server. Scalabile, gestito centralmente. Usato in datacenter e ambienti enterprise."
      },
      {
        "title": "Gestione dello spazio libero",
        "tag": null,
        "desc": "Strutture dati per tracciare i blocchi liberi: Bit vector (1 bit per blocco, compatto, facile accesso), Linked list (blocchi liberi collegati), Grouping e Counting (ottimizzazioni)."
      }
    ]
  },
  {
    "id": "11",
    "title": "File System",
    "theme": "green",
    "badge": "File",
    "badgeClass": "ab-green",
    "ovSub": "FAT · inode · Directory · Mounting · Link · Journaling · VFS",
    "subs": [
      {
        "title": "Concetti base: file e directory",
        "tag": "fondamento",
        "desc": "Un file è una collezione di dati con un nome. La directory mappa nomi  file (o altre directory). Strutture: singolo livello, a due livelli, ad albero, con link (grafo aciclico o generale)."
      },
      {
        "title": "Allocazione dei file su disco",
        "tag": null,
        "desc": "Contigua: blocchi consecutivi, accesso rapido, frammentazione esterna. Linked: blocchi collegati, nessuna frammentazione, accesso random lento. Indexed (inode): blocco indice con puntatori ai blocchi dati. Usato da Unix/Linux."
      },
      {
        "title": "inode (Unix)",
        "tag": null,
        "desc": "Struttura dati che descrive un file: permessi, proprietario, dimensione, timestamp, puntatori diretti (primi 12 blocchi), indiretto singolo, doppio e triplo. Il nome del file è nella directory, non nell'inode."
      },
      {
        "title": "FAT — File Allocation Table",
        "tag": null,
        "desc": "Tabella in memoria che mappa ogni cluster al successivo (linked list su FAT). FAT12/16/32 per dimensioni crescenti. Semplice, compatibile, ma senza journaling e permessi avanzati. Usato su USB e SD card."
      },
      {
        "title": "Journaling",
        "tag": null,
        "desc": "Il filesystem registra le modifiche in un log (journal) prima di applicarle. In caso di crash, il journal permette il recovery rapido senza fsck completo. Usato da ext4, NTFS, XFS, APFS."
      },
      {
        "title": "VFS — Virtual File System",
        "tag": null,
        "desc": "Strato di astrazione nel kernel che fornisce un'interfaccia uniforme (open, read, write) sopra filesystem diversi (ext4, NTFS, procfs, NFS). Le applicazioni non conoscono il filesystem sottostante."
      },
      {
        "title": "Mounting & Link",
        "tag": null,
        "desc": "Mounting: aggancia un filesystem a un punto dell'albero delle directory. Hard link: due nomi per lo stesso inode (stessa directory entry, stesso file). Soft link (symlink): file speciale con un percorso, può puntare tra filesystem diversi."
      }
    ]
  },
  {
    "id": "12",
    "title": "Embedded Systems",
    "theme": "coral",
    "badge": "Speciale",
    "badgeClass": "ab-coral",
    "ovSub": "Real-time OS · Hard/Soft RT · Scheduling RT · EDF · Rate Monotonic",
    "subs": [
      {
        "title": "Sistemi Real-Time",
        "tag": "fondamento",
        "desc": "Sistemi in cui la correttezza dipende sia dal risultato che dal tempo in cui viene prodotto. Esempi: controllo ABS, pacemaker, sistemi avionici. Il SO deve garantire deadline deterministiche."
      },
      {
        "title": "Hard vs Soft Real-Time",
        "tag": null,
        "desc": "Hard RT: una deadline mancata è un failure del sistema (airbag, controllo reattore). Soft RT: una deadline mancata degrada la qualità ma non è catastrofico (streaming video, UI)."
      },
      {
        "title": "Rate Monotonic Scheduling (RMS)",
        "tag": null,
        "desc": "Algoritmo preemptive a priorità statica: i task con periodo più breve hanno priorità più alta. Ottimale per task periodici a priorità fissa. Limite di utilizzazione: ≈69% per n task (formula di Liu & Layland)."
      },
      {
        "title": "EDF — Earliest Deadline First",
        "tag": null,
        "desc": "Priorità dinamica: il task con deadline più vicina ha priorità più alta. Ottimale per sistemi RT monoprocessore: può schedulare qualsiasi insieme di task schedulabile. Più complesso da implementare di RMS."
      },
      {
        "title": "Caratteristiche RTOS",
        "tag": null,
        "desc": "Un Real-Time OS ha: latenza di interrupt minimale e deterministica, preemption immediata, no virtual memory (latenza non deterministica), clock ad alta risoluzione. Esempi: FreeRTOS, VxWorks, QNX, Zephyr."
      }
    ]
  },
  {
    "id": "13",
    "title": "Sicurezza",
    "theme": "coral",
    "badge": "Protezione",
    "badgeClass": "ab-coral",
    "ovSub": "Autenticazione · Access control · Capability list · Buffer overflow · Malware",
    "subs": [
      {
        "title": "Obiettivi di sicurezza",
        "tag": "fondamento",
        "desc": "Confidenzialità: solo chi è autorizzato vede i dati. Integrità: i dati non vengono alterati non autorizzatamente. Disponibilità: il sistema è accessibile a chi ne ha diritto (triada CIA)."
      },
      {
        "title": "Autenticazione",
        "tag": null,
        "desc": "Verifica dell'identità: qualcosa che sai (password), che hai (token), che sei (biometria). Il SO gestisce l'autenticazione per il login; le password sono memorizzate come hash (bcrypt, SHA-256 + salt) mai in chiaro."
      },
      {
        "title": "Access Control",
        "tag": null,
        "desc": "ACL (Access Control List): per ogni risorsa, lista di (soggetto, permessi). Capability list: per ogni processo, lista di (risorsa, permessi). I permessi Unix (rwx per owner/group/other) sono una ACL semplificata."
      },
      {
        "title": "Buffer Overflow",
        "tag": null,
        "desc": "Scrivere oltre i limiti di un buffer sovrascrive dati adiacenti (return address, variabili). Permite l'esecuzione di codice arbitrario. Contromisure: stack canary, ASLR (Address Space Layout Randomization), NX bit (no-execute), safe languages."
      },
      {
        "title": "Malware & Virus",
        "tag": null,
        "desc": "Tipi: Virus (si replica allegandosi a programmi), Worm (si propaga autonomamente in rete), Trojan (si maschera da software legittimo), Ransomware (cifra i file e chiede riscatto), Rootkit (nasconde la propria presenza nel SO)."
      },
      {
        "title": "Protezione del kernel: rings & sandbox",
        "tag": null,
        "desc": "L'hardware supporta livelli di privilegio (ring 0 = kernel, ring 3 = user). Il codice user non può eseguire istruzioni privilegiate. La sandbox isola processi tramite namespaces, seccomp, cgroups (base dei container Docker)."
      }
    ]
  },
  {
    "id": "14",
    "title": "Laboratori (Teoria)",
    "theme": "teal",
    "badge": "Pratica",
    "badgeClass": "ab-teal",
    "ovSub": "Kernel Modules · Processi Orfani · Contention Scope · mmap · Symlink ext4 · RIOT OS",
    "subs": [
      {
        "title": "Kernel Modules e Privilegi",
        "tag": "low-level",
        "desc": "User Mode vs Kernel Mode. Ciclo di vita di un modulo (module_init, module_exit) e stampe in Kernel Log Buffer tramite printk()."
      },
      {
        "title": "Processi e Thread",
        "tag": null,
        "desc": "Processi orfani adottati da systemd. Tipi di parallelismo (Data vs Task) e livelli di scheduling: System-Contention Scope (SCS) in kernel vs Process-Contention Scope (PCS) in user space."
      },
      {
        "title": "Sincronizzazione C",
        "tag": "posix",
        "desc": "Uso di pthread_mutex_t per la mutua esclusione. Differenza tra Named Semaphores (condivisi tra processi via stringa, salvati in /dev/shm) e Unnamed (Memory-based)."
      },
      {
        "title": "Memoria e mmap",
        "tag": null,
        "desc": "Lettura Row-major vs Col-major e impatto sui page-fault. Uso di mmap() per mappare file in memoria virtuale tramite demand paging (Lazy Loading) bypassando l'overhead delle system call."
      },
      {
        "title": "File System (ext4)",
        "tag": null,
        "desc": "Allocazione Extent-based. Utilizzo dei Fast Symlink, in cui il percorso viene salvato direttamente all'interno del blocco Inode se sufficientemente corto."
      },
      {
        "title": "Real-Time OS (RIOT)",
        "tag": "iot",
        "desc": "Microkernel per dispositivi IoT a risorse vincolate (es. Arduino). Gestione dei background thread declassando la priorità per garantirne la sopravvivenza e moduli ztimer per latenze prevedibili."
      }
    ]
  }
];