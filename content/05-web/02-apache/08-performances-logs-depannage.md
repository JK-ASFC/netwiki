---
title: Performances, journaux et dépannage
description: Dimensionner le MPM event, keep-alive, compression (deflate, brotli), cache navigateur (mod_expires), cache serveur, journaux (formats, rotation, envoi syslog), mod_status, commandes apachectl et table des erreurs AH fréquentes.
tags: [apache, performance, mpm, compression, logs, mod_status, dépannage]
icon: gauge
---

## Dimensionner le MPM event

```apache /etc/apache2/mods-available/mpm_event.conf
<IfModule mpm_event_module>
    StartServers             4
    ServerLimit              16
    ThreadsPerChild          64
    MaxRequestWorkers        1024     # ≤ ServerLimit × ThreadsPerChild
    MinSpareThreads          64
    MaxSpareThreads          256
    MaxConnectionsPerChild   0
    AsyncRequestWorkerFactor 2
</IfModule>
```

| Paramètre | Rôle |
| --- | --- |
| `MaxRequestWorkers` | Nombre maximal de requêtes traitées simultanément (au-delà : file d'attente) |
| `ThreadsPerChild` × `ServerLimit` | Plafond de threads |
| `MaxConnectionsPerChild` | Recycler un processus après N connexions (0 = jamais ; utile en cas de fuite mémoire) |
| `AsyncRequestWorkerFactor` | Connexions keep-alive/asynchrones gérables en plus des workers |

Signal de saturation dans `error.log` : `AH00484: server reached MaxRequestWorkers setting`.

> [!TIP]
> Avec PHP-FPM ou un reverse proxy, Apache consomme peu de mémoire par thread : on peut monter haut en `MaxRequestWorkers`. Le vrai goulot devient le **pool FPM** ou le **backend**.

### Keep-alive

```apache
KeepAlive On
MaxKeepAliveRequests 500
KeepAliveTimeout 5           # quelques secondes suffisent ; trop long bloque des workers (prefork/worker)
```

## Compression

```bash
sudo a2enmod deflate brotli
```

```apache
<IfModule mod_brotli.c>
    AddOutputFilterByType BROTLI_COMPRESS text/html text/plain text/css text/xml application/javascript application/json image/svg+xml
    BrotliCompressionQuality 5
</IfModule>
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml application/javascript application/json image/svg+xml
    DeflateCompressionLevel 6
</IfModule>
```

Apache choisit Brotli si le navigateur l'accepte (`Accept-Encoding: br`), sinon gzip.

## Cache navigateur

```bash
sudo a2enmod expires headers
```

```apache
ExpiresActive On
ExpiresDefault "access plus 1 hour"
ExpiresByType image/png "access plus 1 month"
ExpiresByType image/webp "access plus 1 month"
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
ExpiresByType font/woff2 "access plus 1 year"

<FilesMatch "\.(css|js|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"     # fichiers versionnés (app.3f2a.js)
</FilesMatch>
<Files "index.html">
    Header set Cache-Control "no-cache"
</Files>
```

## Cache serveur (mod_cache)

```bash
sudo a2enmod cache cache_disk
sudo systemctl enable --now apache-htcacheclean    # nettoyage du cache disque (Debian)
```

```apache
CacheQuickHandler on
CacheEnable disk /
CacheRoot /var/cache/apache2/mod_cache_disk
CacheDirLevels 2
CacheDirLength 1
CacheMaxFileSize 10000000
CacheIgnoreNoLastMod On
CacheLock on
```

## Journaux

```apache
# Format avec durée (µs), vhost et IP réelle
LogFormat "%v %a %l %u %t \"%r\" %>s %O \"%{Referer}i\" \"%{User-Agent}i\" %D" vhost_perf
CustomLog ${APACHE_LOG_DIR}/access.log vhost_perf

# Format JSON pour un SIEM / ELK
LogFormat "{ \"time\":\"%{%Y-%m-%dT%H:%M:%S%z}t\", \"vhost\":\"%v\", \"client\":\"%a\", \"method\":\"%m\", \"uri\":\"%U%q\", \"status\":%>s, \"bytes\":%O, \"duration_us\":%D, \"ua\":\"%{User-Agent}i\" }" json
CustomLog ${APACHE_LOG_DIR}/access.json json

# Ne pas journaliser les sondes de supervision
SetEnvIf Request_URI "^/health$" nolog
CustomLog ${APACHE_LOG_DIR}/access.log vhost_perf env=!nolog

# Niveau du journal d'erreurs, par module
LogLevel warn ssl:warn proxy:info
```

- Rotation : `logrotate` (`/etc/logrotate.d/apache2`) avec `reload` gracieux ; ou `rotatelogs` intégré : `CustomLog "|/usr/bin/rotatelogs -l /var/log/apache2/access.%Y%m%d.log 86400" combined`.
- Envoi à syslog : `ErrorLog syslog:local1` et `CustomLog "|/usr/bin/logger -t apache -p local1.info" combined`.

## mod_status

```apache
<Location /server-status>
    SetHandler server-status
    Require ip 127.0.0.1 10.0.10.0/24
</Location>
ExtendedStatus On
```

```bash
curl -s http://127.0.0.1/server-status?auto
# Total Accesses, BusyWorkers, IdleWorkers, ReqPerSec, Scoreboard (_ = libre, W = envoi, K = keep-alive, R = lecture)
```

Utilisé par les sondes de supervision ([[01-centreon/05-supervision-agents|Centreon]] : `apps::apache::serverstatus::plugin`, Prometheus `apache_exporter`).

## Commandes utiles

| Commande | Usage |
| --- | --- |
| `apachectl configtest` (`-t`) | Vérifier la syntaxe |
| `apachectl -S` | Virtual hosts, ports, vhost par défaut, fichiers d'origine |
| `apachectl -M` | Modules chargés |
| `apachectl -V` | Version, MPM, options de compilation |
| `apachectl -t -D DUMP_INCLUDES` | Fichiers inclus |
| `apachectl -t -D DUMP_RUN_CFG` | Utilisateur, répertoires d'exécution |
| `apachectl graceful` | Rechargement sans coupure |
| `apachectl graceful-stop` | Arrêt après les requêtes en cours |
| `httpd -X` | Démarrer au premier plan, un seul processus (débogage) |

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `AH00558: Could not reliably determine the server's fully qualified domain name` | `ServerName` global absent | Ajouter `ServerName` dans la configuration principale |
| `(98)Address already in use: AH00072: make_sock: could not bind to address [::]:80` | Port occupé (Nginx, autre Apache) | `ss -tlnp 'sport = :80'` |
| `AH01630: client denied by server configuration` | `Require` refuse l'accès | Vérifier `<Directory>`, l'ordre et les `Require` |
| `AH00037: Symbolic link not allowed or link target not accessible` | `FollowSymLinks` absent ou droits sur la cible | Options, propriétaire, SELinux |
| `AH01276: Cannot serve directory …: No matching DirectoryIndex` | Pas de document par défaut et `-Indexes` | `DirectoryIndex` |
| `(13)Permission denied: … access to / denied` | Droits Unix (bit `x` sur les dossiers parents) ou SELinux | `namei -l /chemin/fichier`, `ls -Z` |
| `AH00124: Request exceeded the limit of 10 internal redirects` | Boucle de réécriture | `LogLevel rewrite:trace3` |
| `AH00484: server reached MaxRequestWorkers setting` | Saturation | Augmenter, ou trouver la cause des lenteurs (backend) |
| `AH01797: client denied by server configuration` | Ancienne syntaxe `Order/Deny` (mod_access_compat) | Migrer vers `Require` |
| `Invalid command 'RewriteEngine'` / `'SSLEngine'` / `'ProxyPass'` | Module non chargé | `a2enmod rewrite` / `ssl` / `proxy_http` |
| `500 Internal Server Error` sans détail | Erreur dans `.htaccess` ou application | `error.log` du vhost |

### Méthode

1. `apachectl configtest` puis `apachectl -S` : la requête arrive-t-elle sur le bon vhost ?
2. `curl -v -H "Host: intranet.exemple.fr" http://127.0.0.1/` depuis le serveur (élimine DNS et pare-feu).
3. Journal d'erreurs du vhost, avec `LogLevel debug` temporaire sur le module concerné.
4. Droits fichiers (`namei -l`), SELinux/AppArmor.
5. Backend (PHP-FPM, proxy) : son propre journal.
