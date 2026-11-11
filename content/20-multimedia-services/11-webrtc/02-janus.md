---
title: Janus WebRTC Server
description: Janus (Meetecho, C, GPL 3) — passerelle WebRTC modulaire : cœur et greffons (VideoRoom, Streaming, AudioBridge, SIP, TextRoom, Record&Play), transports HTTP et WebSocket, installation (paquets, compilation, Docker), janus.jcfg et configuration ICE (NAT 1:1, STUN/TURN, plage de ports), API d'administration, sécurité (jetons, mots de passe des salles), enregistrement et conversion des fichiers mjr.
tags: [janus, webrtc, sfu, sip, videoroom, streaming, meetecho]
icon: video
---

**Janus** est un serveur WebRTC « à tout faire » : un **cœur** qui gère les connexions WebRTC et des **greffons** qui définissent le comportement. Il sert de SFU pour la visio, de passerelle entre WebRTC et SIP ou RTP, de serveur de diffusion à faible latence.

| Greffon | Usage |
| --- | --- |
| **VideoRoom** | Salles de visioconférence en SFU (publication, abonnement, simulcast, SVC) ; aussi base d'une diffusion à grande échelle |
| **AudioBridge** | Pont audio mixé (MCU audio), entrées et sorties RTP |
| **Streaming** | Diffuser vers les navigateurs un flux RTP reçu (encodeur, caméra via FFmpeg ou GStreamer) |
| **SIP** | Passerelle WebRTC ↔ SIP (appeler un IPBX depuis le navigateur) |
| **TextRoom** | Messagerie par canaux de données |
| **Record&Play** | Enregistrement et relecture |

## Installation

```bash
sudo apt install janus janus-demos           # Debian, Ubuntu (version des dépôts)
# Version récente : compilation depuis le dépôt meetecho/janus-gateway, ou image Docker communautaire
sudo systemctl enable --now janus
```

Transports : HTTP REST (port **8088**, `/janus`), WebSocket (**8188**), API d'administration (**7088**).

## Configuration

Fichiers dans `/etc/janus/` : `janus.jcfg` (cœur), `janus.plugin.videoroom.jcfg`, `janus.transport.http.jcfg`…

```text /etc/janus/janus.jcfg
general: {
    admin_secret = "Secret-Admin-Long"         # API d'administration
    token_auth = true                          # jetons exigés pour créer des sessions
}
nat: {
    stun_server = "stun.exemple.fr"
    stun_port = 3478
    nat_1_1_mapping = "203.0.113.20"          # adresse publique si le serveur est derrière un NAT 1:1
    turn_server = "turn.exemple.fr"
    turn_port = 3478
    turn_type = "udp"
    turn_user = "janus"
    turn_pwd = "Mot-De-Passe-TURN"
}
media: {
    rtp_port_range = "20000-40000"             # plage UDP à ouvrir sur le pare-feu
}
```

```text /etc/janus/janus.plugin.videoroom.jcfg
room-1234: {
    description = "Réunion d'équipe"
    secret = "Gestion-De-La-Salle"
    pin = "Code-D-Acces"
    publishers = 9
    bitrate = 1024000
    videocodec = "vp8,h264"
    record = false
}
```

## Exploitation

```bash
# API d'administration : sessions et handles en cours
curl -s -X POST http://127.0.0.1:7088/admin -d '{"janus":"list_sessions","transaction":"t1","admin_secret":"Secret-Admin-Long"}'
# Convertir un enregistrement (.mjr) en fichier lisible
janus-pp-rec /var/lib/janus/recordings/salle-video.mjr salle-video.webm
journalctl -u janus -f
```

## Sécurité

- Placer Janus derrière un **reverse proxy TLS** (HTTPS et WSS) : les navigateurs l'exigent.
- Activer les **jetons** (`token_auth`) ou un mot de passe d'API, protéger les salles (`secret`, `pin`), interdire la création libre de salles dans les greffons exposés.
- Ne pas exposer l'API d'administration (port 7088) hors de l'hôte.

Voir aussi : [[01-architecture|architecture WebRTC]] · [[03-livekit|LiveKit]]. Commandes : [[90-aide-memoire|aide-mémoire]].
