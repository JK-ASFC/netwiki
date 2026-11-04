---
title: "easyrsa"
description: "PowerShell — easyrsa (OpenVPN / PKI) : Gère la PKI d'OpenVPN. Sous Windows, l'invite dédiée EasyRSA-Start.bat doit être ouverte au préalable."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | OpenVPN / PKI |
| **Commande type** | `./easyrsa build-ca` |

## Rôle

Gère la PKI d'OpenVPN. Sous Windows, l'invite dédiée EasyRSA-Start.bat doit être ouverte au préalable.

## Options

| Option | Rôle |
| --- | --- |
| `EasyRSA-Start.bat` | ouvre l'invite Easy-RSA : indispensable avant toute sous-commande |
| `init-pki` | initialise un espace PKI vierge |
| `build-ca [nopass]` | crée l'autorité (nopass réservé au laboratoire) |
| `gen-req ‹nom› [nopass]` | génère une clé et une demande de signature |
| `sign-req ‹server\|client› ‹nom›` | signe la demande selon le rôle voulu |
| `build-server-full ‹nom›` | gen-req + sign-req serveur en une seule commande |
| `build-client-full ‹nom›` | gen-req + sign-req client en une seule commande |
| ⚠️ `revoke ‹nom› [motif]` | révoqué un certificat |
| `gen-crl` | publie la liste de révocation |
| `export-p12 ‹nom›` | paquet PKCS#12, format attendu par Windows |
| `--batch` | aucune question posée : pour les scripts |
| `(dossier)` | C:\Program Files\OpenVPN\easy-rsa |

> [!WARNING]
> Options à manier avec précaution : `revoke ‹nom› [motif]`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Ouvrir l'invite**

```powershell
cd 'C:\Program Files\OpenVPN\easy-rsa'; ./EasyRSA-Start.bat
```

**Créer l'autorité**

```powershell
./easyrsa init-pki; ./easyrsa build-ca
```

**Certificat client exportable**

```powershell
./easyrsa build-client-full poste1 nopass; ./easyrsa export-p12 poste1
```

## Dans les autres shells

- [[27-commandes/01-bash/27-vpn/easyrsa|easyrsa (Bash)]]
- [[27-commandes/03-macos/28-vpn/easyrsa|easyrsa (macOS)]]

*Mots-clés : easyrsa pki ca certificat crl revoke openvpn autorité signature windows bat*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
