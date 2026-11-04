---
title: "scp"
description: "Bash — scp (Accès distant / Bastion) : Copie via SSH (-P majuscule pour le port)."
tags: [bash, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
scp ./build.zip edwin@10.20.0.2:/tmp/
```

**Récupérer un dossier**

```bash
scp -r edwin@10.20.0.2:/var/log ./logs
```

## Dans les autres shells

- [[27-commandes/02-powershell/25-ssh/scp|scp (PowerShell)]]
- [[27-commandes/03-macos/24-ssh/scp|scp (macOS)]]

*Mots-clés : copie fichier transfert distant ssh upload download scp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
