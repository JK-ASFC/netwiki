---
title: "scp"
description: "macOS — scp (Accès distant / Bastion) : Copie via SSH (-P majuscule pour le port)."
tags: [macos, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | SSH |
| **Contexte** | Accès distant / Bastion |
| **Commande type** | `scp -P 22 -r ./dist edwin@10.20.0.2:/srv/` |

## Rôle

Copie via SSH (-P majuscule pour le port).

## En détail

Copie des fichiers entre deux machines via SSH, de manière chiffrée. Simple pour un transfert ponctuel.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-P ‹port›` | port (majuscule!) |
| `-r` | récursif (dossiers) |
| `-i ‹chemin_clé›` | clé privée |
| `-C` | compression |

> [!WARNING]
> Options à manier avec précaution : `-P ‹port›`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Envoyer un fichier**

```zsh
scp ./build.zip edwin@10.20.0.2:/tmp/
```

**Récupérer un dossier**

```zsh
scp -r edwin@10.20.0.2:/var/log ./logs
```

## Dans les autres shells

- [[27-commandes/01-bash/23-ssh/scp|scp (Bash)]]
- [[27-commandes/02-powershell/25-ssh/scp|scp (PowerShell)]]

*Mots-clés : copie fichier transfert distant ssh upload download scp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
