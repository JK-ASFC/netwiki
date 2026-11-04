---
title: "Restart-Computer"
description: "PowerShell — Restart-Computer (Énergie & sessions) : Redémarre la machine locale ou une machine distante."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | Énergie & sessions |
| **Commande type** | `Restart-Computer -Force` |

## Rôle

Redémarre la machine locale ou une machine distante.

## Options

| Option | Rôle |
| --- | --- |
| `-Force` | force malgré les sessions ouvertes |
| `-ComputerName ‹nom›` | une machine distante |
| `-Wait` | attend qu'elle soit de nouveau en ligne |

## Exemples

**Local**

```powershell
Restart-Computer -Force
```

**À distance**

```powershell
Restart-Computer -ComputerName SRV01 -Force
```

*Mots-clés : restart-computer redémarrer reboot serveur distant force arrêt 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
