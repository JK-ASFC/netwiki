---
title: "js_load_stream_native_module"
description: "Directive nginx js_load_stream_native_module (ngx_stream_js_module) — Charge un module natif (bibliothèque partagée) utilisable dans le code JavaScript Stream. La directive est propre à QuickJS et n'est pas disponible avec le moteur JavaScript intégré de njs. Le…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_load_stream_native_module path [as name];` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Apparue dans la version** | 0.9.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Charge un [[10-guides/04-njs/native-modules|module natif]] (bibliothèque partagée) utilisable dans le code JavaScript Stream. La directive est propre à [[10-guides/04-njs/engine|QuickJS]] et n'est pas disponible avec le moteur JavaScript intégré de njs.

Le paramètre *path* indique le chemin absolu du fichier de bibliothèque partagée. Le paramètre facultatif `as` *name* donne un alias pour importer le module dans le code JavaScript ; sinon, le module s'importe par son nom de fichier.

Exemple :

```nginx
js_load_stream_native_module /path/to/mylib.so;
js_load_stream_native_module /path/to/other.so as myalias;

stream {
    js_import main.js;
    # ... rest of stream configuration
}
```

Dans le code JavaScript :

```nginx
// Import by filename
import * as mylib from 'mylib.so';

// Import by alias
import * as myalias from 'myalias';

// Use exported functions
let result = mylib.add(5, 10);
```

> [!NOTE]
> Pour des raisons de sécurité, cette directive n'est autorisée que dans le contexte de configuration `main`. Les modules natifs s'exécutent avec tous les privilèges du processus : utilisez des chemins absolus et faites relire le code.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
