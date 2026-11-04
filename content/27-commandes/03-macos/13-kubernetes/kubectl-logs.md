---
title: "kubectl logs"
description: "macOS — kubectl logs (Journaux) : Affiche les logs d'un pod ou conteneur."
tags: [macos, commande, kubernetes]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Kubernetes |
| **Contexte** | Journaux |
| **Commande type** | `kubectl logs nginx-abc` |

## Rôle

Affiche les logs d'un pod ou conteneur.

## Options

| Option | Rôle |
| --- | --- |
| `-f` | suit en continu (follow) |
| `-n ‹namespace›` | namespace |
| `-c ‹conteneur›` | conteneur précis |
| `--tail ‹N›` | N dernières lignes |
| `--since ‹duree›` | depuis (ex: 1h, 10m) |
| `-p` | conteneur précédent (crash) |
| `--timestamps` | horodatage |

## Exemples

**Suivre**

```zsh
kubectl logs -f nginx-abc
```

**100 lignes**

```zsh
kubectl logs nginx-abc --tail 100
```

**Un conteneur**

```zsh
kubectl logs nginx-abc -c sidecar
```

## Dans les autres shells

- [[27-commandes/01-bash/13-kubernetes/kubectl-logs|kubectl logs (Bash)]]

*Mots-clés : kubectl logs journaux stdout follow tail conteneur*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
