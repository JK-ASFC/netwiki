---
title: KVM, QEMU et libvirt — aide-mémoire des commandes
description: Commandes KVM/QEMU/libvirt avec exemples — vérification de l'hôte (virt-host-validate), virsh (list, start, shutdown, destroy, autostart, edit, dumpxml, define, undefine, console, domifaddr), virt-install, ressources (setmem, setvcpus), disques (attach-disk, blockresize), réseaux (net-*), stockage (pool-*, vol-*), instantanés, migration, qemu-img (create, info, convert, resize, check), libguestfs (virt-customize, guestmount) et QEMU direct.
tags: [aide-mémoire, kvm, qemu, libvirt, virsh, qemu-img, virt-install]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|KVM, QEMU et libvirt]] et [[02-libvirt-reseau-stockage|réseaux et stockage]].

## Hôte

```bash
virt-host-validate qemu
grep -Ec '(vmx|svm)' /proc/cpuinfo
virsh nodeinfo
virsh capabilities | less
virsh domcapabilities | grep -A5 '<mode name="host-model"'
osinfo-query os | grep -i -e debian -e win
```

## Machines (virsh)

```bash
virsh list --all
virsh start srv-web-01
virsh shutdown srv-web-01                 # arrêt propre (ACPI ou agent invité)
virsh reboot srv-web-01
virsh destroy srv-web-01                  # coupure brutale (« débrancher la prise »)
virsh suspend srv-web-01 && virsh resume srv-web-01
virsh autostart srv-web-01                # --disable pour annuler
virsh dominfo srv-web-01
virsh domifaddr srv-web-01 --source agent # adresses IP vues par l'agent invité
virsh console srv-web-01                  # console série (Ctrl+] pour quitter)
virsh edit srv-web-01                     # modifier le XML (appliqué au prochain démarrage)
virsh dumpxml srv-web-01 > srv-web-01.xml
virsh define srv-web-01.xml
virsh undefine srv-web-01 --nvram --remove-all-storage   # supprime la VM ET ses disques
```

## Ressources et disques

```bash
virsh setmem srv-web-01 8G --config
virsh setvcpus srv-web-01 4 --config
virsh domblklist srv-web-01
virsh attach-disk srv-web-01 /var/lib/libvirt/images/data.qcow2 vdb --driver qemu --subdriver qcow2 --persistent
virsh detach-disk srv-web-01 vdb --persistent
virsh blockresize srv-web-01 vda 60G      # à chaud, puis agrandir la partition dans l'invité
virsh attach-interface srv-web-01 bridge br30 --model virtio --persistent
virsh change-media srv-web-01 sda /iso/virtio-win.iso --insert
```

## Création (virt-install)

```bash
virt-install --name srv-app-02 --memory 2048 --vcpus 2 --import \
  --disk /var/lib/libvirt/images/srv-app-02.qcow2,bus=virtio --os-variant debian12 \
  --network bridge=br0,model=virtio --graphics none --noautoconsole \
  --cloud-init root-ssh-key=$HOME/.ssh/id_ed25519.pub
virt-clone --original srv-app-02 --name srv-app-03 --auto-clone
```

## Réseaux et stockage

```bash
virsh net-list --all
virsh net-dhcp-leases default
virsh net-start default && virsh net-autostart default
virsh pool-list --all
virsh pool-define-as images dir --target /srv/vm && virsh pool-build images && virsh pool-start images && virsh pool-autostart images
virsh vol-list images
virsh vol-create-as images srv-db-02.qcow2 80G --format qcow2
virsh vol-delete srv-db-02.qcow2 --pool images
```

## Instantanés et migration

```bash
virsh snapshot-create-as srv-web-01 avant-maj --atomic
virsh snapshot-list srv-web-01
virsh snapshot-revert srv-web-01 avant-maj
virsh snapshot-delete srv-web-01 avant-maj
virsh migrate --live --persistent --undefinesource srv-web-01 qemu+ssh://kvm-02/system
virsh domjobinfo srv-web-01               # progression d'une migration
```

## Images (qemu-img)

```bash
qemu-img create -f qcow2 disque.qcow2 40G
qemu-img create -f qcow2 -F qcow2 -b base.qcow2 derive.qcow2
qemu-img info --backing-chain derive.qcow2
qemu-img convert -p -f vmdk -O qcow2 serveur.vmdk serveur.qcow2
qemu-img convert -p -f qcow2 -O raw serveur.qcow2 serveur.raw
qemu-img resize disque.qcow2 +20G
qemu-img check -r all disque.qcow2
qemu-img snapshot -l disque.qcow2
```

## Modifier une image sans la démarrer (libguestfs)

```bash
sudo apt install libguestfs-tools            # dnf install guestfs-tools
virt-customize -a srv-app-03.qcow2 --hostname srv-app-03 --root-password password:'Chang3-M0i!' --install qemu-guest-agent
virt-sysprep -a modele.qcow2                 # retire clés SSH, journaux, identifiants machine
virt-df -a disque.qcow2 -h
guestmount -a disque.qcow2 -i --ro /mnt/vm && ls /mnt/vm/etc && guestunmount /mnt/vm
virt-cat -a disque.qcow2 /etc/fstab
```

## QEMU sans libvirt

```bash
qemu-system-x86_64 -enable-kvm -m 4096 -smp 2 -cpu host \
  -drive file=disque.qcow2,if=virtio -cdrom debian.iso -boot d \
  -nic user,model=virtio-net-pci,hostfwd=tcp::2222-:22 -display none -serial mon:stdio
# Moniteur QEMU (Ctrl+A puis C avec -serial mon:stdio) : info status, savevm, loadvm, system_powerdown, quit
```

## Journaux

```bash
tail -f /var/log/libvirt/qemu/srv-web-01.log
journalctl -u libvirtd -f            # RHEL 9 / Fedora : journalctl -u virtqemud -f
```
