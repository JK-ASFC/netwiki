---
title: "CookieSecure"
description: "Directive Apache CookieSecure (mod_usertrack) — Ajoute l'attribut 'Secure' au cookie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute l'attribut 'Secure' au cookie |
| **Syntaxe** | `CookieSecure on\|off` |
| **Valeur par défaut** | `CookieSecure off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

Lorsqu'elle est définie à 'ON', cette directive ajoute l'attribut 'Secure' au cookie de traçage. Cet attribut indique aux navigateurs qu'il ne doivent transmettre le cookie que via HTTPS.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
