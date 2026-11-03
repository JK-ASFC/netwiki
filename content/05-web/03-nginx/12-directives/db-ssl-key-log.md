---
title: "db_ssl_key_log"
description: "Directive nginx db_ssl_key_log (ngx_http_db_module) — Active la journalisation des clés SSL des connexions aux serveurs de base de données et indique le chemin du fichier journal des clés. Les clés sont écrites au format SSLKEYLOGFILE, compatible avec…"
tags: [nginx, directive, ngx_http_db_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `db_ssl_key_log file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_db_module\|ngx_http_db_module]] |

## Utilisation

Active la journalisation des clés SSL des connexions aux serveurs de base de données et indique le chemin du fichier journal des clés. Les clés sont écrites au format [SSLKEYLOGFILE](https://datatracker.ietf.org/doc/html/rfc9850), compatible avec Wireshark.

> [!NOTE]
> Les journaux de clés TLS contiennent des données sensibles permettant de déchiffrer le trafic capturé. Protégez ces fichiers et n'activez la journalisation qu'en cas de besoin.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
