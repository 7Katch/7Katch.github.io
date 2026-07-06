---
name: katchkit-cards
description: "Istruzioni su come utilizzare e formattare i componenti card (card-def, card-tip, card-warning, card-formula) in Katchkit."
---

# Katchkit Cards Component Skill

Quando si aggiungono "callout", sezioni di attenzione, definizioni o note nel sito `7Katch.github.io`, **NON USARE** stili CSS inline o vecchie classi (es. `.callout`). 

Katchkit fornisce **4 componenti nativi** per formattare i blocchi testuali in modo semantico. Ognuno di essi ha già i propri colori, bordi e glow preimpostati per il tema scuro.

## 1. Varianti Disponibili

Scegli la classe principale in base al tipo di informazione:
- `card-def` (Verde Neon): Usato per definizioni, concetti chiave o concetti base.
- `card-tip` (Viola/Lilla): Usato per suggerimenti, tips, note secondarie.
- `card-formula` (Giallo/Ocra): Usato per formule matematiche, teoremi o blocchi logici.
- `card-warning` (Arancio/Ambra): Usato per avvisi, pericoli, limitazioni o "watch-out" come preemption/starvation.

## 2. Struttura HTML Obbligatoria

Ogni card deve contenere **due div interni**:
1. `<div class="header">`: Il titolo della card, che può (e dovrebbe) includere un'icona Bootstrap `bi-` pertinente. Non usare emoji testuali.
2. `<div class="content">`: Il contenuto della card, formattato preferibilmente con paragrafi `<p>`.

### Esempio corretto
```html
<div class="card-warning">
  <div class="header">
    <i class="bi bi-exclamation-triangle-fill"></i> Attenzione al Deadlock
  </div>
  <div class="content">
    <p>Questo è un avviso critico. I colori si adatteranno automaticamente alla variante scelta (warning = ambra).</p>
  </div>
</div>
```

## 3. Regole d'Oro per l'Assistente IA
1. **Niente CSS Inline:** Non forzare mai colori (es. `style="border-color: var(--amber)"`). Il CSS si occupa di ricolorare automaticamente l'`header` e il bordo.
2. **Niente Emoji nel titolo:** Usa sempre il tag `<i>` con le icone Bootstrap (es. `<i class="bi bi-info-circle-fill"></i>`).
3. **Pulisci i vecchi `.callout`:** Se un utente ti chiede di modificare un vecchio `<div class="callout">`, aggiornalo a questa nuova struttura.
