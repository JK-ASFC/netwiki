---
title: "CookieSameSite"
description: "Directive Apache CookieSameSite (mod_usertrack) — Ajoute l'attribut 'SameSite' au cookie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute l'attribut 'SameSite' au cookie |
| **Syntaxe** | `CookieSameSite None\|Lax\|Strict` |
| **Valeur par défaut** | `unset` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

Lorsque cette directive est définie à 'None', 'Lax', ou 'Strict', l'attribut 'SameSite' est ajouté au cookie de traçage avec la valeur correspondante. Cet attribut indique aux navigateurs de quelle manière ils doivent traiter le cookie lorsqu'il est demandé dans un contexte cross-site.

> [!WARNING]
> 'None' définit l'attribut 'SameSite' à 'None', ce qui correspond à la configuration la plus permissive. Pour ne pas ajouter cet attribut au cookie, il est donc préférable de ne pas définir du tout cette directive.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
