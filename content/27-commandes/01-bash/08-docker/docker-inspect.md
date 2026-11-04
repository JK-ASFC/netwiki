---
title: "docker inspect"
description: "Bash — docker inspect (Diagnostic) : Métadonnées d'un objet (IP, volumes, env)."
tags: [bash, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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
| `-f ‹format›` | template Go |
| `--type` | type d'objet |

## Exemples

**IP du conteneur**

```bash
docker inspect -f '{{.NetworkSettings.IPAddress}}' web
```

## Dans les autres shells

- [[27-commandes/02-powershell/07-docker/docker-inspect|docker inspect (PowerShell)]]
- [[27-commandes/03-macos/08-docker/docker-inspect|docker inspect (macOS)]]

*Mots-clés : inspecter détails ip volume config json conteneur inspect docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
