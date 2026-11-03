---
title: "js_shared_dict_zone (ngx_stream_js_module)"
description: "Directive nginx js_shared_dict_zone (ngx_stream_js_module) — Définit le nom (name) et la taille (size) de la zone de mémoire partagée qui conserve le dictionnaire clé-valeur partagé entre les processus de travail. Par défaut, le dictionnaire partagé utilise…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_shared_dict_zone zone=name:size [timeout=time] [type=string\|number] [evict] [state=file];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Apparue dans la version** | 0.8.0 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Définit le nom (*name*) et la taille (*size*) de la zone de mémoire partagée qui conserve le [[10-guides/04-njs/reference|dictionnaire]] clé-valeur partagé entre les processus de travail.

Par défaut, le dictionnaire partagé utilise des chaînes pour les clés et les valeurs. Le paramètre facultatif `type` permet de choisir le type nombre pour les valeurs.

Le paramètre facultatif `timeout` définit la durée, en millisecondes, au bout de laquelle toutes les entrées du dictionnaire sont supprimées de la zone. Si certaines entrées nécessitent une durée différente, elle se règle avec l'argument `timeout` des méthodes [[10-guides/04-njs/reference|add]], [[10-guides/04-njs/reference|incr]] et [[10-guides/04-njs/reference|set]] (0.8.5).

Le paramètre facultatif `evict` supprime la paire clé-valeur la plus ancienne lorsque la zone est pleine.

Le paramètre facultatif `state` indique un fichier (*file*) qui conserve l'état du dictionnaire partagé au format JSON et le rend persistant entre les redémarrages de nginx (0.9.1).

Exemple :

```nginx
example.conf:
    # Creates a 1Mb dictionary with string values,
    # removes key-value pairs after 60 seconds of inactivity:
    js_shared_dict_zone zone=foo:1M timeout=60s;

    # Creates a 512Kb dictionary with string values,
    # forcibly removes oldest key-value pairs when the zone is exhausted:
    js_shared_dict_zone zone=bar:512K timeout=30s evict;

    # Creates a 32Kb permanent dictionary with number values:
    js_shared_dict_zone zone=num:32k type=number;

    # Creates a 1Mb dictionary with string values and persistent state:
    js_shared_dict_zone zone=persistent:1M state=/tmp/dict.json;

example.js:
    function get(r) {
        r.return(200, ngx.shared.foo.get(r.args.key));
    }

    function set(r) {
        r.return(200, ngx.shared.foo.set(r.args.key, r.args.value));
    }

    function del(r) {
        r.return(200, ngx.shared.bar.delete(r.args.key));
    }

    function increment(r) {
        r.return(200, ngx.shared.num.incr(r.args.key, 2));
    }
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
