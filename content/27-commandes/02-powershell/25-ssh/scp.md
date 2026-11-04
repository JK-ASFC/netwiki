---
title: "scp"
description: "PowerShell — scp (Accès distant) : Copie de fichiers via SSH (OpenSSH Windows)."
tags: [powershell, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | SSH |
| **Contexte** | Accès distant |
| **Commande type** | `scp -r .\dist edwin@10.20.0.2:/srv/` |

## Rôle

Copie de fichiers via SSH (OpenSSH Windows).

## En détail

Copie des fichiers entre deux machines via SSH, de manière chiffrée. Simple pour un transfert ponctuel.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-P ‹port›` | port (majuscule!) |
| `-r` | récursif (dossiers) |
| `-i ‹chemin_clé›` | clé privée |

> [!WARNING]
> Options à manier avec précaution : `-P ‹port›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Envoyer un dossier**

```powershell
scp -r .\dist edwin@10.20.0.2:/srv/
```

**Récupérer un fichier**

```powershell
scp edwin@10.20.0.2:/etc/hosts .
```

**Port + clé**

```powershell
scp -P 2222 -i $env:USERPROFILE\.ssh\id_ed25519 app.zip edwin@h:/tmp/
```

## Dans les autres shells

- [[27-commandes/01-bash/23-ssh/scp|scp (Bash)]]
- [[27-commandes/03-macos/24-ssh/scp|scp (macOS)]]

*Mots-clés : scp copie transfert fichier distant upload download windows*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
