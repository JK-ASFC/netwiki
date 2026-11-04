---
title: "kubectl port-forward"
description: "Bash — kubectl port-forward (Accès réseau) : Redirige un port local vers un pod ou service."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
kubectl port-forward pod/nginx 8080:80
```

**Un service**

```bash
kubectl port-forward svc/web 8080:80
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-port-forward|kubectl port-forward (macOS)]]

*Mots-clés : kubectl port-forward tunnel port local accès réseau*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
