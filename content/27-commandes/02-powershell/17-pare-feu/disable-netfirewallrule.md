---
title: "Disable-NetFirewallRule"
description: "PowerShell — Disable-NetFirewallRule (Pare-feu Windows) : Désactive une règle sans la supprimer (réactivable plus tard)."
tags: [powershell, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Pare-feu |
| **Contexte** | Pare-feu Windows |
| **Commande type** | `Disable-NetFirewallRule -DisplayName "Mon appli"` |

## Rôle

Désactive une règle sans la supprimer (réactivable plus tard).

## Options

| Option | Rôle |
| --- | --- |
| `-DisplayName ‹nom›` | par nom affiché |
| `-Name ‹id›` | par identifiant |
| `-DisplayGroup ‹groupe›` | tout un groupe |

## Exemples

**Désactiver une règle**

```powershell
Disable-NetFirewallRule -DisplayName "Mon appli"
```

**Tout un groupe**

```powershell
Disable-NetFirewallRule -DisplayGroup "Remote Desktop"
```

*Mots-clés : disable-netfirewallrule désactiver règle pare-feu firewall windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
