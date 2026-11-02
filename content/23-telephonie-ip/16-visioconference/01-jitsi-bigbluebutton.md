---
title: Visioconférence auto-hébergée — Jitsi Meet, BigBlueButton et Galène
description: Héberger sa visioconférence — Jitsi Meet (architecture Prosody, Jicofo, Jitsi Videobridge ; installation par paquets Debian/Ubuntu ou Docker ; ports ; authentification par domaine sécurisé ou JWT ; passerelle téléphonique Jigasi ; dimensionnement), BigBlueButton (classe virtuelle, installation bbb-install sur Ubuntu, Greenlight, intégration LMS), Galène (serveur léger en Go, galenectl, TURN intégré), clients Windows, macOS, Linux et mobiles, sécurité et dépannage.
tags: [visioconférence, jitsi, bigbluebutton, webrtc, prosody, jvb, greenlight]
icon: video
---

## Jitsi Meet

**Jitsi Meet** (8x8, libre) offre des réunions vidéo dans le navigateur (WebRTC), sans compte pour les participants.

| Composant | Rôle |
| --- | --- |
| Nginx + interface web | Application dans le navigateur |
| **Prosody** | Serveur XMPP (signalisation, salles, authentification) |
| **Jicofo** | Chef d'orchestre des conférences |
| **Jitsi Videobridge** (JVB) | Routeur média SFU (relaie la vidéo sans la mélanger) |
| Jigasi | Passerelle SIP (participants par téléphone, voir [[02-asterisk/01-presentation-installation\|Asterisk]]) |
| Jibri | Enregistrement et diffusion en direct |

### Installation (Debian 12 / Ubuntu 24.04)

```bash
sudo hostnamectl set-hostname visio.exemple.fr
curl -sL https://download.jitsi.org/jitsi-key.gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/jitsi-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/jitsi-keyring.gpg] https://download.jitsi.org stable/" | sudo tee /etc/apt/sources.list.d/jitsi-stable.list
sudo apt update && sudo apt install -y jitsi-meet
# l'installation demande le nom d'hôte et propose un certificat Let's Encrypt
```

Docker : dépôt `jitsi/docker-jitsi-meet` (fichier `.env`, `docker compose up -d`), pratique pour les tests et les déploiements conteneurisés.

| Port | Usage |
| --- | --- |
| TCP 80/443 | Web, signalisation |
| **UDP 10000** | Média (JVB) — indispensable |
| TCP 4443 | Repli média (selon version) |

### Réserver la création de salles (domaine sécurisé)

```lua
-- /etc/prosody/conf.avail/visio.exemple.fr.cfg.lua
VirtualHost "visio.exemple.fr"
    authentication = "internal_hashed"

VirtualHost "guest.visio.exemple.fr"
    authentication = "anonymous"
    c2s_require_encryption = false
```

Puis déclarer le domaine invité dans `/etc/jitsi/meet/visio.exemple.fr-config.js` (`anonymousdomain: 'guest.visio.exemple.fr'`), configurer Jicofo pour exiger l'authentification, redémarrer les services et créer les comptes organisateurs :

```bash
sudo prosodyctl register organisateur visio.exemple.fr 'MotDePasseOrganisateur2026'
sudo systemctl restart prosody jicofo jitsi-videobridge2
```

Pour une authentification centralisée : **JWT** (jetons émis par une application), LDAP via Prosody, ou SSO.

### Dimensionnement

Le JVB consomme surtout de la **bande passante** et du CPU : comptez environ 1 à 3 Mbit/s par participant en vidéo HD selon la mise en page ; au-delà de quelques dizaines de participants simultanés, ajoutez des JVB (Octo/répartition).

## BigBlueButton

**BigBlueButton** est une classe virtuelle libre : tableau blanc, présentation, sondages, salles de sous-groupes, enregistrement, intégration aux LMS (Moodle).

```bash
# Ubuntu 22.04 (serveur dédié, nom DNS public, ports 80/443 et UDP 16384-32768 ouverts)
wget -qO- https://raw.githubusercontent.com/bigbluebutton/bbb-install/v3.0.x-release/bbb-install.sh | \
  sudo bash -s -- -v jammy-300 -s bbb.exemple.fr -e admin@exemple.fr -g
```

L'option `-g` installe **Greenlight** (interface d'accueil : comptes, salles permanentes, enregistrements). Vérifications : `sudo bbb-conf --check`, `sudo bbb-conf --status`, secret d'API : `sudo bbb-conf --secret`.

## Galène

**Galène** (MIT, écrit en Go par Juliusz Chroboczek) est un serveur de visioconférence **très léger** : un seul binaire, aucune base de données, des groupes décrits en JSON, un serveur TURN intégré. Il convient aux cours, réunions et séminaires sur une petite machine (quelques centaines de participants sur un serveur modeste) et fonctionne sous Linux, Windows et macOS.

```bash
git clone https://github.com/jech/galene && cd galene
CGO_ENABLED=0 go build -ldflags='-s -w'
(cd galenectl && go build -ldflags='-s -w' && sudo cp galenectl /usr/local/bin/)
sudo useradd --system --create-home galene
mkdir groups data && sudo rsync -a galene static data groups /home/galene/ && sudo chown -R galene:galene /home/galene
sudo cp /etc/letsencrypt/live/visio.exemple.fr/fullchain.pem /home/galene/data/cert.pem
sudo cp /etc/letsencrypt/live/visio.exemple.fr/privkey.pem /home/galene/data/key.pem && sudo chown galene:galene /home/galene/data/*.pem
```

Unité systemd `/etc/systemd/system/galene.service` :

```ini
[Unit]
Description=Galene
After=network.target
[Service]
Type=simple
WorkingDirectory=/home/galene
User=galene
Group=galene
ExecStart=/home/galene/galene
LimitNOFILE=65536
[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now galene
galenectl -admin-username admin initial-setup          # crée galenectl.json et config.json (à copier dans data/)
galenectl create-group -group cours-reseau
galenectl create-user -group cours-reseau -user jk -permissions op
galenectl set-password -group cours-reseau -user jk
galenectl list-groups ; galenectl list-users -l -group cours-reseau
```

Accès : `https://visio.exemple.fr:8443/group/cours-reseau/`. Ports : **8443/tcp** (web, modifiable par `-http`), **1194/tcp et udp** (TURN intégré, option `-turn`) et une plage UDP pour le média (`-udp-range 20000-40000` pour la restreindre). Sous Windows : `set CGO_ENABLED=0` puis `go build`, et lancer `galene.exe` dans le dossier contenant `static`, `data` et `groups`.

## Clients

| Plateforme | Client |
| --- | --- |
| Windows, macOS, Linux | Navigateur (Chrome, Edge, Firefox) ; application Jitsi Meet Electron |
| Android, iOS | Applications Jitsi Meet ; BigBlueButton dans le navigateur |

## Sécurité et dépannage

- [ ] Création de salles réservée aux utilisateurs authentifiés, salles protégées par mot de passe ou salle d'attente (*lobby*)
- [ ] Mises à jour régulières (Jitsi, Prosody, BigBlueButton, système)
- [ ] Certificat valide (WebRTC exige HTTPS)

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Participants qui se voient à deux mais pas à trois | Port UDP 10000 bloqué (JVB) | Ouvrir/rediriger UDP 10000, adresse publique du JVB derrière NAT |
| Caméra/micro refusés | Page non HTTPS, autorisations du navigateur | Certificat, autoriser l'accès |
| BigBlueButton : audio impossible | Ports UDP 16384–32768, FreeSWITCH interne | `bbb-conf --check`, pare-feu |
