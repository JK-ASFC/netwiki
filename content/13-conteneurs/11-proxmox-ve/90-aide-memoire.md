---
title: Proxmox VE — aide-mémoire des commandes
description: Commandes Proxmox VE avec exemples — machines virtuelles (qm : create, set, start, shutdown, clone, template, migrate, importdisk, agent, unlock), conteneurs LXC (pct : create, enter, exec, set, snapshot), stockage (pvesm), sauvegardes (vzdump, restauration qmrestore/pct restore), grappe (pvecm), haute disponibilité (ha-manager), réseau, mises à jour (pveversion, pveupgrade), Ceph (pveceph), API (pvesh) et dépannage.
tags: [aide-mémoire, proxmox, qm, pct, vzdump, pvecm, ceph]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Proxmox VE]].

## Machines virtuelles (qm)

```bash
qm list
qm create 120 --name srv-web01 --memory 4096 --cores 2 --cpu host --net0 virtio,bridge=vmbr0,tag=30 \
  --scsihw virtio-scsi-single --scsi0 local-lvm:40,discard=on,iothread=1 --ide2 local:iso/debian-12.iso,media=cdrom \
  --ostype l26 --agent enabled=1 --boot order=scsi0\;ide2
qm start 120
qm shutdown 120 --timeout 120
qm stop 120
qm reboot 120
qm config 120
qm set 120 --memory 8192 --balloon 4096
qm set 120 --onboot 1 --startup order=2,up=30
qm resize 120 scsi0 +20G
qm snapshot 120 avant-maj --description "Avant mise à jour"
qm listsnapshot 120
qm rollback 120 avant-maj
qm delsnapshot 120 avant-maj
qm clone 9000 121 --name srv-web02 --full
qm template 9000
qm migrate 120 pve2 --online
qm importdisk 130 debian-12-genericcloud-amd64.qcow2 local-lvm     # (qm disk import selon version)
qm agent 120 network-get-interfaces
qm guest exec 120 -- systemctl restart nginx
qm unlock 120
qm destroy 120 --purge
```

## Conteneurs LXC (pct)

```bash
pveam update && pveam available --section system | grep debian
pveam download local debian-12-standard_12.7-1_amd64.tar.zst
pct create 200 local:vztmpl/debian-12-standard_12.7-1_amd64.tar.zst --hostname ct-dns --cores 1 --memory 512 \
  --net0 name=eth0,bridge=vmbr0,ip=10.0.10.53/24,gw=10.0.10.1 --rootfs local-lvm:8 --unprivileged 1 --features nesting=1 --password
pct start 200
pct enter 200
pct exec 200 -- apt update
pct set 200 --memory 1024
pct snapshot 200 avant-maj
pct list
pct stop 200 && pct destroy 200
```

## Stockage et sauvegardes

```bash
pvesm status
pvesm list local-lvm
pvesm add nfs nas-sauvegardes --server 10.0.40.5 --export /volume1/proxmox --content backup
vzdump 120 --storage nas-sauvegardes --mode snapshot --compress zstd --notes-template "{{guestname}}"
vzdump --all --storage pbs-paris --mode snapshot
qmrestore /mnt/pve/nas-sauvegardes/dump/vzdump-qemu-120-2026_10_29-02_00_00.vma.zst 125 --storage local-lvm
pct restore 205 /mnt/pve/nas-sauvegardes/dump/vzdump-lxc-200-2026_10_29-02_30_00.tar.zst --storage local-lvm
```

## Grappe et haute disponibilité

```bash
pvecm create grappe-paris                 # sur le premier nœud
pvecm add 10.0.99.11                      # sur un nouveau nœud
pvecm status
pvecm nodes
pvecm expected 1                          # dernier recours si le quorum est perdu (nœud isolé)
ha-manager add vm:120 --state started --group paris --max_restart 2
ha-manager status
ha-manager set vm:120 --state disabled
ha-manager crm-command node-maintenance enable pve2       # versions récentes
```

## Mises à jour, réseau, Ceph

```bash
pveversion -v | head
apt update && pveupgrade                 # ou apt full-upgrade
cat /etc/network/interfaces
ifreload -a                              # appliquer la configuration réseau (ifupdown2)
pveceph status
ceph -s
ceph osd tree
ceph health detail
```

## API et dépannage

```bash
pvesh get /nodes --output-format json-pretty
pvesh get /cluster/resources --type vm --output-format json | jq '.[] | {vmid, name, status, node}'
pvesh create /nodes/pve1/qemu/120/status/start
journalctl -u pve-cluster -u corosync -u pvedaemon -f
pvereport > /tmp/rapport-proxmox.txt
```
