---
title: "wg"
description: "Bash — wg (WireGuard / état) : Affiche et modifie la configuration des interfaces WireGuard."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | VPN |
| **Contexte** | WireGuard / état |
| **Commande type** | `wg show` |

## Rôle

Affiche et modifie la configuration des interfaces WireGuard.

## Options

| Option | Rôle |
| --- | --- |
| `show` | état des interfaces (ajouter ‹iface› pour n'en voir qu'une) |
| `latest-handshakes` | dernière poignée de main de chaque pair |
| `showconf ‹iface›` | configuration courante de l'interface |
| `genkey` | génère une clé privée |
| `pubkey` | dérive la clé publique (lit l'entrée standard) |
| `genpsk` | génère une clé partagée additionnelle |
| `set ‹iface› peer ‹clé› allowed-ips ‹réseau›` | ajoute ou modifie un pair |
| ⚠️ `remove` | en fin de « set ‹iface› peer ‹clé› » : retire le pair |
| `syncconf ‹iface› ‹fichier›` | recharge sans couper les tunnels actifs |

> [!WARNING]
> Options à manier avec précaution : `remove`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**État des tunnels**

```bash
sudo wg show
```

**Générer une paire de clés**

```bash
wg genkey | tee cle.priv | wg pubkey > cle.pub
```

**Recharger à chaud**

```bash
sudo wg syncconf wg0 <(wg-quick strip wg0)
```

## Dans les autres shells

- [[27-commandes/02-powershell/28-vpn/wg|wg (PowerShell)]]
- [[27-commandes/03-macos/28-vpn/wg|wg (macOS)]]

*Mots-clés : wireguard wg tunnel vpn clé publique privée handshake pair peer allowed-ips*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
