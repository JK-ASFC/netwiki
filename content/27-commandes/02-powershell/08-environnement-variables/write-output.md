---
title: "Write-Output"
description: "PowerShell — Write-Output (Environnement / Affichage) : Envoie un objet dans le pipeline (alias écho, write)."
tags: [powershell, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Affichage |
| **Commande type** | `Write-Output "Etat OK"` |

## Rôle

Envoie un objet dans le pipeline (alias écho, write).

## Options

| Option | Rôle |
| --- | --- |
| `"$var"` | valeur d'une variable |
| `Write-Host` | écrit à l'écran (hors pipeline) |
| `echo` | alias |
| `>` | redirige vers un fichier |

## Exemples

**Un texte**

```powershell
Write-Output "Etat OK"
```

**Une variable**

```powershell
Write-Output $env:COMPUTERNAME
```

**Vers un fichier**

```powershell
Write-Output "ok" > etat.txt
```

*Mots-clés : afficher sortie pipeline écho write-output*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
