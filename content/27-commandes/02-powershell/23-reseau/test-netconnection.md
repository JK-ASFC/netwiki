---
title: "Test-NetConnection"
description: "PowerShell — Test-NetConnection (Dépannage réseau) : Couteau suisse : port, traceroute, latence."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `Test-NetConnection 10.20.0.1 -Port 443` |

## Rôle

Couteau suisse : port, traceroute, latence.

## Options

| Option | Rôle |
| --- | --- |
| `-Port ‹N›` | teste un port |
| `-TraceRoute` | chemin |
| `-InformationLevel Detailed` | complet |
| `-CommonTCPPort ‹port›` | HTTP/RDP/SMB |

## Exemples

**Port ouvert**

```powershell
Test-NetConnection 10.20.0.1 -Port 443
```

**Traceroute**

```powershell
Test-NetConnection example.com -TraceRoute
```

*Mots-clés : port test tcp ouvert traceroute réseau diagnostic test-netconnection*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
