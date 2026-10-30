---
title: "Réseau : services, Ingress, politiques"
description: Exposer et sécuriser les applications Kubernetes — types de services (ClusterIP, NodePort, LoadBalancer, ExternalName, headless), équilibreur sur site avec MetalLB (L2 ou BGP), Ingress NGINX et Gateway API, certificats automatiques avec cert-manager, DNS interne CoreDNS, NetworkPolicies et intégration au réseau de l'entreprise.
tags: [kubernetes, service, ingress, gateway api, metallb, cert-manager, networkpolicy, coredns, bgp]
icon: network
---

## Services

```yaml service-inventaire.yaml
apiVersion: v1
kind: Service
metadata: { name: inventaire, namespace: reseau }
spec:
  type: ClusterIP
  selector: { app: inventaire }
  ports:
    - name: http
      port: 80
      targetPort: 8000
```

| Type | Accès |
| --- | --- |
| **ClusterIP** (défaut) | IP virtuelle interne au cluster |
| **NodePort** | Port 30000-32767 sur **chaque** nœud |
| **LoadBalancer** | IP externe fournie par un équilibreur (cloud, **MetalLB** sur site) |
| ExternalName | Alias DNS vers un nom externe |
| Headless (`clusterIP: None`) | DNS renvoyant directement les IP des pods (StatefulSet) |

DNS interne (CoreDNS) : `inventaire.reseau.svc.cluster.local` → IP du service.

## Équilibreur sur site : MetalLB

```yaml metallb-config.yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata: { name: production, namespace: metallb-system }
spec:
  addresses: [ "10.0.40.100-10.0.40.150" ]
---
# Mode L2 : annonce ARP/NDP de l'IP par un nœud
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata: { name: l2, namespace: metallb-system }
spec:
  ipAddressPools: [ production ]
---
# Mode BGP : annonce aux routeurs de l'entreprise (répartition ECMP réelle)
apiVersion: metallb.io/v1beta2
kind: BGPPeer
metadata: { name: routeur-coeur, namespace: metallb-system }
spec:
  myASN: 64512
  peerASN: 65000
  peerAddress: 10.0.40.1
```

```bash
helm repo add metallb https://metallb.github.io/metallb
helm upgrade --install metallb metallb/metallb -n metallb-system --create-namespace
kubectl apply -f metallb-config.yaml
```

| Mode | Avantages | Limites |
| --- | --- | --- |
| L2 | Aucun équipement à configurer | Tout le trafic d'une IP passe par un seul nœud ; bascule par ARP gratuit |
| BGP | Vraie répartition (ECMP), plusieurs sous-réseaux | Configuration des routeurs (sessions BGP, filtres de préfixes) |

Cilium et Calico savent aussi annoncer les IP de services en BGP.

## Ingress

```yaml ingress-inventaire.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: inventaire
  namespace: reseau
  annotations:
    cert-manager.io/cluster-issuer: ac-interne
    nginx.ingress.kubernetes.io/proxy-body-size: "20m"
spec:
  ingressClassName: nginx
  tls:
    - hosts: [ inventaire.corp.exemple.fr ]
      secretName: inventaire-tls
  rules:
    - host: inventaire.corp.exemple.fr
      http:
        paths:
          - path: /
            pathType: Prefix
            backend: { service: { name: inventaire, port: { number: 80 } } }
```

Contrôleurs courants : **ingress-nginx** (projet communautaire, maintenance réduite annoncée : planifiez la migration), Traefik, HAProxy Ingress, Cilium, NGINX Inc. La **Gateway API** (`Gateway`, `HTTPRoute`) est le successeur standard de l'Ingress : séparation des rôles (infrastructure / application), TCP/UDP, répartition pondérée.

```yaml httproute.yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata: { name: inventaire, namespace: reseau }
spec:
  parentRefs: [ { name: passerelle-interne, namespace: infra } ]
  hostnames: [ "inventaire.corp.exemple.fr" ]
  rules:
    - backendRefs: [ { name: inventaire, port: 80 } ]
```

## Certificats : cert-manager

```yaml clusterissuer.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata: { name: letsencrypt }
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin-reseau@exemple.fr
    privateKeySecretRef: { name: letsencrypt-compte }
    solvers:
      - http01: { ingress: { ingressClassName: nginx } }
```

cert-manager sait aussi émettre depuis une **AC interne** (`ca`, Vault, ACME interne comme step-ca, ou AD CS via un émetteur dédié).

## NetworkPolicies

Par défaut, tous les pods communiquent librement. Une politique s'applique aux pods sélectionnés et n'autorise que ce qui est listé (le CNI doit les prendre en charge : Calico, Cilium).

```yaml netpol-reseau.yaml
# 1. Tout refuser en entrée dans le namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: refus-par-defaut, namespace: reseau }
spec:
  podSelector: {}
  policyTypes: [ Ingress ]
---
# 2. Autoriser l'Ingress controller vers l'application, et l'application vers la base
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: web-depuis-ingress, namespace: reseau }
spec:
  podSelector: { matchLabels: { app: inventaire } }
  ingress:
    - from:
        - namespaceSelector: { matchLabels: { kubernetes.io/metadata.name: ingress-nginx } }
      ports: [ { port: 8000 } ]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: db-depuis-web, namespace: reseau }
spec:
  podSelector: { matchLabels: { app: inventaire-db } }
  ingress:
    - from: [ { podSelector: { matchLabels: { app: inventaire } } } ]
      ports: [ { port: 5432 } ]
```

Pensez aussi aux politiques **en sortie** (`Egress`), sans oublier d'autoriser le DNS (UDP/TCP 53 vers CoreDNS).

## Intégration au réseau de l'entreprise

| Sujet | Recommandation |
| --- | --- |
| Plages pods / services | Réservées dans le plan d'adressage, sans chevauchement |
| Sortie des pods | NAT vers l'IP du nœud par défaut ; IP de sortie fixe par *egress gateway* (Cilium, Calico) pour les filtrages pare-feu |
| Routage direct des pods | Calico/Cilium en BGP avec les routeurs : pods joignables sans NAT |
| DNS | Transfert des zones internes par CoreDNS (`forward corp.exemple.fr 10.0.10.53`) |
| MTU | Encapsulation VXLAN/Geneve : MTU des pods réduite (1450) ; vérifier les liens à MTU spéciale |
