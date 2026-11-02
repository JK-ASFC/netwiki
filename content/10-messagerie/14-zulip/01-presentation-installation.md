---
title: Présentation, installation et exploitation
description: Zulip — messagerie d'équipe libre (Apache 2.0) organisée en canaux et sujets (topics), lecture asynchrone, recherche, intégrations ; architecture (Django, PostgreSQL, RabbitMQ, memcached, Redis, Tornado, nginx), prérequis (Ubuntu 22.04/24.04/26.04, Debian 12/13, 2 Go de RAM), installateur officiel avec certbot, création de l'organisation, configuration (/etc/zulip/settings.py, zulip.conf, zulip-secrets.conf), reverse proxy, authentification (LDAP, SAML, OpenID Connect), notifications push, image Docker officielle, sauvegarde et restauration (manage.py backup, restore-backup), mise à jour (upgrade-zulip), commandes manage.py et dépannage.
tags: [zulip, chat, messagerie d'équipe, topics, django, postgresql, ubuntu, debian]
icon: download
---

**Zulip** est une messagerie d'équipe libre (Apache 2.0) dont l'originalité est le **sujet** (*topic*) : chaque message d'un **canal** appartient à un sujet nommé, ce qui permet de suivre plusieurs conversations en parallèle et de rattraper son retard sans tout relire. Il convient particulièrement aux équipes distribuées, aux projets libres et aux structures qui travaillent en asynchrone. Alternatives : [[12-mattermost/01-presentation-installation|Mattermost]], [[13-rocketchat/01-presentation-installation|Rocket.Chat]], [[11-matrix/01-synapse-ess|Matrix]].

| Composant | Rôle |
| --- | --- |
| Django (Python) | Application et API REST |
| Tornado | Événements en temps réel (*long polling*) |
| PostgreSQL | Messages, utilisateurs (recherche plein texte intégrée) |
| RabbitMQ | Files de tâches (courriels, notifications, intégrations) |
| memcached, Redis | Cache et limitation de débit |
| nginx | Serveur web frontal (installé et configuré par Zulip) |

Ports exposés : **443/tcp** (et 80 pour la redirection et certbot), 25/tcp en option pour recevoir des courriels dans les canaux.

## Prérequis

- **Ubuntu 22.04, 24.04 ou 26.04**, ou **Debian 12 ou 13**, 64 bits, machine **dédiée** (l'installateur configure nginx, PostgreSQL, RabbitMQ…).
- Au moins **2 Go de RAM** (avec 2 Go de *swap* si moins de 5 Go) ; 4 Go et 2 vCPU au-delà de 100 utilisateurs ; 10 Go d'espace libre.
- Un nom DNS (`chat.corp.exemple.fr`) et un relais SMTP pour les courriels sortants.
- Autres systèmes (RHEL, Windows, macOS) : utiliser l'**image Docker** officielle ou une VM Ubuntu/Debian.

## Installation (installateur officiel)

```bash
cd $(mktemp -d)
curl -fLO https://download.zulip.com/server/zulip-server-latest.tar.gz
tar -xf zulip-server-latest.tar.gz
sudo ./zulip-server-*/scripts/setup/install --certbot --email=admin@corp.exemple.fr --hostname=chat.corp.exemple.fr
```

| Option | Effet |
| --- | --- |
| `--hostname` | Nom d'accès des utilisateurs |
| `--email` | Adresse de l'administrateur (alertes, certificats) |
| `--certbot` | Certificat Let's Encrypt automatique (serveur joignable sur le port 80) |
| `--self-signed-cert` | Certificat autosigné (réseau interne, à remplacer ensuite) |
| `--push-notifications` | Notifications mobiles via le service de Zulip (gratuit en dessous d'un seuil d'utilisateurs) |
| `--no-submit-usage-statistics` | Pas d'envoi de statistiques d'usage |

En fin d'installation, le script affiche un **lien unique de création d'organisation** : l'ouvrir pour créer l'organisation et le compte propriétaire. Nouveau lien : `su zulip -c '/home/zulip/deployments/current/manage.py generate_realm_creation_link'`.

<!-- CAPTURE: Page de création de l'organisation Zulip | _assets/zulip-creation-organisation.png -->

## Docker

Image officielle `ghcr.io/zulip/zulip-server` (version suivant celle de Zulip, par exemple `12.3-0`) et fichier `compose.yaml` du dépôt `zulip/docker-zulip` (PostgreSQL, memcached, RabbitMQ, Redis, secrets Docker). L'ancienne image `zulip/docker-zulip` du Docker Hub n'est plus suivie après la série 11.x. Le déploiement Docker demande plus de travail de maintenance que l'installateur : le réserver aux organisations déjà outillées pour Docker ou Kubernetes.

## Configuration

| Fichier | Contenu |
| --- | --- |
| `/etc/zulip/settings.py` | Réglages : `EXTERNAL_HOST`, `ZULIP_ADMINISTRATOR`, SMTP (`EMAIL_HOST`, `EMAIL_HOST_USER`, `EMAIL_PORT`, `EMAIL_USE_TLS`), `AUTHENTICATION_BACKENDS`, LDAP, SAML |
| `/etc/zulip/zulip-secrets.conf` | Mots de passe et secrets (`email_password`, clés) |
| `/etc/zulip/zulip.conf` | Déploiement : `[application_server] http_only`, `[loadbalancer] ips`, port nginx |
| `/var/log/zulip/` | Journaux (`server.log`, `errors.log`, `workers.log`) |

Après chaque modification de `settings.py` :

```bash
su zulip -c '/home/zulip/deployments/current/scripts/restart-server'
```

Tester l'envoi de courriels : `su zulip -c '/home/zulip/deployments/current/manage.py send_test_email admin@corp.exemple.fr'`.

### Derrière un reverse proxy

Dans `/etc/zulip/zulip.conf`, déclarer l'adresse du proxy pour que Zulip lui fasse confiance (adresse IP réelle des clients), et éventuellement servir en HTTP derrière lui :

```ini
[application_server]
http_only = true

[loadbalancer]
ips = 10.0.20.5
```

Puis `sudo /home/zulip/deployments/current/scripts/zulip-puppet-apply`. Le proxy ([[03-nginx/05-reverse-proxy-repartition|NGINX]], [[01-haproxy/01-presentation|HAProxy]]) doit transmettre `X-Forwarded-For` et `X-Forwarded-Proto` et autoriser les requêtes longues (*long polling*, délai ≥ 20 min).

### Authentification

`AUTHENTICATION_BACKENDS` dans `settings.py` : courriel et mot de passe (`EmailAuthBackend`), **LDAP/Active Directory** (`ZulipLDAPAuthBackend`, synchronisation des noms et groupes par `manage.py sync_ldap_user_data`), **SAML** (ADFS, Keycloak, Entra ID), **OpenID Connect** (`GenericOpenIdConnectBackend`), GitHub, GitLab, Google. Voir [[05-keycloak/01-presentation-installation|Keycloak]].

## Sauvegarde et restauration

```bash
su zulip -c '/home/zulip/deployments/current/manage.py backup --output=/srv/sauvegardes/zulip-$(date +%F).tar.gz'
# restauration sur un serveur fraîchement installé, même version de Zulip et de PostgreSQL :
sudo /home/zulip/deployments/current/scripts/setup/restore-backup /srv/sauvegardes/zulip-2026-11-02.tar.gz
```

L'archive contient la base, les fichiers envoyés et la configuration (`/etc/zulip`). Pour changer de version ou d'hébergeur, préférer l'**export logique** (`manage.py export`) puis l'import.

## Mise à jour

```bash
cd $(mktemp -d) && curl -fLO https://download.zulip.com/server/zulip-server-latest.tar.gz
sudo /home/zulip/deployments/current/scripts/upgrade-zulip zulip-server-latest.tar.gz
```

Le script installe la nouvelle version à côté de l'ancienne (`/home/zulip/deployments/`), applique les migrations et bascule ; l'interruption dure quelques minutes. Après une mise à jour majeure, comparer la configuration avec le modèle : `/home/zulip/deployments/current/scripts/setup/compare-settings-to-template`.

## Clients

Web, bureau (`winget install --id Zulip.Zulip -e`, `brew install --cask zulip`, paquets .deb/.rpm/AppImage) et mobiles (App Store, Google Play), en saisissant `https://chat.corp.exemple.fr`. Le terminal dispose aussi de `zulip-term`.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Erreur 502 après modification | Service non redémarré, erreur de syntaxe dans `settings.py` | `restart-server`, `/var/log/zulip/errors.log` |
| Pas de courriels (invitations, mots de passe) | SMTP mal configuré | `manage.py send_test_email`, `email_password` dans les secrets |
| Adresses IP des clients toutes identiques | Proxy non déclaré | `[loadbalancer] ips`, `zulip-puppet-apply` |
| Messages en retard ou « déconnecté » | Délai trop court sur le proxy | Augmenter le délai de lecture (long polling) |
| Pas de notifications mobiles | Serveur non enregistré auprès du service push | `su zulip -c '/home/zulip/deployments/current/manage.py register_server'` |

Interface : [[02-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
