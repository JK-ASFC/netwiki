---
title: Installation (Linux, Windows, macOS, Docker)
description: Installer MariaDB ou MySQL sous Debian/Ubuntu (paquets de la distribution, dépôts officiels MariaDB et Oracle), RHEL, Windows (MSI, winget, service), macOS (Homebrew) et Docker, sécuriser l'installation initiale, emplacements des fichiers et premières connexions.
tags: [mariadb, mysql, installation, windows, macos, docker, secure-installation]
icon: download
---

## Debian / Ubuntu

### MariaDB

```bash
sudo apt install mariadb-server mariadb-client
sudo systemctl enable --now mariadb
sudo mariadb-secure-installation
sudo mariadb                     # root se connecte par le socket Unix (plugin unix_socket), sans mot de passe
```

Version plus récente que celle de la distribution : dépôt officiel.

```bash
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup \
  | sudo bash -s -- --mariadb-server-version="mariadb-11.4"
sudo apt update && sudo apt install mariadb-server
```

### MySQL

```bash
# Ubuntu : paquets de la distribution
sudo apt install mysql-server
# Debian : dépôt APT d'Oracle (paquet mysql-apt-config, choix de la série 8.4 LTS)
wget https://dev.mysql.com/get/mysql-apt-config_0.8.33-1_all.deb   # version courante sur dev.mysql.com
sudo apt install ./mysql-apt-config_*.deb && sudo apt update && sudo apt install mysql-server
sudo mysql_secure_installation
```

## RHEL / Rocky / Alma

```bash
sudo dnf install mariadb-server          # ou : sudo dnf install mysql-server
sudo systemctl enable --now mariadb      # ou : mysqld
sudo mariadb-secure-installation         # ou : mysql_secure_installation
sudo firewall-cmd --permanent --add-service=mysql && sudo firewall-cmd --reload
```

Sous RHEL, MySQL génère un **mot de passe root temporaire** au premier démarrage s'il vient du dépôt Oracle : `sudo grep 'temporary password' /var/log/mysqld.log`.

## Sécurisation initiale

Le script `*-secure-installation` :

- définit ou vérifie l'authentification de root ;
- supprime les utilisateurs anonymes ;
- interdit la connexion de root à distance ;
- supprime la base `test`.

## Windows

```powershell
winget install --id MariaDB.Server -e
winget install --id Oracle.MySQL -e          # MySQL Installer / serveur
Get-Service | Where-Object Name -match 'mysql|maria'
```

| Élément | Emplacement (par défaut) |
| --- | --- |
| Configuration | `C:\ProgramData\MySQL\MySQL Server 8.4\my.ini` / `C:\Program Files\MariaDB 11.4\data\my.ini` |
| Données | `C:\ProgramData\MySQL\MySQL Server 8.4\Data` / répertoire `data` de MariaDB |
| Service | `MySQL84` / `MariaDB` |
| Outils | MySQL Workbench, HeidiSQL (fourni avec MariaDB) |

Pensez au pare-feu Windows (TCP 3306) uniquement si des clients distants doivent se connecter.

## macOS

```bash
brew install mariadb                  # ou : brew install mysql@8.4
brew services start mariadb
mariadb -u "$(whoami)"                # MariaDB Homebrew : compte de l'utilisateur macOS
```

Oracle propose aussi un paquet DMG pour MySQL (avec panneau de préférences).

## Docker

```bash
docker run -d --name mariadb --restart unless-stopped \
  -e MARIADB_ROOT_PASSWORD='MotDePasseRoot' -e MARIADB_DATABASE=app \
  -e MARIADB_USER=app -e MARIADB_PASSWORD='MotDePasseApp' \
  -v mariadb-data:/var/lib/mysql -p 127.0.0.1:3306:3306 mariadb:11.4

docker run -d --name mysql -e MYSQL_ROOT_PASSWORD='MotDePasseRoot' \
  -v mysql-data:/var/lib/mysql -p 127.0.0.1:3307:3306 mysql:8.4
```

## Emplacements sous Linux

| Élément | Debian / Ubuntu | RHEL |
| --- | --- | --- |
| Configuration | `/etc/mysql/my.cnf` → `mariadb.conf.d/50-server.cnf` ou `mysql.conf.d/mysqld.cnf` | `/etc/my.cnf`, `/etc/my.cnf.d/` |
| Données | `/var/lib/mysql` | `/var/lib/mysql` |
| Journal d'erreurs | `journalctl -u mariadb` / `/var/log/mysql/error.log` | `/var/log/mariadb/mariadb.log` / `/var/log/mysqld.log` |
| Socket | `/run/mysqld/mysqld.sock` | `/var/lib/mysql/mysql.sock` |

## Premières connexions

```bash
sudo mariadb -e "SELECT VERSION(); SHOW DATABASES;"
mysql -h db1.corp.exemple.fr -u app -p app          # connexion distante
mysqladmin -u root -p status                         # mariadb-admin pour MariaDB
```

```ini ~/.my.cnf (chmod 600 — évite de saisir le mot de passe dans les scripts)
[client]
user=sauvegarde
password=MotDePasse
```
