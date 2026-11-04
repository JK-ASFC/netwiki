---
title: "zcat"
description: "Bash — zcat (Fichiers / Lecture compressée) : Affiche le contenu d'un fichier .gz sans le décompresser sur le disque : équivaut à gunzip -c et laisse l'archive intacte."
tags: [bash, commande, archivage-compression]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Archivage & compression |
| **Contexte** | Fichiers / Lecture compressée |
| **Commande type** | `zcat acces.log.gz` |

## Rôle

Affiche le contenu d'un fichier .gz sans le décompresser sur le disque : équivaut à gunzip -c et laisse l'archive intacte.

## Options

| Option | Rôle |
| --- | --- |
| `(sans option)` | envoie le contenu décompressé sur la sortie standard ; le fichier .gz n'est pas modifié |
| `-f` | force la lecture même si le fichier n'est pas compressé ou s'il s'agit d'un lien |
| `-l` | affiche la taille compressée, la taille réelle et le taux de compression au lieu du contenu |
| `-t` | teste l'intégrité de l'archive et n'affiche rien si elle est saine |
| `-q` | masque les avertissements |
| `-v` | détaille ce qui est traité, fichier par fichier |

## Exemples

**Lire un journal archivé**

```bash
zcat acces.log.gz
```

**Chercher dedans sans extraire**

```bash
zcat acces.log.gz | grep ERROR
```

**Vérifier l'archive**

```bash
zcat -t sauvegarde.sql.gz
```

## Dans les autres shells

- [[27-commandes/03-macos/03-archivage-compression/zcat|zcat (macOS)]]

*Mots-clés : zcat gz lire afficher compresse sans extraire gunzip cat archive log gzip décompresser*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
