---
title: "DocumentRoot"
description: "Directive Apache DocumentRoot (core) — Racine principale de l'arborescence des documents visible depuis Internet. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Racine principale de l'arborescence des documents visible depuis Internet |
| **Syntaxe** | `DocumentRoot chemin répertoire` |
| **Valeur par défaut** | `DocumentRoot "/usr/local/apache/htdocs"` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive permet de définir le répertoire à partir duquel [[10-commandes/httpd|httpd]] va servir les fichiers. S'il ne correspond pas à un [[13-directives/alias|Alias]], le chemin de l'URL sera ajouté par le serveur à la racine des documents afin de construire le chemin du document recherché. Exemple :

```apache
DocumentRoot "/usr/web"
```

un accès à `http://my.example.com/index.html` se réfère alors à `/usr/web/index.html`. Si *chemin répertoire* n'est pas un chemin absolu, il est considéré comme relatif au chemin défini par la directive [[13-directives/serverroot|ServerRoot]].

Le répertoire défini par la directive `DocumentRoot` ne doit pas comporter de slash final.

## Voir aussi

- [[11-guides/01-generalites/mise-en-correspondance-des-urls-avec-le-systeme-de-fichiers|Mise en correspondance des URLs avec le système de fichiers]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
