---
title: Kata Containers
description: Kata Containers — conteneurs exécutés dans des micro-VM légères (isolation matérielle par pod), hyperviseurs pris en charge (QEMU, Cloud Hypervisor, Firecracker, Dragonball), cas d'usage (multi-locataires, code non fiable, confidential computing), prérequis KVM, installation dans Kubernetes (kata-deploy, RuntimeClass), avec containerd seul (nerdctl, ctr), vérification et limites.
tags: [kata containers, micro-vm, isolation, kubernetes, runtimeclass, sandbox, sécurité]
icon: shield-check
---

**Kata Containers** (OpenInfra, Apache 2.0) lance chaque pod (ou conteneur) dans une **micro-VM** dédiée avec son propre noyau : l'interface reste celle d'un conteneur OCI, mais l'isolation est celle d'une machine virtuelle. Une faille du noyau dans le conteneur ne touche pas l'hôte.

| Hyperviseur | RuntimeClass | Remarque |
| --- | --- | --- |
| QEMU | `kata-qemu` | Le plus complet (passthrough, confidentiel) |
| Cloud Hypervisor | `kata-clh` | Rapide et léger, par défaut dans de nombreuses distributions |
| Firecracker | `kata-fc` | Démarrage très rapide, fonctionnalités limitées (stockage par périphérique bloc) |
| Dragonball | `kata-dragonball` | Hyperviseur intégré au runtime |

**Quand l'utiliser** : plateformes multi-locataires, exécution de code fourni par des tiers (CI, sandbox), charges sensibles (*confidential containers* avec AMD SEV-SNP / Intel TDX). Coût : quelques dizaines de Mo de mémoire et de millisecondes de démarrage par pod.

## Prérequis

```bash
grep -Ec '(vmx|svm)' /proc/cpuinfo       # virtualisation matérielle
ls -l /dev/kvm
# Dans une VM : virtualisation imbriquée activée sur l'hyperviseur
```

## Installation dans Kubernetes (kata-deploy)

**kata-deploy** est un DaemonSet qui installe les binaires de Kata sur chaque nœud et configure containerd ou CRI-O. Il est fourni par le dépôt `kata-containers` (chart Helm `kata-deploy` dans `tools/packaging/kata-deploy/helm-chart`) :

```bash
git clone --depth 1 https://github.com/kata-containers/kata-containers
helm install kata-deploy kata-containers/tools/packaging/kata-deploy/helm-chart/kata-deploy \
  --namespace kube-system --wait
kubectl get runtimeclass                  # kata-qemu, kata-clh, kata-fc…
kubectl -n kube-system get pods -l name=kata-deploy
```

Pod isolé :

```yaml pod-kata.yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-kata
spec:
  runtimeClassName: kata-clh
  containers:
    - name: nginx
      image: nginx:stable
```

```bash
kubectl apply -f pod-kata.yaml
kubectl exec test-kata -- uname -r       # noyau de la micro-VM, différent de celui du nœud
```

## Avec containerd seul

```bash
# Archive statique de la dernière version (kata-static-<version>-amd64.tar.zst) depuis les Releases GitHub
sudo tar --zstd -xvf kata-static-*-amd64.tar.zst -C /
sudo ln -sf /opt/kata/bin/containerd-shim-kata-v2 /usr/local/bin/
/opt/kata/bin/kata-runtime check           # vérifie l'hôte
sudo nerdctl run --rm --runtime io.containerd.kata.v2 alpine uname -r
```

## Limites

- Pas de partage du réseau de l'hôte (`hostNetwork`) ni de certains montages privilégiés.
- Performances d'E/S légèrement inférieures (virtio-fs pour les volumes).
- Nécessite `/dev/kvm` sur chaque nœud : impossible sur la plupart des VM cloud sans virtualisation imbriquée.

Commandes : [[90-aide-memoire|aide-mémoire]].
