---
title: "grpc_set_header"
description: "Directive nginx grpc_set_header (ngx_http_grpc_module) — Permet de redéfinir ou d'ajouter des champs à l'en-tête de la requête transmis au serveur gRPC. La valeur (value) peut contenir du texte, des variables ou une combinaison des deux. Ces directives…"
tags: [nginx, directive, ngx_http_grpc_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `grpc_set_header field value;` |
| **Valeur par défaut** | `grpc_set_header Content-Length $content_length;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_grpc_module\|ngx_http_grpc_module]] |

## Utilisation

Permet de redéfinir ou d'ajouter des champs à l'en-tête de la requête transmis au serveur gRPC. La valeur (*value*) peut contenir du texte, des variables ou une combinaison des deux. Ces directives sont héritées du niveau de configuration précédent si et seulement si aucune directive `grpc_set_header` n'est définie au niveau courant.

Si la valeur d'un champ d'en-tête est une chaîne vide, ce champ n'est pas transmis au serveur gRPC :

```nginx
grpc_set_header Accept-Encoding "";
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
