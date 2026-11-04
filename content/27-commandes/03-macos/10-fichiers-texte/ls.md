---
title: "ls"
description: "macOS — ls (Audit & scripts) : Contenu d'un dossier : détails, caches, tri."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Audit & scripts |
| **Commande type** | `ls -lahtr` |

## Rôle

Contenu d'un dossier : détails, caches, tri.

## En détail

Liste le contenu d'un dossier. Avec -l on voit les détails (taille, dates, permissions), avec -a on voit aussi les fichiers caches.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | format long |
| `-a` | inclut les caches |
| `-h` | tailles lisibles |
| `-t` | trie par date |
| `-S` | trie par taille |
| `-r` | inverse |
| `--full-time` | affiche la date et l'heure complètes (seconde et année) |
| `-Z` | affiche le contexte de sécurité SELinux (utilisateur:rôle:type:niveau) de chaque fichier ; se combine avec -l pour un affichage détaillé |

## Exemples

**Plus gros en dernier**

```zsh
ls -lShr
```

**Plus récent d'abord**

```zsh
ls -lt
```

**Contexte SELinux d'un dossier**

```zsh
ls -laZ /var/www
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/ls|ls (Bash)]]

*Mots-clés : lister fichiers dossier contenu caches tri taille ls*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
