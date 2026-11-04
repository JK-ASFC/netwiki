---
title: "rsync"
description: "Bash — rsync (Sauvegarde & restauration) : Copie incrémentale locale ou via SSH."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | Sauvegarde & restauration |
| **Commande type** | `rsync -avz --progress src/ user@host:/dest/` |

## Rôle

Copie incrémentale locale ou via SSH.

## En détail

Synchronise des fichiers entre deux endroits (local ou distant) en ne copiant que ce qui a changé. La base de nombreuses sauvegardes.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | archive |
| `-v` | verbeux |
| `-z` | compression |
| `-P` | progression+reprise |
| ⚠️ `--delete` | miroir strict |
| `-n` | simulation |

> [!WARNING]
> Options à manier avec précaution : `--delete`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Local vers distant**

```bash
rsync -avz -e ssh ./site/ edwin@10.20.0.2:/srv/site/
```

**Simuler avant**

```bash
rsync -avzn --delete src/ dest/
```

## Dans les autres shells

- [[27-commandes/03-macos/22-reseau/rsync|rsync (macOS)]]

*Mots-clés : synchroniser copie transfert sauvegarde miroir distant ssh backup rsync*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
