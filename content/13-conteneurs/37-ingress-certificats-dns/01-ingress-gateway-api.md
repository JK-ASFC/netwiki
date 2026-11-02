---
title: Contrôleurs Ingress, Contour et Gateway API
description: Exposer des applications HTTP(S) dans Kubernetes — Ingress et ses limites, les deux « NGINX Ingress Controller » (ingress-nginx communautaire, en fin de maintenance, et F5 NGINX Ingress Controller), Contour (CNCF, Envoy, HTTPProxy), Gateway API (GatewayClass, Gateway, HTTPRoute, GRPCRoute, TLSRoute, ReferenceGrant, séparation des rôles), implémentations (Envoy Gateway, Cilium, Istio, Traefik, Kong, NGINX Gateway Fabric), installation, exemples et plan de migration d'Ingress vers Gateway API (ingress2gateway).
tags: [ingress, gateway api, ingress-nginx, contour, envoy gateway, kubernetes]
icon: info
---

Les bases (Ingress, premier HTTPRoute) sont dans la fiche [[04-kubernetes/04-reseau-services-ingress|Kubernetes]]. Cette fiche aide à **choisir** et **migrer**.

| Contrôleur | Éditeur | Configuration | Remarques |
| --- | --- | --- | --- |
| **ingress-nginx** | Communauté Kubernetes | Ingress + annotations `nginx.ingress.kubernetes.io/*` | **Mise à la retraite annoncée** (fin de maintenance en 2026) : planifier la migration |
| **F5 NGINX Ingress Controller** | F5/NGINX (`nginxinc/kubernetes-ingress`) | Ingress + ressources VirtualServer | Produit distinct, maintenu, version Plus payante |
| **Contour** | CNCF (Envoy) | Ingress, **HTTPProxy**, Gateway API | Délégation par namespace, mises à jour sans coupure |
| Envoy Gateway, Cilium, Istio, Traefik, Kong, NGINX Gateway Fabric | Divers | **Gateway API** | Voie d'avenir |

## Gateway API

Le modèle sépare les rôles : l'équipe plate-forme gère la **Gateway** (adresses, ports, certificats), les équipes applicatives leurs **HTTPRoute**.

```bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.2.1/standard-install.yaml   # CRD (souvent fournies par l'implémentation)
helm install eg oci://docker.io/envoyproxy/gateway-helm -n envoy-gateway-system --create-namespace              # exemple : Envoy Gateway
```

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata: { name: envoy }
spec: { controllerName: gateway.envoyproxy.io/gatewayclass-controller }
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata: { name: passerelle-interne, namespace: infra }
spec:
  gatewayClassName: envoy
  listeners:
    - name: https
      protocol: HTTPS
      port: 443
      hostname: "*.corp.exemple.fr"
      tls: { certificateRefs: [{ name: wildcard-corp }] }
      allowedRoutes: { namespaces: { from: Selector, selector: { matchLabels: { exposition: interne } } } }
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata: { name: inventaire, namespace: inventaire-prod }
spec:
  parentRefs: [{ name: passerelle-interne, namespace: infra }]
  hostnames: ["inventaire.corp.exemple.fr"]
  rules:
    - matches: [{ path: { type: PathPrefix, value: /api } }]
      backendRefs: [{ name: inventaire-api, port: 8080, weight: 90 }, { name: inventaire-api-v2, port: 8080, weight: 10 }]
    - backendRefs: [{ name: inventaire-web, port: 80 }]
```

## Contour

```bash
kubectl apply -f https://projectcontour.io/quickstart/contour.yaml
```

```yaml
apiVersion: projectcontour.io/v1
kind: HTTPProxy
metadata: { name: inventaire, namespace: inventaire-prod }
spec:
  virtualhost: { fqdn: inventaire.corp.exemple.fr, tls: { secretName: inventaire-tls } }
  routes:
    - conditions: [{ prefix: / }]
      services: [{ name: inventaire-web, port: 80 }]
      timeoutPolicy: { response: 30s }
```

## Migrer depuis ingress-nginx

1. Inventorier les Ingress et surtout leurs **annotations** (réécritures, authentification, limites) : elles n'ont pas toutes d'équivalent direct.
2. Convertir avec **ingress2gateway** (`ingress2gateway print --providers ingress-nginx`) puis relire.
3. Déployer la nouvelle implémentation **en parallèle** sur une autre IP, tester, puis basculer le DNS.

Suite : [[02-metallb-externaldns|MetalLB et ExternalDNS]] · [[03-cert-manager|cert-manager]] · [[90-aide-memoire|aide-mémoire]].
