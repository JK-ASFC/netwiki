---
title: "wg"
description: "PowerShell — wg (WireGuard / état) : Affiche et modifie la configuration WireGuard : l'outil officiel existe aussi sous Windows."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | WireGuard / état |
| **Commande type** | `wg show` |

## Rôle

Affiche et modifie la configuration WireGuard : l'outil officiel existe aussi sous Windows.

## Options

| Option | Rôle |
| --- | --- |
| `show` | état des interfaces (ajouter ‹iface› pour n'en voir qu'une) |
| `genkey` | génère une clé privée |
| `pubkey` | dérive la clé publique (lit l'entrée standard) |
| `showconf ‹iface›` | configuration courante |
| `(encodage)` | Out-File -Encoding ascii, sinon la clé est illisible |

## Exemples

**État**

```powershell
wg show
```

**Clé privée**

```powershell
wg genkey | Out-File -Encoding ascii server.key
```

**Clé publique**

```powershell
Get-Content server.key | wg pubkey | Out-File -Encoding ascii server.pub
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/wg|wg (Bash)]]
- [[27-commandes/03-macos/28-vpn/wg|wg (macOS)]]

*Mots-clés : wireguard wg tunnel vpn clé publique privée handshake pair windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
