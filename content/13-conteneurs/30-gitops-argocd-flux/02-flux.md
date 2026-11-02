---
title: Flux
description: Flux v2 (CNCF) — boîte à outils GitOps de Kubernetes fondée sur des contrôleurs : bootstrap depuis la CLI (GitHub, GitLab, Gitea, Git générique), sources (GitRepository, OCIRepository, HelmRepository, Bucket), Kustomization et HelmRelease, dépendances et ordre, réconciliation et suspension, déchiffrement SOPS (age, Vault), automatisation des images, notifications (Slack, Teams, webhooks), multi-locataires, interfaces (Weave GitOps, Capacitor) et comparaison avec Argo CD.
tags: [flux, fluxcd, gitops, kubernetes, sops, helmrelease]
icon: info
---

**Flux** applique le GitOps avec un ensemble de **contrôleurs** Kubernetes et sans interface obligatoire : tout se configure en ressources (`GitRepository`, `Kustomization`, `HelmRelease`) elles-mêmes stockées dans Git. Il excelle dans l'automatisation (mise à jour des images, multi-locataires, déchiffrement **SOPS** natif). [[01-argo-cd|Argo CD]] offre en revanche une interface web riche.

## Installation (bootstrap)

```bash
curl -s https://fluxcd.io/install.sh | sudo bash          # CLI ; Windows : winget install FluxCD.Flux ; macOS : brew install fluxcd/tap/flux
flux check --pre
export GITLAB_TOKEN=…
flux bootstrap gitlab --hostname=git.corp.exemple.fr --owner=infra --repository=flux-prod --branch=main --path=clusters/prod --token-auth
# Gitea/Forgejo : flux bootstrap gitea … ; dépôt quelconque : flux bootstrap git --url=ssh://git@…/flux-prod.git
flux check ; flux get all -A
```

Le bootstrap installe Flux **et** l'enregistre dans le dépôt : Flux se met ensuite à jour lui-même depuis Git.

## Déployer

```yaml
# clusters/prod/inventaire.yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata: { name: deploiements, namespace: flux-system }
spec:
  interval: 5m
  url: https://git.corp.exemple.fr/infra/deploiements.git
  ref: { branch: main }
  secretRef: { name: identifiants-git }
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata: { name: inventaire, namespace: flux-system }
spec:
  interval: 10m
  sourceRef: { kind: GitRepository, name: deploiements }
  path: ./inventaire/overlays/prod
  prune: true
  targetNamespace: inventaire-prod
  decryption: { provider: sops, secretRef: { name: sops-age } }
```

```bash
flux reconcile kustomization inventaire --with-source
flux get kustomizations ; flux logs --level=error
flux suspend kustomization inventaire ; flux resume kustomization inventaire
```

Notifications : ressources `Provider` (Slack, Microsoft Teams, Matrix, webhook) et `Alert`. Interfaces web optionnelles : **Capacitor**, Weave GitOps.

Commandes : [[90-aide-memoire|aide-mémoire]].
