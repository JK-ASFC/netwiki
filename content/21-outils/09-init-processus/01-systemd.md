---
title: systemd
description: Le système d'init et de services de la plupart des distributions Linux (LGPL) — systemctl (start, enable --now, status, restart, reload, mask, daemon-reload), écriture d'une unité de service (Type, ExecStart, User, Restart, Environment, WorkingDirectory), surcharges systemctl edit, durcissement (NoNewPrivileges, ProtectSystem, PrivateTmp, systemd-analyze security), timers en remplacement de cron, journalctl, cibles, utilisateurs dynamiques, services utilisateur et linger, dépannage du démarrage avec systemd-analyze.
tags: [systemd, systemctl, journalctl, services, timers, linux, init]
icon: activity
---

**systemd** démarre le système (PID 1) et gère services, montages, minuteries et journaux sur Debian, Ubuntu, RHEL, Fedora, openSUSE et Arch. Les alternatives ([[02-openrc-runit-s6|OpenRC, runit, s6]]) se rencontrent sur Alpine, Gentoo, Void, Devuan et dans les conteneurs.

## Gérer les services

```bash
systemctl status nginx
sudo systemctl enable --now nginx           # démarrer et activer au boot
sudo systemctl restart nginx ; sudo systemctl reload nginx
sudo systemctl disable --now cups ; sudo systemctl mask cups     # empêcher tout démarrage
systemctl list-units --type=service --state=failed
systemctl list-unit-files --state=enabled
systemctl cat nginx                          # unité effective avec ses surcharges
sudo systemctl daemon-reload                 # après modification d'un fichier d'unité
```

## Écrire une unité de service

`/etc/systemd/system/api-interne.service` :

```ini
[Unit]
Description=API interne
After=network-online.target postgresql.service
Wants=network-online.target

[Service]
Type=simple
User=api
Group=api
WorkingDirectory=/opt/api
EnvironmentFile=/etc/api-interne.env
ExecStart=/usr/bin/node /opt/api/server.js
Restart=on-failure
RestartSec=5
# Durcissement
NoNewPrivileges=yes
ProtectSystem=strict
ProtectHome=yes
PrivateTmp=yes
ReadWritePaths=/var/lib/api
CapabilityBoundingSet=
MemoryMax=1G

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now api-interne
systemd-analyze security api-interne         # note d'exposition et pistes de durcissement
sudo systemctl edit nginx                    # surcharge dans /etc/systemd/system/nginx.service.d/override.conf
```

Ne jamais modifier les fichiers de `/usr/lib/systemd/system` (écrasés par les mises à jour) : utiliser `systemctl edit`. `DynamicUser=yes` crée un utilisateur éphémère pour un service sans état.

## Timers (remplaçants de cron)

`/etc/systemd/system/sauvegarde.service` (`Type=oneshot`, `ExecStart=/usr/local/bin/sauvegarde.sh`) et `/etc/systemd/system/sauvegarde.timer` :

```ini
[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true                 # rattraper une exécution manquée (machine éteinte)
RandomizedDelaySec=10m

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl enable --now sauvegarde.timer
systemctl list-timers
systemd-analyze calendar "Mon..Fri 07:00"   # vérifier une expression
```

## Journaux

```bash
journalctl -u nginx -f                       # suivre un service
journalctl -u nginx --since "1 hour ago" -p warning
journalctl -b -1 -p err                      # erreurs du démarrage précédent
journalctl --disk-usage ; sudo journalctl --vacuum-time=30d
```

Persistance et taille dans `/etc/systemd/journald.conf` (`Storage=persistent`, `SystemMaxUse=2G`). Centralisation : voir la catégorie journalisation.

## Démarrage, cibles et services utilisateur

```bash
systemd-analyze ; systemd-analyze blame ; systemd-analyze critical-chain
systemctl get-default ; sudo systemctl set-default multi-user.target     # sans interface graphique
systemctl --user enable --now syncthing      # service de l'utilisateur (~/.config/systemd/user)
sudo loginctl enable-linger jk               # services utilisateur actifs sans session ouverte
```

Commandes : [[90-aide-memoire|aide-mémoire]].
