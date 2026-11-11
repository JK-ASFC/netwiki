---
title: Sphinx, Read the Docs et Documize
description: Sphinx (BSD : reStructuredText et Markdown via MyST, sphinx-quickstart, conf.py, toctree, références croisées, autodoc pour la documentation d'API Python, intersphinx, thèmes Furo et sphinx-rtd-theme, sorties HTML, PDF LaTeX et EPUB, sphinx-build -W, sphinx-autobuild), Read the Docs (hébergement de documentation : .readthedocs.yaml, versions par branche et étiquette, aperçus de merge requests, recherche ; service en ligne et auto-hébergement de la pile communautaire) et Documize Community (wiki documentaire en Go : Docker, PostgreSQL ou MySQL, espaces, modèles, état du projet) ; comparaison avec MkDocs.
tags: [sphinx, myst, read the docs, documize, documentation, restructuredtext, autodoc, docs as code]
icon: book-text
---

## Sphinx

**Sphinx** est le générateur de documentation de l'écosystème **Python** (documentation officielle de Python, de Django, du noyau Linux). Il excelle pour les **gros manuels** : références croisées entre pages, index, documentation d'API extraite du code, sorties **HTML, PDF (LaTeX) et EPUB**.

```bash
python3 -m pip install sphinx furo myst-parser sphinx-autobuild
sphinx-quickstart doc --sep -p "Manuel d'exploitation" -a "Équipe infra" -l fr
sphinx-build -M html doc/source doc/build -W --keep-going       # -W : avertissements = erreurs
sphinx-autobuild doc/source doc/build/html --host 127.0.0.1     # aperçu en direct
sphinx-build -M latexpdf doc/source doc/build                    # PDF (TeX Live requis)
```

```python doc/source/conf.py
project = "Manuel d'exploitation"
language = "fr"
extensions = [
    "myst_parser",               # pages en Markdown en plus du reStructuredText
    "sphinx.ext.autodoc",        # documentation tirée des docstrings Python
    "sphinx.ext.intersphinx",    # liens vers d'autres documentations Sphinx
    "sphinx.ext.todo",
]
html_theme = "furo"              # ou sphinx_rtd_theme
intersphinx_mapping = {"python": ("https://docs.python.org/3", None)}
```

```text
Procédure de bascule
====================

.. toctree::
   :maxdepth: 2

   prerequis
   bascule

.. warning:: Vérifier la réplication avant toute bascule.

Voir :ref:`sauvegarde-base` et :doc:`prerequis`.
```

## Read the Docs

**Read the Docs** construit et héberge la documentation à chaque `git push` : une **version par branche ou étiquette**, des **aperçus** de chaque merge request et une recherche plein texte. Il prend en charge Sphinx et MkDocs, et tout autre outil via des commandes personnalisées.

```yaml .readthedocs.yaml
version: 2
build:
  os: ubuntu-24.04
  tools: { python: "3.12" }
sphinx:
  configuration: doc/source/conf.py
  fail_on_warning: true
python:
  install: [ { requirements: doc/requirements.txt } ]
formats: [ pdf, epub ]
```

- Le service **readthedocs.org** est gratuit pour les projets publics ; **Read the Docs for Business** héberge des projets privés.
- Le code est libre (MIT) et peut être **auto-hébergé**, mais la pile (Django, Celery, Elasticsearch, constructeurs Docker, stockage) est lourde et l'auto-hébergement n'est pas officiellement pris en charge. En interne, une CI qui construit le site et le dépose sur un serveur web (comme pour [[01-mkdocs-material|MkDocs]]) est souvent plus simple.

## Documize Community

**Documize** est un **wiki documentaire** en Go (un seul binaire) : espaces, documents composés de sections, modèles, flux d'approbation, intégration de contenus externes.

```bash
docker run -d --name documize -p 127.0.0.1:5001:5001 \
  -e DOCUMIZEDB='host=db port=5432 dbname=documize user=documize password=… sslmode=disable' \
  -e DOCUMIZEDBTYPE=postgresql -e DOCUMIZESALT='<chaîne aléatoire>' -e DOCUMIZEPORT=5001 \
  documize/community:latest
```

> [!NOTE]
> Le développement de Documize s'est fortement ralenti, puis le projet a été abandonné par son éditeur. Pour un nouveau wiki d'équipe, préférer BookStack, Wiki.js, Outline ou XWiki (voir le chapitre wikis).

## Choisir

| Besoin | Outil |
| --- | --- |
| Documentation d'équipe simple et belle en Markdown | MkDocs + Material |
| Gros manuel, PDF, documentation d'API Python | Sphinx |
| Hébergement avec versions et aperçus de merge requests | Read the Docs (service) ou CI maison |
| Édition dans le navigateur par des non-développeurs | Un wiki (BookStack, Wiki.js) |

Commandes : [[90-aide-memoire|aide-mémoire]].
