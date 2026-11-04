---
title: "Add-VpnConnection"
description: "PowerShell — Add-VpnConnection (VPN / profil client) : Crée un profil de connexion VPN dans Windows (client natif, aucun logiciel à installer)."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / profil client |
| **Commande type** | `Add-VpnConnection -Name 'VPN Bureau' -ServerAddress vpn.example.com -TunnelType Ikev2` |

## Rôle

Crée un profil de connexion VPN dans Windows (client natif, aucun logiciel à installer).

## Options

| Option | Rôle |
| --- | --- |
| `-Name ‹nom›` | nom du profil affiché |
| `-ServerAddress ‹hôte›` | nom public ou adresse du serveur |
| `-TunnelType ‹Ikev2\|Sstp\|L2tp\|Pptp\|Automatic›` | protocole du tunnel |
| `-AuthenticationMethod ‹Eap\|MachineCertificate\|MSChapv2›` | méthode d'authentification |
| `-EncryptionLevel ‹Required\|Maximum›` | niveau de chiffrement exigé |
| `-SplitTunneling` | n'envoie dans le tunnel que les réseaux distants |
| `-RememberCredential` | mémorise les identifiants |
| `-AllUserConnection` | profil visible par tous les comptes |
| `-PassThru` | renvoie l'objet créé |

## Exemples

**Profil IKEv2**

```powershell
Add-VpnConnection -Name 'VPN Bureau' -ServerAddress vpn.example.com -TunnelType Ikev2 -AuthenticationMethod Eap -RememberCredential
```

**Tunnel partagé**

```powershell
Add-VpnConnection -Name 'VPN Site' -ServerAddress vpn.example.com -TunnelType Ikev2 -SplitTunneling
```

**Pour tous les comptes**

```powershell
Add-VpnConnection -Name 'VPN' -ServerAddress vpn.example.com -TunnelType Ikev2 -AllUserConnection
```

*Mots-clés : vpn connexion profil ikev2 sstp l2tp pptp client natif windows rasdial*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
