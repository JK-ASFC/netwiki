---
title: "SSLHonorCipherOrder"
description: "Directive Apache SSLHonorCipherOrder (mod_ssl) — Option permettant de classer les algorithmes de chiffrement du serveur par ordre de préférence. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Option permettant de classer les algorithmes de chiffrement du serveur par ordre de préférence |
| **Syntaxe** | `SSLHonorCipherOrder on\|off` |
| **Valeur par défaut** | `SSLHonorCipherOrder off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.1 du serveur HTTP Apache |

## Utilisation

Normalement, ce sont les préférences du client qui sont prises en compte lors du choix d'un algorithme de chiffrement au cours d'une négociation SSLv3 ou TLSv1. Si cette directive est activée, ce sont les préférences du serveur qui seront prises en compte à la place.

**Exemple**

```apache
SSLHonorCipherOrder on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
