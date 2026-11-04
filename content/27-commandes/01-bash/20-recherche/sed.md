---
title: "sed"
description: "Bash — sed (Audit & scripts) : Édition de flux : substitution, extraction."
tags: [bash, commande, recherche]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Recherche |
| **Contexte** | Audit & scripts |
| **Commande type** | `sed -i 's/old/new/g' fichier` |

## Rôle

Édition de flux : substitution, extraction.

## En détail

Modifie du texte à la volée, ligne par ligne : remplacer un mot, supprimer des lignes. Sert à transformer des fichiers sans les ouvrir.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-i` | modifie en place |
| `'s/‹motif›/‹remplacement›/g'` | substitution globale (g = toutes les occurrences de la ligne) |
| `-n '..p'` | affiche une plage |
| `-E` | regex étendue |
| `'s/‹motif›/‹remplacement›/gi'` | substitution globale en ignorant la casse (g = toutes les occurrences, i = insensible à la casse) |
| `'‹N›s/‹motif›/‹remplacement›/g'` | substitution sur une seule ligne : ‹N› est le numéro de ligne ciblé |
| `'s~‹motif›~‹remplacement›~g'` | délimiteur ~ au lieu de / : remplace des chemins (/usr/...) sans échapper les barres obliques |
| `'/‹motif›/d'` | supprime toutes les lignes qui contiennent le motif |
| `'‹N›d'` | supprime la ligne dont ‹N› est le numéro |
| `'‹N›,‹N›d'` | supprime une plage de lignes (de la première à la seconde) |
| `'/‹motif›/p'` | affiche uniquement les lignes qui contiennent le motif (avec -n) |
| `'/‹motif›/!d'` | garde uniquement les lignes qui contiennent le motif (supprime les autres) |
| `'/‹motif›/i \\‹texte›'` | insère une ligne AVANT chaque ligne trouvée |
| `'/‹motif›/a \\‹texte›'` | ajoute une ligne APRÈS chaque ligne trouvée |
| `'/‹motif›/c \\‹texte›'` | remplace entièrement chaque ligne trouvée |
| `'s/‹motif›//g'` | supprime le motif (remplace par du vide) |
| `'s/[[:space:]]*$//'` | supprime les espaces en fin de ligne |
| `'/^$/d'` | supprime les lignes vides |

> [!WARNING]
> Options à manier avec précaution : `-i`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Remplacer un port**

```bash
sed -i 's/8080/443/g' nginx.conf
```

**Lignes 10 à 20**

```bash
sed -n '10,20p' app.log
```

## Dans les autres shells

- [[27-commandes/03-macos/21-recherche/sed|sed (macOS)]]

*Mots-clés : remplacer texte éditer flux substitution stream sed*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
