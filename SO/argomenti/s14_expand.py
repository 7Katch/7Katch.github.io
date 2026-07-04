import re

new_14 = """<!DOCTYPE html>
<html lang="it">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>14 · Laboratori (Teoria) — SO</title>

  <link rel="stylesheet" href="/shared/katchkit.css">
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  </script>
  
  <style>
    .theme-lab {
      --accent: #a855f7;
      --accent-soft: rgba(168, 85, 247, 0.2);
    }
    .hero-eyebrow {
      background: rgba(168,85,247,.08);
      border: 1px solid rgba(168,85,247,.3);
      color: #a855f7;
    }
    
    .shell-box {
      background: #0d0f12;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 8px;
      padding: 1.5rem;
      font-family: 'JetBrains Mono', monospace;
      color: #e5e7eb;
      margin: 1.5rem 0;
    }
    .shell-cmd {
      color: #a855f7;
      font-weight: bold;
    }
  </style>
</head>

<body class="dot-grid theme-lab">

  <!-- ═══════ SIDEBAR ═══════ -->
  <aside class="so-sidebar">
    <div class="sb-label">Macroargomenti</div>
    <ul class="sb-pages">
      <li><a href="01-sistemi-operativi.html"><span class="sb-pdot"></span>01 · Sistemi Operativi</a></li>
      <li><a href="02-processi.html"><span class="sb-pdot"></span>02 · Processi</a></li>
      <li><a href="03-thread.html"><span class="sb-pdot"></span>03 · Thread</a></li>
      <li><a href="04-cpu-scheduling.html"><span class="sb-pdot"></span>04 · CPU Scheduling</a></li>
      <li><a href="05-sincronizzazione.html"><span class="sb-pdot"></span>05 · Sincronizzazione</a></li>
      <li><a href="06-deadlocks.html"><span class="sb-pdot"></span>06 · Deadlocks</a></li>
      <li><a href="07-main-memory.html"><span class="sb-pdot"></span>07 · Main Memory</a></li>
      <li><a href="08-virtual-memory.html"><span class="sb-pdot"></span>08 · Virtual Memory</a></li>
      <li><a href="09-io-systems.html"><span class="sb-pdot"></span>09 · I/O Systems</a></li>
      <li><a href="10-mass-storage.html"><span class="sb-pdot"></span>10 · Mass-Storage</a></li>
      <li><a href="11-file-system.html"><span class="sb-pdot"></span>11 · File System</a></li>
      <li><a href="12-embedded-systems.html"><span class="sb-pdot"></span>12 · Embedded Systems</a></li>
      <li><a href="13-sicurezza.html"><span class="sb-pdot"></span>13 · Sicurezza</a></li>
      <li>
        <div class="sb-cur"><span class="sb-pdot"></span>14 · Laboratori (Teoria)</div>
      </li>
    </ul>
    <div class="sb-label">In questa pagina</div>
    <ul class="sb-sections"></ul>
  </aside>

  <!-- ═══════ NAV ═══════ -->
  <site-navbar 
    logo-text="// SO · Sistemi Operativi" 
    back-url="../" 
    back-text="Indice SO">
  </site-navbar>

  <!-- ═══════ HERO ═══════ -->
  <div class="hero" style="min-height:55vh">
    <div class="hero-glow"></div>
    <span class="hero-eyebrow">
      Macroargomento 14 · Esercitazioni
    </span>
    <div class="topic-num">14 / 14</div>
    <h1 class="topic-hero-title">Teoria dei Laboratori</h1>
    <p class="hero-sub" style="max-width:680px">
      Concetti estratti dalle sessioni pratiche (Lab 1-12). Moduli del Kernel, IPC, system calls, sincronizzazione (Mutex e Semafori), performance di Memoria e I/O Mappata, File system ext4, e RTOS (RIOT).
    </p>
  </div>
  <hr class="divider">

  <!-- ═══════ CONTENT ═══════ -->
  <div class="content-wrap">

    <div class="nav-breadcrumb">
      <a href="https://7Katch.github.io">7Katch.github.io</a><span>/</span>
      <a href="../index.html">SO</a><span>/</span>
      <span>14 · Laboratori (Teoria)</span>
    </div>

    <!-- INDEX GRID -->
    <div class="index-grid" data-prefix="14">
      <ul>
        <li>Lab 1-2: Moduli Kernel, fork() e Orfani</li>
        <li>Lab 3: Thread e Parallelismo</li>
        <li>Lab 4-5: Sincronizzazione (Mutex e Semafori)</li>
        <li>Lab 6: Algoritmo del Banchiere</li>
        <li>Lab 7-8: Memoria e mmap()</li>
        <li>Lab 9-10: File system (ext4, Permessi, Links)</li>
        <li>Lab 11-12: Real-Time OS (RIOT)</li>
      </ul>
    </div>

    <!-- ══════════════════════════════════════════════════
       LAB 1-2
  ══════════════════════════════════════════════════ -->
    <div class="section-block" id="section-1">
      <h2><span class="dot"></span> Processi e Moduli Kernel <span class="sub-tag">Lab 1-2</span></h2>
      <p>I Loadable Kernel Modules (LKM) permettono di estendere il SO senza riavviarlo. Un LKM viene eseguito in <strong>Kernel Mode (Ring 0)</strong>, che si può verificare ispezionando gli ultimi due bit del registro <code>CS (Code Segment)</code> in assembly. Se il livello di privilegio estratto dal CS è <strong>0</strong> siamo in Kernel Mode, se è <strong>3</strong> siamo in User Mode.</p>
      
      <div class="compare-grid" style="grid-template-columns:1fr 1fr">
        <div class="compare-col">
          <div class="compare-col-head" style="background:var(--accent-soft);color:var(--accent)">Log nel Kernel (printk)</div>
          <div class="compare-col-body">
            <div class="compare-row">Nei moduli kernel NON si può usare <code>printf()</code> (appartiene alla libc, che in user space).</div>
            <div class="compare-row">Si usa invece <code>printk()</code>. L'output finisce nel kernel log buffer e non direttamente su schermo.</div>
            <div class="compare-row">Per leggere questo buffer dall'utente, si usa il comando shell <code>dmesg</code>.</div>
          </div>
        </div>
        <div class="compare-col">
          <div class="compare-col-head" style="background:rgba(255,255,255,.05)">fork() e Processi Orfani</div>
          <div class="compare-col-body">
            <div class="compare-row">La <code class="inline">fork()</code> ritorna <strong>> 0</strong> al Padre (il PID del figlio) e <strong>0</strong> al Figlio appena clonato.</div>
            <div class="compare-row">Per evitare orfani, il padre deve invocare la system call <code>wait()</code>.</div>
            <div class="compare-row">Se il Padre muore prima del Figlio senza invocarla, il Figlio diventa <strong>Orfano</strong> e viene "adottato" dal processo radice <strong>systemd</strong> (PID=1). E' possibile vederli con <code>pstree</code> e fermarli con <code>kill</code>.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
       LAB 3
  ══════════════════════════════════════════════════ -->
    <div class="section-block" id="section-2">
      <h2><span class="dot"></span> Thread e Parallelismo <span class="sub-tag">Lab 3</span></h2>
      <p>Quando si instanziano Thread concorrenti (es. <code>pthreads</code>) su una variabile condivisa non protetta, si genera una <strong>Race Condition</strong>.</p>
      
      <h3>Tipi di Parallelismo</h3>
      <ul>
        <li><strong>Data Parallelism:</strong> Stessa operazione, ma eseguita su fette (chunk) diverse di un dataset (es. 4 thread calcolano ognuno un quarto di un array condiviso).</li>
        <li><strong>Task Parallelism:</strong> Operazioni completamente diverse eseguite simultaneamente su thread separati.</li>
      </ul>

      <h3>Contention Scope</h3>
      <p>Determina in quale ambito i thread competono per la CPU. Nelle API Pthread (che in Linux implementa sempre e solo SCS):</p>
      <ul>
        <li><strong>Process-Contention Scope (PCS) (<code>PTHREAD_SCOPE_PROCESS</code>):</strong> La competizione avviene internamente al processo. I thread user-level competono tra loro per ottenere il tempo di un LWP (Lightweight Process) intermedio.</li>
        <li><strong>System-Contention Scope (SCS) (<code>PTHREAD_SCOPE_SYSTEM</code>):</strong> I thread kernel-level competono direttamente e alla pari contro tutti gli altri thread dell'intero sistema operativo per accaparrarsi i core fisici della CPU.</li>
      </ul>
    </div>

    <!-- ══════════════════════════════════════════════════
       LAB 4-5
  ══════════════════════════════════════════════════ -->
    <div class="section-block" id="section-3">
      <h2><span class="dot"></span> Sincronizzazione <span class="sub-tag">Lab 4-5</span></h2>
      <p>I meccanismi software visti a lezione per risolvere le Race Conditions presentano delle peculiarità implementative POSIX da ricordare all'esame.</p>

      <h3>1. Mutex (Mutual Exclusion)</h3>
      <p>La soluzione di <strong>Peterson</strong> funziona concettualmente, ma in C moderno può fallire a causa delle <em>compiler optimizations</em> (reordering). Meglio affidarsi ai <strong>POSIX Mutex</strong> (<code class="inline">pthread_mutex_t</code>):</p>
      <ul>
        <li><code class="inline">pthread_mutex_lock()</code>: Cerca di acquisire. Se è già occupato, si <strong>blocca</strong> (sospende il thread) finché non si libera.</li>
        <li><code class="inline">pthread_mutex_trylock()</code>: Cerca di acquisire. Se occupato, <strong>non si blocca</strong> ma ritorna immediatamente l'errore <code>EBUSY</code>.</li>
      </ul>
      <div class="alert alert-warning" style="margin-top:1rem">
        <strong>Attenzione (Comportamento Undefined):</strong> Secondo lo standard POSIX, un Mutex DEVE essere sbloccato (`unlock`) dallo stesso thread che lo ha bloccato. Se un thread fa lock e un altro diverso fa unlock, si genera "Undefined Behavior" (anche se Linux tipicamente lo tollera e non va in crash, è considerato errato). Inoltre, se un thread tenta di fare <code>lock()</code> due volte di fila sullo stesso mutex senza sbloccarlo nel mezzo, genera un <strong>Deadlock</strong> immediato.
      </div>

      <h3>2. Semafori (POSIX Semaphores)</h3>
      <p>Due operazioni atomiche: <code>sem_wait()</code> (decrementa/blocca) e <code>sem_post()</code> (incrementa/sblocca). Esistono 2 tipi POSIX:</p>
      <div class="algo-steps">
        <div class="algo-step"><span class="algo-step-n">A</span> <strong>Unnamed Semaphores (Memory-based):</strong> Non hanno nome. Per usarli tra Thread vanno piazzati in variabili globali, ma per usarli tra Processi separati DEVONO essere posizionati in un segmento di <strong>memoria condivisa</strong> (creato ad es. tramite `shm_open`). Creati con <code>sem_init()</code> e distrutti con <code>sem_destroy()</code>.</div>
        <div class="algo-step"><span class="algo-step-n">B</span> <strong>Named Semaphores:</strong> Identificati da una stringa-percorso (es. <code>/somename</code>). Utilizzati spesso tra processi indipendenti che non hanno memoria in comune. Si creano con <code>sem_open()</code> e si chiudono con <code>sem_close()</code>. Se un programma crascia (es. CTRL+C) e non chiude il semaforo o fa `sem_unlink()`, questo rimane "appeso" persistendo nel sistema (vanno cancellati manualmente da <code>/dev/shm/*</code>).</div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
       LAB 6
  ══════════════════════════════════════════════════ -->
    <div class="section-block" id="section-4">
      <h2><span class="dot"></span> Algoritmo del Banchiere (Deadlocks) <span class="sub-tag">Lab 6</span></h2>
      <p>Per prevenire un multi-resource deadlock, si valuta ogni richiesta verificando se porti il sistema in uno <strong>stato sicuro (Safe State)</strong>. Se lo fa, si garantisce l'assenza di Deadlock.</p>
      <p>Il sistema mantiene 3 strutture (matrici) fondamentali. Immaginiamo un sistema con 3 tipi di risorse R1, R2, R3:</p>
      <ul>
        <li><strong>Available:</strong> Vettore delle risorse attualmente libere. Es. <code>[0, 0, 0]</code></li>
        <li><strong>Allocation:</strong> Matrice di quante risorse sono già in mano ai vari processi (T1, T2, T3). Es. T1 possiede <code>[0, 1, 0]</code>.</li>
        <li><strong>Max:</strong> Matrice di quale sarà la richiesta "massima finale" che il processo farà prima di terminare. Es. T1 chiederà al massimo <code>[1, 1, 0]</code> in totale.</li>
      </ul>
      <p><strong>L'algoritmo calcola "Need" (Max - Allocation).</strong> Se esiste almeno una sequenza (ad es. T1 riceve il suo Need, termina e restituisce tutte le sue risorse in Available &rarr; poi T3 &rarr; poi T2) che permette a tutti di completare l'esecuzione senza mai chiedere più di quello che c'è in Available, allora ci troviamo in un Safe State e la richiesta originaria viene accettata dal sistema operativo.</p>
    </div>

    <!-- ══════════════════════════════════════════════════
       LAB 7-8
  ══════════════════════════════════════════════════ -->
    <div class="section-block" id="section-5">
      <h2><span class="dot"></span> Memoria e I/O Mappato <span class="sub-tag">Lab 7-8</span></h2>
      
      <h3>Program Structure e Performance</h3>
      <p>Un array C (es. <code>data[ROWS][COLS]</code>) viene allocato in memoria contiguamente per riga (<strong>Row-major order</strong>). Se iteri su <code>data[i][j]</code> mantenendo <code>j</code> come ciclo esterno, salti continuamente da una riga (e quindi pagina di memoria) all'altra (thrashing), generando un numero enorme e sproporzionato di <strong>Page-Faults, Cache-misses e TLB-misses</strong>.</p>
      <p>In Linux, si usa <code>getpagesize()</code> (o <code>getconf PAGESIZE</code>) per scoprire la dimensione della pagina (spesso 4096 bytes). Per testare matematicamente l'efficienza della CPU, si usa il comando integrato <code>perf stat -e cache-misses ./program</code>.</p>

      <h3>Memory-mapped I/O (mmap)</h3>
      <p>Evita il tradizionale paradigma delle system call <code>read()/write()</code> per i file su disco. Mappa direttamente un file nello spazio virtuale in RAM del processo, permettendo di leggerlo/scriverlo come un array di byte.</p>
      
      <div class="shell-box" style="margin-top:0.5rem">
        <p class="shell-cmd">void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);</p>
        <ul style="margin-top:0.5rem; margin-bottom:0; font-size:0.9em">
          <li><strong>addr:</strong> Indirizzo virtuale desiderato (spesso NULL, fa decidere all'OS).</li>
          <li><strong>length:</strong> Quanti bytes mappare (multiplo della Page Size).</li>
          <li><strong>prot:</strong> Protezione (PROT_READ, PROT_WRITE).</li>
          <li><strong>flags:</strong> Modalità (MAP_SHARED o MAP_PRIVATE).</li>
          <li><strong>fd:</strong> Il File Descriptor restituito dalla open().</li>
          <li><strong>offset:</strong> L'offset di partenza dentro il file.</li>
        </ul>
      </div>

      <div class="compare-grid" style="grid-template-columns:1fr 1fr; margin-top:1rem;">
        <div class="compare-col">
          <div class="compare-col-head" style="background:var(--accent-soft);color:var(--accent)">Vantaggi di mmap() vs File I/O</div>
          <div class="compare-col-body">
            <div class="compare-row"><strong>Lazy Loading:</strong> Le pagine del file vengono caricate in RAM solo al momento effettivo dell'accesso (Demand Paging), risparmiando RAM e tempo.</div>
            <div class="compare-row"><strong>Nessun syscall overhead:</strong> Non si passa da User a Kernel Mode ad ogni riga letta come avverrebbe con continue `read()`.</div>
            <div class="compare-row"><strong>Nessun copy overhead:</strong> I dati non vengono copiati avanti e indietro dai kernel buffers all'user buffer (Page Cache Bypass).</div>
          </div>
        </div>
        <div class="compare-col">
          <div class="compare-col-head" style="background:rgba(255,255,255,.05)">Shared Memory IPC</div>
          <div class="compare-col-body">
            <div class="compare-row">Usando il flag <code class="inline">MAP_SHARED</code>, il file mappato si trasforma in una potentissima IPC (Inter-Process Communication). Processi indipendenti mappano lo stesso file e condividono la RAM istantaneamente, senza passarsi messaggi.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
       LAB 9-10
  ══════════════════════════════════════════════════ -->
    <div class="section-block" id="section-6">
      <h2><span class="dot"></span> File system (ext4 e Links) <span class="sub-tag">Lab 9-10</span></h2>
      
      <h3>Permessi e syscall <code>stat()</code></h3>
      <p>I permessi Linux seguono il trio <strong>(Read=4, Write=2, eXecute=1)</strong> e le tre classi <strong>(Owner, Group, Public)</strong>. Modificabili tramite `chmod`. Un permesso come <code>754</code> significa `rwx` (111=7) all'Owner, `r-x` (101=5) al Gruppo, `r--` (100=4) al Pubblico.</p>
      <ul>
        <li><code>stat()</code>: Ritorna info di un file (inode, permessi, UID, size, num blocks).</li>
        <li><code>lstat()</code>: Come stat, ma se incontra un link simbolico restituisce le info sul link stesso, NON sul file remoto puntato (utile per ispezionare se un file è in realtà un link).</li>
        <li><code>statvfs()</code>: Ritorna info generali sul filesystem montato (es. quanti blocchi totali/liberi).</li>
      </ul>
      
      <h4>Calcolo della Frammentazione Interna</h4>
      <p>Per limitazioni hardware e prestazionali, i dischi lavorano con un physical I/O block solitamente di <strong>4096 bytes (4KB)</strong>. Attenzione: per motivi storici, la system call `stat` (in <code>st_blocks</code>) conta blocchi da 512 bytes (quindi 1 physical block = 8 st_blocks).<br>
      <strong>Esempio:</strong> Un file pesa 1948 bytes. Poiché è più piccolo di 4KB, occuperà fisicamente 1 blocco da 4096 bytes su disco. La frammentazione interna (spazio sprecato ma riservato) sarà pari a: <code>4096 - 1948 = 2148 bytes persi.</code></p>

      <h3>Ext4: Extents e Fast Symlinks</h3>
      <p>Il File System Linux <code>ext4</code> abbandona il vecchio sistema di allocazione indicizzata a puntatori indiretti (troppo complesso per file da molti Terabyte). Introduce gli <strong>Extents</strong>: una singola entry punta a un'intera porzione contigua di blocchi. Permette di mappare fino a 128 MB contigui con un solo extent. L'inode può contenere direttamente 4 extents, dopodiché usa un albero B-tree.</p>
      
      <h4>Hard vs Symbolic Links</h4>
      <div class="algo-steps">
        <div class="algo-step"><span class="algo-step-n"><i class="bi bi-link"></i></span> <strong>Hard Link:</strong> Un puntatore diretto all'inode del file originale (incrementa il <em>link_count</em> dell'inode). Se l'originale viene cancellato, i dati restano finché non vengono cancellati tutti gli hard links.</div>
        <div class="algo-step"><span class="algo-step-n"><i class="bi bi-arrow-up-right-square"></i></span> <strong>Symbolic Link:</strong> Un file separato (con un proprio inode) che contiene come dati una stringa testuale con il path del bersaglio. Se l'originale muore, il symlink si "rompe" (dangling link).</div>
        <div class="algo-step"><span class="algo-step-n"><i class="bi bi-lightning-charge"></i></span> <strong>Fast Symlinks:</strong> In ext4, se il nome (la stringa del path) del file puntato dal symlink è <strong>inferiore a 60 caratteri</strong>, il testo del symlink viene memorizzato DIRETTAMENTE dentro l'inode del symlink stesso. Questo ottimizza drasticamente le letture, evitando di sprecare e accedere a un intero blocco disco di 4096 bytes solo per leggere una mini-stringa di 20 caratteri.</div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════
       LAB 11-12
  ══════════════════════════════════════════════════ -->
    <div class="section-block" id="section-7">
      <h2><span class="dot"></span> Real-Time OS: RIOT <span class="sub-tag">Lab 11-12</span></h2>
      <p><strong>RIOT</strong> è un sistema operativo pensato per dispositivi IoT (Internet of Things) a bassissimo consumo, bassa latenza e memoria risicata (microcontrollori 8, 16, e 32 bit). La sua peculiarità è l'architettura <strong>Microkernel</strong> (per massimizzare lo spazio) con supporto nativo a scheduling real-time, multithreading, e protocolli di rete snelli (IPv6, 6LoWPAN, CoAP).</p>

      <h3>Gestione dei Thread in un ambiente RTOS (RIOT)</h3>
      <p>Rispetto ai sistemi operativi desktop complessi, la programmazione di RIOT (normalmente in C o Rust) è fortemente vincolata dai limiti hardware:</p>
      <ul>
        <li><strong>Nessuna vera MMU (Memoria Dinamica):</strong> Quando si crea un nuovo thread, a differenza dei POSIX normali, la memoria Stack da allocare al thread <strong>deve essere dichiarata esplicitamente e globalmente</strong> a compile-time (<code>static char stack[THREAD_STACKSIZE_MAIN];</code>). Non esiste allocazione magica.</li>
        <li><strong>Priorità Thread Invertite:</strong> In RIOT, i numeri assegnati alla priorità sono contro-intuitivi. Numeri più alti indicano priorità più <strong>BASSE</strong>. Il costrutto <code>THREAD_PRIORITY_MAIN - 1</code> genera un thread a priorità maggiore del Main thread (che ruberà istantaneamente la CPU), mentre <code>THREAD_PRIORITY_MAIN + 1</code> genera un background thread che riceverà cicli di clock solo se il Main va in sleep.</li>
        <li><strong>Temporizzatori ad alta precisione:</strong> Per i delay si importano moduli come <code>ztimer</code> (e <code>ztimer_msec</code>) che si agganciano nativamente all'orologio hardware del microcontroller per generare attese rigorose, essenziali nei sensori IoT.</li>
      </ul>
      <p>E' interessante notare che RIOT offre una potente Shell interattiva (`shell_run()`) in cui, una volta caricati i moduli necessari, si può usare il familiare comando `ps` per visualizzare in real-time i thread attivi e bloccati.</p>
    </div>

    <!-- NAVIGATION -->
    <div class="back-btn-wrap">
      <a href="13-sicurezza.html" class="btn btn-ghost"><i class="bi bi-arrow-left"></i> 13 · Sicurezza</a>
      <a href="../index.html" class="btn btn-amber">↑ Indice SO</a>
    </div>

  </div><!-- /content-wrap -->

  <footer>
    <p>// <a href="https://7Katch.github.io">7Katch.github.io</a> · SO · 14 · Laboratori</p>
    <p style="margin-top:6px">CSS condiviso: <span style="color:var(--accent-soft)">argomentoStyle.css</span></p>
  </footer>

  <!-- ═══════ SCRIPTS ═══════ -->
  <script src="/shared/katchkit.js"></script>
</body>

</html>
"""

with open('14-laboratori-teoria.html', 'w', encoding='utf-8') as f:
    f.write(new_14)

print('Success: 14-laboratori-teoria.html heavily refined with deep technical concepts.')
