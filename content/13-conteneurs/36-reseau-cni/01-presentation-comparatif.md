---
title: Présentation, comparatif, Flannel, Weave Net et Multus
description: Réseau des pods Kubernetes (CNI) — rôle d'un plugin CNI, modèles (overlay VXLAN/Geneve, routage natif, BGP, eBPF), comparatif Cilium, Calico, Flannel et Weave Net (politiques réseau, chiffrement, performances, observabilité), choix selon le contexte, Flannel (installation, backends vxlan et host-gw, limites), Weave Net (projet archivé, migration), Multus (interfaces multiples, NetworkAttachmentDefinition, macvlan, SR-IOV, VLAN pour la télécommunication et les appliances réseau) et changement de CNI.
tags: [cni, kubernetes, flannel, weave net, multus, réseau, networkpolicy]
icon: info
---

Le **CNI** (*Container Network Interface*) attribue une adresse à chaque pod et assure la communication entre pods de nœuds différents ; il applique aussi (ou non) les **NetworkPolicy**. Le choix se fait à la création du cluster : en changer ensuite demande une migration.

| CNI | Mode | NetworkPolicy | Points forts | État |
| --- | --- | --- | --- | --- |
| **Cilium** | eBPF, overlay ou routage natif | Oui (+ L7, DNS) | Performances, remplacement de kube-proxy, observabilité Hubble, chiffrement WireGuard/IPsec | Très actif (CNCF diplômé) |
| **Calico** | Routage BGP, VXLAN, IPIP, eBPF | Oui (+ politiques globales) | BGP avec le réseau physique, maturité, nœuds Windows | Très actif |
| **Flannel** | Overlay VXLAN ou host-gw | **Non** (à combiner) | Simplicité (K3s par défaut) | Maintenu |
| Weave Net | Overlay maillé | Oui | Simplicité historique | **Archivé** (société fermée en 2024) |
| **Multus** | Méta-CNI | Selon CNI délégués | Plusieurs interfaces par pod | Actif |

## Flannel

```bash
kubectl apply -f https://github.com/flannel-io/flannel/releases/latest/download/kube-flannel.yml   # pod CIDR 10.244.0.0/16 par défaut
kubectl -n kube-flannel get pods
```

Backend `vxlan` (par défaut, fonctionne partout) ou `host-gw` (routes directes, nœuds sur le même segment L2). Sans politiques réseau : à éviter si l'isolation entre applications est requise (ou ajouter Calico en mode politique seule, « Canal »).

## Weave Net

Le projet n'est plus maintenu : planifier une migration vers [[03-calico|Calico]] ou [[02-cilium|Cilium]] (nouveau cluster et bascule des charges, ou migration nœud par nœud selon la documentation du CNI cible).

## Multus

**Multus** ajoute aux pods des **interfaces supplémentaires** (macvlan, ipvlan, SR-IOV, VLAN) en plus du réseau du cluster : routeurs et pare-feu virtuels, sondes, applications de télécommunication, VM [[28-kubevirt/01-presentation-installation|KubeVirt]] reliées à des VLAN.

```yaml
apiVersion: k8s.cni.cncf.io/v1
kind: NetworkAttachmentDefinition
metadata: { name: vlan30, namespace: sondes }
spec:
  config: '{ "cniVersion": "0.3.1", "type": "macvlan", "master": "ens224.30", "mode": "bridge",
             "ipam": { "type": "static" } }'
---
apiVersion: v1
kind: Pod
metadata:
  name: sonde-01
  namespace: sondes
  annotations: { k8s.v1.cni.cncf.io/networks: '[{"name":"vlan30","ips":["10.0.30.50/24"]}]' }
spec: { containers: [{ name: sonde, image: registry.corp.exemple.fr/outils/sonde:1.0 }] }
```

Suite : [[02-cilium|Cilium]] · [[03-calico|Calico]] · [[90-aide-memoire|aide-mémoire]].
