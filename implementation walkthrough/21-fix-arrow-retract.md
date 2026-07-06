# Fix Z-Index e Scomparsa Freccia in Ritrazione

## Problema
Durante l'animazione di ritrazione della freccia verso i blocchi dei Thread (T1 e T2), la freccia non svaniva completamente: la testa del triangolo rimaneva visibile sopra al blocco anche quando la distanza era azzerata. Questo accadeva per due motivi:
1. La funzione di disegno renderizzava sempre e comunque il triangolo, anche quando la linea aveva lunghezza 0.
2. Le frecce venivano renderizzate *dopo* i processi (T1, T2) e quindi venivano dipinte *sopra* i blocchi (z-index maggiore), rendendo visibile l'artefatto.

## Soluzione
Abbiamo corretto l'anomalia su due fronti:

1. **`shared/animation.js`**: Abbiamo avvolto l'intero blocco di disegno del triangolo (head) dentro il controllo `if (dist > 1)`. In questo modo, quando la distanza si annulla del tutto, l'arrow head non viene renderizzato, eliminando l'artefatto grafico finale sulla punta.
2. **`05-sincronizzazione.html`**: Abbiamo modificato l'ordine di chiamata nella funzione di *draw* (callback di loop). Ora `factory.drawArrowBetween` viene invocato *prima* di `factory.drawProcess(pr)`. Con questo banale ribaltamento, il contesto canvas di P5.js dipinge i vettori delle frecce sullo sfondo, e successivamente ci "incolla" sopra i nodi T1 e T2. Il risultato è che le frecce sembrano estendersi "da sotto" e ritirarsi "sotto" i blocchi, migliorando notevolmente il realismo e la pulizia del rendering dell'animazione.
