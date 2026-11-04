---
title: "kubectl apply"
description: "macOS — kubectl apply (Déploiement) : Crée/met à jour des ressources depuis un manifeste."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Déploiement |
| **Commande type** | `kubectl apply -f manifest.yaml` |

## Rôle

Crée/met à jour des ressources depuis un manifeste.

## Options

| Option | Rôle |
| --- | --- |
| `-f ‹fichier/dossier›` | manifeste(s) |
| `-k ‹dossier_kustomize›` | via Kustomize |
| `-n ‹namespace›` | namespace |
| `-R` | récursif (dossier) |
| `--dry-run=‹mode›` | simulation (client/server/none) |
| `--server-side` | application côté serveur |
| `--prune` | supprime l'obsolète (prudence) |

## Exemples

**Appliquer**

```zsh
kubectl apply -f deploy.yaml
```

**Un dossier**

```zsh
kubectl apply -f k8s/ -R
```

**Simulation**

```zsh
kubectl apply -f deploy.yaml --dry-run=client
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-apply|kubectl apply (Bash)]]

*Mots-clés : kubectl apply manifest yaml deploy déclaratif kustomize*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
