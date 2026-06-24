import glob

for f in glob.glob('c:/Users/Davide/Documents/GitHub/7Katch.github.io/EDIDS/argomenti/*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = content.replace('<button id="sidebar-toggle" aria-label="Menu"></button>', '<button id="sidebar-toggle" aria-label="Menu"><i class="bi bi-list"></i></button>')
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Icon added to all EDIDS pages!")
