---
title: "Session"
description: "Directive Apache Session (mod_session) — Ouvre une session pour le contexte courant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ouvre une session pour le contexte courant |
| **Syntaxe** | `Session On\|Off` |
| **Valeur par défaut** | `Session Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session\|mod_session]] |

## Utilisation

La directive `Session` permet d'ouvrir une session pour le contexte ou conteneur courant. Les directives suivantes permettent de définir où la session sera stockée et comment sera assurée la confidentialité.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
