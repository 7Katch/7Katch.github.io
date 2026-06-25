import re
import sys

def refactor_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. <div class="section" -> <div class="section-block"
    content = re.sub(r'<div class="section" id="([^"]+)">', r'<div class="section-block" id="\1">', content)
    content = re.sub(r'<div class="content-section" id="([^"]+)">', r'<div class="section-block" id="\1">', content)

    # 2. eyebrow + section-title -> <h2><span class="dot"></span> ...
    content = re.sub(
        r'<div class="eyebrow">GRASP · (\d+)</div>\s*<h2 class="section-title">([^<]+)</h2>',
        r'<h2><span class="dot"></span> GRASP \1: \2</h2>',
        content
    )
    content = re.sub(
        r'<div class="section-eyebrow">GoF · ([^<]+)</div>\s*<h2 class="section-title">([^<]+)</h2>',
        r'<h2><span class="dot"></span> GoF (\1): \2</h2>',
        content
    )

    # 3. section-intro -> styled paragraph
    content = re.sub(
        r'<p class="section-intro">',
        r'<p style="color:var(--text-secondary); font-size:1.05rem; margin-bottom:1.5rem;">',
        content
    )

    # 4. grasp-card -> card-def
    content = re.sub(r'<div class="grasp-card">', r'<div class="card-def">', content)

    # 5. card-head -> header
    content = re.sub(
        r'<div class="card-head">\s*<div class="grasp-icon">([^<]+)</div>\s*<h3>([^<]+)</h3>\s*</div>',
        r'<div class="header">\1 · \2</div>',
        content
    )

    # 6. card-desc -> content
    content = re.sub(
        r'<div class="card-desc">',
        r'<div class="content">\n                <p style="margin:0; color:var(--text-secondary);">',
        content
    )

    # 7. grasp-tag -> close p, add badge, close content
    content = re.sub(
        r'</div>\s*<span class="grasp-tag">([^<]+)</span>',
        r'</p>\n                <div style="margin-top:1rem;"><span class="badge-sm" style="border:1px solid var(--border); padding:4px 8px; border-radius:4px; color:var(--kk-primary);">\1</span></div>\n            </div>',
        content
    )

    # 8. principle-link -> card-def or just styled box
    content = re.sub(
        r'<div class="principle-link">',
        r'<div class="principle-link" style="margin-top:2rem; padding:1.25rem; background:rgba(255,255,255,0.02); border-left:3px solid var(--kk-primary); color:var(--text-secondary); font-size:0.95rem; line-height:1.6; border-radius:0 10px 10px 0;">',
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Refactoring complete.")

if __name__ == "__main__":
    refactor_html(r"c:\Users\Davide\Documents\GitHub\7Katch.github.io\EDIDS\argomenti\05-modellazione-design.html")
