# Refactoring Spiegazioni Deadlocks

## Obiettivo
Rendere più chiari e leggibili i concetti chiave della prevenzione dei deadlock, spezzando un paragrafo denso e verboso in una lista puntata, e aggiungendo le spiegazioni semplificate fornite al volo durante la pair programming session.

## Modifiche
Nel file `06-deadlocks.html`, sezione "Prevenzione del Deadlock":
- Sostituito il blocco di testo continuo con un `<ul class="lesson-list">`.
- Espanso il punto **Hold and Wait** aggiungendo la spiegazione del "Tutto e subito" o "Molla tutto prima di chiedere".
- Espanso il punto **Circular Wait** aggiungendo l'esempio dei numeri assegnati alle risorse e della regola che impone l'allocazione in *ordine strettamente crescente* per rompere la catena circolare.
- Leggermente rifinito **Mutual Exclusion** e **No Preemption** per coerenza con il nuovo formato e chiarezza.
