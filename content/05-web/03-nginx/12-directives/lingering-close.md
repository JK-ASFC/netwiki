---
title: "lingering_close"
description: "Directive nginx lingering_close (ngx_http_core_module) — Contrôle la façon dont nginx ferme les connexions des clients. La valeur par défaut « on » demande à nginx d'attendre et de traiter les données supplémentaires du client avant de fermer complètement…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `lingering_close off \| on \| always;` |
| **Valeur par défaut** | `lingering_close on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.1.0, 1.0.6 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Contrôle la façon dont nginx ferme les connexions des clients.

La valeur par défaut « `on` » demande à nginx d'[[12-directives/lingering-timeout|attendre]] et de [[12-directives/lingering-time|traiter]] les données supplémentaires du client avant de fermer complètement la connexion, mais seulement si l'heuristique suggère que le client peut encore envoyer des données.

La valeur « `always` » fait attendre et traiter sans condition les données supplémentaires du client.

La valeur « `off` » indique à nginx de ne jamais attendre d'autres données et de fermer immédiatement la connexion. Ce comportement enfreint le protocole et ne doit pas être utilisé en temps normal.

Pour contrôler la fermeture des connexions [[11-modules/02-http/ngx_http_v2_module|HTTP/2]], la directive doit être indiquée au niveau [[12-directives/server-http-core|server]] (1.19.1).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
