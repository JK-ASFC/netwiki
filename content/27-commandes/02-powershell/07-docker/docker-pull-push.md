---
title: "docker pull / push"
description: "PowerShell — docker pull / push (Conteneurisation) : Télécharge / publie une image depuis un registry."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker pull nginx:1.27` |

## Rôle

Télécharge / publie une image depuis un registry.

## En détail

pull télécharge une image depuis un registre (comme Docker Hub) ; push y envoie la votre. C'est la distribution des images.

## Options

| Option | Rôle |
| --- | --- |
| `pull / push` | sous-commande : pull télécharge une image, push la publie vers un registre |
| `--all-tags` | traite tous les tags de l'image au lieu d'un seul |

## Exemples

**Version précise**

```powershell
docker pull nginx:1.27-alpine
```

**Publier**

```powershell
docker push registry.lan/app:1.0
```

**S'authentifier**

```powershell
docker login registry.lan
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-pull-push|docker pull / push (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-pull-push|docker pull / push (macOS)]]

*Mots-clés : télécharger publier image registry pull push docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
