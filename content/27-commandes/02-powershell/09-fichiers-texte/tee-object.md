---
title: "Tee-Object"
description: "PowerShell — Tee-Object (Écrire ET afficher) : Envoie la sortie à la fois dans un fichier (ou une variable) ET dans le pipeline. Alias : tee."
tags: [powershell, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Écrire ET afficher |
| **Commande type** | `Tee-Object -FilePath sortie.txt` |

## Rôle

Envoie la sortie à la fois dans un fichier (ou une variable) ET dans le pipeline. Alias : tee.

## Options

| Option | Rôle |
| --- | --- |
| `-FilePath ‹fichier›` | fichier de sortie |
| `-Append` | ajoute au lieu d'écraser |
| `-Variable ‹nom›` | stocke aussi dans une variable |

## Exemples

**Voir et journaliser**

```powershell
Get-Process | Tee-Object -FilePath procs.txt
```

**Ajouter**

```powershell
... | Tee-Object -Append -FilePath log.txt
```

**Vers une variable**

```powershell
Get-Service | Tee-Object -Variable svc
```

*Mots-clés : tee-object tee dupliquer sortie fichier pipeline log variable*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
