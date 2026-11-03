---
title: "js_load_stream_native_module"
description: "Directive nginx js_load_stream_native_module (ngx_stream_js_module) — Loads a native module (shared library) for use in Stream JavaScript code. The directive is QuickJS-only and is not available when using the njs built-in JavaScript engine. Le paramètre path indique…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_load_stream_native_module path [as name];` |
| **Valeur par défaut** | — |
| **Contexte** | `main` |
| **Apparue dans la version** | 0.9.5 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Loads a [[10-guides/04-njs/native-modules|native module]] (shared library) for use in Stream JavaScript code. The directive is [[10-guides/04-njs/engine|QuickJS]]-only and is not available when using the njs built-in JavaScript engine.

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
