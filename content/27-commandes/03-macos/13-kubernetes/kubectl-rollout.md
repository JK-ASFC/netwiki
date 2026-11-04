---
title: "kubectl rollout"
description: "macOS — kubectl rollout (Déploiements) : Gère et suit les déploiements (mise à jour, retour arrière)."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Déploiements |
| **Commande type** | `kubectl rollout status deployment/nginx` |

## Rôle

Gère et suit les déploiements (mise à jour, retour arrière).

## Options

| Option | Rôle |
| --- | --- |
| `status ‹type/nom›` | suit le déploiement |
| `restart ‹type/nom›` | redémarre (recrée les pods) |
| `undo ‹type/nom›` | retour à la version précédente |
| `history ‹type/nom›` | historique des révisions |
| `-n ‹namespace›` | namespace |

## Exemples

**Suivre**

```zsh
kubectl rollout status deployment/nginx
```

**Redémarrer**

```zsh
kubectl rollout restart deployment/nginx
```

**Rollback**

```zsh
kubectl rollout undo deployment/nginx
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-rollout|kubectl rollout (Bash)]]

*Mots-clés : kubectl rollout déploiement restart undo status rollback historique*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
