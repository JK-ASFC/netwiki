---
title: "id"
description: "Bash — id (Comptes / Audit) : Affiche UID, GID et groupes d'un utilisateur."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Audit |
| **Commande type** | `id jdupont` |

## Rôle

Affiche UID, GID et groupes d'un utilisateur.

## En détail

Affiche l'identifiant d'un utilisateur et les groupes auxquels il appartient. Pratique pour vérifier des droits.

## Options

| Option | Rôle |
| --- | --- |
| `-u` | UID seul |
| `-g` | GID principal |
| `-G` | tous les GID |
| `-nG` | noms des groupes |
| `-Z` | affiche uniquement le contexte de sécurité SELinux du processus courant |

## Exemples

**Soi-même**

```bash
id
```

**Un utilisateur**

```bash
id jdupont
```

**Groupes lisibles**

```bash
id -nG jdupont
```

**Contexte SELinux**

```bash
id -Z
```

## Dans les autres shells

- [[27-commandes/03-macos/06-comptes-utilisateurs/id|id (macOS)]]

*Mots-clés : identité uid gid groupes audit id*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
