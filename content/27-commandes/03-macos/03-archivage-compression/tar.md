---
title: "tar"
description: "macOS — tar (Sauvegarde & restauration) : Crée / extrait des archives compressées."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Archivage & compression |
| **Contexte** | Sauvegarde & restauration |
| **Commande type** | `tar -czvf archive.tar.gz dossier/` |

## Rôle

Crée / extrait des archives compressées.

## En détail

Regroupe plusieurs fichiers en une seule archive (.tar), souvent compressée (.tar.gz). La façon standard d'empaqueter un dossier sous Linux.

## Options

| Option | Rôle |
| --- | --- |
| `-c` | crée une archive |
| `-x` | extrait |
| `-z` | compression gzip |
| `-j` | compression bzip2 |
| `-v` | verbeux |
| `-f ‹archive.tar›` | fichier archive (suivi du nom) |
| `-t` | liste le contenu |
| `-C ‹dossier›` | se place dans un dossier |
| `-P` | chemins absolus (garde le / initial) |
| `(tar accepte aussi sans tiret : tar cvf archive.tar dossier/)` |  |

## Exemples

**Archiver /etc**

```zsh
tar -czvf etc.tar.gz /etc
```

**Extraire ailleurs**

```zsh
tar -xzvf backup.tar.gz -C /tmp/restore
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/tar|tar (Bash)]]
- [[27-commandes/02-powershell/03-archivage-compression/tar|tar (PowerShell)]]

*Mots-clés : archive compression sauvegarde extraire tar gz backup décompresser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
