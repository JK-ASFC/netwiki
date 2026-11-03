---
title: "LimitInternalRecursion"
description: "Directive Apache LimitInternalRecursion (core) — Détermine le nombre maximal de redirections internes et de sous-requêtes imbriquées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Détermine le nombre maximal de redirections internes et de sous-requêtes imbriquées |
| **Syntaxe** | `LimitInternalRecursion nombre [nombre]` |
| **Valeur par défaut** | `LimitInternalRecursion 10` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Une redirection interne survient, par exemple, quand on utilise la directive [[13-directives/action|Action]] qui redirige en interne la requête d'origine vers un script CGI. Une sous-requête est le mécanisme qu'utilise Apache httpd pour déterminer ce qui se passerait pour un URI s'il faisait l'objet d'une requête. Par exemple, [[12-modules/mod_dir|mod_dir]] utilise les sous-requêtes pour rechercher les fichiers listés dans la directive [[13-directives/directoryindex|DirectoryIndex]].

La directive `LimitInternalRecursion` permet d'éviter un crash du serveur dû à un bouclage infini de redirections internes ou de sous-requêtes. De tels bouclages sont dus en général à des erreurs de configuration.

La directive accepte, comme arguments, deux limites qui sont évaluées à chaque requête. Le premier *nombre* est le nombre maximum de redirections internes qui peuvent se succéder. Le second *nombre* détermine la profondeur d'imbrication maximum des sous-requêtes. Si vous ne spécifiez qu'un seul *nombre*, il sera affecté aux deux limites.

```apache
LimitInternalRecursion 5
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
