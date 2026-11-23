---
title: ntopng
description: ntopng (ntop, GPL pour l'édition Community) — analyse du trafic réseau en temps réel par interface miroir ou flux NetFlow/sFlow/IPFIX (avec nProbe) : éditions Community, Pro et Enterprise, installation (dépôt packages.ntop.org pour Debian/Ubuntu et RHEL, Windows, Docker, intégration pfSense/OPNsense), port miroir SPAN, interface web (port 3000), hôtes, applications nDPI, flux, géolocalisation, alertes, historique ClickHouse, exports, cas d'usage (qui consomme la bande passante, détection d'anomalies) et confidentialité.
tags: [ntopng, nprobe, netflow, sflow, ndpi, analyse de trafic, bande passante]
icon: info
---

**ntopng** répond en quelques clics aux questions « **qui** consomme la bande passante, **avec quelle application**, vers **où** ? ». Il analyse un **port miroir** (SPAN) d'un commutateur ou une interface de passerelle, et reconnaît plusieurs centaines d'applications grâce à **nDPI** (inspection des paquets). Avec **nProbe**, il reçoit aussi des flux **NetFlow/sFlow/IPFIX** exportés par les routeurs.

| Édition | Contenu |
| --- | --- |
| Community (GPL) | Temps réel, hôtes, flux, applications, alertes de base |
| Pro / Enterprise | Historique ClickHouse long, rapports, collecte NetFlow via nProbe, SNMP, alertes avancées |

## Installation

```bash
# Debian/Ubuntu : paquet de configuration du dépôt depuis packages.ntop.org (apt-ntop.deb), puis
sudo apt install ntopng
sudoedit /etc/ntopng/ntopng.conf
```

```ini
# /etc/ntopng/ntopng.conf
-i=ens224                 # interface reliée au port miroir (sans adresse IP)
-w=3000
-m=10.0.0.0/8,192.168.0.0/16   # réseaux locaux
--community
```

```bash
sudo systemctl enable --now ntopng          # interface https://<hôte>:3000 (admin/admin à changer)
```

RHEL : dépôt ntop pour EL ; Windows : installeur ; Docker : `ntop/ntopng` (en mode `--network host`) ; [[19-pfsense-opnsense/01-pfsense|pfSense et OPNsense]] : paquet ntopng.

| Option `ntopng.conf` | Rôle |
| --- | --- |
| `-i=ens224` | Interface écoutée (répéter pour plusieurs) ; `-i=tcp://…` pour nProbe |
| `-w=3000` / `-W=3001` | Port HTTP / HTTPS de l'interface |
| `-m=10.0.0.0/8` | Réseaux considérés comme locaux (distingue interne/externe) |
| `-F="clickhouse;..."` | Export des flux vers ClickHouse (historique, édition Pro/Ent.) |
| `-g` / `--local-networks-only` | Ne garder que les hôtes locaux |
| `-n=1` | Résolution DNS des hôtes |
| `--disable-login=1` | Désactiver l'authentification (à éviter) |

Port miroir : configuration du commutateur (`monitor session 1 source interface Gi1/0/1 both` puis `destination interface Gi1/0/48` sur Cisco). Pour un gros débit, préférez les flux NetFlow/sFlow (moins de charge).

## Ce que ntopng montre

| Vue | Contenu |
| --- | --- |
| Tableau de bord | Top hôtes, top applications (nDPI), top talkers, répartition par protocole |
| **Hôtes** | Par hôte : débit, applications, pairs, score de risque, ports, géolocalisation |
| **Flux** (*Flows*) | Connexions en cours : client/serveur, application, octets, latence, état |
| Applications (nDPI) | Reconnaissance applicative (HTTP, TLS/SNI, QUIC, streaming, VPN, P2P…) même sans numéro de port standard |
| Interfaces | Débit, paquets, pertes par interface écoutée |
| **Alertes** | Comportements anormaux : scans, dépassements de seuil, hôtes à risque, expirations TLS, DGA |
| Carte / périphériques | Cartographie des échanges, découverte des équipements |

Avec **nProbe**, ntopng collecte les flux **NetFlow v5/v9/IPFIX** et **sFlow** exportés par les routeurs (`-i=tcp://127.0.0.1:5556`), et exporte vers ClickHouse, Kafka ou Elasticsearch. L'**historique** (édition Pro/Enterprise) conserve les flux dans ClickHouse pour l'analyse rétrospective.

> [!NOTE]
> L'analyse de trafic touche aux communications des personnes : informez les utilisateurs (charte informatique), limitez l'accès et la durée de conservation, conformément au RGPD.

<!-- CAPTURE: ntopng — tableau de bord (top hôtes et applications) | _assets/ntopng-tableau.png -->
<!-- CAPTURE: ntopng — détail d'un hôte | _assets/ntopng-hote.png -->

Suite : [[02-tcpdump-iftop-vnstat|tcpdump, iftop et vnStat]] · [[90-aide-memoire|aide-mémoire]].
