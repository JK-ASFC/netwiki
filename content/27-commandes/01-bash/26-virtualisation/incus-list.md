---
title: "incus list"
description: "Bash — incus list (Virtualisation / Incus) : Liste les instances Incus (conteneurs et VM) avec leur état et leur IP."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Incus |
| **Commande type** | `incus list` |

## Rôle

Liste les instances Incus (conteneurs et VM) avec leur état et leur IP.

## Options

| Option | Rôle |
| --- | --- |
| `--format ‹table/json/csv›` | format de sortie |
| `-c ‹ns4›` | colonnes à afficher |
| `--all-projects` | toutes les projets |

## Exemples

**Tout lister**

```bash
incus list
```

**En JSON**

```bash
incus list --format json
```

**Filtrer les actifs**

```bash
incus list status=running
```

*Mots-clés : incus lxd list lister conteneur vm instance état ip projet*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
