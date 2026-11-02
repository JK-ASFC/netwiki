---
title: Canvas, Chamilo, ILIAS et Open edX
description: Autres LMS libres — Canvas LMS (AGPL, Instructure : Ruby on Rails, PostgreSQL, Redis ; installation de production depuis les sources, delayed jobs), Chamilo (GPL : LMS simple et léger, version 2 sur Symfony, PHP 8.3+, archive, configuration Apache fournie, assistant web), ILIAS (GPL : LMS complet des administrations germanophones, PHP 8.3/8.4, MariaDB, git clone et composer, cli/setup.php install) et Open edX (AGPL : MOOC à grande échelle, déploiement par Tutor, tutor local launch), comparaison, prérequis et exploitation.
tags: [canvas, chamilo, ilias, open edx, tutor, lms, e-learning]
icon: book-open-check
---

| LMS | Licence | Socle | Points forts | Complexité |
| --- | --- | --- | --- | --- |
| [[01-moodle\|Moodle]] | GPL v3 | PHP | Le plus complet et répandu | Moyenne |
| **Canvas LMS** | AGPL v3 | Ruby on Rails | Interface moderne, très utilisé en Amérique du Nord | Élevée |
| **Chamilo** | GPL v3 | PHP (Symfony en v2) | Simple, léger, francophone et hispanophone | Faible |
| **ILIAS** | GPL v3 | PHP | Très complet (tests, compétences, conformité), Allemagne, Suisse | Moyenne |
| **Open edX** | AGPL v3 | Python/Django | MOOC à très grande échelle, vidéos, certificats | Élevée (Tutor) |

## Canvas LMS

Instructure publie le code de Canvas ; l'installation de production (guide *Production Start* du wiki du projet) se fait sur Ubuntu : Ruby (version indiquée par le projet), Node.js, PostgreSQL, Redis, Apache + Passenger, puis :

```bash
git clone https://github.com/instructure/canvas-lms.git /var/canvas && cd /var/canvas && git checkout prod
# copier les exemples de config/*.yml.example en *.yml (database.yml, domain.yml, outgoing_mail.yml, security.yml, redis.yml)
bundle config set --local without 'pulsar' && bundle install
yarn install
RAILS_ENV=production bundle exec rake canvas:compile_assets
RAILS_ENV=production bundle exec rake db:initial_setup      # base et compte administrateur
sudo ln -s /var/canvas/script/canvas_init /etc/init.d/canvas_init && sudo update-rc.d canvas_init defaults   # tâches de fond (delayed jobs)
```

Les tâches de fond (*delayed jobs*) sont indispensables (courriels, notifications, importations). Canvas demande des compétences Ruby/Rails solides ; l'offre hébergée d'Instructure est l'option la plus courante. Pour le développement : configuration Docker fournie par le projet.

## Chamilo

**Chamilo 2** (Symfony, PHP 8.3 à 8.5) succède à la branche 1.11 :

```bash
sudo apt install -y apache2 libapache2-mod-php mariadb-server unzip curl php-{apcu,bcmath,cli,curl,gd,intl,ldap,mbstring,mysql,redis,soap,xml,zip}
sudo mysql -e "CREATE USER chamilo@localhost IDENTIFIED BY 'MdpChamilo2026'; GRANT ALL PRIVILEGES ON chamilo.* TO chamilo@localhost;"
cd /var/www
V=2.0.3                                      # dernière version publiée (page Releases du projet)
sudo wget https://github.com/chamilo/chamilo-lms/releases/download/v$V/chamilo-$V.tar.gz && sudo tar zxf chamilo-$V.tar.gz
cd chamilo && sudo cp public/main/install/apache.dist.conf /etc/apache2/sites-available/chamilo.conf
sudo a2ensite chamilo && sudo a2enmod rewrite ssl headers expires
sudo touch .env && sudo chown -R www-data: .env config/ var/ && sudo systemctl restart apache2
```

Adapter `ServerName` et le certificat dans `chamilo.conf`, puis ouvrir `https://elearning.corp.exemple.fr` : l'**assistant d'installation** crée la base et l'administrateur. Chamilo 1.11 (PHP 7.4/8.x) reste répandu ; la migration vers la v2 se fait par l'assistant de mise à jour. Windows : WAMP ou IIS avec PHP ; macOS : PHP de Homebrew.

## ILIAS

Prérequis : PHP 8.3 ou 8.4, MariaDB 10.5–11.8 (recommandée) ou MySQL 8.0.21+, Composer, Apache ou NGINX, dossiers de données hors de la racine web.

```bash
cd /var/www && sudo -u www-data git clone -b release_11 https://github.com/ILIAS-eLearning/ILIAS.git ilias
cd ilias && sudo -u www-data composer install --no-dev
sudo -u www-data php cli/setup.php install /var/www/config/ilias.json       # configuration JSON : base, chemins, URL, langue
sudo -u www-data php cli/setup.php help
```

Le fichier `ilias.json` décrit la base, les dossiers de données (`/var/www/files`, `/var/iliasdata`), l'URL, le compte d'administration et les modules ; un exemple minimal figure dans la documentation d'installation du dépôt. Mise à jour : `git pull` sur la branche, `composer install --no-dev`, puis `php cli/setup.php update /var/www/config/ilias.json`.

## Open edX (Tutor)

**Tutor** est la distribution Docker officielle d'Open edX :

```bash
pip install "tutor[full]"
tutor local launch                  # questions : domaines LMS et Studio, langue, puis construction et démarrage
tutor local do createuser --staff --superuser jk-admin admin@corp.exemple.fr
tutor local status ; tutor local logs -f lms
```

Prévoir au moins 8 Go de RAM et 4 vCPU. Le LMS (`https://cours.corp.exemple.fr`) sert les apprenants, **Studio** (`https://studio.cours.corp.exemple.fr`) la création des cours. Extensions Tutor (`tutor plugins list`), mise à jour : nouvelle version de Tutor puis `tutor local launch`.

Commandes : [[90-aide-memoire|aide-mémoire]].
