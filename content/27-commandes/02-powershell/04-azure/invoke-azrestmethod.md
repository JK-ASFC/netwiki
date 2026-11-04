---
title: "Invoke-AzRestMethod"
description: "PowerShell — Invoke-AzRestMethod (Azure / API REST) : Appelle l'API Azure Resource Manager avec le contexte courant."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / API REST |
| **Commande type** | `Invoke-AzRestMethod -Path /subscriptions?api-version=2022-12-01` |

## Rôle

Appelle l'API Azure Resource Manager avec le contexte courant.

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹/...›` | chemin ARM |
| `-Method ‹GET›` | GET / POST / PUT |
| `-Payload ‹json›` | corps JSON |
| `-ApiVersion ‹version›` | version d'API |

## Exemples

**Lister via API**

```powershell
Invoke-AzRestMethod -Path /subscriptions?api-version=2022-12-01
```

**Méthode POST**

```powershell
Invoke-AzRestMethod -Method POST -Path /providers/Microsoft.Compute
```

**Avec payload**

```powershell
Invoke-AzRestMethod -Method PUT -Path /resource -Payload corps-json
```

*Mots-clés : api rest resource manager arm requête azure invoke-azrestmethod*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
