---
title: "mod_charset_lite"
description: "Module Apache mod_charset_lite — Spécifie dans quel jeu de caractère doivent s'effectuer les traductions ou les réencodages. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_charset_lite]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Spécifie dans quel jeu de caractère doivent s'effectuer les traductions ou les réencodages |
| **Statut** | Extension |
| **Identificateur** | `charset_lite_module` |
| **Fichier source** | `mod_charset_lite.c` |

## Sommaire

Le module [[12-modules/mod_charset_lite|mod_charset_lite]] permet au serveur de modifier le jeu de caractères des réponses avant de les envoyer aux clients. Dans un environnement EBCDIC, Apache traduit toujours les contenus au protocole HTTP (par exemples les en-têtes de réponses) de la page de code de la locale du processus Apache vers ISO-8859-1, mais pas le corps des réponses. Dans tous les environnements, on peut utiliser [[12-modules/mod_charset_lite|mod_charset_lite]] pour spécifier que les corps des réponses doivent être traduits. Par exemple, si les fichiers sont stockés sous forme EBCDIC, [[12-modules/mod_charset_lite|mod_charset_lite]] pourra les traduire en ISO-8859-1 avant de les envoyer au client.

Ce module fournit quelques procédés de configuration implémentés par Apache version russe, ainsi que son module `mod_charset` associé.

## Problèmes courants

### Noms de jeux de caractères non valides

Les noms des jeux de caractères passés en paramètres aux directives [[13-directives/charsetsourceenc|CharsetSourceEnc]] et [[13-directives/charsetdefault|CharsetDefault]] doivent être reconnus par le mécanisme de traduction utilisé par APR sur le système où [[12-modules/mod_charset_lite|mod_charset_lite]] est utilisé. Ces noms de jeux de caractères ne sont pas standardisés, et sont en général différents des valeurs qui leur correspondent dans les en-têtes HTTP. Actuellement, APR ne peut utiliser que iconv(3) ; vous pouvez donc tester facilement vos noms de jeux de caractères en utilisant le programme iconv(1), de la manière suivante :

```
iconv -f valeur-charsetsourceenc -t valeur-charsetdefault
```

### Incompatibilité entre le jeu de caractères du contenu et les règles de traduction

Si les règles de traduction ne peuvent s'appliquer au contenu, la traduction peut échouer avec des conséquences diverses, comme :

- Le mécanisme de traduction peut renvoyer un mauvais code de retour, et la connexion sera interrompue.
- Le mécanisme de traduction peut insérer silencieusement des caractères spéciaux (par exemple des points d'interrogation) dans le tampon de sortie lorsqu'il n'est pas en mesure de traduire le tampon d'entrée.

## Directives

- [[13-directives/charsetsourceenc|CharsetSourceEnc]]
- [[13-directives/charsetdefault|CharsetDefault]]
- [[13-directives/charsetoptions|CharsetOptions]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
