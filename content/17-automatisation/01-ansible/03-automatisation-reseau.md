---
title: Automatisation des équipements réseau
description: Automatiser routeurs, commutateurs et pare-feu avec Ansible — connexions network_cli, netconf et httpapi, collections constructeurs (Cisco IOS/NX-OS, Arista EOS, Junos, FortiOS, PAN-OS), collecte de faits et sauvegarde des configurations, modules de ressources (VLAN, interfaces, BGP) avec états merged/replaced/overridden, modèles de configuration, contrôles et déploiement par lots, inventaire NetBox.
tags: [ansible, réseau, cisco, arista, junos, fortios, network_cli, netbox, sauvegarde]
icon: network
---

## Connexions

| `ansible_connection` | Usage |
| --- | --- |
| `ansible.netcommon.network_cli` | SSH vers la CLI (Cisco IOS/NX-OS, Arista EOS, HPE/Aruba, MikroTik…) |
| `ansible.netcommon.netconf` | NETCONF (Junos, IOS XR, IOS XE) |
| `ansible.netcommon.httpapi` | API HTTPS (Arista eAPI, NX-API, FortiOS, Palo Alto) |
| `local` | Modules qui appellent eux-mêmes une API (anciens modules, NetBox) |

```yaml group_vars/eos.yml
ansible_connection: ansible.netcommon.httpapi
ansible_network_os: arista.eos.eos
ansible_httpapi_use_ssl: true
ansible_httpapi_validate_certs: true
ansible_user: ansible
ansible_password: "{{ vault_eos_password }}"
ansible_become: true
ansible_become_method: enable
```

## Sauvegarde des configurations

```yaml playbooks/sauvegarde-reseau.yml
- name: Sauvegarde des configurations
  hosts: ios
  gather_facts: false
  tasks:
    - name: Sauvegarder la configuration courante
      cisco.ios.ios_config:
        backup: true
        backup_options:
          dir_path: "{{ playbook_dir }}/../sauvegardes"
          filename: "{{ inventory_hostname }}.cfg"
```

Versionner le répertoire `sauvegardes/` dans Git donne un **historique des changements** de chaque équipement (`git log -p sauvegardes/r1-paris.cfg`). Oxidized fait de même de façon autonome.

## Faits et commandes

```yaml
- name: Inventaire matériel et logiciel
  hosts: ios
  gather_facts: false
  tasks:
    - cisco.ios.ios_facts:
        gather_subset: [ hardware, interfaces ]
    - ansible.builtin.debug:
        msg: "{{ inventory_hostname }} : {{ ansible_net_model }} — {{ ansible_net_version }}"
    - name: Vérifier les voisins BGP
      cisco.ios.ios_command:
        commands: [ "show ip bgp summary" ]
      register: bgp
    - ansible.builtin.assert:
        that: "'Idle' not in bgp.stdout[0]"
        fail_msg: "Session BGP inactive sur {{ inventory_hostname }}"
```

## Modules de ressources

Les modules de ressources décrivent un **état structuré** (VLAN, interfaces, LAG, OSPF, BGP, ACL) indépendamment de la syntaxe CLI :

```yaml playbooks/vlans.yml
- name: VLAN normalisés sur les commutateurs d'accès
  hosts: ios_acces
  gather_facts: false
  tasks:
    - name: VLAN
      cisco.ios.ios_vlans:
        config:
          - { vlan_id: 10, name: UTILISATEURS }
          - { vlan_id: 20, name: TELEPHONIE }
          - { vlan_id: 99, name: ADMINISTRATION }
        state: merged

    - name: Ports d'accès
      cisco.ios.ios_l2_interfaces:
        config:
          - name: GigabitEthernet1/0/5
            mode: access
            access: { vlan: 10 }
            voice: { vlan: 20 }
        state: replaced
```

| `state` | Effet |
| --- | --- |
| `merged` | Ajoute/modifie ce qui est décrit, ne supprime rien |
| `replaced` | Remplace la configuration **des éléments décrits** |
| `overridden` | Remplace **toute** la configuration de cette ressource (supprime ce qui n'est pas décrit) |
| `deleted` | Supprime |
| `gathered` / `rendered` / `parsed` | Lire l'état actuel / générer la CLI sans se connecter / analyser une sortie |

> [!WARNING]
> `overridden` est puissant et dangereux : un VLAN ou une interface oubliés dans les variables seront **supprimés**. Testez avec `--check --diff` et sur un équipement de laboratoire.

## Configurations générées par modèle

```yaml
- name: Configuration complète générée
  hosts: ios
  gather_facts: false
  tasks:
    - name: Appliquer le modèle
      cisco.ios.ios_config:
        src: "templates/{{ role_equipement }}.cfg.j2"
        save_when: modified
        diff_against: running
```

Avec `--check --diff`, Ansible montre les lignes qui seraient ajoutées ou retirées : base d'une **revue** de changement réseau par demande de fusion (voir [[01-git/02-branches-workflows|Git]]).

## Déploiement prudent

```yaml
- hosts: ios_acces
  serial: 5                     # 5 équipements à la fois
  max_fail_percentage: 0        # arrêter au premier échec
```

Vérifiez l'état après chaque lot (assertions sur `show` commands, ping des passerelles), et prévoyez un retour arrière (`configure replace` / `rollback` selon les constructeurs).

## Inventaire NetBox

```yaml inventaires/netbox.yml
plugin: netbox.netbox.nb_inventory
api_endpoint: https://netbox.corp.exemple.fr
token: "{{ lookup('env', 'NETBOX_TOKEN') }}"
validate_certs: true
group_by: [ device_roles, sites, platforms ]
query_filters:
  - status: active
compose:
  ansible_network_os: platform.slug
```

NetBox devient la **source de vérité** : équipements, rôles, VLAN et adresses alimentent l'inventaire et les variables des modèles.
