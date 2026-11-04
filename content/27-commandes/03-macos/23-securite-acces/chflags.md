---
title: "chflags"
description: "macOS — chflags (Attributs de fichier) : Modifie les indicateurs BSD d'un fichier (caché, verrouillé) — l'équivalent macOS de chattr."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Attributs de fichier |
| **Commande type** | `chflags hidden fichier` |

## Rôle

Modifie les indicateurs BSD d'un fichier (caché, verrouillé) — l'équivalent macOS de chattr.

## Options

| Option | Rôle |
| --- | --- |
| `hidden ‹fichier›` | masque le fichier dans le Finder |
| `nohidden ‹fichier›` | le rend de nouveau visible |
| `uchg ‹fichier›` | verrouille (immuable) : empêche modification/suppression |
| `nouchg ‹fichier›` | déverrouille |
| `-R` | récursif |

## Exemples

**Cacher un fichier**

```zsh
chflags hidden .config
```

**Verrouiller (immuable)**

```zsh
sudo chflags uchg important.conf
```

**Déverrouiller**

```zsh
sudo chflags nouchg important.conf
```

*Mots-clés : attributs chflags cache verrouillé immuable protection chattr*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
