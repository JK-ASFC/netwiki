---
title: "Set-NetFirewallProfile"
description: "PowerShell — Set-NetFirewallProfile (Pare-feu Windows) : Configure un profil de pare-feu (Domain / Private / Public) : activation, action par défaut, journalisation."
tags: [powershell, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Pare-feu |
| **Contexte** | Pare-feu Windows |
| **Commande type** | `Set-NetFirewallProfile -Profile Domain,Public -Enabled True` |

## Rôle

Configure un profil de pare-feu (Domain / Private / Public) : activation, action par défaut, journalisation.

## Options

| Option | Rôle |
| --- | --- |
| `-Profile ‹Domain,Public,Private›` | profils visés |
| `-Enabled ‹True/False›` | active le pare-feu |
| `-DefaultInboundAction ‹Block/Allow›` | action entrante par défaut |
| `-LogAllowed ‹True/False›` | journalise les paquets autorisés |

## Exemples

**Activer partout**

```powershell
Set-NetFirewallProfile -All -Enabled True
```

**Bloquer l'entrant en public**

```powershell
Set-NetFirewallProfile -Profile Public -DefaultInboundAction Block
```

*Mots-clés : set-netfirewallprofile profil pare-feu firewall domain public private défaut journalisation*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
