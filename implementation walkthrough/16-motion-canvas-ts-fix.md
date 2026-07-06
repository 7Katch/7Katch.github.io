# Walkthrough: Fix Motion Canvas TypeScript JSX Runtime Error

## Modifiche effettuate
- Modificato il file `animazioni/playground/tsconfig.json` per risolvere un errore di risoluzione dei moduli in TypeScript 5+.
- Cambiato il valore di `"jsxImportSource"` da `"@motion-canvas/2d"` a `"@motion-canvas/2d/lib"`. Questo indica esplicitamente a TypeScript dove cercare i tipi del runtime JSX, dal momento che il pacchetto non definisce il campo `exports` in modo compatibile con `moduleResolution: "bundler"`.
- Aggiunto `"allowSyntheticDefaultImports": true` nelle `compilerOptions` del `tsconfig.json` per risolvere l'errore aggiuntivo legato all'importazione default di moduli sintetici (`Module '"*?scene"' can only be default-imported`).

## Risultato
L'esecuzione del compilatore TypeScript (`npx tsc --noEmit`) all'interno della cartella `animazioni/playground` avviene ora con successo senza restituire l'errore:
`This JSX tag requires the module path '@motion-canvas/2d/jsx-runtime' to exist, but none could be found.`
