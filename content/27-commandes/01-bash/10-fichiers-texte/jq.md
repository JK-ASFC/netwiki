---
title: "jq"
description: "Bash — jq (Audit & scripts) : Parse, filtre et transforme du JSON."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
curl -s https://api.site/u | jq -r '.name'
```

**Filtrer un tableau**

```bash
jq '.[] | select(.active)' data.json
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/jq|jq (macOS)]]

*Mots-clés : json parser filtrer api extraire requête jq*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
