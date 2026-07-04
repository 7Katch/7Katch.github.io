import schemdraw
import schemdraw.elements as elm

# 1. Creiamo un nuovo disegno e impostiamo il tema scuro (così è perfetto per i neon)
with schemdraw.Drawing(theme='dark') as d:
    # 2. Definiamo i parametri del disegno
    d.config(fontsize=16, font='sans-serif', color='white', lw=2)
    
    # 3. Iniziamo il circuito: Generatore di tensione AC (V) a sinistra verso l'alto
    d += (V := elm.SourceSin().up().label('V_s'))
    
    # 4. Aggiungiamo un resistore verso destra
    d += (R := elm.Resistor().right().label('R = 10 \Omega'))
    
    # 5. Aggiungiamo un induttore in serie
    d += (L := elm.Inductor().right().label('L = 100 mH'))
    
    # 6. Scendiamo con un condensatore
    d += (C := elm.Capacitor().down().label('C = 10 \mu F'))
    
    # 7. Chiudiamo il circuito (linea verso sinistra che torna al generatore)
    d += elm.Line().left().tox(V.start)
    
    # Salviamo direttamente l'immagine in formato vettoriale SVG
    d.save('TDC/circuito_rlc_neon.svg')
    
print("SVG generato con successo!")
