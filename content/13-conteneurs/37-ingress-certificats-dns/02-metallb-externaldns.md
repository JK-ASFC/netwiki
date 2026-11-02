---
title: MetalLB et ExternalDNS
description: MetalLB (adresses des services LoadBalancer sur site : modes L2/ARP et BGP, IPAddressPool, L2Advertisement, BGPPeer, BGPAdvertisement, BFD, partage d'IP, limites du mode L2, installation Helm ou manifestes, prérequis kube-proxy strictARP) et ExternalDNS (création automatique des enregistrements DNS à partir des Service et Ingress/HTTPRoute : fournisseurs RFC2136 avec BIND et Windows DNS, PowerDNS, Cloudflare, Route 53, Azure ; annotations, filtres de domaine, registre TXT, politique sync ou upsert-only), avec exemples.
tags: [metallb, externaldns, kubernetes, loadbalancer, bgp, dns, rfc2136]
icon: info
---

## MetalLB

Sur un cluster **sur site**, un service `type: LoadBalancer` reste « Pending » : **MetalLB** lui attribue une IP d'un pool et l'annonce sur le réseau. La configuration de base est décrite dans la fiche [[04-kubernetes/04-reseau-services-ingress|Kubernetes]].

| Mode | Fonctionnement | Limites |
| --- | --- | --- |
| **L2** (ARP/NDP) | Un nœud répond pour l'IP | Tout le trafic d'une IP passe par un nœud ; bascule en quelques secondes |
| **BGP** | Chaque nœud annonce l'IP aux routeurs (ECMP) | Nécessite des routeurs BGP (et idéalement BFD) |

```yaml
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata: { name: services-dmz, namespace: metallb-system }
spec:
  addresses: [10.0.25.10-10.0.25.60]
  autoAssign: false                       # attribution explicite par annotation
---
apiVersion: metallb.io/v1beta2
kind: BGPPeer
metadata: { name: coeur-1, namespace: metallb-system }
spec: { myASN: 65010, peerASN: 65001, peerAddress: 10.0.20.1, bfdProfile: rapide }
---
apiVersion: metallb.io/v1beta1
kind: BGPAdvertisement
metadata: { name: dmz, namespace: metallb-system }
spec: { ipAddressPools: [services-dmz], communities: ["65001:300"] }
```

```yaml
# Service utilisant une IP précise du pool
metadata:
  annotations:
    metallb.io/address-pool: services-dmz
    metallb.io/loadBalancerIPs: 10.0.25.12
```

Avec kube-proxy en mode IPVS, activer `strictARP: true`. Cilium et Calico proposent leurs propres annonces (voir [[36-reseau-cni/01-presentation-comparatif|CNI]]).

## ExternalDNS

**ExternalDNS** crée et met à jour les enregistrements DNS des noms déclarés dans les Service, Ingress et routes Gateway API.

```bash
helm repo add external-dns https://kubernetes-sigs.github.io/external-dns/ && helm repo update
helm install external-dns external-dns/external-dns -n external-dns --create-namespace -f valeurs-externaldns.yaml
```

```yaml
# valeurs-externaldns.yaml — mises à jour dynamiques RFC 2136 vers BIND (ou DNS Windows avec GSS-TSIG)
provider: { name: rfc2136 }
domainFilters: [k8s.corp.exemple.fr]
policy: upsert-only          # ne jamais supprimer (sync pour supprimer aussi)
registry: txt
txtOwnerId: cluster-prod
sources: [service, ingress, gateway-httproute]
extraArgs:
  - --rfc2136-host=10.0.10.53
  - --rfc2136-zone=k8s.corp.exemple.fr
  - --rfc2136-tsig-keyname=externaldns
  - --rfc2136-tsig-secret-alg=hmac-sha256
  - --rfc2136-tsig-axfr
env:
  - name: EXTERNAL_DNS_RFC2136_TSIG_SECRET
    valueFrom: { secretKeyRef: { name: tsig-externaldns, key: secret } }
```

Côté [[01-bind9/01-presentation|BIND]] : clé TSIG et `update-policy` limitée à la zone dédiée. Annotation sur un service : `external-dns.alpha.kubernetes.io/hostname: inventaire.k8s.corp.exemple.fr`.

Suite : [[03-cert-manager|cert-manager]] · [[90-aide-memoire|aide-mémoire]].
