---
title: Installation (Linux, Windows, macOS, Docker)
description: Installer HAProxy depuis la distribution ou les dépôts récents (haproxy.debian.net, COPR), sous RHEL avec SELinux, sous Windows (WSL2, Docker), macOS (Homebrew) et en conteneur, réglages système et vérification de la configuration.
tags: [haproxy, installation, debian, rhel, docker, macos, windows]
icon: download
---

## Debian / Ubuntu

```bash
# Version de la distribution
sudo apt update && sudo apt install haproxy
haproxy -v

# Version LTS récente via haproxy.debian.net (ex. 3.2 sur Debian 12)
sudo apt install curl gnupg
curl https://haproxy.debian.net/haproxy-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/haproxy.debian.net.gpg
echo "deb [signed-by=/usr/share/keyrings/haproxy.debian.net.gpg] http://haproxy.debian.net bookworm-backports-3.2 main" | sudo tee /etc/apt/sources.list.d/haproxy.list
sudo apt update && sudo apt install haproxy=3.2.\*

# Ubuntu : PPA de Vincent Bernat
sudo add-apt-repository ppa:vbernat/haproxy-3.2 && sudo apt install haproxy=3.2.\*
```

## RHEL / Rocky / Alma

```bash
sudo dnf install haproxy                     # version de la distribution (2.8 LTS sur EL9)
sudo systemctl enable --now haproxy
sudo firewall-cmd --permanent --add-service=http --add-service=https --add-port=8404/tcp
sudo firewall-cmd --reload

# SELinux : autoriser HAProxy à se connecter à n'importe quel port backend
sudo setsebool -P haproxy_connect_any on
```

## Fichiers

| Élément | Emplacement |
| --- | --- |
| Configuration | `/etc/haproxy/haproxy.cfg` (+ `conf.d/*.cfg` si le service l'inclut) |
| Certificats | `/etc/haproxy/certs/` (convention) |
| Erreurs personnalisées | `/etc/haproxy/errors/*.http` |
| Socket runtime | `/run/haproxy/admin.sock` |
| Journaux | via syslog (`/var/log/haproxy.log` sous Debian grâce à rsyslog) |
| Options du service | `/etc/default/haproxy` (Debian), `/etc/sysconfig/haproxy` (RHEL) |

Charger plusieurs fichiers : `-f /etc/haproxy/haproxy.cfg -f /etc/haproxy/conf.d/` dans le service (`systemctl edit haproxy`) :

```ini /etc/systemd/system/haproxy.service.d/conf-d.conf
[Service]
Environment="CONFIG=/etc/haproxy/haproxy.cfg" "EXTRAOPTS=-f /etc/haproxy/conf.d"
```

## Windows

Il n'existe **pas de version Windows native** d'HAProxy. Options :

| Option | Commentaire |
| --- | --- |
| **WSL2** (Ubuntu) | `sudo apt install haproxy` dans WSL ; exposer les ports via la redirection de WSL (mode réseau *mirrored* sous Windows 11/Server 2025) |
| **Docker Desktop / conteneurs Linux** | Image officielle `haproxy:lts` |
| VM Linux dédiée | Solution de production recommandée |
| Alternatives natives | [[01-iis/06-url-rewrite-arr\|IIS + ARR]], Nginx pour Windows, Traefik |

## macOS

```bash
brew install haproxy
haproxy -v
haproxy -c -f $(brew --prefix)/etc/haproxy.cfg
brew services start haproxy
```

## Docker

```bash
docker run -d --name haproxy --restart unless-stopped \
  -p 80:80 -p 443:443 -p 8404:8404 \
  -v /srv/haproxy:/usr/local/etc/haproxy:ro \
  --sysctl net.ipv4.ip_unprivileged_port_start=0 \
  haproxy:lts
docker kill -s HUP haproxy                   # rechargement gracieux
```

## Réglages système (forte charge)

```ini /etc/sysctl.d/90-haproxy.conf
net.ipv4.ip_local_port_range = 1024 65000
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_nonlocal_bind = 1          # écouter sur une IP virtuelle pas encore portée (keepalived)
```

```bash
sudo sysctl --system
```

Limite de fichiers ouverts : HAProxy calcule lui-même `ulimit-n` depuis `maxconn` ; vérifiez `LimitNOFILE` du service si vous fixez des valeurs très élevées.

## Vérifier et recharger

```bash
sudo haproxy -c -f /etc/haproxy/haproxy.cfg         # « Configuration file is valid »
sudo haproxy -c -V -f /etc/haproxy/haproxy.cfg      # avec avertissements détaillés
sudo systemctl reload haproxy                       # rechargement sans perte de connexion (master-worker)
haproxy -vv                                         # options de compilation (OpenSSL, Lua, QUIC, PCRE2…)
```

> [!IMPORTANT]
> Prenez l'habitude de valider avec `haproxy -c` **avant** chaque rechargement : une configuration invalide est refusée par `reload` (l'ancienne continue de tourner), mais un redémarrage du serveur échouerait.

## Configuration de départ minimale

```haproxy /etc/haproxy/haproxy.cfg
global
    log /dev/log local0
    user haproxy
    group haproxy
    daemon
    stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners

defaults
    mode http
    log global
    option httplog
    timeout connect 5s
    timeout client  30s
    timeout server  30s

frontend fe_web
    bind :80
    default_backend be_web

backend be_web
    balance roundrobin
    server web01 10.0.20.11:80 check
    server web02 10.0.20.12:80 check
```

La suite : [[03-configuration-base]].
