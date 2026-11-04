---
title: "rsync"
description: "macOS — rsync (Synchronisation) : Synchronise des fichiers en ne copiant que les différences (macOS livre une version, brew en installe une plus récente)."
tags: [macos, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Réseau |
| **Contexte** | Synchronisation |
| **Commande type** | `rsync -avz source/ dest/` |

## Rôle

Synchronise des fichiers en ne copiant que les différences (macOS livre une version, brew en installe une plus récente).

## En détail

Synchronise des fichiers entre deux endroits (local ou distant) en ne copiant que ce qui a changé. La base de nombreuses sauvegardes.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | mode archive (récursif, préserve les attributs) |
| `-v` | verbeux |
| `-z` | compresse pendant le transfert |
| `-P` | progression + reprise des transferts partiels |
| `-e ssh` | passe par SSH pour une cible distante |
| `--delete` | supprime à la destination ce qui n'existe plus à la source |
| `-n` | simulation (dry-run) |

## Exemples

**Copier un dossier**

```zsh
rsync -avP source/ sauvegarde/
```

**Vers un serveur**

```zsh
rsync -avz -e ssh site/ deploy@srv:/var/www/
```

**Miroir exact (test)**

```zsh
rsync -avn --delete source/ dest/
```

## Dans les autres shells

- [[27-commandes/01-bash/21-reseau/rsync|rsync (Bash)]]

*Mots-clés : synchronisation rsync copie sauvegarde miroir incrémentiel ssh*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
