---
title: "upstream (ngx_stream_upstream_module)"
description: "Directive nginx upstream (ngx_stream_upstream_module) — Définit un groupe de serveurs. Les serveurs peuvent écouter sur des ports différents, et des serveurs écoutant sur des sockets TCP et de domaine UNIX peuvent être mélangés. Exemple : nginx upstream…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `upstream name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Définit un groupe de serveurs. Les serveurs peuvent écouter sur des ports différents, et des serveurs écoutant sur des sockets TCP et de domaine UNIX peuvent être mélangés.

Exemple :

```nginx
upstream backend {
    server backend1.example.com:12345 weight=5;
    server 127.0.0.1:12345            max_fails=3 fail_timeout=30s;
    server unix:/tmp/backend2;
    server backend3.example.com:12345 resolve;

    server backup1.example.com:12345  backup;
}
```

Par défaut, les connexions sont réparties entre les serveurs selon une méthode round-robin pondérée. Dans l'exemple ci-dessus, chaque groupe de 7 connexions est réparti ainsi : 5 connexions vers `backend1.example.com:12345` et une vers chacun des deuxième et troisième serveurs. En cas d'erreur de communication avec un serveur, la connexion est passée au serveur suivant, et ainsi de suite jusqu'à avoir essayé tous les serveurs en fonctionnement. Si la communication échoue avec tous, la connexion est fermée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
