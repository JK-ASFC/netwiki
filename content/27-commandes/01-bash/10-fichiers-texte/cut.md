---
title: "cut"
description: "Bash — cut (Fichiers / Extraction) : Extrait des colonnes d'une ligne."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
cut -d: -f1 /etc/passwd
```

**Plusieurs champs**

```bash
cut -d, -f1,3 data.csv
```

**Par caractères**

```bash
cut -c1-8 fichier
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/cut|cut (macOS)]]

*Mots-clés : colonnes champs délimiteur extraire cut*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
