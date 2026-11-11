---
title: HestiaCP, CyberPanel, ISPConfig et Virtualmin GPL
description: Panneaux de contrôle d'hébergement web — rôle (gérer sites, domaines, DNS, bases, messagerie et certificats depuis une interface), HestiaCP (léger, Nginx+Apache, multi-comptes, Let's Encrypt), CyberPanel (OpenLiteSpeed, cache LSCache, WordPress, SSL), ISPConfig (multi-serveurs, revendeurs, très complet), Virtualmin GPL (sur Webmin, serveurs virtuels, édition libre vs Pro) ; installation sur serveur neuf, sécurité et choix pour remplacer cPanel/Plesk.
tags: [hestiacp, cyberpanel, ispconfig, virtualmin, panneau de contrôle, hébergement web, cpanel, plesk]
icon: panels-top-left
---

Un **panneau de contrôle d'hébergement** gère depuis une interface web tout ce qu'il faut pour héberger des sites : **domaines et DNS**, serveurs **web** et **PHP**, **bases de données**, **messagerie**, **certificats** Let's Encrypt, **FTP**, comptes clients. Ce sont les alternatives libres à **cPanel** et **Plesk** (payants).

## HestiaCP

**HestiaCP** (fork de VestaCP) est **léger** et apprécié pour sa simplicité : Nginx en frontal + Apache ou PHP-FPM, multi-comptes utilisateurs, Let's Encrypt, messagerie (Exim/Dovecot), DNS, pare-feu.

```bash
# Debian/Ubuntu propre
wget https://raw.githubusercontent.com/hestiacp/hestiacp/release/install/hst-install.sh
sudo bash hst-install.sh --email admin@exemple.fr --hostname srv.exemple.fr
# Interface : https://srv.exemple.fr:8083
```

## CyberPanel

**CyberPanel** repose sur **OpenLiteSpeed** (serveur web rapide) et son cache **LSCache** : installation WordPress optimisée, gestion SSL, e-mail, DNS, sauvegardes. Les composants open source sont libres.

```bash
sudo su - ; sh <(curl -sS https://cyberpanel.net/install.sh)
# Choisir OpenLiteSpeed (gratuit) ; interface : https://IP:8090
```

## ISPConfig

**ISPConfig** est le plus **complet** pour l'hébergement professionnel : gestion **multi-serveurs** (un panneau pilote plusieurs serveurs web/mail/DNS), comptes **revendeurs**, quotas, nombreux services. Interface plus austère, mais très puissante.

```bash
# Installation guidée officielle (script autoinstaller) sur Debian/Ubuntu
wget -O - https://get.ispconfig.org | sh -s -- --use-ftp-ports=40110-40210 --unattended-upgrades
# Interface : https://IP:8080 (identifiants affichés en fin d'installation)
```

## Virtualmin GPL

**Virtualmin** s'appuie sur **[[05-admin-serveur/01-webmin-ajenti-froxlor|Webmin]]** et gère des **serveurs virtuels** (un domaine = site + base + mail + DNS). L'édition **GPL** est libre et couvre l'essentiel ; l'édition **Pro** (payante) ajoute des fonctions avancées.

```bash
wget https://software.virtualmin.com/gpl/scripts/virtualmin-install.sh
sudo sh virtualmin-install.sh --bundle LAMP      # ou LEMP (Nginx)
# Interface : https://IP:10000 (via Webmin)
```

## Installation et sécurité

> [!WARNING]
> Ces panneaux s'installent sur un **serveur neuf et dédié** : ils configurent eux-mêmes web, mail, DNS, pare-feu et refusent souvent une machine déjà configurée. Ne jamais les installer sur un serveur de production existant.

- Changer les mots de passe par défaut, restreindre l'accès au panneau (port non standard, filtrage IP, 2FA si disponible), activer HTTPS sur l'interface.
- Tenir le panneau **et** les services sous-jacents à jour : exposés sur Internet, ils sont des cibles fréquentes.
- Sauvegarder la configuration du panneau **et** les données (sites, bases, mails) ; vérifier les restaurations.
- La messagerie auto-hébergée impose SPF/DKIM/DMARC et une bonne réputation IP (voir le chapitre messagerie).

## Choisir

| Besoin | Outil |
| --- | --- |
| Léger, simple, un serveur | HestiaCP |
| WordPress optimisé, OpenLiteSpeed | CyberPanel |
| Multi-serveurs, revendeurs, professionnel | ISPConfig |
| Intégré à Webmin, serveurs virtuels | Virtualmin GPL |
| Déployer ses propres applications plutôt que des sites | [[02-paas/01-coolify-dokku-caprover\|Coolify, Dokku, CapRover]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
