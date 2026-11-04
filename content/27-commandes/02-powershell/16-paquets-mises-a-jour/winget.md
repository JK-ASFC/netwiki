---
title: "winget"
description: "PowerShell — winget (Windows (officiel)) : Gestionnaire de paquets officiel de Windows 10/11. Installe et met à jour des applications depuis le dépôt Microsoft/communautaire, en ligne de commande."
tags: [powershell, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Windows (officiel) |
| **Commande type** | `winget install Git.Git` |

## Rôle

Gestionnaire de paquets officiel de Windows 10/11. Installe et met à jour des applications depuis le dépôt Microsoft/communautaire, en ligne de commande.

## Options

| Option | Rôle |
| --- | --- |
| `install` | installe une application |
| `uninstall` | désinstalle |
| `upgrade` | met à jour (--all pour tout) |
| `search` | cherche une appli |
| `show` | détails d'un paquet |
| `list` | liste les applis installées |
| `--id ‹identifiant›` | cible un paquet précis |

## Exemples

**Installer par identifiant**

```powershell
winget install --id Git.Git
```

**Tout mettre à jour**

```powershell
winget upgrade --all
```

**Chercher une appli**

```powershell
winget search vlc
```

*Mots-clés : winget paquet windows installer application logiciel mettre à jour package upgrade microsoft store*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
