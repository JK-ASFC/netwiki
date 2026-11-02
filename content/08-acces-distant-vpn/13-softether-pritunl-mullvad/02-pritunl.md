---
title: Pritunl
description: Pritunl — serveur VPN d'entreprise basé sur OpenVPN et WireGuard avec interface web (édition gratuite et éditions payantes) : architecture (MongoDB), installation sur Ubuntu, Debian et RHEL/Oracle Linux (dépôts officiels), configuration initiale (setup-key, default-password), organisations, utilisateurs, serveurs, routes, profils clients (Pritunl Client, OpenVPN), SSO et MFA selon l'édition, et Pritunl Zero.
tags: [pritunl, openvpn, wireguard, vpn, interface web, mongodb]
icon: info
---

**Pritunl** facilite le déploiement d'un VPN [[02-openvpn/01-presentation|OpenVPN]] (et WireGuard) via une **interface web** : on crée des organisations et des utilisateurs, on les attache à des serveurs, et chaque utilisateur télécharge son profil. L'édition gratuite couvre un serveur VPN simple ; les éditions payantes ajoutent SSO (Okta, Entra ID, Google…), haute disponibilité, réplication et routage avancé.

## Installation (Ubuntu 24.04)

Ajouter les dépôts **Pritunl** et **MongoDB** selon la documentation officielle (`docs.pritunl.com`, clés GPG publiées), puis :

```bash
sudo apt update && sudo apt install pritunl openvpn mongodb-org wireguard wireguard-tools
sudo systemctl enable --now mongod pritunl
sudo pritunl setup-key            # clé à saisir dans l'assistant web
sudo pritunl default-password     # identifiants initiaux
```

RHEL/Oracle Linux/Alma : dépôts `pritunl.repo` et `mongodb-org.repo` puis `dnf install pritunl mongodb-org`. Interface : `https://vpn.corp.exemple.fr` (certificat Let's Encrypt intégré possible).

## Mise en service

1. **Users → Add Organization** (`Corp`), puis **Add User** (nom, e-mail, PIN facultatif) ou import en masse.
2. **Servers → Add Server** : port UDP, réseau virtuel `10.11.0.0/24`, DNS, puis **Attach Organization** et **Add Route** (`10.0.0.0/8` au lieu de `0.0.0.0/0` pour un tunnel partagé).
3. **Start Server**.
4. Chaque utilisateur télécharge son profil (lien temporaire, URI `pritunl://`) et l'importe dans **Pritunl Client** (Windows, macOS, Linux) ou tout client OpenVPN.

```bash
sudo pritunl logs                 # journaux
sudo pritunl reset-password       # réinitialiser l'accès administrateur
```

**Pritunl Zero** (projet séparé) fournit un accès Zero Trust aux services web et SSH par certificats. Interface : [[04-interface-graphique|interfaces graphiques]].
