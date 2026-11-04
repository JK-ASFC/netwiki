---
title: "Resolve-DnsName"
description: "PowerShell — Resolve-DnsName (Dépannage réseau) : Requêtes DNS (équivalent dig/nslookup)."
tags: [powershell, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Réseau |
| **Contexte** | Dépannage réseau |
| **Commande type** | `Resolve-DnsName example.com -Type MX` |

## Rôle

Requêtes DNS (équivalent dig/nslookup).

## Options

| Option | Rôle |
| --- | --- |
| `-Type ‹type›` | A/AAAA/MX/TXT |
| `-Server ‹serveur›` | résolveur |
| `-DnsOnly` | ignore le cache |

## Exemples

**Résolution**

```powershell
Resolve-DnsName example.com
```

**MX**

```powershell
Resolve-DnsName example.com -Type MX
```

*Mots-clés : dns résolution nom domaine enregistrement nslookup dig resolve-dnsname*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
