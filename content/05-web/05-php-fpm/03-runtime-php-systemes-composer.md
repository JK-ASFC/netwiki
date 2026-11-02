---
title: Runtime PHP — installation par système, CLI et Composer
description: PHP comme runtime (CLI et serveur) — versions 8.2 à 8.5 et fin de support, installation sous Debian, Ubuntu, RHEL, Rocky, Alma, Fedora, Alpine, Arch, openSUSE, Windows (zip NTS, Chocolatey), macOS (Homebrew), FreeBSD et Docker (php:cli, php:fpm), php.ini en CLI, serveur intégré de test, Composer (installation vérifiée, audit, mise à jour) et tâches planifiées.
tags: [php, runtime, composer, cli, alpine, arch, opensuse, freebsd, windows, macos, docker]
icon: terminal
---

Cet article complète [[01-presentation-installation-pools|PHP-FPM]] : il couvre **PHP comme runtime** (scripts en ligne de commande, tâches planifiées, outils comme Composer) sur tous les systèmes. Pour servir des pages web en production, utilisez PHP-FPM derrière nginx, Apache ou Caddy.

## Versions et fin de support

| Branche | Support actif jusqu'au | Sécurité jusqu'au |
| --- | --- | --- |
| 8.2 | 31/12/2024 (terminé) | 31/12/2026 |
| 8.3 | 31/12/2025 (terminé) | 31/12/2027 |
| 8.4 | 31/12/2026 | 31/12/2028 |
| 8.5 | 31/12/2027 | 31/12/2029 |

Source : php.net/supported-versions.php. Pour une nouvelle installation, choisissez la plus récente branche que l'application accepte.

> [!WARNING]
> PHP 8.2 ne reçoit plus de correctif après le 31 décembre 2026. Planifiez la migration des applications qui l'utilisent.

## Installation par système

### Debian / Ubuntu

```bash
sudo apt update
sudo apt install -y php-cli php-curl php-mbstring php-xml php-zip php-intl
php -v
```

La version dépend de la distribution. Pour une autre branche, utilisez le dépôt d'Ondřej Surý (voir [[01-presentation-installation-pools|PHP-FPM]]), puis `sudo apt install php8.4-cli`. Le changement de version par défaut se fait avec `sudo update-alternatives --set php /usr/bin/php8.4`.

### RHEL / Rocky / Alma / Fedora

```bash
sudo dnf module list php
sudo dnf module enable php:8.2 -y
sudo dnf install -y php-cli php-mbstring php-xml php-intl
php -v
```

Les flux de modules existent sur RHEL, Rocky et Alma. Sous Fedora, il n'y a pas de flux : `sudo dnf install php-cli` installe la version récente. SELinux ne gêne pas la ligne de commande ; il intervient pour PHP-FPM et le serveur web (voir [[02-securite-exploitation|sécurité et exploitation]]).

### Alpine, Arch, openSUSE

```bash
# Alpine (paquets versionnés : php84, php85…)
apk add php84 php84-mbstring php84-curl php84-openssl php84-phar
# Arch Linux
sudo pacman -S php
# openSUSE
sudo zypper install php8 php8-mbstring php8-curl php8-zip
```

> [!NOTE]
> Les noms exacts des paquets Alpine et openSUSE changent selon la version de la distribution : cherchez avec `apk search php84` ou `zypper search php`.

### Windows

Les binaires officiels sont des archives zip sur windows.php.net/download (build **NTS** pour la ligne de commande et IIS ; il faut le *Visual C++ Redistributable* indiqué sur la page).

```powershell
# Après extraction du zip dans C:\php
Copy-Item C:\php\php.ini-production C:\php\php.ini
[Environment]::SetEnvironmentVariable('Path', $env:Path + ';C:\php', 'Machine')
php -v
```

```powershell
choco install php        # paquet Chocolatey communautaire
```

Pour IIS : [[01-iis/07-applications-aspnet-php|IIS et PHP]].

### macOS et FreeBSD

```bash
# macOS
brew install php
brew install php@8.4 && brew link --overwrite php@8.4
# FreeBSD
sudo pkg install php84 php84-mbstring php84-curl php84-phar
```

Sous FreeBSD, PHP-FPM s'active avec `sudo sysrc php_fpm_enable=YES` puis `sudo service php-fpm start`.

### Conteneur

```bash
docker run --rm -v "$PWD":/app -w /app php:8.4-cli php script.php
docker run -d --name srv-php-fpm -p 127.0.0.1:9000:9000 -v /srv/www/appli1:/var/www/html php:8.4-fpm
```

L'image officielle `php` contient peu d'extensions ; ajoutez-les dans un Dockerfile avec `docker-php-ext-install pdo_mysql intl`.

## Configuration en ligne de commande

Le CLI lit son propre fichier (`/etc/php/8.3/cli/php.ini` sous Debian, `/etc/php.ini` sous RHEL).

```bash
php --ini                          # fichiers chargés
php -m                             # extensions
php -d memory_limit=1G script.php  # surcharge ponctuelle
php -S 127.0.0.1:8080 -t public    # serveur intégré : test local uniquement
```

> [!WARNING]
> Le serveur intégré (`php -S`) est réservé au développement : un seul processus, aucune protection. N'exposez jamais son port.

## Composer

**Composer** gère les dépendances PHP (`composer.json`, `composer.lock`, dossier `vendor/`).

```bash
# Installation officielle : récupérer l'installeur et vérifier son empreinte SHA-384
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "echo hash_file('sha384', 'composer-setup.php'), PHP_EOL;"
```

Comparez l'empreinte affichée à celle publiée sur getcomposer.org/download avant de continuer :

```bash
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

```bash
composer self-update                               # mettre Composer à jour
composer install --no-dev --optimize-autoloader   # déploiement reproductible depuis composer.lock
composer audit                                     # vulnérabilités connues des dépendances
composer outdated --direct
```

Ne lancez pas Composer en `root` pour une application : utilisez le compte de service de l'application, et laissez `vendor/` en lecture seule pour le serveur web.

## Tâches planifiées

```text /etc/cron.d/appli1
*/5 * * * * appli1 /usr/bin/php /srv/www/appli1/bin/console cron:run >> /var/log/php/appli1-cron.log 2>&1
```

Aide-mémoire : [[90-aide-memoire|commandes PHP et PHP-FPM]].
