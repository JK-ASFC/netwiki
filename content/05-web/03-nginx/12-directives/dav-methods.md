---
title: "dav_methods"
description: "Directive nginx dav_methods (ngx_http_dav_module) — Autorise les méthodes HTTP et WebDAV indiquées. Le paramètre off refuse toutes les méthodes traitées par ce module. Les méthodes prises en charge sont PUT, DELETE, MKCOL, COPY et MOVE. Un fichier…"
tags: [nginx, directive, ngx_http_dav_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `dav_methods off \| method ...;` |
| **Valeur par défaut** | `dav_methods off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_dav_module\|ngx_http_dav_module]] |

## Utilisation

Autorise les méthodes HTTP et WebDAV indiquées. Le paramètre `off` refuse toutes les méthodes traitées par ce module. Les méthodes prises en charge sont `PUT`, `DELETE`, `MKCOL`, `COPY` et `MOVE`.

Un fichier envoyé avec la méthode PUT est d'abord écrit dans un fichier temporaire, puis renommé. Depuis la version 0.8.9, les fichiers temporaires et le stockage permanent peuvent se trouver sur des systèmes de fichiers différents ; mais le fichier est alors copié d'un système de fichiers à l'autre au lieu d'un simple renommage, peu coûteux. Il est donc recommandé, pour un bloc location donné, de placer les fichiers enregistrés et le répertoire des fichiers temporaires, défini par la directive [[12-directives/client-body-temp-path|client_body_temp_path]], sur le même système de fichiers.

Lors de la création d'un fichier avec la méthode PUT, on peut indiquer sa date de modification dans le champ d'en-tête `Date`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
