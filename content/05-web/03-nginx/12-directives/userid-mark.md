---
title: "userid_mark"
description: "Directive nginx userid_mark (ngx_http_userid_module) — Si le paramètre n'est pas off, active le mécanisme de marquage des cookies et définit le caractère servant de marque. Ce mécanisme sert à ajouter ou modifier userid_p3p et/ou la date d'expiration du…"
tags: [nginx, directive, ngx_http_userid_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `userid_mark letter \| digit \| = \| off;` |
| **Valeur par défaut** | `userid_mark off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_userid_module\|ngx_http_userid_module]] |

## Utilisation

Si le paramètre n'est pas `off`, active le mécanisme de marquage des cookies et définit le caractère servant de marque. Ce mécanisme sert à ajouter ou modifier [[12-directives/userid-p3p|userid_p3p]] et/ou la date d'expiration du cookie tout en conservant l'identifiant du client. La marque peut être une lettre de l'alphabet anglais (casse comprise), un chiffre ou le caractère « `=` ».

Si la marque est définie, elle est comparée au premier caractère de remplissage de la représentation base64 de l'identifiant transmis dans le cookie. S'ils diffèrent, le cookie est renvoyé avec la marque, la date d'expiration et l'en-tête `P3P` indiqués.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
