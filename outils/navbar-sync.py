#!/usr/bin/env python3
"""
navbar-sync.py — la barre de navigation de référence du site d'Ana Ruiz.

La barre de navigation (<nav class="navbar">…</nav>) est recopiée dans chacune
des pages HTML du site. Pour qu'elle soit strictement identique partout, ce
script la régénère à partir d'UN SEUL modèle (ci-dessous) et des libellés par
langue, et la remplace dans toutes les pages.

Usage, depuis la racine du dépôt :
    python3 outils/navbar-sync.py            # réécrit la barre dans toutes les pages
    python3 outils/navbar-sync.py --check    # ne modifie rien ; échoue si une page diffère

Ce que le script fait :
- détecte la langue de chaque page (attribut lang de <html>) et son dossier
  (racine = français, en/, es/, de/, zh/) ;
- construit les liens relatifs corrects (« ../ » dans les dossiers de langue) ;
- marque la langue courante dans le sélecteur de drapeaux ;
- remplace le bloc <nav class="navbar">…</nav> de la page.

Ce que le script ne fait PAS :
- le sous-menu « Œuvres » (ajouté au chargement par js/galeries-menu.js) ;
- le style (css/theme.css et css/style-modern.css, jamais de CSS de navbar
  dans les pages).

Pour ajouter une entrée au menu : modifier ITEMS et LABELS, puis relancer.
"""
import argparse
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANG_DIRS = {"fr": "", "en": "en", "es": "es", "de": "de", "zh": "zh"}

# Entrées du menu, dans l'ordre : (fichier, clé de libellé)
ITEMS = [
    ("index.html", "home"),
    ("galeries.html", "works"),
    ("publications.html", "publications"),
    ("diaporama.html", "slideshow"),
    ("apropos.html", "bio"),
    ("contact.html", "contact"),
]

LABELS = {
    "fr": dict(home="Accueil", works="Oeuvres", publications="Publications", slideshow="Diaporama", bio="Bio", contact="Contact",
               signature="Signature Ana Ruiz", theme="Changer le thème", menu="Ouvrir le menu"),
    "en": dict(home="Home", works="Works", publications="Publications", slideshow="Slideshow", bio="Bio", contact="Contact",
               signature="Signature Ana Ruiz", theme="Change theme", menu="Open menu"),
    "es": dict(home="Inicio", works="Obras", publications="Publicaciones", slideshow="Diapositivas", bio="Biografía", contact="Contacto",
               signature="Firma de Ana Ruiz", theme="Cambiar tema", menu="Abrir menú"),
    "de": dict(home="Startseite", works="Werke", publications="Publikationen", slideshow="Diashow", bio="Biografie", contact="Kontakt",
               signature="Signatur Ana Ruiz", theme="Design wechseln", menu="Menü öffnen"),
    "zh": dict(home="首页", works="作品", publications="出版物", slideshow="幻灯片", bio="简介", contact="联系",
               signature="Ana Ruiz 的签名", theme="切换主题", menu="打开菜单"),
}

# Drapeaux, dans l'ordre d'affichage : (code, aria-label/title, emoji de secours)
FLAGS = [("fr", "Français", "🇫🇷"), ("en", "English", "🇬🇧"), ("es", "Español", "🇪🇸"), ("de", "Deutsch", "🇩🇪"), ("zh", "中文", "🇨🇳")]

NAV_RE = re.compile(r'<nav class="navbar">.*?</nav>', re.S)


def build_nav(lang, page_file):
    """Construit le bloc <nav> pour une page donnée (langue + nom de fichier)."""
    t = LABELS[lang]
    up = "" if lang == "fr" else "../"           # vers la racine du site
    links = "\n".join(f'<li><a href="{f}">{t[key]}</a></li>' for f, key in ITEMS)
    flags = []
    for code, name, emoji in FLAGS:
        if code == lang:
            href = page_file
        elif code == "fr":
            href = up + page_file
        else:
            href = up + code + "/" + page_file
        flags.append(f'<a aria-label="{name}" class="lang-link" data-lang="{code}" href="{href}" title="{name}">{emoji}</a>')
    return f'''<nav class="navbar">
<div class="navbar-container">
<div class="nav-logo">
<a aria-label="Ana Ruiz" class="site-brand">Ana Ruiz</a>
<img alt="{t["signature"]}" class="nav-signature" decoding="async" height="45" loading="eager" src="{up}img/signature.png" width="106"/>
</div>
<ul class="nav-links" id="primary-nav">
{links}
</ul>
<div class="nav-actions">
<div class="lang-switcher">
{chr(10).join(flags)}
</div>
<button aria-label="{t["theme"]}" class="theme-toggle" id="theme-toggle" type="button">
<span class="theme-icon">☀︎</span>
</button>
<button aria-controls="primary-nav" aria-label="{t["menu"]}" class="hamburger" id="menu-toggle">☰</button>
</div>
</div>
</nav>'''


def site_pages():
    for lang, d in LANG_DIRS.items():
        folder = os.path.join(ROOT, d) if d else ROOT
        for name in sorted(os.listdir(folder)):
            if not name.endswith(".html") or name.startswith("_") or name == "nav-snippet.html":
                continue
            yield lang, os.path.join(folder, name), name


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="vérifie seulement, sans modifier")
    args = ap.parse_args()
    changed, same, missing = [], [], []
    for lang, path, name in site_pages():
        html = open(path, encoding="utf-8").read()
        m = NAV_RE.search(html)
        if not m:
            missing.append(path)
            continue
        page_lang = re.search(r'<html[^>]*\blang="([a-z]+)"', html)
        if page_lang and page_lang.group(1) != lang:
            print(f"ATTENTION : {path} déclare lang={page_lang.group(1)} mais est dans le dossier {lang}")
        # La 404 est servie à n'importe quelle adresse : ses liens partent de la racine (base href="/").
        new = build_nav(lang, "index.html" if name == "404.html" else name)
        if m.group(0) == new:
            same.append(path)
        else:
            changed.append(path)
            if not args.check:
                open(path, "w", encoding="utf-8").write(html[:m.start()] + new + html[m.end():])
    rel = lambda p: os.path.relpath(p, ROOT)
    for p in missing:
        print("SANS NAVBAR :", rel(p))
    if args.check:
        for p in changed:
            print("DIFFÈRE :", rel(p))
        print(f"{len(same)} page(s) conformes, {len(changed)} différente(s), {len(missing)} sans navbar")
        sys.exit(1 if (changed or missing) else 0)
    print(f"{len(changed)} page(s) réécrite(s), {len(same)} déjà conformes, {len(missing)} sans navbar")


if __name__ == "__main__":
    main()
