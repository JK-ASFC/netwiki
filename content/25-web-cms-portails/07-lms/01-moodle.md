---
title: Moodle
description: Moodle (GPL v3) — plateforme d'apprentissage la plus répandue : cours, activités, devoirs, tests, badges, rapports, applications mobiles ; prérequis (PHP 8.2+, PostgreSQL, MariaDB/MySQL, dossier moodledata), installation par Git ou archive sous Linux, Windows et macOS, racine web public/ depuis Moodle 5.1, installation CLI (admin/cli/install.php), cron, cache Redis, authentification LDAP/SAML/OIDC, sauvegarde, mise à jour (admin/cli/upgrade.php), maintenance et dépannage.
tags: [moodle, lms, e-learning, php, postgresql, formation]
icon: graduation-cap
---

**Moodle** (GPL v3) est la plateforme de formation en ligne la plus utilisée (universités, écoles, entreprises, administrations) : **cours** et catégories, activités (devoirs, tests, forums, ateliers, H5P), **carnet de notes**, achèvement et badges, cohortes, rapports, application mobile officielle, intégrations (visioconférence [[16-visioconference/01-jitsi-bigbluebutton|BigBlueButton]], LTI). Moodle 5 est la version actuelle.

Prérequis : PHP 8.2+ (`intl`, `mbstring`, `xml`, `zip`, `gd`, `curl`, `soap`, `sodium`, `opcache`, `max_input_vars = 5000`), **PostgreSQL** (recommandé) ou MariaDB/MySQL, un dossier de données **hors de la racine web** (`moodledata`), Apache ou NGINX.

> [!IMPORTANT]
> Depuis **Moodle 5.1**, la racine web est le sous-dossier **`public/`** du code : faire pointer le serveur web sur `/var/www/moodle/public`. Les scripts CLI restent dans `admin/cli/`.

## Installation (Linux, Git)

```bash
sudo apt install -y nginx postgresql git php-fpm php-pgsql php-intl php-mbstring php-xml php-zip php-gd php-curl php-soap php-redis
sudo -u postgres psql -c "CREATE USER moodle WITH PASSWORD 'MdpMoodle2026';" -c "CREATE DATABASE moodle OWNER moodle ENCODING 'UTF8';"
cd /var/www && sudo git clone -b MOODLE_503_STABLE --depth 1 https://github.com/moodle/moodle.git moodle
sudo mkdir -p /var/moodledata && sudo chown -R www-data:www-data /var/moodledata
sudo -u www-data php /var/www/moodle/admin/cli/install.php --lang=fr --wwwroot=https://formation.corp.exemple.fr \
  --dataroot=/var/moodledata --dbtype=pgsql --dbname=moodle --dbuser=moodle --dbpass=MdpMoodle2026 \
  --fullname="Plateforme de formation" --shortname="Formation" --adminuser=jk-admin --adminpass='MdpAdmin2026!' \
  --adminemail=formation@corp.exemple.fr --non-interactive --agree-license
sudo chown root:www-data /var/www/moodle/config.php && sudo chmod 640 /var/www/moodle/config.php
```

La branche `MOODLE_503_STABLE` correspond à Moodle 5.3 (choisir la branche stable visée). NGINX : racine `/var/www/moodle/public`, gestion du `PATH_INFO` (`location ~ [^/]\.php(/|$)` avec `fastcgi_split_path_info`), refus de `/dataroot/` et des fichiers cachés. Installation possible aussi par l'assistant web (`https://formation.corp.exemple.fr`) avec l'archive du site de Moodle.

**Windows** : IIS ou Apache avec PHP et PostgreSQL/MariaDB (même procédure ; tâche planifiée pour le cron), ou les paquets d'installation « Moodle pour Windows » pour un poste de test. **macOS** : PHP et PostgreSQL de Homebrew. **Docker** : pas d'image officielle de production ; l'équipe Moodle fournit `moodle-docker` pour le développement.

## Cron et performances

```bash
echo '* * * * * www-data /usr/bin/php /var/www/moodle/admin/cli/cron.php >/dev/null' | sudo tee /etc/cron.d/moodle
```

- Cache applicatif et sessions **Redis** (*Administration du site → Plugins → Caches → Configuration*, et `$CFG->session_handler_class = '\core\session\redis';` dans `config.php`).
- OPcache activé, `moodledata` sur un disque rapide, fichiers temporaires locaux (`$CFG->localcachedir`).

## Administration

*Administration du site* :

| Section | Usage |
| --- | --- |
| Utilisateurs → Comptes, Permissions, Cohortes | Comptes, rôles (enseignant, étudiant, gestionnaire), groupes |
| Plugins → Authentification | **LDAP/Active Directory**, SAML2, OAuth 2/OIDC (Entra ID, Keycloak) |
| Cours → Gestion des cours et catégories | Arborescence, restauration et sauvegarde de cours |
| Serveur → Courriel sortant, Tâches | SMTP, tâches planifiées et tâches ad hoc |
| Notifications, Rapports | Mises à jour disponibles, journaux, statistiques |

<!-- CAPTURE: Page d'un cours Moodle (format thématique) | _assets/moodle-cours.png -->
<!-- CAPTURE: Administration du site Moodle | _assets/moodle-administration.png -->

## Sauvegarde, mise à jour

```bash
cd /var/www/moodle
sudo -u www-data php admin/cli/maintenance.php --enable
sudo -u postgres pg_dump -Fc moodle > /srv/sauvegardes/moodle-$(date +%F).dump
sudo tar czf /srv/sauvegardes/moodledata-$(date +%F).tar.gz -C /var moodledata
sudo -u www-data git pull                                       # même branche stable ; nouvelle branche pour une version majeure
sudo -u www-data php admin/cli/upgrade.php --non-interactive
sudo -u www-data php admin/cli/purge_caches.php
sudo -u www-data php admin/cli/maintenance.php --disable
```

Sauvegarder ensemble **base**, **moodledata** et `config.php`. Les sauvegardes de cours (`.mbz`) se planifient dans *Cours → Sauvegardes*.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Message « rootdirpublic » | Serveur web pointé sur la racine du code (Moodle 5.1+) | Racine web sur `public/` |
| Pages sans styles, erreurs 404 sur `.php/…` | `PATH_INFO` non géré par NGINX | `fastcgi_split_path_info` |
| Notifications, courriels et rapports en retard | Cron absent | Ligne `admin/cli/cron.php` chaque minute |
| Avertissement `max_input_vars` | Réglage PHP | `max_input_vars = 5000` dans `php.ini` |

Commandes : [[90-aide-memoire|aide-mémoire]].
