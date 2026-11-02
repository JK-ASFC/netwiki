---
title: Privoxy
description: Privoxy — proxy HTTP filtrant (GPL) orienté vie privée : blocage de publicités et traqueurs par actions et filtres, modification d'en-têtes et de contenu (HTTP en clair, HTTPS avec inspection optionnelle), chaînage vers Tor ou un proxy SOCKS, installation Windows, Linux, macOS, BSD, fichiers config, default.action, user.action, user.filter, interface http://config.privoxy.org, et usages en entreprise.
tags: [privoxy, proxy filtrant, vie privée, tor, socks, publicités]
icon: info
---

**Privoxy** est un proxy HTTP **filtrant** : il supprime publicités et traqueurs, réécrit des en-têtes (Referer, User-Agent, cookies) et peut **transférer** le trafic vers [[06-dante/01-presentation-configuration|un proxy SOCKS]] ou **Tor**. Il sert surtout de passerelle HTTP → SOCKS (pour des applications qui ne savent pas parler SOCKS) et de filtre personnel ou de laboratoire.

## Installation

```bash
sudo apt install privoxy                  # Debian/Ubuntu
sudo dnf install privoxy                  # Fedora / RHEL (EPEL)
sudo pkg install privoxy                  # FreeBSD
brew install privoxy                      # macOS (ou paquet .pkg officiel)
```

Windows : installeur officiel (service ou icône de la zone de notification).

## Configuration (`/etc/privoxy/config`)

```text
listen-address  10.0.20.6:8118
permit-access   10.0.20.0/24
actionsfile match-all.action
actionsfile default.action
actionsfile user.action
filterfile  default.filter
filterfile  user.filter
logfile logfile
debug 1                                   # requêtes ; 1024 pour les blocages
# Transférer vers Tor (résolution DNS côté Tor)
# forward-socks5t / 127.0.0.1:9050 .
# Ne pas transférer les adresses internes
# forward 10.*.*.*/ .
# forward .corp.exemple.fr .
```

`user.action` (vos règles, prioritaires) :

```text
{ +block{Régie publicitaire} }
.doubleclick.net
.ads.exemple-regie.com

{ -block }
.corp.exemple.fr

{ +hide-user-agent{Mozilla/5.0 (X11; Linux x86_64)} }
/
```

```bash
sudo systemctl restart privoxy
curl -x http://10.0.20.6:8118 -I http://www.exemple.com
```

Interface d'information : `http://config.privoxy.org/` (ou `http://p.p/`) via le proxy — affiche la configuration, les actions appliquées à une URL (*Show which actions apply to a URL*).

> [!NOTE]
> Sans inspection TLS (fonction optionnelle à compiler et à configurer avec une CA), Privoxy ne voit que le nom d'hôte des sites HTTPS : le filtrage se limite alors au blocage par domaine.

Commandes : [[90-aide-memoire|aide-mémoire]].
