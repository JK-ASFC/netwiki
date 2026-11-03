---
title: "SSLStaplingCache"
description: "Directive Apache SSLStaplingCache (mod_ssl) — Configuration du cache pour l'agrafage OCSP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configuration du cache pour l'agrafage OCSP |
| **Syntaxe** | `SSLStaplingCache type` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Si [[13-directives/sslusestapling|SSLUseStapling]] est à "on", cette directive permet de configurer le cache destiné à stocker les réponses OCSP incluses dans la négociation TLS. La configuration d'un cache est obligatoire pour pouvoir utiliser l'agrafage OCSP. A l'exception de `none` et `nonenotnull`, cette directive supporte les mêmes types de stockage que la directive [[13-directives/sslsessioncache|SSLSessionCache]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
