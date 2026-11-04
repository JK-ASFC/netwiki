---
title: "Get-Item"
description: "PowerShell — Get-Item (Fichiers / Métadonnées) : Récupère un élément et ses métadonnées (= stat / readlink)."
tags: [powershell, commande, navigation-fichiers]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Navigation & fichiers |
| **Contexte** | Fichiers / Métadonnées |
| **Commande type** | `Get-Item app.log` |

## Rôle

Récupère un élément et ses métadonnées (= stat / readlink).

## Options

| Option | Rôle |
| --- | --- |
| `-Force` | inclut les caches |
| `.Length` | taille |
| `.LastWriteTime` | date de modif |
| `.Target` | cible d'un lien (= readlink) |

## Exemples

**Infos**

```powershell
Get-Item app.log
```

**Taille**

```powershell
(Get-Item gros.iso).Length
```

**Cible d'un lien**

```powershell
(Get-Item lien).Target
```

*Mots-clés : métadonnées taille date lien cible stat readlink get-item*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
