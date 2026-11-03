---
title: "upstream (ngx_http_upstream_module)"
description: "Directive nginx upstream (ngx_http_upstream_module) — Définit un groupe de serveurs. Les serveurs peuvent écouter sur des ports différents, et des serveurs écoutant sur des sockets TCP et de domaine UNIX peuvent être mélangés. Exemple : nginx upstream…"
tags: [nginx, directive, ngx_http_upstream_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `upstream name { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

## Utilisation

Définit un groupe de serveurs. Les serveurs peuvent écouter sur des ports différents, et des serveurs écoutant sur des sockets TCP et de domaine UNIX peuvent être mélangés.

Exemple :

```nginx
upstream backend {
    server backend1.example.com weight=5;
    server 127.0.0.1:8080       max_fails=3 fail_timeout=30s;
    server unix:/tmp/backend3;

    server backup1.example.com  backup;
}
```

Par défaut, les requêtes sont réparties entre les serveurs selon la méthode du tourniquet pondéré (*weighted round-robin*). Dans l'exemple ci-dessus, sur 7 requêtes, 5 vont à `backend1.example.com` et une à chacun des deuxième et troisième serveurs. Si une erreur survient lors de la communication avec un serveur, la requête est transmise au serveur suivant, et ainsi de suite jusqu'à ce que tous les serveurs en fonctionnement aient été essayés. Si aucun serveur ne donne de réponse valide, le client reçoit le résultat de la communication avec le dernier serveur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
