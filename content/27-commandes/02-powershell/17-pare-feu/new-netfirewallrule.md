---
title: "New-NetFirewallRule"
description: "PowerShell — New-NetFirewallRule (Réseau / Pare-feu) : Crée une règle de pare-feu Windows."
tags: [powershell, commande, pare-feu]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Pare-feu |
| **Contexte** | Réseau / Pare-feu |
| **Commande type** | `New-NetFirewallRule -DisplayName "SSH" -Direction Inbound -LocalPort 22 -Protocol TCP -Action Allow` |

## Rôle

Crée une règle de pare-feu Windows.

## Options

| Option | Rôle |
| --- | --- |
| `-DisplayName ‹nom›` | nom de la règle |
| `-LocalPort ‹port›` | port |
| `-Protocol ‹TCP›` | TCP / UDP |
| `-Action ‹Allow›` | Allow / Block |
| `-Direction ‹Inbound›` | Inbound / Outbound |
| `-RemoteAddress ‹IP/plage›` | adresse source/destination |

## Exemples

**Ouvrir un port**

```powershell
New-NetFirewallRule -DisplayName "SSH" -Direction Inbound -LocalPort 22 -Protocol TCP -Action Allow
```

**Bloquer une IP**

```powershell
New-NetFirewallRule -DisplayName "BlockX" -Direction Outbound -RemoteAddress 1.2.3.4 -Action Block
```

**Vérifier**

```powershell
Get-NetFirewallRule -DisplayName "SSH"
```

*Mots-clés : créer règle pare-feu firewall port autoriser new-netfirewallrule*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
