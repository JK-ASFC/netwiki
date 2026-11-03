---
title: "SetEnvIfNoCase"
description: "Directive Apache SetEnvIfNoCase (mod_setenvif) — Définit des variables d'environnement en fonction des attributs de la requête sans tenir compte de la casse. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_setenvif]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit des variables d'environnement en fonction des attributs de la requête sans tenir compte de la casse |
| **Syntaxe** | `SetEnvIfNoCase attribut regex [!]env-variable[=valeur] [[!]env-variable[=valeur]] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_setenvif\|mod_setenvif]] |

## Utilisation

La directive `SetEnvIfNoCase` est identique d'un point de vue sémantique à la directive [[13-directives/setenvif|SetEnvIf]], et ne s'en distingue que par le fait que la comparaison des expressions rationnelles est effectuée sans tenir compte de la casse. Par exemple :

```apache
SetEnvIfNoCase Host Example\.Org site=example
```

Cette ligne va définir la variable d'environnement `site` avec la valeur "`example`" si le champ d'en-tête de requête HTTP `Host:` est présent et contient `Example.Org`, `example.org`, ou une autre combinaison des mêmes caractères, sans tenir compte de la casse.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
