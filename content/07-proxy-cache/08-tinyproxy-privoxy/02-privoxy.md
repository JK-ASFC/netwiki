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

### Actions courantes

Les **actions** (`+` active, `-` désactive) s'appliquent aux motifs d'URL qui suivent :

| Action | Effet |
| --- | --- |
| `+block{raison}` | Bloque la requête (publicité, traqueur) |
| `+handle-as-image` / `+handle-as-empty-document` | Remplace un élément bloqué par une image/page vide (évite les trous dans la page) |
| `+redirect{URL}` | Redirige la requête |
| `+hide-referrer{…}` / `+hide-user-agent{…}` | Masque/falsifie `Referer` et `User-Agent` |
| `+crunch-incoming-cookies` / `+crunch-outgoing-cookies` / `+session-cookies-only` | Supprime ou limite les cookies |
| `+filter{nom}` | Applique un filtre de contenu (`default.filter`/`user.filter`) |
| `+change-x-forwarded-for{block}` | Retire l'en-tête `X-Forwarded-For` |
| `+limit-connect{ports}` | Restreint les ports autorisés en `CONNECT` |
| `+forward-override{…}` | Change le transfert (SOCKS/parent) pour ce motif |

Les motifs d'URL s'écrivent `domaine/chemin` avec jokers : `.doubleclick.net`, `exemple.com/pub/`, `/banniere[0-9]+\.gif`. Fichiers : `match-all.action` (réglages globaux), `default.action` (livré, mis à jour), **`user.action`** (vos règles, les plus prioritaires).

Interface d'information : `http://config.privoxy.org/` (ou `http://p.p/`) via le proxy — affiche la configuration, bascule les actions, et surtout *Show which actions apply to a URL* pour **déboguer** quelle règle agit sur une adresse.

> [!NOTE]
> Sans inspection TLS (fonction optionnelle à compiler et à configurer avec une CA), Privoxy ne voit que le nom d'hôte des sites HTTPS : le filtrage se limite alors au blocage par domaine.

Commandes : [[90-aide-memoire|aide-mémoire]].
