---
title: "tee"
description: "Bash — tee (Écrire ET afficher) : Lit l'entrée standard, l'écrit dans un fichier ET la réaffiche (utile au milieu d'un tube)."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
ping -c3 10.20.0.1 | tee ping.log
```

**Ajouter**

```bash
commande | tee -a sortie.log
```

**Fichier root**

```bash
echo "..." | sudo tee /etc/motd
```

## Dans les autres shells

- [[27-commandes/03-macos/10-fichiers-texte/tee|tee (macOS)]]

*Mots-clés : tee dupliquer sortie fichier tube pipe log sudo écrire*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
