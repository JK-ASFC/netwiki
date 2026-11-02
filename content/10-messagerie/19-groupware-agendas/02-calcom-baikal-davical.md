---
title: Cal.com (Cal.diy), Baïkal et DAViCal
description: Agendas et prise de rendez-vous auto-hébergés — Cal.com / Cal.diy (MIT : pages de réservation, disponibilités, intégration Google Agenda, Outlook et CalDAV, visioconférence ; Docker Compose du dépôt, variables NEXT_PUBLIC_WEBAPP_URL, NEXTAUTH_SECRET, CALENDSO_ENCRYPTION_KEY, DATABASE_URL, SMTP), Baïkal (GPL, PHP sabre/dav : serveur CalDAV et CardDAV léger, SQLite ou MySQL, assistant d'installation, Docker ckulka/baikal) et DAViCal (GPL, PHP et PostgreSQL : serveur CalDAV, paquet Debian davical), clients (Thunderbird, DAVx5, iOS, macOS, Outlook), sécurité et sauvegarde.
tags: [cal.com, cal.diy, baikal, davical, caldav, carddav, agenda, rendez-vous]
icon: calendar-check
---

| | **Cal.com / Cal.diy** | **Baïkal** | **DAViCal** |
| --- | --- | --- | --- |
| Rôle | Prise de **rendez-vous** en ligne (alternative à Calendly) | Serveur **CalDAV + CardDAV** | Serveur **CalDAV** (et CardDAV) |
| Licence | MIT (édition communautaire Cal.diy) | GPL v3 | GPL v2 |
| Socle | Next.js, PostgreSQL | PHP (sabre/dav), SQLite ou MySQL | PHP, PostgreSQL |
| Interface | Complète (utilisateurs, événements, intégrations) | Administration des comptes | Administration web |

Voir aussi [[08-radicale/01-installation-configuration|Radicale]] (CalDAV/CardDAV en Python) et [[01-sogo-kopano|SOGo]] (groupware complet).

## Cal.com et Cal.diy

L'édition auto-hébergeable de Cal.com s'appelle désormais **Cal.diy** (MIT) ; l'éditeur la destine à un **usage personnel ou non critique**, et propose Cal.com (hébergé ou sur site sous contrat) pour la production d'entreprise. Fonctions : types d'événements, disponibilités, pages de réservation publiques, connexion à Google Agenda, Microsoft 365, CalDAV, liens de visioconférence (Jitsi, Zoom, Teams), rappels par courriel, webhooks.

```bash
git clone --depth 1 https://github.com/calcom/cal.com.git calcom && cd calcom
cp .env.example .env
nano .env
docker compose up -d database redis calcom
```

Variables essentielles de `.env` :

```ini
NEXT_PUBLIC_WEBAPP_URL=https://rdv.corp.exemple.fr
NEXTAUTH_SECRET=resultat_de_openssl_rand_base64_32
CALENDSO_ENCRYPTION_KEY=resultat_de_openssl_rand_base64_24
POSTGRES_USER=unicorn_user
POSTGRES_PASSWORD=MdpCalcom2026
POSTGRES_DB=calendso
DATABASE_HOST=database:5432
EMAIL_FROM=rdv@corp.exemple.fr
EMAIL_SERVER_HOST=smtp.corp.exemple.fr
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=rdv@corp.exemple.fr
EMAIL_SERVER_PASSWORD=MdpSmtp2026
CALCOM_TELEMETRY_DISABLED=1
```

Le service `database` de `docker-compose.yml` fixe aussi `POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB` : y reporter le même mot de passe que dans `.env`. L'application écoute sur le port 3000 (reverse proxy TLS). Le premier compte créé via `https://rdv.corp.exemple.fr/auth/setup` est l'administrateur. Sous Windows et macOS : Docker Desktop.

<!-- CAPTURE: Page de réservation publique Cal.diy | _assets/caldiy-reservation.png -->

## Baïkal

```bash
sudo apt install -y nginx php-fpm php-sqlite3 php-xml php-mbstring unzip
V=0.13.0
wget https://github.com/sabre-io/Baikal/releases/download/$V/baikal-$V.zip
sudo unzip baikal-$V.zip -d /var/www/ && sudo chown -R www-data:www-data /var/www/baikal/Specific /var/www/baikal/config
```

Racine web : `/var/www/baikal/html` (les dossiers `Specific/` et `config/` doivent rester hors d'atteinte du web). Ouvrir `https://dav.corp.exemple.fr/admin/install/` : mot de passe administrateur, fuseau horaire, authentification (Digest ou Basic), base **SQLite** ou **MySQL**. Créer ensuite les utilisateurs, leurs agendas et carnets d'adresses dans l'administration.

Docker (image communautaire très utilisée) :

```bash
docker run -d --name baikal -p 127.0.0.1:8082:80 -v baikal_config:/var/www/baikal/config -v baikal_data:/var/www/baikal/Specific ckulka/baikal:latest
```

Adresses pour les clients : `https://dav.corp.exemple.fr/dav.php` (découverte automatique), `https://dav.corp.exemple.fr/dav.php/calendars/jk/default/` (agenda), `https://dav.corp.exemple.fr/dav.php/addressbooks/jk/default/` (contacts). Publier aussi les redirections `/.well-known/caldav` et `/.well-known/carddav` vers `/dav.php`.

<!-- CAPTURE: Administration Baïkal, liste des utilisateurs | _assets/baikal-utilisateurs.png -->

## DAViCal

```bash
sudo apt install -y davical postgresql apache2
# créer les rôles et la base (script fourni) ; voir /usr/share/doc/davical/README.Debian
sudo -u postgres /usr/share/davical/dba/create-database.sh davical 'MdpAdminDavical2026'
```

Autoriser les comptes `davical_app` et `davical_dba` dans `pg_hba.conf`, configurer le site dans `/etc/davical/config.php` (nom du système, domaine, authentification éventuellement LDAP), activer la configuration Apache fournie, puis ouvrir l'interface d'administration (`https://caldav.corp.exemple.fr/`, compte `admin`). Adresse CalDAV d'un utilisateur : `https://caldav.corp.exemple.fr/caldav.php/jk/calendar/`.

## Clients et exploitation

| Client | Configuration |
| --- | --- |
| Thunderbird | Nouvel agenda réseau → adresse du serveur (découverte CalDAV/CardDAV) |
| Android | **DAVx5** (agendas, contacts, tâches) |
| iOS, macOS | Réglages → Comptes → Autre → CalDAV / CardDAV |
| Outlook (Windows) | Extension tierce (CalDAV Synchronizer) |

- HTTPS obligatoire (mots de passe transmis à chaque requête), comptes dédiés, pas d'inscription libre.
- Sauvegarde : base (SQLite dans `Specific/db/` pour Baïkal, PostgreSQL pour DAViCal et Cal.diy) et fichiers de configuration.

Commandes : [[90-aide-memoire|aide-mémoire]].
