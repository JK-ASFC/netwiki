---
title: "Get-AzADUser"
description: "PowerShell — Get-AzADUser (Azure / Entra ID) : Interroge les comptes Entra ID (ex-Azure AD)."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Entra ID |
| **Commande type** | `Get-AzADUser -UserPrincipalName jdupont@corp.com` |

## Rôle

Interroge les comptes Entra ID (ex-Azure AD).

## Options

| Option | Rôle |
| --- | --- |
| `-UserPrincipalName ‹upn›` | par UPN |
| `-DisplayName ‹nom›` | par nom affiche |
| `-Filter ‹requête›` | filtre OData |
| `New-AzADUser` | crée un compte |

## Exemples

**Un utilisateur**

```powershell
Get-AzADUser -UserPrincipalName jdupont@corp.com
```

**Par nom**

```powershell
Get-AzADUser -DisplayName Jean Dupont
```

**Filtre OData**

```powershell
Get-AzADUser -Filter accountEnabled eq true
```

*Mots-clés : entra id azure ad utilisateur compte annuaire upn get-azaduser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
