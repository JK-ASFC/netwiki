---
title: "setenforce"
description: "Bash — setenforce (SELinux / Mode) : Bascule SELinux entre Enforcing (1) et Permissive (0)."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / Mode |
| **Commande type** | `setenforce 1` |

## Rôle

Bascule SELinux entre Enforcing (1) et Permissive (0).

## Options

| Option | Rôle |
| --- | --- |
| `1 / 0` | Enforcing (1) / Permissive (0) |

## Exemples

**Mode Enforcing (applique)**

```bash
setenforce 1
```

**Mode Permissive (journalise)**

```bash
setenforce 0
```

**Rendre permanent**

```bash
editer /etc/selinux/config
```

*Mots-clés : selinux enforcing permissive mode setenforce*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
