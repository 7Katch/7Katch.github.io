from manim import *

class HelloCityLogic(Scene):
    def construct(self):
        text = Text("Hello CityLogic!", font_size=72)
        subtitle = Text("Primo test Manim su GitHub Pages", font_size=36, color=BLUE)
        
        VGroup(text, subtitle).arrange(DOWN, buff=0.5)
        
        self.play(Write(text))
        self.play(FadeIn(subtitle, shift=UP))
        self.wait(1)
        
        # Facciamo una piccola animazione extra
        box = SurroundingRectangle(text, color=YELLOW, buff=0.2)
        self.play(Create(box))
        self.wait(2)
        
        self.play(FadeOut(VGroup(text, subtitle, box)))
