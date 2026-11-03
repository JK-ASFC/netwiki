---
title: "Écrire du code njs avec les fichiers de définitions TypeScript"
description: "Nginx — Écrire du code njs avec les fichiers de définitions TypeScript. TypeScript est un sur-ensemble typé de JavaScript qui se compile en JavaScript ordinaire."
tags: [nginx, guide]
icon: book-open
---

[TypeScript](https://www.typescriptlang.org) est un sur-ensemble typé de JavaScript qui se compile en JavaScript ordinaire.

TypeScript prend en charge des fichiers de définitions contenant les informations de type de bibliothèques JavaScript existantes. D'autres programmes peuvent ainsi utiliser les valeurs qui y sont définies comme des entités TypeScript typées statiquement.

njs fournit des fichiers de définitions TypeScript pour son [[10-guides/04-njs/reference|API]], qui permettent de :

- Bénéficier de l'autocomplétion et de la vérification de l'API dans un éditeur
- Écrire du code njs sûr du point de vue des types

## Compiler les fichiers de définitions TypeScript

```nginx
$ git clone https://github.com/nginx/njs
$ cd njs && ./configure && make ts
$ ls build/ts/
njs_core.d.ts
njs_shell.d.ts
ngx_http_js_module.d.ts
ngx_stream_js_module.d.ts
```

## Vérifications de l'API et autocomplétion

Placez les fichiers `*.d.ts` à un endroit où votre éditeur peut les trouver.

`test.js`:

```nginx
/// <reference path="ngx_http_js_module.d.ts" />
/**
 * @param {NginxHTTPRequest} r
 * */
function content_handler(r) {
    r.headersOut['content-type'] = 'text/plain';
    r.return(200, "Hello");
}
```

## Écrire du code njs sûr du point de vue des types

`test.ts`:

```nginx
/// <reference path="ngx_http_js_module.d.ts" />
function content_handler(r: NginxHTTPRequest) {
    r.headersOut['content-type'] = 'text/plain';
    r.return(200, "Hello from TypeScript");
}
```

Installation de TypeScript :

```nginx
# npm install -g typescript
```

Compilation TypeScript :

```nginx
$ tsc test.ts
$ cat test.js
```

Le fichier `test.js` obtenu peut être utilisé directement avec njs.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
