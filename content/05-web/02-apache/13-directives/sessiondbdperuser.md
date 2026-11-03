---
title: "SessionDBDPerUser"
description: "Directive Apache SessionDBDPerUser (mod_session_dbd) — Active une session propre à un utilisateur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active une session propre à un utilisateur |
| **Syntaxe** | `SessionDBDPerUser On\|Off` |
| **Valeur par défaut** | `SessionDBDPerUser Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_dbd\|mod_session_dbd]] |

## Utilisation

La directive `SessionDBDPerUser` permet d'activer une session propre à un utilisateur, dont la clé sera le nom de l'utilisateur connecté. Si l'utilisateur n'est pas connecté, la directive sera ignorée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
