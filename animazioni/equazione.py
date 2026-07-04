from manim import *
from manim_slides import Slide

class Equazione(Slide):
    def construct(self):
        # 1. Definiamo i vari passaggi dell'equazione.
        # Spezzettando le stringhe in blocchi, permettiamo a Manim 
        # di capire come muovere i singoli pezzi (numeri, x, segni)
        eq1 = MathTex("2x", "+", "4", "=", "10")
        eq2 = MathTex("2x", "=", "10", "-", "4")
        eq3 = MathTex("2x", "=", "6")
        eq4 = MathTex("x", "=", "3")
        
        # Ingrandiamo il testo per renderlo più leggibile
        VGroup(eq1, eq2, eq3, eq4).scale(2.5)
        
        # Titolo in alto
        titolo = Text("Equazione di Primo Grado", color=BLUE).to_edge(UP)
        self.play(Write(titolo))
        
        # SLIDE 1: Mostriamo l'equazione iniziale
        self.play(Write(eq1))
        self.next_slide() # Aspetta il click per andare avanti
        
        # SLIDE 2: Spostiamo il +4 dall'altra parte
        # TransformMatchingTex è una magia: cerca i pezzi uguali e li fa fluttuare 
        # verso la nuova posizione fluidamente.
        self.play(TransformMatchingTex(eq1, eq2))
        self.next_slide() # Aspetta il click
        
        # SLIDE 3: Calcoliamo 10 - 4 = 6
        self.play(TransformMatchingTex(eq2, eq3))
        self.next_slide() # Aspetta il click
        
        # SLIDE 4: Dividiamo e mostriamo il risultato finale
        self.play(TransformMatchingTex(eq3, eq4))
        
        # Disegniamo una bella scatola dorata attorno al risultato finale
        box = SurroundingRectangle(eq4, color=YELLOW, buff=0.2)
        self.play(Create(box))
        
        self.next_slide() # Aspetta il click prima di finire la presentazione
        
        # SLIDE 5: Animazione di chiusura
        self.play(FadeOut(eq4), FadeOut(box), FadeOut(titolo))
