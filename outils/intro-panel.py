#!/usr/bin/env python3
"""
Volets de présentation (18/10/2026)

Transforme les textes de présentation des pages d'exposition en volets repliables
<details class="intro-panel"> (composant CSS : css/theme.css, section « Volet de
présentation »). À lancer depuis la racine du site :  python3 outils/intro-panel.py

Deux cas sont traités, dans les 5 langues (racine = fr, puis en/, es/, de/, zh/) :

1. Pages avec <div class="gallery-intro"> … </div>
   (peau-dane, icone-ou-le-pouvoir-de-soi, angles-de-vie-2005, salon-versailles-2026)
   -> le div devient le corps du volet.

2. La maison ou le pouvoir de rentrer en soi-même (ancien mécanisme « En savoir plus » :
   .gallery-desc cliquable + #gallery-desc-full .expanded-text ouvert par JavaScript)
   -> la phrase d'accroche redevient un simple sous-titre, le texte complet devient le
   corps du volet, et les règles CSS inline de l'ancien mécanisme sont retirées.

Le script est idempotent : une page déjà transformée est laissée telle quelle.
Pour ajouter une langue : compléter LABELS et LANG_DIRS.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

LANG_DIRS = {"fr": ".", "en": "en", "es": "es", "de": "de", "zh": "zh"}

# Libellé du titre du volet et du bouton de fermeture, par langue
LABELS = {
    "fr": ("Présentation de l’exposition", "Replier"),
    "en": ("About the exhibition", "Close"),
    "es": ("Presentación de la exposición", "Cerrar"),
    "de": ("Zur Ausstellung", "Schließen"),
    "zh": ("展览介绍", "收起"),
}

INTRO_PAGES = [
    "peau-dane.html",
    "icone-ou-le-pouvoir-de-soi.html",
    "angles-de-vie-2005.html",
    "salon-versailles-2026.html",
]
MAISON_PAGE = "la-maison-ou-le-pouvoir-de-rentrer-en-soi-meme-2012.html"


def panel(lang, body):
    label, close = LABELS[lang]
    body = body.strip("\n")
    return (
        '<details class="intro-panel">\n'
        '<summary class="intro-panel-summary"><span>%s</span>'
        '<span class="intro-panel-chevron" aria-hidden="true"></span></summary>\n'
        '<div class="intro-panel-body">\n%s\n'
        '<button type="button" class="intro-panel-close">%s</button>\n'
        '</div>\n'
        '</details>'
    ) % (label, body, close)


def convert_intro(path, lang):
    s = path.read_text(encoding="utf-8")
    if "intro-panel" in s:
        return "déjà fait"
    m = re.search(r'<div class="gallery-intro">(.*?)</div>', s, re.S)
    if not m:
        return "pas de gallery-intro"
    s = s[: m.start()] + panel(lang, m.group(1)) + s[m.end():]
    path.write_text(s, encoding="utf-8")
    return "ok"


def convert_maison(path, lang):
    s = path.read_text(encoding="utf-8")
    if "intro-panel" in s:
        return "déjà fait"

    # 1. accroche : plus un bouton, un simple sous-titre
    s, n1 = re.subn(
        r'<div aria-expanded="false" class="gallery-desc" id="gallery-desc" role="button" tabindex="0">',
        '<div class="gallery-desc">', s)
    # 2. commentaire de travail obsolète
    s = s.replace("<!-- remplacer le contenu actuel de #gallery-desc-full par : -->\n", "")
    # 3. texte complet -> volet (le bouton ✕ de l'ancien mécanisme disparaît)
    m = re.search(
        r'<div aria-hidden="true" class="expanded-text" id="gallery-desc-full">\s*'
        r'<button[^>]*class="expanded-close"[^>]*>✕</button>(.*?)\n</div>\n(?=<div class="gallery-works">)',
        s, re.S)
    if n1 != 1 or not m:
        return "structure inattendue"
    s = s[: m.start()] + panel(lang, m.group(1)) + "\n" + s[m.end():]

    # 4. CSS inline de l'ancien mécanisme : .gallery-desc redevient un sous-titre simple
    s, n4 = re.subn(
        r'    \.gallery-desc \{.*?\n    \}\n(?:    /\*.*?\*/\n)?    \.gallery-desc::after \{.*?\n    \}\n'
        r'    /\*.*?\*/\n    \.gallery-desc:hover,\n    \.gallery-desc:focus \{.*?\n    \}\n',
        '    .gallery-desc {\n      color: #cec9c4;\n      font-size: 1.09rem;\n      margin: 0 auto 1.4em auto;\n'
        '      max-width: 880px;\n      text-align: center;\n      font-style: italic;\n      line-height: 1.3;\n    }\n',
        s, flags=re.S)
    # 5. blocs .expanded-* (le composant est désormais dans css/theme.css)
    s, n5 = re.subn(r'    /\* Bloc étendu : fond, ombre et priorité d\'affichage \*/\n'
                    r'    \.expanded-text \{.*?\n    \}\n    \.expanded-text\.open \{.*?\n    \}\n'
                    r'    /\* bouton Fermer \*/\n    \.expanded-close \{.*?\n    \}\n'
                    r'    \.expanded-text\.open \.expanded-close \{ display: block; \}\n', '', s, flags=re.S)
    s, n6 = re.subn(r'    /\* Styles pour le texte étendu \*/\n    \.expanded-text p \{.*?\n    \}\n'
                    r'    \.expanded-text blockquote \{.*?\n    \}\n    \.expanded-text \.source \{.*?\n    \}\n',
                    '', s, flags=re.S)
    if (n4, n5, n6) != (1, 1, 1):
        return "CSS inline inattendu (%d,%d,%d)" % (n4, n5, n6)
    assert "expanded" not in s, path
    path.write_text(s, encoding="utf-8")
    return "ok"


def main():
    for lang, d in LANG_DIRS.items():
        base = ROOT / d
        for page in INTRO_PAGES:
            p = base / page
            print("%-4s %-60s %s" % (lang, p.relative_to(ROOT), convert_intro(p, lang) if p.exists() else "absent"))
        p = base / MAISON_PAGE
        print("%-4s %-60s %s" % (lang, p.relative_to(ROOT), convert_maison(p, lang) if p.exists() else "absent"))


if __name__ == "__main__":
    sys.exit(main())
