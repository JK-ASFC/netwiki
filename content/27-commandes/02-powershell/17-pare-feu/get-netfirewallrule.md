---
title: "Get-NetFirewallRule"
description: "PowerShell — Get-NetFirewallRule (Réseau / Pare-feu) : Liste les règles du pare-feu Windows (= iptables -L)."
tags: [powershell, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Pare-feu |
| **Contexte** | Réseau / Pare-feu |
| **Commande type** | `Get-NetFirewallRule -Enabled True` |

## Rôle

Liste les règles du pare-feu Windows (= iptables -L).

## Options

| Option | Rôle |
| --- | --- |
| `-Enabled ‹True/False›` | règles actives |
| `-Direction ‹Inbound/Outbound›` | Inbound / Outbound |
| `-DisplayName ‹nom›` | par nom |
| `Get-NetFirewallPortFilter` | ports associés |

## Exemples

**Règles actives**

```powershell
Get-NetFirewallRule -Enabled True
```

**Entrantes**

```powershell
Get-NetFirewallRule -Direction Inbound
```

**Par nom**

```powershell
Get-NetFirewallRule -DisplayName "*RDP*"
```

*Mots-clés : pare-feu firewall règles windows iptables get-netfirewallrule*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
