---
title: "ipsec"
description: "macOS — ipsec (strongSwan / historique) : Commande historique de strongSwan : démarrage du démon et état des connexions."
tags: [macos, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | VPN |
| **Contexte** | strongSwan / historique |
| **Commande type** | `ipsec statusall` |

## Rôle

Commande historique de strongSwan : démarrage du démon et état des connexions.

## Options

| Option | Rôle |
| --- | --- |
| `start` | démarre le démon |
| `stop` | arrête le démon |
| `status` | résumé des connexions |
| `statusall` | état détaillé |
| `up ‹conn›` | monte une connexion |
| ⚠️ `down ‹conn›` | coupe une connexion |
| `(chemin Homebrew)` | /opt/homebrew/sbin/ipsec |

> [!WARNING]
> Options à manier avec précaution : `down ‹conn›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Démarrer**

```zsh
sudo /opt/homebrew/sbin/ipsec start
```

**État détaillé**

```zsh
sudo ipsec statusall
```

**Monter une connexion**

```zsh
sudo ipsec up nomades
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/ipsec|ipsec (Bash)]]

*Mots-clés : ipsec strongswan status statusall up down reload démon vpn macos*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
