---
title: Présentation, installation et utilisation
description: mitmproxy — proxy d'interception HTTP/1, HTTP/2, HTTP/3 et WebSocket pour le débogage, les tests et l'audit autorisé : outils mitmproxy (console), mitmweb (interface web) et mitmdump, installation Windows, macOS, Linux (pipx, binaires, Docker), certificat d'autorité (mitm.it, magasins Windows, macOS, Linux, Android, Firefox), modes (regular, transparent, reverse, upstream, socks5, wireguard, local), filtres, interception et modification, enregistrement et rejeu, scripts Python (addons), et précautions légales.
tags: [mitmproxy, mitmweb, interception https, débogage, api, tests, sécurité]
icon: info
---

**mitmproxy** (MIT) s'intercale entre un client et un serveur pour **voir, modifier et rejouer** le trafic HTTP(S) : déboguer une API, comprendre ce qu'envoie une application mobile, tester un comportement d'erreur, reproduire un problème de proxy d'entreprise.

> [!WARNING]
> L'interception de communications de tiers est illégale sans autorisation. Réservez mitmproxy à vos propres applications, à un laboratoire ou à un audit couvert par un mandat écrit.

| Outil | Usage |
| --- | --- |
| `mitmproxy` | Interface **console** interactive (flèches, filtres, interception) |
| **`mitmweb`** | Interface **web** (`http://127.0.0.1:8081`) |
| `mitmdump` | Équivalent de tcpdump : sortie texte, enregistrement, scripts |

## Installation

```bash
pipx install mitmproxy                     # Linux, macOS, Windows (Python 3.12+)
brew install --cask mitmproxy              # macOS
docker run --rm -it -p 8080:8080 -p 127.0.0.1:8081:8081 mitmproxy/mitmproxy mitmweb --web-host 0.0.0.0
```

Windows : installeur ou archive autonome depuis `mitmproxy.org` ; Linux : binaires autonomes (archive) également disponibles.

## Certificat d'interception

Au premier lancement, mitmproxy crée sa CA dans `~/.mitmproxy/`. Avec le client configuré pour utiliser le proxy (`127.0.0.1:8080`), ouvrir **`http://mitm.it`** pour télécharger et installer le certificat.

```bash
# Linux (Debian/Ubuntu)
sudo cp ~/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy.crt && sudo update-ca-certificates
# Windows (PowerShell administrateur)
certutil -addstore root "$env:USERPROFILE\.mitmproxy\mitmproxy-ca-cert.cer"
```

Firefox utilise son propre magasin ; Android 7+ n'accepte les CA utilisateur que pour les applications qui l'autorisent ; l'**épinglage de certificat** empêche l'interception (c'est voulu). Retirez la CA à la fin des tests.

## Modes

```bash
mitmweb                                                      # proxy explicite sur 8080
mitmproxy --mode reverse:https://api.corp.exemple.fr -p 8443 # devant une API (le client vise le proxy)
mitmproxy --mode upstream:http://proxy.corp.exemple.fr:3128  # chaînage
mitmproxy --mode socks5 -p 1080
mitmweb --mode wireguard                                     # tunnel WireGuard (mobiles) : QR code dans l'interface
mitmproxy --mode local:curl                                  # capturer une application locale sans réglage de proxy
mitmproxy --mode transparent                                 # avec redirection iptables/nftables ou pf
```

## Filtres, interception et rejeu

```text
~d api.corp.exemple.fr & ~m POST     # domaine ET méthode
~c 500                               # code de réponse
~q & ~u /login                       # requêtes vers /login
```

- `i` (console) ou *Intercept* (web) : mettre en pause les requêtes correspondant au filtre, **modifier** puis reprendre.
- `r` : **rejouer** une requête ; `e` : éditer ; `w` : enregistrer.

```bash
mitmdump -w capture.mitm "~d api.corp.exemple.fr"
mitmdump -nr capture.mitm --flow-detail 3      # relire
mitmproxy --server-replay capture.mitm          # simuler le serveur
```

## Scripts (addons)

```python
# entete.py — ajoute un en-tête et journalise les réponses lentes
from mitmproxy import http, ctx

def request(flow: http.HTTPFlow) -> None:
    if flow.request.pretty_host.endswith("corp.exemple.fr"):
        flow.request.headers["X-Test"] = "mitmproxy"

def response(flow: http.HTTPFlow) -> None:
    duree = flow.response.timestamp_end - flow.request.timestamp_start
    if duree > 2:
        ctx.log.warn(f"Lent ({duree:.1f} s) : {flow.request.url}")
```

```bash
mitmdump -s entete.py
```

## Interface web (mitmweb)

Liste des flux (méthode, URL, code, taille, durée), détail requête/réponse (en-têtes, corps formaté JSON/HTML, *timing*), barre de filtre et d'interception, options (mode, certificats côté client, *anticache*).

<!-- CAPTURE: mitmweb — liste des flux et détail d'une requête JSON | _assets/mitmweb-flux.png -->
<!-- CAPTURE: mitmweb — interception et modification d'une requête | _assets/mitmweb-interception.png -->
<!-- CAPTURE: mitmproxy — interface console | _assets/mitmproxy-console.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
