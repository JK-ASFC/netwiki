---
title: "incus delete"
description: "Bash — incus delete (Virtualisation / Suppression) : Supprime définitivement une instance (et ses snapshots avec --force)."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Suppression |
| **Commande type** | `incus delete ‹instance›` |

## Rôle

Supprime définitivement une instance (et ses snapshots avec --force).

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `--force` | supprime même si l'instance tourne (et ses snapshots) |
| `--interactive` | demande confirmation |
| `(arrêter d'abord)` | incus stop ‹instance› |

> [!WARNING]
> Options à manier avec précaution : `--force`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Supprimer (arrêtée)**

```bash
incus delete vieux-conteneur
```

**Forcer**

```bash
incus delete web --force
```

**Plusieurs**

```bash
incus delete c1 c2 c3 --force
```

*Mots-clés : incus lxd delete supprimer détruire conteneur vm instance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
