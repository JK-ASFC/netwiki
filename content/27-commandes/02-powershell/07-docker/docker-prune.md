---
title: "docker prune"
description: "PowerShell — docker prune (Maintenance corrective) : Libère de l'espace (inutilisé)."
tags: [powershell, commande, docker]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Docker |
| **Contexte** | Maintenance corrective |
| **Commande type** | `docker system prune -af` |

## Rôle

Libère de l'espace (inutilisé).

## En détail

Fait le menage : supprime les conteneurs, images et volumes inutilisés qui occupent de l'espace disque. À utiliser avec prudence.

## Options

| Option | Rôle |
| --- | --- |
| `-a` | images inutilisées |
| `-f` | sans confirmation |
| ⚠️ `--volumes` | supprime les volumes |

> [!WARNING]
> Options à manier avec précaution : `--volumes`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Nettoyage complet**

```powershell
docker system prune -af
```

## Dans les autres shells

- [[27-commandes/01-bash/08-docker/docker-prune|docker prune (Bash)]]
- [[27-commandes/03-macos/08-docker/docker-prune|docker prune (macOS)]]

*Mots-clés : nettoyer espace supprimer inutilisé orphelin prune docker*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
