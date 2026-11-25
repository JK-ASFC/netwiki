---
title: journald — aide-mémoire des commandes
description: Commandes journalctl et systemd-journald — lecture et filtrage (unité, priorité, intervalle, amorçage, noyau, champ), suivi en direct, formats de sortie (json, cat, verbose), champs disponibles, espace disque et vacuum, rotation, vérification FSS, configuration journald.conf et stockage persistant.
tags: [aide-mémoire, journald, journalctl, systemd, logs, linux]
icon: terminal
---

Explications : [[01-presentation-utilisation|systemd-journald et journalctl]].

## Lecture et filtrage

```bash
journalctl -e                      # fin du journal ; -r ordre inverse ; -n N dernières lignes
journalctl -f                      # suivre en direct ; -f -u nginx pour une unité
journalctl -u nginx.service        # par unité (joker : -u 'ssh*') ; plusieurs -u cumulables
journalctl -k                      # noyau (dmesg) ; -b amorçage courant, -b -1 précédent, --list-boots
journalctl -p err                  # priorité >= err ; -p warning..notice pour une plage
journalctl -g "Failed|refused"     # grep (regex) ; --case-sensitive=false par défaut
journalctl _SYSTEMD_UNIT=sshd.service _PID=1234    # filtres par champ (ET logique)
journalctl /usr/sbin/sshd          # par exécutable
journalctl --since "-1h" --until now ; journalctl --since "2026-11-25 08:00"
journalctl -N ; journalctl -F _SYSTEMD_UNIT        # lister les champs / valeurs d'un champ
```

## Formats

```bash
journalctl -u nginx -o short-iso          # horodatage ISO
journalctl -u nginx -o cat                # message seul
journalctl -u nginx -o verbose            # tous les champs
journalctl -u nginx -o json-pretty        # JSON
journalctl -u nginx --output-fields=MESSAGE,_PID -o json
```

## Espace, rotation, intégrité

```bash
journalctl --disk-usage
sudo journalctl --vacuum-size=500M        # ou --vacuum-time=2weeks / --vacuum-files=5
sudo journalctl --rotate                  # rotation immédiate
journalctl --verify                       # vérifier l'intégrité
sudo journalctl --setup-keys              # activer le scellement FSS
sudo journalctl --flush                   # basculer /run -> /var (stockage persistant)
```

## Configuration et service

```bash
sudo systemctl restart systemd-journald
sudo mkdir -p /var/log/journal && sudo systemd-tmpfiles --create --prefix /var/log/journal   # persistance
```

```ini /etc/systemd/journald.conf
[Journal]
Storage=persistent
Compress=yes
SystemMaxUse=2G
MaxRetentionSec=1month
ForwardToSyslog=yes
RateLimitIntervalSec=30s
RateLimitBurst=10000
```

## Journal distant

```bash
# Récepteur
sudo systemctl enable --now systemd-journal-remote.socket
# Émetteur : URL du récepteur dans /etc/systemd/journal-upload.conf
sudo systemctl enable --now systemd-journal-upload.service
# Lecture HTTP/JSON
sudo systemctl enable --now systemd-journal-gatewayd.socket      # port 19531
```
