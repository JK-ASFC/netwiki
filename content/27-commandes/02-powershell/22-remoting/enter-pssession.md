---
title: "Enter-PSSession"
description: "PowerShell — Enter-PSSession (Accès distant / Support) : Shell PowerShell distant (WinRM ou SSH en PS7)."
tags: [powershell, commande, remoting]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Remoting |
| **Contexte** | Accès distant / Support |
| **Commande type** | `Enter-PSSession -ComputerName srv01` |

## Rôle

Shell PowerShell distant (WinRM ou SSH en PS7).

## Options

| Option | Rôle |
| --- | --- |
| `-ComputerName ‹hôte›` | cible |
| `-Credential ‹utilisateur›` | identifiants |
| `-UseSSL` | HTTPS/5986 |
| `-HostName ‹hôte›` | via SSH (PS7) |

## Exemples

**Shell distant**

```powershell
Enter-PSSession -ComputerName srv01
```

**Via SSH**

```powershell
Enter-PSSession -HostName host -UserName edwin
```

*Mots-clés : session distante interactive winrm shell remoting enter-pssession*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
