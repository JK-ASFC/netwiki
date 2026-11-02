---
title: CRI-O, Kata et Firecracker — aide-mémoire des commandes
description: Commandes avec exemples — crictl (pods, conteneurs, images, journaux, inspection, stats), service CRI-O, configuration effective, RuntimeClass Kubernetes et pods Kata, kata-runtime (check, env), nerdctl avec Kata, Firecracker (API sur socket Unix, démarrage, arrêt, instantané) et jailer.
tags: [aide-mémoire, crictl, cri-o, kata, firecracker]
icon: terminal
---

Référence rapide ; explications : [[01-cri-o|CRI-O]], [[02-kata-containers|Kata Containers]], [[03-firecracker|Firecracker]].

## crictl (CRI-O ou containerd)

```bash
sudo crictl --runtime-endpoint unix:///var/run/crio/crio.sock version
echo 'runtime-endpoint: unix:///var/run/crio/crio.sock' | sudo tee /etc/crictl.yaml
sudo crictl pods
sudo crictl ps -a
sudo crictl images
sudo crictl pull docker.io/library/nginx:stable
sudo crictl logs -f <id-conteneur>
sudo crictl exec -it <id-conteneur> sh
sudo crictl inspect <id-conteneur> | less
sudo crictl stats
sudo crictl rmi --prune                    # images inutilisées
```

## CRI-O

```bash
systemctl status crio
journalctl -u crio -f
crio config | less                         # configuration effective
crio --version
ls /etc/crio/crio.conf.d/
```

## Kata Containers

```bash
kubectl get runtimeclass
kubectl run test-kata --image=nginx:stable --overrides='{"spec":{"runtimeClassName":"kata-clh"}}'
kubectl exec test-kata -- uname -r
/opt/kata/bin/kata-runtime check
/opt/kata/bin/kata-runtime env
sudo nerdctl run --rm --runtime io.containerd.kata.v2 alpine uname -r
```

## Firecracker

```bash
firecracker --version
firecracker --api-sock /tmp/fc.sock --config-file vm.json
curl -s --unix-socket /tmp/fc.sock http://localhost/machine-config
curl -s --unix-socket /tmp/fc.sock -X PUT http://localhost/actions -d '{"action_type":"SendCtrlAltDel"}'
curl -s --unix-socket /tmp/fc.sock -X PATCH http://localhost/vm -d '{"state":"Paused"}'
curl -s --unix-socket /tmp/fc.sock -X PUT http://localhost/snapshot/create \
  -d '{"snapshot_type":"Full","snapshot_path":"./vm.snap","mem_file_path":"./vm.mem"}'
sudo jailer --id vm01 --exec-file /usr/local/bin/firecracker --uid 10001 --gid 10001 -- --api-sock /run/firecracker.socket
```
