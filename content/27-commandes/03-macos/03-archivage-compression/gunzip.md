---
title: "gunzip"
description: "macOS — gunzip (Fichiers / Décompression) : Décompresse un fichier .gz. Par défaut l'archive est REMPLACÉE par le fichier décompressé : -k la conserve."
tags: [macos, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Archivage & compression |
| **Contexte** | Fichiers / Décompression |
| **Commande type** | `gunzip archive.gz` |

## Rôle

Décompresse un fichier .gz. Par défaut l'archive est REMPLACÉE par le fichier décompressé : -k la conserve.

## Options

| Option | Rôle |
| --- | --- |
| `(sans option)` | décompresse et SUPPRIME le .gz, remplacé par le fichier d'origine |
| `-k` | garde l'archive .gz en plus du fichier décompressé |
| `-c` | écrit le contenu sur la sortie standard sans toucher à l'archive (= zcat) |
| ⚠️ `-f` | écrase sans demander un fichier de destination déjà existant |
| `-l` | affiche taille compressée, taille réelle et taux au lieu de décompresser |
| `-t` | teste l'intégrité de l'archive sans rien écrire |
| `-r` | parcourt les sous-dossiers et décompresse tout ce qu'il trouve |
| `-v` | détaille chaque fichier traité et son taux de compression |
| `-q` | masque les avertissements |
| `-S ‹.suffixe›` | traite un suffixe autre que .gz |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Décompresser**

```zsh
gunzip archive.gz
```

**Garder l'archive**

```zsh
gunzip -k sauvegarde.sql.gz
```

**Vérifier avant de restaurer**

```zsh
gunzip -t sauvegarde.sql.gz
```

## Dans les autres shells

- [[27-commandes/01-bash/03-archivage-compression/gunzip|gunzip (Bash)]]

*Mots-clés : gunzip décompresser gz extraire archive gzip restaurer décompression*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
