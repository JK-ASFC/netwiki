---
title: OpenStack — aide-mémoire des commandes
description: Commandes OpenStack avec exemples — clouds.yaml et variables OS_*, catalogue et services, projets, utilisateurs, rôles, quotas, images, gabarits, réseaux, sous-réseaux, routeurs, IP flottantes, groupes de sécurité, ports, instances (create, list, show, resize, migrate, rebuild, console), volumes et instantanés, hyperviseurs et agents, Kolla-Ansible (deploy, reconfigure, upgrade, mariadb_backup).
tags: [aide-mémoire, openstack, openstackclient, kolla-ansible, nova, neutron]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|OpenStack]] et [[02-exploitation|exploitation]].

## Connexion

```yaml ~/.config/openstack/clouds.yaml
clouds:
  corp:
    auth:
      auth_url: https://cloud.corp.exemple.fr:5000/v3
      username: alice
      project_name: equipe-web
      user_domain_name: Default
      project_domain_name: Default
    region_name: RegionOne
    interface: public
    identity_api_version: 3
```

```bash
export OS_CLOUD=corp                       # ou : source admin-openrc.sh
openstack token issue
openstack catalog list
openstack service list ; openstack endpoint list
```

## Identité

```bash
openstack project list ; openstack project create equipe-db
openstack user list ; openstack user create bob --project equipe-db --password-prompt
openstack role add --project equipe-db --user bob member
openstack role assignment list --user bob --names
openstack quota show equipe-db ; openstack quota set equipe-db --instances 10
openstack application credential create script-sauvegarde
```

## Images et gabarits

```bash
openstack image list
openstack image create rocky-9 --disk-format qcow2 --container-format bare --file Rocky-9-GenericCloud.qcow2 --public
openstack image delete rocky-9
openstack flavor list
openstack flavor create m1.medium --vcpus 2 --ram 4096 --disk 40
```

## Réseau

```bash
openstack network list ; openstack subnet list
openstack network create interne
openstack subnet create interne-v4 --network interne --subnet-range 192.168.10.0/24
openstack router create routeur && openstack router set routeur --external-gateway public
openstack router add subnet routeur interne-v4
openstack floating ip create public
openstack floating ip list
openstack security group rule list default
openstack security group rule create default --protocol tcp --dst-port 22 --remote-ip 10.0.0.0/8
openstack port list --server srv-web-01
```

## Instances

```bash
openstack server list --all-projects
openstack server create srv-web-01 --image debian-13 --flavor m1.small --network interne --key-name admin --security-group web
openstack server create srv-web-02 --image debian-13 --flavor m1.small --network interne --user-data cloud-init.yaml
openstack server show srv-web-01
openstack server stop srv-web-01 ; openstack server start srv-web-01 ; openstack server reboot --hard srv-web-01
openstack server resize srv-web-01 --flavor m1.medium && openstack server resize confirm srv-web-01
openstack server rebuild srv-web-01 --image debian-13
openstack server migrate --live-migration srv-web-01
openstack server add floating ip srv-web-01 203.0.113.120
openstack console url show srv-web-01
openstack console log show srv-web-01 | tail
openstack server delete srv-web-01
```

## Volumes

```bash
openstack volume list
openstack volume create donnees --size 50
openstack server add volume srv-db-01 donnees
openstack server remove volume srv-db-01 donnees
openstack volume set donnees --size 100              # extension
openstack volume snapshot create donnees-snap --volume donnees --force
openstack volume backup create donnees --incremental
```

## Infrastructure (administrateur)

```bash
openstack hypervisor list ; openstack hypervisor show compute-01
openstack compute service list
openstack network agent list
openstack volume service list
openstack resource provider list
openstack host list
```

## Kolla-Ansible

```bash
kolla-ansible prechecks -i multinode
kolla-ansible deploy -i multinode
kolla-ansible reconfigure -i multinode --tags nova     # après modification de la configuration
kolla-ansible pull -i multinode && kolla-ansible upgrade -i multinode
kolla-ansible mariadb_backup -i multinode
kolla-ansible stop -i multinode --yes-i-really-really-mean-it
docker ps --format '{{.Names}}' | sort                  # conteneurs des services sur un nœud
tail -f /var/log/kolla/nova/nova-compute.log
```
