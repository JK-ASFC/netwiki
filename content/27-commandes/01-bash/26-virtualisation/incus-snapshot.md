---
title: "incus snapshot"
description: "Bash — incus snapshot (Virtualisation / Snapshots) : Crée, restaure et liste les instantanés (snapshots) d'une instance."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Snapshots |
| **Commande type** | `incus snapshot ‹instance› ‹nom›` |

## Rôle

Crée, restaure et liste les instantanés (snapshots) d'une instance.

## Options

| Option | Rôle |
| --- | --- |
| `--reuse` | écrase un snapshot du même nom |
| `--stateful` | inclut l'état mémoire (instance active) |
| `(incus restore ‹instance› ‹nom›)` | restaure un snapshot |
| `(incus delete ‹instance›/‹nom›)` | supprime un snapshot |

## Exemples

**Créer**

```bash
incus snapshot web avant-maj
```

**Restaurer**

```bash
incus restore web avant-maj
```

**Voir les snapshots**

```bash
incus info web
```

*Mots-clés : incus lxd snapshot instantané sauvegarde restore restaurer conteneur vm*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
