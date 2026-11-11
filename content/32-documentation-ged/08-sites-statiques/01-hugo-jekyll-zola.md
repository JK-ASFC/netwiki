---
title: Hugo, Jekyll et Zola
description: Générateurs de sites statiques — principe (contenus Markdown + gabarits → HTML, aucun serveur applicatif), Hugo (Go, Apache 2.0 : binaire unique extended, hugo new site, thèmes en modules, front matter, taxonomies, shortcodes, traitement d'images, hugo server port 1313, hugo --minify), Jekyll (Ruby, MIT : Bundler, _config.yml, Liquid, collections, GitHub Pages, port 4000) et Zola (Rust, MIT : binaire unique, Tera, sections, recherche intégrée, port 1111) ; publication et sécurité d'un site statique.
tags: [hugo, jekyll, zola, site statique, blog, markdown, go, ruby, rust]
icon: globe
---

Un **site statique** est un ensemble de fichiers HTML, CSS et JavaScript générés à l'avance. Sans base de données ni code serveur, il est **rapide**, **peu coûteux** et presque **sans surface d'attaque** : idéal pour un site vitrine, un blog d'équipe, une page d'état ou une documentation.

## Hugo

**Hugo** (Go) est le plus rapide : des milliers de pages construites en quelques secondes, dans un **binaire unique** sans dépendance. Choisir la variante **extended** (Sass, WebP).

```bash
sudo snap install hugo            # ou : brew install hugo ; winget install Hugo.Hugo.Extended ; paquet .deb des versions GitHub
hugo new site blog-infra && cd blog-infra
git init && hugo mod init gitlab.exemple.fr/infra/blog-infra
# Ajouter un thème (module Go ou sous-module Git), puis :
hugo new content articles/migration-ipv6.md
hugo server --bind 127.0.0.1 --buildDrafts        # http://127.0.0.1:1313, rechargement automatique
hugo --minify                                      # site dans public/
```

```yaml hugo.yaml
baseURL: https://blog.exemple.fr/
languageCode: fr-FR
defaultContentLanguage: fr
title: Blog de l'équipe infrastructure
module:
  imports: [ { path: github.com/adityatelange/hugo-PaperMod } ]
taxonomies: { tag: tags, category: categories }
markup:
  highlight: { style: monokai, lineNos: false }
```

```markdown content/articles/migration-ipv6.md
---
title: "Migration IPv6 du site de Lyon"
date: 2026-11-10
tags: [ipv6, réseau]
draft: false
---
Le plan d'adressage retenu est le suivant…
```

Les **shortcodes** (`{{< figure src="schema.png" >}}`) insèrent des éléments riches ; Hugo redimensionne et convertit les images à la construction.

## Jekyll

**Jekyll** (Ruby) est le générateur historique, intégré nativement à **GitHub Pages**. Gabarits **Liquid**, articles datés dans `_posts/`, collections.

```bash
sudo apt install ruby-full build-essential zlib1g-dev
gem install --user-install bundler jekyll
jekyll new site-equipe && cd site-equipe
bundle exec jekyll serve --host 127.0.0.1 --livereload    # http://127.0.0.1:4000
JEKYLL_ENV=production bundle exec jekyll build              # site dans _site/
```

```yaml _config.yml
title: Équipe support
lang: fr
url: https://support.exemple.fr
theme: minima
plugins: [ jekyll-feed, jekyll-seo-tag, jekyll-sitemap ]
```

Jekyll est stable mais évolue lentement et la construction ralentit sur les gros sites.

## Zola

**Zola** (Rust) combine la simplicité de Hugo et un moteur de gabarits **Tera** (proche de Jinja2), avec Sass, coloration de code et **index de recherche** intégrés, dans un binaire unique.

```bash
brew install zola                 # ou snap, paquets de distribution, binaires GitHub, winget
zola init page-etat && cd page-etat
zola serve --interface 127.0.0.1  # http://127.0.0.1:1111
zola build                        # site dans public/
zola check                        # vérifie les liens internes et externes
```

```toml config.toml
base_url = "https://etat.exemple.fr"
default_language = "fr"
compile_sass = true
build_search_index = true

[markdown]
highlight_code = true
```

## Publier un site statique

- **CI** : construire à chaque fusion dans la branche principale, puis publier `public/` (ou `_site/`) sur Nginx, GitLab Pages, GitHub Pages ou un stockage objet avec CDN.
- **En-têtes de sécurité** côté serveur web : HTTPS, HSTS, `Content-Security-Policy`, `X-Content-Type-Options`.
- **Formulaires et commentaires** : services tiers ou petites API séparées (le site reste statique).
- Vérifier qu'aucun **brouillon** ou fichier interne n'est publié (`draft: true`, dossiers exclus).

Voir aussi : [[02-astro-quartz|Astro et Quartz]] · [[07-generateurs-documentation/01-docusaurus-vitepress|Docusaurus et VitePress]]. Commandes : [[90-aide-memoire|aide-mémoire]].
