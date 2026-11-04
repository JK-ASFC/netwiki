---
title: "ssh-keygen"
description: "macOS — ssh-keygen (Cryptographie / PKI) : Génère une paire de clés (ed25519 recommandé)."
tags: [macos, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | SSH |
| **Contexte** | Cryptographie / PKI |
| **Commande type** | `ssh-keygen -t ed25519 -C "richard@homelab"` |

## Rôle

Génère une paire de clés (ed25519 recommandé).

## En détail

Génère une paire de clés SSH (privée et publique) pour se connecter sans mot de passe, de façon plus sure. Étape de base du durcissement SSH.

## Options

| Option | Rôle |
| --- | --- |
| `-t ‹type›` | algorithme (ed25519, rsa) |
| `-C ‹commentaire›` | commentaire (ex: email) |
| `-f ‹fichier›` | fichier de clé |
| `-b ‹bits›` | taille (rsa) |
| `-p` | change la passphrase |
| `-R ‹hote›` | retire un hôte connu |

## Exemples

**Nouvelle clé**

```zsh
ssh-keygen -t ed25519 -C "richard@homelab"
```

**Oublier un hôte**

```zsh
ssh-keygen -R 10.20.0.2
```

## Dans les autres shells

- [[27-commandes/01-bash/23-ssh/ssh-keygen|ssh-keygen (Bash)]]
- [[27-commandes/02-powershell/25-ssh/ssh-keygen|ssh-keygen (PowerShell)]]

*Mots-clés : clé génération ed25519 rsa paire passphrase empreinte known_hosts keygen*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
