---
title: "Set-NetIPInterface"
description: "PowerShell — Set-NetIPInterface (VPN / routage) : Active le routage sur une carte : sans lui, le serveur reçoit les paquets mais ne les fait pas suivre."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / routage |
| **Commande type** | `Set-NetIPInterface -InterfaceAlias 'Ethernet' -Forwarding Enabled` |

## Rôle

Active le routage sur une carte : sans lui, le serveur reçoit les paquets mais ne les fait pas suivre.

## Options

| Option | Rôle |
| --- | --- |
| `-InterfaceAlias ‹nom›` | carte visée, telle qu'affichée par Get-NetAdapter |
| `-Forwarding ‹Enabled\|Disabled›` | autorise le relais des paquets |
| `-AddressFamily ‹IPv4\|IPv6›` | restreint à une famille d'adresses |
| `-NlMtuBytes ‹octets›` | force la MTU de l'interface |
| `-InterfaceMetric ‹n›` | priorité de la carte dans le choix des routes |
| `(inventaire)` | Get-NetIPInterface \| Format-Table InterfaceAlias,Forwarding |

## Exemples

**Activer le routage**

```powershell
Set-NetIPInterface -InterfaceAlias 'Ethernet' -Forwarding Enabled
```

**Vérifier l'état**

```powershell
Get-NetIPInterface | Format-Table InterfaceAlias,AddressFamily,Forwarding
```

**Réduire la MTU du tunnel**

```powershell
Set-NetIPInterface -InterfaceAlias 'wg0' -NlMtuBytes 1420
```

*Mots-clés : routage forwarding ip vpn passerelle interface windows mtu métrique*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
