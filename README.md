# Sito con la raccolta di informazioni



miatastiera

---

## 🎬 Come generare slide animate (Manim Slides)

Quando crei una nuova animazione Python (es. `animazioni\nuovo_script.py` contenente la classe `MiaAnimazione`), segui questi 3 passaggi nel terminale di VS Code:

**1. Attiva l'ambiente virtuale** (da fare una volta sola per sessione):
```powershell
.\.venv\Scripts\Activate.ps1
```

**2. Renderizza le scene in video:**
```powershell
manim -qm animazioni\nuovo_script.py MiaAnimazione
```
*(Usa `-qm` per qualità media, `-ql` per bassa o `-qh` per alta)*.

**3. Converti i video in una presentazione HTML interattiva:**
```powershell
manim-slides convert MiaAnimazione animazioni\risultato_finale.html
```

---

## 📁 Architettura del Sito: La cartella `shared`

Per mantenere il progetto pulito, scalabile e facile da gestire, utilizziamo una cartella `shared/` che funge da vero e proprio **motore centrale** del sito. Tutti i diversi moduli (es. `EDIDS/`, `SO/`) dipendono da questi file, garantendo uniformità su tutte le pagine.

### 🎨 Design System (`katchkit.css`)
Un framework CSS personalizzato che definisce l'intera identità visiva del sito. Include la gestione dei temi cromatici (Cyberpunk Neon), le tipografie (Inter e JetBrains Mono), griglie responsive e gli stili dei *Web Components*. Aggiornando questo singolo file, l'intero sito cambia faccia istantaneamente.

### 🧠 Web Components (`katchkit.js`)
Libreria JavaScript proprietaria che inizializza i componenti custom usati nell'HTML (come `<site-hero>` e `<site-navbar>`). Incapsula l'HTML ricorrente rendendo i file delle singole pagine pulitissimi.

### ✨ Motore di Animazione Interattiva (`animation.js`)
Un bundle JavaScript scaricato interamente in locale (per funzionare anche offline) che fonde le due migliori librerie del settore per creare simulazioni didattiche interattive nel browser:

1. **P5.js**: Una libreria famosissima in ambito accademico che crea un `Canvas` (una tela virtuale) nella pagina web. Viene usata per disegnare a 60 FPS gli elementi complessi (Hard Disk, RAM, linee al neon curve) direttamente via codice, risultando infinitamente più leggero di un video.
2. **GSAP (GreenSock Animation Platform)**: Lo standard assoluto per le animazioni web. Funge da "regista": invece di programmare le traiettorie e la matematica dei frame a mano, utilizziamo GSAP per creare delle `Timeline`. GSAP si occupa di calcolare i ritardi, gli effetti di accelerazione (easing) e gli "stagger" (effetti a catena), rendendo le animazioni di P5.js fluide e professionali con 2 righe di codice.
