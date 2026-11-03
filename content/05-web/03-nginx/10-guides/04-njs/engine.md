---
title: "Moteur JavaScript"
description: "Nginx — Moteur JavaScript. Depuis la version 0.8.6, plusieurs moteurs JavaScript sont pris en charge. Pour en choisir un, utilisez la directive js_engine, disponible pour http et stream. Par défaut, le moteur njs est utilisé."
tags: [nginx, guide]
icon: book-open
---

Depuis la version 0.8.6, plusieurs moteurs JavaScript sont pris en charge. Pour en choisir un, utilisez la directive `js_engine`, disponible pour [[12-directives/js-engine-http-js|http]] et [[12-directives/js-engine-stream-js|stream]]. Par défaut, le moteur njs est utilisé.

## Moteur njs

> [!NOTE]
> Le moteur njs est obsolète depuis la version 1.0.0 ; le nouveau code doit utiliser le moteur QuickJS.

njs est un moteur JavaScript intégrable développé dans le cadre du module njs. Voir la section [[10-guides/04-njs/compatibility|Compatibilité]] pour les détails.

## Moteur QuickJS

[QuickJS](https://bellard.org/quickjs/) est un moteur JavaScript léger et intégrable qui prend en charge la spécification [ES2023](https://tc39.es/ecma262/2023/), dont les modules, les générateurs asynchrones, les proxys et BigInt.

Depuis la version 0.8.6, un remplacement direct des [[10-guides/04-njs/reference|objets njs/nginx]] assure la compatibilité avec le moteur njs, aux exceptions suivantes près :

- API propres à njs : [[10-guides/04-njs/reference|njs.dump()]], `console.dump()`.
- API obsolète : `require()` ; utilisez plutôt l'instruction `import`.
- directive `js_preload_object` pour [[12-directives/js-preload-object-http-js|http]] et [[12-directives/js-preload-object-stream-js|stream]].

État des modules intégrés de njs :

- [[10-guides/04-njs/reference|buffer]] : depuis 0.8.6.
- [[10-guides/04-njs/reference|crypto]] : depuis 0.8.10.
- [[10-guides/04-njs/reference|fs]] : depuis 0.8.9.
- [[10-guides/04-njs/reference|querystring]] : depuis 0.8.10.
- [[10-guides/04-njs/reference|WebCrypto]] : depuis 0.8.10.
- [[10-guides/04-njs/reference|xml]] : depuis 0.8.10.
- [[10-guides/04-njs/reference|zlib]] : depuis 0.8.5.

État des objets intégrés de njs :

- [[10-guides/04-njs/reference|process]] : depuis 0.8.8.
- [[10-guides/04-njs/reference|TextDecoder]] : depuis 0.8.10.
- [[10-guides/04-njs/reference|TextEncoder]] : depuis 0.8.10.

État des objets intégrés de nginx :

- [[10-guides/04-njs/reference|ngx.fetch]] : depuis 0.9.1.
- [[10-guides/04-njs/reference|dictionnaire partagé]] : depuis 0.8.8.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
