---
title: Docusaurus et VitePress
description: Générateurs de documentation JavaScript — Docusaurus (Meta, MIT : React et MDX, docusaurus.config.js, barres latérales, versions de la documentation, internationalisation, blog, recherche locale ou Algolia DocSearch, admonitions, npm run start et build, port 3000) et VitePress (MIT : Vue et Vite, Markdown enrichi, .vitepress/config.mts, thème par défaut, recherche locale intégrée, npm run docs:dev, docs:build, docs:preview, port 5173) ; déploiement statique sur Nginx ou par CI, et comparaison avec MkDocs.
tags: [docusaurus, vitepress, documentation, react, vue, mdx, site statique, node.js]
icon: file-code-2
---

Ces deux outils produisent, à partir de Markdown, un **site statique** rapide. Ils conviennent aux équipes à l'aise avec l'écosystème **Node.js** et aux documentations de produits logiciels.

## Docusaurus

**Docusaurus** (Meta, MIT) repose sur **React** ; les pages sont en **MDX** (Markdown pouvant contenir des composants React). Ses points forts : **versions** de la documentation, **internationalisation** et **blog** intégrés.

```bash
npx create-docusaurus@latest doc-produit classic --typescript
cd doc-produit
npm run start -- --host 127.0.0.1         # aperçu : http://127.0.0.1:3000
npm run build                               # site statique dans build/
npm run serve                               # tester le résultat construit
npm run docusaurus docs:version 2.0         # figer la version actuelle (versioned_docs/)
```

```ts docusaurus.config.ts
import type { Config } from "@docusaurus/types";

const config: Config = {
  title: "Plate-forme interne",
  url: "https://doc.exemple.fr",
  baseUrl: "/",
  onBrokenLinks: "throw",                       // la construction échoue sur un lien cassé
  i18n: { defaultLocale: "fr", locales: ["fr", "en"] },
  presets: [["classic", {
    docs: { sidebarPath: "./sidebars.ts", editUrl: "https://gitlab.exemple.fr/doc/-/edit/main/" },
    blog: { showReadingTime: true },
  }]],
};
export default config;
```

```markdown
:::warning Interruption
La migration coupe l'API pendant cinq minutes.
:::
```

- Barre latérale générée automatiquement depuis l'arborescence de `docs/` ou décrite dans `sidebars.ts`.
- **Recherche** : Algolia DocSearch (service gratuit pour les projets publics) ou greffon de recherche locale communautaire pour un intranet.

## VitePress

**VitePress** (MIT, équipe Vue) repose sur **Vue** et **Vite** : démarrage instantané, sites très légers. Il sert notamment à la documentation de Vue, Vite et de nombreux projets.

```bash
mkdir doc && cd doc
npm add -D vitepress
npx vitepress init                          # assistant : dossier, titre, thème
npm run docs:dev -- --host 127.0.0.1        # http://127.0.0.1:5173
npm run docs:build                          # .vitepress/dist/
npm run docs:preview
```

```ts .vitepress/config.mts
import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "fr-FR",
  title: "Documentation réseau",
  cleanUrls: true,
  themeConfig: {
    nav: [{ text: "Procédures", link: "/procedures/" }],
    sidebar: { "/procedures/": [{ text: "Exploitation", items: [{ text: "Sauvegardes", link: "/procedures/sauvegardes" }] }] },
    search: { provider: "local" },          // recherche intégrée, sans service externe
    outline: { label: "Sur cette page" },
    docFooter: { prev: "Page précédente", next: "Page suivante" },
  },
});
```

Markdown enrichi : blocs `::: tip`, `::: warning`, `::: details`, groupes d'onglets de code, mise en évidence de lignes, inclusion de fichiers, composants Vue dans les pages.

## Publier

```nginx
server {
    listen 443 ssl;
    server_name doc.exemple.fr;
    root /var/www/doc;
    location / { try_files $uri $uri.html $uri/ =404; }    # nécessaire avec cleanUrls (VitePress)
    location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

Construire en **CI** (image `node:22`) puis copier `build/` ou `.vitepress/dist/` sur le serveur, GitLab Pages ou GitHub Pages.

## Choisir

| Critère | Docusaurus | VitePress | [[06-documentation-technique/01-mkdocs-material\|MkDocs + Material]] |
| --- | --- | --- | --- |
| Écosystème | Node.js, React | Node.js, Vue | Python |
| Versions de la doc | Intégrées | À organiser (dossiers, branches) | Outil mike |
| Blog, traductions | Intégrés | Traductions intégrées | Greffons |
| Recherche hors ligne | Greffon communautaire | Intégrée | Intégrée |
| Prise en main | Moyenne | Facile | Très facile |

Voir aussi : [[02-antora-bookdown|Antora et Bookdown]]. Commandes : [[90-aide-memoire|aide-mémoire]].
