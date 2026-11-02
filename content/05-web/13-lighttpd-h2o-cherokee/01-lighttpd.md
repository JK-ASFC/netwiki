---
title: Lighttpd
description: Lighttpd — serveur web léger (BSD) pour Linux, BSD, macOS et systèmes embarqués : installation (Debian/Ubuntu, RHEL/EPEL, Alpine, FreeBSD, Homebrew, Windows via builds tiers), lighttpd.conf (server.modules, document-root, conditions $HTTP et $SERVER), modules (mod_fastcgi/PHP-FPM, mod_proxy, mod_rewrite, mod_redirect, mod_auth, mod_openssl, mod_deflate), lighty-enable-mod, TLS et Let's Encrypt, hôtes virtuels, HTTP/2, test de configuration et usages typiques (Pi-hole, routeurs, appliances).
tags: [lighttpd, serveur web, fastcgi, php, léger, embarqué]
icon: info
---

**Lighttpd** (« lighty ») est un serveur web **événementiel** à faible empreinte mémoire : on le trouve dans les appliances, routeurs, [[09-dns-filtrants/02-pi-hole|Pi-hole]] et sur les petites machines. Il sert des fichiers statiques, passe le PHP à [[05-php-fpm/01-presentation-installation-pools|PHP-FPM]] en FastCGI et peut faire reverse proxy. HTTP/2 est pris en charge depuis 1.4.56.

## Installation

```bash
sudo apt install lighttpd                       # Debian/Ubuntu
sudo dnf install lighttpd lighttpd-fastcgi      # RHEL/Rocky/Alma (EPEL), Fedora
sudo apk add lighttpd                           # Alpine
sudo pkg install lighttpd                       # FreeBSD
brew install lighttpd                           # macOS
sudo systemctl enable --now lighttpd
```

Windows : pas de version officielle (builds tiers « LightTPD for Windows » ou WSL).

## Configuration (`/etc/lighttpd/lighttpd.conf`)

```text
server.modules += ( "mod_openssl", "mod_proxy", "mod_redirect", "mod_rewrite", "mod_deflate" )
server.document-root = "/var/www/html"
server.port          = 80
server.username      = "www-data"
server.groupname     = "www-data"
server.errorlog      = "/var/log/lighttpd/error.log"
index-file.names     = ( "index.php", "index.html" )
server.feature-flags += ( "server.h2proto" => "enable" )

# HTTPS
$SERVER["socket"] == ":443" {
    ssl.engine  = "enable"
    ssl.pemfile = "/etc/letsencrypt/live/www.corp.exemple.fr/fullchain.pem"
    ssl.privkey = "/etc/letsencrypt/live/www.corp.exemple.fr/privkey.pem"
}

# Redirection HTTP → HTTPS
$HTTP["scheme"] == "http" {
    url.redirect = ( "" => "https://${url.authority}${url.path}${qsa}" )
}

# Hôte virtuel avec reverse proxy
$HTTP["host"] == "app.corp.exemple.fr" {
    proxy.server = ( "" => ( ( "host" => "10.0.20.10", "port" => 8080 ) ) )
    proxy.header = ( "upgrade" => "enable" )        # WebSocket
}
```

PHP via PHP-FPM :

```bash
sudo lighty-enable-mod fastcgi fastcgi-php-fpm   # Debian/Ubuntu (fichiers conf-available/)
sudo lighttpd -tt -f /etc/lighttpd/lighttpd.conf  # test complet (modules chargés)
sudo systemctl reload lighttpd
```

Suite : [[02-h2o|H2O]] · [[03-cherokee|Cherokee]] · [[90-aide-memoire|aide-mémoire]].
