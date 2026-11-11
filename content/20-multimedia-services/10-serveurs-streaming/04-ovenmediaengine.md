---
title: OvenMediaEngine
description: OvenMediaEngine (AirenSoft, C++, AGPL) — diffusion à latence inférieure à la seconde en WebRTC et LL-HLS ; installation Docker, ports (RTMP 1935, SRT 9999, WebRTC et LL-HLS 3333/3334, TURN 3478, ICE 10000-10004/udp), Server.xml (applications, transcodage, publishers), envoi depuis OBS en RTMP, SRT ou WHIP, lecteur OvenPlayer, signature des URL et grappes.
tags: [ovenmediaengine, webrtc, ll-hls, srt, rtmp, whip, faible latence, streaming]
icon: cast
---

**OvenMediaEngine** (OME) vise la **très faible latence** à grande échelle : il reçoit en RTMP, SRT, WebRTC (WHIP) ou RTSP et diffuse en **WebRTC** (moins d'une seconde) ou **LL-HLS** (2 à 5 secondes, compatible CDN). Son lecteur libre **OvenPlayer** bascule automatiquement de l'un à l'autre.

## Installation (Docker)

```bash
docker run -d --name ome --restart unless-stopped \
  -p 1935:1935 -p 9999:9999/udp -p 9000:9000 -p 3333:3333 -p 3334:3334 -p 3478:3478 \
  -p 10000-10004:10000-10004/udp \
  -e OME_HOST_IP=203.0.113.10 \
  airensoft/ovenmediaengine:latest
```

| Port | Usage |
| --- | --- |
| TCP 1935 | Entrée RTMP |
| UDP 9999 | Entrée SRT |
| TCP 3333 / 3334 | Signalisation WebRTC, WHIP et LL-HLS (HTTP / HTTPS) |
| TCP 3478 | TURN intégré (traversée des pare-feu) |
| UDP 10000-10004 | Médias WebRTC (ICE) |
| TCP 9000 | Liaison origine-edge (OVT) |

`OME_HOST_IP` doit être l'adresse IP **publique** du serveur pour WebRTC.

## Configuration

Le fichier `Server.xml` (dans `/opt/ovenmediaengine/bin/origin_conf/` du conteneur) décrit les **hôtes virtuels** et les **applications** :

```xml
<Application>
    <Name>app</Name>
    <Type>live</Type>
    <OutputProfiles>
        <OutputProfile>
            <Name>abr</Name>
            <OutputStreamName>${OriginStreamName}</OutputStreamName>
            <Encodes>
                <Video><Name>720p</Name><Codec>h264</Codec><Width>1280</Width><Height>720</Height><Bitrate>2500000</Bitrate></Video>
                <Audio><Name>opus</Name><Codec>opus</Codec><Bitrate>128000</Bitrate></Audio>
                <Audio><Name>aac</Name><Codec>aac</Codec><Bitrate>128000</Bitrate></Audio>
            </Encodes>
        </OutputProfile>
    </OutputProfiles>
    <Publishers>
        <WebRTC><Timeout>30000</Timeout></WebRTC>
        <LLHLS><ChunkDuration>0.5</ChunkDuration><SegmentDuration>6</SegmentDuration></LLHLS>
    </Publishers>
</Application>
```

WebRTC exige de l'**Opus** pour l'audio et LL-HLS de l'**AAC** : d'où les deux encodages audio.

## Envoyer et lire

| Entrée | Adresse |
| --- | --- |
| RTMP (OBS) | `rtmp://serveur:1935/app`, clé `stream` |
| SRT | `srt://serveur:9999?streamid=srt://serveur:9999/app/stream` |
| WHIP (OBS récent) | `http://serveur:3333/app/stream?direction=whip` |

| Lecture | Adresse |
| --- | --- |
| WebRTC | `ws://serveur:3333/app/stream` (`wss://…:3334` en TLS) |
| LL-HLS | `http://serveur:3333/app/stream/llhls.m3u8` |

**OvenPlayer** (JavaScript) s'intègre dans une page avec ces deux sources, WebRTC en premier.

## Production

- **TLS** : certificats dans `Server.xml` ; les navigateurs exigent HTTPS/WSS pour WebRTC hors `localhost`.
- **SignedPolicy** : URL signées avec date d'expiration pour protéger publication et lecture.
- **Grappe** : serveurs *edge* qui tirent les flux de l'origine (OVT, port 9000) ; API REST pour piloter les flux.

Voir aussi : [[01-protocoles-comparatif|protocoles et comparatif]]. Commandes : [[90-aide-memoire|aide-mémoire]].
