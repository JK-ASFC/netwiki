---
title: Modoboa et iRedMail
description: Suites de messagerie installées directement sur le système — Modoboa (ISC : Postfix, Dovecot, Rspamd ou Amavis, Radicale, webmail et interface d'administration Django ; modoboa-installer run.py, installer.cfg, versions) et iRedMail (GPL v3 : Postfix, Dovecot, Roundcube ou SOGo, Amavis ou SpamAssassin, iRedAdmin ; Ubuntu 22.04/24.04/26.04, Debian 12/13, Rocky, Alma, CentOS Stream 9/10, FreeBSD, OpenBSD ; iRedMail.sh), DNS, sécurité, sauvegarde et mise à jour.
tags: [modoboa, iredmail, messagerie, postfix, dovecot, iredadmin, linux, bsd]
icon: mail-plus
---

Contrairement à [[01-mailcow-mailu-docker-mailserver|Mailcow, Mailu ou docker-mailserver]], ces suites installent les composants **sur le système hôte** à l'aide d'un installateur. Mêmes prérequis : serveur dédié et propre, IP fixe avec PTR, ports 25/465/587/993/443, enregistrements MX, SPF, DKIM et DMARC.

## Modoboa

**Modoboa** (ISC, Python/Django) fournit une interface web d'administration (domaines, boîtes, alias, quotas, relais, statistiques), un webmail, des filtres Sieve, un répondeur et agendas/contacts (Radicale).

```bash
sudo apt install -y git python3-venv
git clone https://github.com/modoboa/modoboa-installer && cd modoboa-installer
sudo ./run.py --stop-after-configfile-check corp.exemple.fr     # génère installer.cfg sans rien installer
nano installer.cfg                                              # base (PostgreSQL/MySQL), antispam, certificat, composants
sudo ./run.py corp.exemple.fr                                    # installation (mail.corp.exemple.fr par défaut)
```

Options utiles : `--interactive` (questions), `--version=2.12.0` (version précise), `--beta`. Systèmes pris en charge : Debian, Ubuntu (versions récentes) et dérivés RHEL. Ouvrir ensuite `https://mail.corp.exemple.fr` avec le compte administrateur indiqué en fin d'installation (`admin`, mot de passe à changer), puis créer le domaine et récupérer la clé DKIM dans ses paramètres.

<!-- CAPTURE: Interface d'administration Modoboa, liste des domaines | _assets/modoboa-domaines.png -->

## iRedMail

**iRedMail** (GPL v3) installe Postfix, Dovecot, Nginx, un webmail (**Roundcube** ou **SOGo**), Amavis + SpamAssassin + ClamAV, Fail2ban, netdata et l'interface **iRedAdmin**, avec un annuaire au choix (OpenLDAP, MariaDB ou PostgreSQL). Systèmes : Ubuntu 22.04, 24.04 (recommandée) et 26.04, Debian 12 et 13, Rocky/Alma 9 et 10, CentOS Stream 9 et 10, FreeBSD 14, OpenBSD 7.

```bash
sudo hostnamectl set-hostname mail.corp.exemple.fr      # nom complet aussi dans /etc/hosts
# télécharger la dernière version stable depuis la page de téléchargement d'iRedMail, puis :
tar xzf iRedMail-1.8.9.tar.gz && cd iRedMail-1.8.9
sudo bash iRedMail.sh                                    # assistant : stockage, serveur web, annuaire, premier domaine, composants
```

Le récapitulatif final (`iRedMail.tips`) donne les adresses et mots de passe : à conserver en lieu sûr puis supprimer du serveur. Administration : `https://mail.corp.exemple.fr/iredadmin` ; webmail : `https://mail.corp.exemple.fr/mail` (Roundcube) ou `/SOGo`. Mises à jour : appliquer les guides de mise à jour d'iRedMail version par version.

<!-- CAPTURE: iRedAdmin, création d'un utilisateur | _assets/iredadmin-utilisateur.png -->

## Exploitation

- Sauvegarde : boîtes aux lettres (`/var/vmail`), bases (comptes, webmail, antispam), configuration (`/etc/postfix`, `/etc/dovecot`, clés DKIM). iRedMail installe des scripts de sauvegarde des bases dans `/var/vmail/backup`.
- Journaux : `/var/log/mail.log` (Debian/Ubuntu), `/var/log/maillog` (RHEL).
- Diagnostic : voir les aide-mémoires de [[01-postfix/90-aide-memoire|Postfix]] et [[02-dovecot/90-aide-memoire|Dovecot]].

Commandes : [[90-aide-memoire|aide-mémoire]].
