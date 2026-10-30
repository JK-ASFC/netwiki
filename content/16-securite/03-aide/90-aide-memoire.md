---
title: AIDE (intégrité des fichiers) — aide-mémoire des commandes
description: Commandes AIDE avec exemples — initialisation de la base (aide --init, aideinit), vérification (--check), mise à jour après changement légitime (--update), configuration (règles, sélections, exclusions), vérification de la configuration, planification (cron, timer systemd), envoi des rapports, protection de la base de référence.
tags: [aide-mémoire, aide, intégrité, fim, sécurité, linux]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-utilisation|AIDE]].

## Base de référence

```bash
sudo aideinit                                          # Debian : initialise /var/lib/aide/aide.db.new et l'installe
sudo aide --init --config /etc/aide/aide.conf          # générique
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db     # RHEL : /var/lib/aide/aide.db.new.gz → aide.db.gz
```

## Vérifier et mettre à jour

```bash
sudo aide --check --config /etc/aide/aide.conf
sudo aide --check --limit /etc                          # limiter à un chemin (versions récentes)
sudo aide --update --config /etc/aide/aide.conf         # après une modification légitime (mise à jour, changement de configuration)
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
sudo aide --config-check --config /etc/aide/aide.conf
aide --version
```

## Configuration (extraits)

```text
# /etc/aide/aide.conf.d/90_local
PERMS = p+u+g+acl+xattrs
CONTENT_EX = sha512+ftype+p+u+g+n+acl+xattrs
/etc            CONTENT_EX
/usr/bin        CONTENT_EX
/usr/sbin       CONTENT_EX
/boot           CONTENT_EX
/var/log        PERMS
!/var/log/journal
!/etc/mtab
!/var/lib/docker
```

## Planification et rapports

```bash
# Debian : /etc/cron.daily/aide (variables dans /etc/default/aide, MAILTO)
sudo systemctl list-timers | grep -i aide       # dailyaidecheck.timer selon distribution
echo '0 4 * * * root /usr/bin/aide --check | mail -s "AIDE $(hostname)" securite@exemple.fr' | sudo tee /etc/cron.d/aide-local
```

## Protéger la référence

- Copier `aide.db` hors du serveur (support en lecture seule ou serveur de confiance) après chaque mise à jour validée : un attaquant root pourrait sinon régénérer la base.
- Vérifier avec la copie de confiance : `aide --check --config aide.conf` en pointant `database_in=file:/mnt/confiance/aide.db`.
