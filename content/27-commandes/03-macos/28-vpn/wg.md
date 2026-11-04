---
title: "wg"
description: "macOS — wg (WireGuard / état) : Affiche et modifie la configuration WireGuard, installé via Homebrew."
tags: [macos, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | VPN |
| **Contexte** | WireGuard / état |
| **Commande type** | `wg show` |

## Rôle

Affiche et modifie la configuration WireGuard, installé via Homebrew.

## Options

| Option | Rôle |
| --- | --- |
| `show` | état des interfaces (ajouter ‹iface› pour n'en voir qu'une) |
| `showconf ‹iface›` | configuration courante |
| `genkey` | génère une clé privée |
| `pubkey` | dérive la clé publique (lit l'entrée standard) |
| `set ‹iface› peer ‹clé› allowed-ips ‹réseau›` | ajoute ou modifie un pair |
| ⚠️ `remove` | en fin de « set ‹iface› peer ‹clé› » : retire le pair |
| `(interface réelle)` | macOS nomme le tunnel utun0, utun1… |

> [!WARNING]
> Options à manier avec précaution : `remove`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Installer**

```zsh
brew install wireguard-tools
```

**État des tunnels**

```zsh
sudo wg show
```

**Générer une paire**

```zsh
wg genkey | tee cle.priv | wg pubkey > cle.pub
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/wg|wg (Bash)]]
- [[27-commandes/02-powershell/28-vpn/wg|wg (PowerShell)]]

*Mots-clés : wireguard wg tunnel vpn clé publique privée handshake pair homebrew macos*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
