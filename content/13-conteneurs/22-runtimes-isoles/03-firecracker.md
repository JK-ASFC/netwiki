---
title: Firecracker
description: Firecracker — moniteur de micro-VM d'AWS (Lambda, Fargate) écrit en Rust, principe (KVM, virtio minimal, API REST sur socket Unix, jailer), cas d'usage, installation du binaire, noyau et système de fichiers racine, démarrage d'une micro-VM par l'API (curl) ou fichier de configuration, réseau par interface tap, instantanés, intégrations (Kata, firecracker-containerd, OpenNebula) et limites.
tags: [firecracker, microvm, kvm, aws, rust, sandbox, serverless]
icon: zap
---

**Firecracker** (AWS, Apache 2.0) est un moniteur de **micro-VM** : des machines virtuelles minimalistes (virtio réseau et bloc, port série, pas de BIOS ni de périphériques émulés) qui démarrent en environ 125 ms avec quelques Mo de surcharge. Il propulse **AWS Lambda** et **Fargate**. Linux uniquement, avec **KVM**.

Cas d'usage : exécution de fonctions (serverless), bacs à sable de code non fiable, CI éphémères, très forte densité de VM isolées. Pour des VM classiques, préférez [[14-kvm-qemu-libvirt/01-presentation-installation|KVM/QEMU]].

## Installation

```bash
ARCH=$(uname -m)
VERSION=$(curl -fsSLI -o /dev/null -w '%{url_effective}' https://github.com/firecracker-microvm/firecracker/releases/latest | sed 's#.*/##')
curl -fsSL "https://github.com/firecracker-microvm/firecracker/releases/download/${VERSION}/firecracker-${VERSION}-${ARCH}.tgz" | tar -xz
sudo install release-${VERSION}-${ARCH}/firecracker-${VERSION}-${ARCH} /usr/local/bin/firecracker
sudo install release-${VERSION}-${ARCH}/jailer-${VERSION}-${ARCH} /usr/local/bin/jailer
sudo setfacl -m u:${USER}:rw /dev/kvm      # accès à KVM pour l'utilisateur
firecracker --version
```

Il faut aussi un **noyau** non compressé (`vmlinux`) et une **image racine** ext4 (images de démonstration fournies dans la documentation du projet, ou construites avec `debootstrap`).

## Démarrer une micro-VM par l'API

```bash
rm -f /tmp/fc.sock && firecracker --api-sock /tmp/fc.sock &
API="curl -s --unix-socket /tmp/fc.sock -X PUT -H Content-Type:application/json"
$API http://localhost/boot-source -d '{"kernel_image_path":"./vmlinux","boot_args":"console=ttyS0 reboot=k panic=1 pci=off"}'
$API http://localhost/drives/rootfs -d '{"drive_id":"rootfs","path_on_host":"./rootfs.ext4","is_root_device":true,"is_read_only":false}'
$API http://localhost/machine-config -d '{"vcpu_count":2,"mem_size_mib":512}'
# Réseau : interface tap sur l'hôte
sudo ip tuntap add tap0 mode tap && sudo ip addr add 172.16.0.1/30 dev tap0 && sudo ip link set tap0 up
$API http://localhost/network-interfaces/eth0 -d '{"iface_id":"eth0","host_dev_name":"tap0","guest_mac":"06:00:AC:10:00:02"}'
$API http://localhost/actions -d '{"action_type":"InstanceStart"}'
```

Ou en une fois avec un fichier JSON : `firecracker --api-sock /tmp/fc.sock --config-file vm.json`.

## Production

- **jailer** : lance Firecracker dans un chroot, des espaces de noms et un cgroup dédiés, sous un utilisateur non privilégié — à utiliser systématiquement.
- **Instantanés** : `PUT /snapshot/create` puis restauration quasi instantanée (pré-chauffage de micro-VM).
- **Limitation de débit** par disque et carte réseau (*rate limiters*).
- Orchestrateurs : [[02-kata-containers|Kata Containers]] (RuntimeClass `kata-fc`), *firecracker-containerd*, [[20-opennebula/01-presentation-installation|OpenNebula]], Fly.io, Weave Ignite (archivé).

## Limites

Pas de GPU ni de passthrough PCI, pas de migration à chaud, invités Linux uniquement (noyaux configurés pour Firecracker), pas d'interface graphique : c'est une brique pour plateformes, pas un hyperviseur d'administration.
