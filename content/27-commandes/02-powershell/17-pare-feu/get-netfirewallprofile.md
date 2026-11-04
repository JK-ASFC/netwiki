---
title: "Get-NetFirewallProfile"
description: "PowerShell — Get-NetFirewallProfile (Pare-feu Windows) : Affiche l'état des trois profils de pare-feu (activé, actions par défaut, journalisation)."
tags: [powershell, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Pare-feu |
| **Contexte** | Pare-feu Windows |
| **Commande type** | `Get-NetFirewallProfile` |

## Rôle

Affiche l'état des trois profils de pare-feu (activé, actions par défaut, journalisation).

## Options

| Option | Rôle |
| --- | --- |
| `-Profile ‹nom›` | un profil précis (Domain, Private, Public) |

## Exemples

**Tous les profils**

```powershell
Get-NetFirewallProfile
```

**Profil public**

```powershell
Get-NetFirewallProfile -Profile Public
```

*Mots-clés : get-netfirewallprofile profil pare-feu firewall état domain public private*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
