---
title: "BrowserMatchNoCase"
description: "Directive Apache BrowserMatchNoCase (mod_setenvif) — Définit des variables d'environnement en fonction du contenu de l'en-tête HTTP User-Agent sans tenir compte de la casse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_setenvif]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des variables d'environnement en fonction du contenu de l'en-tête HTTP User-Agent sans tenir compte de la casse |
| **Syntaxe** | `BrowserMatchNoCase regex [!]env-variable[=valeur] [[!]env-variable[=valeur]] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_setenvif\|mod_setenvif]] |

## Utilisation

La directive `BrowserMatchNoCase` est identique sur le plan sémantique à la directive [[13-directives/browsermatch|BrowserMatch]]. Elle permet cependant une comparaison insensible à la casse. Par exemple :

```apache
BrowserMatchNoCase mac platform=macintosh
BrowserMatchNoCase win platform=windows
```

Les directives `BrowserMatch` et `BrowserMatchNoCase` sont des cas particuliers des directives [[13-directives/setenvif|SetEnvIf]] et [[13-directives/setenvifnocase|SetEnvIfNoCase]]. Ainsi, les deux lignes suivantes produisent le même effet :

```apache
BrowserMatchNoCase Robot is_a_robot
SetEnvIfNoCase User-Agent Robot is_a_robot
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
