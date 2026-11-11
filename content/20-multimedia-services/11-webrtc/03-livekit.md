---
title: LiveKit
description: LiveKit (Go, Apache 2.0) — SFU WebRTC complet avec SDK pour le web, iOS, Android, Flutter, Unity et serveurs : installation (script, Docker, générateur de configuration avec Caddy et Redis), livekit.yaml (clés d'API, ports, TURN intégré, adresse publique), jetons d'accès, lk CLI, Egress (enregistrement, RTMP), Ingress (RTMP, WHIP), Agents (IA vocale), mise à l'échelle avec Redis.
tags: [livekit, webrtc, sfu, egress, ingress, turn, sdk, go]
icon: video
---

**LiveKit** fournit un **SFU** prêt pour la production et des **SDK** pour toutes les plates-formes : on l'utilise pour construire une application de visio, de direct interactif ou d'assistant vocal. Le serveur est libre (Apache 2.0) ; LiveKit Cloud est l'offre hébergée.

| Composant | Rôle |
| --- | --- |
| `livekit-server` | SFU, signalisation, TURN intégré |
| **Redis** | Nécessaire pour plusieurs nœuds (routage des salles) et pour Egress/Ingress |
| **Egress** | Enregistrer une salle ou un participant (MP4, HLS), diffuser en RTMP vers YouTube |
| **Ingress** | Faire entrer un flux RTMP, WHIP ou fichier dans une salle (OBS, encodeur) |
| **Agents** | Participants programmés (Python, Node.js) : transcription, assistants vocaux avec modèle de langue |

## Installation

```bash
# Mode développement (local, clés de test devkey/secret)
curl -sSL https://get.livekit.io | bash
livekit-server --dev

# Production : générer une configuration complète (Docker Compose, Caddy pour TLS, Redis)
docker run --rm -it -v $PWD:/output livekit/generate
```

Le générateur demande le domaine principal (par exemple `livekit.exemple.fr`) et le domaine TURN (`turn.exemple.fr`), puis produit `docker-compose.yaml`, `livekit.yaml`, `caddy.yaml` et un script d'installation.

```yaml livekit.yaml
port: 7880                      # API et signalisation (derrière TLS)
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 60000
  use_external_ip: true         # annoncer l'adresse publique
redis:
  address: localhost:6379
keys:
  APIcle1234: Secret-Tres-Long-Et-Aleatoire-0123456789
turn:
  enabled: true
  domain: turn.exemple.fr
  tls_port: 5349
  udp_port: 3478
```

Ports à ouvrir : **443** (TLS via Caddy), **7881/tcp**, **50000-60000/udp**, **3478/udp** et **5349/tcp** (TURN).

## Jetons et CLI

Une application obtient un **jeton d'accès** (JWT signé avec la clé d'API) qui précise la salle et les droits du participant.

```bash
export LIVEKIT_URL=wss://livekit.exemple.fr LIVEKIT_API_KEY=APIcle1234 LIVEKIT_API_SECRET='…'
lk room list
lk room create reunion
lk token create --join --room reunion --identity alice --valid-for 2h
lk room participants list reunion
lk load-test --room test --video-publishers 5 --subscribers 50     # test de charge
```

Le site de démonstration **meet.livekit.io** accepte une URL de serveur et un jeton pour tester une installation.

## Egress et Ingress

- **Egress** : enregistrer une réunion en MP4 dans un stockage S3, ou la diffuser en RTMP vers une plate-forme ; s'installe comme un service séparé (Chrome headless + GStreamer, gourmand).
- **Ingress** : créer une entrée RTMP ou WHIP (`lk ingress create`) et y envoyer OBS ; le flux apparaît comme un participant.

## Mise à l'échelle

Plusieurs nœuds `livekit-server` partagent le même **Redis** ; les participants d'une salle sont sur le même nœud. La charge dépend surtout de la **bande passante sortante** (nombre d'abonnés × débit).

Voir aussi : [[01-architecture|architecture WebRTC]] · [[02-janus|Janus]]. Commandes : [[90-aide-memoire|aide-mémoire]].
