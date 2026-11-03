---
title: "ISAPILogNotSupported"
description: "Directive Apache ISAPILogNotSupported (mod_isapi) — Journalisation des demandes de fonctionnalités non supportées de la part des extensions ISAPI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_isapi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Journalisation des demandes de fonctionnalités non supportées de la part des extensions ISAPI |
| **Syntaxe** | `ISAPILogNotSupported on\|off` |
| **Valeur par défaut** | `ISAPILogNotSupported off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_isapi\|mod_isapi]] |

## Utilisation

Cette directive permet d'enregistrer dans le journal des erreurs toutes les demandes de fonctionnalités non supportées de la part des extensions ISAPI. Ceci peut aider les administrateurs à décortiquer certains problèmes. Lorsqu'elle a été définie à "on" et si tous les modules ISAPI fonctionnent, elle peut être redéfinie à "off".

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
