---
title: NetBox et Nautobot — aide-mémoire des commandes
description: Commandes NetBox et Nautobot avec exemples — manage.py / nautobot-server (createsuperuser, migrate, collectstatic, nbshell, runjob), Docker Compose, sauvegarde PostgreSQL, API REST avec curl (préfixes, IP disponibles, équipements, VLAN), GraphQL, pynetbox, inventaire Ansible.
tags: [aide-mémoire, netbox, nautobot, api, ansible]
icon: terminal
---

Références : [[01-netbox|NetBox]], [[02-nautobot|Nautobot]].

## Administration

```bash
docker compose exec netbox /opt/netbox/netbox/manage.py createsuperuser
docker compose exec netbox /opt/netbox/netbox/manage.py nbshell          # console Python sur les modèles
sudo /opt/netbox/upgrade.sh                                              # installation manuelle : mise à jour
docker compose exec postgres pg_dump -U netbox netbox > netbox-$(date +%F).sql
docker compose exec nautobot nautobot-server createsuperuser
docker compose exec nautobot nautobot-server post_upgrade
docker compose exec nautobot nautobot-server runjob --username admin module.Job
```

## API REST

```bash
NB=https://netbox.corp.exemple.fr/api ; H="Authorization: Token $TOKEN"
curl -s -H "$H" "$NB/status/" | jq .
curl -s -H "$H" "$NB/ipam/prefixes/?prefix=10.0.20.0/24" | jq '.results[0] | {id, prefix, utilization: .utilization}'
curl -s -H "$H" "$NB/ipam/prefixes/42/available-ips/?limit=5" | jq '.[].address'
curl -s -X POST -H "$H" -H "Content-Type: application/json" "$NB/ipam/prefixes/42/available-ips/" -d '{"dns_name":"srv-web-06.corp.exemple.fr"}'
curl -s -H "$H" "$NB/ipam/vlans/?site=paris-dc1" | jq '.results[] | {vid, name}'
curl -s -H "$H" "$NB/dcim/devices/?role=core-switch" | jq '.results[].name'
curl -s -H "$H" -H "Content-Type: application/json" https://netbox.corp.exemple.fr/graphql/ -d '{"query":"{ device_list(site: \"paris-dc1\") { name primary_ip4 { address } } }"}'
```

## Python et Ansible

```bash
pip install pynetbox
python3 -c "import pynetbox; nb=pynetbox.api('https://netbox.corp.exemple.fr', token='$TOKEN'); print([d.name for d in nb.dcim.devices.filter(site='paris-dc1')])"
ansible-galaxy collection install netbox.netbox
ansible-inventory -i netbox_inventory.yml --graph       # plugin: netbox.netbox.nb_inventory
```
