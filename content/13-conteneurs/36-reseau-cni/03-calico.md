---
title: Calico
description: Calico (Tigera, Apache 2.0) — réseau et sécurité Kubernetes : installation par l'opérateur Tigera (Installation, IPPool), modes (routage BGP sans encapsulation, VXLAN, IPIP, plan de données eBPF), appairage BGP avec les routeurs du datacenter (BGPConfiguration, BGPPeer, annonce des services), NetworkPolicy, GlobalNetworkPolicy et politiques d'hôtes, nœuds Windows, calicoctl et kubectl-calico, chiffrement WireGuard, et différences avec Calico Enterprise/Cloud.
tags: [calico, kubernetes, cni, bgp, networkpolicy, tigera, windows]
icon: info
---

**Calico** route les pods comme de vraies adresses IP : en mode **BGP**, chaque nœud annonce ses blocs de pods aux routeurs du datacenter ([[31-routage-logiciel/01-frrouting|FRR]], [[28-vyos/01-presentation-configuration|VyOS]], équipements constructeurs) sans encapsulation. Il prend en charge les **nœuds Windows** et applique des politiques fines, y compris sur les interfaces des hôtes.

## Installation (opérateur Tigera)

```bash
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.29.2/manifests/tigera-operator.yaml   # version courante : docs.tigera.io
cat <<'EOF2' | kubectl apply -f -
apiVersion: operator.tigera.io/v1
kind: Installation
metadata: { name: default }
spec:
  calicoNetwork:
    bgp: Enabled
    ipPools:
      - { cidr: 10.244.0.0/16, encapsulation: None, natOutgoing: Enabled, nodeSelector: all() }
EOF2
kubectl get tigerastatus
```

`encapsulation: VXLAN` si le réseau physique ne peut pas apprendre les routes.

## Appairage BGP

```yaml
apiVersion: projectcalico.org/v3
kind: BGPConfiguration
metadata: { name: default }
spec:
  asNumber: 65010
  nodeToNodeMeshEnabled: false
  serviceLoadBalancerIPs: [{ cidr: 10.0.25.0/24 }]     # annoncer les IP de services LoadBalancer
---
apiVersion: projectcalico.org/v3
kind: BGPPeer
metadata: { name: routeur-coeur }
spec: { peerIP: 10.0.20.1, asNumber: 65001 }
```

```bash
kubectl apply -f bgp.yaml        # avec l'API server Calico installé ; sinon calicoctl apply -f
calicoctl node status            # sessions BGP du nœud
```

## Politiques globales

```yaml
apiVersion: projectcalico.org/v3
kind: GlobalNetworkPolicy
metadata: { name: refus-par-defaut }
spec:
  namespaceSelector: has(projectcalico.org/name) && projectcalico.org/name not in {"kube-system", "calico-system"}
  types: [Ingress, Egress]
  egress:
    - action: Allow
      protocol: UDP
      destination: { selector: k8s-app == "kube-dns", ports: [53] }
```

Commandes : [[90-aide-memoire|aide-mémoire]].
