const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Davide', 'Documents', 'GitHub', '7Katch.github.io', 'EDIDS', 'argomenti', '05-modellazione-design.html');
const txtPath = path.join('c:', 'Users', 'Davide', 'Documents', 'GitHub', '7Katch.github.io', 'gof_content.txt');

let content = fs.readFileSync(filePath, 'utf-8');
const newGof = fs.readFileSync(txtPath, 'utf-8');

// Trova gli indici per sostituire il blocco
const startMarker = '<!-- ===== I 7 PATTERN GOF IN CITYLOGIC ===== -->';
const endMarker = '<!-- Navigation -->';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);
    
    // Unisci
    const finalContent = before + newGof + '\n      ' + after;
    fs.writeFileSync(filePath, finalContent, 'utf-8');
    console.log('Sostituzione completata con successo!');
} else {
    console.log('Errore: non ho trovato i marker.');
}
