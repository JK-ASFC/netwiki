---
title: iperf2, OpenSpeedTest, LibreSpeed et Speedtest Tracker
description: Mesurer le débit réseau — iperf2 (débit brut entre deux machines, mode serveur et client, UDP et gigue, bidirectionnel, différences avec iperf3), OpenSpeedTest (serveur de test de débit par navigateur sans dépendance, image Docker, port), LibreSpeed (test de débit web auto-hébergé en PHP ou Node, back-end et sondes, mode télémétrie) et Speedtest Tracker (mesures planifiées vers un fournisseur comme Ookla, historique et graphiques, Docker) ; choisir selon ce que l'on veut mesurer.
tags: [débit, iperf2, iperf3, openspeedtest, librespeed, speedtest tracker, mesure réseau]
icon: gauge
---

Mesurer un « débit » recouvre plusieurs besoins : la **capacité brute d'un lien** entre deux points internes (iperf), ou le **débit ressenti par un utilisateur** depuis son navigateur (OpenSpeedTest, LibreSpeed), éventuellement **suivi dans le temps** (Speedtest Tracker).

## iperf2

[[02-reseau-diagnostic/05-iperf3|iPerf3]] est déjà traité dans le wiki. **iperf2** reste utile pour ce qu'iperf3 ne fait pas aussi bien : tests **vraiment bidirectionnels simultanés** et **multi-flux** parallèles côté serveur, mesures de gigue historiques. Les deux coexistent (binaires et ports par défaut distincts).

```bash
sudo apt install iperf          # iperf2 (le paquet « iperf3 » est séparé)
# Serveur
iperf -s                        # TCP, port 5001 par défaut (iperf3 utilise 5201)
iperf -s -u                     # UDP
# Client
iperf -c serveur -t 20 -i 2                    # 20 s, rapport toutes les 2 s
iperf -c serveur -P 8                          # 8 flux parallèles
iperf -c serveur -d                            # bidirectionnel simultané
iperf -c serveur -u -b 100M                    # UDP à 100 Mbit/s (mesure gigue et pertes)
```

Ouvrir le port **5001/TCP** (et UDP) sur le serveur ; lancer les tests hors heures de production (ils saturent le lien) et toujours entre machines que l'on maîtrise.

## OpenSpeedTest

**Serveur de test de débit** accessible au **navigateur**, sans base de données ni dépendance : on héberge la page, les utilisateurs mesurent le débit entre leur poste et le serveur (utile pour un lien interne, un VPN, un Wi-Fi).

```bash
docker run -d --name openspeedtest --restart unless-stopped \
  -p 127.0.0.1:3000:3000 -p 127.0.0.1:3001:3001 openspeedtest/latest
# Interface : http://serveur:3000
```

Placer le serveur **au plus près** de ce que l'on veut mesurer (même site, même cœur de réseau) pour que le résultat reflète le lien testé et non Internet.

## LibreSpeed

Test de débit **auto-hébergé** et libre, avec interface web, mesure de **latence et gigue**, et sélection de plusieurs serveurs (sondes). Versions PHP (back-end classique), Node.js et Go, plus un conteneur tout-en-un.

```bash
docker run -d --name librespeed -p 127.0.0.1:8080:80 \
  -e MODE=standalone -e TELEMETRY=false -e TITLE="Débit interne" \
  ghcr.io/librespeed/speedtest:latest
```

- `MODE=backend` + base de données (`TELEMETRY=true`) conserve l'historique des tests et affiche une page de résultats partageable.
- Un client en ligne de commande (`librespeed-cli`) permet des mesures scriptées vers ces serveurs.

## Speedtest Tracker

Mesure le débit **vers Internet** à **intervalles réguliers** (via Ookla Speedtest ou LibreSpeed) et conserve l'**historique** : download, upload, latence, avec graphiques et alertes. Pratique pour surveiller la tenue d'un lien FAI dans la durée.

```yaml docker-compose.yml
services:
  speedtest-tracker:
    image: lscr.io/linuxserver/speedtest-tracker:latest
    ports: [ "127.0.0.1:8081:80" ]
    environment:
      - PUID=1000
      - PGID=1000
      - APP_KEY=base64:…          # php artisan key:generate --show, ou openssl
      - DB_CONNECTION=sqlite
      - SPEEDTEST_SCHEDULE=0 */4 * * *      # toutes les 4 heures
    volumes: [ "/srv/speedtest:/config" ]
    restart: unless-stopped
```

Accepter les conditions d'utilisation de l'outil de mesure choisi ; espacer les tests pour ne pas fausser la mesure ni consommer inutilement la bande passante.

## Choisir

| On veut mesurer… | Outil |
| --- | --- |
| La capacité d'un lien interne entre deux serveurs | iPerf3 ou iperf2 |
| Tests bidirectionnels/multi-flux poussés | iperf2 |
| Le débit ressenti depuis un poste, dans le navigateur | OpenSpeedTest, LibreSpeed |
| L'évolution du lien FAI dans le temps | Speedtest Tracker |
| La latence dans la durée (pas le débit) | [[22-sondes-reseau/01-smokeping-blackbox\|Smokeping]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
