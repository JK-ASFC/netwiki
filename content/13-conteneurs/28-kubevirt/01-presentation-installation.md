---
title: Présentation, installation et utilisation
description: KubeVirt (CNCF) — exécuter des machines virtuelles KVM dans Kubernetes à côté des conteneurs : cas d'usage (migration depuis VMware, applications non conteneurisables), architecture (virt-operator, virt-controller, virt-handler, virt-launcher), prérequis (virtualisation matérielle, CPU), installation par manifestes, Containerized Data Importer (CDI) pour importer des disques (URL, registre, téléversement), VirtualMachine et DataVolume, virtctl (start, stop, console, vnc, ssh, migrate), réseau (pod, Multus et bridge), migration à chaud, et distributions intégrées (OpenShift Virtualization, Harvester).
tags: [kubevirt, kubernetes, machines virtuelles, kvm, cdi, virtctl]
icon: info
---

**KubeVirt** ajoute à Kubernetes des ressources **VirtualMachine** : les VM sont des pods qui exécutent QEMU/KVM, gérés avec les mêmes outils (kubectl, GitOps, stockage CSI, réseau). Il sert à consolider VM et conteneurs sur une seule plate-forme ou à migrer des VM depuis VMware. Les distributions **OpenShift Virtualization** et **Harvester** (SUSE, avec interface) l'intègrent.

## Installation

```bash
export VERSION=$(curl -s https://storage.googleapis.com/kubevirt-prow/release/kubevirt/kubevirt/stable.txt)
kubectl apply -f https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/kubevirt-operator.yaml
kubectl apply -f https://github.com/kubevirt/kubevirt/releases/download/${VERSION}/kubevirt-cr.yaml
kubectl -n kubevirt wait kv kubevirt --for condition=Available --timeout=10m
# CDI : importer des images disque
export CDI=$(curl -s https://api.github.com/repos/kubevirt/containerized-data-importer/releases/latest | grep tag_name | cut -d '"' -f 4)
kubectl apply -f https://github.com/kubevirt/containerized-data-importer/releases/download/$CDI/cdi-operator.yaml
kubectl apply -f https://github.com/kubevirt/containerized-data-importer/releases/download/$CDI/cdi-cr.yaml
kubectl krew install virt     # virtctl comme greffon kubectl (ou binaire virtctl des versions)
```

Prérequis : virtualisation matérielle sur les nœuds (`/dev/kvm`) ; une classe de stockage avec mode `ReadWriteMany` (bloc) pour la migration à chaud.

## Une VM Debian

```yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata: { name: debian-test }
spec:
  runStrategy: Always
  dataVolumeTemplates:
    - metadata: { name: debian-test-disque }
      spec:
        storage: { resources: { requests: { storage: 20Gi } } }
        source: { http: { url: "https://cloud.debian.org/images/cloud/bookworm/latest/debian-12-genericcloud-amd64.qcow2" } }
  template:
    spec:
      domain:
        cpu: { cores: 2 }
        memory: { guest: 4Gi }
        devices:
          disks:
            - { name: disque, disk: { bus: virtio } }
            - { name: cloudinit, disk: { bus: virtio } }
      volumes:
        - { name: disque, dataVolume: { name: debian-test-disque } }
        - name: cloudinit
          cloudInitNoCloud:
            userData: |
              #cloud-config
              users: [{ name: admin, ssh_authorized_keys: ["ssh-ed25519 AAAA… jk"], sudo: "ALL=(ALL) NOPASSWD:ALL" }]
```

```bash
kubectl apply -f debian-test.yaml ; kubectl get vm,vmi
kubectl virt console debian-test ; kubectl virt ssh admin@vm/debian-test ; kubectl virt migrate debian-test
```

Commandes : [[90-aide-memoire|aide-mémoire]].
