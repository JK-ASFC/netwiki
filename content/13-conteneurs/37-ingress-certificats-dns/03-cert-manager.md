---
title: cert-manager
description: cert-manager (CNCF) — gestion automatique des certificats TLS dans Kubernetes : installation Helm (CRD), Issuer et ClusterIssuer (ACME Let's Encrypt avec défis HTTP-01 et DNS-01, AC interne de type CA, Vault, step-ca en ACME, émetteurs externes pour AD CS), ressource Certificate, annotations d'Ingress et Gateway API, certificats génériques, renouvellement, trust-manager pour distribuer les AC, cmctl (status, renew, check), dépannage (CertificateRequest, Order, Challenge) et supervision.
tags: [cert-manager, kubernetes, tls, acme, letsencrypt, pki, certificats]
icon: info
---

**cert-manager** obtient et **renouvelle** les certificats TLS des applications Kubernetes et les stocke dans des **Secret** utilisés par les Ingress et Gateway. Un exemple de ClusterIssuer Let's Encrypt figure dans la fiche [[04-kubernetes/04-reseau-services-ingress|Kubernetes]].

## Installation

```bash
helm repo add jetstack https://charts.jetstack.io && helm repo update
helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set crds.enabled=true
kubectl -n cert-manager get pods
```

## Émetteurs

```yaml
# AC interne : la clé et le certificat de l'AC intermédiaire sont dans le secret ac-interne
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata: { name: ac-interne }
spec: { ca: { secretName: ac-interne } }
---
# Let's Encrypt avec défi DNS-01 (certificats génériques, services non exposés à Internet)
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata: { name: letsencrypt-dns }
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin-reseau@corp.exemple.fr
    privateKeySecretRef: { name: letsencrypt-dns-compte }
    solvers:
      - dns01:
          rfc2136:
            nameserver: 10.0.10.53:53
            tsigKeyName: certmanager
            tsigAlgorithm: HMACSHA256
            tsigSecretSecretRef: { name: tsig-certmanager, key: secret }
```

Autres émetteurs : **Vault** ([[07-vault/01-presentation-installation|Vault PKI]]), ACME interne (**step-ca**), AD CS via un émetteur externe.

## Certificat explicite

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata: { name: wildcard-corp, namespace: infra }
spec:
  secretName: wildcard-corp
  dnsNames: ["*.corp.exemple.fr", "corp.exemple.fr"]
  issuerRef: { name: letsencrypt-dns, kind: ClusterIssuer }
  duration: 2160h
  renewBefore: 720h
  privateKey: { algorithm: ECDSA, size: 256, rotationPolicy: Always }
```

## Dépannage

```bash
kubectl get certificate,certificaterequest,order,challenge -A
kubectl describe certificate wildcard-corp -n infra
cmctl status certificate wildcard-corp -n infra ; cmctl renew wildcard-corp -n infra ; cmctl check api
```

**trust-manager** (projet compagnon) distribue les certificats d'AC internes dans les namespaces (ConfigMap `Bundle`) pour que les applications fassent confiance à l'AC de l'entreprise.

Commandes : [[90-aide-memoire|aide-mémoire]].
