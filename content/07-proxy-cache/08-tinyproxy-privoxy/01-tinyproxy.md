---
title: Tinyproxy
description: Tinyproxy — proxy HTTP/HTTPS sortant minimal (GPL) pour Linux, BSD et macOS : installation (Debian/Ubuntu, RHEL/EPEL, Alpine, FreeBSD, Homebrew, Docker), tinyproxy.conf (Port, Listen, Allow, ConnectPort, BasicAuth, Upstream, Filter et FilterDefaultDeny, en-têtes Via et X-Tinyproxy, MaxClients, journaux), usage comme proxy de sortie pour serveurs, configuration des clients (variables http_proxy, APT, DNF) et limites.
tags: [tinyproxy, proxy http, proxy sortant, filtrage, linux]
icon: info
---

**Tinyproxy** est un proxy HTTP **très léger** (quelques Mo de RAM) : idéal pour donner un accès Internet **contrôlé** à des serveurs sans route directe (mises à jour APT/DNF, appels d'API), sur un petit routeur ou dans un conteneur. Pour du cache, de l'authentification d'annuaire ou des catégories, préférez [[02-squid/01-presentation|Squid]].

## Installation

```bash
sudo apt install tinyproxy                # Debian/Ubuntu
sudo dnf install tinyproxy                # RHEL/Rocky/Alma (EPEL), Fedora
sudo apk add tinyproxy                    # Alpine
sudo pkg install tinyproxy                # FreeBSD
brew install tinyproxy                    # macOS
```

Windows : pas de version native (conteneur ou WSL).

## `/etc/tinyproxy/tinyproxy.conf`

```text
User tinyproxy
Group tinyproxy
Port 8888
Listen 10.0.20.5
Timeout 600
LogLevel Info
LogFile "/var/log/tinyproxy/tinyproxy.log"
MaxClients 200
Allow 127.0.0.1
Allow 10.0.20.0/24
ConnectPort 443
ConnectPort 563
DisableViaHeader Yes
XTinyproxy No
# Filtrage par liste blanche de domaines
Filter "/etc/tinyproxy/filtre"
FilterType ere
FilterDefaultDeny Yes
# Authentification simple (en clair : à réserver au réseau interne)
# BasicAuth proxyuser MotDePasseProxy
# Chaînage vers un proxy d'entreprise
# Upstream http proxy.corp.exemple.fr:3128 ".exemple.com"
```

```text
# /etc/tinyproxy/filtre — expressions régulières étendues
(^|\.)debian\.org$
(^|\.)ubuntu\.com$
(^|\.)github\.com$
(^|\.)githubusercontent\.com$
```

```bash
sudo systemctl enable --now tinyproxy && sudo systemctl reload tinyproxy
curl -x http://10.0.20.5:8888 -I https://deb.debian.org
```

Clients : `export https_proxy=http://10.0.20.5:8888` ; APT : `Acquire::https::Proxy "http://10.0.20.5:8888";` dans `/etc/apt/apt.conf.d/90proxy` ; DNF : `proxy=http://10.0.20.5:8888` dans `/etc/dnf/dnf.conf`.

### Directives principales

| Directive | Rôle |
| --- | --- |
| `Port` / `Listen` / `Bind` | Port d'écoute / interface d'écoute / adresse source des sorties |
| `Allow` / `Deny` | Réseaux autorisés/refusés à utiliser le proxy |
| `ConnectPort` | Ports autorisés pour la méthode `CONNECT` (HTTPS : 443, 563) ; vide = tous |
| `BasicAuth user mdp` | Authentification HTTP (en clair → réseau interne uniquement) |
| `Upstream http hôte:port "."` | Chaînage vers un proxy parent (par domaine ou global) ; `Upstream socks5 …` |
| `Filter` / `FilterType` (`ere`/`fnmatch`) | Liste de domaines/URL ; `FilterURLs`, `FilterDefaultDeny Yes` = liste blanche |
| `FilterCaseSensitive`, `FilterExtended` | Comportement du filtre |
| `MaxClients` | Connexions simultanées |
| `DisableViaHeader` / `XTinyproxy` | Masquer l'en-tête `Via` / ne pas ajouter `X-Tinyproxy` |
| `Anonymous` | En-têtes à conserver (tous les autres sont retirés) |
| `StatHost` | Hôte virtuel renvoyant la page de statistiques du proxy |
| `LogLevel` (`Critical`…`Connect`/`Info`) | Verbosité des journaux |

`tinyproxy -d` lance en premier plan (débogage) ; `tinyproxy -c /chemin/tinyproxy.conf` pour un fichier précis. La page de statistiques (`StatHost`) donne le nombre de connexions ouvertes, refusées et le temps de fonctionnement.

Suite : [[02-privoxy|Privoxy]] · [[90-aide-memoire|aide-mémoire]].
