---
title: Interfaces graphiques
description: Interface web d'Argo CD (liste des applications, arbre des ressources, état de synchronisation et de santé, différences, historique et retour arrière, paramètres des dépôts, clusters et projets) et interfaces optionnelles pour Flux (Capacitor, Weave GitOps), avec emplacements de captures d'écran.
tags: [argo cd, flux, interface graphique, gitops, captures]
icon: monitor
---

## Argo CD

| Écran | Contenu |
| --- | --- |
| **Applications** | Tuiles avec état **Synced/OutOfSync** et santé **Healthy/Degraded/Progressing** |
| Application | **Arbre des ressources** (Deployment → ReplicaSet → Pods), journaux, événements, *App Diff*, *Sync*, *History and Rollback* |
| Settings | Dépôts, certificats, clusters, projets, comptes, GPG |
| User Info | Groupes de l'utilisateur connecté (vérification du SSO) |

<!-- CAPTURE: Argo CD — liste des applications | _assets/argocd-applications.png -->
<!-- CAPTURE: Argo CD — arbre des ressources d'une application | _assets/argocd-arbre.png -->
<!-- CAPTURE: Argo CD — différences avant synchronisation | _assets/argocd-diff.png -->

## Flux

Pas d'interface intégrée. **Capacitor** (projet communautaire) s'installe dans le cluster et affiche sources, Kustomizations, HelmReleases et leurs erreurs ; [[31-lens-headlamp-k9s/01-presentation|Headlamp]] dispose d'un greffon Flux.

<!-- CAPTURE: Capacitor — état des Kustomizations Flux | _assets/flux-capacitor.png -->
