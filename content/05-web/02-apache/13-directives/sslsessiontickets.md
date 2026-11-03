---
title: "SSLSessionTickets"
description: "Directive Apache SSLSessionTickets (mod_ssl) — Active ou désactive les tickets de session TLS. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active ou désactive les tickets de session TLS |
| **Syntaxe** | `SSLSessionTickets on\|off` |
| **Valeur par défaut** | `SSLSessionTickets on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.4.11 du serveur HTTP Apache, sous réserve d'utiliser OpenSSL version 0.9.8f ou supérieure. |

## Utilisation

Cette directive permet d'activer ou de désactiver l'utilisation des tickets de session TLS (RFC 5077).

> [!WARNING]
> Les tickets de session TLS sont activés par défaut. Les utiliser sans redémarrer le serveur selon une périodicité appropriée (par exemple quotidiennement) compromet cependant le niveau de confidentialité.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
