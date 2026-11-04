---
title: "Get-Content (head/tail)"
description: "PowerShell — Get-Content (head/tail) (Début/fin de fichier (= head/tail)) : Lit un fichier ligne par ligne ; -TotalCount pour le début (= head), -Tail pour la fin (= tail)."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Début/fin de fichier (= head/tail) |
| **Commande type** | `Get-Content log.txt -Tail 20 -Wait` |

## Rôle

Lit un fichier ligne par ligne ; -TotalCount pour le début (= head), -Tail pour la fin (= tail).

## Options

| Option | Rôle |
| --- | --- |
| `-TotalCount ‹N›` | les N premières lignes (= head) |
| `-Tail ‹N›` | les N dernières lignes (= tail) |
| `-Wait` | suit le fichier en direct (= tail -f) |
| `(Get-Content f).Count` | nombre de lignes (= wc -l) |

## Exemples

**20 premières lignes**

```powershell
Get-Content acces.log -TotalCount 20
```

**Suivre un log en direct**

```powershell
Get-Content app.log -Tail 20 -Wait
```

**Compter les lignes**

```powershell
(Get-Content acces.log).Count
```

*Mots-clés : head tail wc get-content début fin fichier suivre wait lignes*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
