---
title: "AddCharset"
description: "Directive Apache AddCharset (mod_mime) — Associe les extensions de noms de fichiers spécifiées au jeu de caractères spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Associe les extensions de noms de fichiers spécifiées au jeu de caractères spécifié |
| **Syntaxe** | `AddCharset jeu-car extension [extension] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `AddCharset` permet d'associer les extensions de noms de fichiers spécifiées au jeu de caractères spécifié (le nom enregistré sur l'Internet d'un codage de caractères donné). *jeu-car* est le [paramètre jeu de caractères du type de médium](http://www.iana.org/assignments/character-sets) pour les ressources dont le nom de fichier contient *extension*. Cette association est ajoutée à toutes les autres déjà en vigueur, et écrase toute association préexistante pour la même *extension*.

**Exemple**

```apache
AddLanguage ja .ja
AddCharset EUC-JP .euc
AddCharset ISO-2022-JP .jis
AddCharset SHIFT_JIS .sjis
```

Avec cet exemple, le document `xxxx.ja.jis` sera traité en tant que document japonais dont le jeu de caractère est `ISO-2022-JP` (idem pour le document `xxxx.jis.ja`). La directive `AddCharset` sert à la fois à informer le client sur le codage des caractères du document afin que ce dernier puisse être interprété et affiché correctement, et à la [[11-guides/01-generalites/negociation-de-contenu|négociation de contenu]], au cours de laquelle le serveur décide lequels parmi plusieurs documents possibles il renvoie au client en fonction des préférences de ce dernier en matière de jeu de caractères.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial. Les noms de fichiers peuvent posséder plusieurs extensions, et l'argument *extension* sera comparé à chacune d'entre elles.

## Voir aussi

- [[12-modules/mod_negotiation|mod_negotiation]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
