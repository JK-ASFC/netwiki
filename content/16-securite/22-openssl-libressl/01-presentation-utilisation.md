---
title: Présentation et usages courants
description: OpenSSL (Apache 2.0) et LibreSSL (OpenBSD) — bibliothèques et outils cryptographiques : versions (OpenSSL 3.x LTS, fin de 1.1.1, fournisseurs FIPS et legacy), installation et versions sur Linux, Windows (Git, Shining Light, winget), macOS (LibreSSL fourni, OpenSSL via Homebrew), commandes essentielles (génération de clés RSA et ECDSA, CSR avec SAN, certificat auto-signé, inspection, vérification de chaîne, correspondance clé/certificat, conversions PEM, DER, PKCS#12, test de connexion s_client, empreintes, chiffrement de fichiers, mots de passe aléatoires) et différences avec LibreSSL.
tags: [openssl, libressl, certificats, csr, pkcs12, tls, cryptographie]
icon: info
---

**OpenSSL** est la bibliothèque cryptographique la plus utilisée (serveurs web, VPN, messagerie) et sa commande `openssl` le couteau suisse des certificats. **LibreSSL** est un fork d'OpenBSD (après Heartbleed) utilisé par OpenBSD et macOS ; ses commandes de base sont compatibles.

| Version | État |
| --- | --- |
| OpenSSL **3.x** (3.0 LTS, 3.5 LTS) | Courantes ; architecture à *providers* (default, fips, legacy) |
| OpenSSL 1.1.1 | Fin de support public (2023) : migrer |
| LibreSSL | OpenBSD, macOS (`/usr/bin/openssl`), certaines distributions |

## Installation

```bash
openssl version -a                  # Linux : préinstallé ; paquets openssl et libssl-dev (Debian), openssl-devel (RHEL)
brew install openssl@3              # macOS : la commande du système est LibreSSL
winget install ShiningLight.OpenSSL.Light    # Windows (ou openssl fourni avec Git for Windows)
```

## Clés, CSR et certificats

```bash
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out srv.key          # clé ECDSA
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out srv-rsa.key        # clé RSA
openssl req -new -key srv.key -out srv.csr -subj "/C=FR/O=Corp/CN=intranet.corp.exemple.fr" \
  -addext "subjectAltName=DNS:intranet.corp.exemple.fr,DNS:intranet,IP:10.0.20.15"
openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:P-256 -nodes -days 365 -keyout test.key -out test.crt -subj "/CN=test.local" -addext "subjectAltName=DNS:test.local"
openssl req -in srv.csr -noout -text | grep -A1 "Subject Alternative"
```

## Inspecter et vérifier

```bash
openssl x509 -in srv.crt -noout -subject -issuer -dates -ext subjectAltName
openssl verify -CAfile chaine-ac.pem srv.crt
openssl x509 -in srv.crt -noout -pubkey | openssl sha256 ; openssl pkey -in srv.key -pubout | openssl sha256   # même empreinte = clé et certificat assortis
openssl s_client -connect intranet.corp.exemple.fr:443 -servername intranet.corp.exemple.fr -showcerts </dev/null
openssl s_client -starttls smtp -connect smtp.corp.exemple.fr:587 </dev/null | openssl x509 -noout -dates
```

## Conversions

```bash
openssl x509 -in srv.crt -outform DER -out srv.der                                   # PEM → DER
openssl pkcs12 -export -inkey srv.key -in srv.crt -certfile chaine.pem -out srv.pfx   # pour Windows/IIS
openssl pkcs12 -in srv.pfx -nodes -out tout.pem                                       # PFX → PEM (ajouter -legacy pour d'anciens PFX)
openssl crl -in liste.crl -inform DER -noout -text | head
```

## Divers

```bash
openssl rand -base64 32                               # secret aléatoire
openssl dgst -sha256 iso.img                          # empreinte
openssl enc -aes-256-cbc -pbkdf2 -salt -in secret.txt -out secret.enc     # chiffrement par mot de passe (préférer age ou GnuPG)
```

Commandes : [[90-aide-memoire|aide-mémoire]].
