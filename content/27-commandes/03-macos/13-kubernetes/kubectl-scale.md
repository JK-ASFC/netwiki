---
title: "kubectl scale"
description: "macOS — kubectl scale (Mise à l'échelle) : Ajuste le nombre de répliques d'une ressource."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Mise à l'échelle |
| **Commande type** | `kubectl scale deployment nginx --replicas=3` |

## Rôle

Ajuste le nombre de répliques d'une ressource.

## Options

| Option | Rôle |
| --- | --- |
| `--replicas=‹N›` | nombre de répliques |
| `-n ‹namespace›` | namespace |
| `-f ‹fichier›` | depuis un manifeste |

## Exemples

**Mettre à 3**

```zsh
kubectl scale deployment nginx --replicas=3
```

**À zéro**

```zsh
kubectl scale deploy web --replicas=0
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-scale|kubectl scale (Bash)]]

*Mots-clés : kubectl scale réplicas répliques deployment échelle*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
