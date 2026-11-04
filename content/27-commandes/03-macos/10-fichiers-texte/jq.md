---
title: "jq"
description: "macOS — jq (Audit & scripts) : Parse, filtre et transforme du JSON."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Audit & scripts |
| **Commande type** | `jq '.' fichier.json` |

## Rôle

Parse, filtre et transforme du JSON.

## En détail

Lit et filtre du JSON, le format de données des API. Permet d'extraire proprement une valeur d'une réponse au lieu de la chercher à l'oeil.

## Options

| Option | Rôle |
| --- | --- |
| `.key` | accède à un champ |
| `.[]` | itere un tableau |
| `-r` | sortie brute |
| `select()` | filtre |
| `-s` | (slurp) agrège les entrées en un tableau |
| `-c` | sortie compacte (une ligne par objet) |

## Exemples

**Champ d'une API**

```zsh
curl -s https://api.site/u | jq -r '.name'
```

**Filtrer un tableau**

```zsh
jq '.[] | select(.active)' data.json
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/jq|jq (Bash)]]

*Mots-clés : json parser filtrer api extraire requête jq*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
