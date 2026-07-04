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
