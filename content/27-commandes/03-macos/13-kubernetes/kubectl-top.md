---
title: "kubectl top"
description: "macOS — kubectl top (Métriques) : Consommation CPU/mémoire des pods ou noeuds (metrics-server)."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Métriques |
| **Commande type** | `kubectl top pods` |

## Rôle

Consommation CPU/mémoire des pods ou noeuds (metrics-server).

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹namespace›` | namespace |
| `-A` | tous les namespaces |
| `--sort-by ‹champ›` | trie (cpu, memory) |
| `--containers` | par conteneur |

## Exemples

**Pods**

```zsh
kubectl top pods -n prod
```

**Noeuds**

```zsh
kubectl top nodes
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-top|kubectl top (Bash)]]

*Mots-clés : kubectl top métriques cpu mémoire ressources pods nodes*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
