---
title: "InputSed"
description: "Directive Apache InputSed (mod_sed) — Commande sed à exécuter pour le filtrage des données d'une requête (en général des données POST). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_sed]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Commande sed à exécuter pour le filtrage des données d'une requête (en général des données `POST`) |
| **Syntaxe** | `InputSed commande-sed` |
| **Contexte** | répertoire, .htaccess |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_sed\|mod_sed]] |

## Utilisation

La directive `InputSed` permet de spécifier la commande sed à exécuter pour le filtrage des données (en général des données `POST`) d'une requête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
