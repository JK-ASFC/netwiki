---
title: "Get-Content"
description: "PowerShell — Get-Content (Analyse de logs) : Lit un fichier (-Wait = tail -f). Alias : gc, cat."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Analyse de logs |
| **Commande type** | `Get-Content app.log -Tail 20 -Wait` |

## Rôle

Lit un fichier (-Wait = tail -f). Alias : gc, cat.

## Options

| Option | Rôle |
| --- | --- |
| `-Tail ‹N›` | N dernières |
| `-Wait` | suit en direct |
| `-TotalCount ‹N›` | N premières |
| `-Raw` | une chaîne |
| `(saisie sans éditeur) @' ... '@ \| Set-Content fichier` | cat > fichier suivi de Ctrl+D ne fonctionne pas ici |

## Exemples

**Suivre un log**

```powershell
Get-Content app.log -Tail 20 -Wait
```

**Bloc JSON**

```powershell
Get-Content f.json -Raw
```

*Mots-clés : lire fichier contenu tail suivre log cat get-content*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
