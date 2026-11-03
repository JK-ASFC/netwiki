---
title: "SSLSRPUnknownUserSeed"
description: "Directive Apache SSLSRPUnknownUserSeed (mod_ssl) — Source d'aléa pour utilisateur SRP inconnu. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Source d'aléa pour utilisateur SRP inconnu |
| **Syntaxe** | `SSLSRPUnknownUserSeed secret-string` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible depuis la version 2.4.4 du serveur HTTP Apache, si la version 1.0.1 ou supérieure d'OpenSSL est utilisée. |

## Utilisation

Cette directive permet de définir la source d'aléa à utiliser pour les utilisateurs SRP inconnus, ceci afin de combler les manques en cas d'existence d'un tel utilisateur. Elle définit une chaîne secrète. Si cette directive n'est pas définie, Apache renverra une alerte UNKNOWN\_PSK\_IDENTITY aux clients qui fournissent un nom d'utilisateur inconnu.

**Exemple**

```
SSLSRPUnknownUserSeed "secret"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
