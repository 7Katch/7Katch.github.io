# Indice Argomenti (Sistemi Operativi)

- [01-sistemi-operativi.html](./argomenti/01-sistemi-operativi.html)
  - **What is an OS?**
    - A brief history
    - Overview of OS elements
    - Definizione e obiettivi dell'OS
    - Non-uniform memory access system (NUMA)
    - Embedded systems (Sistemi real-time e vincoli temporali)
    - OS operations (Bootstrap program, Caricamento Kernel, System daemons)
    - File-System management (Astrazione, controllo accessi, directory)
    - I/O subsystem (Buffering, caching, spooling, device drivers)
    - Protection and security (Meccanismi di controllo accessi tramite User ID e Group ID)
  - **OS structures**
    - OS services (User interface, Accounting/logging, Protection and security)
    - Design and implementation
    - Types of system calls (Information maintenance, Protection, Communications)

- [02-processi.html](./argomenti/02-processi.html)
  - **Processi**
    - Context switch (Salvataggio stato, Process Control Block, Hardware support)
    - Named pipes (Comunicazione bidirezionale in UNIX/Windows)

- [03-thread.html](./argomenti/03-thread.html)
  - **Threads and concurrency**
    - Overview, Multicore programming, Multithreading models, Thread libraries, Implicit threading, Threading issues, OS examples
    - Processi a thread singolo vs multithread
    - Linux threads (Astrazione dei "tasks", System call clone() e flag di condivisione: CLONE_FS, CLONE_VM, ecc.)

- [04-cpu-scheduling.html](./argomenti/04-cpu-scheduling.html)
  - **CPU scheduling (part 1 & 2)**
    - Basic concepts, Scheduling criteria, Scheduling algorithms
    - CPU-I/O burst cycle
    - Multilevel Feedback Queue (Code multiple con algoritmi Round Robin e FCFS combinati)
    - Real-time scheduling, Multi-processor scheduling, OS examples
    - Real-time CPU scheduling (Applicazioni real-world, Sistemi embedded, RTOS)

- [05-sincronizzazione.html](./argomenti/05-sincronizzazione.html)
  - **Synchronization**
    - Race condition, Critical section, Peterson’s solution, Hardware support for synchronization, Mutex locks
    - Background (Esecuzione concorrente, Data inconsistency)
    - POSIX synchronization (Mutex locks, Semaphores, Condition variables in UNIX/Linux/macOS)

- [06-deadlocks.html](./argomenti/06-deadlocks.html)
  - **Deadlocks**
    - System model
    - Deadlock characterization
    - Methods for handling deadlocks
    - Deadlock prevention
    - Deadlock avoidance
    - Deadlock detection
    - Recovery from deadlock

- [07-main-memory.html](./argomenti/07-main-memory.html)
  - **Main memory (part 1 & 2)**
    - Background, Memory allocation strategies, Paging
    - Gerarchia Cache/Registri, Main memory, Stalli CPU
    - Address protection (Registri Base e Limit, check in User Mode)
    - Address binding
    - Memory protection – valid-invalid bit
    - Shared pages (Condivisione di codice read-only/reentrant)
    - Structure of the page table (Tabelle di pagina gigantesche: Hierarchical, Hashed, Inverted)
    - Swapping, Segmentation
    - Intel IA-32 (Paging part, Page directory, Page table a 2 livelli)
    - Intel IA-64 (Architettura 64 bit, Gerarchia di paging a 4 livelli)

- [08-virtual-memory.html](./argomenti/08-virtual-memory.html)
  - **Virtual memory (part 1 & 2)**
    - Demand paging, Copy-on-write, Page replacement
    - Enhanced second-chance algorithm (Uso di reference bit e modify bit per la scelta della vittima)
    - Frame allocation, Thrashing, Allocating kernel memory
    - Pool of free frames (Mantenimento di un pool di pagine libere per i page fault)
    - Slab allocation (Kernel objects, Cache, Pagine contigue)

- [09-io-systems.html](./argomenti/09-io-systems.html)
  - **I/O systems**
    - Overview, I/O hardware, Application I/O interface, From I/O requests to hardware operations, Kernel I/O subsystem
    - OS overview (Posizionamento dell'I/O control nello stack del sistema)
    - Error handling and I/O protection (Istruzioni privilegiate per evitare abusi, System calls)
    - Example – Linux device files (La directory /dev, es. lettura metadati mouse)

- [10-mass-storage.html](./argomenti/10-mass-storage.html)
  - **Mass-storage systems**
    - Overview, HDD scheduling, NVM scheduling, Storage device management, Swap-space management, RAID structure
    - Storage device management
    - Low-level formatting (Physical formatting in settori e ECC)
    - Partizionamento e Volumi (Logical disk)
    - Logical formatting (Creazione del File System)
    - Root partition e Boot block (Boot loader)
    - Swap-space management

- [11-file-system.html](./argomenti/11-file-system.html)
  - **File System (part 1, 2 & 3)**
    - File concept, Access methods, Disk and directory structure
    - File attributes (Name, Identifier, Type, Location, Size, Protection, Time/date/user)
    - File operations (Create, Write, Read, Reposition/Seek, Delete, Truncate, Open, Close)
    - File sharing and locking (Shared lock, Exclusive lock, Accesso Mandatory o Advisory)
    - File structure (Nessuna, Simple record, Complex)
    - Logical vs physical record (Definizione di Internal fragmentation)
    - Directory organization (Efficiency, Naming, Grouping, Single- and two-level directory, Tree-structured, Acyclic-graph)
    - Hard links vs symbolic links
    - File system structure (Mapping logico-fisico, Blocchi di I/O, File system layers)
    - File system types (UFS, FAT, NTFS, ext3/ext4, OpenZFS, ecc.)
    - On-disk and In-memory structures (FCB, Mount table, Open-file table, Buffers)
    - Directory implementation (Linear list, Hash Table)
    - Mounting, Virtual file systems (VFS), Remote file systems, NFS
    - Distributed file systems (FTP, WWW, DFS)
    - NFS architecture layers (UNIX interface, VFS layer, NFS service layer / protocollo RPC)

- [12-embedded-systems.html](./argomenti/12-embedded-systems.html)
  - **Embedded OS (part 1, 2 & 3)**
    - Embedded systems, Characteristics of embedded OSes, Embedded Linux
    - Microprocessor-based system vs Microcontroller
    - Deeply embedded system
    - Host and target environments (Kernel compilation, Cross-compiler)
    - Developing an embedded OS (Option 1: Adattare un OS esistente, Option 2: OS embedded Purpose-built)
    - Embedded Linux (μClinux, μClibc, Yocto Project reference)
    - OS for microcontroller-based systems (TinyOS, RIOT, FreeRTOS, Zephyr)
    - RIOT software structure e Kernel (Microkernel, multithreading, Tickless scheduler)
    - CPU abstraction & Generic peripheral API
    - Internet of Things (IoT) e IoT OS architecture (HAL, Kernel, Low-power Network stack)
    - Comparison of IoT OSes (Contiki-NG vs RIOT vs Zephyr)

- [13-sicurezza.html](./argomenti/13-sicurezza.html)
  - **Security & Fault Tolerance**
    - Security threats, Buffer overflow, Defences
    - System access threats (Intruders, Malicious software come Parasitic vs Independent)
    - Countermeasures (Intrusion Detection Systems - Host-based e Network-based)
    - Authentication (Identification e Verification, Means of authentication)
    - Access control (Security policy, Authorization database, Audit function, Firewalling)
    - Buffer overflow attacks
    - Compile-time defenses (Safe coding, StackGuard) e Runtime defenses (NX bit, ASLR, Guard pages)
    - Cryptography e Fault tolerance

- [14-laboratori-teoria.html](./argomenti/14-laboratori-teoria.html)
  - **Laboratori (Teoria)**
    - Kernel Modules vs User Mode (printk, insmod, privileges)
    - Processi e Thread (Fork, Orfani, Data vs Task Parallelism, Contention Scope)
    - Sincronizzazione in C (POSIX Mutex, Named/Unnamed Semaphores, Peterson)
    - Memoria e File System (mmap lazy loading, ext4 extent e fast symlinks)
    - Real-Time OS per IoT (RIOT microkernel, thread handling, ztimer)