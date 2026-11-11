---
title: mediasoup, Pion et Kurento
description: Trois briques WebRTC pour développer ou exploiter une application temps réel — mediasoup (bibliothèque SFU C++ pilotée en Node.js ou Rust : workers, routers, transports, producers et consumers, ports RTC, annonce de l'adresse publique), Pion (implémentation WebRTC complète en Go : clients, passerelles, serveurs sur mesure, exemples) et Kurento (serveur média SFU et MCU, Docker, ports, état du projet).
tags: [mediasoup, pion, kurento, webrtc, sfu, mcu, nodejs, go]
icon: video
---

Contrairement à Janus ou LiveKit, **mediasoup** et **Pion** sont des **bibliothèques** : on écrit l'application (signalisation, salles, droits) et la bibliothèque gère les médias. **Kurento** est un serveur média complet, mais son développement a fortement ralenti. Côté exploitation, l'administrateur doit surtout connaître leurs **ports**, leur **adresse publique** et leur **consommation**.

## mediasoup

Bibliothèque **SFU** (licence ISC) : un cœur C++ très performant (*workers*) piloté depuis **Node.js** (ou Rust). Elle sert de base à de nombreuses applications de visio.

| Notion | Rôle |
| --- | --- |
| **Worker** | Processus C++ ; un par cœur de processeur |
| **Router** | Une « salle » de routage des médias dans un worker |
| **WebRtcTransport** | Connexion WebRTC d'un client |
| **Producer / Consumer** | Flux envoyé par un participant / flux reçu par un autre |

```javascript
const mediasoup = require('mediasoup');
const worker = await mediasoup.createWorker({ rtcMinPort: 40000, rtcMaxPort: 49999 });
const router = await worker.createRouter({ mediaCodecs: [
  { kind: 'audio', mimeType: 'audio/opus', clockRate: 48000, channels: 2 },
  { kind: 'video', mimeType: 'video/VP8', clockRate: 90000 },
]});
const transport = await router.createWebRtcTransport({
  listenInfos: [{ protocol: 'udp', ip: '0.0.0.0', announcedAddress: '203.0.113.30' }],  // adresse publique
});
```

Exploitation :

- Ouvrir la plage **UDP `rtcMinPort`-`rtcMaxPort`** (et TCP si activé) ; prévoir un serveur TURN pour les clients filtrés.
- `announcedAddress` (ou `announcedIp` dans les anciennes versions) doit contenir l'adresse publique, sinon les clients extérieurs ne reçoivent rien.
- La compilation du worker à l'installation (`npm install mediasoup`) exige Python 3, `make` et un compilateur C++ (ou les binaires précompilés).

## Pion

**Pion** est une implémentation complète de WebRTC en **Go** (licence MIT) : ICE, DTLS, SRTP, SCTP, sans dépendance C. Elle sert à écrire des **clients**, des **passerelles** (RTSP → WebRTC, enregistrement, diffusion depuis un équipement embarqué) et des serveurs sur mesure. LiveKit et d'autres projets reposent dessus.

```bash
go get github.com/pion/webrtc/v4
# Exemples prêts à l'emploi : reflect, broadcast, save-to-disk, rtp-forwarder, play-from-disk
git clone https://github.com/pion/webrtc && cd webrtc/examples/broadcast && go run .
```

Les binaires Go sont statiques : déploiement simple (un exécutable, un service systemd), y compris sur Raspberry Pi.

## Kurento

**Kurento Media Server** (C++, Apache 2.0) est un serveur média complet : SFU **et** MCU, mixage, enregistrement, filtres (vision par ordinateur), piloté par un client Java ou JavaScript via WebSocket (port **8888**).

```bash
docker run -d --name kurento --network host kurento/kurento-media-server:7.0
# Ports : 8888 (contrôle, WebSocket), plage UDP médias (à restreindre dans la configuration WebRtcEndpoint)
```

> [!NOTE]
> Le développement de Kurento a nettement ralenti. Pour un nouveau projet, préférez **LiveKit**, **Janus** ou **mediasoup** ; gardez Kurento pour les applications existantes ou les traitements MCU qu'il est seul à proposer simplement.

Voir aussi : [[01-architecture|architecture WebRTC]] · [[02-janus|Janus]] · [[03-livekit|LiveKit]]. Commandes : [[90-aide-memoire|aide-mémoire]].
