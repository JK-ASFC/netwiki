---
title: "kubectl describe"
description: "macOS — kubectl describe (Diagnostic) : Détaillé une ressource (événements, état, config)."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Diagnostic |
| **Commande type** | `kubectl describe pod nginx-abc` |

## Rôle

Détaillé une ressource (événements, état, config).

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹namespace›` | namespace |
| `-l ‹cle=valeur›` | sélecteur de labels |

## Exemples

**Décrire un pod**

```zsh
kubectl describe pod nginx-abc -n prod
```

**Un noeud**

```zsh
kubectl describe node worker-1
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-describe|kubectl describe (Bash)]]

*Mots-clés : kubectl describe détail événements diagnostic pod node*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
