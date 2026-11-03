---
title: "mp4_limit_rate"
description: "Directive nginx mp4_limit_rate (ngx_http_mp4_module) — Limite le débit de transmission de la réponse au client. Le débit est limité en fonction du débit binaire moyen du fichier MP4 servi : ce débit binaire est multiplié par le facteur (factor) indiqué.…"
tags: [nginx, directive, ngx_http_mp4_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `mp4_limit_rate on \| off \| factor;` |
| **Valeur par défaut** | `mp4_limit_rate off;` |
| **Contexte** | `http`, `server`, `location` |
| **Module** | [[11-modules/02-http/ngx_http_mp4_module\|ngx_http_mp4_module]] |

## Utilisation

Limite le débit de transmission de la réponse au client. Le débit est limité en fonction du débit binaire moyen du fichier MP4 servi : ce débit binaire est multiplié par le facteur (*factor*) indiqué. La valeur spéciale « `on` » correspond au facteur 1,1 ; « `off` » désactive la limitation. La limite s'applique par requête : si un client ouvre deux connexions simultanées, le débit total sera le double de la limite indiquée.

> [!NOTE]
> Cette directive est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
