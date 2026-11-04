---
title: "kubectl describe"
description: "Bash — kubectl describe (Diagnostic) : Détaillé une ressource (événements, état, config)."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
kubectl describe pod nginx-abc -n prod
```

**Un noeud**

```bash
kubectl describe node worker-1
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-describe|kubectl describe (macOS)]]

*Mots-clés : kubectl describe détail événements diagnostic pod node*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
