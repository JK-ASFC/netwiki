---
title: "SSLRequireSSL"
description: "Directive Apache SSLRequireSSL (mod_ssl) — Interdit l'accès lorsque la requête HTTP n'utilise pas SSL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Interdit l'accès lorsque la requête HTTP n'utilise pas SSL |
| **Syntaxe** | `SSLRequireSSL` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive interdit l'accès si HTTP sur SSL (c'est à dire HTTPS) n'est pas activé pour la connexion courante. Ceci est très pratique dans un serveur virtuel où SSL est activé ou dans un répertoire pour se protéger des erreurs de configuration qui pourraient donner accès à des ressources protégées. Lorsque cette directive est présente, toutes les requêtes qui n'utilisent pas SSL sont rejetées.

**Exemple**

```apache
SSLRequireSSL
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
