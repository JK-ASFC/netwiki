---
title: "kubectl port-forward"
description: "macOS — kubectl port-forward (Accès réseau) : Redirige un port local vers un pod ou service."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Accès réseau |
| **Commande type** | `kubectl port-forward pod/nginx 8080:80` |

## Rôle

Redirige un port local vers un pod ou service.

## Options

| Option | Rôle |
| --- | --- |
| `-n ‹namespace›` | namespace |
| `--address ‹adresse›` | interface d'écoute (ex: 0.0.0.0) |

## Exemples

**Un pod**

```zsh
kubectl port-forward pod/nginx 8080:80
```

**Un service**

```zsh
kubectl port-forward svc/web 8080:80
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-port-forward|kubectl port-forward (Bash)]]

*Mots-clés : kubectl port-forward tunnel port local accès réseau*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
