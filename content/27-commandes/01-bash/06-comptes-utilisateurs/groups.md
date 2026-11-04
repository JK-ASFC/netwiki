---
title: "groups"
description: "Bash — groups (Comptes / Groupes) : Affiche les groupes d'un utilisateur, le groupe principal en premier. Sans nom, lit ceux du processus courant : un groupe ajouté après la connexion n'y apparaît pas."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `groups jdupont` |

## Rôle

Affiche les groupes d'un utilisateur, le groupe principal en premier. Sans nom, lit ceux du processus courant : un groupe ajouté après la connexion n'y apparaît pas.

## Options

| Option | Rôle |
| --- | --- |
| `‹utilisateur›` | compte à interroger (plusieurs noms acceptés) |
| `(sans arg)` | groupes du processus courant |
| `(aucune option)` | seules --help et --version existent |
| `(voisin) id -nG ‹utilisateur›` | mêmes groupes, sans le préfixe « nom : » |
| `(inverse) getent group ‹groupe›` | qui est membre du groupe |

## Exemples

**Mes groupes (session courante)**

```bash
groups
```

**Ceux d'un compte**

```bash
groups jdupont
```

**Qui est dans un groupe**

```bash
getent group docker
```

## Dans les autres shells

- [[27-commandes/03-macos/06-comptes-utilisateurs/groups|groups (macOS)]]

*Mots-clés : groupes appartenance membre utilisateur groups droits accès sudo docker wheel id*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
