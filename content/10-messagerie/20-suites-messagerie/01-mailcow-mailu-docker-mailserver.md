---
title: Mailcow, Mailu et docker-mailserver
description: Suites de messagerie en conteneurs — Mailcow (Postfix, Dovecot, Rspamd, ClamAV, SOGo, interface d'administration ; mailcow-dockerized, generate_config.sh, admin/moohoo, update.sh, backup_and_restore.sh), Mailu (Postfix, Dovecot, Rspamd, Roundcube ou SnappyMail ; assistant setup.mailu.io, mailu.env, flask mailu admin) et docker-mailserver (sans interface web, configuration par fichiers ; compose.yaml, mailserver.env, commande setup email add, alias, DKIM), prérequis (IP fixe, PTR, ports), DNS (MX, SPF, DKIM, DMARC), sauvegarde, mise à jour et dépannage.
tags: [mailcow, mailu, docker-mailserver, messagerie, postfix, dovecot, rspamd, docker]
icon: mails
---

Ces suites assemblent [[01-postfix/01-presentation|Postfix]], [[02-dovecot/01-presentation-installation|Dovecot]], [[04-rspamd/01-presentation-installation|Rspamd]], ClamAV et un webmail dans des conteneurs préconfigurés. Elles évitent des jours d'intégration, au prix d'une architecture imposée.

| | **Mailcow** | **Mailu** | **docker-mailserver** |
| --- | --- | --- | --- |
| Licence | GPL v3 | MIT | MIT |
| Interface d'administration | Complète (domaines, boîtes, alias, quotas, DKIM, 2FA, journaux) | Oui (domaines, utilisateurs, alias, relais) | **Non** : CLI `setup` et fichiers |
| Webmail | SOGo (agenda et contacts inclus) | Roundcube ou SnappyMail | Aucun (à ajouter) |
| Ressources | 6 Go de RAM conseillés | 2 à 4 Go | 1 à 2 Go |
| Cible | PME, hébergeurs, usage complet | Petites structures | Administrateurs à l'aise avec les fichiers |

## Prérequis communs

- Serveur Linux dédié, **adresse IP fixe** avec enregistrement inverse (**PTR**) égal au nom d'hôte (`mail.corp.exemple.fr`), adresse non listée dans les listes noires (vérifier avant).
- Ports entrants : **25** (réception), **465** et **587** (soumission), **993** (IMAPS), 143, 110/995 selon les besoins, **80/443** (interface, Let's Encrypt). Le port 25 sortant ne doit pas être bloqué par l'hébergeur.
- DNS : `MX` → `mail.corp.exemple.fr`, **SPF** (`v=spf1 mx -all`), **DKIM** (clé générée par la suite), **DMARC** (`v=DMARC1; p=quarantine; rua=mailto:dmarc@corp.exemple.fr`), et éventuellement `autoconfig`/`autodiscover`, MTA-STS.
- Docker Engine et le plugin Compose ; aucun autre serveur de messagerie sur l'hôte.

## Mailcow

```bash
umask 0022
cd /opt && sudo git clone https://github.com/mailcow/mailcow-dockerized && cd mailcow-dockerized
sudo ./generate_config.sh          # nom d'hôte (mail.corp.exemple.fr), fuseau horaire, branche
sudo docker compose pull
sudo docker compose up -d
```

Ouvrir `https://mail.corp.exemple.fr/admin` avec **`admin` / `moohoo`** et changer immédiatement le mot de passe (activer la 2FA). Créer le domaine, récupérer la **clé DKIM** (*Configuration → Configuration des domaines → ARC/DKIM*), puis les boîtes aux lettres. Le webmail SOGo est sur `https://mail.corp.exemple.fr/SOGo`. Réglages dans `mailcow.conf`.

<!-- CAPTURE: Interface d'administration Mailcow (domaines et boîtes) | _assets/mailcow-administration.png -->

```bash
cd /opt/mailcow-dockerized
sudo ./update.sh                                                         # mise à jour (images et dépôt)
sudo MAILCOW_BACKUP_LOCATION=/srv/sauvegardes/mailcow ./helper-scripts/backup_and_restore.sh backup all --delete-days 7
sudo MAILCOW_BACKUP_LOCATION=/srv/sauvegardes/mailcow ./helper-scripts/backup_and_restore.sh restore
sudo docker compose logs -f postfix-mailcow
```

## Mailu

```bash
sudo mkdir /mailu && cd /mailu
# Générer docker-compose.yml et mailu.env avec l'assistant https://setup.mailu.io (version, domaine, fonctions, webmail), puis les télécharger ici
sudo docker compose up -d
sudo docker compose exec admin flask mailu admin admin corp.exemple.fr 'MdpAdminMailu2026!'
```

Le compte créé (`admin@corp.exemple.fr`) accède à l'administration (`https://mail.corp.exemple.fr/admin`) ; le webmail est sur `/webmail`. Créer un utilisateur ou un alias correspondant à `POSTMASTER` de `mailu.env`, sans quoi des erreurs apparaissent. La création automatique de l'administrateur est aussi possible par les variables `INITIAL_ADMIN_*` de `mailu.env`.

## docker-mailserver

```bash
mkdir -p /opt/dms && cd /opt/dms
DMS_GITHUB_URL="https://raw.githubusercontent.com/docker-mailserver/docker-mailserver/master"
wget "${DMS_GITHUB_URL}/compose.yaml" && wget "${DMS_GITHUB_URL}/mailserver.env"
nano compose.yaml          # hostname: mail.corp.exemple.fr, volumes, certificats
nano mailserver.env        # ENABLE_RSPAMD=1, ENABLE_CLAMAV=1, SSL_TYPE=letsencrypt…
docker compose up -d
docker exec -ti mailserver setup email add jk@corp.exemple.fr        # dans les 2 minutes suivant le premier démarrage
docker exec -ti mailserver setup alias add postmaster@corp.exemple.fr jk@corp.exemple.fr
docker exec -ti mailserver setup config dkim
docker exec -ti mailserver setup help
```

La clé DKIM générée se trouve dans `docker-data/dms/config/opendkim/keys/` (ou la configuration Rspamd selon les options) : publier l'enregistrement TXT indiqué. Ajouter un webmail à part ([[21-webmail/01-roundcube|Roundcube]], [[21-webmail/02-snappymail-anciens|SnappyMail]]).

## Dépannage commun

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Messages sortants en spam ou refusés | PTR, SPF, DKIM ou DMARC absents, IP listée | Vérifier les enregistrements, tester avec un service de notation, demander le retrait des listes |
| Aucune réception | Port 25 fermé, MX incorrect | `nc -zv mail.corp.exemple.fr 25` depuis l'extérieur, `dig MX corp.exemple.fr` |
| Certificat non émis | Port 80 inaccessible, DNS non propagé | Ouvrir 80, attendre la propagation |
| Conteneur en redémarrage | Mémoire insuffisante (ClamAV) | Plus de RAM ou désactiver ClamAV |

Commandes : [[90-aide-memoire|aide-mémoire]].
