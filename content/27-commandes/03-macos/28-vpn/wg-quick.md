---
title: "wg-quick"
description: "macOS — wg-quick (WireGuard / interface) : Monte ou démonte une interface WireGuard depuis son fichier de configuration."
tags: [macos, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | VPN |
| **Contexte** | WireGuard / interface |
| **Commande type** | `wg-quick up wg0` |

## Rôle

Monte ou démonte une interface WireGuard depuis son fichier de configuration.

## Options

| Option | Rôle |
| --- | --- |
| `up ‹iface›` | monte l'interface et pose les routes |
| `down ‹iface›` | démonte l'interface |
| `strip ‹iface›` | sort la config sans les directives wg-quick |
| `save ‹iface›` | écrit l'état courant dans le fichier |
| `(fichier lu)` | /etc/wireguard/‹iface›.conf |

## Exemples

**Créer le dossier**

```zsh
sudo mkdir -p /etc/wireguard && sudo chmod 700 /etc/wireguard
```

**Monter le tunnel**

```zsh
sudo wg-quick up wg0
```

**Démonter**

```zsh
sudo wg-quick down wg0
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/wg-quick|wg-quick (Bash)]]

*Mots-clés : wireguard wgquick up down tunnel vpn conf routes macos utun*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
