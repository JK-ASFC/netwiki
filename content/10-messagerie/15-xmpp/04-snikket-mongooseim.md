---
title: Snikket et MongooseIM
description: Snikket — service XMPP clé en main basé sur Prosody (conteneurs Docker, portail web d'administration, invitations par lien et QR code, clients Snikket Android/iOS, appels audio/vidéo avec TURN intégré) : DNS, ports, snikket.conf, installation par snikket-selfhosted, invitations, sauvegarde et mise à jour. MongooseIM (Erlang Solutions) — serveur XMPP haute disponibilité : paquets .deb/.rpm, Docker, Helm, mongooseim.toml, mongooseimctl (API GraphQL) et cluster.
tags: [xmpp, snikket, mongooseim, docker, prosody, erlang, helm]
icon: boxes
---

## Snikket

**Snikket** (Apache 2.0) est un service de messagerie XMPP **clé en main** pour une famille, une association ou une petite entreprise : un serveur [[01-prosody|Prosody]] préconfiguré, un **portail web** d'administration, des **invitations** par lien ou QR code, un serveur **TURN** intégré pour les appels et des applications dédiées (*Snikket* pour Android et iOS ; tout client XMPP fonctionne aussi). Il ne gère qu'un domaine et vise la simplicité plutôt que la personnalisation.

### DNS et ports

Enregistrements `A`/`AAAA` pour `chat.corp.exemple.fr`, plus `groups.chat.corp.exemple.fr` et `share.chat.corp.exemple.fr` en `CNAME` vers lui.

| Port | Rôle |
| --- | --- |
| 80, 443/tcp | Portail web, certificats Let's Encrypt, partage de fichiers |
| 5222/tcp | Clients |
| 5269/tcp | Fédération |
| 5000/tcp | Proxy de transfert de fichiers |
| 3478-3479/tcp et udp, 5349-5350/tcp et udp | STUN/TURN |
| 49152-65535/udp | Média des appels (TURN) |

### Installation (Linux, Docker Compose v2)

```bash
cd /opt && sudo git clone https://github.com/snikket-im/snikket-selfhosted snikket && cd snikket
sudo ./scripts/init.sh              # crée snikket.conf (domaine, courriel administrateur, accord Let's Encrypt)
sudo ./scripts/start.sh
sudo ./scripts/new-invite.sh --admin --group default      # lien d'invitation du premier administrateur
```

Le fichier `snikket.conf` contient l'essentiel :

```ini
SNIKKET_DOMAIN=chat.corp.exemple.fr
SNIKKET_ADMIN_EMAIL=admin@corp.exemple.fr
```

Quatre conteneurs (`snikket` : Prosody, `snikket-portal`, `snikket-proxy`, `snikket-certs`) partagent le volume `snikket_data`, en réseau hôte. Sous Windows ou macOS, passer par une VM Linux (le réseau hôte de Docker Desktop ne convient pas).

Ouvrir le lien d'invitation, créer le compte, puis gérer utilisateurs, invitations et cercles depuis le portail web `https://chat.corp.exemple.fr` (section d'administration visible des comptes administrateurs).

<!-- CAPTURE: Portail d'administration Snikket (utilisateurs et invitations) | _assets/snikket-portail.png -->

### Exploitation

```bash
cd /opt/snikket
sudo ./scripts/new-invite.sh --group default                      # invitation d'un utilisateur
sudo docker exec -it snikket prosodyctl mod_invites generate chat.corp.exemple.fr --admin --group default
sudo ./scripts/backup.sh /srv/sauvegardes                          # archive du volume /snikket
sudo ./scripts/update.sh                                           # nouvelles images, redémarrage
sudo docker logs -f snikket
```

## MongooseIM

**MongooseIM** (Erlang Solutions, Apache 2.0) est un serveur XMPP en **Erlang** conçu pour la **haute disponibilité** et les grands volumes (opérateurs, applications grand public) : cluster natif, stockage PostgreSQL/MySQL/Cassandra, API **GraphQL** d'administration et d'utilisateur, notifications push (MongoosePush), métriques Prometheus. Il s'adresse aux équipes qui intègrent la messagerie dans leur propre application plutôt qu'aux déploiements de bureau.

### Installation

```bash
# Ubuntu / Debian, AlmaLinux / Rocky : paquet de la page de téléchargement (trymongoose.im) ou des versions GitHub
sudo dpkg -i ./mongooseim_6.10.0-1_amd64.deb         # nom selon la distribution choisie
sudo rpm -i ./mongooseim-6.10.0-1.x86_64.rpm
mongooseimctl start ; mongooseimctl status

# conteneur (configuration montée dans /member)
docker run -dt -h mongooseim-1 --name mongooseim-1 -p 5222:5222 -v ./mongooseim-1:/member docker.trymongoose.im/mongooseim

# Kubernetes (après ajout du dépôt Helm « mongoose » décrit sur trymongoose.im)
helm install mongooseim mongoose/mongooseim
```

Configuration principale : `/etc/mongooseim/mongooseim.toml` (format TOML) ; journaux : `/var/log/mongooseim/mongooseim.log`.

```toml
[general]
  hosts = ["corp.exemple.fr"]
  default_server_domain = "corp.exemple.fr"
  loglevel = "notice"

[modules.mod_muc]
  host = "salons.@HOST@"

[modules.mod_mam]
  pm.backend = "rdbms"        # historique des messages privés (base SQL)
  muc.backend = "rdbms"       # historique des salons (pool [outgoing_pools.rdbms] vers PostgreSQL requis)
```

### Administration

`mongooseimctl` appelle l'API GraphQL d'administration :

```bash
mongooseimctl account registerUser --username jk --domain corp.exemple.fr --password 'MdpTemporaire2026!'
mongooseimctl account listUsers --domain corp.exemple.fr
mongooseimctl account checkUser --user jk@corp.exemple.fr
mongooseimctl account removeUser --user ancien.agent@corp.exemple.fr
mongooseimctl roster addContact --user jk@corp.exemple.fr --contact support@corp.exemple.fr --groups '["Équipe"]' --name Support
mongooseimctl get_loglevel
```

Cluster en conteneurs : variables `JOIN_CLUSTER=true` et `CLUSTER_WITH=mongooseim@srv-xmpp-01` au démarrage des nœuds supplémentaires.

Commandes des deux produits : [[90-aide-memoire|aide-mémoire]].
