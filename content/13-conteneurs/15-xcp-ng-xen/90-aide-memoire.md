---
title: XCP-ng et Xen — aide-mémoire des commandes
description: Commandes XCP-ng et Xen avec exemples — xe (hôtes, pool, VM, instantanés, export/import, migration, SR, PBD, réseaux, VLAN, agrégats, HA), xsconsole, xe-toolstack-restart, journaux, et Xen sur Debian avec xl (list, create, shutdown, console, mem-set, vcpu-set, migrate) et xen-tools.
tags: [aide-mémoire, xcp-ng, xen, xe, xl, xen orchestra]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|XCP-ng et Xen]] et [[02-pool-stockage-reseau-sauvegarde|pools et stockage]]. Astuce : `xe` complète les commandes et paramètres avec Tab ; `--minimal` renvoie seulement les UUID.

## Hôtes et pool

```bash
xe host-list params=uuid,name-label,address,enabled
xe host-param-list uuid=<uuid> | less
xe pool-list params=uuid,name-label,master
xe pool-join master-address=xcp-01.corp.exemple.fr master-username=root master-password='…'
xe pool-eject host-uuid=<uuid>
xe host-disable host=xcp-02 && xe host-evacuate host=xcp-02     # maintenance
xe host-enable host=xcp-02
xe-toolstack-restart                                              # redémarre XAPI, pas les VM
xsconsole                                                         # console texte de l'hôte
```

## Machines virtuelles

```bash
xe vm-list is-control-domain=false params=uuid,name-label,power-state
xe vm-start vm=srv-web-01
xe vm-shutdown vm=srv-web-01                 # propre (outils invités)
xe vm-shutdown vm=srv-web-01 force=true      # brutal
xe vm-reboot vm=srv-web-01
xe vm-param-set uuid=<uuid> name-label=srv-web-02
xe vm-param-set uuid=<uuid> VCPUs-max=4 && xe vm-param-set uuid=<uuid> VCPUs-at-startup=4   # VM arrêtée
xe vm-memory-limits-set vm=srv-web-01 static-min=4GiB dynamic-min=4GiB dynamic-max=8GiB static-max=8GiB
xe vm-param-set uuid=<uuid> other-config:auto_poweron=true
xe vm-copy vm=srv-modele new-name-label=srv-app-03 sr-uuid=<sr>
xe vm-uninstall vm=srv-test force=true       # supprime la VM et ses disques
```

## Instantanés, export, migration

```bash
xe vm-snapshot vm=srv-web-01 new-name-label=avant-maj
xe snapshot-list params=uuid,name-label,snapshot-of
xe snapshot-revert snapshot-uuid=<uuid>
xe snapshot-uninstall snapshot-uuid=<uuid> force=true
xe vm-export vm=srv-web-01 filename=/mnt/sauvegarde/srv-web-01.xva compress=zstd
xe vm-import filename=/mnt/sauvegarde/srv-web-01.xva sr-uuid=<sr>
xe vm-migrate vm=srv-web-01 host=xcp-02 live=true
```

## Stockage

```bash
xe sr-list params=uuid,name-label,type,physical-size,physical-utilisation
xe sr-create name-label="NFS-VM" shared=true type=nfs content-type=user device-config:server=nas-01 device-config:serverpath=/export/xcp
xe sr-scan uuid=<uuid>
xe pbd-list sr-uuid=<uuid> params=uuid,host-name-label,currently-attached
xe pbd-plug uuid=<uuid-pbd>
xe vdi-list sr-uuid=<uuid> params=uuid,name-label,virtual-size
xe vdi-resize uuid=<uuid-vdi> disk-size=60GiB
xe vm-disk-list vm=srv-web-01
```

## Réseau

```bash
xe pif-list params=uuid,device,host-name-label,VLAN,IP
xe network-list params=uuid,name-label,bridge
xe network-create name-label="VM-VLAN30"
xe vlan-create network-uuid=<réseau> pif-uuid=<pif> vlan=30
xe bond-create network-uuid=<réseau> pif-uuids=<pif1>,<pif2> mode=lacp
xe vif-list vm-name-label=srv-web-01
xe pif-reconfigure-ip uuid=<pif> mode=static IP=10.0.20.31 netmask=255.255.255.0 gateway=10.0.20.1 DNS=10.0.10.53
```

## Haute disponibilité

```bash
xe pool-ha-enable heartbeat-sr-uuids=<sr-partagé>
xe pool-ha-disable
xe vm-param-set uuid=<uuid> ha-restart-priority=restart order=1
xe pool-param-list uuid=<pool> | grep ha-
```

## Mises à jour et journaux

```bash
yum update -y && reboot                # hôte par hôte, maître en premier
tail -f /var/log/xensource.log         # XAPI
tail -f /var/log/SMlog                 # stockage
xl dmesg | tail                        # hyperviseur
```

## Xen sur Debian (xl)

```bash
xl info
xl list
xl create /etc/xen/srv-test-01.cfg
xl shutdown srv-test-01
xl destroy srv-test-01
xl console srv-test-01                 # Ctrl+] pour quitter
xl mem-set srv-test-01 2048m
xl vcpu-set srv-test-01 2
xl migrate srv-test-01 xen-02.corp.exemple.fr
xen-create-image --hostname=srv-test-02 --dist=bookworm --memory=1024M --lvm=vg0 --size=20G --dhcp --pygrub
xen-delete-image srv-test-02 --lvm=vg0
```
