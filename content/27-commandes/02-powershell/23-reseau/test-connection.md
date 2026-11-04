---
title: "Test-Connection"
description: "PowerShell — Test-Connection (Dépannage réseau) : Ping objet (-Quiet = True/False)."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `Test-Connection 1.1.1.1 -Count 4` |

## Rôle

Ping objet (-Quiet = True/False).

## Options

| Option | Rôle |
| --- | --- |
| `-Count ‹N›` | paquets |
| `-Quiet` | booléen |
| `-TcpPort ‹N›` | port TCP |
| `-TargetName ‹hôte›` | cible |

## Exemples

**Ping**

```powershell
Test-Connection 1.1.1.1 -Count 4
```

**Port TCP**

```powershell
Test-Connection 10.20.0.1 -TcpPort 443
```

*Mots-clés : ping joignable latence test réseau connectivité test-connection*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
