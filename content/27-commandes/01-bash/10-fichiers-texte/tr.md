---
title: "tr"
description: "Bash — tr (Transformer des caractères) : Remplace ou supprime des caractères, caractère par caractère (lit l'entrée standard)."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Transformer des caractères |
| **Commande type** | `tr 'a-z' 'A-Z'` |

## Rôle

Remplace ou supprime des caractères, caractère par caractère (lit l'entrée standard).

## Options

| Option | Rôle |
| --- | --- |
| `-d` | supprime les caractères indiqués |
| `-s` | compresse les répétitions |
| `-c` | complément : tout sauf l'ensemble |

## Exemples

**Mettre en majuscules**

```bash
echo bonjour | tr 'a-z' 'A-Z'
```

**Supprimer les chiffres**

```bash
tr -d '0-9' < fichier
```

**Espaces en sauts de ligne**

```bash
tr ' ' '\n' < texte
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/tr|tr (macOS)]]

*Mots-clés : tr translate remplacer caractère majuscule supprimer squeeze classe*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
