---
title: "CacheDisable"
description: "Directive Apache CacheDisable (mod_cache) — Désactive la mise en cache des URLs spécifiées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Désactive la mise en cache des URLs spécifiées |
| **Syntaxe** | `CacheDisable chaîne-url \| on` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |

## Utilisation

> [!NOTE]
> Cette directive n’est valable que dans les sections [[13-directives/location|<Location>]] et [[13-directives/proxy|<Proxy>]] dans des contextes de répertoire. Elle ne l’est pas dans les sections [[13-directives/directory|<Directory>]], [[13-directives/files|<Files>]] ou [[13-directives/if|<If>]].

La directive `CacheDisable` enjoint [[12-modules/mod_cache|mod_cache]] de *ne pas* mettre en cache l'URL spécifiée par *chaîne URL*, ainsi que les URLs de niveaux inférieurs.

**Exemple**

```apache
CacheDisable "/fichiers_locaux"
```

Si la directive se trouve à l'intérieur d'une section [[13-directives/location|<Location>]], le chemin doit être spécifié en dessous de la Location, et si le mot "on" est utilisé, la mise en cache sera désactivée pour l'ensemble de l'arborescence concernée par la section Location.

**Exemple**

```apache
<Location "/foo">
    CacheDisable on
</Location>
```

Avec les versions 2.2.12 et ultérieures, on peut définir la variable d'environnement `no-cache` pour une définition plus fine des ressources à mettre en cache.

## Voir aussi

- [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Les variables d'environnement dans Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
