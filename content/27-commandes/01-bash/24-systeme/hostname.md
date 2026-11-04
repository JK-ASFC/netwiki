---
title: "hostname"
description: "Bash — hostname (Identité réseau) : Affiche (ou définit) le nom de la machine."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Identité réseau |
| **Commande type** | `hostname` |

## Rôle

Affiche (ou définit) le nom de la machine.

## Options

| Option | Rôle |
| --- | --- |
| `-I` | adresses IP de la machine |
| `-f` | nom complet (FQDN) |
| `-s` | nom court (sans le domaine) |

## Exemples

**Nom**

```bash
hostname
```

**Adresses IP**

```bash
hostname -I
```

**Nom complet**

```bash
hostname -f
```

## Dans les autres shells

- [[27-commandes/02-powershell/26-systeme/hostname|hostname (PowerShell)]]
- [[27-commandes/03-macos/25-systeme/hostname|hostname (macOS)]]

*Mots-clés : hostname nom machine réseau fqdn identité domaine*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
