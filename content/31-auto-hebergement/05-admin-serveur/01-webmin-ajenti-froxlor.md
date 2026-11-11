---
title: Webmin, Ajenti et Froxlor
description: Interfaces web d'administration serveur — Webmin (administration système complète : utilisateurs, paquets, services, pare-feu, Apache, BIND, Samba, cron ; modules, Usermin, port 10000), Ajenti (panneau léger et extensible en Python, terminal web, plugins), Froxlor (gestion d'hébergement mutualisé : clients, domaines, quotas, génère les configs web/mail/DNS) ; sécurité (interface très puissante à protéger) et choix face à une administration en ligne de commande.
tags: [webmin, ajenti, froxlor, administration, panneau serveur, linux, interface web]
icon: server-cog
---

Ces outils administrent un serveur Linux par une **interface web**, utile pour des tâches ponctuelles ou pour des administrateurs peu à l'aise en ligne de commande. À distinguer des [[04-panneaux-hebergement/01-hestiacp-cyberpanel-ispconfig-virtualmin|panneaux d'hébergement]] (centrés sur les sites et clients) : Webmin et Ajenti gèrent le **système** entier.

## Webmin

**Webmin** est l'interface d'administration système la plus ancienne et la plus complète : utilisateurs et groupes, **paquets**, **services** (systemd), **pare-feu**, tâches **cron**, et des centaines de **modules** pour configurer Apache, Nginx, BIND, Postfix/Dovecot, Samba, MySQL/PostgreSQL, partages NFS, quotas, etc.

```bash
# Dépôt officiel, puis :
sudo apt install webmin --install-recommends     # après ajout du dépôt
# Interface : https://IP:10000 (compte root ou utilisateur dédié)
```

- **Usermin** est le pendant pour les utilisateurs finaux (webmail, changement de mot de passe, fichiers).
- **Virtualmin** (voir le panneau d'hébergement) et **Cloudmin** sont des surcouches de Webmin.
- Journalise les actions ; permet de **modifier les fichiers de configuration** directement avec garde-fous.

## Ajenti

**Ajenti** est un panneau **léger et extensible** (cœur Python) : vue d'ensemble du serveur, **terminal web**, gestion des services, des fichiers, du pare-feu, et des **plugins** (dont Ajenti-V pour l'hébergement de sites).

```bash
curl https://raw.githubusercontent.com/ajenti/ajenti/master/scripts/install.sh | sudo bash -s -
# Interface : https://IP:8000
```

Interface plus moderne que Webmin, mais écosystème plus restreint et activité variable : vérifier l'état du projet.

## Froxlor

**Froxlor** est un panneau de **gestion d'hébergement mutualisé** (PHP) : on y déclare clients, domaines, sous-domaines, comptes mail, bases, quotas et FTP ; Froxlor **génère les configurations** du serveur web, de la messagerie et du DNS à partir de ces données. Plus ciblé que Webmin, plus léger qu'ISPConfig.

```bash
# Paquet ou archive dans la racine web (Apache/Nginx + PHP + MariaDB), puis assistant web
# Un travail cron Froxlor applique périodiquement les configurations générées :
*/5 * * * * root /usr/bin/php /var/www/froxlor/scripts/froxlor_master_cronjob.php --tasks
```

## Sécurité

> [!WARNING]
> Ces interfaces ont des **droits d'administration complets** (souvent root) : leur compromission donne le serveur entier. Impératifs : HTTPS, **mot de passe fort** et si possible **2FA**, écoute restreinte (réseau d'administration, VPN, filtrage IP), port non exposé publiquement, mises à jour immédiates. Plusieurs failles critiques ont visé Webmin par le passé : ne jamais laisser son port 10000 ouvert sur Internet.

## Webmin/Ajenti ou la ligne de commande ?

Une interface web est pratique pour explorer, dépanner ou déléguer des tâches simples, mais pour une infrastructure reproductible, préférer la **gestion par code** : [[21-outils/09-init-processus/01-systemd|systemd]] et fichiers de configuration versionnés, [[17-automatisation/01-ansible/01-presentation-installation|Ansible]] pour appliquer la configuration à l'identique sur plusieurs serveurs. Les panneaux conviennent aux serveurs isolés et aux équipes qui ne scriptent pas.

## Choisir

| Besoin | Outil |
| --- | --- |
| Administration système complète par le web | Webmin |
| Panneau léger avec terminal web | Ajenti |
| Hébergement mutualisé (clients, domaines) | Froxlor (ou ISPConfig pour plus de fonctions) |
| Infrastructure reproductible | Ansible + configuration versionnée |

Commandes : [[90-aide-memoire|aide-mémoire]].
