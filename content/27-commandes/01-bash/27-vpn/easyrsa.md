---
title: "easyrsa"
description: "Bash — easyrsa (OpenVPN / PKI) : Gère la PKI d'OpenVPN : autorité, certificats serveur et clients, révocation."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | VPN |
| **Contexte** | OpenVPN / PKI |
| **Commande type** | `./easyrsa build-ca` |

## Rôle

Gère la PKI d'OpenVPN : autorité, certificats serveur et clients, révocation.

## Options

| Option | Rôle |
| --- | --- |
| `init-pki` | initialise un espace PKI vierge |
| `build-ca [nopass]` | crée l'autorité (nopass réservé au laboratoire) |
| `gen-req ‹nom› [nopass]` | génère une clé et une demande de signature |
| `sign-req ‹server\|client› ‹nom›` | signe la demande selon le rôle voulu |
| `build-server-full ‹nom›` | gen-req + sign-req serveur en une seule commande |
| `build-client-full ‹nom›` | gen-req + sign-req client en une seule commande |
| `import-req ‹fichier› ‹nom›` | importe une demande générée sur une autre machine |
| `gen-dh` | génère les paramètres Diffie-Hellman (long) |
| ⚠️ `revoke ‹nom› [motif]` | révoqué un certificat |
| `gen-crl` | publie la liste de révocation |
| `renew ‹nom›` | renouvelle un certificat arrivant à échéance |
| `update-db` | resynchronise la base après une expiration |
| `show-cert ‹nom› / show-req ‹nom›` | affiche un certificat ou une demande |
| `show-ca` | affiche le certificat de l'autorité |
| `export-p12 ‹nom›` | paquet PKCS#12 pour Windows, macOS et mobiles |
| `--batch` | aucune question posée : pour les scripts |
| `--pki-dir=‹chemin›` | travaille sur une autre PKI que ./pki |

> [!WARNING]
> Options à manier avec précaution : `revoke ‹nom› [motif]`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Créer l'autorité**

```bash
./easyrsa init-pki && ./easyrsa build-ca
```

**Certificat serveur en une commande**

```bash
./easyrsa build-server-full serveur nopass
```

**Révoquer puis publier**

```bash
./easyrsa revoke client1 && ./easyrsa gen-crl
```

## Dans les autres shells

- [[27-commandes/02-powershell/28-vpn/easyrsa|easyrsa (PowerShell)]]
- [[27-commandes/03-macos/28-vpn/easyrsa|easyrsa (macOS)]]

*Mots-clés : easyrsa pki ca certificat crl revoke openvpn autorité signature dh renew p12*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
