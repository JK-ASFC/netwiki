---
title: Installation (Linux, Windows, macOS, Docker)
description: Installer Nginx depuis les dépôts de la distribution ou le dépôt officiel nginx.org, sur RHEL avec SELinux, sous Windows (service), sous macOS (Homebrew), en conteneur, modules dynamiques et premières vérifications.
tags: [nginx, installation, debian, rhel, windows, macos, docker]
icon: download
---

## Paquets de la distribution ou dépôt nginx.org ?

| Source | Avantages | Inconvénients |
| --- | --- | --- |
| Distribution (Debian, Ubuntu, RHEL) | Mises à jour de sécurité intégrées, nombreux modules empaquetés (`libnginx-mod-*`) | Version parfois ancienne |
| **nginx.org** (stable / mainline) | Dernières versions, HTTP/3 récent | Structure `conf.d/` (pas de `sites-available`), modules tiers à compiler |

## Debian / Ubuntu

```bash
# Version de la distribution
sudo apt update && sudo apt install nginx
systemctl status nginx

# Ou dépôt officiel nginx.org (mainline)
sudo apt install curl gnupg2 ca-certificates lsb-release debian-archive-keyring
curl -s https://nginx.org/keys/nginx_signing.key | gpg --dearmor | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] http://nginx.org/packages/mainline/debian $(lsb_release -cs) nginx" | sudo tee /etc/apt/sources.list.d/nginx.list
printf "Package: *\nPin: origin nginx.org\nPin-Priority: 900\n" | sudo tee /etc/apt/preferences.d/99nginx
sudo apt update && sudo apt install nginx
```

Sous Debian/Ubuntu (paquets de la distribution), les sites se placent dans `/etc/nginx/sites-available/` et s'activent par lien symbolique :

```bash
sudo ln -s /etc/nginx/sites-available/intranet /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

## RHEL / Rocky Linux / AlmaLinux

```bash
sudo dnf install nginx                      # AppStream (ou dnf module enable nginx:1.26)
sudo systemctl enable --now nginx
sudo firewall-cmd --permanent --add-service=http --add-service=https
sudo firewall-cmd --reload

# SELinux : reverse proxy, ports, contenus
sudo setsebool -P httpd_can_network_connect on
sudo semanage port -a -t http_port_t -p tcp 8443
sudo semanage fcontext -a -t httpd_sys_content_t "/srv/www(/.*)?" && sudo restorecon -Rv /srv/www
```

Nginx utilise sous SELinux le même domaine que Apache (`httpd_t`) : les booléens `httpd_*` s'appliquent.

## Windows

Nginx publie une version Windows (`nginx.org/en/download.html`), fonctionnelle mais limitée : un seul worker réellement efficace, pas d'epoll, certaines fonctions absentes. Elle convient pour un reverse proxy simple, des tests ou des postes de développement.

```powershell
Expand-Archive nginx-1.27.x.zip -DestinationPath C:\
Rename-Item C:\nginx-1.27.x C:\nginx
cd C:\nginx
.\nginx.exe -t                       # tester
start nginx                          # lancer (processus en arrière-plan)
.\nginx.exe -s reload                # recharger
.\nginx.exe -s quit                  # arrêt propre
```

Pour un **service Windows**, utilisez un emballeur comme **WinSW** ou **NSSM** :

```powershell
nssm install nginx C:\nginx\nginx.exe
nssm set nginx AppDirectory C:\nginx
nssm set nginx AppStopMethodConsole 15000
Start-Service nginx
New-NetFirewallRule -DisplayName "Nginx" -Direction Inbound -Protocol TCP -LocalPort 80,443 -Action Allow
```

> [!NOTE]
> Pour la production sous Windows, préférez [[01-iis/06-url-rewrite-arr|IIS + ARR]] ou Nginx dans WSL2 / un conteneur Linux.

## macOS

```bash
brew install nginx
brew services start nginx               # écoute sur 8080 par défaut
nginx -t
# Configuration : /opt/homebrew/etc/nginx/nginx.conf (Apple Silicon) ou /usr/local/etc/nginx (Intel)
# Sites : /opt/homebrew/etc/nginx/servers/*.conf
```

Pour écouter sur 80/443 : `sudo brew services start nginx` (droits root nécessaires pour les ports < 1024).

## Docker

```bash
docker run -d --name web -p 80:80 -p 443:443 \
  -v /srv/nginx/conf.d:/etc/nginx/conf.d:ro \
  -v /srv/nginx/certs:/etc/nginx/certs:ro \
  -v /srv/www:/usr/share/nginx/html:ro \
  nginx:stable
docker exec web nginx -t && docker exec web nginx -s reload
```

Variante non-root : `nginxinc/nginx-unprivileged` (écoute sur 8080).

## Modules

```bash
nginx -V 2>&1 | tr ' ' '\n' | grep -E "module|with"     # modules compilés
ls /usr/lib/nginx/modules/ /etc/nginx/modules-enabled/ 2>/dev/null
sudo apt install libnginx-mod-http-headers-more-filter libnginx-mod-stream libnginx-mod-http-geoip2   # Debian
```

```nginx
# Modules dynamiques, en tête de nginx.conf
load_module modules/ngx_http_headers_more_filter_module.so;
load_module modules/ngx_stream_module.so;
```

Les modules tiers non empaquetés (Brotli, VTS, ModSecurity) se compilent **pour la version exacte** de Nginx avec `./configure --with-compat --add-dynamic-module=… && make modules`.

## Vérifications

```bash
nginx -v ; nginx -V
sudo nginx -t                    # syntaxe
sudo nginx -T | less             # configuration complète effective (tous les include)
ss -tlnp | grep nginx
curl -I http://localhost
tail -f /var/log/nginx/error.log
```

## Commandes de contrôle

| Commande | Effet |
| --- | --- |
| `systemctl reload nginx` / `nginx -s reload` | Rechargement sans coupure |
| `nginx -s reopen` | Rouvrir les journaux (après rotation) |
| `nginx -s quit` | Arrêt gracieux |
| `nginx -s stop` | Arrêt immédiat |
| Mise à jour binaire à chaud | `kill -USR2 $(cat /run/nginx.pid)` puis `kill -WINCH` / `-QUIT` de l'ancien maître (fait par `systemctl` lors des mises à jour de paquet sur certaines distributions) |
