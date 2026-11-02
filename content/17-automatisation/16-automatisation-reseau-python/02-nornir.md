---
title: Nornir et Nornir Salt
description: Nornir (Apache 2.0) — cadre d'automatisation réseau en Python pur qui exécute des tâches en parallèle sur un inventaire (hôtes, groupes, valeurs par défaut en YAML, ou NetBox), avec des greffons (nornir_netmiko, nornir_napalm, nornir_scrapli, nornir_jinja2, nornir_utils), filtres, résultats et gestion des erreurs ; Nornir Salt (bibliothèque de greffons supplémentaires pour Nornir et intégration avec SaltStack via le proxy minion nornir) ; installation, structure de projet et exemples (sauvegarde des configurations, audit, déploiement par modèle Jinja2).
tags: [nornir, nornir salt, python, automatisation réseau, netbox, jinja2]
icon: info
---

**Nornir** apporte ce qui manque à un script [[01-netmiko-napalm|Netmiko ou NAPALM]] : un **inventaire** structuré, l'exécution **parallèle** sur des centaines d'équipements, des filtres et une gestion propre des résultats et erreurs — tout en restant du Python (pas de DSL), donc facile à déboguer et à tester. **Nornir Salt** est une collection de greffons supplémentaires (tests, analyse de sorties, fonctions utilitaires) qui permet aussi d'utiliser Nornir depuis [[03-salt/01-presentation-installation|SaltStack]].

## Installation

```bash
pip install nornir nornir-netmiko nornir-napalm nornir-jinja2 nornir-utils nornir-netbox nornir-salt
```

```yaml
# config.yaml
inventory:
  plugin: SimpleInventory
  options: { host_file: inventaire/hosts.yaml, group_file: inventaire/groups.yaml, defaults_file: inventaire/defaults.yaml }
runner: { plugin: threaded, options: { num_workers: 20 } }
```

```yaml
# inventaire/hosts.yaml
sw-acces-01: { hostname: 10.0.30.11, groups: [cisco_ios], data: { site: paris, role: acces } }
leaf-01:     { hostname: 10.0.40.11, groups: [arista_eos], data: { site: paris, role: leaf } }
# inventaire/groups.yaml
cisco_ios: { platform: ios, connection_options: { netmiko: { platform: cisco_ios } } }
arista_eos: { platform: eos }
```

Inventaire depuis [[08-netbox-nautobot/01-netbox|NetBox]] : greffon `nornir_netbox` (`NetBoxInventory2`).

## Exemple : sauvegarde et audit

```python
import os
from nornir import InitNornir
from nornir.core.filter import F
from nornir_netmiko.tasks import netmiko_send_command
from nornir_napalm.plugins.tasks import napalm_get
from nornir_utils.plugins.functions import print_result

nr = InitNornir(config_file="config.yaml")
nr.inventory.defaults.username = "automate"
nr.inventory.defaults.password = os.environ["MDP_RESEAU"]

def sauvegarder(task):
    r = task.run(task=netmiko_send_command, command_string="show running-config")
    os.makedirs("sauvegardes", exist_ok=True)
    with open(f"sauvegardes/{task.host}.cfg", "w") as f:
        f.write(r.result)

resultat = nr.filter(F(data__site="paris")).run(task=sauvegarder)
print("En échec :", list(resultat.failed_hosts))
print_result(nr.filter(platform="eos").run(task=napalm_get, getters=["facts"]))
```

Commandes : [[90-aide-memoire|aide-mémoire]].
