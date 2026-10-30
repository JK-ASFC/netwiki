---
title: Installation, configuration et exploitation
description: Icecast 2, serveur de diffusion audio en continu (webradio, sonorisation, flux internes) — principe source, serveur et auditeurs, installation (Debian, RHEL, Windows, macOS), icecast.xml (limites, authentification, points de montage, mots de passe), sources (Liquidsoap, BUTT, Mixxx, ffmpeg), relais, TLS par reverse proxy, statistiques, sécurité et dépannage.
tags: [icecast, streaming audio, webradio, liquidsoap, points de montage, diffusion]
icon: radio
---

**Icecast** (Xiph.Org, GPL) diffuse des flux **audio** (MP3, AAC, Ogg Vorbis/Opus) en HTTP à de nombreux auditeurs : webradio d'entreprise ou associative, musique d'attente, retransmission d'un événement, sonorisation multi-sites. Le serveur ne produit pas le son : il redistribue un flux envoyé par une **source**.

```mermaid
flowchart LR
  SRC["Source : Liquidsoap, BUTT, Mixxx, ffmpeg"] -- "PUT / SOURCE (mot de passe source)" --> IC["Icecast :8000<br/>point de montage /direct"]
  IC --> A1["Auditeurs (navigateur, VLC, lecteurs)"]
  IC --> R["Icecast relais (autre site)"]
  R --> A2["Auditeurs distants"]
```

## Installation

```bash
sudo apt install icecast2            # Debian / Ubuntu (assistant : nom d'hôte, mots de passe)
sudo dnf install icecast             # RHEL / Fedora (EPEL)
sudo systemctl enable --now icecast2
```

Windows : installateur officiel (service) ; macOS : `brew install icecast`.

## icecast.xml

```xml /etc/icecast2/icecast.xml (extraits)
<icecast>
  <location>Paris</location>
  <admin>exploitation@exemple.fr</admin>
  <hostname>radio.exemple.fr</hostname>
  <limits>
    <clients>500</clients>
    <sources>4</sources>
    <queue-size>524288</queue-size>
    <burst-size>65535</burst-size>
  </limits>
  <authentication>
    <source-password>MotDePasseSourceTresLong</source-password>
    <relay-password>MotDePasseRelaisTresLong</relay-password>
    <admin-user>admin</admin-user>
    <admin-password>MotDePasseAdminTresLong</admin-password>
  </authentication>
  <listen-socket>
    <port>8000</port>
    <bind-address>127.0.0.1</bind-address>
  </listen-socket>
  <mount type="normal">
    <mount-name>/direct</mount-name>
    <password>MotDePasseSpecifiqueAuMontage</password>
    <max-listeners>300</max-listeners>
    <fallback-mount>/attente.mp3</fallback-mount>
    <fallback-override>1</fallback-override>
    <public>0</public>
    <stream-name>Radio interne</stream-name>
  </mount>
  <fileserve>1</fileserve>
  <paths>
    <logdir>/var/log/icecast2</logdir>
    <webroot>/usr/share/icecast2/web</webroot>
    <adminroot>/usr/share/icecast2/admin</adminroot>
  </paths>
  <logging>
    <accesslog>access.log</accesslog>
    <errorlog>error.log</errorlog>
    <loglevel>3</loglevel>
  </logging>
  <security>
    <chroot>0</chroot>
    <changeowner><user>icecast2</user><group>icecast</group></changeowner>
  </security>
</icecast>
```

| Élément | Rôle |
| --- | --- |
| Point de montage | URL du flux (`/direct`), mot de passe source propre, limites, flux de secours (*fallback*) |
| `public` | Annonce dans l'annuaire public Xiph (0 pour un flux interne) |
| Authentification des auditeurs | `<authentication type="htpasswd">` ou `url` (validation par une application) dans le montage |

## Sources

```bash
# ffmpeg : diffuser un fichier ou une entrée audio en Opus
ffmpeg -re -i emission.flac -c:a libopus -b:a 96k -content_type audio/ogg -f ogg \
  icecast://source:MotDePasseSpecifiqueAuMontage@127.0.0.1:8000/direct
```

```text Liquidsoap (radio automatisée : listes, jingles, bascule sur le direct)
playlist_musique = playlist("/srv/radio/musique")
direct = input.harbor("live", port=8005, password="MotDePasseAnimateur")
radio = fallback(track_sensitive=false, [direct, playlist_musique])
output.icecast(%mp3(bitrate=128), host="127.0.0.1", port=8000, password="MotDePasseSpecifiqueAuMontage", mount="/direct", radio)
```

Pour les animateurs : **BUTT** (*Broadcast Using This Tool*) ou **Mixxx** envoient leur micro/mixage directement au montage.

## Accès, TLS et relais

Icecast 2.4 gère TLS mais un **reverse proxy** (nginx, Caddy) est plus simple : HTTPS sur le nom public, `proxy_buffering off` pour le flux. Pour plusieurs sites, un Icecast **relais** reprend le flux du serveur principal (`<relay>` ou `<master-server>`) : chaque site consomme un seul flux WAN.

## Sécurité et exploitation

- [ ] Mots de passe source, relais et administrateur **distincts** et longs ; un mot de passe par montage
- [ ] Interface `/admin` limitée au réseau d'administration (proxy)
- [ ] Limites de clients et de sources adaptées à la bande passante (débit × auditeurs)
- [ ] Mises à jour du paquet ; service non root (`changeowner`)

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Source refusée (`401`) | Mot de passe du montage, utilisateur `source` | Identifiants, journal `error.log` |
| Coupures chez les auditeurs | Bande passante, `queue-size` trop petite, source instable | Débit plus bas, taille de file, flux de secours |
| Montage déjà utilisé | Autre source connectée | Une source par montage, ou `fallback-override` |
| Statistiques | `http://radio:8000/status-json.xsl` | Supervision du nombre d'auditeurs et de la présence de la source |
