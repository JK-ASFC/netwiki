---
title: "Set-VpnConnectionIPsecConfiguration"
description: "PowerShell — Set-VpnConnectionIPsecConfiguration (VPN / durcissement) : Impose les algorithmes IPsec d'un profil IKEv2 : sans cela Windows accepte des suites faibles."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / durcissement |
| **Commande type** | `Set-VpnConnectionIPsecConfiguration -ConnectionName 'VPN Bureau' -EncryptionMethod AES256 -Force` |

## Rôle

Impose les algorithmes IPsec d'un profil IKEv2 : sans cela Windows accepte des suites faibles.

## Options

| Option | Rôle |
| --- | --- |
| `-ConnectionName ‹nom›` | profil à modifier |
| `-AuthenticationTransformConstants ‹GCMAES256\|SHA256128›` | intégrité |
| `-CipherTransformConstants ‹GCMAES256\|AES256›` | chiffrement de la charge |
| `-EncryptionMethod ‹AES256\|AES192\|AES128›` | chiffrement IKE |
| `-IntegrityCheckMethod ‹SHA384\|SHA256›` | empreinte |
| `-DHGroup ‹ECP384\|ECP256\|Group14›` | groupe Diffie-Hellman |
| `-PfsGroup ‹ECP384\|PFS2048›` | confidentialité persistante |
| `-Force` | applique sans confirmation |

## Exemples

**Suite forte**

```powershell
Set-VpnConnectionIPsecConfiguration -ConnectionName 'VPN Bureau' -AuthenticationTransformConstants GCMAES256 -CipherTransformConstants GCMAES256 -EncryptionMethod AES256 -IntegrityCheckMethod SHA384 -DHGroup ECP384 -PfsGroup ECP384 -Force
```

*Mots-clés : vpn ipsec ikev2 chiffrement aes gcm dh pfs algorithme durcir sécurité*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
