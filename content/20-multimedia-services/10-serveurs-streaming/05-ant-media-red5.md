---
title: Ant Media Server Community et Red5
description: Deux serveurs de streaming en Java — Ant Media Server Community Edition (Apache 2.0 : émission WebRTC, RTMP, SRT, lecture HLS et DASH, interface web, différences avec l'édition Enterprise sous licence, script d'installation, ports 5080, 5443, 1935, plage UDP WebRTC) et Red5 (serveur RTMP historique open source, Red5 Pro commercial).
tags: [ant media server, red5, webrtc, rtmp, hls, java, streaming]
icon: cast
---

## Ant Media Server

**Ant Media Server** existe en deux éditions :

| | Community Edition | Enterprise Edition |
| --- | --- | --- |
| Licence | **Apache 2.0**, gratuite | Commerciale (clé de licence vérifiée par le serveur) |
| Entrées | RTMP, **WebRTC (émission)**, SRT, RTSP, fichiers | Idem |
| Lecture | **HLS**, DASH (latence de quelques secondes) | En plus : **lecture WebRTC** (moins d'une seconde), débit adaptatif, grappe, transcodage matériel |
| Usage | Laboratoire, petites diffusions, émission depuis le navigateur | Production à faible latence |

> [!NOTE]
> La Community Edition fonctionne **sans clé de licence**. Les fonctions sous licence (lecture WebRTC, grappe…) sont propres à l'édition Enterprise : vérifier ce dont on a besoin avant de bâtir un projet dessus.

### Installation

```bash
# Script officiel avec l'archive Community téléchargée depuis le site ou les publications GitHub
wget https://raw.githubusercontent.com/ant-media/Scripts/master/install_ant-media-server.sh
chmod +x install_ant-media-server.sh
sudo ./install_ant-media-server.sh -i ant-media-server-community-<version>.zip
sudo systemctl status antmedia
```

| Port | Usage |
| --- | --- |
| TCP 5080 / 5443 | Interface web, API REST, lecture HLS (HTTP / HTTPS) |
| TCP 1935 | RTMP |
| UDP 50000-60000 (selon la configuration) | Médias WebRTC |
| UDP 4200 | SRT |

- Interface : `http://serveur:5080/` (création du compte administrateur), applications `LiveApp` et `WebRTCAppEE`.
- Certificat Let's Encrypt : `sudo /usr/local/antmedia/enable_ssl.sh -d diffusion.exemple.fr`.
- Émission depuis un navigateur : page de démonstration `https://serveur:5443/LiveApp/` (WebRTC) ; OBS : `rtmp://serveur/LiveApp`, clé = identifiant du flux.

## Red5

**Red5** est un serveur **RTMP** open source (Java, Apache 2.0) apparu pour remplacer Adobe Flash Media Server. Il sert surtout aux **applications existantes** (diffusion RTMP, applications serveur Java). **Red5 Pro** est une offre commerciale distincte, orientée WebRTC et grappes.

```bash
# Archive de la dernière version (Java 11 ou plus)
tar xzf red5-server-<version>.tar.gz -C /opt && cd /opt/red5-server
./red5.sh                                   # démarre ; ./red5-shutdown.sh pour arrêter
# Ports : 5080 (HTTP), 1935 (RTMP)
```

Pour un nouveau projet, un serveur plus actif (MediaMTX, SRS, OvenMediaEngine) est généralement préférable.

Voir aussi : [[01-protocoles-comparatif|protocoles et comparatif]]. Commandes : [[90-aide-memoire|aide-mémoire]].
