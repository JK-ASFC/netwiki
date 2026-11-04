---
title: "ldd"
description: "Bash — ldd (Binaires / Dépendances) : Affiche les bibliothèques partagées dont un programme a besoin, avec le fichier retenu et son adresse de chargement. Attention : il peut exécuter le programme examiné."
tags: [bash, commande, fichiers-texte]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Fichiers & texte |
| **Contexte** | Binaires / Dépendances |
| **Commande type** | `ldd /bin/ls` |

## Rôle

Affiche les bibliothèques partagées dont un programme a besoin, avec le fichier retenu et son adresse de chargement. Attention : il peut exécuter le programme examiné.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | toutes les informations, versions de symboles comprises |
| `-u` | dépendances directes inutilisées |
| `-d` | relocations des données, objets manquants |
| `-r` | relocations des données et des fonctions |
| `--version` | version de ldd |
| `‹binaire›` | programme ou bibliothèque à examiner |
| `(sécurité) objdump -p ‹binaire› \| grep NEEDED` | alternative pour un binaire non fiable |
| `(mécanisme) LD_TRACE_LOADED_OBJECTS=1` | comment ldd obtient la liste |
| `(cache) ldconfig -p` | bibliothèques connues du système |

## Exemples

**Dépendances d'un programme système**

```bash
ldd /bin/ls
```

**Bibliothèques introuvables**

```bash
ldd /usr/local/bin/app | grep "not found"
```

**Alternative sûre pour un binaire inconnu**

```bash
objdump -p ./inconnu | grep NEEDED
```

*Mots-clés : ldd bibliothèque partagée dépendances shared object so elf glibc ld.so objdump needed*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
