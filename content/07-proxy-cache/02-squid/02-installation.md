---
title: Installation (Linux, Windows, macOS, Docker)
description: Installer Squid sur Debian/Ubuntu (squid ou squid-openssl), RHEL/Rocky/Alma avec SELinux, Windows (Squid for Windows de Diladele), macOS (Homebrew) et Docker, arborescence, initialisation du cache, pare-feu et test avec curl.
tags: [squid, installation, debian, rhel, windows, macos, docker]
icon: download
---

## Debian / Ubuntu

```bash
sudo apt update
sudo apt install squid-openssl        # « squid » si l'inspection HTTPS (SSL Bump) n'est pas prévue
squid -v | head -2
systemctl status squid
```

## RHEL / Rocky / Alma

```bash
sudo dnf install squid
sudo systemctl enable --now squid
sudo firewall-cmd --permanent --add-service=squid      # 3128/tcp
sudo firewall-cmd --reload
```

SELinux : Squid fonctionne dans le domaine `squid_t`. Pour un port non standard ou un cache ailleurs que dans `/var/spool/squid` :

```bash
sudo semanage port -a -t squid_port_t -p tcp 8080
sudo semanage fcontext -a -t squid_cache_t "/srv/squid-cache(/.*)?" && sudo restorecon -Rv /srv/squid-cache
getsebool -a | grep squid       # squid_connect_any, squid_use_tproxy…
```

## Arborescence

| Élément | Emplacement |
| --- | --- |
| Configuration | `/etc/squid/squid.conf` (+ `/etc/squid/conf.d/*.conf` sous Debian) |
| Cache disque | `/var/spool/squid/` |
| Journaux | `/var/log/squid/access.log`, `cache.log` |
| Pages d'erreur | `/usr/share/squid/errors/<langue>/` (personnalisables) |
| Helpers | `/usr/lib/squid/` (Debian), `/usr/lib64/squid/` (RHEL) |
| Utilisateur | `proxy` (Debian), `squid` (RHEL) |

> [!TIP]
> Le fichier `squid.conf` livré fait plusieurs milliers de lignes de commentaires (documentation complète). Conservez-le en référence (`squid.conf.dist`) et rédigez une configuration courte et lisible.

```bash
sudo cp /etc/squid/squid.conf /etc/squid/squid.conf.dist
grep -vE '^\s*(#|$)' /etc/squid/squid.conf.dist     # ne voir que les directives actives
```

## Windows : Squid for Windows

**Diladele** publie *Squid for Windows* (MSI), installé comme service Windows dans `C:\Squid`.

1. Installer le MSI (64 bits) ; l'icône *Squid Server Tray* permet d'ouvrir la configuration et de démarrer/arrêter.
2. Configuration : `C:\Squid\etc\squid\squid.conf` (syntaxe identique ; chemins de style Cygwin : `/cygdrive/c/…`).
3. Pare-feu :

```powershell
New-NetFirewallRule -DisplayName "Squid 3128" -Direction Inbound -Protocol TCP -LocalPort 3128 -Action Allow -RemoteAddress 10.0.0.0/8
Get-Service squidsrv
```

> [!NOTE]
> La version Windows suit le développement avec un décalage et ne supporte pas toutes les fonctions (helpers Kerberos limités). Pour la production, préférez Squid sous Linux (VM) ; sous Windows, le proxy natif est plutôt le rôle **Web Application Proxy** ou une solution tierce.

## macOS

```bash
brew install squid
squid -v
squid -z -f $(brew --prefix)/etc/squid.conf      # initialiser le cache
brew services start squid
```

## Docker

```bash
docker run -d --name squid --restart unless-stopped -p 3128:3128 \
  -v /srv/squid/squid.conf:/etc/squid/squid.conf:ro \
  -v /srv/squid/cache:/var/spool/squid \
  -v /srv/squid/log:/var/log/squid \
  ubuntu/squid:latest
```

## Configuration minimale de départ

```squid /etc/squid/squid.conf
# Réseaux autorisés
acl localnet src 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16

acl SSL_ports port 443
acl Safe_ports port 80 443 21 1025-65535
acl CONNECT method CONNECT

http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports
http_access allow localhost manager
http_access deny manager
http_access allow localnet
http_access allow localhost
http_access deny all

http_port 3128
visible_hostname proxy.exemple.fr
coredump_dir /var/spool/squid
cache_mem 512 MB
cache_dir rock /var/spool/squid 20000
```

## Initialiser, vérifier, démarrer

```bash
sudo squid -k parse                  # vérifier la syntaxe
sudo squid -z                        # créer les structures du cache disque (après tout ajout de cache_dir)
sudo systemctl restart squid
sudo squid -k reconfigure            # recharger la configuration sans redémarrer
ss -tlnp | grep 3128
```

## Tester

```bash
curl -x http://proxy.exemple.fr:3128 -I http://www.debian.org
curl -x http://proxy.exemple.fr:3128 -I https://www.debian.org        # passe par CONNECT
tail -f /var/log/squid/access.log
```

```powershell
# Windows
Invoke-WebRequest -Uri https://www.debian.org -Proxy http://proxy.exemple.fr:3128 -UseBasicParsing | Select-Object StatusCode
```

## Déclarer le proxy sur les postes

| Méthode | Mise en œuvre |
| --- | --- |
| GPO (Windows) | *Configuration utilisateur → Préférences → Paramètres du Panneau de configuration → Paramètres Internet*, ou paramètres de Microsoft Edge / Chrome par ADMX (`ProxyServer`, `ProxyPacUrl`) |
| Fichier PAC / WPAD | Voir [[06-transparent-wpad-exploitation]] |
| Linux | Variables `http_proxy`, `https_proxy`, `no_proxy` (`/etc/environment`), configuration `apt` (`Acquire::http::Proxy`) |
| Système (WinHTTP, services Windows) | `netsh winhttp set proxy proxy.exemple.fr:3128 "*.corp.exemple.fr;<local>"` |
