---
title: Partage entre appareils — aide-mémoire
description: Commandes et ports de KDE Connect (kdeconnect-cli, 1714-1764), LocalSend (53317), Input Leap, Barrier et Deskflow (serveur, client, 24800), règles de pare-feu ufw, firewalld et Windows.
tags: [aide-mémoire, kde connect, localsend, input leap, barrier, deskflow, pare-feu]
icon: terminal
---

Explications : [[01-kde-connect-localsend|KDE Connect, GSConnect et LocalSend]] · [[02-barrier-input-leap-synergy|Barrier, Input Leap et Synergy]].

## Ports

| Outil | Port |
| --- | --- |
| KDE Connect / GSConnect | TCP et UDP 1714-1764 |
| LocalSend | TCP et UDP 53317 |
| Input Leap, Barrier, Synergy, Deskflow | TCP 24800 (serveur) |

## KDE Connect

```bash
kdeconnect-cli --refresh ; kdeconnect-cli -l ; kdeconnect-cli -a
kdeconnect-cli -d <id> --pair
kdeconnect-cli -n "Téléphone" --ping-msg "Traitement terminé"
kdeconnect-cli -n "Téléphone" --share fichier.pdf
kdeconnect-cli -n "Téléphone" --ring
```

## Input Leap et Barrier

```bash
input-leaps -f --name poste-admin -c ~/input-leap.conf --address :24800   # serveur
input-leapc -f --name portable-linux 192.168.1.10                          # client
barriers -f --name poste-admin -c ~/barrier.conf ; barrierc -f --name portable-linux 192.168.1.10
```

## Pare-feu

```bash
sudo firewall-cmd --permanent --add-service=kdeconnect
sudo ufw allow 1714:1764/udp ; sudo ufw allow 1714:1764/tcp
sudo ufw allow 53317
sudo ufw allow from 192.168.1.0/24 to any port 24800 proto tcp
```

```powershell
New-NetFirewallRule -DisplayName "Input Leap" -Direction Inbound -Protocol TCP -LocalPort 24800 -Action Allow -Profile Private
```
