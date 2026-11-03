---
title: "ScriptLogLength"
description: "Directive Apache ScriptLogLength (mod_cgi) — Taille maximale du fichier journal des scripts CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille maximale du fichier journal des scripts CGI |
| **Syntaxe** | `ScriptLogLength octets` |
| **Valeur par défaut** | `ScriptLogLength 10385760` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_cgi\|mod_cgi]] |

## Utilisation

La directive `ScriptLogLength` permet de définir la taille maximale du fichier journal des scripts CGI. Comme le fichier journal accumule une grande quantité d'informations par erreur CGI (tous les en-têtes de la requête, toutes les sorties du script), il peut vite atteindre une grande taille. En limitant la taille du fichier, cette directive permet d'éviter les problèmes que causerait sa croissance sans limites. Lorsque le fichier a atteint cette taille maximale, plus aucune information n'y est enregistrée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
