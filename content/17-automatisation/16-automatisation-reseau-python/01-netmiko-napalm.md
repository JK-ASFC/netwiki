---
title: Netmiko et NAPALM
description: Automatisation des équipements réseau en Python — Netmiko (connexions SSH et Telnet multi-constructeurs : Cisco IOS/NX-OS/ASA, Juniper, Aruba, Arista, FortiOS, MikroTik, Huawei… ; send_command avec TextFSM/Genie, send_config_set, sauvegarde de configuration, gestion des invites et du mode enable) et NAPALM (API unifiée : get_facts, get_interfaces, get_bgp_neighbors, get_lldp_neighbors, chargement et comparaison de configuration avec compare_config, commit et rollback ; pilotes ios, eos, junos, nxos_ssh et communautaires), installation, environnement virtuel, gestion des identifiants et bonnes pratiques.
tags: [netmiko, napalm, python, automatisation réseau, cisco, juniper, textfsm]
icon: info
---

**Netmiko** simplifie le dialogue SSH avec les équipements réseau (invites, pagination, mode configuration) : c'est la brique de base pour envoyer des commandes à des centaines de commutateurs. **NAPALM** ajoute une **API unifiée** : les mêmes fonctions renvoient des données structurées quel que soit le constructeur, et la configuration se charge avec **comparaison** avant application et **retour arrière**. Les deux s'utilisent seuls, dans [[02-nornir|Nornir]] ou depuis [[01-ansible/03-automatisation-reseau|Ansible]].

## Installation

```bash
python3 -m venv ~/venv-reseau && . ~/venv-reseau/bin/activate     # Windows : py -m venv venv-reseau ; venv-reseau\Scripts\activate
pip install netmiko napalm ntc-templates
```

## Netmiko

```python
from netmiko import ConnectHandler
import os

equipement = {
    "device_type": "cisco_ios", "host": "sw-acces-01.corp.exemple.fr",
    "username": "automate", "password": os.environ["MDP_RESEAU"], "secret": os.environ.get("ENABLE", ""),
}
with ConnectHandler(**equipement) as cnx:
    cnx.enable()
    interfaces = cnx.send_command("show ip interface brief", use_textfsm=True)   # liste de dictionnaires
    bas = [i["interface"] for i in interfaces if i["status"] == "down"]
    print("Interfaces down :", bas)
    sortie = cnx.send_config_set(["interface Gi1/0/12", "description Imprimante-2e", "switchport access vlan 30"])
    cnx.save_config()
    with open("sw-acces-01.cfg", "w") as f:
        f.write(cnx.send_command("show running-config"))
```

Types courants : `cisco_ios`, `cisco_nxos`, `cisco_asa`, `juniper_junos`, `arista_eos`, `aruba_aoscx`, `hp_procurve`, `fortinet`, `mikrotik_routeros`, `huawei`, `paloalto_panos`.

## NAPALM

```python
from napalm import get_network_driver
import os

pilote = get_network_driver("eos")
with pilote("leaf-01.corp.exemple.fr", "automate", os.environ["MDP_RESEAU"]) as eq:
    print(eq.get_facts()["os_version"])
    print(eq.get_lldp_neighbors())
    eq.load_merge_candidate(config="interface Ethernet12\n   description Serveur-backup\n")
    diff = eq.compare_config()
    if diff and input(diff + "\nAppliquer ? (o/n) ") == "o":
        eq.commit_config()
    else:
        eq.discard_config()
```

> [!TIP]
> Ne mettez jamais les mots de passe dans les scripts : variables d'environnement, `keyring`, [[25-openbao-infisical/01-openbao|OpenBao]] ou fichier chiffré par [[24-sops/01-presentation-utilisation|SOPS]]. Utilisez un compte dédié à l'automatisation avec des droits limités, et testez d'abord sur un équipement de laboratoire.

Suite : [[02-nornir|Nornir]] · [[90-aide-memoire|aide-mémoire]].
