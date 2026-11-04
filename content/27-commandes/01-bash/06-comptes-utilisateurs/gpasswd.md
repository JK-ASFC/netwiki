---
title: "gpasswd"
description: "Bash — gpasswd (Comptes / Groupes) : Administre l'appartenance et les admins d'un groupe."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Groupes |
| **Commande type** | `gpasswd -a jdupont docker` |

## Rôle

Administre l'appartenance et les admins d'un groupe.

## En détail

Gère les membres d'un groupe : ajouter ou retirer un utilisateur, designer un administrateur de groupe.

## Options

| Option | Rôle |
| --- | --- |
| `-a ‹utilisateur›` | ajoute un membre |
| `-d ‹utilisateur›` | retire un membre |
| `-A ‹admins›` | définit les admins |
| `-M ‹membres›` | fixe la liste des membres |

## Exemples

**Ajouter au groupe**

```bash
gpasswd -a jdupont docker
```

**Retirer du groupe**

```bash
gpasswd -d jdupont docker
```

**Définir les admins**

```bash
gpasswd -A jdupont docker
```

*Mots-clés : groupe membre administrateur ajouter gpasswd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
