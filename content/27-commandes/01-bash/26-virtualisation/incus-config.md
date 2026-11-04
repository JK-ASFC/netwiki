---
title: "incus config"
description: "Bash — incus config (Virtualisation / Configuration) : Lit et modifie la configuration d'une instance (limites, devices, options)."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Configuration |
| **Commande type** | `incus config set ‹instance› limits.cpu 2` |

## Rôle

Lit et modifie la configuration d'une instance (limites, devices, options).

## Options

| Option | Rôle |
| --- | --- |
| `set` | définit une option (clé valeur) |
| `get` | lit une option |
| `show` | affiche toute la config |
| `edit` | édite en YAML |
| `device add` | ajoute un device (disque, réseau, GPU) |

## Exemples

**Limiter la mémoire**

```bash
incus config set web limits.memory 2GiB
```

**Voir la config**

```bash
incus config show web
```

**Monter un dossier**

```bash
incus config device add web partage disk source=/srv/data path=/data
```

*Mots-clés : incus lxd config set get show device limits cpu memory conteneur vm yaml*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
