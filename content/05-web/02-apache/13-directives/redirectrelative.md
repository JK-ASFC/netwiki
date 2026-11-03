---
title: "RedirectRelative"
description: "Directive Apache RedirectRelative (mod_alias) — Redirection relative de cibles. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Redirection relative de cibles. |
| **Syntaxe** | `RedirectRelative On\|Off` |
| **Valeur par défaut** | `RedirectRelative Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |
| **Compatibilité** | Disponible à partir de la version 2.4.58 du serveur HTTP Apache |

## Utilisation

Par défaut, si l'URL cible d'une directive [[13-directives/redirect|Redirect]] est une URL relative commençant par un caractère '/', le serveur convertit cette dernière en URL absolue avant de répondre au client. En définissant `RedirectRelative` à "On", l'URL relative est présentée au client sans modification.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
