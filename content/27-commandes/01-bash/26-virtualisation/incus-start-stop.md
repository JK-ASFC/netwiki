---
title: "incus start / stop"
description: "Bash — incus start / stop (Virtualisation / Cycle de vie) : Démarre (start), arrête (stop) ou redémarre (restart) une instance."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Cycle de vie |
| **Commande type** | `incus start ‹instance›` |

## Rôle

Démarre (start), arrête (stop) ou redémarre (restart) une instance.

## Options

| Option | Rôle |
| --- | --- |
| `--force` | force l'arrêt (avec stop) |
| `--all` | toutes les instances |
| `(incus stop ‹instance›)` | arrête l'instance |
| `(incus restart ‹instance›)` | redémarre |

## Exemples

**Démarrer**

```bash
incus start web
```

**Arrêter de force**

```bash
incus stop web --force
```

**Redémarrer**

```bash
incus restart web
```

*Mots-clés : incus lxd start stop restart pause cycle vie conteneur vm démarrer arrêter*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
