---
title: "chmod"
description: "macOS — chmod (Permissions) : Modifie les permissions d'un fichier : lecture, écriture, exécution."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Permissions |
| **Commande type** | `chmod 644 fichier` |

## Rôle

Modifie les permissions d'un fichier : lecture, écriture, exécution.

## En détail

Modifie les permissions d'un fichier : qui peut le lire, l'écrire ou l'exécuter. Au coeur de la sécurité des fichiers sous Linux.

## Options

| Option | Rôle |
| --- | --- |
| `‹octal›` | notation octale (644, 755, 600) |
| `u+x` | ajoute un droit en symbolique (u/g/o + r/w/x) |
| `-R` | récursif sur une arborescence |
| `+a ‹'user:alice allow read'›` | ajoute une entrée ACL (spécifique macOS) |
| `-N` | retire toutes les ACL d'un fichier |

## Exemples

**Fichier lisible par tous**

```zsh
chmod 644 rapport.txt
```

**Script exécutable**

```zsh
chmod +x script.sh
```

**Récursif sur un dossier**

```zsh
chmod -R 755 site/
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/chmod|chmod (Bash)]]

*Mots-clés : permissions droits chmod lecture écriture exécution octal symbolique*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
