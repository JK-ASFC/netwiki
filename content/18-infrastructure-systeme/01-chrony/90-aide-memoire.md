---
title: chrony — aide-mémoire des commandes
description: Commandes chrony avec exemples — état de la synchronisation (chronyc tracking, sources -v, sourcestats, selectdata), serveur NTP pour le réseau (allow, local stratum), clients connectés (clients), correction immédiate (makestep), ajout de sources à chaud, NTS, authentification par clé, vérification depuis un client, Windows (w32tm) pour comparaison.
tags: [aide-mémoire, chrony, chronyc, ntp, nts, heure]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-client|chrony]].

## État

```bash
chronyc tracking                    # décalage, strate, source de référence
chronyc sources -v                  # sources et légende (^* source sélectionnée)
chronyc sourcestats -v
chronyc selectdata                  # pourquoi une source est sélectionnée ou rejetée
chronyc activity
chronyc ntpdata | head -30
timedatectl
```

## Actions

```bash
sudo chronyc makestep               # corriger immédiatement un grand décalage
sudo chronyc burst 4/4
sudo chronyc add server ntp3.exemple.fr iburst
sudo chronyc delete ntp3.exemple.fr
sudo chronyc reload sources          # relire /etc/chrony/sources.d/
sudo chronyc clients                 # clients servis (serveur)
sudo chronyc serverstats
sudo systemctl restart chrony        # RHEL : chronyd
```

## Configuration type

```ini
# /etc/chrony/chrony.conf (serveur NTP interne)
server ntp1.exemple.fr iburst
server ntp2.exemple.fr iburst
pool fr.pool.ntp.org iburst maxsources 2
# NTS (NTP authentifié) vers des serveurs publics compatibles
server time.cloudflare.com iburst nts
allow 10.0.0.0/8
local stratum 10
makestep 1.0 3
rtcsync
leapsectz right/UTC
driftfile /var/lib/chrony/chrony.drift
logdir /var/log/chrony
log tracking measurements statistics
```

## Vérifications depuis un client

```bash
chronyd -Q 'server 10.0.10.123 iburst'           # interroger sans régler l'horloge
ntpdate -q 10.0.10.123                           # si ntpdate est présent
sudo tcpdump -ni eth0 udp port 123
```

## Windows (équivalent)

```powershell
w32tm /query /status
w32tm /query /peers
w32tm /stripchart /computer:10.0.10.123 /samples:5 /dataonly
w32tm /resync /force
```
