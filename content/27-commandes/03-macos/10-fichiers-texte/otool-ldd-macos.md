---
title: "otool (ldd macOS)"
description: "macOS — otool (ldd macOS) (Binaires / Dépendances (= ldd)) : Affiche les bibliothèques (dylib et frameworks) qu'un fichier Mach-O utilise : l'équivalent de ldd sous macOS. Il lit le fichier sans l'exécuter, et ne montre que les dépendances directes."
tags: [macos, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Binaires / Dépendances (= ldd) |
| **Commande type** | `otool -L /bin/ls` |

## Rôle

Affiche les bibliothèques (dylib et frameworks) qu'un fichier Mach-O utilise : l'équivalent de ldd sous macOS. Il lit le fichier sans l'exécuter, et ne montre que les dépendances directes.

## Options

| Option | Rôle |
| --- | --- |
| `-L` | bibliothèques utilisées, avec leurs versions |
| `-D` | nom d'installation d'une bibliothèque |
| `‹fichier›` | binaire ou bibliothèque à examiner |
| `(récent) dyld_info -dependents ‹fichier›` | commande plus récente |
| `(exécution) DYLD_PRINT_LIBRARIES=1` | bibliothèques réellement chargées |
| `(outils) xcode-select --install` | fournit otool |

## Exemples

**Dépendances d'un programme**

```zsh
otool -L /bin/ls
```

**Nom d'installation d'une bibliothèque**

```zsh
otool -D /usr/lib/libSystem.B.dylib
```

**Alternative récente**

```zsh
dyld_info -dependents /bin/ls
```

*Mots-clés : otool ldd dylib framework bibliothèque dépendances mach-o dyld macos install name*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
