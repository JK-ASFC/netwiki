---
title: "server (ngx_stream_core_module)"
description: "Directive nginx server (ngx_stream_core_module) — Définit la configuration d'un serveur virtuel. Il n'y a pas de séparation nette entre serveurs virtuels par IP (selon l'adresse IP) et par nom (selon l'extension TLS Server Name Indication (SNI, RFC…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit la configuration d'un serveur virtuel. Il n'y a pas de séparation nette entre serveurs virtuels par IP (selon l'adresse IP) et par nom (selon l'[extension TLS Server Name Indication](http://en.wikipedia.org/wiki/Server_Name_Indication) (SNI, RFC 6066)) (1.25.5). Les directives [[12-directives/listen-stream-core|listen]] décrivent toutes les adresses et tous les ports sur lesquels le serveur accepte des connexions, et la directive [[12-directives/server-name-stream-core|server_name]] liste tous les noms du serveur.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
