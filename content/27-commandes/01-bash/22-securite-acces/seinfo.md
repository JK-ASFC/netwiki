---
title: "seinfo"
description: "Bash — seinfo (SELinux / Politique) : Interroge la politique SELinux chargée : compte et liste les types, rôles, utilisateurs SELinux, booléens, classes d'objets... (fourni par le paquet setools)."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / Politique |
| **Commande type** | `seinfo -t` |

## Rôle

Interroge la politique SELinux chargée : compte et liste les types, rôles, utilisateurs SELinux, booléens, classes d'objets... (fourni par le paquet setools).

## En détail

Interroge la politique SELinux chargée pour lister types, rôles, utilisateurs et booléens. Outil d'exploration (paquet setools) pour comprendre ce que la politique autorise.

## Options

| Option | Rôle |
| --- | --- |
| `-t` | liste les types (domaines et types de fichiers) |
| `-r` | liste les rôles |
| `-u` | liste les utilisateurs SELinux |
| `-b` | liste les booléens |
| `-c` | liste les classes d'objets |
| `-x` | sortie détaillée d'un élément |

## Exemples

**Résumé**

```bash
seinfo
```

**Chercher un type**

```bash
seinfo -t | grep httpd
```

**Détail d'un type**

```bash
seinfo -t httpd_t -x
```

*Mots-clés : selinux policy type rôle user politique requête seinfo setools*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
