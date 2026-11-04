---
title: "Enable-NetFirewallRule"
description: "PowerShell — Enable-NetFirewallRule (Pare-feu Windows) : Active une règle de pare-feu existante."
tags: [powershell, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Pare-feu |
| **Contexte** | Pare-feu Windows |
| **Commande type** | `Enable-NetFirewallRule -DisplayName "Mon appli"` |

## Rôle

Active une règle de pare-feu existante.

## Options

| Option | Rôle |
| --- | --- |
| `-DisplayName ‹nom›` | par nom affiché |
| `-Name ‹id›` | par identifiant interne |
| `-DisplayGroup ‹groupe›` | toutes les règles d'un groupe |

## Exemples

**Activer le Bureau à distance**

```powershell
Enable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

**Par nom**

```powershell
Enable-NetFirewallRule -DisplayName "Mon appli"
```

*Mots-clés : enable-netfirewallrule activer règle pare-feu firewall windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
