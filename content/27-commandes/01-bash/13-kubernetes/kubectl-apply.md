---
title: "kubectl apply"
description: "Bash — kubectl apply (Déploiement) : Crée/met à jour des ressources depuis un manifeste."
tags: [bash, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
kubectl apply -f deploy.yaml
```

**Un dossier**

```bash
kubectl apply -f k8s/ -R
```

**Simulation**

```bash
kubectl apply -f deploy.yaml --dry-run=client
```

## Dans les autres shells

- [[27-commandes/03-macos/13-kubernetes/kubectl-apply|kubectl apply (macOS)]]

*Mots-clés : kubectl apply manifest yaml deploy déclaratif kustomize*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
