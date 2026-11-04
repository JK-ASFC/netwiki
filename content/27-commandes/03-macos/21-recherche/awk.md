---
title: "awk"
description: "macOS — awk (Audit & scripts) : Traitement par colonnes : extraction, calcul."
tags: [macos, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Recherche |
| **Contexte** | Audit & scripts |
| **Commande type** | `awk '{print $1}' fichier` |

## Rôle

Traitement par colonnes : extraction, calcul.

## En détail

Traite du texte organise en colonnes : extraire la 3e colonne, faire une somme. Un vrai petit langage pour les données en tableau.

## Options

| Option | Rôle |
| --- | --- |
| `-F ‹separateur›` | séparateur |
| `{print $N}` | colonne N |
| `NR` | numéro de ligne |
| `/motif/` | filtre |

## Exemples

**Top IP (access.log)**

```zsh
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head
```

**5e colonne CSV**

```zsh
awk -F, '{print $5}' data.csv
```

## Dans les autres shells

- [[27-commandes/01-bash/20-recherche/awk|awk (Bash)]]

*Mots-clés : colonnes champs texte extraire rapport tableau awk csv*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
