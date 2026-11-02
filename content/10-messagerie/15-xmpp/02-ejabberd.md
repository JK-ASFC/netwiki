---
title: ejabberd
description: ejabberd (ProcessOne, Erlang, GPL) — serveur XMPP à grande échelle (et MQTT, SIP) : installation (paquets .deb/.rpm et installateur .run officiels, paquets des distributions, Homebrew, conteneurs ghcr.io/processone/ejabberd et ejabberd/ecs pour Linux, Windows et macOS), configuration ejabberd.yml (hosts, listen, certificats ACME, ACL et access_rules, MAM, MUC, HTTP Upload, base SQL), comptes et administration (ejabberdctl, interface web /admin, API HTTP), cluster, sauvegarde, mise à jour et dépannage.
tags: [xmpp, ejabberd, erlang, messagerie instantanée, mqtt, cluster]
icon: server
---

**ejabberd** (ProcessOne, GPL v2) est un serveur XMPP écrit en **Erlang**, réputé pour sa tenue en charge (des millions de connexions en cluster) ; il sert aussi de courtier **MQTT** et de serveur STUN/TURN. Il convient aux grands déploiements et aux équipes qui veulent une interface web et une API d'administration complètes. Présentation du protocole : [[01-prosody|XMPP et Prosody]].

Versions numérotées par date : `AA.MM` (par exemple 26.09).

## Installation

| Méthode | Emplacements |
| --- | --- |
| Paquets officiels `.deb` / `.rpm` / `.run` (GitHub Releases) | Binaires dans `/opt/ejabberd-AA.MM/`, configuration, base et journaux dans `/opt/ejabberd/` |
| Paquets des distributions (Debian, Ubuntu, Fedora, Alpine, Arch, FreeBSD…) | `/etc/ejabberd/ejabberd.yml`, `/var/log/ejabberd/` |
| Conteneur (Linux, Windows, macOS) | Volume `/opt/ejabberd/conf`, `/opt/ejabberd/database` |

```bash
# Debian / Ubuntu : paquet officiel (contient son propre Erlang)
V=26.09
wget https://github.com/processone/ejabberd/releases/download/$V/ejabberd_$V-1_amd64.deb
sudo apt install -y ./ejabberd_$V-1_amd64.deb
sudo systemctl enable --now ejabberd

# ou paquet de la distribution (version parfois plus ancienne)
sudo apt install -y ejabberd

# RHEL / Rocky / Alma / Fedora : installateur universel
wget https://github.com/processone/ejabberd/releases/download/$V/ejabberd-$V-1-linux-x64.run
chmod +x ejabberd-$V-1-linux-x64.run && sudo ./ejabberd-$V-1-linux-x64.run

brew install ejabberd                                   # macOS
sudo pkg install ejabberd                               # FreeBSD
```

**Windows** : il n'y a plus d'installateur natif ; utiliser le conteneur dans Docker Desktop (ou WSL 2).

```bash
docker run --name ejabberd -d -p 5222:5222 -p 5269:5269 -p 5280:5280 -p 5443:5443 \
  -e EJABBERD_MACRO_HOST=corp.exemple.fr -e EJABBERD_MACRO_ADMIN=admin@corp.exemple.fr \
  -v /srv/ejabberd/database:/opt/ejabberd/database ghcr.io/processone/ejabberd
docker exec -it ejabberd ejabberdctl register admin corp.exemple.fr 'MdpAdmin2026!'
```

L'image `ghcr.io/processone/ejabberd` est minimale ; `ejabberd/ecs` (Docker Hub) est la variante historique, également maintenue.

## Configuration (ejabberd.yml)

```yaml
hosts:
  - corp.exemple.fr

certfiles:
  - /etc/ejabberd/certs/*.pem

acme:
  contact: "mailto:admin@corp.exemple.fr"
  auto: true                                # certificats Let's Encrypt (port 80 vers 5280)

listen:
  - port: 5222
    module: ejabberd_c2s
    starttls_required: true
  - port: 5269
    module: ejabberd_s2s_in
  - port: 5443
    module: ejabberd_http
    tls: true
    request_handlers:
      /admin: ejabberd_web_admin
      /api: mod_http_api
      /bosh: mod_bosh
      /ws: ejabberd_http_ws
      /upload: mod_http_upload
  - port: 5280
    module: ejabberd_http
    request_handlers:
      /.well-known/acme-challenge: ejabberd_acme

acl:
  admin:
    user: admin@corp.exemple.fr

access_rules:
  configure:
    allow: admin

# stockage SQL (sinon Mnesia, base Erlang intégrée)
sql_type: pgsql
sql_server: localhost
sql_database: ejabberd
sql_username: ejabberd
sql_password: MdpEjabberd2026
default_db: sql

modules:
  mod_mam:
    default: always
  mod_muc:
    host: salons.@HOST@
    default_room_options:
      mam: true
  mod_http_upload:
    put_url: https://@HOST@:5443/upload
    max_size: 104857600
  mod_register:
    access: none                            # pas d'inscription libre
```

Le fichier fourni contient la liste complète des modules usuels (`mod_carbons`, `mod_stream_mgmt`, `mod_push`, `mod_pubsub`, `mod_vcard`, `mod_stun_disco`…). Vérifier puis appliquer sans couper les connexions :

```bash
sudo ejabberdctl reload_config
sudo ejabberdctl request_certificate all       # si acme est configuré
```

Authentification **LDAP / Active Directory** : `auth_method: ldap`, `ldap_servers`, `ldap_base`, `ldap_uids` (voir [[01-active-directory/01-presentation|Active Directory]]).

## Administration

```bash
sudo ejabberdctl status
sudo ejabberdctl register jk corp.exemple.fr 'MdpTemporaire2026!'
sudo ejabberdctl change_password jk corp.exemple.fr 'NouveauMdp2026!'
sudo ejabberdctl unregister ancien.agent corp.exemple.fr
sudo ejabberdctl registered_users corp.exemple.fr
sudo ejabberdctl connected_users
sudo ejabberdctl create_room support salons.corp.exemple.fr corp.exemple.fr
sudo ejabberdctl help                         # liste des commandes
```

L'**interface web** (`https://xmpp.corp.exemple.fr:5443/admin/`, compte administrateur JID + mot de passe) affiche utilisateurs, sessions, salons, statistiques des nœuds et permet la plupart des actions de `ejabberdctl`.

<!-- CAPTURE: Interface web d'ejabberd, page des utilisateurs du domaine | _assets/ejabberd-webadmin.png -->

L'**API HTTP** (`/api`, module `mod_http_api`) expose les mêmes commandes en JSON pour l'automatisation (droits définis par `api_permissions`).

## Cluster

Plusieurs nœuds partagent la même base Mnesia (ou SQL) : sur le nouveau nœud, même cookie Erlang et nom de nœud résoluble, puis :

```bash
sudo ejabberdctl --no-timeout join_cluster ejabberd@srv-xmpp-01
sudo ejabberdctl list_cluster
```

## Sauvegarde, mise à jour

```bash
sudo ejabberdctl backup /srv/sauvegardes/ejabberd-$(date +%F).backup      # base Mnesia
sudo ejabberdctl restore /srv/sauvegardes/ejabberd-2026-11-02.backup
```

En stockage SQL, sauvegarder la base ([[02-postgresql/05-sauvegarde-pitr|PostgreSQL]]) et `ejabberd.yml`. Mise à jour : installer le nouveau paquet (le service est relancé, les schémas SQL sont mis à jour automatiquement si `update_sql_schema: true`) ; en cluster, nœud par nœud.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| `ejabberdctl` : « Failed RPC connection » | Nœud arrêté, nom de nœud ou cookie différents | `systemctl status ejabberd`, lancer `ejabberdctl` avec l'utilisateur du service |
| Clients refusés en TLS | Certificat absent ou ne couvrant pas le domaine | `certfiles`, `request_certificate all` |
| Administration web refusée | Compte absent de l'ACL `admin` | Section `acl`, `reload_config` |
| Historique non conservé | `mod_mam` absent ou `default: never` | Activer `mod_mam` |

Journaux : `/opt/ejabberd/logs/ejabberd.log` (paquets officiels) ou `/var/log/ejabberd/ejabberd.log`. Commandes : [[90-aide-memoire|aide-mémoire]].
