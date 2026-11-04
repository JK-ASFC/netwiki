---
title: "Install-RemoteAccess"
description: "PowerShell — Install-RemoteAccess (VPN / serveur RRAS) : Configure le rôle Accès distant : c'est ce qui transforme un Windows Server en serveur VPN."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / serveur RRAS |
| **Commande type** | `Install-RemoteAccess -VpnType Vpn` |

## Rôle

Configure le rôle Accès distant : c'est ce qui transforme un Windows Server en serveur VPN.

## Options

| Option | Rôle |
| --- | --- |
| `-VpnType ‹Vpn\|VpnS2S\|SstpProxy›` | accès nomade ou liaison entre sites |
| `-IPAddressRange ‹début›,‹fin›` | plage distribuée aux clients |
| `-Legacy` | mode compatible avec les anciens clients |
| `(prérequis)` | Install-WindowsFeature RemoteAccess -IncludeManagementTools |
| `(certificat serveur)` | Set-RemoteAccess -SslCertificate ‹certificat› : lié le certificat au service |
| `(état courant)` | Get-RemoteAccess affiche la configuration en place |
| ⚠️ `Uninstall-RemoteAccess` | retire le rôle |

> [!WARNING]
> Options à manier avec précaution : `Uninstall-RemoteAccess`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Installer le rôle**

```powershell
Install-WindowsFeature RemoteAccess -IncludeManagementTools
```

**Activer le VPN**

```powershell
Install-RemoteAccess -VpnType Vpn
```

**Lier le certificat**

```powershell
Set-RemoteAccess -SslCertificate (Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -eq 'CN=vpn.example.com')
```

*Mots-clés : rras accès distant vpn serveur ikev2 site à site routage windows certificat ssl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
