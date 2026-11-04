---
title: "reg"
description: "PowerShell — reg (Registre & configuration) : Interroge/modifie le Registre en CLI."
tags: [powershell, commande, registre]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Registre |
| **Contexte** | Registre & configuration |
| **Commande type** | `reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion"` |

## Rôle

Interroge/modifie le Registre en CLI.

## Options

| Option | Rôle |
| --- | --- |
| `query` | lit |
| `add` | ajoute |
| `delete` | supprime |
| `export` | sauvegarde une ruche |

## Exemples

**Lire une clé**

```powershell
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v ProductName
```

*Mots-clés : registre clé valeur query export reg*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
