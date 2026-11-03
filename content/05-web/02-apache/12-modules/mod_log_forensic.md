---
title: "mod_log_forensic"
description: "Module Apache mod_log_forensic — Journalisation légale des requêtes envoyées au serveur. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_log_forensic]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Journalisation légale des requêtes envoyées au serveur |
| **Statut** | Extension |
| **Identificateur** | `log_forensic_module` |
| **Fichier source** | `mod_log_forensic.c` |
| **Compatibilité** | [[12-modules/mod_unique_id\\|mod_unique_id]] n'est plus obligatoire depuis la version 2.1 |

## Sommaire

Ce module permet la journalisation légale des requêtes client. La journalisation s'effectuant avant et après le traitement de la requête, le journal légal contient deux lignes pour chaque requête. Le processus de journalisation légale est très strict, à savoir :

- Le format est figé. Vous ne pouvez pas modifier le format du journal à l'exécution.
- S'il ne peut pas enregistrer ses données, le processus enfant se termine aussitôt, et peut éventuellement enregistrer un vidage mémoire (selon la définition de la directive [[13-directives/coredumpdirectory|CoreDumpDirectory]]).

Pour interpréter les données du journal légal, vous pouvez vous aider du script `check_forensic` qui se trouve dans le répertoire support de la distribution.

> [!NOTE]
> Note de traduction : le terme "légal" utilisé dans le présent document ne suggère aucunement que ce module apporte une valeur juridique aux journaux. Il est à comprendre dans le contexte similaire à ce que l'on trouve en analyse medico-légale. En d'autres termes, la finalité de ce module est de simplifier les opérations d'investigation autour du traitement des requêtes par le serveur.

## Format du journal Forensic

Chaque requête fait l'objet d'une double journalisation. La requête est journalisée une première fois avant son traitement (c'est à dire après la réception des en-têtes). La deuxième entrée du journal est écrite *après* le traitement de la requête, en fait au moment de la journalisation habituelle.

Un identifiant unique est attribué à chaque requête afin de pouvoir l'identifier. Cette identifiant légal peut faire l'objet d'un enregistrement dans le journal standard en utilisant l'élément de chaîne de format `%{forensic-id}n`. Si vous utilisez [[12-modules/mod_unique_id|mod_unique_id]], c'est l'identifiant qu'il génère qui sera utilisé.

La première partie de la journalisation de la requête enregistre l'identifiant légal, la ligne de la requête et tous les en-têtes reçus séparés par des caractères pipe (`|`). Voici à titre d'exemple à quoi pourrait ressembler une telle entrée (tout étant rassemblé sur une seule ligne) :

```
+yQtJf8CoAB4AAFNXBIEAAAAA|GET /manual/de/images/down.gif
HTTP/1.1|Host:localhost%3a8080|User-Agent:Mozilla/5.0 (X11;
U; Linux i686; en-US; rv%3a1.6) Gecko/20040216
Firefox/0.8|Accept:image/png, etc...
```

Le caractère plus ('+') de début indique qu'il s'agit de la première entrée de journal pour cette requête. La seconde entrée ne contiendra qu'un caractère moins ('-') suivi de l'identifiant :

```
-yQtJf8CoAB4AAFNXBIEAAAAA
```

Le script `check_forensic` prend comme argument le nom du fichier journal. Il recherche ces paires d'identifiants `+`/`-` et affiche un message d'erreur si la journalisation d'une requête n'est pas complète.

## Considérations à propos de sécurité

Voir le document [[11-guides/06-divers/conseils-sur-la-securite|conseils en matière de sécurité]] pour des détails sur les raisons pour lesquelles votre sécurité pourrait être compromise si le répertoire dans lequel les fichiers journaux sont stockés sont inscriptibles par tout autre utilisateur que celui qui démarre le serveur.

Les fichiers journaux peuvent contenir des données sensibles comme le contenu des en-têtes `Authorization:` (qui peuvent contenir des mots de passe) ; ils ne doivent donc être lisibles que par l'utilisateur qui démarre le serveur.

## Directives

- [[13-directives/forensiclog|ForensicLog]]

## Voir aussi

- [[11-guides/01-generalites/fichiers-journaux|Les fichiers journaux d'Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
