---
title: Netmiko, NAPALM et Nornir — aide-mémoire
description: Commandes et appels courants — installation pip, Netmiko (ConnectHandler, send_command avec use_textfsm, send_config_set, send_config_from_file, save_config, enable, find_prompt, journal de session, détection automatique SSHDetect), NAPALM (CLI napalm, get_facts, get_config, load_replace_candidate, compare_config, commit_config, rollback), Nornir (InitNornir, filter, F, run, print_result, failed_hosts), avec exemples.
tags: [aide-mémoire, netmiko, napalm, nornir]
icon: terminal
---

Explications : [[01-netmiko-napalm|Netmiko et NAPALM]] · [[02-nornir|Nornir]].

```bash
pip install netmiko napalm nornir nornir-netmiko nornir-napalm ntc-templates
napalm --user automate --vendor ios sw-acces-01 call get_facts ; napalm --user automate --vendor eos leaf-01 configure modif.cfg --strategy merge --dry-run
```

```python
from netmiko import ConnectHandler, SSHDetect
type_detecte = SSHDetect(device_type="autodetect", host="10.0.30.11", username="automate", password=MDP).autodetect()
c = ConnectHandler(device_type="cisco_ios", host="10.0.30.11", username="automate", password=MDP, session_log="session.log")
c.find_prompt() ; c.send_command("show version", use_textfsm=True) ; c.send_config_from_file("vlans.cfg") ; c.save_config() ; c.disconnect()
eq.get_config()["running"] ; eq.load_replace_candidate(filename="complet.cfg") ; eq.compare_config() ; eq.commit_config() ; eq.rollback()
nr = InitNornir(config_file="config.yaml") ; r = nr.filter(F(groups__contains="cisco_ios")).run(task=netmiko_send_command, command_string="show clock")
print_result(r) ; r.failed_hosts
```
