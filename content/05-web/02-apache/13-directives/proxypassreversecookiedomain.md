---
title: "ProxyPassReverseCookieDomain"
description: "Directive Apache ProxyPassReverseCookieDomain (mod_proxy) — Ajuste la chaîne correspondant au domaine dans les en-têtes Set-Cookie en provenance d'un serveur mandaté. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajuste la chaîne correspondant au domaine dans les en-têtes Set-Cookie en provenance d'un serveur mandaté |
| **Syntaxe** | `ProxyPassReverseCookieDomain domaine-interne domaine-public [interpolate]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

L'utilisation de cette directive est similaire à celle de la directive [[13-directives/proxypassreverse|ProxyPassReverse]], mais au lieu de réécrire des en-têtes qui contiennent des URLs, elle réécrit la chaîne correspondant au domaine dans les en-têtes `Set-Cookie`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
