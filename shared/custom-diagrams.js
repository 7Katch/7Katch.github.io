import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
const customCSS = `
    /* Node Shapes */
    .node.bad rect, .node.bad circle, .node.bad polygon, .node.bad path, .node.bad ellipse { fill: #442222 !important; stroke: #ff5f57 !important; stroke-width: 2px !important; }
    .node.good rect, .node.good circle, .node.good polygon, .node.good path, .node.good ellipse { fill: #1a3320 !important; stroke: #28c840 !important; stroke-width: 2px !important; }
    .node.blue rect, .node.blue circle, .node.blue polygon, .node.blue path, .node.blue ellipse { fill: #102a45 !important; stroke: #0a84ff !important; stroke-width: 2px !important; }
    .node.purple rect, .node.purple circle, .node.purple polygon, .node.purple path, .node.purple ellipse { fill: #2b2052 !important; stroke: #7c5cfc !important; stroke-width: 2px !important; }
    .node.yellow rect, .node.yellow circle, .node.yellow polygon, .node.yellow path, .node.yellow ellipse { fill: #443110 !important; stroke: #ffbd2e !important; stroke-width: 2px !important; }
    .node.grey rect, .node.grey circle, .node.grey polygon, .node.grey path, .node.grey ellipse { fill: #2b2b36 !important; stroke: #444 !important; stroke-width: 1px !important; }
    
    /* Text Color */
    .node.bad .label, .node.good .label, .node.blue .label, .node.purple .label, .node.yellow .label { color: #fff !important; }
    .node.bad text, .node.good text, .node.blue text, .node.purple text, .node.yellow text { fill: #fff !important; }
    .node.grey .label { color: #aaa !important; }
    .node.grey text { fill: #aaa !important; }
`;

mermaid.initialize({ 
    startOnLoad: true, 
    theme: 'dark',
    themeCSS: customCSS
});
