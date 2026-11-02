---
title: OTOBO et Znuny (successeurs d'OTRS)
description: OTOBO (Rother OSS) et Znuny — successeurs libres (GPL v3) d'OTRS Community Edition pour l'ITSM et le support : files, tickets, SLA, processus, CMDB ITSM, portail client ; installation OTOBO par Docker Compose (otobo-docker) ou tarball sous Ubuntu/RHEL (Perl, NGINX, MariaDB, Elasticsearch, services otobo-web et otobo-daemon), installation Znuny (tarball /opt/otrs, Apache mod_perl, installer.pl, démon et cron), commandes otobo.Console.pl et otrs.Console.pl, sauvegarde backup.pl, mise à jour, migration depuis OTRS et dépannage.
tags: [otobo, znuny, otrs, itsm, helpdesk, tickets, perl]
icon: ticket-check
---

Après l'arrêt d'**OTRS Community Edition** (2020), deux projets ont repris le code libre (**GPL v3**) :

| Projet | Éditeur | Caractéristiques |
| --- | --- | --- |
| **OTOBO** | Rother OSS (Allemagne) | Interface modernisée, ITSM et CMDB inclus, Docker officiel, Elasticsearch, versions 11.x |
| **Znuny** | Znuny GmbH (ex-OTRS) | Proche d'OTRS 6, version LTS et versions 7.x, modules ITSM en paquets |

Tous deux offrent files (*queues*), tickets par courriel/portail/téléphone, **SLA** et calendriers, **processus** graphiques, modèles de réponse, droits par groupe et rôle, portail client, API web (REST/SOAP) et migration depuis OTRS. Ils conviennent aux services d'assistance structurés (centre de services, multi-entités). Alternatives : [[15-itop|iTop]], [[06-zammad|Zammad]] (dont l'équipe vient aussi d'OTRS), [[04-glpi-installation|GLPI]].

## OTOBO avec Docker Compose (recommandé)

```bash
sudo apt install -y docker.io docker-compose-v2 git
cd /opt && sudo git clone https://github.com/RotherOSS/otobo-docker.git --branch rel-11_0_18 && cd otobo-docker
sudo cp -p .docker_compose_env_https .env        # ou .docker_compose_env_http
sudo nano .env                                   # OTOBO_DB_ROOT_PASSWORD obligatoire, ports, nom du certificat
sudo docker volume create otobo_nginx_ssl
sudo cp /etc/ssl/corp/otobo.crt /etc/ssl/corp/otobo.key "$(sudo docker volume inspect --format '{{ .Mountpoint }}' otobo_nginx_ssl)"
sudo docker compose up --detach
sudo docker compose ps
```

La pile comprend le serveur web (Perl/Plack), le **démon** (tâches planifiées), MariaDB, Redis, Elasticsearch et un proxy NGINX pour le HTTPS. Choisir l'étiquette (`--branch`) correspondant à la version d'OTOBO voulue. Indiquer les noms des fichiers de certificat dans `.env` : `OTOBO_NGINX_SSL_CERTIFICATE=/etc/nginx/ssl/otobo.crt` et `OTOBO_NGINX_SSL_CERTIFICATE_KEY=/etc/nginx/ssl/otobo.key`.

Ouvrir ensuite `https://otobo.corp.exemple.fr/otobo/installer.pl` : base de données (MariaDB du conteneur `db`), paramètres système, courriel entrant et sortant, compte `root@localhost`.

Windows et macOS : Docker Desktop avec les mêmes fichiers.

## OTOBO par archive (Ubuntu, RHEL)

```bash
sudo mkdir /opt/otobo-install /opt/otobo && cd /opt/otobo-install
sudo wget https://ftp.otobo.org/pub/otobo/otobo-latest-11.0.tar.gz
sudo wget https://ftp.otobo.org/pub/otobo/checksums/otobo-latest-11.0.tar.gz.sha256 && sudo sha256sum -c otobo-latest-11.0.tar.gz.sha256
sudo tar -xzf otobo-latest-11.0.tar.gz && sudo cp -r otobo-11.0.*/* /opt/otobo
sudo useradd -r -U -d /opt/otobo -c 'OTOBO user' otobo -s /bin/bash
sudo perl /opt/otobo/bin/otobo.CheckModules.pl -list          # modules Perl manquants (paquets lib*-perl ou cpanm)
sudo cp /opt/otobo/Kernel/Config.pm.dist /opt/otobo/Kernel/Config.pm
sudo /opt/otobo/bin/otobo.SetPermissions.pl --otobo-user=otobo --web-group=otobo
sudo cp /opt/otobo/scripts/systemd/* /etc/systemd/system/ && sudo systemctl daemon-reload
sudo cp /opt/otobo/scripts/nginx-vhost-443.include.conf /etc/nginx/sites-available/otobo.conf
sudo ln -s /etc/nginx/sites-available/otobo.conf /etc/nginx/sites-enabled/ && sudo systemctl restart nginx
sudo systemctl enable --now otobo-web.service
# installateur web : https://otobo.corp.exemple.fr/otobo/installer.pl
sudo systemctl enable --now otobo-daemon.service
```

Sous RHEL 9 : activer *CodeReady Builder*/CRB, installer les dépendances (`perl`, `perl-DBD-MySQL`, `perl-App-cpanminus`…) puis `cpanm --cpanfile /opt/otobo/cpanfile.plackup --installdeps` ; vérifier SELinux et `firewall-cmd`.

## Znuny (archive, Apache)

```bash
cd /opt && sudo wget https://download.znuny.org/releases/znuny-latest-7.3.tar.gz
sudo tar xfz znuny-latest-7.3.tar.gz && sudo ln -s /opt/znuny-7.3.* /opt/otrs
sudo useradd -d /opt/otrs -c 'Znuny user' -g www-data -s /bin/bash -M -N otrs
sudo cp /opt/otrs/Kernel/Config.pm.dist /opt/otrs/Kernel/Config.pm
sudo perl /opt/otrs/bin/otrs.CheckModules.pl --all
sudo /opt/otrs/bin/otrs.SetPermissions.pl
sudo apt install -y apache2 libapache2-mod-perl2 mariadb-server
sudo ln -s /opt/otrs/scripts/apache2-httpd.include.conf /etc/apache2/conf-available/zzz_znuny.conf
sudo a2enmod perl headers deflate filter cgi && sudo a2enconf zzz_znuny && sudo systemctl restart apache2
# installateur web : https://znuny.corp.exemple.fr/otrs/installer.pl
sudo -u otrs /opt/otrs/bin/otrs.Daemon.pl start
cd /opt/otrs/var/cron && for f in *.dist; do sudo -u otrs cp "$f" "$(basename "$f" .dist)"; done
sudo -u otrs /opt/otrs/bin/Cron.sh start
```

MariaDB doit accepter de gros paquets et le jeu de caractères `utf8mb4` (`max_allowed_packet = 64M`, `innodb_log_file_size = 256M` dans la configuration du serveur) : l'installateur vérifie ces valeurs.

## Interface

| Écran | Usage |
| --- | --- |
| Interface agent (`/otobo/index.pl`, `/otrs/index.pl`) | Vue des files, tickets verrouillés, recherche, réponses, notes, fusion, liens |
| Administration → Files, Groupes, Rôles, Agents | Organisation du support et droits |
| Administration → Comptes de messagerie (PostMaster), Filtres | Relève IMAP/POP, routage automatique |
| Administration → SLA, Services, Calendriers | Engagements de délai |
| Administration → Gestion des processus | Workflows graphiques (demandes d'achat, arrivée d'un salarié) |
| Administration → Web Services | API REST/SOAP (intégration supervision, CMDB) |
| Portail client (`customer.pl`) | Création et suivi des tickets par les utilisateurs |

<!-- CAPTURE: Vue des files de l'interface agent OTOBO | _assets/otobo-vue-files.png -->
<!-- CAPTURE: Éditeur graphique de processus | _assets/otobo-processus.png -->

## Exploitation

```bash
sudo -u otobo /opt/otobo/bin/otobo.Console.pl                               # liste des commandes
sudo -u otobo /opt/otobo/bin/otobo.Console.pl Maint::Cache::Delete
sudo -u otobo /opt/otobo/bin/otobo.Console.pl Admin::User::Add --user-name jk --first-name J --last-name K --email-address jk@corp.exemple.fr --password 'MdpTemporaire2026!'
sudo -u otobo /opt/otobo/scripts/backup.pl -d /srv/sauvegardes                 # base + fichiers
sudo /opt/otobo/scripts/restore.pl -d /opt/otobo -b /srv/sauvegardes/2026-11-02_03-00
sudo docker compose exec web bin/otobo.Console.pl Maint::Cache::Delete         # version Docker
sudo -u otrs /opt/otrs/bin/otrs.Console.pl Maint::Config::Rebuild              # Znuny
```

- **Mise à jour** : sauvegarde, nouvelle archive (ou nouvelle étiquette `otobo-docker` puis `docker compose pull && docker compose up -d`), puis les étapes propres à la version décrites dans les notes de version (migration de base, réinstallation des paquets complémentaires).
- **Migration depuis OTRS 6** : assistant `migration.pl` d'OTOBO (copie de la base et des fichiers) ou chemin de mise à jour Znuny (OTRS 6 → Znuny LTS → 7.x).

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Courriels non relevés, escalades absentes | Démon arrêté | `otobo-daemon.service`, `otrs.Daemon.pl status` |
| Erreur « module Perl manquant » | Dépendance absente | `otobo.CheckModules.pl -list`, paquets ou `cpanm` |
| Changements de configuration ignorés | Cache ou configuration non déployée | `Maint::Cache::Delete`, *Paramètres système → Déployer* |
| Installateur refusant MariaDB | `max_allowed_packet`, `innodb_log_file_size` | Ajuster la configuration MariaDB |

Commandes : [[90-aide-memoire|aide-mémoire]].
