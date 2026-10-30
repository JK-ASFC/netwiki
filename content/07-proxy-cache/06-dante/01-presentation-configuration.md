---
title: Présentation, configuration et exploitation
description: Dante, serveur proxy SOCKS v4 et v5 — usages (sortie contrôlée de serveurs, accès d'administration, applications non HTTP), différence avec un proxy HTTP et avec ssh -D, installation (Debian, RHEL, macOS), danted.conf (interfaces internes et externes, méthodes d'authentification, règles client pass et socks pass, journalisation), authentification par utilisateurs système ou PAM, clients (curl, navigateurs, proxychains, socksify), sécurité et dépannage.
tags: [dante, socks, socks5, proxy, danted, proxychains, authentification]
icon: network
---

**Dante** (Inferno Nettverk, licence BSD) implémente un serveur **SOCKS** v4/v5 (`danted`) et une bibliothèque cliente (`socksify`). SOCKS relaie des connexions **TCP** (et **UDP** en v5) de n'importe quel protocole, contrairement à un proxy HTTP comme [[02-squid/01-presentation|Squid]] qui comprend HTTP.

| Usage | Exemple |
| --- | --- |
| Sortie contrôlée | Serveurs d'un réseau isolé qui doivent joindre quelques destinations (dépôts, API) via un point unique journalisé |
| Accès d'administration | Postes d'administrateurs qui rebondissent par un proxy situé dans le réseau d'administration |
| Applications non HTTP | Clients SSH, bases de données, outils qui gèrent SOCKS |

Pour un usage ponctuel, `ssh -D 1080 bastion` crée un proxy SOCKS dynamique par SSH (voir [[05-tunnels-bastion|tunnels SSH]]) ; Dante sert pour un service **permanent**, partagé et filtré.

## Installation

```bash
sudo apt install dante-server            # Debian / Ubuntu (service danted)
sudo dnf install dante-server            # RHEL / Fedora (EPEL selon la version), service sockd
brew install dante                       # macOS
sockd -v 2>/dev/null || danted -v
```

Pas de version Windows du serveur ; les clients Windows utilisent SOCKS nativement dans de nombreux logiciels (navigateurs, PuTTY, WinSCP).

## Configuration

```dante /etc/danted.conf
logoutput: syslog /var/log/danted.log

# Interface d'écoute (côté clients) et interface de sortie
internal: ens192 port = 1080
external: ens224

# Méthodes d'authentification : sur la connexion SOCKS (socksmethod) et au niveau client (clientmethod)
clientmethod: none
socksmethod: username

user.privileged: root
user.unprivileged: nobody

# 1. Qui peut se connecter au proxy
client pass {
    from: 10.0.99.0/24 to: 0.0.0.0/0
    log: error connect disconnect
}
client block {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: connect error
}

# 2. Vers où (règles SOCKS), évaluées dans l'ordre
socks block {
    from: 0.0.0.0/0 to: 10.0.0.0/8
    log: connect error
}
socks pass {
    from: 10.0.99.0/24 to: .exemple-api.fr port = 443
    command: connect
    log: connect disconnect error
}
socks pass {
    from: 10.0.99.0/24 to: 0.0.0.0/0 port = 22
    command: connect
    log: connect disconnect error
}
socks block {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: connect error
}
```

| Élément | Rôle |
| --- | --- |
| `internal` / `external` | Écoute des clients / adresse source des connexions sortantes |
| `client pass/block` | Filtre **au niveau TCP** : qui peut ouvrir une session vers le proxy |
| `socks pass/block` | Filtre **SOCKS** : destinations, ports, commandes (`connect`, `bind`, `udpassociate`) |
| `socksmethod: username` | Authentification par nom d'utilisateur et mot de passe (comptes **système** du serveur) ; `pam.username` pour PAM (LDAP/AD via SSSD) |
| `.exemple-api.fr` | Un domaine et ses sous-domaines (le nom est résolu par le proxy) |

```bash
sudo useradd -M -s /usr/sbin/nologin proxy-alice && sudo passwd proxy-alice     # compte dédié au proxy
sudo systemctl enable --now danted
sudo ss -ltnp | grep 1080
```

> [!WARNING]
> L'authentification SOCKS5 par nom d'utilisateur transmet le mot de passe **en clair**. Limitez le proxy à un réseau de confiance (filtrage `client pass`, pare-feu) ; pour un accès à travers un réseau non sûr, encapsulez dans un tunnel (VPN, SSH).

## Clients

```bash
curl --socks5-hostname proxy-alice:MotDePasse@10.0.99.5:1080 https://api.exemple-api.fr/statut
ssh -o ProxyCommand="nc -X 5 -x 10.0.99.5:1080 %h %p" admin@serveur-distant
# proxychains-ng : forcer une application à passer par SOCKS
echo "socks5 10.0.99.5 1080 proxy-alice MotDePasse" | sudo tee -a /etc/proxychains4.conf
proxychains4 git clone https://github.com/exemple/projet.git
# Bibliothèque Dante
socksify telnet serveur-distant 23
```

`--socks5-hostname` (ou `socks5h://`) fait résoudre le nom par le **proxy** : indispensable quand le client n'a pas de DNS vers l'extérieur et pour éviter les fuites DNS.

## Exploitation et dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Le service ne démarre pas | Nom d'interface (`internal`/`external`) incorrect | `ip -br a`, adresse IP au lieu du nom |
| `connection refused` côté client | `client pass` ne couvre pas l'adresse du client | Règles `client`, journal `/var/log/danted.log` |
| `authentication failed` | Méthode non annoncée par le client, compte | Client SOCKS5 avec authentification, `socksmethod` |
| Résolution de noms impossible | Le client résout lui-même sans DNS externe | `socks5h://` / `--socks5-hostname` |
| Proxy ouvert utilisé par des inconnus | Écoute sur une interface publique sans filtrage | `client pass` restrictif, pare-feu, authentification |

Supervisez la disponibilité du port 1080 et envoyez les journaux (connexions, refus) au SIEM : un proxy est un point de passage idéal pour tracer les sorties.
