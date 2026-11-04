---
title: "choco"
description: "PowerShell — choco (Chocolatey (Windows)) : Chocolatey, gestionnaire de paquets communautaire pour Windows. Très utilisé pour automatiser l'installation de logiciels (console admin requise)."
tags: [powershell, commande, paquets-mises-a-jour]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Paquets & mises à jour |
| **Contexte** | Chocolatey (Windows) |
| **Commande type** | `choco install git` |

## Rôle

Chocolatey, gestionnaire de paquets communautaire pour Windows. Très utilisé pour automatiser l'installation de logiciels (console admin requise).

## Options

| Option | Rôle |
| --- | --- |
| `install` | installe un paquet |
| `uninstall` | désinstalle |
| `upgrade` | met à jour (all = tout) |
| `search` | cherche un paquet |
| `list --local-only` | liste l'installé |
| `info` | détails d'un paquet |
| `-y` | répond oui automatiquement |

## Exemples

**Installer un paquet**

```powershell
choco install git -y
```

**Tout mettre à jour**

```powershell
choco upgrade all -y
```

**Lister l'installé**

```powershell
choco list --local-only
```

*Mots-clés : choco chocolatey paquet windows installer logiciel mettre à jour package upgrade communautaire*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
