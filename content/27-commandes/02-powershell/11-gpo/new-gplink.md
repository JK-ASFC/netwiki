---
title: "New-GPLink"
description: "PowerShell — New-GPLink (Stratégie de groupe) : Lié un GPO à un site, un domaine ou une OU : c'est ce qui le rend actif sur les machines visées."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `New-GPLink -Name "RDP" -Target "OU=Postes,DC=dexterslab,DC=lan"` |

## Rôle

Lié un GPO à un site, un domaine ou une OU : c'est ce qui le rend actif sur les machines visées.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹GPO›` | le GPO à lier |
| `-Target ‹DN de l'OU›` | où l'appliquer |
| `-LinkEnabled ‹Yes/No›` | activer le lien |
| `-Enforced ‹Yes/No›` | forcer (priorité sur les autres) |

## Exemples

**Lier à une OU**

```powershell
New-GPLink -Name "RDP" -Target "OU=Postes,DC=dexterslab,DC=lan"
```

**Lier et forcer**

```powershell
New-GPLink -Name "Sécurité" -Target "DC=dexterslab,DC=lan" -Enforced Yes
```

*Mots-clés : new-gplink gpo lien lier ou organisation domaine appliquer policy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
