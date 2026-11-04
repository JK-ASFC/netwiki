---
title: "Add-DhcpServerv4Scope"
description: "PowerShell — Add-DhcpServerv4Scope (DHCP) : Crée une étendue DHCP : la plage d'adresses distribuées aux clients."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | DHCP |
| **Commande type** | `Add-DhcpServerv4Scope -Name "LAN" -StartRange 10.20.0.50 -EndRange 10.20.0.200 -SubnetMask 255.255.255.0` |

## Rôle

Crée une étendue DHCP : la plage d'adresses distribuées aux clients.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom de l'étendue |
| `-StartRange ‹IP début›` | première IP distribuée |
| `-EndRange ‹IP fin›` | dernière IP distribuée |
| `-SubnetMask ‹masque›` | masque de sous-réseau |

## Exemples

**Créer une étendue**

```powershell
Add-DhcpServerv4Scope -Name "LAN" -StartRange 10.20.0.50 -EndRange 10.20.0.200 -SubnetMask 255.255.255.0
```

*Mots-clés : add-dhcpserverv4scope dhcp étendue scope plage adresses bail 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
