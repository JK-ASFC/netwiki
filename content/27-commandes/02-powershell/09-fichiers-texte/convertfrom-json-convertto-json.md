---
title: "ConvertFrom-Json / ConvertTo-Json"
description: "PowerShell — ConvertFrom-Json / ConvertTo-Json (JSON (= jq)) : Analyse et produit du JSON en objets PowerShell. L'équivalent de jq pour lire et écrire du JSON."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | JSON (= jq) |
| **Commande type** | `Get-Content data.json \| ConvertFrom-Json` |

## Rôle

Analyse et produit du JSON en objets PowerShell. L'équivalent de jq pour lire et écrire du JSON.

## Options

| Option | Rôle |
| --- | --- |
| `ConvertFrom-Json` | transforme du texte JSON en objet manipulable |
| `ConvertTo-Json` | transforme un objet en texte JSON |
| `-Depth ‹N›` | profondeur d'imbrication à sérialiser (défaut 2) |
| `.propriété` | accès direct à un champ après conversion |

## Exemples

**Lire un champ**

```powershell
(Get-Content conf.json | ConvertFrom-Json).version
```

**API vers objet**

```powershell
Invoke-RestMethod https://api.site/data
```

**Objet vers JSON**

```powershell
@{nom='a';actif=$true} | ConvertTo-Json
```

*Mots-clés : json jq convertfrom-json convertto-json api parser objet*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
