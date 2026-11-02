---
title: YunoHost
description: YunoHost — distribution d'auto-hébergement sur Debian, installation (image ou script sur Debian 12), post-installation (domaine principal, administrateur), utilisateurs et groupes (LDAP), authentification unique (SSOwat), domaines et certificats Let's Encrypt, diagnostic DNS (enregistrements, messagerie SPF/DKIM/DMARC), installation d'applications, permissions, sauvegardes (yunohost backup), mises à jour, pare-feu et Fail2ban, interface d'administration et portail utilisateur, commandes.
tags: [yunohost, auto-hébergement, debian, sso, let's encrypt, messagerie]
icon: package
---

**YunoHost** (AGPL) transforme une Debian en serveur d'auto-hébergement complet : comptes utilisateurs centralisés (LDAP), **portail d'authentification unique**, domaines avec certificats Let's Encrypt, serveur de **messagerie** (Postfix, Dovecot, Rspamd) et un catalogue d'environ 500 applications (Nextcloud, Vaultwarden, BookStack, Jitsi, Gitea…).

## Installation

Sur une **Debian 12 minimale** fraîchement installée (VM, serveur, Raspberry Pi) :

```bash
sudo apt install curl
curl https://install.yunohost.org | sudo bash
```

Ou image prête (x86, ARM) depuis `yunohost.org`. **Post-installation** : `https://<ip>` ou `sudo yunohost tools postinstall` — domaine principal (`yuno.corp.exemple.fr` ou domaine offert `*.nohost.me`), premier utilisateur (administrateur).

## Domaines, DNS et certificats

```bash
sudo yunohost domain add wiki.corp.exemple.fr
sudo yunohost domain dns suggest wiki.corp.exemple.fr       # enregistrements à créer (A, AAAA, MX, SPF, DKIM, DMARC…)
sudo yunohost diagnosis run --force                         # vérifie DNS, ports, messagerie, réputation de l'IP
sudo yunohost domain cert install wiki.corp.exemple.fr       # Let's Encrypt
```

Messagerie : un FAI résidentiel bloque souvent le port 25 et l'IP doit avoir un PTR cohérent ; sinon utiliser un relais SMTP (`yunohost settings set email.smtp.smtp_relay_host …`).

## Utilisateurs et applications

```bash
sudo yunohost user create alice --fullname "Alice Martin" --domain corp.exemple.fr -p 'MotDePasse!'
sudo yunohost user group create equipe-wiki && sudo yunohost user group add equipe-wiki alice
sudo yunohost app catalog | grep -i bookstack
sudo yunohost app install bookstack --args "domain=wiki.corp.exemple.fr&path=/&init_main_permission=equipe-wiki"
sudo yunohost user permission update bookstack.main --add equipe-wiki --remove all_users
sudo yunohost app list
```

## Sauvegardes et mises à jour

```bash
sudo yunohost backup create --description "hebdomadaire"            # système + applications, archive dans /home/yunohost.backup/archives
sudo yunohost backup list
sudo yunohost backup restore <nom> --apps bookstack
sudo yunohost tools update && sudo yunohost tools upgrade system && sudo yunohost tools upgrade apps
```

Copiez les archives hors du serveur (Borg : application `borg` ou [[02-borgbackup/01-presentation-installation|BorgBackup]] vers un NAS, rsync).

## Sécurité

Pare-feu intégré (`yunohost firewall list`, `allow TCP 2222`), Fail2ban actif, SSH par clé (`yunohost settings set security.ssh.ssh_password_authentication -v no`), 2FA pour l'administration selon la version, politique de mot de passe (`security.password.admin.strength`).

## Interface graphique

**Interface d'administration** (`https://yuno.corp.exemple.fr/yunohost/admin`) : utilisateurs et groupes, domaines, applications (catalogue, permissions, configuration), services, sauvegardes, diagnostic, mises à jour. **Portail utilisateur** (`/yunohost/sso`) : tuiles des applications autorisées, changement de mot de passe.

<!-- CAPTURE: YunoHost — interface d'administration, accueil | _assets/yunohost-admin-accueil.png -->
<!-- CAPTURE: YunoHost — catalogue d'applications | _assets/yunohost-catalogue.png -->
<!-- CAPTURE: YunoHost — diagnostic (DNS, ports, messagerie) | _assets/yunohost-diagnostic.png -->
<!-- CAPTURE: YunoHost — portail utilisateur avec les tuiles d'applications | _assets/yunohost-portail.png -->
