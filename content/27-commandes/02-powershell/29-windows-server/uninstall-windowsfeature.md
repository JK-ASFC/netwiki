---
title: "Uninstall-WindowsFeature"
description: "PowerShell — Uninstall-WindowsFeature (Rôles & fonctionnalités) : Retire un rôle ou une fonctionnalité."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | Rôles & fonctionnalités |
| **Commande type** | `Uninstall-WindowsFeature -Name DNS` |

## Rôle

Retire un rôle ou une fonctionnalité.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹rôle›` | le rôle à retirer |
| `-Restart` | redémarre si nécessaire |
| `-Remove` | supprime aussi les fichiers (payload) |

## Exemples

**Retirer**

```powershell
Uninstall-WindowsFeature -Name DNS -Restart
```

*Mots-clés : uninstall-windowsfeature retirer rôle fonctionnalité serveur remove 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
