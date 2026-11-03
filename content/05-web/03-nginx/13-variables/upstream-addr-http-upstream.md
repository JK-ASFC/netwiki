---
title: "$upstream_addr (ngx_http_upstream_module)"
description: "Variable nginx $upstream_addr (ngx_http_upstream_module) — contient l'adresse IP et le port, ou le chemin du socket de domaine UNIX, du serveur amont. Si plusieurs serveurs ont été contactés pendant le traitement de la requête, leurs adresses sont séparées…"
tags: [nginx, variable, ngx_http_upstream_module]
icon: dollar-sign
---

| Propriété | Valeur |
| --- | --- |
| **Variable** | `$upstream_addr` |
| **Module** | [[11-modules/02-http/ngx_http_upstream_module\|ngx_http_upstream_module]] |

contient l'adresse IP et le port, ou le chemin du socket de domaine UNIX, du serveur amont. Si plusieurs serveurs ont été contactés pendant le traitement de la requête, leurs adresses sont séparées par des virgules, par exemple « `192.168.1.1:80, 192.168.1.2:80, unix:/tmp/sock` ». En cas de redirection interne d'un groupe de serveurs vers un autre, déclenchée par `X-Accel-Redirect` ou [[12-directives/error-page|error_page]], les adresses des différents groupes sont séparées par des deux-points, par exemple « `192.168.1.1:80, 192.168.1.2:80, unix:/tmp/sock : 192.168.10.1:80, 192.168.10.2:80` ». Si aucun serveur ne peut être choisi, la variable contient le nom du groupe de serveurs.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
