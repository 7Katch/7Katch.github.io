import os
import re

files = {
    '07-main-memory.html': 'theme-teal',
    '08-virtual-memory.html': 'theme-teal',
    '09-io-systems.html': 'theme-green',
    '10-mass-storage.html': 'theme-green',
    '11-file-system.html': 'theme-green',
    '12-embedded-systems.html': 'theme-coral',
    '13-sicurezza.html': 'theme-coral'
}

base_path = r"c:\Users\Davide\Documents\GitHub\7Katch.github.io\SO\argomenti"

for filename, theme in files.items():
    filepath = os.path.join(base_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    prefix = filename[:2]

    if prefix != '07':
        # 1. Update Head
        head_pattern = r'(<title>.*?</title>).*?(</head>)'
        replacement = r'\1\n  <link rel="stylesheet" href="/shared/katchkit.css">\n\2'
        content = re.sub(head_pattern, replacement, content, flags=re.DOTALL)

        # 2. Update Body
        content = re.sub(r'<body class="dot-grid">', f'<body class="dot-grid {theme}">', content)

        # 3. Update sb-sections
        sb_pattern = r'<ul class="sb-sections">.*?</ul>'
        content = re.sub(sb_pattern, '<ul class="sb-sections"></ul>', content, flags=re.DOTALL)

        # 4. Update Nav
        nav_pattern = r'<nav>.*?</nav>'
        nav_replacement = """  <!-- ═══════ NAV ═══════ -->
  <nav>
    <div class="nav-left">
      <button id="sidebar-toggle" aria-label="Menu"></button>
      <a href="../" class="nav-logo">// SO · Sistemi Operativi</a>
    </div>

    <div class="nav-right">
      <a href="../" class="nav-back"><i class="bi bi-arrow-left"></i> Indice SO</a>
      <a href="/" class="nav-back"><i class="bi bi-house"></i> Home</a>
    </div>
  </nav>"""
        content = re.sub(nav_pattern, nav_replacement, content, flags=re.DOTALL)

        # 5. Update index-grid
        def replace_grid(match):
            inner = match.group(1)
            names = re.findall(r'<div class="idx-name">(.*?)</div>', inner)
            list_items = '\n        '.join(f'<li>{name}</li>' for name in names)
            return f'<div class="index-grid" data-prefix="{prefix}">\n      <ul>\n        {list_items}\n      </ul>\n    </div>\n\n  <div class="section-block"'

        content = re.sub(r'<div class="index-grid">(.*?)</div>\s*<div class="section-block"', replace_grid, content, flags=re.DOTALL)

        # 6. Replace script
        script_pattern = r'<script id="so-sb-js">.*?</script>'
        content = re.sub(script_pattern, '', content, flags=re.DOTALL)

        if '<script src="/shared/katchkit.js"></script>' not in content:
            content = content.replace('</body>', '  <script src="/shared/katchkit.js"></script>\n</body>')
    else:
        # File 07 might just need the script tag
        if '<script src="/shared/katchkit.js"></script>' not in content:
            content = content.replace('</body>', '  <script src="/shared/katchkit.js"></script>\n</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Done")
