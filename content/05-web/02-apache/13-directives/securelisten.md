---
title: "SecureListen"
description: "Directive Apache SecureListen (mod_nw_ssl) — Active le chiffrement SSL pour le port spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_nw_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active le chiffrement SSL pour le port spécifié |
| **Syntaxe** | `SecureListen [adresse-IP:]num-port nom-certificat [MUTUAL]` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_nw_ssl\|mod_nw_ssl]] |

## Utilisation

Cette directive permet de spécifier le port et le nom de certificat de style eDirectory qui seront utilisés pour activer le chiffrement SSL. En outre, un troisième paramètre optionnel permet d'activer l'authentification mutuelle.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
