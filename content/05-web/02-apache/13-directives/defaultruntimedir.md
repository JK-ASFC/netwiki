---
title: "DefaultRuntimeDir"
description: "Directive Apache DefaultRuntimeDir (core) — Répertoire de base des fichiers créés au cours de l'exécution du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoire de base des fichiers créés au cours de l'exécution du serveur |
| **Syntaxe** | `DefaultRuntimeDir chemin-répertoire` |
| **Valeur par défaut** | `DefaultRuntimeDir DEFAULT_REL_RUNTIMEDIR (logs/)` |
| **Contexte** | configuration du serveur |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible depuis la version 2.4.2 du serveur HTTP Apache |

## Utilisation

La directive `DefaultRuntimeDir` permet de définir le répertoire dans lequel le serveur va créer les différents fichiers relatifs à son exécution (mémoire partagée, verrous, etc...). Si le chemin spécifié est relatif, le chemin absolu sera généré relativement à la valeur de la directive `ServerRoot`

**Example**

```apache
DefaultRuntimeDir scratch/
```

La valeur par défaut de la directive `DefaultRuntimeDir` peut être modifiée en changeant la valeur de la macro `DEFAULT_REL_RUNTIMEDIR` définie à la compilation.

Note: si la valeur de `ServerRoot` n'a pas été spécifiée avant d'utiliser cette directive, c'est la valeur par défaut de `ServerRoot` qui sera utilisée pour définir la base du répertoire.

## Voir aussi

- [[11-guides/06-divers/conseils-sur-la-securite|conseils à propos de sésurité]]
- `ServerRoot`

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
