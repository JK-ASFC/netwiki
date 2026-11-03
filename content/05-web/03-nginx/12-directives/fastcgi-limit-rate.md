---
title: "fastcgi_limit_rate"
description: "Directive nginx fastcgi_limit_rate (ngx_http_fastcgi_module) — Limite la vitesse de lecture de la réponse du serveur FastCGI. Le débit (rate) s'exprime en octets par seconde. La valeur zéro désactive la limitation. La limite s'applique par requête : si nginx…"
tags: [nginx, directive, ngx_http_fastcgi_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `fastcgi_limit_rate rate;` |
| **Valeur par défaut** | `fastcgi_limit_rate 0;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 1.7.7 |
| **Module** | [[11-modules/02-http/ngx_http_fastcgi_module\|ngx_http_fastcgi_module]] |

## Utilisation

Limite la vitesse de lecture de la réponse du serveur FastCGI. Le débit (*rate*) s'exprime en octets par seconde. La valeur zéro désactive la limitation. La limite s'applique par requête : si nginx ouvre simultanément deux connexions vers le serveur FastCGI, le débit total sera le double de la limite indiquée. La limitation ne fonctionne que si la [[12-directives/fastcgi-buffering|mise en tampon]] des réponses du serveur FastCGI est activée. La valeur du paramètre peut contenir des variables (1.27.0).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
