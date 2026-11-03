---
title: "SessionDBDSelectLabel"
description: "Directive Apache SessionDBDSelectLabel (mod_session_dbd) — La requête SQL à utiliser pour sélectionner des sessions dans la base de données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La requête SQL à utiliser pour sélectionner des sessions dans la base de données |
| **Syntaxe** | `SessionDBDSelectLabel étiquette` |
| **Valeur par défaut** | `SessionDBDSelectLabel selectsession` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_dbd\|mod_session_dbd]] |

## Utilisation

La directive `SessionDBDSelectLabel` permet de définir l'étiquette de la requête de sélection par défaut à utiliser pour charger une session. Cette étiquette doit avoir été définie au préalable via une directive [[13-directives/dbdpreparesql|DBDPrepareSQL]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
