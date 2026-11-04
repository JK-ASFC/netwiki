---
title: "kubectl get"
description: "Bash — kubectl get (Consultation) : Liste des ressources du cluster."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
kubectl get pods -n prod
```

**Tout, format large**

```bash
kubectl get pods -A -o wide
```

**Par label**

```bash
kubectl get pods -l app=nginx
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-get|kubectl get (macOS)]]

*Mots-clés : kubectl kubernetes k8s get pods services nodes namespace liste*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
