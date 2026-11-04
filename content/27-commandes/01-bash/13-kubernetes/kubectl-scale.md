---
title: "kubectl scale"
description: "Bash — kubectl scale (Mise à l'échelle) : Ajuste le nombre de répliques d'une ressource."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
kubectl scale deployment nginx --replicas=3
```

**À zéro**

```bash
kubectl scale deploy web --replicas=0
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-scale|kubectl scale (macOS)]]

*Mots-clés : kubectl scale réplicas répliques deployment échelle*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
