---
title: "Téléchargement et installation"
description: "Nginx — Téléchargement et installation. Sous Linux, on peut utiliser les paquets des modules njs :"
tags: [nginx, guide]
icon: book-open
---

## Installation par paquet Linux

Sous Linux, on peut utiliser les paquets des modules njs :

- `nginx-module-njs` : modules [[12-directives/load-module|dynamiques]] njs
- `nginx-module-njs-dbg` : symboles de débogage du paquet `nginx-module-njs`

Après l'installation du paquet, les modules dynamiques njs doivent être chargés avec la directive [[12-directives/load-module|load_module]] :

```nginx
load_module modules/ngx_http_js_module.so;
```

or

```nginx
load_module modules/ngx_stream_js_module.so;
```

## Compilation à partir des sources

Le [dépôt](https://github.com/nginx/njs) des sources de njs peut être cloné avec la commande suivante (nécessite un client [Git](https://git-scm.com/)) :

```nginx
git clone https://github.com/nginx/njs
```

Les modules doivent ensuite être compilés depuis le répertoire racine de [[10-guides/01-introduction/configure|nginx]] avec le paramètre de configuration `--add-module` :

```nginx
./configure --add-module=path-to-njs/nginx
```

Les modules peuvent aussi être compilés en modules [[12-directives/load-module|dynamiques]] :

```nginx
./configure --add-dynamic-module=path-to-njs/nginx
```

### Ajouter la prise en charge du moteur QuickJS

Vérifiez que la bibliothèque QuickJS est compilée :

```nginx
git clone https://github.com/bellard/quickjs
cd quickjs
CFLAGS='-fPIC' make libquickjs.a
```

Lors de la compilation du module, indiquez aussi les chemins des en-têtes (`-I`) et des bibliothèques (`-L`) avec les paramètres de configuration `--with-cc-opt=` et `--with-ld-opt=` :

```nginx
./configure --add-module=path-to-njs/nginx \
    --with-cc-opt="-I path-to-quickjs" \
    --with-ld-opt="-L path-to-quickjs"
```

## Compiler l'utilitaire njs en ligne de commande

Pour ne compiler que l'[[10-guides/04-njs/cli|utilitaire]] njs en ligne de commande, exécutez `./configure` puis `make njs` depuis le répertoire racine de njs. Après compilation, l'utilitaire est disponible sous `./build/njs`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
