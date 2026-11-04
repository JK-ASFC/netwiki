---
title: "lsattr"
description: "Bash — lsattr (Attributs de fichiers) : Affiche les attributs étendus posés par chattr (immuable, ajout seul…) sur un fichier ext2/3/4."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Attributs de fichiers |
| **Commande type** | `lsattr /etc/resolv.conf` |

## Rôle

Affiche les attributs étendus posés par chattr (immuable, ajout seul…) sur un fichier ext2/3/4.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | inclut les fichiers cachés (commençant par un point) |
| `-d` | affiche le DOSSIER lui-même au lieu de son contenu |
| `-R` | parcourt récursivement toute l'arborescence |
| `-l` | affiche les noms COMPLETS des attributs au lieu des lettres |
| `-v` | affiche aussi le numéro de version du fichier |

## Exemples

**Un fichier**

```bash
lsattr /etc/resolv.conf
```

**Un dossier**

```bash
lsattr -d /etc
```

**Noms complets**

```bash
lsattr -l /etc/passwd
```

**Récursif**

```bash
lsattr -R /etc/ssh
```

*Mots-clés : attribut lister immuable lsattr chattr vérifier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
