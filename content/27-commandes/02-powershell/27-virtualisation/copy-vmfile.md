---
title: "Copy-VMFile"
description: "PowerShell — Copy-VMFile (Virtualisation / Fichiers) : Copie un fichier de l'hôte vers une VM (services d'intégration invité requis)."
tags: [powershell, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Fichiers |
| **Commande type** | `Copy-VMFile ‹nom› -SourcePath ‹local› -DestinationPath ‹dans-la-vm›` |

## Rôle

Copie un fichier de l'hôte vers une VM (services d'intégration invité requis).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | VM cible |
| `-SourcePath ‹chemin local›` | fichier source sur l'hôte |
| `-DestinationPath ‹chemin VM›` | destination dans la VM |
| `-FileSource ‹Host›` | source du fichier |
| `-CreateFullPath` | crée l'arborescence de destination |

## Exemples

**Copier un fichier**

```powershell
Copy-VMFile -Name SRV01 -SourcePath C:\setup.ps1 -DestinationPath C:\setup.ps1 -FileSource Host
```

**Avec création du chemin**

```powershell
Copy-VMFile -Name SRV01 -SourcePath .\app.zip -DestinationPath C:\app\app.zip -CreateFullPath -FileSource Host
```

**Vérifier dans la VM**

```powershell
Invoke-Command -VMName SRV01 -ScriptBlock { Test-Path C:\setup.ps1 }
```

*Mots-clés : hyper-v hyperv vm copy-vmfile copier fichier transfert invite guest windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
