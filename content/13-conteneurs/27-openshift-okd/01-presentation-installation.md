---
title: Présentation, installation et exploitation
description: OKD — distribution communautaire d'OpenShift (Red Hat) : apports par rapport à Kubernetes (console web, routes, BuildConfig et ImageStream, projets, SCC et sécurité par défaut, registre intégré, opérateurs et OperatorHub, mises à jour du cluster gérées), système Fedora CoreOS ou CentOS Stream CoreOS (SCOS), méthodes d'installation (openshift-install IPI et UPI, Agent-based Installer, Assisted Installer, OKD sur un seul nœud), prérequis DNS et répartiteurs, commandes oc (login, new-project, new-app, expose, adm), mises à jour et différences avec OpenShift Container Platform.
tags: [okd, openshift, red hat, kubernetes, oc, opérateurs, coreos]
icon: info
---

**OKD** est la version communautaire d'**OpenShift** : un Kubernetes « clé en main » avec une console web complète, des **routes** HTTP(S), la construction d'images à partir du code (Source-to-Image), un registre intégré, une sécurité stricte par défaut (*Security Context Constraints*) et des **mises à jour du cluster entier** (système d'exploitation compris) pilotées par des opérateurs. OpenShift Container Platform (OCP) en est la version commerciale supportée.

## Prérequis

- Nœuds : 3 plans de contrôle + 2 workers minimum (ou **SNO** : un seul nœud pour l'edge et les tests), 16 Go+ de RAM par nœud de contrôle.
- DNS : `api.<cluster>.<domaine>`, `api-int…` et `*.apps.<cluster>.<domaine>` ; répartiteurs pour l'API (6443, 22623) et l'ingress (80, 443) en installation UPI.
- Système : **SCOS** (CentOS Stream CoreOS) pour les versions récentes d'OKD, installé automatiquement.

## Installation (Agent-based Installer, bare metal ou VM)

```bash
# openshift-install et oc depuis les versions GitHub okd-project/okd
mkdir okd-prod && cp install-config.yaml agent-config.yaml okd-prod/      # domaine, réseaux, nœuds (MAC, IP), secret de pull, clé SSH
openshift-install agent create image --dir okd-prod                       # produit une ISO de démarrage
# Démarrer les nœuds sur l'ISO, puis
openshift-install agent wait-for install-complete --dir okd-prod
export KUBECONFIG=okd-prod/auth/kubeconfig
oc get nodes ; oc get clusterversion ; oc get co        # opérateurs du cluster
```

Mot de passe `kubeadmin` dans `okd-prod/auth/kubeadmin-password` : configurer ensuite un fournisseur d'identité (LDAP, OIDC) et supprimer `kubeadmin`.

## Utilisation courante

```bash
oc login https://api.okd.corp.exemple.fr:6443 -u jk
oc new-project inventaire
oc new-app python~https://git.corp.exemple.fr/infra/inventaire.git --name=inventaire     # build S2I + déploiement
oc expose service/inventaire ; oc get route
oc adm upgrade                                       # versions disponibles ; oc adm upgrade --to-latest
oc adm must-gather                                   # collecte de diagnostic
```

Interface : [[02-interface-graphique|console web]] · commandes : [[90-aide-memoire|aide-mémoire]].
