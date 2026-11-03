---
title: "ForensicLog"
description: "Directive Apache ForensicLog (mod_log_forensic) — Définit le nom de fichier du journal légal. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_log_forensic]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom de fichier du journal légal |
| **Syntaxe** | `ForensicLog nom-fichier\|pipe` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_log_forensic\|mod_log_forensic]] |

## Utilisation

La directive `ForensicLog` permet de contrôler la journalisation des requêtes à des fins d'analyse légale. Chaque entrée du journal se voit assigner un identifiant unique qui peut être associé à la requête en utilisant la directive [[13-directives/customlog|CustomLog]] habituelle. [[12-modules/mod_log_forensic|mod_log_forensic]] crée un élément nommé `forensic-id`, qui peut être ajouté au journal standard en utilisant l'élément de format `%{forensic-id}n`.

L'argument, qui permet de spécifier l'emplacement vers lequel le journal légal sera écrit, peut contenir les deux types de valeurs suivants :

***nom-fichier***

Un nom de fichier relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

***pipe***

Le caractère pipe "`|`", suivi du chemin vers un programme qui recevra les informations de la journalisation sur son entrée standard. Le nom du programme peut être relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

> [!WARNING]
> **Sécurité :**
>
> Si les journaux sont redirigés vers un programme, ce dernier s'exécutera sous l'utilisateur qui a démarré [[10-commandes/httpd|httpd]]. Ce sera l'utilisateur root si le serveur a été démarré par root ; vérifiez que le programme est sécurisé ou passe sous le contrôle d'un utilisateur possédant des droits restreints.

> [!NOTE]
> **Note**
>
> Lors de la spécification d'un chemin de fichier sur les plate-formes non-Unix, il faut prendre soin de ne pas oublier que seuls les slashes directs doivent être utilisés, même si la plate-forme autorise l'emploi d'anti-slashes. D'une manière générale, c'est une bonne idée que de n'utiliser que des slashes directs dans les fichiers de configuration.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
