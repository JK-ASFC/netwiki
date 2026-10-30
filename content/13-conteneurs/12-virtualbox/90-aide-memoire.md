---
title: VirtualBox — aide-mémoire des commandes VBoxManage
description: Commandes VBoxManage avec exemples — lister et créer des machines (createvm, modifyvm), disques (createmedium, storagectl, storageattach), réseau (NAT et redirections de ports, accès par pont, réseau hôte, réseau NAT), démarrage sans interface (headless), contrôle (controlvm), instantanés, clonage, export/import OVA, dossiers partagés, Guest Additions (guestcontrol, guestproperty), pack d'extension.
tags: [aide-mémoire, virtualbox, vboxmanage, machines virtuelles, ova, laboratoire]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-utilisation|VirtualBox]]. Sous Windows, `VBoxManage.exe` est dans `C:\Program Files\Oracle\VirtualBox`.

## Lister et créer

```bash
VBoxManage list vms
VBoxManage list runningvms
VBoxManage list ostypes | grep -i debian
VBoxManage createvm --name "labo-debian" --ostype Debian_64 --register
VBoxManage modifyvm "labo-debian" --memory 4096 --cpus 2 --firmware efi --nic1 nat --graphicscontroller vmsvga --vram 32
VBoxManage createmedium disk --filename ~/VirtualBox\ VMs/labo-debian/labo-debian.vdi --size 40960
VBoxManage storagectl "labo-debian" --name "SATA" --add sata --controller IntelAhci
VBoxManage storageattach "labo-debian" --storagectl "SATA" --port 0 --device 0 --type hdd --medium ~/VirtualBox\ VMs/labo-debian/labo-debian.vdi
VBoxManage storageattach "labo-debian" --storagectl "SATA" --port 1 --device 0 --type dvddrive --medium ~/ISO/debian-12.iso
VBoxManage showvminfo "labo-debian" | head -40
```

## Démarrer et contrôler

```bash
VBoxManage startvm "labo-debian" --type headless
VBoxManage controlvm "labo-debian" acpipowerbutton      # arrêt propre
VBoxManage controlvm "labo-debian" poweroff
VBoxManage controlvm "labo-debian" savestate
VBoxManage controlvm "labo-debian" pause
VBoxManage controlvm "labo-debian" resume
```

## Réseau

```bash
VBoxManage modifyvm "labo-debian" --natpf1 "ssh,tcp,,2222,,22"          # redirection hôte:2222 → invité:22
VBoxManage modifyvm "labo-debian" --nic2 bridged --bridgeadapter2 eth0
VBoxManage hostonlyif create && VBoxManage hostonlyif ipconfig vboxnet0 --ip 192.168.56.1
VBoxManage modifyvm "labo-debian" --nic3 hostonly --hostonlyadapter3 vboxnet0
VBoxManage natnetwork add --netname labo-nat --network 10.10.10.0/24 --enable --dhcp on
VBoxManage modifyvm "labo-debian" --nic4 natnetwork --nat-network4 labo-nat
```

## Instantanés, clones, OVA

```bash
VBoxManage snapshot "labo-debian" take "propre" --description "Après installation"
VBoxManage snapshot "labo-debian" list
VBoxManage snapshot "labo-debian" restore "propre"
VBoxManage clonevm "labo-debian" --name "labo-debian-2" --register --mode machine
VBoxManage clonevm "labo-debian" --snapshot "propre" --options link --name "labo-lie" --register     # clone lié
VBoxManage export "labo-debian" -o labo-debian.ova
VBoxManage import labo-debian.ova --vsys 0 --vmname "labo-importe"
VBoxManage unregistervm "labo-debian-2" --delete
```

## Invité (Guest Additions)

```bash
VBoxManage sharedfolder add "labo-debian" --name partage --hostpath ~/partage --automount
VBoxManage guestproperty enumerate "labo-debian" | grep -i net
VBoxManage guestcontrol "labo-debian" run --username admin --password "$MDP" --exe /usr/bin/uptime
VBoxManage guestcontrol "labo-debian" copyto --username admin --password "$MDP" ./script.sh --target-directory /tmp/
```

## Pack d'extension et version

```bash
VBoxManage --version
VBoxManage list extpacks
sudo VBoxManage extpack install --replace Oracle_VirtualBox_Extension_Pack-7.1.4.vbox-extpack    # licence PUEL : usage personnel/éducatif gratuit
```
