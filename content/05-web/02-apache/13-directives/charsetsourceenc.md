---
title: "CharsetSourceEnc"
description: "Directive Apache CharsetSourceEnc (mod_charset_lite) — Jeu de caractères source des fichiers. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_charset_lite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Jeu de caractères source des fichiers |
| **Syntaxe** | `CharsetSourceEnc jeu de caractères` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_charset_lite\|mod_charset_lite]] |

## Utilisation

La directive `CharsetSourceEnc` permet de spécifier un jeu de caractères source pour les fichiers situés dans le conteneur associé.

La valeur de l'argument *jeu de caractères* doit être un nom de jeu de caractères valide du point de vue du support des jeux de caractères dans APR. En général, cela implique qu'elle doit être reconnue par iconv.

**Exemple**

```apache
<Directory "/export/home/trawick/apacheinst/htdocs/convert">
    CharsetSourceEnc  UTF-16BE
    CharsetDefault    ISO-8859-1
</Directory>
```

Les noms de jeux de caractères de cet exemple sont reconnus par le mécanisme de traduction d'iconv sous Solaris 8.

> [!NOTE]
> Spécifier le même jeu de caractères pour les deux directives [[13-directives/charsetsourceenc|CharsetSourceEnc]] et [[13-directives/charsetdefault|CharsetDefault]] désactive la traduction. Le jeu de caractères ne doit pas forcément correspondre au jeu de caractères de la réponse, mais il doit être valide du point de vue du système.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
