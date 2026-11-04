---
title: "gpresult"
description: "PowerShell — gpresult (Stratégie de groupe) : Montre les GPO réellement appliqués à l'utilisateur et à l'ordinateur courants (RSoP)."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `gpresult /r` |

## Rôle

Montre les GPO réellement appliqués à l'utilisateur et à l'ordinateur courants (RSoP).

## Options

| Option | Rôle |
| --- | --- |
| `/r` | résumé à l'écran |
| `/h ‹rapport.html›` | rapport HTML détaillé |
| `/scope ‹user/computer›` | limite la portée |
| `/user ‹nom›` | pour un utilisateur précis |

## Exemples

**Résumé**

```powershell
gpresult /r
```

**Rapport HTML**

```powershell
gpresult /h C:\rsop.html
```

**Pour un utilisateur**

```powershell
gpresult /r /user edwin
```

*Mots-clés : gpresult rsop stratégie appliquée gpo diagnostic rapport résultat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
