# Integrazione Argomenti Embedded Systems

Questa modifica aggiorna la pagina `12-embedded-systems.html` per coprire le lacune che c'erano rispetto alle slides del corso, relative alle parti 1, 2 e 3 degli *Embedded Systems*.

## Modifiche effettuate:
1. **Caratteristiche di un Embedded OS**: Aggiunto un alert block per specificare cosa distingue un sistema operativo embedded (real-time operation, uso degli interrupt, configurabilità e zero o limitata protezione della memoria).
2. **µClinux e File System**: Integrata una sezione in "Embedded Linux" che descrive la variante per sistemi senza MMU (`vfork()` invece di `fork()`, singolo spazio di indirizzamento) e menziona le tipologie di file system per memorie flash NAND/NOR (cramfs, squashfs, jffs2, ubifs, yaffs2).
3. **Hardware e Software IoT**: Aggiunta una `compare-grid` alla fine della sezione IoT per schematizzare:
   - I componenti fisici di un nodo IoT (MCU, Transceiver, Sensor/Actuator, RFID).
   - L'architettura tipica di un OS IoT a strati (HAL, Kernel, Network Stack, System Libraries).
4. **Requisiti OS IoT**: Aggiunto il requisito delle *Real-time capabilities* alla lista esistente.

Il design rispetta le convenzioni di *Katchkit* usate nel resto del sito.
