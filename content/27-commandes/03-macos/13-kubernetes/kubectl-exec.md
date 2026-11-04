---
title: "kubectl exec"
description: "macOS — kubectl exec (Accès conteneur) : Exécute une commande dans un conteneur d'un pod."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Accès conteneur |
| **Commande type** | `kubectl exec -it nginx-abc -- bash` |

## Rôle

Exécute une commande dans un conteneur d'un pod.

## Options

| Option | Rôle |
| --- | --- |
| `-it` | interactif + TTY |
| `-n ‹namespace›` | namespace |
| `-c ‹conteneur›` | conteneur précis |
| `-- ‹commande›` | commande à lancer |

## Exemples

**Shell interactif**

```zsh
kubectl exec -it nginx-abc -- bash
```

**Une commande**

```zsh
kubectl exec nginx-abc -- ls /app
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-exec|kubectl exec (Bash)]]

*Mots-clés : kubectl exec shell bash interactif conteneur tty*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
