---
title: "AuthDigestAlgorithm"
description: "Directive Apache AuthDigestAlgorithm (mod_auth_digest) — Sélectionne l'algorithme utilisé pour calculer les condensés du défit et de sa réponse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_digest]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Sélectionne l'algorithme utilisé pour calculer les condensés du défit et de sa réponse |
| **Syntaxe** | `AuthDigestAlgorithm MD5\|MD5-sess` |
| **Valeur par défaut** | `AuthDigestAlgorithm MD5` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_auth_digest\|mod_auth_digest]] |

## Utilisation

La directive `AuthDigestAlgorithm` permet de sélectionner l'algorithme utilisé pour calculer les condensés du défit et de sa réponse.

> [!NOTE]
> `MD5-sess` n'est pas encore correctement implémenté.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
