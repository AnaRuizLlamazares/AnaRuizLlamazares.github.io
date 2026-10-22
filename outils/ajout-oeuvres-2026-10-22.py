#!/usr/bin/env python3
"""
Intégration des images reçues d'Ana le 22/10/2026 (script d'archive : il a été
lancé une fois, il est conservé pour montrer comment les pages ont été modifiées).

1. Angles de vie (2005) : deux œuvres ajoutées, « Air, eau, ciel » et « El Cid à Mogador »
   (titres tels que donnés par Ana dans ses fichiers), dans les 5 langues : carte de
   l'œuvre, JSON-LD (CollectionPage.hasPart, ExhibitionEvent.image, ItemList), sitemap.
2. Nouvelle page « Contre-verse autour des limites (2004) » construite à partir du
   gabarit de la page Angles de vie, avec seulement ce qui est connu : titre, année et
   trois toiles (Una noche sin luna, El misere, Le petit Quijote). Lieu, dates et
   texte de présentation restent à demander à Ana.

À lancer depuis la racine du site : python3 outils/ajout-oeuvres-2026-10-22.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = {"fr": ".", "en": "en", "es": "es", "de": "de", "zh": "zh"}
SITE = "https://anaruizllamazares.com/"

# ---------------------------------------------------------------- 1. Angles de vie
NEW_ADV = [
    ("Air, eau, ciel", "air-eau-ciel-ana-ruiz.webp", 1496, 1600),
    ("El Cid à Mogador", "el-cid-a-mogador-ana-ruiz.webp", 582, 1600),
]
# séparateur dans l'attribut alt : « — Angles de vie, Ana Ruiz » (zh : virgule pleine)
ALT_SEP = {"fr": ", ", "en": ", ", "es": ", ", "de": ", ", "zh": "，"}


def work_html(title, img_dir, file, w, h, expo, lang, prefix):
    alt = f"{title} — {expo}{ALT_SEP[lang]}Ana Ruiz Llamazares"
    src = f"{prefix}img/{img_dir}/{file}"
    return (f'<div class="gallery-work"><img alt="{alt}" data-large="{src}" decoding="async" '
            f'height="{h}" loading="lazy" src="{src}" width="{w}"/>'
            f'<div class="gallery-work-title">{title}</div></div>')


def add_to_jsonld(s, page_url, expo_name, works, img_dir, year, lang):
    """Complète les trois blocs JSON-LD d'une page d'exposition."""
    # bloc principal (liste WebSite / Person / CollectionPage / ExhibitionEvent)
    m = re.search(r'<script type="application/ld\+json">(\[.*?\])</script>', s, re.S)
    blocks = json.loads(m.group(1))
    for b in blocks:
        if b.get("@type") == "CollectionPage":
            b["hasPart"] = [p for p in b["hasPart"] if p["name"] not in [t for t, *_ in works]]
            for title, file, *_ in works:
                b["hasPart"].append({"@type": "VisualArtwork", "name": title,
                                     "creator": {"@id": SITE + "#person"}, "artMedium": "Painting",
                                     "image": f"{SITE}img/{img_dir}/{file}"})
        if b.get("@type") == "ExhibitionEvent":
            for title, file, *_ in works:
                u = f"{SITE}img/{img_dir}/{file}"
                if u not in b["image"]:
                    b["image"].append(u)
    s = s[:m.start(1)] + json.dumps(blocks, ensure_ascii=False) + s[m.end(1):]
    # bloc ItemList des œuvres
    m = re.search(r'<script type="application/ld\+json" data-artworks="1">(\{.*?\})</script>', s, re.S)
    il = json.loads(m.group(1))
    il["itemListElement"] = [e for e in il["itemListElement"] if e["item"]["name"] not in [t for t, *_ in works]]
    for title, file, *_ in works:
        il["itemListElement"].append({"@type": "ListItem", "position": len(il["itemListElement"]) + 1,
            "item": {"@type": "VisualArtwork", "name": title, "image": f"{SITE}img/{img_dir}/{file}",
                     "creator": {"@id": SITE + "#person"}, "artform": "Peinture", "dateCreated": year,
                     "inLanguage": lang, "isPartOf": {"@type": "ExhibitionEvent", "name": expo_name},
                     "url": page_url}})
    il["numberOfItems"] = len(il["itemListElement"])
    s = s[:m.start(1)] + json.dumps(il, ensure_ascii=False) + s[m.end(1):]
    return s


def update_angles_de_vie():
    for lang, d in LANGS.items():
        p = ROOT / d / "angles-de-vie-2005.html"
        s = p.read_text(encoding="utf-8")
        if "air-eau-ciel" in s:
            print(lang, "angles-de-vie : déjà fait"); continue
        prefix = "" if lang == "fr" else "../"
        html = "".join(work_html(t, "AnglesDeVie", f, w, h, "Angles de vie", lang, prefix) for t, f, w, h in NEW_ADV)
        anchor = '<div class="gallery-work-title">Angles de vie IV</div></div>'
        assert s.count(anchor) == 1, p
        s = s.replace(anchor, anchor + html)
        page_url = SITE + ("" if lang == "fr" else d + "/") + "angles-de-vie-2005.html"
        s = add_to_jsonld(s, page_url, "Angles de vie (2005)", NEW_ADV, "AnglesDeVie", "2005", lang)
        p.write_text(s, encoding="utf-8")
        print(lang, "angles-de-vie : ok")


# ---------------------------------------------------------- 2. Contre-verse (2004)
CV_FILE = "contre-verse-autour-des-limites-2004.html"
CV_WORKS = [
    ("Una noche sin luna", "una-noche-sin-luna-ana-ruiz.webp", 1136, 1600),
    ("El misere", "el-misere-ana-ruiz.webp", 1384, 1600),
    ("Le petit Quijote", "don-quijote-ana-ruiz.webp", 396, 1300),
]
# Textes d'interface par langue (les titres d'œuvres et d'expositions restent en français)
CV_TXT = {
    "fr": dict(title="Contre-verse autour des limites (2004)",
               desc="Trois toiles de l’exposition « Contre-verse autour des limites » (2004) d’Ana Ruiz Llamazares : Una noche sin luna, El misere, Le petit Quijote.",
               og="Contre-verse autour des limites (2004) | Ana Ruiz, artiste peintre",
               sub="Trois toiles de l’exposition de 2004.", meta="Exposition · 2004", works="Œuvres",
               crumb="Contre-verse autour des limites (2004)"),
    "en": dict(title="Contre-verse autour des limites (2004)",
               desc="Three canvases from Ana Ruiz Llamazares’s 2004 exhibition “Contre-verse autour des limites”: Una noche sin luna, El misere, Le petit Quijote.",
               og="Contre-verse autour des limites (2004) | Ana Ruiz, painter",
               sub="Three canvases from the 2004 exhibition.", meta="Exhibition · 2004", works="Works",
               crumb="Contre-verse autour des limites (2004)"),
    "es": dict(title="Contre-verse autour des limites (2004)",
               desc="Tres lienzos de la exposición « Contre-verse autour des limites » (2004) de Ana Ruiz Llamazares: Una noche sin luna, El misere, Le petit Quijote.",
               og="Contre-verse autour des limites (2004) | Ana Ruiz, pintora",
               sub="Tres lienzos de la exposición de 2004.", meta="Exposición · 2004", works="Obras",
               crumb="Contre-verse autour des limites (2004)"),
    "de": dict(title="Contre-verse autour des limites (2004)",
               desc="Drei Gemälde aus der Ausstellung „Contre-verse autour des limites“ (2004) von Ana Ruiz Llamazares: Una noche sin luna, El misere, Le petit Quijote.",
               og="Contre-verse autour des limites (2004) | Ana Ruiz, Malerin",
               sub="Drei Gemälde aus der Ausstellung von 2004.", meta="Ausstellung · 2004", works="Werke",
               crumb="Contre-verse autour des limites (2004)"),
    "zh": dict(title="Contre-verse autour des limites（2004）",
               desc="Ana Ruiz Llamazares 2004 年展览《Contre-verse autour des limites》中的三幅画作：Una noche sin luna、El misere、Le petit Quijote。",
               og="Contre-verse autour des limites（2004）| Ana Ruiz，画家",
               sub="2004 年展览中的三幅画作。", meta="展览 · 2004", works="作品",
               crumb="Contre-verse autour des limites（2004）"),
}


def build_contre_verse():
    for lang, d in LANGS.items():
        src = ROOT / d / "angles-de-vie-2005.html"
        dst = ROOT / d / CV_FILE
        if dst.exists():
            print(lang, "contre-verse : déjà fait"); continue
        s = src.read_text(encoding="utf-8")
        t = CV_TXT[lang]
        prefix = "" if lang == "fr" else "../"

        # --- en-tête : title, description, og/twitter, canonical, hreflang, JSON-LD ---
        s = s.replace("angles-de-vie-2005.html", CV_FILE)
        s = re.sub(r"<title>.*?</title>", f"<title>{t['og']}</title>", s, count=1, flags=re.S)
        for attr in ('name="description"', 'name="twitter:description"', 'property="og:description"'):
            s = re.sub(r'content="[^"]*" ' + re.escape(attr), f'content="{t["desc"]}" {attr}', s)
        for attr in ('name="twitter:title"', 'property="og:title"'):
            s = re.sub(r'content="[^"]*" ' + re.escape(attr), f'content="{t["og"]}" {attr}', s)
        s = s.replace("img/AnglesDeVie/angles-de-vie-1-ana-ruiz.webp", "img/ContreVerse2004/una-noche-sin-luna-ana-ruiz.webp")

        # JSON-LD principal : on reconstruit CollectionPage et ExhibitionEvent
        m = re.search(r'<script type="application/ld\+json">(\[.*?\])</script>', s, re.S)
        blocks = json.loads(m.group(1))
        page_url = SITE + ("" if lang == "fr" else d + "/") + CV_FILE
        out = []
        for b in blocks:
            if b.get("@type") == "CollectionPage":
                b["@id"] = page_url + "#webpage"; b["url"] = page_url
                b["name"] = t["og"]; b["description"] = t["desc"]
                b["primaryImageOfPage"] = {"@type": "ImageObject", "url": f"{SITE}img/ContreVerse2004/una-noche-sin-luna-ana-ruiz.webp"}
                b["hasPart"] = [{"@type": "VisualArtwork", "name": n, "creator": {"@id": SITE + "#person"},
                                 "artMedium": "Painting", "image": f"{SITE}img/ContreVerse2004/{f}"} for n, f, *_ in CV_WORKS]
            elif b.get("@type") == "ExhibitionEvent":
                # lieu et dates inconnus : on ne garde que ce qui est sûr
                b = {"@context": "https://schema.org", "@type": "ExhibitionEvent",
                     "name": "Contre-verse autour des limites", "description": t["desc"],
                     "startDate": "2004", "performer": {"@id": SITE + "#person"},
                     "image": [f"{SITE}img/ContreVerse2004/{f}" for _, f, *_ in CV_WORKS], "url": page_url}
            out.append(b)
        s = s[:m.start(1)] + json.dumps(out, ensure_ascii=False) + s[m.end(1):]

        # fil d'Ariane JSON-LD
        s = re.sub(r'("@type": "ListItem", "position": 3, "name": ")[^"]*(", "item": ")[^"]*(")',
                   lambda mm: mm.group(1) + t["crumb"] + mm.group(2) + page_url + mm.group(3), s)

        # --- corps ---
        s = re.sub(r'<span aria-current="page">[^<]*</span></nav>', f'<span aria-current="page">{t["crumb"]}</span></nav>', s)
        s = re.sub(r'<h1 class="gallery-title">[^<]*</h1>', f'<h1 class="gallery-title">{t["title"]}</h1>', s)
        s = re.sub(r'<div class="gallery-desc">[^<]*</div><p class="gallery-meta">[^<]*</p>',
                   f'<div class="gallery-desc">{t["sub"]}</div><p class="gallery-meta">{t["meta"]}</p>', s)
        # pas de volet de présentation ni de lien vers la presse (rien de connu)
        s = re.sub(r'<details class="intro-panel">.*?</details>\n', "", s, flags=re.S)
        s = re.sub(r'<div class="gallery-actions">.*?</div>\n', "", s, count=1, flags=re.S)
        # œuvres
        works = "".join(work_html(n, "ContreVerse2004", f, w, h, "Contre-verse autour des limites", lang, prefix) for n, f, w, h in CV_WORKS)
        s = re.sub(r'(<h2 class="gallery-section-title">)[^<]*(</h2><div class="gallery-works">).*?(</div></section>)',
                   lambda mm: mm.group(1) + t["works"] + mm.group(2) + works + mm.group(3), s, flags=re.S)
        # ItemList des œuvres
        m = re.search(r'<script type="application/ld\+json" data-artworks="1">(\{.*?\})</script>', s, re.S)
        il = {"@context": "https://schema.org", "@type": "ItemList", "name": t["title"], "numberOfItems": len(CV_WORKS),
              "itemListElement": [{"@type": "ListItem", "position": i + 1, "item": {
                  "@type": "VisualArtwork", "name": n, "image": f"{SITE}img/ContreVerse2004/{f}",
                  "creator": {"@id": SITE + "#person"}, "artform": "Peinture", "dateCreated": "2004", "inLanguage": lang,
                  "isPartOf": {"@type": "ExhibitionEvent", "name": "Contre-verse autour des limites (2004)"}, "url": page_url}}
                  for i, (n, f, *_) in enumerate(CV_WORKS)]}
        s = s[:m.start(1)] + json.dumps(il, ensure_ascii=False) + s[m.end(1):]
        assert "Angles de vie" not in s.replace("angles-de-vie", ""), (lang, [l for l in s.splitlines() if "Angles de vie" in l][:3])
        assert "Belleville" not in s, lang
        dst.write_text(s, encoding="utf-8")
        print(lang, "contre-verse : ok")


if __name__ == "__main__":
    update_angles_de_vie()
    build_contre_verse()


# --------------------------------------------- 3. Page Œuvres, sous-menu, sitemap
CARD = {
    "fr": dict(alt="Contre-verse autour des limites — aperçu de la galerie", place="", blurb="Una noche sin luna, El misere, Le petit Quijote.", cta="Voir la galerie →", adv_blurb="Les six toiles du château de Belleville."),
    "en": dict(alt="Contre-verse autour des limites — gallery preview", place="", blurb="Una noche sin luna, El misere, Le petit Quijote.", cta="View the gallery →", adv_blurb="The six canvases from the Château de Belleville."),
    "es": dict(alt="Contre-verse autour des limites — vista previa de la galería", place="", blurb="Una noche sin luna, El misere, Le petit Quijote.", cta="Ver la galería →", adv_blurb="Los seis lienzos del Château de Belleville."),
    "de": dict(alt="Contre-verse autour des limites — Vorschau der Galerie", place="", blurb="Una noche sin luna, El misere, Le petit Quijote.", cta="Zur Galerie →", adv_blurb="Die sechs Gemälde aus dem Château de Belleville."),
    "zh": dict(alt="Contre-verse autour des limites — 画廊预览", place="", blurb="Una noche sin luna、El misere、Le petit Quijote。", cta="进入画廊 →", adv_blurb="贝勒维尔城堡的六幅画作。"),
}
ADV_OLD_BLURB = {"fr": "Les quatre toiles du château de Belleville.", "en": "The four canvases from the Château de Belleville.",
                 "es": "Los cuatro lienzos del Château de Belleville.", "de": "Die vier Gemälde aus dem Château de Belleville.", "zh": "贝勒维尔城堡的四幅画作。"}


def update_galeries():
    for lang, d in LANGS.items():
        p = ROOT / d / "galeries.html"
        s = p.read_text(encoding="utf-8")
        if CV_FILE in s:
            print(lang, "galeries : déjà fait"); continue
        c = CARD[lang]; prefix = "" if lang == "fr" else "../"
        # carte après Angles de vie (ordre chronologique décroissant)
        i = s.index('href="angles-de-vie-2005.html"><figure>'); j = s.index("</li>", i) + len("</li>")
        card = (f'<li><a class="work-card" href="{CV_FILE}"><figure><img alt="{c["alt"]}" decoding="async" loading="lazy" '
                f'src="{prefix}img/mosaique/una-noche-sin-luna-ana-ruiz.webp"/><span class="badge">2004</span></figure>\n'
                f'<div class="work-card-body"><h3>Contre-verse autour des limites</h3>'  # pas de lieu : inconnu à ce jour
                f'<p class="blurb">{c["blurb"]}</p><span class="cta" aria-hidden="true">{c["cta"]}</span></div></a></li>')
        s = s[:j] + card + s[j:]
        # accroche Angles de vie : 4 -> 6 toiles
        assert ADV_OLD_BLURB[lang] in s, lang
        s = s.replace(ADV_OLD_BLURB[lang], c["adv_blurb"])
        # JSON-LD : insérer après la position 9 et décaler les suivantes
        page_url = SITE + ("" if lang == "fr" else d + "/") + CV_FILE
        m = re.search(r'\{"@type": "ListItem", "name": "2005 – Angles de vie[^}]*"position": 9\}', s)
        assert m, lang
        items_after = re.findall(r'"position": (\d+)', s[m.end():])
        tail = re.sub(r'"position": (\d+)', lambda mm: f'"position": {int(mm.group(1)) + 1}', s[m.end():])
        new_item = (', {"@type": "ListItem", "name": "2004 – Contre-verse autour des limites", "url": "' + page_url + '", "position": 10}')
        s = s[:m.end()] + new_item + tail
        p.write_text(s, encoding="utf-8")
        print(lang, "galeries : ok (positions décalées :", len(items_after), ")")


def update_menu_and_sitemap():
    p = ROOT / "js" / "galeries-menu.js"
    s = p.read_text(encoding="utf-8")
    if CV_FILE not in s:
        anchor = "    { href: 'angles-de-vie-2005.html',                             year: '2005', label: 'Angles de vie' }"
        assert anchor in s
        s = s.replace(anchor, anchor.rstrip() + ",\n    { href: '" + CV_FILE + "',           year: '2004', label: 'Contre-verse autour des limites' }")
        p.write_text(s, encoding="utf-8"); print("galeries-menu.js : ok")
    p = ROOT / "js" / "mosaic-bg.js"
    s = p.read_text(encoding="utf-8")
    if "air-eau-ciel" not in s:
        anchor = "    'img/mosaique/angles-de-vie-4-ana-ruiz.webp'\n"
        assert anchor in s
        s = s.replace(anchor, "    'img/mosaique/angles-de-vie-4-ana-ruiz.webp',\n    'img/mosaique/air-eau-ciel-ana-ruiz.webp',\n    'img/mosaique/el-cid-a-mogador-ana-ruiz.webp',\n    'img/mosaique/una-noche-sin-luna-ana-ruiz.webp',\n    'img/mosaique/el-misere-ana-ruiz.webp',\n    'img/mosaique/don-quijote-ana-ruiz.webp'\n")
        p.write_text(s, encoding="utf-8"); print("mosaic-bg.js : ok")
    p = ROOT / "sitemap.xml"
    s = p.read_text(encoding="utf-8")
    if CV_FILE not in s:
        imgs_adv = "".join(f"    <image:image><image:loc>{SITE}img/AnglesDeVie/{f}</image:loc></image:image>\n" for _, f, *_ in NEW_ADV)
        s = s.replace(f"    <image:image><image:loc>{SITE}img/AnglesDeVie/angles-de-vie-4-ana-ruiz.webp</image:loc></image:image>\n",
                      f"    <image:image><image:loc>{SITE}img/AnglesDeVie/angles-de-vie-4-ana-ruiz.webp</image:loc></image:image>\n" + imgs_adv)
        s = re.sub(r"(<loc>[^<]*angles-de-vie-2005\.html</loc>\n    <lastmod>)[^<]*", r"\g<1>2026-10-22", s)
        blocks = []
        for lang, d in LANGS.items():
            loc = SITE + ("" if lang == "fr" else d + "/") + CV_FILE
            alts = "".join(f'    <xhtml:link rel="alternate" hreflang="{l}" href="{SITE}{"" if l == "fr" else dd + "/"}{CV_FILE}" />\n' for l, dd in LANGS.items())
            alts += f'    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{CV_FILE}" />\n'
            imgs = "".join(f"    <image:image><image:loc>{SITE}img/ContreVerse2004/{f}</image:loc></image:image>\n" for _, f, *_ in CV_WORKS)
            blocks.append(f"  <url>\n    <loc>{loc}</loc>\n    <lastmod>2026-10-22</lastmod>\n{alts}{imgs}  </url>\n")
        s = s.replace("</urlset>", "".join(blocks) + "</urlset>")
        p.write_text(s, encoding="utf-8"); print("sitemap.xml : ok")


if __name__ == "__main__":
    update_galeries()
    update_menu_and_sitemap()


# ------------------------------------------------------------ 4. Publications
# Le texte du livre a été transcrit depuis la photo de la page 125 (pas de capture d'écran
# sur le site, à la demande de Sébastien). Références (ville-gif.fr, archives ; Gif Infos n° 365,
# février 2011) : François Beautier, Mairie de Gif-sur-Yvette, 2010, lancement le 15/12/2010.
LIVRE_TEXTE_FR = [
    "L’image de Gif est faite de couples d’éléments presque partout ailleurs divergents – espace naturel et résidentiel, ville de villages, creuset scientifique et artistique, microcosme ouvert au monde… – qui trouvent leur cohérence non pas dans une utopie mais dans un lieu réel, la Ville-Verte.",
    "Cette ville particulière s’est construite en coulant son histoire dans sa géographie, guidée par une commune soucieuse de préserver ses héritages et adepte du concept de « ville verte ». Elle le concrétise si bien que Gif est souvent cité en modèle pour l’union insécable de la nature et de la ville.",
    "Produit très élaboré d’une politique communale à long terme, la Ville-Verte est une entité vivante jamais achevée. Les Giffois la savent précieuse : ils peuvent y choisir l’espace-temps qui leur convient, du plus naturel, celui de la faune et de la flore, jusqu’au plus artificiel, celui de la mégapole parisienne.",
    "L’élément clé de la Ville-Verte est le trait d’union : il ne faut pas que la ville l’emporte sur la nature, que la nature empêche la ville de vivre, ou que la nature souffre – par manque de soins –, d’un affaiblissement de la ville, par exemple consécutif à un vieillissement de sa population.",
    "En votant son actuel plan d’urbanisme, le PLU, la commune a décidé de vivifier la Ville-Verte en y accueillant des jeunes. Elle s’est aussi engagée dans une politique de développement durable qui réduira l’impact de la cité sur la nature. L’image de la Ville-Verte a donc un avenir pourvu que l’urbain vive et soit maîtrisé.",
]
LIVRE_LEGENDE_FR = "Comme ce tableau à la fois cloisonné et harmonieux d’Ana Ruiz, « artiste giffoise de l’année 2004 », l’image de Gif entrelace des espaces-temps différents."

PUB = {
    "fr": dict(
        meta="Livre · Ville de Gif-sur-Yvette · page 125", title="Commune de Gif, un héritage à partager — « Une image »",
        desc="Un tableau d’Ana Ruiz, acquis par la ville de Gif-sur-Yvette, illustre le chapitre « Une image ». Légende de l’ouvrage : « " + LIVRE_LEGENDE_FR + " »",
        more="Lire le texte du livre", alt="Tableau d’Ana Ruiz reproduit dans le livre « Commune de Gif, un héritage à partager »",
        aria="Voir le tableau reproduit dans le livre", cta="Cliquer pour agrandir →",
        meta2="Ville de Gif-sur-Yvette · Saison culturelle 2004/2005", title2="Carnet de saison 2004/2005 — Couverture",
        desc2="La couverture du programme de la saison culturelle 2004/2005 de Gif-sur-Yvette reproduit un tableau d’Ana Ruiz, artiste de l’année.",
        alt2="Couverture du Carnet de saison 2004/2005 de Gif-sur-Yvette, illustrée par un tableau d’Ana Ruiz", aria2="Voir la couverture du Carnet de saison",
        paras=LIVRE_TEXTE_FR, note="Texte reproduit depuis l’ouvrage (page 125)."),
    "en": dict(
        meta="Book · Town of Gif-sur-Yvette · page 125", title="Commune de Gif, un héritage à partager — “An image”",
        desc="A painting by Ana Ruiz, acquired by the town of Gif-sur-Yvette, illustrates the chapter “An image”. Caption from the book: “Like this painting by Ana Ruiz, ‘Gif artist of the year 2004’, at once partitioned and harmonious, the image of Gif interweaves different space-times.”",
        more="Read the book’s text (in French)", alt="Painting by Ana Ruiz reproduced in the book “Commune de Gif, un héritage à partager”",
        aria="See the painting reproduced in the book", cta="Click to enlarge →",
        meta2="Town of Gif-sur-Yvette · 2004/2005 cultural season", title2="Carnet de saison 2004/2005 — Cover",
        desc2="The cover of Gif-sur-Yvette’s 2004/2005 cultural season programme reproduces a painting by Ana Ruiz, artist of the year.",
        alt2="Cover of Gif-sur-Yvette’s 2004/2005 Carnet de saison, illustrated with a painting by Ana Ruiz", aria2="See the Carnet de saison cover",
        paras=LIVRE_TEXTE_FR, note="Original French text, reproduced from the book (page 125)."),
    "es": dict(
        meta="Libro · Ayuntamiento de Gif-sur-Yvette · página 125", title="Commune de Gif, un héritage à partager — « Una imagen »",
        desc="Un cuadro de Ana Ruiz, adquirido por el municipio de Gif-sur-Yvette, ilustra el capítulo « Una imagen ». Pie de foto del libro: « Como este cuadro de Ana Ruiz, “artista giffoise del año 2004”, a la vez compartimentado y armonioso, la imagen de Gif entrelaza espacios-tiempos diferentes. »",
        more="Leer el texto del libro (en francés)", alt="Cuadro de Ana Ruiz reproducido en el libro « Commune de Gif, un héritage à partager »",
        aria="Ver el cuadro reproducido en el libro", cta="Clic para ampliar →",
        meta2="Ayuntamiento de Gif-sur-Yvette · Temporada cultural 2004/2005", title2="Carnet de saison 2004/2005 — Portada",
        desc2="La portada del programa de la temporada cultural 2004/2005 de Gif-sur-Yvette reproduce un cuadro de Ana Ruiz, artista del año.",
        alt2="Portada del Carnet de saison 2004/2005 de Gif-sur-Yvette, ilustrada con un cuadro de Ana Ruiz", aria2="Ver la portada del Carnet de saison",
        paras=LIVRE_TEXTE_FR, note="Texto original en francés, reproducido del libro (página 125)."),
    "de": dict(
        meta="Buch · Stadt Gif-sur-Yvette · Seite 125", title="Commune de Gif, un héritage à partager — „Ein Bild“",
        desc="Ein von der Stadt Gif-sur-Yvette erworbenes Gemälde von Ana Ruiz illustriert das Kapitel „Ein Bild“. Bildunterschrift des Buches: „Wie dieses zugleich gegliederte und harmonische Gemälde von Ana Ruiz, ‚Giffoiser Künstlerin des Jahres 2004‘, verflicht das Bild von Gif verschiedene Raum-Zeiten.“",
        more="Den Text des Buches lesen (auf Französisch)", alt="Gemälde von Ana Ruiz, abgebildet im Buch „Commune de Gif, un héritage à partager“",
        aria="Das im Buch abgebildete Gemälde ansehen", cta="Zum Vergrößern klicken →",
        meta2="Stadt Gif-sur-Yvette · Kultursaison 2004/2005", title2="Carnet de saison 2004/2005 — Titelseite",
        desc2="Die Titelseite des Programms der Kultursaison 2004/2005 von Gif-sur-Yvette zeigt ein Gemälde von Ana Ruiz, Künstlerin des Jahres.",
        alt2="Titelseite des Carnet de saison 2004/2005 von Gif-sur-Yvette mit einem Gemälde von Ana Ruiz", aria2="Die Titelseite des Carnet de saison ansehen",
        paras=LIVRE_TEXTE_FR, note="Französischer Originaltext, aus dem Buch übernommen (Seite 125)."),
    "zh": dict(
        meta="书籍 · Gif-sur-Yvette 市 · 第 125 页", title="Commune de Gif, un héritage à partager —《一幅图像》",
        desc="Gif-sur-Yvette 市收藏的一幅 Ana Ruiz 画作，为《一幅图像》一章配图。书中图注：“正如 Ana Ruiz（‘2004 年度吉夫艺术家’）这幅既分割又和谐的画作，吉夫的形象交织着不同的时空。”",
        more="阅读书中原文（法文）", alt="收录于《Commune de Gif, un héritage à partager》一书中的 Ana Ruiz 画作",
        aria="查看书中收录的画作", cta="点击放大 →",
        meta2="Gif-sur-Yvette 市 · 2004/2005 文化季", title2="Carnet de saison 2004/2005 — 封面",
        desc2="Gif-sur-Yvette 2004/2005 文化季节目册的封面采用了年度艺术家 Ana Ruiz 的一幅画作。",
        alt2="Gif-sur-Yvette 2004/2005 文化季节目册封面，配图为 Ana Ruiz 的画作", aria2="查看文化季节目册封面",
        paras=LIVRE_TEXTE_FR, note="法文原文，转录自该书第 125 页。"),
}


def pub_cards(lang, prefix):
    t = PUB[lang]
    img1 = f"{prefix}img/presse/tableau-ville-de-gif-ana-ruiz.webp"
    img2 = f"{prefix}img/presse/carnet-de-saison-2004-2005-gif.webp"
    paras = "\n".join(f"          <p>{p}</p>" for p in t["paras"])
    return f"""    <!-- Article 5 : livre « Commune de Gif, un héritage à partager » (ajouté le 22/10/2026 ; références du livre à compléter) -->
    <div class="article-card" onclick="openLightbox('{img1}')" role="button" tabindex="0" aria-label="{t['aria']}" onkeydown="if(event.key==='Enter')openLightbox('{img1}')">
      <div class="article-thumb-wrap">
        <img class="article-thumb"
             src="{img1}"
             alt="{t['alt']}"
             loading="lazy" decoding="async"/>
      </div>
      <div class="article-body">
        <span class="article-meta">{t['meta']}</span>
        <h3 class="article-title">{t['title']}</h3>
        <p class="article-desc">{t['desc']}</p>
        <details class="intro-panel article-text" onclick="event.stopPropagation()" onkeydown="event.stopPropagation()">
          <summary class="intro-panel-summary"><span>{t['more']}</span><span class="intro-panel-chevron" aria-hidden="true"></span></summary>
          <div class="intro-panel-body" lang="fr">
{paras}
          <p class="source">{t['note']}</p>
          </div>
        </details>
        <span class="article-cta">{t['cta']}</span>
      </div>
    </div>
    <!-- Article 6 : couverture du Carnet de saison 2004/2005 -->
    <div class="article-card" onclick="openLightbox('{img2}')" role="button" tabindex="0" aria-label="{t['aria2']}" onkeydown="if(event.key==='Enter')openLightbox('{img2}')">
      <div class="article-thumb-wrap">
        <img class="article-thumb"
             src="{img2}"
             alt="{t['alt2']}"
             loading="lazy" decoding="async"/>
      </div>
      <div class="article-body">
        <span class="article-meta">{t['meta2']}</span>
        <h3 class="article-title">{t['title2']}</h3>
        <p class="article-desc">{t['desc2']}</p>
        <span class="article-cta">{t['cta']}</span>
      </div>
    </div>
"""


def update_publications():
    for lang, d in LANGS.items():
        p = ROOT / d / "publications.html"
        s = p.read_text(encoding="utf-8")
        if "tableau-ville-de-gif" in s:
            print(lang, "publications : déjà fait"); continue
        prefix = "" if lang == "fr" else "../"
        anchor = "  </div><!-- /articles-list -->"
        assert s.count(anchor) == 1, lang
        s = s.replace(anchor, pub_cards(lang, prefix) + anchor)
        p.write_text(s, encoding="utf-8")
        print(lang, "publications : ok")


if __name__ == "__main__":
    update_publications()
