---
title: "CacheEnable"
description: "Directive Apache CacheEnable (mod_cache) — Active la mise en cache des URLs spécifiées en utilisant le gestionnaire de stockage précisé. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cache]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la mise en cache des URLs spécifiées en utilisant le gestionnaire de stockage précisé |
| **Syntaxe** | `CacheEnable type de cache [chaîne URL]` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_cache\|mod_cache]] |
| **Compatibilité** | Une chaîne URL telle que '/' s'appliquait à tout contenu en mandat direct dans les versions 2.2 et antérieures. |

## Utilisation

La directive `CacheEnable` enjoint [[12-modules/mod_cache|mod_cache]] de mettre en cache l'URL précisée par *chaîne URL*, ainsi que les URLs de niveaux inférieurs. Le gestionnaire de stockage du cache est spécifié à l'aide de l'argument *type de cache*. La directive `CacheEnable` peut être placée à l'intérieur d'une section [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]] pour indiquer que le contenu considéré peut être mis en cache. Si *type de cache* a pour valeur `disk`, [[12-modules/mod_cache|mod_cache]] utilisera le gestionnaire de stockage sur disque implémenté par [[12-modules/mod_cache_disk|mod_cache_disk]]. Pour que [[12-modules/mod_cache|mod_cache]] utilise le gestionnaire de stockage basé sur le cache d'objets partagés implémenté par [[12-modules/mod_cache_socache|mod_cache_socache]], spécifiez `socache` comme valeur du paramètre *type de cache*.

Si les différentes directives `CacheEnable` spécifient des URLs qui se recoupent (comme dans l'exemple ci-dessous), tous les gestionnaires de stockage possibles seront lancés, jusqu'au premier d'entre eux qui traitera effectivement la requête. L'ordre dans lequel les gestionnaires de stockage sont lancés est déterminé par l'ordre dans lequel apparaissent les directives `CacheEnable` dans le fichier de configuration. Les directives `CacheEnable` situées à l'intérieur de sections [[13-directives/location|<Location>]] ou [[13-directives/locationmatch|<LocationMatch>]] sont traitées avant les directives `CacheEnable` définies au niveau global.

En fonctionnement du type serveur mandataire direct, *chaîne URL* doit au moins débuter par un protocole pour lequel la mise en cache doit être activée.

```apache
# Mise en cache de contenu (gestionnaire normal seulement)
CacheQuickHandler off
<Location "/foo">
    CacheEnable disk
</Location>

# Mise en cache via une expression rationnelle (gestionnaire normal seulement)
CacheQuickHandler off
<LocationMatch "foo$">
    CacheEnable disk
</LocationMatch>

# Mise en cache de tous les contenus, à l'exception des URLs
# mandatées en direct (gestionnaire normal ou rapide)
CacheEnable  disk  /

# Mise en cache des URLs FTP mandatées (gestionnaire normal ou rapide)
CacheEnable  disk  ftp://

# Mise en cache des contenus mandatés en direct depuis www.example.org (gestionnaire normal ou rapide)
CacheEnable  disk  http://www.example.org/
```

Un nom d'hôte commençant par un caractère **"\*"** correspondra à tout nom d'hôte se terminant par le suffixe considéré. Un nom d'hôte commençant par un caractère **"."** correspondra à tout nom d'hôte contenant le composant de nom de domaine qui suit ce caractère.

```apache
# Correspond à www.example.org et fooexample.org
CacheEnable  disk  "http://*example.org/"
# Correspond à www.example.org, mais pas à fooexample.org
CacheEnable  disk  "http://.example.org/"
```

Depuis la version 2.2.12, on peut définir la variable d'environnement `no-cache` pour une définition plus fine des ressources à mettre en cache.

## Voir aussi

- [[11-guides/01-generalites/apache-httpd-et-les-variables-d-environnement|Les variables d'environnement dans Apache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
