---
title: Dex
description: Dex — fournisseur d'identité OIDC fédérateur (CNCF) : connecteurs LDAP et Active Directory, GitHub, GitLab, Google, Microsoft, SAML, OIDC amont, clients statiques, stockage (Kubernetes CRD, SQLite, PostgreSQL), installation (conteneur, Helm), configuration config.yaml, authentification à Kubernetes (kube-apiserver --oidc-*, kubelogin), Argo CD et outils internes.
tags: [dex, oidc, identité, ldap, active directory, kubernetes, kubectl, fédération]
icon: key-round
---

**Dex** (CNCF sandbox, Apache 2.0) est un **fournisseur OIDC** qui ne stocke pas d'utilisateurs : il délègue l'authentification à des **connecteurs** (LDAP/Active Directory, GitHub, GitLab, Google, Microsoft, SAML, autre OIDC) et émet des jetons OIDC standard. Usage typique : connexion à **Kubernetes** (`kubectl`), Argo CD, outils internes, ou [[01-oauth2-proxy|OAuth2 Proxy]].

## Installation

```bash
docker run -d --name dex -p 5556:5556 -v /etc/dex:/etc/dex ghcr.io/dexidp/dex:latest dex serve /etc/dex/config.yaml
# Kubernetes
helm repo add dex https://charts.dexidp.io && helm install dex dex/dex -n dex --create-namespace -f valeurs.yaml
```

## Configuration avec Active Directory

```yaml /etc/dex/config.yaml
issuer: https://dex.corp.exemple.fr
storage:
  type: sqlite3
  config: { file: /etc/dex/dex.db }
web:
  http: 0.0.0.0:5556
connectors:
  - type: ldap
    id: ad
    name: Active Directory
    config:
      host: dc01.corp.exemple.fr:636
      rootCA: /etc/dex/ca-ad.pem
      bindDN: CN=svc-dex,OU=Services,DC=corp,DC=exemple,DC=fr
      bindPW: $AD_BIND_PASSWORD
      usernamePrompt: Identifiant Windows
      userSearch:
        baseDN: OU=Utilisateurs,DC=corp,DC=exemple,DC=fr
        filter: "(objectClass=person)"
        username: sAMAccountName
        idAttr: objectGUID
        emailAttr: userPrincipalName
        nameAttr: displayName
      groupSearch:
        baseDN: OU=Groupes,DC=corp,DC=exemple,DC=fr
        filter: "(objectClass=group)"
        userMatchers: [{ userAttr: DN, groupAttr: member }]
        nameAttr: cn
staticClients:
  - id: kubernetes
    name: Kubernetes
    secret: secret-client-kubernetes
    redirectURIs: ["http://localhost:8000", "http://localhost:18000"]
oauth2:
  skipApprovalScreen: true
```

## Connexion à Kubernetes

Paramètres du serveur d'API (kubeadm : `ClusterConfiguration` ou, depuis Kubernetes 1.30, `AuthenticationConfiguration`) :

```bash
--oidc-issuer-url=https://dex.corp.exemple.fr --oidc-client-id=kubernetes \
--oidc-username-claim=email --oidc-groups-claim=groups
```

Côté poste, l'extension **kubelogin** :

```bash
kubectl krew install oidc-login
kubectl config set-credentials oidc --exec-api-version=client.authentication.k8s.io/v1 \
  --exec-command=kubectl --exec-arg=oidc-login --exec-arg=get-token \
  --exec-arg=--oidc-issuer-url=https://dex.corp.exemple.fr --exec-arg=--oidc-client-id=kubernetes \
  --exec-arg=--oidc-client-secret=secret-client-kubernetes --exec-arg=--oidc-extra-scope=groups
kubectl create clusterrolebinding admins-k8s --clusterrole=cluster-admin --group=admins-kubernetes
```

Voir [[04-kubernetes/01-presentation-architecture|Kubernetes]]. Journaux : sortie standard du conteneur ; découverte : `https://dex.corp.exemple.fr/.well-known/openid-configuration`.
