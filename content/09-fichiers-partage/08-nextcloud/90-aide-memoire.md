---
title: Nextcloud — aide-mémoire des commandes occ
description: Commandes occ de Nextcloud avec exemples — état et maintenance, mise à jour (updater.phar, occ upgrade), applications, utilisateurs et groupes, fichiers (scan, cleanup, transfert de propriété), configuration système (config:system), domaines approuvés, tâches de fond (cron), base de données (indices manquants, conversion), chiffrement, partages, sécurité (2FA, fail-over), journaux, sauvegarde, Docker AIO.
tags: [aide-mémoire, nextcloud, occ, php, maintenance, cloud]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Nextcloud]]. `occ` s'exécute **avec l'utilisateur du serveur web** :

```bash
cd /var/www/nextcloud
alias occ='sudo -E -u www-data php /var/www/nextcloud/occ'
```

## État, maintenance, mise à jour

```bash
occ status
occ check
occ maintenance:mode --on
occ maintenance:mode --off
sudo -u www-data php updater/updater.phar --no-interaction      # mise à jour vers la version suivante
occ upgrade
occ maintenance:repair --include-expensive
occ db:add-missing-indices
occ db:add-missing-columns
occ db:add-missing-primary-keys
occ db:convert-filecache-bigint
occ setupchecks                              # contrôles de l'écran « Vue d'ensemble » (versions récentes)
```

## Applications

```bash
occ app:list
occ app:install calendar
occ app:enable twofactor_totp
occ app:disable firstrunwizard
occ app:update --all
```

## Utilisateurs et groupes

```bash
OC_PASS='MotDePasseInitial2026' occ user:add --password-from-env --display-name="Alice Martin" --group="reseau" amartin
occ user:list
occ user:info amartin
occ user:resetpassword amartin
occ user:disable bpetit
occ user:enable bpetit
occ user:lastseen amartin
occ user:setting amartin settings email alice.martin@exemple.fr
occ user:delete ancien
occ group:add reseau
occ group:adduser reseau amartin
occ twofactorauth:enforce --on --group admin
occ twofactorauth:disable amartin totp        # perte du second facteur
occ ldap:show-config
occ ldap:test-config s01
occ ldap:search --group reseau
```

## Fichiers

```bash
occ files:scan --all                          # après une copie directe dans data/
occ files:scan --path="amartin/files/Projets"
occ files:cleanup
occ files:transfer-ownership bpetit amartin   # départ d'un collaborateur
occ trashbin:cleanup --all-users
occ versions:cleanup
occ sharing:cleanup-remote-storages
```

## Configuration

```bash
occ config:system:get trusted_domains
occ config:system:set trusted_domains 1 --value=cloud.exemple.fr
occ config:system:set overwrite.cli.url --value=https://cloud.exemple.fr
occ config:system:set default_phone_region --value=FR
occ config:system:set maintenance_window_start --type=integer --value=1
occ config:system:set memcache.local --value='\OC\Memcache\APCu'
occ config:system:set memcache.locking --value='\OC\Memcache\Redis'
occ background:cron                           # utiliser le cron système
occ config:list system --private > /tmp/config.json      # export (contient des secrets)
```

```bash
# Tâche cron (utilisateur www-data)
*/5 * * * * php -f /var/www/nextcloud/cron.php
```

## Chiffrement et sécurité

```bash
occ encryption:status
occ encryption:enable                         # irréversible en pratique : bien évaluer avant
occ security:bruteforce:reset 203.0.113.50
occ integrity:check-core
```

## Journaux et sauvegarde

```bash
occ log:tail
occ log:manage --level=2
sudo tail -f /var/www/nextcloud/data/nextcloud.log | jq -r '.message'
occ maintenance:mode --on
sudo rsync -a /var/www/nextcloud/config /var/www/nextcloud/data /srv/sauvegardes/nextcloud/
sudo -u postgres pg_dump nextcloud > /srv/sauvegardes/nextcloud/base.sql      # ou mysqldump --single-transaction
occ maintenance:mode --off
```

## Docker (All-in-One)

```bash
sudo docker exec --user www-data -it nextcloud-aio-nextcloud php occ status
```
