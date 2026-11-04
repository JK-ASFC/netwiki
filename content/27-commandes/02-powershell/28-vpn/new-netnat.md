---
title: "New-NetNat"
description: "PowerShell — New-NetNat (VPN / routage) : Crée la traduction d'adresses qui permet aux clients du tunnel de sortir vers Internet."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / routage |
| **Commande type** | `New-NetNat -Name WgNat -InternalIPInterfaceAddressPrefix 10.66.66.0/24` |

## Rôle

Crée la traduction d'adresses qui permet aux clients du tunnel de sortir vers Internet.

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | identifiant de la règle de traduction |
| `-InternalIPInterfaceAddressPrefix ‹réseau›` | réseau privé du tunnel à traduire |
| `-ExternalIPInterfaceAddressPrefix ‹réseau›` | réseau public, si plusieurs sorties |
| `(inventaire)` | Get-NetNat |
| ⚠️ `Remove-NetNat -Name ‹nom›` | supprime la traduction et coupe la sortie Internet |

> [!WARNING]
> Options à manier avec précaution : `Remove-NetNat -Name ‹nom›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer la traduction**

```powershell
New-NetNat -Name WgNat -InternalIPInterfaceAddressPrefix 10.66.66.0/24
```

**Vérifier**

```powershell
Get-NetNat
```

**Supprimer**

```powershell
Remove-NetNat -Name WgNat -Confirm:$false
```

*Mots-clés : nat routage vpn wireguard partage connexion masquerade windows traduction*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
