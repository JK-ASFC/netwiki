---
title: "Get-MpComputerStatus"
description: "PowerShell — Get-MpComputerStatus (Durcissement / Sécurité) : État de Microsoft Defender (antivirus)."
tags: [powershell, commande, comptes-securite]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Comptes & sécurité |
| **Contexte** | Durcissement / Sécurité |
| **Commande type** | `Get-MpComputerStatus` |

## Rôle

État de Microsoft Defender (antivirus).

## Options

| Option | Rôle |
| --- | --- |
| `(seul)` | état complet |
| `Get-MpThreat` | menaces |
| `Start-MpScan` | scan |
| `Update-MpSignature` | met à jour |

## Exemples

**État de Defender**

```powershell
Get-MpComputerStatus
```

**Scan rapide**

```powershell
Start-MpScan -ScanType QuickScan
```

*Mots-clés : defender antivirus sécurité protection malware get-mpcomputerstatus*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
