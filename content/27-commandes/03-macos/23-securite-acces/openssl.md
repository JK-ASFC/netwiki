---
title: "openssl"
description: "macOS — openssl (Boîte à outils TLS) : Cryptographie : certificats, empreintes, test de connexions TLS."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Boîte à outils TLS |
| **Commande type** | `openssl s_client -connect example.com:443` |

## Rôle

Cryptographie : certificats, empreintes, test de connexions TLS.

## En détail

Boîte à outils de cryptographie : générer des certificats, chiffrer des fichiers, tester une connexion sécurisée. Vaste mais central en sécurité.

## Options

| Option | Rôle |
| --- | --- |
| `s_client -connect ‹hôte:443›` | teste une connexion TLS et montre le certificat |
| `x509 -in ‹cert.pem› -text` | affiche le contenu d'un certificat |
| `req -new -newkey rsa:4096 -nodes -keyout ‹cle› -out ‹csr›` | génère clé et demande de certificat |
| `dgst -sha256 ‹fichier›` | calcule une empreinte SHA-256 |
| `rand -hex ‹N›` | génère N octets aléatoires en hexadécimal |

## Exemples

**Voir un certificat de site**

```zsh
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
```

**Empreinte d'un fichier**

```zsh
openssl dgst -sha256 image.iso
```

**Générer un secret**

```zsh
openssl rand -hex 32
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/openssl|openssl (Bash)]]

*Mots-clés : openssl tls certificat clé chiffrement empreinte csr https*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
