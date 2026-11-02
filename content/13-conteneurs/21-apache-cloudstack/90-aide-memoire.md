---
title: Apache CloudStack — aide-mémoire des commandes
description: Commandes Apache CloudStack avec exemples — services (cloudstack-management, cloudstack-agent, cloudstack-usage), installation (cloudstack-setup-databases, cloudstack-setup-management, cloud-install-sys-tmplt), journaux, CloudMonkey cmk (configuration, list, deploy, stop, start, destroy, maintenance d'hôte, clés d'API) et sauvegarde de la base.
tags: [aide-mémoire, cloudstack, cloudmonkey, cmk]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|Apache CloudStack]].

## Services et installation

```bash
systemctl status cloudstack-management cloudstack-usage
systemctl status cloudstack-agent                       # sur les hôtes KVM
cloudstack-setup-databases cloud:'MotDePasse'@localhost --deploy-as=root:'RootMySQL'
cloudstack-setup-management
/usr/share/cloudstack-common/scripts/storage/secondary/cloud-install-sys-tmplt -m /mnt/secondaire -f systemvm.qcow2.bz2 -h kvm -F
```

## Journaux

```bash
tail -f /var/log/cloudstack/management/management-server.log
tail -f /var/log/cloudstack/agent/agent.log
grep -i error /var/log/cloudstack/management/management-server.log | tail
```

## CloudMonkey (cmk)

```bash
cmk set url http://cloud-mgmt.corp.exemple.fr:8080/client/api
cmk set apikey <clé> ; cmk set secretkey <secret> ; cmk set output table
cmk sync
cmk list zones filter=name,id,allocationstate
cmk list hosts type=Routing filter=name,state,resourcestate
cmk list serviceofferings filter=name,id,cpunumber,memory
cmk list templates templatefilter=executable filter=name,id
cmk list virtualmachines listall=true filter=name,state,ipaddress
cmk deploy virtualmachine zoneid=<zone> serviceofferingid=<offre> templateid=<modèle> name=srv-web-02 networkids=<réseau>
cmk stop virtualmachine id=<id> ; cmk start virtualmachine id=<id>
cmk destroy virtualmachine id=<id> expunge=true
cmk prepare hostformaintenance id=<hôte> ; cmk cancel hostmaintenance id=<hôte>
cmk list systemvms filter=name,systemvmtype,state
cmk register userkeys id=<utilisateur>
```

## Sauvegarde

```bash
mysqldump -u root -p --databases cloud cloud_usage > cloudstack-$(date +%F).sql
cp -a /etc/cloudstack /sauvegardes/etc-cloudstack-$(date +%F)
```
