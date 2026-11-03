---
title: "scgi_request_buffering"
description: "Directive nginx scgi_request_buffering (ngx_http_scgi_module) — Active ou désactive la mise en tampon du corps de la requête du client. Lorsque la mise en tampon est activée, tout le corps de la requête est lu depuis le client avant l'envoi de la requête au…"
tags: [nginx, directive, ngx_http_scgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `scgi_request_buffering on \| off;` |
| **Valeur par défaut** | `scgi_request_buffering on;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.11 |
| **Module** | [[11-modules/02-http/ngx_http_scgi_module\|ngx_http_scgi_module]] |

## Utilisation

Active ou désactive la mise en tampon du corps de la requête du client.

Lorsque la mise en tampon est activée, tout le corps de la requête est [[12-directives/client-body-buffer-size|lu]] depuis le client avant l'envoi de la requête au serveur SCGI.

Lorsque la mise en tampon est désactivée, le corps de la requête est envoyé au serveur SCGI dès sa réception. Dans ce cas, la requête ne peut pas être transmise au [[12-directives/scgi-next-upstream|serveur suivant]] si nginx a déjà commencé à envoyer le corps.

Si le corps de la requête d'origine est envoyé avec l'encodage de transfert par morceaux de HTTP/1.1, il est mis en tampon quelle que soit la valeur de la directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
