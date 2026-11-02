---
title: Redmine
description: Redmine (GPL v2) — gestion de projet et suivi de demandes en Ruby on Rails : demandes (trackers), versions et feuille de route, Gantt, calendrier, temps passé, wiki, forums, dépôts Git et Subversion, droits par rôle, extensions ; installation Docker (image officielle, Linux, Windows, macOS), depuis l'archive sous Debian/Ubuntu/RHEL (Ruby, Bundler, PostgreSQL ou MySQL, Puma ou Passenger), sous Windows, configuration database.yml et configuration.yml (SMTP), réception de courriels, LDAP, sauvegarde, mise à jour et dépannage.
tags: [redmine, gestion de projet, suivi de demandes, ruby, rails, docker, gantt]
icon: folder-kanban
---

**Redmine** (GPL v2) est un gestionnaire de projet et de **demandes** (*issues*) très répandu dans les équipes techniques et l'administration : **trackers** (anomalie, évolution, support), statuts et flux de travail par rôle, **versions** et feuille de route, **Gantt** et calendrier, saisie des **temps**, wiki et forums par projet, navigation dans les dépôts **Git** et **Subversion**, notifications par courriel et création de demandes par courriel. Un large écosystème d'**extensions** (*plugins*) l'enrichit. Alternatives : [[01-openproject|OpenProject]], [[04-tuleap-trac-phorge|Tuleap, Trac, Phorge]].

Prérequis : Ruby 3.2+ (selon la version de Redmine), PostgreSQL, MySQL/MariaDB ou SQL Server, ImageMagick (vignettes, export PDF), un serveur d'application (Puma, Passenger) derrière NGINX ou Apache.

## Docker (image officielle)

```bash
docker network create redmine
docker run -d --name redmine-db --network redmine -e POSTGRES_USER=redmine -e POSTGRES_PASSWORD=MdpRedmine2026 -e POSTGRES_DB=redmine -v redmine_pg:/var/lib/postgresql/data postgres:17
docker run -d --name redmine --network redmine -p 127.0.0.1:3000:3000 \
  -e REDMINE_DB_POSTGRES=redmine-db -e REDMINE_DB_USERNAME=redmine -e REDMINE_DB_PASSWORD=MdpRedmine2026 -e REDMINE_DB_DATABASE=redmine \
  -v redmine_files:/usr/src/redmine/files -v redmine_plugins:/usr/src/redmine/plugins redmine:7
```

La base est migrée au démarrage du conteneur. Fonctionne à l'identique sous Windows et macOS (Docker Desktop).

## Depuis l'archive (Debian / Ubuntu)

```bash
sudo apt install -y ruby-full build-essential libpq-dev libyaml-dev imagemagick postgresql
sudo -u postgres psql -c "CREATE ROLE redmine LOGIN PASSWORD 'MdpRedmine2026';" -c "CREATE DATABASE redmine OWNER redmine ENCODING 'UTF8';"
V=7.0.3
wget https://www.redmine.org/releases/redmine-$V.tar.gz && sudo tar xzf redmine-$V.tar.gz -C /opt && sudo ln -s /opt/redmine-$V /opt/redmine
sudo useradd --system --home /opt/redmine redmine
cd /opt/redmine
sudo tee config/database.yml >/dev/null <<'YML'
production:
  adapter: postgresql
  database: redmine
  host: localhost
  username: redmine
  password: "MdpRedmine2026"
  encoding: utf8
YML
sudo bundle config set --local without 'development test'
sudo bundle install
sudo bundle exec rake generate_secret_token
sudo RAILS_ENV=production bundle exec rake db:migrate
sudo RAILS_ENV=production REDMINE_LANG=fr bundle exec rake redmine:load_default_data
sudo mkdir -p tmp/pdf public/plugin_assets && sudo chown -R redmine:redmine files log tmp public/plugin_assets
sudo -u redmine bundle exec rails server -e production -b 127.0.0.1 -p 3000     # test ; en production : unité systemd ou Passenger
```

RHEL/Rocky : `dnf install ruby ruby-devel gcc make libpq-devel ImageMagick` (ou Ruby d'un module/RVM selon la version exigée), mêmes commandes ensuite. Windows : RubyInstaller (avec DevKit), PostgreSQL ou MySQL pour Windows, puis les mêmes étapes dans `C:\redmine` et un service (NSSM) qui lance `rails server` ; Docker reste plus simple.

## Premier démarrage et administration

Ouvrir `https://redmine.corp.exemple.fr` : compte **`admin` / `admin`** (changer le mot de passe), puis *Administration* :

| Menu | Usage |
| --- | --- |
| Projets | Création, modules actifs (demandes, temps, wiki, dépôt, documents) |
| Utilisateurs, Groupes | Comptes, groupes, appartenance aux projets |
| Rôles et permissions | Droits par rôle (Chef de projet, Développeur, Rapporteur) |
| Trackers, Statuts, Workflow | Types de demandes et transitions autorisées par rôle |
| Champs personnalisés | Champs supplémentaires (demandes, projets, utilisateurs) |
| Authentification LDAP | Annuaire ([[01-active-directory/01-presentation\|Active Directory]]), création des comptes à la volée |
| Configuration → Courriels entrants | Clé d'API pour la création de demandes par courriel |
| Plugins | Extensions installées (copiées dans `plugins/`, puis `rake redmine:plugins:migrate`) |

<!-- CAPTURE: Liste des demandes d'un projet Redmine avec filtres | _assets/redmine-demandes.png -->
<!-- CAPTURE: Administration, écran Workflow | _assets/redmine-workflow.png -->

## Courriel

`config/configuration.yml` (copie de `configuration.yml.example`) :

```yaml
production:
  email_delivery:
    delivery_method: :smtp
    smtp_settings:
      address: smtp.corp.exemple.fr
      port: 587
      enable_starttls_auto: true
      authentication: :login
      user_name: redmine@corp.exemple.fr
      password: "MdpSmtp2026"
```

Création de demandes par courriel (IMAP, tâche planifiée) :

```bash
cd /opt/redmine && sudo -u redmine RAILS_ENV=production bundle exec rake redmine:email:receive_imap host=imap.corp.exemple.fr ssl=1 username=support@corp.exemple.fr password=MdpImap2026 project=support
```

## Sauvegarde, mise à jour

```bash
sudo -u postgres pg_dump -Fc redmine > /srv/sauvegardes/redmine-$(date +%F).dump
sudo tar czf /srv/sauvegardes/redmine-fichiers-$(date +%F).tar.gz -C /opt/redmine files config/database.yml config/configuration.yml
```

Mise à jour : nouvelle archive, recopier `config/database.yml`, `config/configuration.yml`, `files/` et `plugins/`, puis `bundle install`, `rake generate_secret_token` (si absent), `RAILS_ENV=production bundle exec rake db:migrate` et `rake redmine:plugins:migrate`. Docker : nouvelle étiquette d'image (migrations au démarrage). Vérifier la compatibilité des extensions avec la version majeure visée.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Erreur 500 après mise à jour | Migration ou extension incompatible | `log/production.log`, retirer l'extension, `rake db:migrate` |
| Pas de notifications | SMTP, notifications désactivées | `configuration.yml`, *Administration → Configuration → Notifications* |
| Vignettes ou PDF absents | ImageMagick, droits sur `tmp/` | Installer ImageMagick, `chown` |
| Dépôt Git invisible | Chemin local requis, droits de lecture | Clone miroir local, droits de l'utilisateur `redmine` |

Commandes : [[90-aide-memoire|aide-mémoire]].
