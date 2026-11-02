---
title: Rancher
description: Rancher (SUSE, Apache 2.0) — plate-forme de gestion multi-clusters Kubernetes : installation sur un cluster dédié (RKE2 ou K3s) avec Helm et cert-manager, mot de passe initial, import de clusters existants (EKS, AKS, GKE, kubeadm), création de clusters RKE2/K3s sur machines ou fournisseurs, authentification (AD, LDAP, SAML, OIDC), projets et RBAC, catalogue d'applications, supervision et journalisation intégrées, Fleet (GitOps), sauvegarde (rancher-backup), mises à jour et Rancher Desktop.
tags: [rancher, kubernetes, multi-clusters, suse, rbac, fleet]
icon: info
---

**Rancher** centralise l'administration de nombreux clusters Kubernetes (sur site, cloud, edge) : création et mise à jour, accès unifié par l'annuaire, droits par **projet**, applications, supervision et GitOps (**Fleet**). Il s'installe lui-même sur un petit cluster dédié ([[01-rke2|RKE2]] ou K3s, 3 nœuds).

## Installation (Helm)

```bash
helm repo add jetstack https://charts.jetstack.io && helm repo add rancher-stable https://releases.rancher.com/server-charts/stable && helm repo update
helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set crds.enabled=true
helm install rancher rancher-stable/rancher -n cattle-system --create-namespace \
  --set hostname=rancher.corp.exemple.fr --set bootstrapPassword=MotDePasseInitial2026 --set replicas=3 \
  --set ingress.tls.source=secret          # certificat d'entreprise dans le secret tls-rancher-ingress (ou letsEncrypt / rancher)
kubectl -n cattle-system rollout status deploy/rancher
```

Test rapide (pas de production) : `docker run -d --privileged -p 443:443 rancher/rancher`.

## Premiers réglages

- **Authentification** : *Users & Authentication → Auth Provider* (Active Directory, OpenLDAP, Keycloak via OIDC ou SAML), puis groupes → rôles.
- **Clusters** : *Cluster Management → Import Existing* (applique un manifeste d'agent) ou *Create* (RKE2/K3s sur machines personnalisées avec une commande d'enregistrement, ou sur vSphere, Proxmox via pilotes de nœuds, clouds).
- **Projets** : regroupent des namespaces avec quotas et droits.
- **Sauvegarde** : application **Rancher Backups** (vers S3) ; instantanés etcd du cluster local.

Rancher Desktop (Windows, macOS, Linux) est un produit distinct : Kubernetes (K3s) et conteneurs sur le poste de travail.

Interface : [[03-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
