---
title: "New-GPO"
description: "PowerShell — New-GPO (Stratégie de groupe) : Crée un objet de stratégie de groupe (vide, non lié). Nécessite le module GroupPolicy (RSAT)."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `New-GPO -Name "Sécurité Postes"` |

## Rôle

Crée un objet de stratégie de groupe (vide, non lié). Nécessite le module GroupPolicy (RSAT).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom du GPO |
| `-Comment ‹texte›` | description |
| `-StarterGpoName ‹modèle›` | basé sur un Starter GPO |

## Exemples

**Créer**

```powershell
New-GPO -Name "Sécurité Postes"
```

**Avec commentaire**

```powershell
New-GPO -Name "RDP" -Comment "Active le Bureau à distance"
```

*Mots-clés : new-gpo gpo stratégie groupe créer policy active directory rsat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
