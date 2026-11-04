---
title: "Set-VpnServerConfiguration"
description: "PowerShell — Set-VpnServerConfiguration (VPN / serveur) : Règle le serveur VPN : protocoles autorisés et algorithmes acceptés côté serveur."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / serveur |
| **Commande type** | `Set-VpnServerConfiguration -TunnelType IKEv2` |

## Rôle

Règle le serveur VPN : protocoles autorisés et algorithmes acceptés côté serveur.

## Options

| Option | Rôle |
| --- | --- |
| `-TunnelType ‹IKEv2\|Sstp\|L2tp\|Pptp\|All›` | protocoles acceptés : limiter à IKEv2 écarte les protocoles hérités |
| `-EncryptionType ‹Required\|Maximum›` | niveau de chiffrement exigé |
| `-IdleDisconnectSeconds ‹N›` | coupure après inactivité |
| `-CustomPolicy` | impose une suite d'algorithmes précise |
| `(état courant)` | Get-VpnServerConfiguration |

## Exemples

**Limiter à IKEv2**

```powershell
Set-VpnServerConfiguration -TunnelType IKEv2
```

**Voir la configuration**

```powershell
Get-VpnServerConfiguration
```

**Chiffrement exigé**

```powershell
Set-VpnServerConfiguration -EncryptionType Required
```

*Mots-clés : vpn serveur rras tunneltype ikev2 sstp désactiver pptp durcir algorithme*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
