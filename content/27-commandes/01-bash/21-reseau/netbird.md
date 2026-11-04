---
title: "netbird"
description: "Bash — netbird (Mesh VPN (WireGuard)) : Client du VPN maillé NetBird (au-dessus de WireGuard) : connecte la machine au réseau privé, affiche l'état des pairs et gère le service."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Mesh VPN (WireGuard) |
| **Commande type** | `netbird status` |

## Rôle

Client du VPN maillé NetBird (au-dessus de WireGuard) : connecte la machine au réseau privé, affiche l'état des pairs et gère le service.

## Options

| Option | Rôle |
| --- | --- |
| `up` | se connecte au réseau (login SSO) |
| `down` | se déconnecte |
| `status` | état du client et des pairs |
| `-d` | détail : type de connexion, latence, routes |
| `--setup-key ‹clé›` | connexion non interactive (serveur/peer) |
| `--management-url ‹url›` | serveur de gestion auto-hébergé |
| `ssh ‹user@hôte›` | SSH à travers le mesh, sans clé à distribuer |
| `networks` | liste / sélectionne les routes (alias routes) |
| `service install` | installe le daemon en service |
| `version` | affiche les versions client et daemon |

## Exemples

**Se connecter (SSO)**

```bash
netbird up
```

**Serveur auto-hébergé (clé)**

```bash
netbird up --setup-key VOTRE_CLE --management-url https://nb.dexters-lab.io
```

**État détaillé**

```bash
netbird status -d
```

*Mots-clés : netbird vpn mesh wireguard pair peer réseau privé tunnel zéro trust connecter routes*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
