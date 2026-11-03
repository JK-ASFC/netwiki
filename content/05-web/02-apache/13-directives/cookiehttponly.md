---
title: "CookieHTTPOnly"
description: "Directive Apache CookieHTTPOnly (mod_usertrack) — Ajoute l'attribut 'HTTPOnly' au cookie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_usertrack]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ajoute l'attribut 'HTTPOnly' au cookie |
| **Syntaxe** | `CookieHTTPOnly on\|off` |
| **Valeur par défaut** | `CookieHTTPOnly off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_usertrack\|mod_usertrack]] |
| **Compatibilité** | Disponible à partir de la version 2.4.42 du serveur HTTP Apache |

## Utilisation

Lorsqu'elle est définie à 'ON', cette directive ajoute l'attribut 'HTTPOnly' au cookie de traçage. Cet attribut indique aux navigateurs qu'ils doivent bloquer javascript au cours de la lecture de la valeur du cookie.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
