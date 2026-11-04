---
title: "docker images"
description: "Bash — docker images (Conteneurisation) : Liste les images locales (taille, tag, age)."
tags: [bash, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker images` |

## Rôle

Liste les images locales (taille, tag, age).

## En détail

Liste les images présentes localement, avec leur taille. Les images sont les modèles à partir desquels on crée des conteneurs.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | toutes |
| `-q` | IDs seuls |
| `--filter` | ex. dangling=true |
| `--format` | sortie perso |

## Exemples

**Lister**

```bash
docker images
```

**Images orphelines**

```bash
docker images -f dangling=true
```

## Dans les autres shells

- [[27-commandes/02-powershell/07-docker/docker-images|docker images (PowerShell)]]
- [[27-commandes/03-macos/08-docker/docker-images|docker images (macOS)]]

*Mots-clés : image lister tag taille registry images docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
