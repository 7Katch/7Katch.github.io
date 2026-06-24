Ecco il documento ufficiale completo e dettagliato del tuo framework. Puoi copiare tutto il testo qui sotto e salvarlo in un file chiamato `KatchKit-Docs.md` (o `README.md`).

Questa è la tua "Bibbia" personale per quando dovrai creare nuove pagine senza dover ricavare l'HTML dai file vecchi!

---

# 🎨 KatchKit UI Framework - Documentazione Ufficiale

KatchKit è un framework CSS e JS personalizzato, progettato per la stesura rapida di appunti informatici e manualistica tecnica. Sfrutta un sistema di **Theming Dinamico** e un approccio a componenti per mantenere il codice HTML pulito e semanticamente corretto.

---

## 📦 1. Installazione e Setup Base

Per iniziare una nuova pagina vuota, il tuo file HTML deve avere esclusivamente questa struttura nell'`<head>` e importare il file JavaScript prima della chiusura del `<body>`.

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Titolo Pagina</title>
  <link rel="stylesheet" href="katchkit.css">
</head>

<body class="dot-grid">

  <script src="katchkit.js"></script>
</body>
</html>

```

---

## 🎨 2. Theming Dinamico (Colori Globali)

KatchKit usa l'Ambra come colore di default. Per cambiare l'intero set di colori (titoli, bottoni, bordi, ombre, hover) di **tutta la pagina**, ti basta aggiungere una specifica classe al tag `<body>`:

* `<body class="dot-grid">` → **Ambra** (Default, usato per *Sistemi Operativi, Processi*)
* `<body class="dot-grid theme-teal">` → **Azzurro Fluo** (Usato per *CPU Scheduling*)
* `<body class="dot-grid theme-coral">` → **Rosso Corallo** (Usato per *Deadlocks*)
* `<body class="dot-grid theme-emerald">` → **Verde Smeraldo** (Usato per *Sincronizzazione*)
* `<body class="dot-grid theme-purple">` → **Viola Accento** (Base neutra informatica)

---

## 🧭 3. Layout e Struttura Principale

### Navbar (Barra di navigazione superiore)

Deve essere posta all'inizio del `body`. Utilizza il Web Component `<site-navbar>` che genera automaticamente la struttura HTML, il pulsante Hamburger e i link corretti tramite attributi.

```html
<site-navbar 
  logo-text="// SO · Nome Materia" 
  back-url="../index.html" 
  back-text="Indice">
</site-navbar>
```

### Hero Section (Intestazione di Pagina)

Il blocco visivo principale in alto. Si adatta automaticamente al tema. Ora è centralizzato tramite Web Component:

```html
<site-hero 
  eyebrow="Macroargomento 01" 
  topic-num="01 / 13" 
  title="Titolo Gigante" 
  sub="Sottotitolo descrittivo che spiega di cosa parla la pagina.">
</site-hero>
```

*(Nota: gli attributi `eyebrow`, `topic-num` e `sub` sono opzionali. Se omessi, le rispettive parti non verranno renderizzate).*

```

### Contenitore Principale

Tutto il contenuto testuale della pagina deve essere avvolto nel `content-wrap`.

```html
<hr class="divider"> <div class="content-wrap">
  
  <div class="nav-breadcrumb">
    <a href="#">Sito</a><span>/</span>
    <a href="#">Materia</a><span>/</span>
    <span>Pagina Attuale</span>
  </div>

  </div>

```

---

## 📝 4. Testo e Tipografia

### Blocco Sezione (Il contenitore standard per i paragrafi)

Ogni capitolo o paragrafo va dentro un `section-block`.
Il tag `<h2>` prevede un pallino colorato (`.dot`) e supporta un piccolo tag testuale in linea (`.sub-tag`).

```html
<div class="section-block" id="section-1">
  <h2>
    <span class="dot"></span> 
    Titolo del Paragrafo 
    <span class="sub-tag">Importante</span>
  </h2>
  
  <p>Questo è un paragrafo di testo normale.</p>
</div>

```

### Formattazione Inline (Dentro i paragrafi)

* **Parola chiave in risalto:** `<span class="keyword">Testo</span>`
* **Codice inline / Comandi:** `<code class="inline">printf()</code>`

---

## 📦 5. Componenti e Callouts (Box)

### Theme Box (Si colora in base al tema scelto nel body)

```html
<div class="theme-box">
  Questo box prenderà il colore globale della pagina. Ottimo per riassunti.
  Puoi usare <strong>Testo in grassetto</strong> per colorarlo pesantemente.
</div>

```

### Box Semantici Fissi (Mantengono sempre il loro colore di base)

```html
<div class="highlight-box">Verde: Da usare per successi o best practices.</div>
<div class="warn-box">Rosso/Corallo: Da usare per pericoli, errori da non fare.</div>

```

### Card Definizione

Usa questa struttura per le definizioni chiave. **Nota:** non serve inserire l'icona SVG, ci penserà `katchkit.js` a inocularla automaticamente a runtime!

```html
<div class="card-def">
  <div class="card-def-header">Definizione</div>
  <div class="card-def-content">
    <p>Il <span class="keyword">Sistema Operativo</span> è il software base...</p>
  </div>
</div>

```

---

## 🗂 6. Griglia Indice (Index Grid)

Usata all'inizio della pagina per permettere il salto rapido (tramite ID) alle varie sezioni.

```html
<div class="index-grid">
  <div class="index-item" data-target="section-1">
    <div class="idx-num">01.01</div>
    <div class="idx-name">Titolo Paragrafo 1</div>
  </div>
  
  <div class="index-item" data-target="section-2">
    <div class="idx-num">01.02</div>
    <div class="idx-name">Titolo Paragrafo 2</div>
  </div>
</div>

```

---

## 💻 7. Componenti Specifici Informatici

### Blocco di Codice (Stile Mac Terminal)

```html
<div class="code-block">
  <div class="code-header">
    <div class="code-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green-dot"></span>
    </div>
    <div class="code-filename">main.c</div>
  </div>
  <div class="code-body">
<pre><code>int main() {
    printf("Ciao Mondo!");
    return 0;
}</code></pre>
  </div>
</div>

```

### Diagramma degli Stati (Stile Processi OS)

Crea una catena visiva di badge con frecce in mezzo.

```html
<div class="state-diagram">
  <span class="state-box" style="background:rgba(90,80,128,0.3);color:var(--text-secondary)">New</span>
  <span class="arrow">→</span>
  <span class="state-box" style="background:rgba(52,211,153,0.15);color:var(--green)">Ready</span>
  <span class="arrow">→</span>
  <span class="state-box" style="background:rgba(251,191,36,0.15);color:var(--amber)">Running</span>
</div>

```

---

## 🗄 8. Sidebar a Scomparsa (Slide-out Panel)

Questa struttura va messa come primo elemento dentro il `body` (prima della navbar).
Gli attributi `data-target` servono a JavaScript per illuminare la voce in base allo scroll.

```html
<aside class="so-sidebar">
  
  <div class="sb-label">Macroargomenti</div>
  <ul class="sb-pages">
    <li><a href="01-pag.html"><span class="sb-pdot"></span>01 · Link Normale</a></li>
    <li><div class="sb-cur"><span class="sb-pdot"></span>02 · Pagina Corrente</div></li>
  </ul>
  
  <div class="sb-label">In questa pagina</div>
  <ul class="sb-sections">
    <li data-sid="section-1">
      <div class="sb-link" data-target="section-1">
        <span class="sb-idx">02.01</span>
        <span>Titolo Sezione 1</span>
      </div>
    </li>
  </ul>

</aside>

```

---

## 🔘 9. Bottoni e Paginazione

I bottoni possono essere inseriti ovunque. Il bottone `.btn-theme` prenderà automaticamente il colore del tema attivo sulla pagina.

```html
<div class="back-btn-wrap">
  <a href="pagina-precedente.html" class="btn btn-ghost">← Capitolo Precedente</a>
  <a href="indice.html" class="btn btn-theme">↑ Torna all'Indice</a>
  <a href="pagina-successiva.html" class="btn btn-ghost">Capitolo Successivo →</a>
</div>

```


### Navbar (Barra di navigazione superiore)
Deve essere posta all'inizio del `body`. Contiene il pulsante Hamburger per aprire e chiudere la Sidebar laterale.

**✨ Magia di KatchKit:** La navbar è ora un **Web Component** (`<site-navbar>`). Invece di incollare decine di righe di HTML e icone in ogni pagina, ti basta usare questo singolo tag. Passando gli attributi `logo-text`, `back-url` e `back-text`, il motore JavaScript genererà automaticamente tutta la barra in modo centralizzato!

```html
<site-navbar 
  logo-text="// SO · Nome Materia" 
  back-url="../index.html" 
  back-text="Indice"
  home-url="https://7Katch.github.io"> <!-- Opzionale, default: https://7Katch.github.io -->
</site-navbar>
```

## 🗂 10. Auto-Generazione dell'Indice e della Sidebar (Content-First)

KatchKit utilizza un approccio a "Singola Fonte di Verità" (Single Source of Truth). Questo significa che **non devi scrivere a mano** né le card della griglia centrale né i bottoni della sidebar laterale. Ti basta scrivere una semplice lista puntata al centro della pagina e il motore JavaScript costruirà tutto il layout automaticamente!

### Passo 1: La Sidebar Vuota
Nel tuo HTML, la sezione delle pagine della sidebar deve rimanere **completamente vuota**. Ci penserà JS a popolarla.

```html
<aside class="so-sidebar">
  <div class="sb-label">In questa pagina</div>
  <ul class="sb-sections"></ul> 
</aside>
```

### Passo 2: L'Indice Centrale (La tua Fonte di Verità)
Nel punto esatto in cui vuoi far apparire la griglia delle card (subito sotto il titolo della pagina), inserisci il div `.index-grid` con l'attributo `data-prefix` (che indica il numero del capitolo, es. "03" o "06").
All'interno, scrivi una normalissima lista HTML `<ul>` con i titoli dei tuoi sottoargomenti.

```html
<div class="index-grid" data-prefix="03">
  <ul>
    <li>Benefici del Multithreading</li>
    <li>Concorrenza vs Parallelismo</li>
    <li>Data & Task parallelism</li>
    <li>Legge di Amdahl</li>
    <li>User Thread e Kernel Thread</li>
  </ul>
</div>
```

**✨ Magia di KatchKit:** Quando la pagina si carica, il framework distruggerà questa semplice lista testuale e la trasformerà in una bellissima griglia di card cliccabili. Contemporaneamente, creerà i collegamenti speculari nella sidebar laterale, calcolando da solo i numeri progressivi e impostando tutti i `data-target` per lo scroll fluido!

### Passo 3: Scrivere i Paragrafi
Assicurati che i capitoli nel corpo della pagina abbiano un ID progressivo standard (`section-1`, `section-2`, ecc.), in modo che l'indice auto-generato sappia esattamente dove puntare.

```html
<div class="section-block" id="section-1">
  <h2><span class="dot"></span> Benefici del Multithreading</h2>
  <p>Testo del paragrafo...</p>
</div>
```