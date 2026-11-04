---
title: "Add-DnsServerPrimaryZone"
description: "PowerShell — Add-DnsServerPrimaryZone (DNS) : Crée une zone DNS primaire sur le serveur (résolution de noms du domaine)."
tags: [powershell, commande, windows-server]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Windows Server |
| **Contexte** | DNS |
| **Commande type** | `Add-DnsServerPrimaryZone -Name "dexterslab.lan" -ZoneFile "dexterslab.lan.dns"` |

## Rôle

Crée une zone DNS primaire sur le serveur (résolution de noms du domaine).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹zone›` | nom de la zone |
| `-ZoneFile ‹fichier›` | fichier de zone (standard) |
| `-ReplicationScope ‹Forest/Domain›` | zone intégrée à l'AD |

## Exemples

**Zone fichier**

```powershell
Add-DnsServerPrimaryZone -Name "dexterslab.lan" -ZoneFile "dexterslab.lan.dns"
```

**Intégrée AD**

```powershell
Add-DnsServerPrimaryZone -Name "lab.lan" -ReplicationScope Domain
```

*Mots-clés : add-dnsserverprimaryzone dns zone primaire serveur résolution 2025*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
