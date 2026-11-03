---
title: "ServerSignature"
description: "Directive Apache ServerSignature (core) — Définit un pied de page pour les documents générés par le serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit un pied de page pour les documents générés par le serveur |
| **Syntaxe** | `ServerSignature On\|Off\|EMail` |
| **Valeur par défaut** | `ServerSignature Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ServerSignature` permet de définir une ligne de pied de page fixe pour les documents générés par le serveur (messages d'erreur, listings de répertoires ftp de [[12-modules/mod_proxy|mod_proxy]], sorties de [[12-modules/mod_info|mod_info]], etc...). Dans le cas d'une chaîne de mandataires, l'utilisateur n'a souvent aucun moyen de déterminer lequel des mandataires chaînés a généré un message d'erreur, et c'est une des raisons pour lesquelles on peut être amené à ajouter un tel pied de page.

La valeur par défaut `Off` supprime la ligne de pied de page. la valeur `On` ajoute simplement une ligne contenant le numéro de version du serveur ainsi que le nom du serveur virtuel issu de la directive [[13-directives/servername|ServerName]], alors que la valeur `EMail` ajoute en plus une référence "mailto:" à l'administrateur du document référencé issu la directive [[13-directives/serveradmin|ServerAdmin]].

Les détails à propos du numéro de version du serveur sont contrôlés à l'aide de la directive [[13-directives/servertokens|ServerTokens]].

## Voir aussi

- [[13-directives/servertokens|ServerTokens]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
