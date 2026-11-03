---
title: "AuthDigestNonceLifetime"
description: "Directive Apache AuthDigestNonceLifetime (mod_auth_digest) — Durée de validité du nombre à valeur unique du serveur (nonce). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_auth_digest]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Durée de validité du nombre à valeur unique du serveur (nonce) |
| **Syntaxe** | `AuthDigestNonceLifetime secondes` |
| **Valeur par défaut** | `AuthDigestNonceLifetime 300` |
| **Contexte** | répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_auth_digest\|mod_auth_digest]] |

## Utilisation

La directive `AuthDigestNonceLifetime` permet de contrôler la durée de validité du nombre à valeur unique du serveur (nonce). Lorsque le client contacte le serveur en utilisant un nonce dont la validité a expiré, le serveur renvoie un code d'erreur 401 avec `stale=true`. Si *secondes* est supérieur à 0, il spécifie la durée de validité du nonce ; il est en général déconseillé d'affecter à cet argument une valeur inférieure à 10 secondes. Si *secondes* est inférieur à 0, le nonce n'expire jamais.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
