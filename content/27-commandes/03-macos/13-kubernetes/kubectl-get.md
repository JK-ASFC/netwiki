---
title: "kubectl get"
description: "macOS — kubectl get (Consultation) : Liste des ressources du cluster."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Consultation |
| **Commande type** | `kubectl get pods` |

## Rôle

Liste des ressources du cluster.

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹namespace›` | namespace cible |
| `-A` | tous les namespaces |
| `-o ‹format›` | format (wide, yaml, json, name) |
| `-l ‹cle=valeur›` | sélecteur de labels |
| `-w` | surveille en continu (watch) |
| `--field-selector ‹champ›` | filtre par champ |
| `--show-labels` | affiche les labels |

## Exemples

**Lister les pods**

```zsh
kubectl get pods -n prod
```

**Tout, format large**

```zsh
kubectl get pods -A -o wide
```

**Par label**

```zsh
kubectl get pods -l app=nginx
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-get|kubectl get (Bash)]]

*Mots-clés : kubectl kubernetes k8s get pods services nodes namespace liste*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
