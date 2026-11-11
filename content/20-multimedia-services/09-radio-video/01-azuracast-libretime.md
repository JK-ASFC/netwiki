---
title: AzuraCast et LibreTime
description: Deux suites de radio web auto-hébergées — AzuraCast (tout-en-un Docker : Liquidsoap, Icecast ou Shoutcast, AutoDJ, comptes d'animateurs en direct, HLS, podcasts, statistiques ; script docker.sh, ports, sauvegarde) et LibreTime (héritier d'Airtime : grille d'émissions, calendrier, Liquidsoap et Icecast, entrées live ; Docker Compose) ; diffusion en direct depuis un logiciel d'animation.
tags: [azuracast, libretime, airtime, radio web, liquidsoap, icecast, autodj, streaming audio]
icon: radio
---

Ces deux suites transforment un serveur en **station de radio** : une bibliothèque de titres, une programmation automatique, des animateurs qui prennent l'antenne en direct, et des flux diffusés par **Icecast** (voir la page Icecast du wiki). Le moteur audio est **Liquidsoap** dans les deux cas.

| | AzuraCast | LibreTime |
| --- | --- | --- |
| Philosophie | Tout-en-un, **plusieurs stations** sur un serveur, très simple à installer | **Grille d'émissions** façon radio associative (calendrier, créneaux) |
| Programmation | Listes de lecture (rotation, horaires, jingles), AutoDJ | Émissions planifiées dans un calendrier, listes intelligentes |
| Direct | Comptes d'animateurs (*streamers*), bascule automatique | Entrées « master » et « show » (harbor Liquidsoap) |
| Diffusion | Icecast, Shoutcast, **HLS**, relais distants | Icecast, Shoutcast |
| Installation | Script `docker.sh` | Docker Compose |
| Licence | AGPL | AGPL |

## AzuraCast

```bash
sudo mkdir -p /var/azuracast && cd /var/azuracast
sudo curl -fsSL https://raw.githubusercontent.com/AzuraCast/AzuraCast/main/docker.sh -o docker.sh
sudo chmod a+x docker.sh
sudo ./docker.sh install            # installe Docker si besoin, pose les questions (ports, version stable)
```

Ouvrir `https://serveur/` pour créer le compte administrateur, puis la première **station**.

| Élément | Où |
| --- | --- |
| Musique | *Médias* de la station : téléversement, ou dossier sur le serveur (stockage par station) |
| Listes de lecture | Rotation générale, une chanson toutes les N, horaires programmés, jingles |
| Animateurs en direct | *Comptes d'animateurs* : identifiant et mot de passe pour BUTT, Mixxx, OBS (audio) ; port Liquidsoap de la station |
| Points de montage | Formats et débits (MP3, AAC, Opus), HLS pour les navigateurs mobiles |
| Statistiques | Auditeurs en temps réel, historiques, rapports |

Ports : 80 et 443 (interface et lecteurs web), puis une plage par station à partir de **8000** (flux Icecast, entrée des animateurs). Avec le reverse proxy intégré, les flux sont aussi accessibles en `https://serveur/listen/<station>/radio.mp3`.

```bash
sudo ./docker.sh update-self && sudo ./docker.sh update    # mise à jour
sudo ./docker.sh backup /var/azuracast/backups/azuracast.zip
sudo ./docker.sh restore /var/azuracast/backups/azuracast.zip
sudo ./docker.sh cli azuracast:account:reset-password admin@exemple.fr   # lien de réinitialisation du mot de passe
```

## LibreTime

LibreTime suit la procédure Docker Compose officielle : récupérer `docker-compose.yml`, `.env` et `config.yml` de la version voulue.

```bash
mkdir -p ~/libretime && cd ~/libretime
# Télécharger docker-compose.yml, .env et config.yml depuis la documentation de la version
nano config.yml                                       # public_url, mots de passe Icecast, fuseau horaire
docker compose run --rm api libretime-api migrate     # base de données
docker compose up -d
```

| Port | Usage |
| --- | --- |
| 8080 | Interface web |
| 8000 | Icecast (flux auditeurs) |
| 8001 / 8002 | Entrées live « master » et « show » (logiciel de l'animateur) |

Organisation : téléverser les titres, créer des **émissions** dans le **calendrier** (avec animateurs et rediffusions), remplir chaque créneau de listes ou de listes intelligentes. Hors émission, la station diffuse la liste « par défaut ».

## Prendre l'antenne

Logiciels d'animation : **BUTT** (simple), **Mixxx** (platines virtuelles), **OBS** (audio seul), Rocket Broadcaster. Paramètres : type Icecast, hôte du serveur, port d'entrée de la station, identifiant et mot de passe d'animateur, point de montage indiqué par la station.

> [!NOTE]
> Diffuser de la musique publiquement exige les **droits** correspondants (en France : déclarations et redevances auprès de la SACEM et de la SPRE), sauf musique libre de droits ou sous licence adaptée.

Voir aussi : [[02-owncast|Owncast]] · [[03-peertube|PeerTube]]. Commandes : [[90-aide-memoire|aide-mémoire]].
