---
title: Pi-hole
description: Pi-hole — filtre DNS pour tout le réseau (Pi-hole v6 avec FTL et serveur web intégrés), installation sur Debian, Ubuntu, Fedora, Raspberry Pi OS et Docker, listes de blocage (gravity), listes autorisées, groupes et clients, DNS local et CNAME, transfert conditionnel, résolveur récursif Unbound local, DHCP, interface web, API REST, commandes pihole, sauvegarde (Teleporter) et mises à jour.
tags: [pi-hole, dns filtrant, blocage publicitaire, raspberry pi, unbound, ftl]
icon: shield-check
---

**Pi-hole** (EUPL) est le filtre DNS le plus connu, à l'origine conçu pour Raspberry Pi : il répond aux requêtes DNS du réseau et bloque les domaines présents dans ses **listes** (base « gravity »). La version **6** intègre serveur web et API REST dans le moteur **FTL** (fork de dnsmasq).

## Installation

```bash
curl -sSL https://install.pi-hole.net | bash        # Debian, Ubuntu, Fedora, Raspberry Pi OS (adresse IP fixe recommandée)
sudo pihole setpassword                             # mot de passe de l'interface
```

```yaml compose.yaml
services:
  pihole:
    image: pihole/pihole:latest
    ports: ["53:53/tcp", "53:53/udp", "80:80/tcp", "443:443/tcp"]
    environment:
      TZ: Europe/Paris
      FTLCONF_webserver_api_password: "MotDePasse-A-Changer"
      FTLCONF_dns_upstreams: "10.0.10.53;10.0.10.54"
    volumes: ["./etc-pihole:/etc/pihole"]
    restart: unless-stopped
```

Interface : `https://<ip>/admin`.

## Configuration

- **Listes** (*Lists*) : ajout d'URL de listes puis `pihole -g` (mise à jour de gravity, planifiée chaque semaine).
- **Groupes et clients** : appliquer des listes différentes selon le poste ou le sous-réseau.
- **DNS local** (*Local DNS → DNS Records / CNAME*) : noms internes simples.
- **Transfert conditionnel** (*Settings → DNS*) : domaine AD vers les DC, et résolution inverse locale.
- **Résolveur récursif** local : installer [[02-unbound/01-presentation-installation|Unbound]] sur `127.0.0.1#5335` et le définir comme seul amont (pas de dépendance à un résolveur public).
- **DHCP** intégré (désactiver celui du routeur).

Configuration de la v6 : `/etc/pihole/pihole.toml` (modifiable aussi par `pihole-FTL --config`).

## Sauvegarde

*Settings → Teleporter* (export/import de la configuration, des listes et des groupes).

Interface : [[04-interface-graphique|interfaces web]] · commandes : [[90-aide-memoire|aide-mémoire]].
