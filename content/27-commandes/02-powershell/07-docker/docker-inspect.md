---
title: "docker inspect"
description: "PowerShell — docker inspect (Diagnostic) : Métadonnées d'un objet (IP, volumes, env)."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Diagnostic |
| **Commande type** | `docker inspect web` |

## Rôle

Métadonnées d'un objet (IP, volumes, env).

## En détail

Affiche toute la configuration détaillée d'un conteneur ou d'une image au format JSON : réseau, volumes, variables.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | template Go |
| `--type` | type d'objet |

## Exemples

**IP du conteneur**

```powershell
docker inspect -f '{{.NetworkSettings.IPAddress}}' web
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-inspect|docker inspect (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-inspect|docker inspect (macOS)]]

*Mots-clés : inspecter détails ip volume config json conteneur inspect docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
