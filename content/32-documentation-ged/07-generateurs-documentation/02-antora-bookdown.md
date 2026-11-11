---
title: Antora et Bookdown
description: Antora (MPL : documentation AsciiDoc agrégée depuis plusieurs dépôts Git, playbook antora-playbook.yml, composants et versions avec antora.yml, modules ROOT, pages, partials, examples, interface UI bundle, xrefs, recherche Lunr, npx antora) et Bookdown (R, GPL : livres et rapports en R Markdown, chapitres, références croisées, bibliographie, sorties gitbook, bs4_book, PDF et EPUB, bookdown::render_book, successeur Quarto) ; AsciiDoc en bref et cas d'usage.
tags: [antora, asciidoc, bookdown, r markdown, quarto, documentation, livres, multi-dépôts]
icon: file-code-2
---

## Antora

**Antora** génère un site de documentation à partir de fichiers **AsciiDoc** répartis dans **plusieurs dépôts Git** et plusieurs branches. Chaque équipe garde sa documentation à côté de son code ; un **playbook** central assemble le tout, avec une **version** par branche ou étiquette.

### Structure d'un composant

```text
depot-produit/
└── docs/
    ├── antora.yml
    └── modules/
        └── ROOT/
            ├── nav.adoc
            ├── pages/
            │   ├── index.adoc
            │   └── installation.adoc
            ├── partials/       fragments réutilisables
            ├── examples/       fichiers de code inclus
            └── images/
```

```yaml docs/antora.yml
name: passerelle
title: Passerelle API
version: '2.4'
nav: [ modules/ROOT/nav.adoc ]
```

```yaml antora-playbook.yml
site:
  title: Documentation technique
  url: https://doc.exemple.fr
  start_page: passerelle::index.adoc
content:
  sources:
    - url: https://gitlab.exemple.fr/produits/passerelle.git
      branches: [ v2.4, v2.3 ]
      start_path: docs
    - url: https://gitlab.exemple.fr/infra/socle.git
      branches: main
      start_path: docs
ui:
  bundle:
    url: https://gitlab.com/antora/antora-ui-default/-/jobs/artifacts/HEAD/raw/build/ui-bundle.zip?job=bundle-stable
    snapshot: true
antora:
  extensions: [ '@antora/lunr-extension' ]       # recherche hors ligne
```

```bash
npm i -D -E antora @antora/lunr-extension
npx antora antora-playbook.yml                      # site dans build/site
npx antora --fetch antora-playbook.yml              # met à jour les dépôts clonés
npx http-server build/site -c-1                     # aperçu local
```

### AsciiDoc en bref

```text
= Installation de la passerelle
:description: Procédure d'installation.

== Prérequis

* Java 21
* Accès au dépôt interne

WARNING: Ouvrir le port 8443 sur le pare-feu.

[source,bash]
----
sudo systemctl enable --now passerelle
----

Voir xref:configuration.adoc[la configuration] et xref:socle::reseau.adoc[le réseau du socle].
```

AsciiDoc offre nativement ce qui manque à Markdown pour les gros manuels : inclusions, attributs (variables), tableaux complexes, admonitions, conditions. Le dépôt de documentation peut aussi produire du **PDF** avec Asciidoctor PDF.

## Bookdown

**Bookdown** (paquet R, GPL) écrit des **livres et rapports** en **R Markdown** : chapitres, numérotation, références croisées aux figures et tableaux, bibliographie, et code R exécuté à la construction (graphiques et tableaux toujours à jour). Sorties : site **gitbook** ou **bs4_book**, **PDF** (LaTeX), **EPUB**, Word.

```r
install.packages("bookdown")
bookdown::create_bs4_book("rapport-capacite")          # squelette de projet
bookdown::render_book("index.Rmd", "bookdown::bs4_book")
bookdown::render_book("index.Rmd", "bookdown::pdf_book")
bookdown::serve_book()                                  # aperçu en direct
```

```yaml _bookdown.yml
book_filename: "rapport-capacite"
language:
  label: { fig: "Figure ", tab: "Tableau " }
  ui: { chapter_name: "Chapitre " }
rmd_files: [ index.Rmd, 01-reseau.Rmd, 02-stockage.Rmd, 99-annexes.Rmd ]
```

> [!NOTE]
> Pour un nouveau projet, **Quarto** (successeur multi-langages de R Markdown, par la même société Posit) offre les mêmes capacités de livre (`quarto create project book`) pour R, Python et Julia.

## Cas d'usage

| Besoin | Outil |
| --- | --- |
| Documentation de nombreux produits et versions, une équipe par dépôt | Antora |
| Manuels longs avec inclusions et variables, sortie PDF | Antora ou Asciidoctor |
| Rapport d'analyse reproductible (capacité, incidents, statistiques) | Bookdown ou Quarto |
| Documentation d'équipe simple | [[06-documentation-technique/01-mkdocs-material\|MkDocs + Material]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
