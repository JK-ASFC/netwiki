---
title: "kubectl rollout"
description: "Bash — kubectl rollout (Déploiements) : Gère et suit les déploiements (mise à jour, retour arrière)."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
kubectl rollout status deployment/nginx
```

**Redémarrer**

```bash
kubectl rollout restart deployment/nginx
```

**Rollback**

```bash
kubectl rollout undo deployment/nginx
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-rollout|kubectl rollout (macOS)]]

*Mots-clés : kubectl rollout déploiement restart undo status rollback historique*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
