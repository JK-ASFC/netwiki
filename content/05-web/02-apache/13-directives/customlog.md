---
title: "CustomLog"
description: "Directive Apache CustomLog (mod_log_config) — Définit le nom et le format du fichier journal. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_log_config]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit le nom et le format du fichier journal |
| **Syntaxe** | `CustomLog fichier\|pipe format\|alias [env=[!]variable-environnement\| expr=expression]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Base |
| **Module** | [[12-modules/mod_log_config\|mod_log_config]] |

## Utilisation

La directive `CustomLog` permet de contrôler la journalisation des requêtes destinées au serveur. Un format de journal est spécifié, et la journalisation peut s'effectuer de manière conditionnelle en fonction des caractéristiques de la requête en utilisant des variables d'environnement.

Le premier argument, qui spécifie l'emplacement où les journaux seront écrits, accepte deux types de valeurs :

***fichier***

Un nom de fichier, relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

***pipe***

Le caractère pipe "`|`", suivi du chemin vers un programme qui recevra les informations de la journalisation sur son entrée standard. Voir les notes à propos de la [[11-guides/01-generalites/fichiers-journaux|journalisation redirigée]] pour plus d'informations.

> [!WARNING]
> **Sécurité :**
>
> Si les journaux sont redirigés vers un programme, ce dernier s'exécutera sous l'utilisateur qui a démarré [[10-commandes/httpd|httpd]]. Ce sera l'utilisateur root si le serveur a été démarré par root ; vérifiez que le programme est sécurisé.

> [!WARNING]
> **Note**
>
> Lors de la spécification d'un chemin de fichier sur les plate-formes non-Unix, il faut prendre soin de ne pas oublier que seuls les slashes directs doivent être utilisés, même si la plate-forme autorise l'emploi d'anti-slashes. D'une manière générale, c'est une bonne idée que de n'utiliser que des slashes directs dans les fichiers de configuration.

Le second argument permet de définir ce qui va être écrit dans le fichier journal. Il peut contenir soit un *alias* prédéfini par une directive [[13-directives/logformat|LogFormat]], soit une chaîne de *format* explicite comme décrit dans la section formats de journaux.

Par exemple, les deux blocs de directives suivants produisent le même effet :

```apache
# Journal personnalisé avec alias de format
LogFormat "%h %l %u %t \"%r\" %>s %b" common
CustomLog "logs/access_log" common

# Journal personnalisé avec chaîne de format explicite
CustomLog "logs/access_log" "%h %l %u %t \"%r\" %>s %b"
```

Le troisième argument est optionnel et permet de contrôler si une requête doit être ou non journalisée. Dans le cas d'une clause '`env=!nom`', la condition peut être la présence ou l'absence d'une variable particulière dans l'[[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|environnement du serveur]]. Dans le cas d'une clause 'expr=*expression*', la condition consiste en une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression]] booléenne quelconque. Si la condition n'est pas vérifiée, la requête ne sera pas journalisée. D'éventuelles références à des en-têtes HTTP dans l'expression rationnelle n'entraîneront pas l'ajout des noms d'en-tête correspondants à l'en-tête Vary.

Les variables d'environnement peuvent être définies au niveau de chaque requête en utilisant les modules [[12-modules/mod_setenvif|mod_setenvif]] et/ou [[12-modules/mod_rewrite|mod_rewrite]]. Par exemple, si vous voulez enregistrer les requêtes pour toutes les images GIF sur votre serveur dans un fichier journal séparé, et pas dans votre journal principal, vous pouvez utiliser :

```apache
SetEnvIf Request_URI \.gif$ gif-image
CustomLog "gif-requests.log" common env=gif-image
CustomLog "nongif-requests.log" common env=!gif-image
```

Ou, pour reproduire le comportement de l'ancienne directive RefererIgnore, vous pouvez utiliser :

```apache
SetEnvIf Referer example\.com localreferer
CustomLog "referer.log" referer env=!localreferer
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
