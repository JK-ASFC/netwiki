---
title: Mopidy
description: Mopidy, serveur de musique extensible en Python (Apache 2.0) qui joue sur la sortie audio du serveur — installation sur Debian et Raspberry Pi, mopidy.conf, extensions (Local, MPD, Iris, Spotify, SoundCloud, radios), analyse de la bibliothèque, clients MPD (ncmpcpp, MALP), diffusion vers Icecast ou Snapcast pour le multiroom, ports 6680 et 6600.
tags: [mopidy, mpd, iris, raspberry pi, musique, snapcast, icecast]
icon: music
---

**Mopidy** joue la musique **sur la machine où il tourne** (Raspberry Pi relié à un ampli, poste de salon) et se pilote à distance : interface web (Iris), clients **MPD**, applications. Ses **extensions** ajoutent des sources : bibliothèque locale, radios, podcasts, services de streaming.

## Installation

```bash
sudo apt install mopidy mopidy-local mopidy-mpd   # Debian, Raspberry Pi OS (dépôt du projet pour les versions récentes)
sudo python3 -m pip install --break-system-packages Mopidy-Iris   # interface web Iris (ou paquet de la distribution)
sudo systemctl enable --now mopidy                # service système (utilisateur mopidy)
```

En service système, la configuration est **`/etc/mopidy/mopidy.conf`** et les commandes passent par `mopidyctl` ; en utilisateur, `~/.config/mopidy/mopidy.conf` et `mopidy`.

```ini /etc/mopidy/mopidy.conf
[core]
data_dir = /var/lib/mopidy

[audio]
output = autoaudiosink
mixer_volume = 60

[http]
hostname = 0.0.0.0
port = 6680

[mpd]
hostname = 0.0.0.0
port = 6600

[local]
media_dir = /srv/musique
scan_flush_threshold = 1000

[iris]
country = FR
locale = fr_FR
```

```bash
sudo mopidyctl config               # configuration effective (mots de passe masqués)
sudo mopidyctl local scan           # analyser la bibliothèque locale
sudo systemctl restart mopidy
```

## Extensions utiles

| Extension | Rôle |
| --- | --- |
| Mopidy-Local | Bibliothèque de fichiers locaux |
| Mopidy-MPD | Compatibilité avec les clients MPD |
| Mopidy-Iris | Interface web complète (port 6680) |
| Mopidy-TuneIn, Mopidy-Podcast | Radios et podcasts |
| Mopidy-Spotify, Mopidy-YouTube, Mopidy-SoundCloud | Services en ligne (selon l'état de leur API et de l'extension) |
| Mopidy-Scrobbler | Envoi des écoutes vers Last.fm |

## Clients

- **Iris** : `http://serveur:6680/iris`.
- **Clients MPD** : `ncmpcpp` ou `mpc` dans un terminal, MALP ou M.A.L.P. sur Android, Cantata sur le bureau.

```bash
mpc -h serveur status ; mpc -h serveur play ; mpc -h serveur volume 40
```

## Multiroom

Mopidy joue sur une seule sortie. Pour plusieurs pièces, envoyer le flux audio vers **Snapcast** (lecture synchronisée sur plusieurs clients) ou vers **Icecast** :

```ini
[audio]
# Snapcast : écrire dans le tube lu par snapserver
output = audioresample ! audioconvert ! audio/x-raw,rate=48000,channels=2,format=S16LE ! filesink location=/tmp/snapfifo
```

> [!WARNING]
> Mopidy n'a **pas d'authentification** sur ses ports HTTP et MPD : limitez l'écoute au réseau local (pare-feu sur 6680 et 6600) et ne l'exposez jamais sur Internet.

Voir aussi : [[01-comparatif|choisir un serveur de musique]] et la page Icecast du wiki. Commandes : [[90-aide-memoire|aide-mémoire]].
