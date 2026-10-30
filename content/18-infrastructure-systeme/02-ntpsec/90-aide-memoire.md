---
title: NTPsec — aide-mémoire des commandes
description: Commandes NTPsec avec exemples — état (ntpq -p, -c rv, -c sysinfo, -c kerninfo), ntpmon, contrôle des accès (restrict), NTS côté serveur et client (certificats, nts enable), statistiques (ntpviz), vérification de configuration, horloge de référence (GPS/PPS), journaux.
tags: [aide-mémoire, ntpsec, ntpq, ntpmon, nts, ntp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|NTPsec]].

## État

```bash
ntpq -p                       # pairs (* sélectionné, + candidat, - rejeté)
ntpq -c rv                    # variables système (strate, décalage, précision)
ntpq -c sysinfo
ntpq -c sysstats
ntpq -c kerninfo
ntpq -c "mrulist sort=-count" | head       # clients les plus actifs (serveur)
ntpmon                        # vue interactive
sudo systemctl status ntpsec
ntpd --version
```

## Configuration type

```text
# /etc/ntpsec/ntp.conf
driftfile /var/lib/ntpsec/ntp.drift
leapfile /usr/share/zoneinfo/leap-seconds.list
statsdir /var/log/ntpsec/
statistics loopstats peerstats clockstats
filegen loopstats file loopstats type day enable
filegen peerstats file peerstats type day enable

server ntp1.exemple.fr iburst
server time.cloudflare.com nts iburst
pool fr.pool.ntp.org iburst

# NTS côté serveur
nts enable
nts cert /etc/ntpsec/cert.pem
nts key /etc/ntpsec/key.pem

restrict default kod limited nomodify noquery
restrict 127.0.0.1
restrict ::1
restrict 10.0.0.0 mask 255.0.0.0 nomodify noquery
```

## Horloge de référence (GPS + PPS)

```text
refclock nmea baud 9600 prefer
refclock pps
```

## Statistiques

```bash
sudo ntpviz -d /var/log/ntpsec -o /var/www/html/ntp/      # graphiques HTML (paquet ntpsec-ntpviz)
tail -f /var/log/ntpsec/loopstats
```
