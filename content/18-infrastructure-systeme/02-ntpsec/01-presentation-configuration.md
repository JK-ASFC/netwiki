---
title: Présentation, installation, configuration et exploitation
description: NTPsec, fork durci et allégé de ntpd — différences avec ntpd et chrony, installation (Debian, Ubuntu, RHEL via EPEL, FreeBSD), ntp.conf client et serveur, restrictions d'accès, NTS client et serveur, pilotes d'horloges de référence (GPS, PPS, gpsd), outils ntpq, ntpmon et ntpviz, statistiques, sécurité et dépannage.
tags: [ntpsec, ntp, nts, ntpq, gps, pps, temps, serveur ntp]
icon: info
---

**NTPsec** est un fork de l'implémentation de référence **ntpd** (ntp.org), lancé en 2015 pour en réduire la surface d'attaque : code allégé de plus de la moitié, suppression des fonctions dangereuses (mode `monlist`, autokey, pilotes obsolètes), compilation durcie, et ajout de **NTS**. Il reste compatible avec la configuration `ntp.conf` et conserve les **pilotes d'horloges de référence** (GPS, PPS, radio) qui en font un bon choix pour un serveur de strate 1.

| Critère | NTPsec | chrony |
| --- | --- | --- |
| Configuration | `ntp.conf` (héritée de ntpd) | `chrony.conf` |
| Pilotes de référence | Nombreux (`refclock gpsd`, `shm`, `pps`, `nmea`…) | SHM, SOCK, PPS, PHC |
| Clients intermittents, VM | Moins adapté | Point fort |
| NTS | Oui (client et serveur) | Oui |
| Outils | `ntpq`, `ntpmon`, `ntpviz` (graphiques) | `chronyc` |

Pour la plupart des clients et serveurs internes, [[01-chrony/01-presentation-client|chrony]] est le choix par défaut ; NTPsec convient bien aux serveurs de référence et aux environnements qui connaissent ntpd.

## Installation

```bash
sudo apt install ntpsec                 # Debian 11+ / Ubuntu 22.04+ (remplace ntp)
sudo dnf install epel-release && sudo dnf install ntpsec      # RHEL 9 (EPEL)
sudo pkg install ntpsec                 # FreeBSD
sudo systemctl enable --now ntpsec      # « ntpd » selon la distribution
```

Désactivez les autres services de temps (`chronyd`, `systemd-timesyncd`) : un seul démon doit piloter l'horloge.

## Configuration

```ntpconf /etc/ntpsec/ntp.conf (Debian) — /etc/ntp.conf
driftfile /var/lib/ntpsec/ntp.drift
leapfile /usr/share/zoneinfo/leap-seconds.list

# Sources (NTS lorsque c'est possible)
server time.cloudflare.com nts iburst
server nts.netnod.se nts iburst
pool 0.fr.pool.ntp.org iburst

# Restrictions : par défaut, servir l'heure sans autoriser la modification ni les requêtes de contrôle
restrict default kod limited nomodify noquery
restrict -6 default kod limited nomodify noquery
restrict 127.0.0.1
restrict ::1
# Réseaux internes : interrogation autorisée pour la supervision
restrict 10.0.0.0 mask 255.0.0.0 nomodify

# Statistiques
statsdir /var/log/ntpsec/
statistics loopstats peerstats clockstats
filegen loopstats file loopstats type day enable
filegen peerstats file peerstats type day enable
```

| Option de `restrict` | Effet |
| --- | --- |
| `nomodify` | Interdit la modification de la configuration à distance |
| `noquery` | Interdit les requêtes de contrôle (`ntpq`) — l'heure reste servie |
| `limited` + `kod` | Limitation de débit, paquet « Kiss-o'-Death » aux clients trop bavards |
| `ignore` | Ignore totalement |

### Serveur NTS

```ntpconf
nts enable
nts key /etc/ntpsec/nts/ntp1.corp.exemple.fr.key
nts cert /etc/ntpsec/nts/ntp1.corp.exemple.fr.crt
```

Ouvrez **4460/TCP** (échange de clés) en plus de **123/UDP**.

### Horloge de référence GPS

```ntpconf
# Option 1 : pilote gpsd (JSON), qui exploite aussi le PPS vu par gpsd
refclock gpsd unit 0 prefer

# Option 2 : mémoire partagée de gpsd + signal PPS du noyau
# refclock shm unit 0 refid GPS
# refclock pps unit 0 refid PPS prefer
```

## Outils

```bash
ntpq -p                    # pairs : * = sélectionné, + = candidat, - = écarté, x = faux (falseticker)
ntpq -c rv                 # variables système (strate, décalage, état leap)
ntpq -c nts                # compteurs NTS
ntpmon                     # tableau de bord en terminal
ntpviz -d /var/log/ntpsec/ -o /var/www/html/ntpviz/    # graphiques HTML des statistiques
ntpdig ntp1.corp.exemple.fr                            # client SNTP de test (remplace ntpdate)
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `ntpq -p` : `.INIT.` qui persiste | Source injoignable | 123/UDP, DNS, restrictions côté serveur |
| `ntpq: read: Connection refused` | `noquery` pour localhost, démon arrêté | `restrict 127.0.0.1`, état du service |
| Source marquée `x` | Source en désaccord avec la majorité | Vérifier la source, avoir ≥ 3 sources |
| NTS refusé | Certificat (nom, chaîne), 4460/TCP | `ntpq -c nts`, journal `journalctl -u ntpsec` |
| PPS sans effet | Module noyau `pps_ldisc`, `/dev/pps0`, gpsd | `ppstest /dev/pps0`, `gpsmon` |
| Conflit avec chrony | Deux démons actifs | Désactiver l'un des deux |
