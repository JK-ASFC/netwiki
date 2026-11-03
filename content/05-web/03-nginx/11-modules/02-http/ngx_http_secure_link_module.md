---
title: "ngx_http_secure_link_module"
description: "Module nginx ngx_http_secure_link_module — Le module ngx_http_secure_link_module (0.7.18) sert à vérifier l'authenticité des liens demandés, à protéger les ressources contre les accès non autorisés et à limiter la durée de vie des liens."
tags: [nginx, module, ngx_http_secure_link_module]
icon: puzzle
---

Le module `ngx_http_secure_link_module` (0.7.18) sert à vérifier l'authenticité des liens demandés, à protéger les ressources contre les accès non autorisés et à limiter la durée de vie des liens.

L'authenticité d'un lien est vérifiée en comparant la somme de contrôle transmise dans la requête à celle calculée pour la requête. Si le lien a une durée de vie limitée et qu'elle est dépassée, il est considéré comme périmé. Le résultat de ces vérifications est disponible dans la variable `$secure_link`.

Le module propose deux modes de fonctionnement. Le premier, activé par la directive [[12-directives/secure-link-secret|secure_link_secret]], sert à vérifier l'authenticité des liens et à protéger les ressources contre les accès non autorisés. Le second (0.8.50), activé par les directives [[12-directives/secure-link|secure_link]] et [[12-directives/secure-link-md5|secure_link_md5]], sert aussi à limiter la durée de vie des liens.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_secure_link_module`.

## Directives

- [[12-directives/secure-link|secure_link]]
- [[12-directives/secure-link-md5|secure_link_md5]]
- [[12-directives/secure-link-secret|secure_link_secret]]

## Variables intégrées

- [[13-variables/secure-link|$secure_link]]
- [[13-variables/secure-link-expires|$secure_link_expires]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
