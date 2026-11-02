---
title: Cilium et Hubble
description: Cilium (CNCF, Apache 2.0) — réseau, sécurité et observabilité des pods par eBPF : installation (CLI cilium, Helm), modes (encapsulation VXLAN/Geneve ou routage natif), remplacement de kube-proxy, IPAM, politiques CiliumNetworkPolicy (L3/L4, L7 HTTP, DNS/FQDN), chiffrement transparent WireGuard ou IPsec, annonces BGP et L2 des services LoadBalancer, Gateway API et Ingress intégrés, Cluster Mesh multi-clusters, Hubble (observabilité des flux, CLI et interface), Tetragon, tests de connectivité et dépannage.
tags: [cilium, ebpf, hubble, kubernetes, cni, networkpolicy, wireguard, bgp]
icon: info
---

**Cilium** programme le réseau des pods avec **eBPF** dans le noyau Linux : performances élevées, politiques réseau jusqu'à la couche 7, remplacement de kube-proxy et visibilité complète des flux avec **Hubble**. C'est le CNI par défaut de plusieurs offres cloud et de [[25-talos-linux/01-presentation-installation|Talos]] en option recommandée.

## Installation

```bash
CLI_ARCH=amd64 ; curl -L --fail --remote-name-all https://github.com/cilium/cilium-cli/releases/latest/download/cilium-linux-${CLI_ARCH}.tar.gz
sudo tar xzvfC cilium-linux-${CLI_ARCH}.tar.gz /usr/local/bin
cilium install --set kubeProxyReplacement=true --set k8sServiceHost=10.0.20.60 --set k8sServicePort=6443 \
  --set encryption.enabled=true --set encryption.type=wireguard --set hubble.relay.enabled=true --set hubble.ui.enabled=true
cilium status --wait
cilium connectivity test           # batterie de tests de bout en bout
```

Équivalent Helm : chart `cilium/cilium`. Noyau Linux récent requis (5.10+ recommandé).

## Politiques

```yaml
apiVersion: cilium.io/v2
kind: CiliumNetworkPolicy
metadata: { name: api-sortie, namespace: inventaire }
spec:
  endpointSelector: { matchLabels: { app: api } }
  egress:
    - toEndpoints: [{ matchLabels: { app: postgresql } }]
      toPorts: [{ ports: [{ port: "5432", protocol: TCP }] }]
    - toFQDNs: [{ matchName: "netbox.corp.exemple.fr" }]
      toPorts: [{ ports: [{ port: "443", protocol: TCP }] }]
    - toEndpoints: [{ matchLabels: { "k8s:io.kubernetes.pod.namespace": kube-system, k8s-app: kube-dns } }]
      toPorts: [{ ports: [{ port: "53", protocol: ANY }], rules: { dns: [{ matchPattern: "*" }] } }]
```

## Services LoadBalancer sur site

Cilium annonce les IP de services en **BGP** (vers le cœur de réseau) ou en **L2/ARP**, sans [[37-ingress-certificats-dns/02-metallb-externaldns|MetalLB]] : ressources `CiliumLoadBalancerIPPool` et `CiliumBGPClusterConfig` / `CiliumL2AnnouncementPolicy`.

## Hubble

```bash
cilium hubble enable --ui ; cilium hubble port-forward &
hubble observe --namespace inventaire --verdict DROPPED      # paquets refusés par une politique
hubble observe --pod inventaire/api-7d9 --protocol http
cilium hubble ui                                             # interface graphique
```

<!-- CAPTURE: Hubble UI — carte des flux d'un namespace | _assets/hubble-ui.png -->

Suite : [[03-calico|Calico]] · [[90-aide-memoire|aide-mémoire]].
