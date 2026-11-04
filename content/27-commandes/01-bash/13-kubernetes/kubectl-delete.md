---
title: "kubectl delete"
description: "Bash — kubectl delete (Suppression) : Supprime des ressources."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Kubernetes |
| **Contexte** | Suppression |
| **Commande type** | `kubectl delete pod nginx-abc` |

## Rôle

Supprime des ressources.

## Options

| Option | Rôle |
| --- | --- |
| `-f ‹fichier›` | depuis un manifeste |
| `-n ‹namespace›` | namespace |
| `-l ‹cle=valeur›` | par label |
| `--all` | toutes les ressources du type |
| `--grace-period ‹N›` | délai avant kill (s) |
| `--force` | force (avec --grâce-period 0) |
| `--now` | suppression immédiate |

## Exemples

**Un pod**

```bash
kubectl delete pod nginx-abc
```

**Depuis un fichier**

```bash
kubectl delete -f deploy.yaml
```

**Par label**

```bash
kubectl delete pods -l app=test
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-delete|kubectl delete (macOS)]]

*Mots-clés : kubectl delete supprimer pod namespace force label*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
