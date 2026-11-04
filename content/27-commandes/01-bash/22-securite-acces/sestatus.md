---
title: "sestatus"
description: "Bash — sestatus (SELinux / État) : Affiche l'état de SELinux : activé ou non, mode courant (enforcing/permissive), mode défini dans /etc/selinux/config et type de politique chargée."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / État |
| **Commande type** | `sestatus` |

## Rôle

Affiche l'état de SELinux : activé ou non, mode courant (enforcing/permissive), mode défini dans /etc/selinux/config et type de politique chargée.

## En détail

Le bilan de santé de SELinux : indique s'il est actif, en mode enforcing (bloque) ou permissive (journalise seulement), et quelle politique est chargée. Premier réflexe pour savoir où on en est.

## Options

| Option | Rôle |
| --- | --- |
| `-v` | vérifie et affiche le contexte des fichiers et processus listés dans /etc/sestatus.conf (verbeux) |
| `-b` | affiche l'état courant de tous les booléens SELinux |

## Exemples

**État complet**

```bash
sestatus
```

**Avec les booléens**

```bash
sestatus -b
```

*Mots-clés : selinux état statut mode enforcing permissive policy sestatus*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
