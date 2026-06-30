const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Davide', 'Documents', 'GitHub', '7Katch.github.io', 'EDIDS', 'argomenti', '05-modellazione-design.html');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
    { target: /fill:#102a45,stroke:#0a84ff,stroke-width:2px,color:#fff/g, replacement: ':::blue' },
    { target: /fill:#442222,stroke:#ff5f57,stroke-width:2px,color:#fff/g, replacement: ':::bad' },
    { target: /fill:#1a3320,stroke:#28c840,stroke-width:2px,color:#fff/g, replacement: ':::good' },
    { target: /fill:#2b2052,stroke:#7c5cfc,stroke-width:2px,color:#fff/g, replacement: ':::purple' },
    { target: /fill:#443110,stroke:#ffbd2e,stroke-width:2px,color:#fff/g, replacement: ':::yellow' },
    { target: /fill:#2b2b36,stroke:#444,stroke-width:1px,color:#aaa/g, replacement: ':::grey' },
    { target: /fill:#2b2b36,stroke:#444,color:#fff/g, replacement: ':::grey' }, // In case there are older variants
];

replacements.forEach(r => {
    content = content.replace(r.target, r.replacement);
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fatto!');
