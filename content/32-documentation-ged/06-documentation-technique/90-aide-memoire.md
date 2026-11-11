---
title: MkDocs, Sphinx et Read the Docs — aide-mémoire
description: Commandes de MkDocs et Material (new, serve, build --strict, gh-deploy, mike, image Docker), de Sphinx (quickstart, sphinx-build -W, autobuild, latexpdf) et fichier .readthedocs.yaml minimal.
tags: [aide-mémoire, mkdocs, material for mkdocs, sphinx, read the docs]
icon: terminal
---

Explications : [[01-mkdocs-material|MkDocs et Material]] · [[02-sphinx-readthedocs-documize|Sphinx, Read the Docs et Documize]].

```bash
# MkDocs + Material
python3 -m pip install mkdocs-material
mkdocs new projet ; mkdocs serve -a 127.0.0.1:8000 ; mkdocs build --strict
mkdocs gh-deploy --force
docker run --rm -v "$PWD":/docs squidfunk/mkdocs-material build
python3 -m pip install mike && mike deploy --push --update-aliases 2.0 latest && mike set-default --push latest
rsync -a --delete site/ web:/var/www/doc/

# Sphinx
python3 -m pip install sphinx furo myst-parser sphinx-autobuild
sphinx-quickstart doc --sep -l fr
sphinx-build -M html doc/source doc/build -W --keep-going
sphinx-autobuild doc/source doc/build/html
sphinx-build -M latexpdf doc/source doc/build
sphinx-build -b linkcheck doc/source doc/build/linkcheck      # vérifie les liens externes
```

```yaml .readthedocs.yaml
version: 2
build: { os: ubuntu-24.04, tools: { python: "3.12" } }
mkdocs: { configuration: mkdocs.yml }        # ou sphinx: { configuration: doc/source/conf.py }
python: { install: [ { requirements: requirements.txt } ] }
```
