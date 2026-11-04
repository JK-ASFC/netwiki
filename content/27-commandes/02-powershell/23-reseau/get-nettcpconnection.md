---
title: "Get-NetTCPConnection"
description: "PowerShell — Get-NetTCPConnection (Dépannage réseau) : Connexions TCP - équivalent ss/netstat."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `Get-NetTCPConnection -State Listen` |

## Rôle

Connexions TCP - équivalent ss/netstat.

## Options

| Option | Rôle |
| --- | --- |
| `-State Listen` | en écoute |
| `-LocalPort ‹N›` | port local |
| `-RemoteAddress ‹ip›` | IP distante |
| `-OwningProcess ‹pid›` | PID |

## Exemples

**Ports en écoute**

```powershell
Get-NetTCPConnection -State Listen | Sort LocalPort
```

**Avec le process**

```powershell
Get-NetTCPConnection -State Listen | Select LocalPort,@{n='Proc';e={(Get-Process -Id $_.OwningProcess).Name}}
```

*Mots-clés : connexion port écoute listening tcp netstat ouvert get-nettcpconnection*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
