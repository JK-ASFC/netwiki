---
title: "gpupdate"
description: "PowerShell — gpupdate (Stratégie de groupe) : Force la réapplication immédiate des stratégies sur la machine locale (sans attendre le cycle de 90 min)."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `gpupdate /force` |

## Rôle

Force la réapplication immédiate des stratégies sur la machine locale (sans attendre le cycle de 90 min).

## Options

| Option | Rôle |
| --- | --- |
| `/force` | réapplique TOUTES les stratégies |
| `/logoff` | déconnecte si une stratégie l'exige |
| `/boot` | redémarre si une stratégie l'exige |

## Exemples

**Forcer**

```powershell
gpupdate /force
```

**Ordinateur seul**

```powershell
gpupdate /target:computer /force
```

*Mots-clés : gpupdate forcer appliquer stratégie gpo rafraîchir local mise à jour*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
