---
title: "RedirectTemp"
description: "Directive Apache RedirectTemp (mod_alias) — Envoie une redirection externe temporaire demandant au client d'effectuer une nouvelle requête avec une URL différente. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_alias]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Envoie une redirection externe temporaire demandant au client d'effectuer une nouvelle requête avec une URL différente |
| **Syntaxe** | `RedirectTemp chemin URL URL` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_alias\|mod_alias]] |

## Utilisation

Cette directive informe le client que la redirection n'est que temporaire (code 302). Son comportement est exactement le même que celui de `Redirect temp`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
