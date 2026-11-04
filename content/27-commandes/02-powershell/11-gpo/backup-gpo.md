---
title: "Backup-GPO"
description: "PowerShell — Backup-GPO (Stratégie de groupe) : Sauvegarde un GPO. Restore-GPO restaure, Import-GPO copie d'un domaine à l'autre."
tags: [powershell, commande, gpo]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | GPO |
| **Contexte** | Stratégie de groupe |
| **Commande type** | `Backup-GPO -Name "Conf" -Path C:\GPOBackups` |

## Rôle

Sauvegarde un GPO. Restore-GPO restaure, Import-GPO copie d'un domaine à l'autre.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹GPO›` | le GPO à sauvegarder |
| `-Path ‹dossier›` | dossier de sauvegarde |
| `-All` | sauvegarde tous les GPO |

## Exemples

**Un GPO**

```powershell
Backup-GPO -Name "Conf" -Path C:\GPOBackups
```

**Tous**

```powershell
Backup-GPO -All -Path C:\GPOBackups
```

*Mots-clés : backup-gpo gpo sauvegarde restore-gpo import-gpo stratégie export*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
