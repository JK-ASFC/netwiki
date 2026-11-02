---
title: Argo CD
description: Argo CD (CNCF) — déploiement continu GitOps pour Kubernetes : principe (Git source de vérité, synchronisation et détection d'écarts), installation (manifestes ou Helm, haute disponibilité), accès (interface web, CLI argocd, mot de passe initial), Application et AppProject, sources (manifestes, Kustomize, Helm, OCI), politiques de synchronisation (automatique, prune, selfHeal), ApplicationSet (multi-clusters, générateurs), SSO (OIDC, Dex, Keycloak), RBAC, gestion des secrets (Sealed Secrets, SOPS, External Secrets), notifications, Image Updater, sauvegarde et bonnes pratiques.
tags: [argo cd, gitops, kubernetes, cd, applicationset, déploiement continu]
icon: info
---

Avec **Argo CD**, l'état voulu des applications est décrit dans **Git** (manifestes, [[29-helm-kustomize/02-kustomize|Kustomize]] ou [[29-helm-kustomize/01-helm|Helm]]) ; Argo CD compare en permanence le cluster à Git, signale les **écarts** et **synchronise** (automatiquement ou sur validation). Chaque changement passe par une revue Git, l'historique sert de journal d'audit et le retour arrière se fait par `git revert`.

## Installation

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml   # ha/install.yaml en production
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d ; echo
kubectl -n argocd port-forward svc/argocd-server 8080:443        # ou Ingress/Route en HTTPS
argocd login localhost:8080 --username admin                       # CLI : brew install argocd, winget install argoproj.argocd
argocd account update-password
```

## Application

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: inventaire-prod, namespace: argocd }
spec:
  project: infra
  source:
    repoURL: https://git.corp.exemple.fr/infra/deploiements.git
    targetRevision: main
    path: inventaire/overlays/prod
  destination: { server: https://kubernetes.default.svc, namespace: inventaire-prod }
  syncPolicy:
    automated: { prune: true, selfHeal: true }
    syncOptions: [CreateNamespace=true]
```

```bash
argocd repo add https://git.corp.exemple.fr/infra/deploiements.git --username argocd --password "$JETON"
kubectl apply -f inventaire-prod.yaml
argocd app list ; argocd app get inventaire-prod ; argocd app diff inventaire-prod ; argocd app sync inventaire-prod
```

**ApplicationSet** génère des Applications pour chaque cluster ou chaque dossier d'un dépôt (générateurs `clusters`, `git`, `list`, `matrix`). **AppProject** limite les dépôts, clusters et types de ressources autorisés par équipe.

## Sécurité

- SSO via **OIDC** ([[05-keycloak/01-presentation-installation|Keycloak]], Entra ID) ou Dex intégré ; désactiver le compte `admin` ensuite (`admin.enabled: "false"`).
- RBAC dans `argocd-rbac-cm` (rôles par groupe et par projet).
- Aucun secret en clair dans Git : **Sealed Secrets**, **SOPS** (greffon KSOPS), ou **External Secrets Operator** relié à [[07-vault/01-presentation-installation|Vault]].

Suite : [[02-flux|Flux]] · [[03-interface-graphique|interface graphique]] · [[90-aide-memoire|aide-mémoire]].
