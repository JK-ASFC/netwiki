---
title: "cut"
description: "macOS — cut (Fichiers / Extraction) : Extrait des colonnes d'une ligne."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Fichiers / Extraction |
| **Commande type** | `cut -d: -f1 /etc/passwd` |

## Rôle

Extrait des colonnes d'une ligne.

## En détail

Extrait des colonnes ou des morceaux de chaque ligne, découpés par un séparateur. Utile pour isoler un champ précis.

## Options

| Option | Rôle |
| --- | --- |
| `-d ‹délim›` | délimiteur |
| `-f ‹champs›` | numéro(s) de champ |
| `-c ‹colonnes›` | par position de caractère |
| `--complement` | inverse |

## Exemples

**Premier champ**

```zsh
cut -d: -f1 /etc/passwd
```

**Plusieurs champs**

```zsh
cut -d, -f1,3 data.csv
```

**Par caractères**

```zsh
cut -c1-8 fichier
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/cut|cut (Bash)]]

*Mots-clés : colonnes champs délimiteur extraire cut*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
