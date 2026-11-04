---
title: "docker update"
description: "PowerShell — docker update (Conteneurisation) : Modifie À CHAUD les limites de ressources et la politique de redémarrage d'un conteneur existant, sans le recréer."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Conteneurisation |
| **Commande type** | `docker update --restart unless-stopped app` |

## Rôle

Modifie À CHAUD les limites de ressources et la politique de redémarrage d'un conteneur existant, sans le recréer.

## En détail

Ajuste à chaud les limites (RAM, CPU) et la politique de redémarrage d'un conteneur déjà lancé, sans le recréer. Pratique pour passer un conteneur en --restart unless-stopped après coup.

## Options

| Option | Rôle |
| --- | --- |
| `--restart ‹politique›` | politique de redémarrage : no, on-failure, always, unless-stopped |
| `--memory ‹512m›` | limite de mémoire (RAM) |
| `--memory-swap ‹1g›` | limite mémoire + swap combinés |
| `--cpus ‹1.5›` | nombre de cœurs alloués |
| `--cpu-shares ‹1024›` | poids CPU relatif (défaut 1024) |
| `--pids-limit ‹N›` | nombre maximal de processus (PID) |
| `--blkio-weight ‹500›` | poids d'accès disque (10 à 1000) |

## Exemples

**Politique de redémarrage**

```powershell
docker update --restart unless-stopped web
```

**Limiter la RAM**

```powershell
docker update --memory 512m app
```

**Limiter le CPU**

```powershell
docker update --cpus 1.5 app
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-update|docker update (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-update|docker update (macOS)]]

*Mots-clés : mettre à jour limites ressources mémoire cpu restart redémarrage update docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
