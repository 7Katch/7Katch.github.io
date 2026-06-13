1. Introduzione
        Che cos'è un sistema operativo
        Organizzazione del sistema del computer
        Architettura del sistema del computer
        Struttura del sistema operativo
        Operazioni del sistema operativo
        Gestione dei processi
        Gestione della memoria
        Gestione della memorizzazione (Storage)
        Protezione e sicurezza
        Sistemi distribuiti
        Ambienti di calcolo
        Sistemi operativi open source

2. Strutture del sistema operativo
        Servizi del sistema operativo
        Interfaccia utente del sistema operativo
        Chiamate di sistema (System Calls)
        Tipi di chiamate di sistema
        Programmi di sistema
        Progettazione e implementazione del sistema operativo
        Struttura del sistema operativo
        Debugging del sistema operativo
        Generazione del sistema operativo
        Avvio del sistema (System Boot)

3. Processi
        Concetto di processo
        Pianificazione dei processi (Scheduling)
        Operazioni sui processi
        Comunicazione interprocesso (IPC)
        Esempi di sistemi IPC
        Comunicazione in sistemi client-server

4. Thread
        Panoramica (Overview)
        Modelli di multithreading
        Librerie di thread
        Problemi con i thread (Implicit Threading)
        Esempi di sistemi operativi

5. Sincronizzazione dei processi
        Contesto (Background)
        Il problema della sezione critica
        La soluzione di Peterson
        Supporto hardware per la sincronizzazione
        Mutex Locks
        Semafori
        Problemi classici di sincronizzazione
        Monitor
        Esempi di sincronizzazione
        Approcci alternativi

6. Stallo (Deadlocks)
        Modello del sistema
        Caratterizzazione dello stallo
        Metodi per la gestione dello stallo
        Prevenzione dello stallo
        Evitare lo stallo (Deadlock Avoidance)
        Rilevamento dello stallo (Deadlock Detection)
        Ripristino dallo stallo (Recovery from Deadlock)

7. Strategie di gestione della memoria principale
        Contesto (Background)
        Swapping
        Allocazione contigua della memoria
        Paginazione (Paging)
        Struttura della tabella delle pagine
        Segmentazione

8. Gestione della memoria virtuale
        Contesto (Background)
        Paginazione su richiesta (Demand Paging)
        Copy-on-Write
        Sostituzione delle pagine (Page Replacement)
        Allocazione dei frame
        Thrashing
        File mappati in memoria (Memory-Mapped Files)
        Allocazione della memoria del kernel
        Altre considerazioni

9. Implementazione del File System
        Struttura del file system
        Implementazione del file system
        Implementazione delle directory
        Metodi di allocazione
        Gestione dello spazio libero
        Efficienza e prestazioni
        Ripristino (Recovery)
        NFS (Network File System)

10. Struttura della memoria di massa (Mass-Storage Structure)
        Panoramica della struttura delle memorie di massa
        Struttura del disco
        Allegati di memorizzazione (Storage Attachment)
        Scheduling del disco
        Gestione del disco
        Gestione dello spazio di swap
        Struttura RAID
        Implementazione delle strutture stabili di memorizzazione

11. Sistemi di Input/Output (I/O Systems)
        Panoramica (Overview)
        Hardware di I/O
        Interfaccia di I/O del kernel (Application I/O Interface)
        Sottosistema di I/O del kernel (Kernel I/O Subsystem)
        Trasformazione delle richieste di I/O in operazioni hardware
        Flussi (STREAMS)
        Prestazioni (Performance)

12. Sicurezza e Protezione (Security & Protection)
        Obiettivi della protezione (Goals of Protection)
        Principii di protezione
        Dominio di protezione (Domain of Protection)
        Matrice di accesso (Access Matrix)
        Implementazione della matrice di accesso
        Il problema della sicurezza (The Security Problem)
        Minacce ai programmi (Program Threats)
        Minacce al sistema e alla rete (System and Network Threats)
        Crittografia come strumento di sicurezza
        Autenticazione dell'utente

13. Sistemi Real-Time ed Embedded (Sistemi Incorporati)
        Caratteristiche dei sistemi embedded
        Requisiti dei sistemi Real-Time
        Scheduling nei sistemi Real-Time (Pianificazione a priorità)
        Sistemi operativi per dispositivi mobili ed embedded

14. Laboratorio ed Esercitazioni Pratiche
        Introduzione all'ambiente Linux/Unix e alla Bash Shell
        Comandi principali di gestione file e processi
        Programmazione script di shell (Shell Scripting)
        Utilizzo delle System Call in linguaggio C (fork, exec, wait)
        Implementazione e gestione di Thread con la libreria POSIX Pthreads
        Esercizi pratici su Semafori e Mutex in C
        Simulazione degli algoritmi di Scheduling e rimpiazzo pagine