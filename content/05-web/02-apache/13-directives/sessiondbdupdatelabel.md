---
title: "SessionDBDUpdateLabel"
description: "Directive Apache SessionDBDUpdateLabel (mod_session_dbd) — La requête SQL à utiliser pour mettre à jour des sessions préexistantes dans la base de données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | La requête SQL à utiliser pour mettre à jour des sessions préexistantes dans la base de données |
| **Syntaxe** | `SessionDBDUpdateLabel étiquette` |
| **Valeur par défaut** | `SessionDBDUpdateLabel updatesession` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session_dbd\|mod_session_dbd]] |

## Utilisation

La directive `SessionDBDUpdateLabel` permet de définir l'étiquette de la requête de mise à jour par défaut à charger dans une session. Cette étiquette doit avoir été définie au préalable via une directive [[13-directives/dbdpreparesql|DBDPrepareSQL]].

Si une tentative de mise à jour d'une session ne concerne aucun enregistrement, c'est la requête d'insertion qui sera appelée pour insérer la session dans la base de données. Si la base de données supporte InsertOrUpdate, modifiez cette requête pour effectuer la mise à jour en une seule requête au lieu de deux.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
