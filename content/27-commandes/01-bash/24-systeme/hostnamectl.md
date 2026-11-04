---
title: "hostnamectl"
description: "Bash — hostnamectl (Identité système) : Affiche ou change le nom d'hôte du système."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Identité système |
| **Commande type** | `hostnamectl set-hostname srv01` |

## Rôle

Affiche ou change le nom d'hôte du système.

## Options

| Option | Rôle |
| --- | --- |
| `status` | état complet (nom, OS, noyau) |
| `set-hostname ‹nom›` | change le nom d'hôte |
| `--static` | nom statique (persistant) |
| `--transient` | nom transitoire (runtime) |

## Exemples

**Voir le nom et l'OS**

```bash
hostnamectl
```

**Changer le nom d'hôte**

```bash
hostnamectl set-hostname srv01
```

*Mots-clés : hostname nom dhote machine système identité hostnamectl*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
