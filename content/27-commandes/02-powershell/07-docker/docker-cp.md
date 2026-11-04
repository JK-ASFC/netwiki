---
title: "docker cp"
description: "PowerShell — docker cp (Conteneurisation) : Copie des fichiers entre l'hôte et un conteneur."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker cp app:/etc/nginx/nginx.conf .` |

## Rôle

Copie des fichiers entre l'hôte et un conteneur.

## En détail

Copie des fichiers entre la machine hôte et un conteneur, dans un sens ou dans l'autre.

## Options

| Option | Rôle |
| --- | --- |
| `ctr:chemin .` | du conteneur vers l'hôte |
| `. ctr:chemin` | de l'hôte vers le conteneur |
| `-a` | préserve les droits |

## Exemples

**Extraire une conf**

```powershell
docker cp web:/etc/nginx/nginx.conf ./nginx.conf
```

**Injecter un fichier**

```powershell
docker cp ./app.conf web:/etc/app/
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-cp|docker cp (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-cp|docker cp (macOS)]]

*Mots-clés : copier fichier conteneur hôte extraire cp docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
