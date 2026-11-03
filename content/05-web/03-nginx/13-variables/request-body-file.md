---
title: "$request_body_file"
description: "Variable nginx $request_body_file (ngx_http_core_module) — nom du fichier temporaire contenant le corps de la requête À la fin du traitement, le fichier doit être supprimé. Pour toujours écrire le corps de la requête dans un fichier, il faut activer…"
tags: [nginx, variable, ngx_http_core_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$request_body_file` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

nom du fichier temporaire contenant le corps de la requête

À la fin du traitement, le fichier doit être supprimé. Pour toujours écrire le corps de la requête dans un fichier, il faut activer [[12-directives/client-body-in-file-only|client_body_in_file_only]]. Lorsque le nom du fichier temporaire est transmis dans une requête relayée ou dans une requête vers un serveur FastCGI/uwsgi/SCGI, la transmission du corps de la requête doit être désactivée avec, respectivement, les directives [[12-directives/proxy-pass-request-body|proxy_pass_request_body off]], [[12-directives/fastcgi-pass-request-body|fastcgi_pass_request_body off]], [[12-directives/uwsgi-pass-request-body|uwsgi_pass_request_body off]] ou [[12-directives/scgi-pass-request-body|scgi_pass_request_body off]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
