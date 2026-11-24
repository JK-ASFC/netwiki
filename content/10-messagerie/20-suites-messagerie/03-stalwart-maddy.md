---
title: Stalwart et Maddy
description: Serveurs de messagerie tout-en-un modernes en un seul binaire — Stalwart (Rust, AGPL) : SMTP, IMAP4, POP3, JMAP, ManageSieve, filtre antispam et antiphishing intégré, DKIM/SPF/DMARC/ARC/MTA-STS/DANE, stockage RocksDB/PostgreSQL/FoundationDB/S3, chiffrement, interface web d'administration, mode cluster, installation Docker et binaire, stalwart-cli ; et Maddy (Go, GPLv3) : MTA et serveur IMAP compact configuré par maddy.conf, maddyctl. Installation, configuration, DNS, migration et comparaison avec les suites à base de Postfix/Dovecot.
tags: [stalwart, maddy, messagerie, smtp, imap, jmap, dkim, rust, go]
icon: mails
---

Contrairement aux suites assemblant [[01-postfix/01-presentation|Postfix]] + [[02-dovecot/01-presentation-installation|Dovecot]] + antispam, **Stalwart** et **Maddy** regroupent tout le serveur de messagerie dans **un seul programme** : SMTP, IMAP et le reste partagent une configuration unique. Moins de pièces à accorder, au prix d'un écosystème plus récent.

## Stalwart

**Stalwart** (Rust, AGPL) est un serveur de messagerie complet et performant : **SMTP** (entrant/sortant), **IMAP4**, **POP3**, **JMAP** (protocole moderne, temps réel), **ManageSieve**, avec un **filtre antispam/antiphishing intégré** (règles, listes, apprentissage bayésien, réputation), l'authentification de messages (DKIM, SPF, DMARC, ARC, MTA-STS, DANE), le chiffrement au repos et une **interface web d'administration**.

```bash
# Docker : SMTP 25/465/587, IMAP 143/993, JMAP/admin 8080, ManageSieve 4190
docker run -d --name stalwart -p 25:25 -p 143:143 -p 465:465 -p 587:587 -p 993:993 -p 4190:4190 -p 8080:8080 \
  -v $PWD/stalwart:/opt/stalwart stalwartlabs/stalwart:latest
docker logs stalwart 2>&1 | grep -i 'administrator'      # mot de passe admin initial généré au 1er démarrage
```

| Méthode | Détail |
| --- | --- |
| Binaire | Installateur `stalwart` par plate-forme (Linux, Windows, macOS) ; assistant de configuration au 1er lancement |
| Docker / Compose | Image `stalwartlabs/stalwart` (une variante `-postgres` pour un stockage externe) |
| Kubernetes | Manifestes/Helm communautaires (mode cluster) |

- **Stockage** : embarqué **RocksDB** (défaut, simple) ou externe **PostgreSQL**, **FoundationDB** (cluster), SQLite ; les pièces jointes/blobs peuvent aller sur **S3**. Annuaire des comptes : interne, **LDAP/AD**, SQL ou OIDC.
- **Configuration** : interface web (`http://hôte:8080`) ou fichier TOML `/opt/stalwart/etc/config.toml` ; tout est modifiable à chaud via l'API d'administration.
- **DNS** : comme tout serveur de messagerie — `A`/`PTR`, `MX`, **SPF**, **DKIM** (clé générée par Stalwart), **DMARC**, et idéalement **MTA-STS**/**TLSA (DANE)**. L'interface donne les enregistrements exacts.

```bash
# CLI d'administration (comptes, domaines, files, DKIM)
stalwart-cli -u https://mail.corp.exemple.fr -c admin:MDP account create jk jk@corp.exemple.fr -p 'MotDePasse'
stalwart-cli -u https://mail.corp.exemple.fr -c admin:MDP domain create corp.exemple.fr
stalwart-cli -u https://mail.corp.exemple.fr -c admin:MDP queue list          # file d'attente SMTP
stalwart-cli -u https://mail.corp.exemple.fr -c admin:MDP import messages jk /sauvegarde/Maildir   # migration
```

> [!NOTE]
> Stalwart évolue vite (changements de format de configuration entre versions majeures). Épinglez une version précise, lisez les notes de mise à jour, et sauvegardez le dossier de données (ou la base externe) avant toute montée de version.

## Maddy

**Maddy** (Go, GPLv3) est un serveur de messagerie **compact** en un binaire : MTA (SMTP soumission et relais) et **IMAP**, avec stockage local et authentification, configuré par un unique fichier au style déclaratif.

```bash
sudo useradd -r -M -s /sbin/nologin maddy
# Binaire officiel (releases GitHub) ou paquet de la distribution
sudo maddy -config /etc/maddy/maddy.conf run        # premier plan (test) ; sinon service systemd fourni
maddyctl creds create jk@corp.exemple.fr            # créer un identifiant
maddyctl imap-acct create jk@corp.exemple.fr        # créer la boîte IMAP
maddyctl imap-mboxes list jk@corp.exemple.fr
```

Le fichier `/etc/maddy/maddy.conf` déclare les hôtes (`$(hostname)`, `$(primary_domain)`), les points d'écoute (`smtp tcp://0.0.0.0:25`, `submission tls://0.0.0.0:465`, `imap tls://0.0.0.0:993`), le stockage (`imapsql`), TLS (`tls file …`) et la signature DKIM (`modify { dkim }`). Maddy convient à un serveur personnel ou d'équipe ; pour de l'antispam avancé, on l'associe à [[04-rspamd/01-presentation-installation|Rspamd]].

## Choisir

| Besoin | Outil |
| --- | --- |
| Suite éprouvée, antispam riche, nombreux webmails | [[01-mailcow-mailu-docker-mailserver\|Mailcow / Mailu]] |
| Panneau d'administration classique (Postfix/Dovecot) | [[02-modoboa-iredmail\|Modoboa / iRedMail]] |
| Tout-en-un moderne, JMAP, cluster, un binaire | **Stalwart** |
| Serveur minimal en un binaire (perso/équipe) | **Maddy** |

Quel que soit le serveur, les règles d'authentification de courrier (SPF, DKIM, DMARC) et de délivrabilité restent les mêmes — voir [[01-postfix/06-spf-dkim-dmarc|SPF, DKIM et DMARC]].

Commandes : [[90-aide-memoire|aide-mémoire]].
