---
title: "CharsetDefault"
description: "Directive Apache CharsetDefault (mod_charset_lite) — Jeu de caractère vers lequel la traduction doit s'effectuer. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_charset_lite]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Jeu de caractère vers lequel la traduction doit s'effectuer |
| **Syntaxe** | `CharsetDefault jeu de caractères` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_charset_lite\|mod_charset_lite]] |

## Utilisation

La directive `CharsetDefault` permet de spécifier le jeu de caractères vers lequel le contenu situé dans le conteneur associé devra être traduit.

La valeur de l'argument *jeu de caractères* doit être un nom de jeu de caractères valide du point de vue du support des jeux de caractères dans APR. En général, cela implique qu'elle doit être reconnue par iconv.

**Exemple**

```apache
<Directory "/export/home/trawick/apacheinst/htdocs/convert">
    CharsetSourceEnc  UTF-16BE
    CharsetDefault    ISO-8859-1
</Directory>
```

> [!NOTE]
> Spécifier le même jeu de caractères pour les deux directives [[13-directives/charsetsourceenc|CharsetSourceEnc]] et [[13-directives/charsetdefault|CharsetDefault]] désactive la traduction. Le jeu de caractères ne doit pas forcément correspondre au jeu de caractères de la réponse, mais il doit être valide du point de vue du système.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
