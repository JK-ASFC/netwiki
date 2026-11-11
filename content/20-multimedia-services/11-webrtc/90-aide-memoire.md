---
title: Serveurs WebRTC — aide-mémoire
description: Ports et commandes de Janus (transports, API d'administration, janus-pp-rec), LiveKit (livekit-server, générateur, lk CLI, jetons, tests de charge), mediasoup (plage RTC, adresse annoncée), Pion et Kurento, avec les vérifications réseau (STUN, TURN, UDP).
tags: [aide-mémoire, webrtc, janus, livekit, mediasoup, pion, kurento, turn]
icon: terminal
---

Explications : [[01-architecture|architecture]] · [[02-janus|Janus]] · [[03-livekit|LiveKit]] · [[04-mediasoup-pion-kurento|mediasoup, Pion, Kurento]].

## Ports

| Serveur | Signalisation, API | Médias |
| --- | --- | --- |
| Janus | HTTP 8088, WebSocket 8188, admin 7088 | `rtp_port_range` (UDP) |
| LiveKit | 7880 (derrière TLS 443), 7881/tcp | 50000-60000/udp ; TURN 3478/udp, 5349/tcp |
| mediasoup | Selon l'application | `rtcMinPort`-`rtcMaxPort` (UDP) |
| Kurento | 8888 (WebSocket) | Plage UDP configurée |
| coturn (TURN) | 3478 UDP/TCP, 5349 TLS (ou 443) | Plage de relais UDP |

## Commandes

```bash
# Janus
sudo systemctl status janus ; journalctl -u janus -f
curl -s -X POST http://127.0.0.1:7088/admin -d '{"janus":"list_sessions","transaction":"t1","admin_secret":"…"}'
janus-pp-rec enregistrement.mjr sortie.webm

# LiveKit
livekit-server --dev
docker run --rm -it -v $PWD:/output livekit/generate
lk room list ; lk room create reunion
lk token create --join --room reunion --identity alice --valid-for 2h
lk load-test --room test --video-publishers 5 --subscribers 50

# Pion, Kurento
go get github.com/pion/webrtc/v4
docker run -d --name kurento --network host kurento/kurento-media-server:7.0
```

## Vérifier le réseau

```bash
sudo ss -ulpn | grep -E 'janus|livekit|turnserver'      # ports UDP en écoute
sudo tcpdump -ni any udp portrange 50000-60000            # médias qui arrivent ?
turnutils_uclient -u utilisateur -w motdepasse turn.exemple.fr    # tester coturn
```

Dans le navigateur : `chrome://webrtc-internals` (ou `about:webrtc` dans Firefox) montre les candidats ICE, la paire choisie (directe ou relayée par TURN) et les débits.
