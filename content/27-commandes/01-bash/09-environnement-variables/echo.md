---
title: "echo"
description: "Bash — echo (Environnement / Affichage) : Affiche du texte ou la valeur d'une variable."
tags: [bash, commande, environnement-variables]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Environnement & variables |
| **Contexte** | Environnement / Affichage |
| **Commande type** | `echo "$HOME"` |

## Rôle

Affiche du texte ou la valeur d'une variable.

## En détail

Affiche du texte ou le contenu d'une variable à l'écran. La commande la plus simple pour vérifier une valeur ou écrire un message dans un script.

## Options

| Option | Rôle |
| --- | --- |
| `-e` | interprète \n et \t |
| `-n` | sans saut de ligne final |
| `"$VAR"` | valeur d'une variable |
| `>` | redirige vers un fichier |

## Exemples

**Une variable**

```bash
echo "$HOME"
```

**Sans saut de ligne**

```bash
echo -n "Saisie : "
```

**Vers un fichier**

```bash
echo "ok" > /tmp/etat
```

## Dans les autres shells

- [[27-commandes/03-macos/09-environnement-variables/echo|echo (macOS)]]

*Mots-clés : afficher texte variable écho environnement*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
