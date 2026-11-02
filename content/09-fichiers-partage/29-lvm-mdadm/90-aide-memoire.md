---
title: LVM2 et mdadm — aide-mémoire des commandes
description: Commandes LVM (pvs, pvdisplay, pvcreate, pvresize, pvmove, pvremove, vgs, vgdisplay, vgcreate, vgextend, vgreduce, vgchange -ay, vgcfgbackup, vgcfgrestore, vgimportclone, lvs, lvcreate, lvextend -r, lvreduce, lvremove, lvconvert, lvrename) et mdadm (--create, --detail, --examine, --assemble, --scan, --fail, --remove, --add, --grow, --stop, --zero-superblock, /proc/mdstat) avec exemples.
tags: [aide-mémoire, lvm, mdadm, raid]
icon: terminal
---

Explications : [[01-lvm2|LVM2]] · [[02-mdadm|mdadm]].

## LVM

```bash
pvs ; vgs ; lvs -a -o +devices,data_percent ; pvdisplay /dev/sdb ; vgdisplay vg_data ; lvdisplay vg_data/lv_donnees
pvcreate /dev/sdd ; pvresize /dev/sdb ; pvmove /dev/sdb /dev/sdd ; pvremove /dev/sdb
vgcreate vg_app /dev/sde ; vgextend vg_data /dev/sdd ; vgreduce vg_data /dev/sdb ; vgchange -ay ; vgrename vg_old vg_new
lvcreate -n lv_x -L 50G vg_data ; lvextend -r -L +20G vg_data/lv_x ; lvreduce -r -L 30G vg_data/lv_ext4 ; lvrename vg_data lv_x lv_y ; lvremove vg_data/lv_y
lvcreate -s -n snap -L 10G vg_data/lv_x ; lvconvert --merge vg_data/snap
vgcfgbackup ; vgcfgrestore --list vg_data ; vgcfgrestore -f /etc/lvm/archive/vg_data_00012-*.vg vg_data
vgimportclone --basevgname vg_clone /dev/sdf      # importer un disque cloné (UUID en double)
```

## mdadm

```bash
cat /proc/mdstat ; mdadm --detail /dev/md0 ; mdadm --examine /dev/sdb ; mdadm --detail --scan
mdadm --assemble --scan ; mdadm --assemble /dev/md0 /dev/sd[b-g] ; mdadm --assemble --run --force /dev/md0 /dev/sd[b-f]   # dégradé
mdadm /dev/md0 --fail /dev/sdd --remove /dev/sdd ; mdadm /dev/md0 --add /dev/sdh ; mdadm /dev/md0 --add-spare /dev/sdi
mdadm --grow /dev/md0 --raid-devices=7 ; mdadm --grow /dev/md0 --bitmap=internal
echo check > /sys/block/md0/md/sync_action ; cat /sys/block/md0/md/mismatch_cnt
mdadm --stop /dev/md0 ; mdadm --zero-superblock /dev/sdb
```
