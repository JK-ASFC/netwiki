---
title: "docker rm / rmi"
description: "PowerShell — docker rm / rmi (Maintenance corrective) : Supprime un conteneur (rm) ou une image (rmi)."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Maintenance corrective |
| **Commande type** | `docker rm -f app` |

## Rôle

Supprime un conteneur (rm) ou une image (rmi).

## En détail

rm supprime un conteneur (arrête), rmi supprime une image. Pour nettoyer ce dont on n'a plus besoin.

## Options

| Option | Rôle |
| --- | --- |
| `rm / rmi` | sous-commande : rm supprime un conteneur, rmi supprime une image |
| ⚠️ `-f` | force la suppression (conteneur en marche ou image utilisée) |
| `-v` | supprime aussi les volumes anonymes du conteneur |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Supprimer un conteneur**

```powershell
docker rm -f web
```

**Supprimer une image**

```powershell
docker rmi nginx:old
```

**Tous les conteneurs arrêtés**

```powershell
docker rm $(docker ps -aq)
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-rm-rmi|docker rm / rmi (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-rm-rmi|docker rm / rmi (macOS)]]

*Mots-clés : supprimer conteneur image effacer rm rmi docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
