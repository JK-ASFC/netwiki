---
title: cloud-init et Ignition — aide-mémoire des commandes
description: Commandes cloud-init (status, schema, query, analyze show/blame, clean, single, devel net-convert, modules, journaux), cloud-localds pour créer une source NoCloud, qm cicustom et cloudinit dump sous Proxmox, VMware guestinfo, Butane, Ignition (ignition-validate, coreos-installer, journaux) avec exemples.
tags: [aide-mémoire, cloud-init, ignition, butane]
icon: terminal
---

Explications : [[01-presentation-utilisation|cloud-init et Ignition]].

```bash
cloud-init --version ; cloud-init status --long ; cloud-init query --all | head ; cloud-init query ds
cloud-init schema --system --annotate ; cloud-init analyze blame ; cloud-init analyze show | head
sudo cloud-init clean --logs --seed --machine-id ; sudo cloud-init single --name write_files --frequency always
cloud-localds -N network-config seed.iso user-data meta-data
qm set 9000 --ide2 local-lvm:cloudinit --ciuser admin --sshkeys cle.pub --ipconfig0 ip=10.0.20.33/24,gw=10.0.20.1 ; qm cloudinit dump 9000 user
govc vm.change -vm srv-web-03 -e guestinfo.userdata="$(base64 -w0 user-data)" -e guestinfo.userdata.encoding=base64
butane --strict serveur.bu > serveur.ign ; ignition-validate serveur.ign ; sudo coreos-installer install /dev/sda --ignition-url https://deploy/serveur.ign
journalctl -t ignition --no-pager | tail
```
