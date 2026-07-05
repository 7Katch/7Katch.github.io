# Mappa Argomenti d'Esame — Sistemi Operativi

Questa lista mappa le domande d'esame presenti nei vari appelli ai capitoli e file HTML corrispondenti nel portale SO, così puoi ripassare gli argomenti specifici in modo mirato.

### 📂 [01-sistemi-operativi.html](./argomenti/01-sistemi-operativi.html)
* **System calls / Le system calls**: Concetti base di interfaccia utente-kernel.

### 📂 [02-processi.html](./argomenti/02-processi.html)
* **`fork()` e valore di ritorno**: Comportamento della creazione di processi e i valori restituiti (0 al child, PID al parent).
* **Codice da completare su parent e child**: Tipici esercizi in C sulla gerarchia dei processi.

### 📂 [03-thread.html](./argomenti/03-thread.html)
* **Legge di Amdahl / Legge di Amdhal**: Calcolo del guadagno prestazionale massimo sui sistemi multicore.

### 📂 [04-cpu-scheduling.html](./argomenti/04-cpu-scheduling.html)
* **Scheduling SRTF (Shortest Remaining Time First)**: Scheduling preemptive.
* **Multilevel feedback queue 2 livelli**: Esercizio misto con Code Round Robin al 1° livello e SRTF al 2° livello.
* **Processor affinity (soft e hard affinity)**: Gestione cache nei sistemi multiprocessore.
* **Process scheduling (EDF - Earliest Deadline First) / Rate monotonic Gantt chart**: Esercizi di scheduling Real-Time.

### 📂 [05-sincronizzazione.html](./argomenti/05-sincronizzazione.html) & 📂 [14-laboratori-teoria.html](./argomenti/14-laboratori-teoria.html)
* **Semafori unnamed e named / Semafori con codice / Un semaforo**.
* **Output di un codice con thread e semafori**.
* **Printare "RAM" o "ARM" con i semafori**: Esercizio classico di sincronizzazione e ordinamento stampe a video.

### 📂 [06-deadlocks.html](./argomenti/06-deadlocks.html)
* **Condizioni necessarie per deadlock**: Le famose 4 condizioni di Coffman (Mutua esclusione, Hold and wait, No preemption, Attesa circolare).
* **Evitare deadlock (con grafo di allocazione)**: Uso dei Resource Allocation Graph.
* **Grafo da completare per deadlock**: Riconoscimento dei cicli.
* **Need/available/...**: Algoritmo del Banchiere (Banker's Algorithm).

### 📂 [07-main-memory.html](./argomenti/07-main-memory.html)
* **Internal Vs external fragmentation / Frammentazione interna ed esterna**.
* **Calcolo frammentazione interna come in Lab9 / Calcolare byte sprecati**: Tipico calcolo su pagine e memoria fisica allocata.

### 📂 [08-virtual-memory.html](./argomenti/08-virtual-memory.html)
* **Anomalia di Belady**: Fenomeno dell'algoritmo FIFO.
* **Esercizio: Page replacement second chance / Algoritmo di swapping second-chance / Reverse page table**.
* **Working set / Working set size**: Esercizio per stimare il numero di frame per evitare il trashing.
* **LRU paging**: Algoritmo Least Recently Used per rimpiazzamento delle pagine.

### 📂 [09-io-systems.html](./argomenti/09-io-systems.html)
* **Block Vs character device**: Classificazione dei dispositivi di I/O.
* **Blocchi di bytes**.

### 📂 [10-mass-storage.html](./argomenti/10-mass-storage.html)
* **Gestione coda di richieste letture su disco con metodologia C-SCAN / C-SCAN scheduling**: Algoritmi di scheduling della testina del disco fisso.
* **Scheduling CPU/disco (dire quali)**: Mix tra scheduling CPU (cap. 4) e disco (cap. 10).

### 📂 [11-file-system.html](./argomenti/11-file-system.html)
* **Allocazione concatenata dei file (Linked Allocation)**: Modelli di allocazione sul disco (Contigua, Concatenata, Indicizzata).

### 📂 [12-embedded-systems.html](./argomenti/12-embedded-systems.html)
* **Semafori mutex RIOT OS**: L'uso specifico dei mutex nel SO per IoT/Embedded RIOT.

### 📂 [13-sicurezza.html](./argomenti/13-sicurezza.html)
* **Crittografia simmetrica asimmetrica**.
* **Code injection e come funziona**: Vulnerabilità e attacco (Buffer Overflow/Code Injection).
