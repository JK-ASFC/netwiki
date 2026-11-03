---
title: "ssl_object_cache_inheritable"
description: "Directive nginx ssl_object_cache_inheritable (Core functionality) — If enabled, SSL objects (SSL certificates, secret keys, trusted CA certificates, CRL lists) will be inherited across configuration reloads. SSL objects loaded from a file are inherited if the…"
tags: [nginx, directive, Core functionality]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_object_cache_inheritable on \| off;` |
| **Valeur par défaut** | `ssl_object_cache_inheritable on;` |
| **Contexte** | `main` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/01-coeur/Core functionality\|Core functionality]] |

## Utilisation

If enabled, SSL objects (SSL certificates, secret keys, trusted CA certificates, CRL lists) will be inherited across configuration reloads.

SSL objects loaded from a file are inherited if the modification time and file index has not been changed since the previous configuration load. Secret keys specified as `engine:name:id` are never inherited. Secret keys specified as `data:value` are always inherited.

> [!NOTE]
> SSL objects loaded from variables cannot be inherited.

Example:

```nginx
ssl_object_cache_inheritable on;

http {
    ...
    server {
        ...
        ssl_certificate     example.com.crt;
        ssl_certificate_key example.com.key;
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
