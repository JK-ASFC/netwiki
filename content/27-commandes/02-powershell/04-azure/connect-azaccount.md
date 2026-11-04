---
title: "Connect-AzAccount"
description: "PowerShell — Connect-AzAccount (Azure / Authentification) : Ouvre une session vers Azure (module Az)."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Authentification |
| **Commande type** | `Connect-AzAccount` |

## Rôle

Ouvre une session vers Azure (module Az).

## Options

| Option | Rôle |
| --- | --- |
| `-Tenant ‹id›` | annuaire cible |
| `-Subscription ‹id›` | abonnement par défaut |
| `-Identity` | identité managée |
| `-DeviceCode` | login via navigateur |

## Exemples

**Connexion interactive**

```powershell
Connect-AzAccount
```

**Sur un tenant**

```powershell
Connect-AzAccount -Tenant contoso.onmicrosoft.com
```

**Identité managée**

```powershell
Connect-AzAccount -Identity
```

*Mots-clés : azure connexion authentification login tenant connect-azaccount*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
