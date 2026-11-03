---
title: "js_shared_dict_zone (ngx_stream_js_module)"
description: "Directive nginx js_shared_dict_zone (ngx_stream_js_module) — Sets the name and size of the shared memory zone that keeps the key-value dictionary shared between worker processes. By default the shared dictionary uses a string as a key and a value. The optional…"
tags: [nginx, directive, ngx_stream_js_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `js_shared_dict_zone zone=name:size [timeout=time] [type=string\|number] [evict] [state=file];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Apparue dans la version** | 0.8.0 |
| **Module** | [[11-modules/03-stream/ngx_stream_js_module\|ngx_stream_js_module]] |

## Utilisation

Sets the *name* and *size* of the shared memory zone that keeps the key-value [[10-guides/04-njs/reference|dictionary]] shared between worker processes.

By default the shared dictionary uses a string as a key and a value. The optional `type` parameter allows redefining the value type to number.

The optional `timeout` parameter sets the time in milliseconds after which all shared dictionary entries are removed from the zone. If some entries require a different removal time, it can be set with the `timeout` argument of the [[10-guides/04-njs/reference|add]], [[10-guides/04-njs/reference|incr]], and [[10-guides/04-njs/reference|set]] methods (0.8.5).

The optional `evict` parameter removes the oldest key-value pair when the zone storage is exhausted.

The optional `state` parameter specifies a *file* that keeps the shared dictionary state in JSON format and makes it persistent across nginx restarts (0.9.1).

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
