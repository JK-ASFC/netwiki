---
title: "BrowserMatch"
description: "Directive Apache BrowserMatch (mod_setenvif) — Définit des variables d'environnement en fonction du contenu de l'en-tête HTTP User-Agent. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_setenvif]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des variables d'environnement en fonction du contenu de l'en-tête HTTP User-Agent |
| **Syntaxe** | `BrowserMatch regex [!]env-variable[=valeur] [[!]env-variable[=valeur]] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_setenvif\|mod_setenvif]] |

## Utilisation

La directive `BrowserMatch` est un cas particulier de la directive [[13-directives/setenvif|SetEnvIf]], qui définit des variables d'environnement en fonction du contenu de l'en-tête de requête HTTP `User-Agent`. Les deux lignes suivantes produisent le même effet :

```apache
BrowserMatch Robot is_a_robot
SetEnvIf User-Agent Robot is_a_robot
```

Quelques exemples supplémentaires :

```apache
BrowserMatch ^Mozilla forms jpeg=yes browser=netscape
BrowserMatch "^Mozilla/[2-3]" tables agif frames javascript
BrowserMatch MSIE !javascript
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
