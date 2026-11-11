---
title: Astro et Quartz
description: Astro (MIT : framework web orienté contenu, architecture en îlots, composants .astro et intégration React, Vue, Svelte, collections de contenu Markdown et MDX typées, Starlight pour la documentation, sortie statique ou rendu serveur, npm create astro, dev port 4321, build dans dist/) et Quartz (MIT : publication d'un coffre Obsidian ou de notes Markdown en jardin numérique, liens wiki, rétroliens, graphe, recherche, npx quartz create, build --serve port 8080, sync) ; choix d'un générateur selon le besoin.
tags: [astro, starlight, quartz, site statique, obsidian, jardin numérique, javascript]
icon: globe
---

## Astro

**Astro** est un framework web conçu pour les sites de **contenu** (vitrines, blogs, documentations, portails). Par défaut, il envoie du **HTML sans JavaScript** ; seuls les composants interactifs (« **îlots** ») sont chargés côté navigateur. On peut y mélanger des composants React, Vue, Svelte ou Solid.

```bash
npm create astro@latest site-dsi -- --template minimal
cd site-dsi
npm run dev -- --host 127.0.0.1          # http://127.0.0.1:4321
npm run build                             # site statique dans dist/
npm run preview
npx astro add tailwind sitemap            # intégrations
```

```html src/pages/index.astro
---
import { getCollection } from "astro:content";
const actualites = (await getCollection("actualites")).sort((a, b) => +b.data.date - +a.data.date);
---
<html lang="fr">
  <body>
    <h1>Direction des systèmes d'information</h1>
    <ul>
      {actualites.map((a) => <li><a href={`/actualites/${a.id}/`}>{a.data.titre}</a></li>)}
    </ul>
  </body>
</html>
```

- **Collections de contenu** : fichiers Markdown/MDX validés par un schéma (titre, date, auteur obligatoires).
- **Starlight** : thème de documentation officiel (recherche, navigation, traductions, mode sombre) : `npm create astro@latest -- --template starlight`.
- Sortie **statique** par défaut ; rendu serveur possible avec un adaptateur (Node.js…) si des pages dynamiques sont nécessaires.

## Quartz

**Quartz** publie un dossier de notes **Markdown** — typiquement un coffre **Obsidian** — sous forme de site web : **liens wiki** `[[note]]`, **rétroliens**, **graphe** des notes, recherche, aperçus au survol, gestion des étiquettes. C'est l'outil idéal pour un « jardin numérique » ou une base de connaissances publique.

```bash
git clone https://github.com/jackyzha0/quartz.git && cd quartz
npm i
npx quartz create                         # copie un dossier de notes existant ou part de zéro (dossier content/)
npx quartz build --serve                  # http://localhost:8080
npx quartz build                          # site dans public/
npx quartz sync                           # commit et push du contenu vers le dépôt
```

```ts quartz.config.ts
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Notes de l'équipe réseau",
    locale: "fr-FR",
    baseUrl: "notes.exemple.fr",
    ignorePatterns: ["private", "templates", ".obsidian"],   // ne jamais publier ces dossiers
  },
  plugins: { /* transformateurs, filtres (ex. RemoveDrafts), émetteurs */ },
}
```

> [!WARNING]
> Un coffre de notes personnelles contient souvent des informations à ne pas publier (adresses internes, noms, identifiants). Utiliser `ignorePatterns`, le filtre des brouillons (`draft: true`) ou un coffre dédié à la publication, et relire avant chaque mise en ligne.

## Choisir un générateur

| Besoin | Outil |
| --- | --- |
| Blog ou site vitrine très rapide, sans dépendance | [[01-hugo-jekyll-zola\|Hugo]] ou Zola |
| Site sur GitHub Pages sans CI | Jekyll |
| Site de contenu avec quelques composants interactifs | Astro |
| Documentation avec Astro | Starlight |
| Publier des notes Obsidian reliées | Quartz |
| Documentation technique classique | [[06-documentation-technique/01-mkdocs-material\|MkDocs + Material]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
