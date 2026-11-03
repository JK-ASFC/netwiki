---
title: "SSLSessionCacheTimeout"
description: "Directive Apache SSLSessionCacheTimeout (mod_ssl) — Nombre de secondes avant l'expiration d'une session SSL dans le cache de sessions. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nombre de secondes avant l'expiration d'une session SSL dans le cache de sessions |
| **Syntaxe** | `SSLSessionCacheTimeout secondes` |
| **Valeur par défaut** | `SSLSessionCacheTimeout 300` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | S'applique aussi à la reprise de session TLS (RFC 5077) à partir de la version 2.4.10 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir la durée de vie en secondes des informations stockées dans le cache de sessions SSL global et inter-processus, dans le cache OpenSSL interne en mémoire et pour les sessions réinitialisées par la reprise de session TLS (RFC 5077). elle peut être définie à une valeur d'environ 15 à des fins de test, mais à une valeur très supérieure comme 300 en production.

**Exemple**

```apache
SSLSessionCacheTimeout 600
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
