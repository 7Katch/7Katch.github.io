import os

dir_path = r"c:\Users\Davide\Documents\GitHub\7Katch.github.io\EDIDS\argomenti"

for filename in os.listdir(dir_path):
    if filename.endswith(".html"):
        filepath = os.path.join(dir_path, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace ❌ with <i class="bi bi-x-circle-fill" style="margin-right:0.3rem;"></i>
        # Replace ✅ with <i class="bi bi-check-circle-fill" style="margin-right:0.3rem;"></i>
        new_content = content.replace("❌", '<i class="bi bi-x-circle-fill" style="margin-right:0.25rem;"></i>')
        new_content = new_content.replace("✅", '<i class="bi bi-check-circle-fill" style="margin-right:0.25rem;"></i>')
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated emojis in {filename}")
