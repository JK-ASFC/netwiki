---
title: "wg-quick"
description: "Bash — wg-quick (WireGuard / interface) : Monte ou démonte une interface WireGuard depuis son fichier de configuration."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | VPN |
| **Contexte** | WireGuard / interface |
| **Commande type** | `wg-quick up wg0` |

## Rôle

Monte ou démonte une interface WireGuard depuis son fichier de configuration.

## Options

| Option | Rôle |
| --- | --- |
| `up ‹iface›` | monte l'interface et pose les routes |
| `down ‹iface›` | démonte l'interface et retire les routes |
| `strip ‹iface›` | sort la config sans les directives wg-quick |
| `save ‹iface›` | écrit l'état courant dans le fichier |
| `(fichier lu)` | /etc/wireguard/‹iface›.conf |

## Exemples

**Monter le tunnel**

```bash
sudo wg-quick up wg0
```

**Démonter**

```bash
sudo wg-quick down wg0
```

**Activer au démarrage**

```bash
sudo systemctl enable --now wg-quick@wg0
```

## Dans les autres shells

- [[27-commandes/03-macos/28-vpn/wg-quick|wg-quick (macOS)]]

*Mots-clés : wireguard wgquick up down interface tunnel vpn conf routes systemd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
