---
title: "Get-History"
description: "PowerShell — Get-History (Historique du shell) : Liste les commandes de la session. Alias : h, history. Invoke-History les rejoue."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Historique du shell |
| **Commande type** | `Get-History` |

## Rôle

Liste les commandes de la session. Alias : h, history. Invoke-History les rejoue.

## Options

| Option | Rôle |
| --- | --- |
| `-Count ‹N›` | les N dernières |
| `(Invoke-History ‹Id›)` | rejoue la commande numéro Id |
| `(F8)` | recherche dans l'historique en tapant |

## Exemples

**Tout**

```powershell
Get-History
```

**10 dernières**

```powershell
Get-History -Count 10
```

**Rejouer**

```powershell
Invoke-History 42
```

*Mots-clés : get-history historique commandes rappel rejouer h invoke-history*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
