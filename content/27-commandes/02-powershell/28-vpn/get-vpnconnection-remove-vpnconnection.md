---
title: "Get-VpnConnection / Remove-VpnConnection"
description: "PowerShell — Get-VpnConnection / Remove-VpnConnection (VPN / inventaire) : Liste les profils VPN et leur état, ou supprime un profil devenu inutile."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / inventaire |
| **Commande type** | `Get-VpnConnection` |

## Rôle

Liste les profils VPN et leur état, ou supprime un profil devenu inutile.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | cible un profil précis |
| `-AllUserConnection` | profils communs à tous les comptes |
| `(champ ConnectionStatus)` | Connected ou Disconnected |
| ⚠️ `Remove-VpnConnection -Name ‹nom›` | supprime le profil |
| `-Force` | supprime sans confirmation |

> [!WARNING]
> Options à manier avec précaution : `Remove-VpnConnection -Name ‹nom›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Tous les profils**

```powershell
Get-VpnConnection | Select-Object Name,ServerAddress,ConnectionStatus
```

**Seulement les connectés**

```powershell
Get-VpnConnection | Where-Object ConnectionStatus -eq 'Connected'
```

**Supprimer**

```powershell
Remove-VpnConnection -Name 'VPN Bureau' -Force
```

*Mots-clés : vpn liste état connecte profil supprimer inventaire allusers*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
