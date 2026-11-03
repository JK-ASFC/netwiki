---
title: "mod_setenvif"
description: "Module Apache mod_setenvif — Permet de définir des variables d'environnement en fonction de certainescaractéristiques de la requête. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_setenvif]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet de définir des variables d'environnement en fonction de certainescaractéristiques de la requête |
| **Statut** | Base |
| **Identificateur** | `setenvif_module` |
| **Fichier source** | `mod_setenvif.c` |

## Sommaire

Le module [[12-modules/mod_setenvif|mod_setenvif]] vous permet de définir des variables d'environnement internes de manière conditionnelle en fonction de critères que vous pouvez spécifier. Ces variables d'environnement peuvent être utilisées par d'autres parties du serveur pour prendre des décisions quant aux actions à entreprendre, et pour déterminer si les scripts CGI et les pages SSI doivent pouvoir y accéder.

Les directives sont interprétées selon l'ordre dans lequel elles apparaîssent dans les fichiers de configuration. Ainsi, des séquences plus complexes peuvent être utilisées, comme dans cet exemple qui définit netscape si le navigateur est Mozilla et non MSIE.

```apache
BrowserMatch ^Mozilla netscape
BrowserMatch MSIE !netscape
```

Lorsque le serveur cherche un chemin via une sous-requête interne (par exemple la recherche d'un [[13-directives/directoryindex|DirectoryIndex]]), ou lorsqu'il génère un listing du contenu d'un répertoire via le module [[12-modules/mod_autoindex|mod_autoindex]], la sous-requête n'hérite pas des variables d'environnement spécifiques à la requête. En outre, à cause des phases de l'API auxquelles [[12-modules/mod_setenvif|mod_setenvif]] prend part, les directives [[13-directives/setenvif|SetEnvIf]] ne sont pas évaluées séparément dans la sous-requête.

Une expression rationnelle ne nécessite des guillemets que si elle contient des espaces non protégées, auquel cas les guillemets simples ou doubles sont équivalents. À la différence de [[12-modules/mod_rewrite|mod_rewrite]], [[12-modules/mod_setenvif|mod_setenvif]] supprime tous les autres anti-slashes lors de l'interprétation de l'expression ; ainsi, `\\` et `\\\` doivent être notés `\\\` et `\\\\\`, respectivement.

## Directives

- [[13-directives/browsermatch|BrowserMatch]]
- [[13-directives/browsermatchnocase|BrowserMatchNoCase]]
- [[13-directives/setenvif|SetEnvIf]]
- [[13-directives/setenvifexpr|SetEnvIfExpr]]
- [[13-directives/setenvifnocase|SetEnvIfNoCase]]

## Voir aussi

- [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Les variables d'environnement et le serveur HTTP Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
