---
title: "Remove-NetFirewallRule"
description: "PowerShell — Remove-NetFirewallRule (Pare-feu Windows) : Supprime définitivement une règle de pare-feu."
tags: [powershell, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Pare-feu |
| **Contexte** | Pare-feu Windows |
| **Commande type** | `Remove-NetFirewallRule -DisplayName "Mon appli"` |

## Rôle

Supprime définitivement une règle de pare-feu.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-DisplayName ‹nom›` | par nom (suppression définitive) |
| `-Name ‹id›` | par identifiant |

> [!WARNING]
> Options à manier avec précaution : `-DisplayName ‹nom›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Supprimer**

```powershell
Remove-NetFirewallRule -DisplayName "Mon appli"
```

*Mots-clés : remove-netfirewallrule supprimer règle pare-feu firewall windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
