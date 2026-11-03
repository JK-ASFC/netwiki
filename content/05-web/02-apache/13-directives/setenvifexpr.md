---
title: "SetEnvIfExpr"
description: "Directive Apache SetEnvIfExpr (mod_setenvif) — Définit des variables d'environnement en fonction d'une expression ap_expr. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_setenvif]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des variables d'environnement en fonction d'une expression ap\_expr |
| **Syntaxe** | `SetEnvIfExpr expr [!]env-variable[=valeur] [[!]env-variable[=valeur]] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_setenvif\|mod_setenvif]] |

## Utilisation

La directive `SetEnvIfExpr` permet de définir des variables d'environnement en fonction d'une [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression]]. Cette expression est évaluée à l'exécution, et les différentes variables d'environnement *env-variable* définies de la même manière que la directive `SetEnvIf`, y compris les références arrières.

```apache
SetEnvIfExpr "tolower(req('X-Sendfile')) == 'd:\images\very_big.iso')" iso_delivered
SetEnvIfExpr "tolower(req('X-Sendfile')) =~ /(.*\.iso$)/" iso-path=$1
```

Dans cet exemple, la variable d'environnement `iso_delivered` est définie chaque fois que notre application tente de l'envoyer via `X-Sendfile`.

Il pourrait être plus utile de définir une variable rfc1918 si l'adresse IP distante est une adresse privée au sens de la RFC 1918 :

```apache
SetEnvIfExpr "-R '10.0.0.0/8' || -R '172.16.0.0/12' || -R '192.168.0.0/16'" rfc1918
```

## Voir aussi

- [[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|Les expressions dans le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
