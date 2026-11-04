---
title: "wireguard.exe"
description: "PowerShell — wireguard.exe (WireGuard / service) : Installe un tunnel WireGuard comme service Windows : il démarre seul et survit au redémarrage."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | WireGuard / service |
| **Commande type** | `wireguard.exe /installtunnelservice ‹fichier.conf›` |

## Rôle

Installe un tunnel WireGuard comme service Windows : il démarre seul et survit au redémarrage.

## Options

| Option | Rôle |
| --- | --- |
| `/installtunnelservice ‹fichier.conf›` | crée et démarre le service du tunnel |
| ⚠️ `/uninstalltunnelservice ‹nom›` | supprime le service du tunnel |
| `(nom du service)` | WireGuardTunnel$‹nom› |
| `(dossier des profils)` | C:\Program Files\WireGuard\Data\Configurations |

> [!WARNING]
> Options à manier avec précaution : `/uninstalltunnelservice ‹nom›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Installer le tunnel**

```powershell
wireguard.exe /installtunnelservice 'C:\Program Files\WireGuard\Data\Configurations\wg0.conf'
```

**État du service**

```powershell
Get-Service 'WireGuardTunnel$wg0'
```

**Retirer**

```powershell
wireguard.exe /uninstalltunnelservice wg0
```

*Mots-clés : wireguard service tunnel windows installtunnelservice démarrage automatique*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
