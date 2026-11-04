---
title: "kubectl config"
description: "Bash — kubectl config (Contextes & clusters) : Gère les contextes, clusters et namespaces par défaut."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Kubernetes |
| **Contexte** | Contextes & clusters |
| **Commande type** | `kubectl config get-contexts` |

## Rôle

Gère les contextes, clusters et namespaces par défaut.

## Options

| Option | Rôle |
| --- | --- |
| `get-contexts` | liste les contextes |
| `use-context ‹nom›` | bascule de contexte |
| `current-context` | contexte courant |
| `view` | affiche la config |
| `set-context --current --namespace=‹ns›` | namespace par défaut |

## Exemples

**Lister**

```bash
kubectl config get-contexts
```

**Basculer**

```bash
kubectl config use-context prod
```

**Namespace par défaut**

```bash
kubectl config set-context --current --namespace=dev
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-config|kubectl config (macOS)]]

*Mots-clés : kubectl config contexte cluster kubeconfig use-context namespace*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
