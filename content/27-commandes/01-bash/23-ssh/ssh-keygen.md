---
title: "ssh-keygen"
description: "Bash — ssh-keygen (Cryptographie / PKI) : Génère une paire de clés (ed25519 recommandé)."
tags: [bash, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
ssh-keygen -t ed25519 -C "richard@homelab"
```

**Oublier un hôte**

```bash
ssh-keygen -R 10.20.0.2
```

## Dans les autres shells

- [[27-commandes/02-powershell/25-ssh/ssh-keygen|ssh-keygen (PowerShell)]]
- [[27-commandes/03-macos/24-ssh/ssh-keygen|ssh-keygen (macOS)]]

*Mots-clés : clé génération ed25519 rsa paire passphrase empreinte known_hosts keygen*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
