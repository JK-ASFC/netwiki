---
title: "UnsetEnv"
description: "Directive Apache UnsetEnv (mod_env) — Supprime des variables de l'environnement. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_env]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Supprime des variables de l'environnement |
| **Syntaxe** | `UnsetEnv var-env [var-env] ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_env\|mod_env]] |

## Utilisation

Supprime une ou plusieurs variables d'environnement internes parmi celles qui sont transmises aux scripts CGI et aux pages SSI.

**Exemple**

```apache
UnsetEnv LD_LIBRARY_PATH
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
