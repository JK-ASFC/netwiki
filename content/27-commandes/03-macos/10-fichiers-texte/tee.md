---
title: "tee"
description: "macOS — tee (Écrire ET afficher) : Lit l'entrée standard, l'écrit dans un fichier ET la réaffiche (utile au milieu d'un tube)."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Écrire ET afficher |
| **Commande type** | `tee fichier` |

## Rôle

Lit l'entrée standard, l'écrit dans un fichier ET la réaffiche (utile au milieu d'un tube).

## Options

| Option | Rôle |
| --- | --- |
| `-a` | ajoute au fichier au lieu de l'écraser |
| `(\| sudo tee)` | écrire dans un fichier protégé via un tube |

## Exemples

**Voir et journaliser**

```zsh
ping -c3 10.20.0.1 | tee ping.log
```

**Ajouter**

```zsh
commande | tee -a sortie.log
```

**Fichier root**

```zsh
echo "..." | sudo tee /etc/motd
```

## Dans les autres shells

- [[27-commandes/01-bash/10-fichiers-texte/tee|tee (Bash)]]

*Mots-clés : tee dupliquer sortie fichier tube pipe log sudo écrire*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
