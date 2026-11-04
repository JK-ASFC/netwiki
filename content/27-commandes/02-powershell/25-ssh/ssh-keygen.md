---
title: "ssh-keygen"
description: "PowerShell — ssh-keygen (Cryptographie / PKI) : Génère une paire de clés SSH (OpenSSH Windows)."
tags: [powershell, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | SSH |
| **Contexte** | Cryptographie / PKI |
| **Commande type** | `ssh-keygen -t ed25519 -C "richard@homelab"` |

## Rôle

Génère une paire de clés SSH (OpenSSH Windows).

## En détail

Génère une paire de clés SSH (privée et publique) pour se connecter sans mot de passe, de façon plus sure. Étape de base du durcissement SSH.

## Options

| Option | Rôle |
| --- | --- |
| `-t ‹type›` | algorithme (ed25519, rsa) |
| `-C ‹commentaire›` | commentaire/étiquette |
| `-f ‹fichier›` | chemin de la clé |
| `-b ‹bits›` | taille (rsa) |

## Exemples

**Clé ed25519**

```powershell
ssh-keygen -t ed25519 -C "richard@homelab"
```

**Vers un fichier précis**

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\id_homelab
```

**Voir l'empreinte**

```powershell
ssh-keygen -lf $env:USERPROFILE\.ssh\id_ed25519.pub
```

## Dans les autres shells

- [[27-commandes/01-bash/23-ssh/ssh-keygen|ssh-keygen (Bash)]]
- [[27-commandes/03-macos/24-ssh/ssh-keygen|ssh-keygen (macOS)]]

*Mots-clés : ssh-keygen clé génération ed25519 rsa paire passphrase empreinte windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
