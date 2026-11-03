---
title: "ProxyPassReverseCookiePath"
description: "Directive Apache ProxyPassReverseCookiePath (mod_proxy) — Ajuste la chaîne correspondant au chemin dans les en-têtes Set-Cookie en provenance d'un serveur mandaté. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajuste la chaîne correspondant au chemin dans les en-têtes Set-Cookie en provenance d'un serveur mandaté |
| **Syntaxe** | `ProxyPassReverseCookiePath chemin-interne chemin-public [interpolate]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Cette directive s'avère utile en conjonction avec la directive [[13-directives/proxypassreverse|ProxyPassReverse]] dans les situations où les chemins d'URL d'arrière-plan correspondent à des chemins publics sur le mandataire inverse. Cette directive permet de réécrire la chaîne `path` dans les en-têtes `Set-Cookie`. Si le début du chemin du cookie correspond à *chemin-interne*, le chemin du cookie sera remplacé par *chemin-public*.

Dans l'exemple fourni avec la directive [[13-directives/proxypassreverse|ProxyPassReverse]], la directive :

```apache
ProxyPassReverseCookiePath  "/"  "/mirror/foo/"
```

va réécrire un cookie possédant un chemin d'arrière-plan `/` (ou `/example` ou en fait tout chemin) en `/mirror/foo/`..

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
