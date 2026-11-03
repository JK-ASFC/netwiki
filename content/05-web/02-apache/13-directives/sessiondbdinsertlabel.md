---
title: "SessionDBDInsertLabel"
description: "Directive Apache SessionDBDInsertLabel (mod_session_dbd) — La requête SQL à utiliser pour insérer des sessions dans la base de données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La requête SQL à utiliser pour insérer des sessions dans la base de données |
| **Syntaxe** | `SessionDBDInsertLabel étiquette` |
| **Valeur par défaut** | `SessionDBDInsertLabel insertsession` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_dbd\|mod_session_dbd]] |

## Utilisation

La directive `SessionDBDInsertLabel` permet de définir l'étiquette de la requête d'insertion par défaut à charger dans une session. Cette étiquette doit avoir été définie au préalable via une directive [[13-directives/dbdpreparesql|DBDPrepareSQL]].

Si une tentative de mise à jour d'une session ne concerne aucun enregistrement, c'est cette requête qui sera utilisée pour insérer la session dans la base de données.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
