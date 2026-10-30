---
title: Installation, configuration et exploitation
description: Radicale, serveur CalDAV et CardDAV léger en Python — installation (paquet, pip ou uv dans un environnement virtuel, Docker, Windows, macOS), fichier de configuration, authentification (htpasswd bcrypt, LDAP, en-tête de reverse proxy), règles de droits, stockage en fichiers et versionnement Git, reverse proxy HTTPS, clients (Thunderbird, DAVx⁵, iOS, macOS), sauvegarde et dépannage.
tags: [radicale, caldav, carddav, agendas, contacts, python, reverse proxy]
icon: calendar
---

**Radicale** (GPL) partage **agendas** (CalDAV) et **carnets d'adresses** (CardDAV) sans base de données : chaque élément est un fichier `.ics`/`.vcf` sur disque. Idéal pour une petite structure, une équipe ou un usage personnel ; pour une messagerie collaborative complète, voir Nextcloud ([[08-nextcloud/01-presentation-installation|Nextcloud]]) ou les suites de messagerie.

## Installation

```bash
# Paquet (Debian/Ubuntu, Fedora)
sudo apt install radicale apache2-utils
# Ou version récente dans un environnement virtuel
sudo useradd -r -m -d /var/lib/radicale -s /usr/sbin/nologin radicale
sudo -u radicale python3 -m venv /var/lib/radicale/venv
sudo -u radicale /var/lib/radicale/venv/bin/pip install "radicale[bcrypt]"
```

Docker : images communautaires ; Windows et macOS : `pip install radicale` (Python requis), utile pour un usage local.

```ini /etc/radicale/config
[server]
hosts = 127.0.0.1:5232
max_connections = 20
max_content_length = 100000000
timeout = 30

[auth]
type = htpasswd
htpasswd_filename = /etc/radicale/utilisateurs
htpasswd_encryption = bcrypt
delay = 1

[rights]
type = from_file
file = /etc/radicale/droits

[storage]
filesystem_folder = /var/lib/radicale/collections
# Versionnement Git de chaque modification (historique, retour arrière)
hook = git add -A && (git diff --cached --quiet || git commit -m "Modification par %(user)s")

[logging]
level = info
```

```bash
sudo htpasswd -B -c /etc/radicale/utilisateurs alice
sudo htpasswd -B /etc/radicale/utilisateurs bob
sudo -u radicale git init /var/lib/radicale/collections
```

## Droits

```ini /etc/radicale/droits
# Chaque utilisateur gère ses propres collections
[proprietaire]
user: .+
collection: {user}(/.*)?
permissions: RrWw

# Lecture de la racine (découverte)
[racine]
user: .+
collection:
permissions: R

# Agenda partagé de l'équipe : lecture/écriture pour alice et bob
[equipe]
user: (alice|bob)
collection: equipe(/.*)?
permissions: rw
```

## Authentification centralisée

| Méthode | Configuration |
| --- | --- |
| htpasswd | Fichier local (bcrypt), simple |
| **LDAP** (Radicale 3.2+) | `type = ldap`, `ldap_uri = ldaps://dc01.corp.exemple.fr`, `ldap_base`, `ldap_filter = (&(objectClass=person)(sAMAccountName={0}))`, compte de liaison |
| En-tête du reverse proxy | `type = http_x_remote_user` : le proxy (avec SSO) authentifie et transmet `X-Remote-User` — n'exposer Radicale **qu'au** proxy |

## Reverse proxy HTTPS

```nginx
location /radicale/ {
    proxy_pass http://127.0.0.1:5232/;
    proxy_set_header X-Script-Name /radicale;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_pass_header Authorization;
}
```

Ajoutez les redirections de découverte `/.well-known/caldav` et `/.well-known/carddav` vers `/radicale/` pour que les clients trouvent le service avec la seule adresse du serveur.

## Clients

| Client | Configuration |
| --- | --- |
| Thunderbird | Nouvel agenda → *Sur le réseau* → `https://dav.exemple.fr/radicale/` |
| Android | **DAVx⁵** (synchronise agendas et contacts avec les applications natives) |
| iOS / macOS | *Comptes* → CalDAV / CardDAV (compte « Autre ») |
| Interface web | `https://dav.exemple.fr/radicale/` : création de collections, import, URL de chaque collection |

## Sauvegarde et dépannage

Sauvegardez `/var/lib/radicale/collections` (fichiers simples, dépôt Git inclus) avec [[01-restic/01-presentation-installation|restic]] ou tout outil de fichiers.

| Symptôme | Cause | Solution |
| --- | --- | --- |
| 401 en boucle | Mot de passe, chiffrement htpasswd non pris en charge | `htpasswd -B`, extra `bcrypt` installé |
| 403 sur une collection | Règle de droits | Fichier `droits`, journal de Radicale (`level = debug` temporairement) |
| Les clients ne découvrent pas les agendas | Redirections `.well-known` absentes, `X-Script-Name` | Ajouter les redirections, en-tête du proxy |
| Lenteur avec de grands agendas | Nombreux fichiers, disque lent | Disque SSD, nettoyage des anciens événements |
