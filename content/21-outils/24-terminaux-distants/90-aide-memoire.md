---
title: Mosh, Eternal Terminal et tmate — aide-mémoire
description: Commandes Mosh (connexion, options SSH, port UDP fixe, tmux, prédiction, sessions abandonnées, pare-feu), Eternal Terminal (service, pare-feu, port, tunnels -t/-r, rebond) et tmate (partage, adresses lecture seule, restriction par clés, session détachée, relais interne).
tags: [aide-mémoire, mosh, eternal terminal, et, tmate, ssh, terminal distant]
icon: terminal
---

Explications : [[01-mosh-eternal-terminal-tmate|Mosh, Eternal Terminal et tmate]].

| Outil | Port serveur | Paquet |
| --- | --- | --- |
| Mosh | UDP 60000-61000 (+ SSH 22) | `mosh` (client et serveur) |
| Eternal Terminal | TCP 2022 (+ SSH 22) | `et`, service `et` |
| tmate | aucun (sortant vers le relais, TCP 22) | `tmate` |

## Mosh

```bash
# Installation (les deux côtés)
sudo apt install mosh
sudo dnf install epel-release && sudo dnf install mosh
brew install mosh

# Pare-feu du serveur
sudo ufw allow 60000:61000/udp
sudo firewall-cmd --permanent --add-port=60000-61000/udp && sudo firewall-cmd --reload

# Connexions
mosh admin@srv-admin.corp.exemple.fr
mosh --ssh="ssh -p 2222 -i ~/.ssh/id_ed25519" admin@srv-admin.corp.exemple.fr
mosh -p 60001 admin@srv-admin.corp.exemple.fr                  # un seul port UDP
mosh admin@srv-admin.corp.exemple.fr -- tmux new-session -A -s main
mosh --predict=always admin@srv-admin.corp.exemple.fr          # lien très lent
mosh --family=inet6 admin@srv-admin.corp.exemple.fr
mosh --server=/usr/local/bin/mosh-server admin@srv-admin.corp.exemple.fr

# Sessions abandonnées (sur le serveur)
pgrep -u "$USER" -a mosh-server
pkill -u "$USER" mosh-server

# Locale UTF-8 manquante
sudo locale-gen fr_FR.UTF-8 && sudo update-locale LANG=fr_FR.UTF-8
```

Quitter une session figée : **Ctrl+^** puis **.**

## Eternal Terminal

```bash
# Installation
sudo add-apt-repository ppa:jgmath2000/et && sudo apt update && sudo apt install et
sudo dnf install et
brew install MisterTea/et/et

# Service et pare-feu (serveur)
sudo systemctl enable --now et
sudo systemctl status et
sudo ss -ltnp | grep 2022
sudo ufw allow 2022/tcp
sudo firewall-cmd --permanent --add-port=2022/tcp && sudo firewall-cmd --reload

# Connexions
et admin@srv-admin.corp.exemple.fr
et admin@srv-admin.corp.exemple.fr:2023                         # etserver sur un autre port
et -t 8080:80 admin@srv-admin.corp.exemple.fr                   # tunnel local
et -r 9000:3000 admin@srv-admin.corp.exemple.fr                 # tunnel inverse
et --jumphost srv-bastion.corp.exemple.fr admin@srv-interne.corp.exemple.fr
```

## tmate

```bash
# Installation
sudo apt install tmate
brew install tmate

# Partager
tmate
tmate show-messages
tmate display -p '#{tmate_ssh}'        # lecture-écriture
tmate display -p '#{tmate_ssh_ro}'     # lecture seule (SSH)
tmate display -p '#{tmate_web_ro}'     # lecture seule (navigateur)

# Restreindre aux clés autorisées
tmate -a ~/.ssh/authorized_keys

# Session détachée (script d'assistance)
tmate -S /tmp/tmate.sock new-session -d
tmate -S /tmp/tmate.sock wait tmate-ready
tmate -S /tmp/tmate.sock display -p '#{tmate_ssh_ro}'
tmate -S /tmp/tmate.sock kill-session

# Empreinte d'une clé d'hôte du relais interne (à reporter dans ~/.tmate.conf)
ssh-keygen -lf /etc/tmate-keys/ssh_host_ed25519_key.pub
```

```text ~/.tmate.conf
set -g tmate-server-host tmate.corp.exemple.fr
set -g tmate-server-port 22
set -g tmate-server-ed25519-fingerprint SHA256:remplacer-par-l-empreinte-ed25519-du-relais
set -g tmate-server-rsa-fingerprint SHA256:remplacer-par-l-empreinte-rsa-du-relais
```
