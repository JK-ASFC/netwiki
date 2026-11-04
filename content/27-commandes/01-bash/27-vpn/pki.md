---
title: "pki"
description: "Bash — pki (strongSwan / certificats) : Outil de certificats de strongSwan : génération de clés, autorité et signature."
tags: [bash, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | VPN |
| **Contexte** | strongSwan / certificats |
| **Commande type** | `pki --gen --type rsa --size 4096` |

## Rôle

Outil de certificats de strongSwan : génération de clés, autorité et signature.

## Options

| Option | Rôle |
| --- | --- |
| `--gen` | génère une clé privée |
| `--self` | certificat auto-signé (autorité) |
| `--pub` | extrait la clé publique |
| `--issue` | signe un certificat avec l'autorité |
| `--print` | affiche le contenu d'une clé ou d'un certificat |
| `--signcrl` | produit une liste de révocation signée |
| `--in ‹fichier›` | entrée à traiter, au lieu de l'entrée standard |
| `--type ‹rsa\|ecdsa\|ed25519›` | type de clé |
| `--size ‹bits›` | taille de la clé |
| `--dn "‹DN›"` | nom distinctif du sujet |
| `--san ‹nom›` | nom alternatif : obligatoire pour Windows et iOS |
| `--flag ‹serverAuth\|clientAuth\|ikeIntermediate›` | usage inscrit dans le certificat |
| `--lifetime ‹jours›` | durée de validité |
| `--digest ‹sha256\|sha384\|sha512›` | empreinte de signature |
| `--cacert / --cakey` | certificat et clé de l'autorité signataire |
| `--outform ‹pem\|der›` | format de sortie |

## Exemples

**Clé de l'autorité**

```bash
pki --gen --type rsa --size 4096 --outform pem > ca-key.pem
```

**Certificat d'autorité**

```bash
pki --self --ca --lifetime 3650 --in ca-key.pem --type rsa --dn "CN=VPN Root CA" --outform pem > ca-cert.pem
```

**Inspecter un certificat**

```bash
pki --print --in server-cert.pem
```

## Dans les autres shells

- [[27-commandes/03-macos/28-vpn/pki|pki (macOS)]]

*Mots-clés : pki strongswan certificat clé rsa ecdsa autorité san serverauth ikev2 crl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
