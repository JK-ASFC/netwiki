---
title: Packer et Vagrant — aide-mémoire des commandes
description: Commandes Packer (init, fmt, validate, build -only -var -var-file -on-error=ask -debug, inspect, console, plugins installed, hcl2_upgrade, PACKER_LOG) et Vagrant (init, up --provider, status, global-status, ssh, ssh-config, provision, reload --provision, halt, suspend, resume, destroy, snapshot, box add/list/update/prune/remove, plugin install/list, package, validate) avec exemples.
tags: [aide-mémoire, packer, vagrant]
icon: terminal
---

Explications : [[01-packer|Packer]] · [[02-vagrant|Vagrant]].

```bash
packer version ; packer init . ; packer fmt -recursive . ; packer validate . ; packer inspect .
packer build -only='proxmox-iso.ubuntu' -var 'pm_token=…' -var-file=prod.pkrvars.hcl -on-error=ask .
PACKER_LOG=1 PACKER_LOG_PATH=packer.log packer build . ; packer plugins installed ; packer console . ; packer hcl2_upgrade ancien.json
vagrant init bento/debian-12 ; vagrant up --provider=libvirt ; vagrant status ; vagrant global-status --prune ; vagrant ssh web1 ; vagrant ssh-config
vagrant provision ; vagrant reload --provision ; vagrant halt ; vagrant suspend ; vagrant resume ; vagrant destroy -f
vagrant snapshot save x ; vagrant snapshot list ; vagrant snapshot restore x
vagrant box add bento/ubuntu-24.04 ; vagrant box list ; vagrant box update ; vagrant box prune ; vagrant plugin install vagrant-libvirt ; vagrant plugin list
vagrant package --output modele.box ; vagrant validate
```
