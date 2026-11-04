---
title: "incus exec"
description: "Bash — incus exec (Virtualisation / Accès) : Exécute une commande dans une instance (par exemple ouvrir un shell)."
tags: [bash, commande, virtualisation]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Virtualisation |
| **Contexte** | Virtualisation / Accès |
| **Commande type** | `incus exec ‹instance› -- ‹commande›` |

## Rôle

Exécute une commande dans une instance (par exemple ouvrir un shell).

## Options

| Option | Rôle |
| --- | --- |
| `-- ‹commande›` | commande à exécuter (après le --) |
| `-t` | force un terminal interactif |
| `--env ‹CLE=valeur›` | variable d'environnement |
| `--cwd ‹chemin›` | répertoire de travail |

## Exemples

**Ouvrir un shell**

```bash
incus exec web -- bash
```

**Lancer une commande**

```bash
incus exec web -- apt update
```

**Avec une variable**

```bash
incus exec web --env DEBIAN_FRONTEND=noninteractive -- apt -y upgrade
```

*Mots-clés : incus lxd exec exécuter commande shell bash conteneur vm intérieur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
