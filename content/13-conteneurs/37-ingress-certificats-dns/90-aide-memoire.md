---
title: Ingress, Gateway API, MetalLB, ExternalDNS et cert-manager — aide-mémoire
description: Commandes kubectl pour l'exposition des services (get ingress, ingressclass, gateway, gatewayclass, httproute, svc type LoadBalancer), ingress-nginx (journaux, configuration), Contour (httpproxy status), MetalLB (ipaddresspools, l2advertisements, bgppeers, speaker logs), ExternalDNS (journaux, --dry-run) et cert-manager (cmctl status, renew, inspect secret, approve, check api ; certificate, order, challenge) avec exemples.
tags: [aide-mémoire, ingress, gateway api, metallb, externaldns, cert-manager, cmctl]
icon: terminal
---

Explications : [[01-ingress-gateway-api|Ingress et Gateway API]] · [[02-metallb-externaldns|MetalLB et ExternalDNS]] · [[03-cert-manager|cert-manager]].

```bash
kubectl get ingressclass ; kubectl get ingress -A ; kubectl get gatewayclass ; kubectl get gateway -A ; kubectl get httproute -A
kubectl describe httproute inventaire -n inventaire-prod      # conditions Accepted / ResolvedRefs
kubectl -n ingress-nginx logs deploy/ingress-nginx-controller --tail=50 ; kubectl get httpproxy -A
kubectl get svc -A --field-selector spec.type=LoadBalancer
kubectl -n metallb-system get ipaddresspools,l2advertisements,bgppeers,bgpadvertisements ; kubectl -n metallb-system logs ds/metallb-speaker --tail=30
kubectl -n external-dns logs deploy/external-dns --tail=50
kubectl get certificate,certificaterequest,order,challenge -A ; cmctl status certificate NOM -n NS ; cmctl renew NOM -n NS
cmctl inspect secret NOM-tls -n NS ; cmctl check api ; kubectl get clusterissuer
```
