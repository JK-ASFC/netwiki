---
title: "ProxySCGIInternalRedirect"
description: "Directive Apache ProxySCGIInternalRedirect (mod_proxy_scgi) — Active ou désactive les réponses de redirection interne en provenance du serveur cible. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_scgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active ou désactive les réponses de redirection interne en provenance du serveur cible. |
| **Syntaxe** | `ProxySCGIInternalRedirect On\|Off\|Headername` |
| **Valeur par défaut** | `ProxySCGIInternalRedirect On` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_scgi\|mod_proxy_scgi]] |
| **Compatibilité** | Le paramètre *Headername* est disponible depuis la version 2.4.13 du serveur HTTP Apache. |

## Utilisation

La directive `ProxySCGIInternalRedirect` permet au serveur cible de rediriger en interne la passerelle vers une URL différente. Cette fonctionnalité trouve son origine dans [[12-modules/mod_cgi|mod_cgi]] qui redirige la réponse en interne si l'état de la réponse est `OK` (`200`), et si la réponse contient un en-tête `Location` (ou un autre en-tête défini) dont la valeur débute par un slash (`/`). Cette valeur est interprétée comme une nouvelle URL locale vers laquelle Apache httpd effectue sa redirection.

De ce point de vue, [[12-modules/mod_proxy_scgi|mod_proxy_scgi]] fait la même chose que [[12-modules/mod_cgi|mod_cgi]], mais vous pouvez en plus désactiver la fonctionnalité ou spécifier l'utilisation d'un en-tête autre que `Location`.

**Exemple**

```apache
    ProxySCGIInternalRedirect Off
# Django et certains autres frameworks qualifient pleinement les "URLs
# locales" définies par l'application ; il faut donc utiliser un autre
# en-tête.
<Location /django-app/>
    ProxySCGIInternalRedirect X-Location
</Location>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
