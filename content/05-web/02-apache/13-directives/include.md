---
title: "Include"
description: "Directive Apache Include (core) — Inclut d'autres fichiers de configuration dans un des fichiers de configuration du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Inclut d'autres fichiers de configuration dans un des fichiers de configuration du serveur |
| **Syntaxe** | `Include chemin-fichier\|chemin-répertoire\|wildcard` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Utilisation des caractères génériques dans la partie chemin depuis la version 2.3.6 |

## Utilisation

Cette directive permet l'inclusion d'autres fichiers de configuration dans un des fichiers de configuration du serveur.

On peut utiliser des caractères génériques de style Shell (`fnmatch()`) aussi bien dans la partie nom de fichier du chemin que dans la partie répertoires pour inclure plusieurs fichiers en une seule fois, selon leur ordre alphabétique. De plus, si la directive `Include` pointe vers un répertoire, Apache httpd inclura tous les fichiers de ce répertoire et de tous ces sous-répertoires. L'inclusion de répertoires entiers est cependant déconseillée, car il est fréquent d'oublier des fichiers temporaires dans un répertoire, ce qui causerait une erreur [[10-commandes/httpd|httpd]] en cas d'inclusion. Pour inclure des fichiers qui correspondent à un certain modèle, comme \*.conf par exemple, nous vous recommandons d'utiliser plutôt la syntaxe avec caractères génériques comme ci-dessous.

La directive [[13-directives/include|Include]] **échouera avec un code d'erreur** si une expression contenant des caractères génériques ne correspond à aucun fichier. Pour ignorer les expressions contenant des caractères génériques ne correspondant à aucun fichier, utilisez la directive [[13-directives/includeoptional|IncludeOptional]].

Le chemin fichier spécifié peut être soit un chemin absolu, soit un chemin relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]].

Exemples :

```apache
Include /usr/local/apache2/conf/ssl.conf
Include /usr/local/apache2/conf/vhosts/*.conf
```

ou encore, avec des chemins relatifs au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]] :

```apache
Include conf/ssl.conf
Include conf/vhosts/*.conf
```

On peut aussi insérer des caractères génériques dans la partie répertoires du chemin. Dans l'exemple suivant, la directive échouera si aucun sous-répertoire de conf/vhosts ne contient au moins un fichier \*.conf :

```apache
Include conf/vhosts/*/*.conf
```

Par contre, dans l'exemple suivant, la directive sera simplement ignorée si aucun sous-répertoire de conf/vhosts ne contient au moins un fichier \*.conf :

```apache
IncludeOptional conf/vhosts/*/*.conf
```

## Voir aussi

- [[13-directives/includeoptional|IncludeOptional]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
