---
title: "AccessFileName"
description: "Directive Apache AccessFileName (core) — Nom du fichier de configuration distribué. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom du fichier de configuration distribué |
| **Syntaxe** | `AccessFileName nom-du-fichier [nom-du-fichier] ...` |
| **Valeur par défaut** | `AccessFileName .htaccess` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive AccessFileName permet de modifier le nom du fichier qui sera pris en compte pour les outrepassements de configuration au niveau du répertoire, si la directive [[13-directives/allowoverride|AllowOverride]] est activée pour le répertoire considéré.

> [!WARNING]
> Nous vous déconseillons de modifier cette valeur et en particulier de fournir une liste de plusieurs fichiers possibles, car cela rendrait plus difficile la recherche d’erreurs pour quelqu’un qui n’est pas familier avec votre configuration locale.

Lors du traitement d’une requête, le serveur cherche les fichiers dont le nom (ou les noms) sont définis à l’aide de la directive `AccessFileName` dans tous les répertoires du chemin du document, si les fichiers de configuration distribués sont autorisés pour ce répertoire. Par exemple, avant de renvoyer le document `/usr/local/web/index.html`, le serveur va rechercher des directives dans les fichiers `/.htaccess`, `/usr/.htaccess`, `/usr/local/.htaccess` et `/usr/local/web/.htaccess`.

C’est pour cette raison que le fichier de configuration par défaut contient les instructions suivantes :

```apache
<Directory "/">
    AllowOverride None
</Directory>
```

Ce bloc de configuration permet de prévenir tout accès non nécessaire à des fichiers dans des répertoires en dehors de votre racine des documents [[13-directives/documentroot|DocumentRoot]]. Voir aussi la note à ce sujet dans la documentation de la directive `AllowOverride`.

## Voir aussi

- [[13-directives/allowoverride|AllowOverride]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
