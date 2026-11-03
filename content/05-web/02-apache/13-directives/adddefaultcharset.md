---
title: "AddDefaultCharset"
description: "Directive Apache AddDefaultCharset (core) — Paramètre jeu de caractères par défaut à ajouter quand le type de contenu d'une réponse est text/plain ou text/html. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Paramètre jeu de caractères par défaut à ajouter quand le type de contenu d'une réponse est `text/plain` ou `text/html` |
| **Syntaxe** | `AddDefaultCharset On\|Off\|jeu de caractères` |
| **Valeur par défaut** | `AddDefaultCharset Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive spécifie une valeur par défaut pour le paramètre jeu de caractères du type de média (le nom d'un codage de caractères) à ajouter à une réponse, si et seulement si le type de contenu de la réponse est soit `text/plain`, soit `text/html`. Ceci va remplacer tout jeu de caractères spécifié dans le corps de la réponse via un élément `META`, bien que cet effet dépende en fait souvent de la configuration du client de l'utilisateur. La définition de `AddDefaultCharset Off` désactive cette fonctionnalité. `AddDefaultCharset On` ajoute un jeu de caractères par défaut de `iso-8859-1`. Toute autre valeur peut être définie via le paramètre *jeu de caractères*, qui doit appartenir à la liste des [valeurs de jeux de caractères enregistrés par l'IANA](http://www.iana.org/assignments/character-sets) à utiliser dans les types de média Internet (types MIME). Par exemple :

```apache
AddDefaultCharset utf-8
```

La directive `AddDefaultCharset` ne doit être utilisée que lorsque toutes les ressources textes auxquelles elle s'applique possèdent le jeu de caractère spécifié, et qu'il est trop contraignant de définir leur jeu de caractères individuellement. Un exemple de ce type est l'ajout du paramètre jeu de caractères aux ressources comportant un contenu généré, comme les scripts CGI hérités qui peuvent être vulnérables à des attaques de type cross-site scripting à cause des données utilisateurs incluses dans leur sortie. Notez cependant qu'une meilleur solution consiste à corriger (ou supprimer) ces scripts, car la définition d'un jeu de caractères par défaut ne protège pas les utilisateurs qui ont activé la fonctionnalité "Détection automatique de l'encodage des caractères" dans leur navigateur.

## Voir aussi

- [[13-directives/addcharset|AddCharset]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
