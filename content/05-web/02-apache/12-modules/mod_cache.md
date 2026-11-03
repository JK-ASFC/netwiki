---
title: "mod_cache"
description: "Module Apache mod_cache — Filtre de mise en cache HTTP conforme à la RFC 2616. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_cache]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Filtre de mise en cache HTTP conforme à la RFC 2616 |
| **Statut** | Extension |
| **Identificateur** | `cache_module` |
| **Fichier source** | `mod_cache.c` |

## Sommaire

> [!WARNING]
> Ce module doit être utilisé avec précautions car lorsque la directive [[13-directives/cachequickhandler|CacheQuickHandler]] est définie à sa valeur par défaut **on**, les directives [[13-directives/allow|Allow]] and [[13-directives/deny|Deny]] sont court-circuitées. Vous ne devez donc pas activer la gestion rapide de la mise en cache pour un contenu auquel vous souhaitez limiter l'accès en fonction du nom d'hôte du client, de l'adresse IP ou d'une variable d'environnement.

[[12-modules/mod_cache|mod_cache]] implémente un **filtre de mise en cache de contenu HTTP** conforme à la [RFC 2616](https://www.rfc-editor.org/rfc/rfc2616), avec support de la mise en cache des réponses dont le contenu a été négocié et comportant l'en-tête Vary.

La mise en cache conforme à la RFC 2616 fournit un mécanisme permettant de vérifier si un contenu expiré ou dépassé est encore à jour, et peut apporter un gain de performances significatif si le serveur original supporte les **requêtes conditionnelles** en prenant en compte l'en-tête de requête HTTP If-None-Match ([RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)). Le contenu n'est ainsi régénéré que lorsqu'il a été modifié, et non lorsqu'il a expiré.

En tant que filtre, [[12-modules/mod_cache|mod_cache]] peut être placé en face d'un contenu issu de tout gestionnaire, y compris **des fichiers à accès séquentiel** (servis depuis un disque lent mis en cache sur un gros disque), la sortie d'un **script CGI** ou d'un **générateur de contenu dynamique**, ou du contenu **mandaté depuis un autre serveur**.

Dans la configuration par défaut, [[12-modules/mod_cache|mod_cache]] place le filtre de mise en cache aussi loin que possible dans la pile de filtres, utilisant le **gestionnaire rapide** pour court-circuiter tout traitement par requête lors de l'envoi du contenu au client. Dans ce mode opératoire, [[12-modules/mod_cache|mod_cache]] peut être considéré comme un serveur mandataire avec cache fixé en tête du serveur web, alors qu'il s'exécute dans ce même serveur web.

Lorsque le gestionnaire rapide est désactivé via la directive [[13-directives/cachequickhandler|CacheQuickHandler]], il devient possible d'insérer le filtre **CACHE** à un point de la pile de filtres choisi par l'administrateur. Ceci permet de mettre en cache un contenu avant que celui-ci ne soit personnalisé par le filtre [[12-modules/mod_include|mod_include]], ou éventuellement compressé par le filtre [[12-modules/mod_deflate|mod_deflate]].

Dans le mode de fonctionnement normal, [[12-modules/mod_cache|mod_cache]] peut être contrôlé par les en-têtes Cache-Control ([RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)) et Pragma ([RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)) envoyés par un client dans une requête, ou par un serveur dans une réponse. Dans des circonstances exceptionnelles, [[12-modules/mod_cache|mod_cache]] peut cependant être configuré pour outrepasser ces en-têtes et forcer un comportement spécifique au site, bien qu'un tel comportement sera limité à ce cache seulement, et n'affectera pas les opérations des autres caches qui peuvent s'insérer entre le client et le serveur, et ce type de configuration ne doit donc être utiliser qu'en cas de nécessité absolue.

La RFC 2616 permet au cache de renvoyer des données périmées pendant que l'entrée périmée correspondante est mise à jour depuis le serveur original, et [[12-modules/mod_cache|mod_cache]] supporte cette fonctionnalité lorsque la directive [[13-directives/cachelock|CacheLock]] est configurée en conséquence. De telles réponses comportent un en-tête HTTP Warning ([RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)) contenant un code de réponse 110. La RFC 2616 permet aussi au cache de renvoyer des données périmées lorsque la tentative de mise à jour des données périmées renvoie une erreur 500 ou supérieure, et cette fonctionnalité est supportée par défaut par [[12-modules/mod_cache|mod_cache]]. De telles réponses comportent un en-tête HTTP Warning ([RFC 2616](https://www.rfc-editor.org/rfc/rfc2616)) contenant un code de réponse 111.

[[12-modules/mod_cache|mod_cache]] requiert les services d'un ou plusieurs modules de gestion de stockage. La distribution Apache de base inclut les modules de gestion de stockage suivants :

**[[12-modules/mod_cache_disk|mod_cache_disk]]**

implémente un gestionnaire de stockage sur disque. Les en-têtes et corps sont stockés séparément sur le disque dans une structure de répertoires basée sur le condensé md5 de l'URL mise en cache. Plusieurs réponses à contenu négocié peuvent être stockées en même temps, mais la mise en cache de contenus partiels n'est pas supportée par ce module. L'utilitaire [[10-commandes/htcacheclean|htcacheclean]] permet de lister et de supprimer les URLs mises en cache, et de maintenir le cache en deçà de certaines limites de taille et de nombre d'inodes.

**[[12-modules/mod_cache_socache|mod_cache_socache]]**

Implémente un gestionnaire de stockage basé sur un cache d'objets partagés. Les en-têtes et corps sont stockés ensemble sous une seule clé basée sur l'URL de la réponse mise en cache. Des réponses à contenus multiples négociés peuvent être stockées simultanément, mais ce module ne supporte pas la mise en cache de contenus partiels.

Pour de plus amples détails, une description, et des exemples, reportez-vous au [[11-guides/01-generalites/guide-de-la-mise-en-cache|Guide de la mise en cache]].

## Modules apparentés et directives

- [[12-modules/mod_cache_socache|mod_cache_socache]]
- [[13-directives/cacheroot|CacheRoot]]
- [[13-directives/cachedirlevels|CacheDirLevels]]
- [[13-directives/cachedirlength|CacheDirLength]]
- [[13-directives/cacheminfilesize|CacheMinFileSize]]
- [[13-directives/cachemaxfilesize|CacheMaxFileSize]]
- [[13-directives/cachesocache|CacheSocache]]
- [[13-directives/cachesocachemaxtime|CacheSocacheMaxTime]]
- [[13-directives/cachesocachemintime|CacheSocacheMinTime]]
- [[13-directives/cachesocachemaxsize|CacheSocacheMaxSize]]
- [[13-directives/cachesocachereadsize|CacheSocacheReadSize]]
- [[13-directives/cachesocachereadtime|CacheSocacheReadTime]]

## Exemple de configuration

**Extrait de httpd.conf**

```apache
#
# Exemple de configuration du cache
#
LoadModule cache_module modules/mod_cache.so
<IfModule mod_cache.c>
    LoadModule cache_disk_module modules/mod_cache_disk.so
    <IfModule mod_cache_disk.c>
        CacheRoot "c:/cacheroot"
        CacheEnable disk  "/"
        CacheDirLevels 5
        CacheDirLength 3
    </IfModule>

    # Lorsqu'on sert de mandataire, on ne met pas en cache la liste
# des mises à jour de sécurité
    CacheDisable "http://security.update.server/update-list/"
</IfModule>
```

## Eviter une tempête de requête

Lorsqu'une entrée du cache est périmée, [[12-modules/mod_cache|mod_cache]] soumet une requête conditionnelle au processus d'arrière-plan, qui est censé confirmer la validité de l'entrée du cache, ou dans la négative envoyer une entrée mise à jour.

Un court mais non négligeable laps de temps existe entre le moment où l'entrée du cache est périmée, et le moment où elle est mise à jour. Sur un serveur fortement chargé, un certain nombre de requêtes peut arriver pendant ce laps de temps, et provoquer une **tempête** de requêtes susceptibles de saturer le processus d'arrière-plan de manière soudaine et imprédictible.

Pour contenir cette tempête, on peut utiliser la directive [[13-directives/cachelock|CacheLock]] afin de définir un répertoire où seront créés **à la volée** des verrous pour les URLs. Ces verrous sont utilisés comme autant d'**indications** par les autres requêtes, soit pour empêcher une tentative de mise en cache (un autre processus est en train de récupérer l'entité), soit pour indiquer qu'une entrée périmée est en cours de mise à jour (pendant ce temps, c'est le contenu périmé qui sera renvoyé).

### Mise en cache initiale d'une entrée

Lorsqu'une entité est mise en cache pour la première fois, un verrou est créé pour cette entité jusqu'à ce que la réponse ait été entièrement mise en cache. Pendant la durée de vie du verrou, le cache va empêcher une seconde tentative de mise en cache de la même entité. Bien que cela ne suffise pas à contenir la tempête de requêtes, toute tentative de mettre en cache la même entité plusieurs fois simultanément est stoppée.

### Mise à jour d'une entrée périmée

Lorsqu'une entrée atteint la limite de sa durée de vie, et devient par conséquent périmée, un verrou est créé pour cette entité jusqu'à ce que la réponse ait été soit confirmée comme encore valide, soit remplacée par le processus d'arrière-plan. Pendant la durée de vie du verrou, une seconde requête entrante va provoquer le renvoi de la donnée périmée, et la tempête de requêtes sera contenue.

### Verrous et en-tête Cache-Control: no-cache

Les verrous ne sont utilisés **qu'à titre indicatif** pour enjoindre le cache à être plus coopératif avec les serveurs d'arrière-plan, et il est possible de passer outre si nécessaire. Si le client envoie une requête contenant un en-tête Cache-Control imposant un nouveau téléchargement de l'entité, tout verrou éventuel sera ignoré, la requête du client sera honorée immédiatement, et l'entrée du cache mise à jour.

Comme mécanisme de sécurité supplémentaire, la durée de vie maximale des verrous est configurable. Lorsque cette limite est atteinte, le verrou est supprimé et une autre requête peut alors en créer un nouveau. Cette durée de vie peut être définie via la directive [[13-directives/cachemaxexpire|CacheMaxExpire]], et sa valeur par défaut est de 5 secondes.

### Exemple de configuration

**Activation du verrouillage du cache**

```apache
#
# Active le verrouillage du cache
#
<IfModule mod_cache.c>
    CacheLock on
    CacheLockPath "/tmp/mod_cache-lock"
    CacheLockMaxAge 5
</IfModule>
```

## Contrôle fin via le filtre CACHE

Dans son mode de fonctionnement par défaut, le cache s'exécute sous la forme d'un gestionnaire rapide, court-circuitant la majorité des traitements du serveur et fournissant ainsi une mise en cache possédant les plus hautes performances disponibles.

Dans ce mode, le cache **s'incruste** devant le serveur, comme si un mandataire de mise en cache indépendant RFC 2616 était placé devant ce dernier.

Bien que que ce mode offre les meilleures performances, les administrateurs peuvent souhaiter, dans certaines circonstances, effectuer des traitements sur la requête après que cette dernière ait été mise en cache, comme ajouter du contenu personnalisé à la page mise en cache, ou appliquer des restrictions d'autorisations au contenu. Pour y parvenir, l'administrateur sera alors souvent forcé de placer des serveurs mandataires inverses indépendants soit derrière, soit devant le serveur de mise en cache.

Pour résoudre ce problème, la directive [[13-directives/cachequickhandler|CacheQuickHandler]] peut être définie à **off**, afin que le serveur traite toutes les phases normalement exécutées par une requête non mise en cache, y compris les phases **d'authentification et d'autorisation**.

En outre, l'administrateur peut éventuellement spécifier le **point précis dans la chaîne de filtrage** où devra intervenir la mise en cache en ajoutant le filtre **CACHE** à la chaîne de filtrage en sortie.

Par exemple, pour mettre en cache le contenu avant d'appliquer une compression à la réponse, placez le filtre **CACHE** avant le filtre **DEFLATE** comme dans l'exemple suivant :

```apache
# Mise en cache du contenu avant la compression optionnelle
CacheQuickHandler off
AddOutputFilterByType CACHE;DEFLATE text/plain
```

Une autre possibilité consiste à mettre en cache le contenu avant l'ajout de contenu personnalisé via [[12-modules/mod_include|mod_include]] (ou tout autre filtre de traitement de contenu). Dans l'exemple suivant, les modèles contenant des balises comprises par [[12-modules/mod_include|mod_include]] sont mis en cache avant d'être interprétés :

```apache
# Mise en cache du contenu avant l'intervention de mod_include et
   # mod_deflate
CacheQuickHandler off
AddOutputFilterByType CACHE;INCLUDES;DEFLATE text/html
```

Vous pouvez insérer le filtre **CACHE** en tout point de la chaîne de filtrage. Dans l'exemple suivant, le contenu est mis en cache après avoir été interprété par [[12-modules/mod_include|mod_include]], mais avant d'être traité par [[12-modules/mod_deflate|mod_deflate]] :

```apache
# Mise en cache du contenu entre les interventions de mod_include et
   # mod_deflate
CacheQuickHandler off
AddOutputFilterByType INCLUDES;CACHE;DEFLATE text/html
```

> [!WARNING]
> **Avertissement :**
>
> Si pour une raison ou pour une autre, le point d'insertion du filtre **CACHE** dans la chaîne de filtrage est modifié, vous devez **vider votre cache** pour être sûr que les données servies soient à jour. En effet, [[12-modules/mod_cache|mod_cache]] n'est pas en mesure d'effectuer cette opération à votre place.

## Etat du cache et journalisation

Lorsque [[12-modules/mod_cache|mod_cache]] a décidé s'il devait ou non servir une entité depuis le cache, les raisons précises de cette décision sont enregistrées dans l'environnement du sous-processus interne à la requête sous la clé **cache-status**. Cette information peut être journalisée via la directive [[13-directives/logformat|LogFormat]] comme suit :

```apache
LogFormat "%{cache-status}e ..."
```

En fonction de la décision prise, l'information est aussi écrite dans l'environnement du sous-processus sous une des quatre clés suivantes :

**cache-hit**

Le contenu a été servi depuis le cache.

**cache-revalidate**

Le contenu du cache était périmé, a été mis à jour avec succès, puis servi depuis le cache.

**cache-miss**

Le contenu n'était pas dans le cache et a été servi directement depuis le serveur demandé.

**cache-invalidate**

L'entité du cache est devenue invalide suite à une requête d'un type autre que GET ou HEAD.

Il est alors possible d'envisager une journalisation conditionnelle du traitement des requêtes par rapport au cache comme dans l'exemple suivant :

```apache
CustomLog "cached-requests.log" common env=cache-hit
CustomLog "uncached-requests.log" common env=cache-miss
CustomLog "revalidated-requests.log" common env=cache-revalidate
CustomLog "invalidated-requests.log" common env=cache-invalidate
```

Pour les concepteurs de modules, une accroche (hook) nommée *cache\_status* est disponible et permet aux modules de répondre aux résultats de la vérification du cache ci-dessus de manière personnalisée.

## Directives

- [[13-directives/cacheenable|CacheEnable]]
- [[13-directives/cachedisable|CacheDisable]]
- [[13-directives/cachemaxexpire|CacheMaxExpire]]
- [[13-directives/cacheminexpire|CacheMinExpire]]
- [[13-directives/cachedefaultexpire|CacheDefaultExpire]]
- [[13-directives/cacheignorenolastmod|CacheIgnoreNoLastMod]]
- [[13-directives/cacheignorecachecontrol|CacheIgnoreCacheControl]]
- [[13-directives/cacheignorequerystring|CacheIgnoreQueryString]]
- [[13-directives/cachelastmodifiedfactor|CacheLastModifiedFactor]]
- [[13-directives/cacheignoreheaders|CacheIgnoreHeaders]]
- [[13-directives/cacheignoreurlsessionidentifiers|CacheIgnoreURLSessionIdentifiers]]
- [[13-directives/cachestoreexpired|CacheStoreExpired]]
- [[13-directives/cachestoreprivate|CacheStorePrivate]]
- [[13-directives/cachestorenostore|CacheStoreNoStore]]
- [[13-directives/cachelock|CacheLock]]
- [[13-directives/cachelockpath|CacheLockPath]]
- [[13-directives/cachelockmaxage|CacheLockMaxAge]]
- [[13-directives/cachequickhandler|CacheQuickHandler]]
- [[13-directives/cacheheader|CacheHeader]]
- [[13-directives/cachedetailheader|CacheDetailHeader]]
- [[13-directives/cachekeybaseurl|CacheKeyBaseURL]]
- [[13-directives/cachestaleonerror|CacheStaleOnError]]

## Voir aussi

- [[11-guides/01-generalites/guide-de-la-mise-en-cache|Guide de la mise en cache]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
