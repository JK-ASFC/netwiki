---
title: "openssl"
description: "Bash — openssl (Cryptographie / PKI) : Boîte à outils TLS : certificats, clés, hash."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Cryptographie / PKI |
| **Commande type** | `openssl s_client -connect example.com:443` |

## Rôle

Boîte à outils TLS : certificats, clés, hash.

## En détail

Boîte à outils de cryptographie : générer des certificats, chiffrer des fichiers, tester une connexion sécurisée. Vaste mais central en sécurité.

## Options

| Option | Rôle |
| --- | --- |
| `s_client` | teste TLS |
| `x509` | lit/crée un cert |
| `req` | CSR / auto-signe |
| `dgst -sha256` | empreinte |
| `enc` | chiffre |
| `-in ‹fichier›` | fichier d'entrée |
| `-out ‹fichier›` | fichier de sortie |
| `-connect ‹hote:port›` | serveur à tester (s_client) |
| `genrsa` | (sous-cmd) génère une clé RSA |
| `genpkey` | (sous-cmd) génère une clé (moderne) |
| `pkcs12` | (sous-cmd) paquet .p12 (cert+clé) |
| `verify` | (sous-cmd) vérifie un certificat |
| `-new` | (req) nouvelle demande (CSR) |
| `-x509` | (req) auto-signe directement |
| `-newkey ‹rsa:4096›` | génère une clé (rsa:2048/4096, ed25519, ed448) |
| `-algorithm ‹RSA›` | (genpkey) algorithme : RSA, EC, ED25519, X25519 |
| `-pkeyopt ‹ec_paramgen_curve:prime256v1›` | option de génération (courbe EC, bits RSA...) |
| `-keyout ‹cle.pem›` | fichier de sortie de la clé privée |
| `-nodes` | clé privée sans passphrase (openssl <=1.1) |
| `-noenc` | clé privée sans passphrase (openssl 3+) |
| `-days ‹365›` | durée de validité (jours) |
| `-subj ‹/CN=exemple.fr›` | sujet non interactif |
| `-noout` | masque l'encodage brut (affiche juste les infos) |
| `-text` | affiche le contenu en clair (lisible) |
| `-dates` | (x509) dates de validité |
| `-fingerprint` | empreinte du certificat |
| `-sha256` | algorithme de hash pour signer |
| `-CA ‹ca.pem›` | certificat de l'autorité (signature) |
| `-CAkey ‹ca.key›` | clé de l'autorité |
| `-CAcreateserial` | crée le fichier .srl |
| `-passin ‹pass:...›` | mot de passe d'entrée |
| `-passout ‹pass:...›` | mot de passe de sortie |

## Exemples

**Validité d'un cert**

```bash
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

**Empreinte SHA-256**

```bash
openssl dgst -sha256 fichier.iso
```

**Cert auto-signe**

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

**Générer une clé RSA**

```bash
openssl genrsa -out key.pem 4096
```

**CSR non interactif**

```bash
openssl req -new -newkey rsa:2048 -nodes -keyout key.pem -out req.csr -subj "/CN=exemple.fr"
```

**Lire un cert en clair**

```bash
openssl x509 -in cert.pem -noout -text
```

**Signer un CSR par une CA**

```bash
openssl x509 -req -in req.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out cert.pem -days 365 -sha256
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/openssl|openssl (macOS)]]

*Mots-clés : certificat tls chiffrement clé ssl pki hash empreinte openssl csr*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
