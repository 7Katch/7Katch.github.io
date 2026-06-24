import glob

links = '''  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">'''

for f in glob.glob('c:/Users/Davide/Documents/GitHub/7Katch.github.io/EDIDS/argomenti/*.html') + ['c:/Users/Davide/Documents/GitHub/7Katch.github.io/EDIDS/teoria.html']:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if "bootstrap-icons" not in content:
        content = content.replace('</title>', '</title>\n' + links)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)

print("Fonts and icons added!")
