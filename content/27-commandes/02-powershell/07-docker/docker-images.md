---
title: "docker images"
description: "PowerShell — docker images (Conteneurisation) : Liste les images locales (taille, tag, age)."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
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

```powershell
docker images
```

**Images orphelines**

```powershell
docker images -f dangling=true
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-images|docker images (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-images|docker images (macOS)]]

*Mots-clés : image lister tag taille registry images docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
