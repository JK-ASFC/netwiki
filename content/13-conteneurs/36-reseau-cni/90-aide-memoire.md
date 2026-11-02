---
title: CNI Kubernetes — aide-mémoire des commandes
description: Commandes Cilium (status, connectivity test, config view, hubble observe, cilium-dbg endpoint list, bpf lb list, service list, clustermesh status, upgrade), Calico (calicoctl node status, get ippool, get bgppeer, ipam show, kubectl get tigerastatus), Flannel et Multus (net-attach-def, annotations, journaux) avec exemples, et vérifications réseau génériques des pods.
tags: [aide-mémoire, cilium, hubble, calico, calicoctl, flannel, multus]
icon: terminal
---

Explications : [[01-presentation-comparatif|CNI]] · [[02-cilium|Cilium]] · [[03-calico|Calico]].

```bash
cilium status ; cilium connectivity test ; cilium config view | grep -i kube-proxy ; cilium upgrade --version 1.17.2 ; cilium clustermesh status
kubectl -n kube-system exec ds/cilium -- cilium-dbg endpoint list ; kubectl -n kube-system exec ds/cilium -- cilium-dbg service list
hubble observe -n inventaire --verdict DROPPED -f ; hubble observe --to-fqdn netbox.corp.exemple.fr
calicoctl node status ; calicoctl get ippool -o wide ; calicoctl get bgppeer ; calicoctl ipam show --show-blocks ; kubectl get tigerastatus
kubectl -n kube-flannel logs ds/kube-flannel-ds --tail=30 ; kubectl get network-attachment-definitions -A
kubectl get pods -o wide -A | head ; kubectl run test --rm -it --image=nicolaka/netshoot -- bash     # boîte à outils réseau dans un pod
kubectl get networkpolicies -A
```
