---
title: Snort 3 — aide-mémoire des commandes
description: Commandes Snort 3 avec exemples — version et validation de configuration (-T), exécution IDS sur interface (DAQ afpacket), mode en ligne (inline), analyse de captures (-r), alertes (-A alert_fast, alert_json), règles (snort3-community, Talos, PulledPork 3), règles locales, mise à niveau depuis Snort 2 (snort2lua), statistiques.
tags: [aide-mémoire, snort, snort3, ids, ips, règles, pulledpork]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Snort]].

## Validation et exécution

```bash
snort -V
snort -c /usr/local/etc/snort/snort.lua -T                                  # tester la configuration
snort -c /usr/local/etc/snort/snort.lua -R /usr/local/etc/rules/local.rules -T
sudo snort -c /usr/local/etc/snort/snort.lua -i eth1 --daq afpacket -A alert_fast -l /var/log/snort -D
sudo snort -c /usr/local/etc/snort/snort.lua -Q --daq afpacket -i eth1:eth2 -A alert_fast     # en ligne (paire d'interfaces)
snort -c /usr/local/etc/snort/snort.lua -r capture.pcap -A alert_fast -k none
snort --help-modules | head
snort --help-config ips | head
```

## Règles

```text
# /usr/local/etc/rules/local.rules
alert icmp any any -> $HOME_NET any ( msg:"LOCAL Ping vers le réseau interne"; sid:1000001; rev:1; )
alert tcp $EXTERNAL_NET any -> $HOME_NET 3389 ( msg:"LOCAL RDP depuis l'extérieur"; flow:to_server; sid:1000002; rev:1; )
```

```lua
-- snort.lua (extrait)
ips =
{
    enable_builtin_rules = true,
    include = RULE_PATH .. '/local.rules',
    variables = default_variables
}
alert_json = { file = true, fields = 'timestamp src_addr dst_addr msg sid' }
```

```bash
# PulledPork 3 : téléchargement des règles (communauté ou abonnement Talos)
sudo ./pulledpork.py -c /usr/local/etc/pulledpork/pulledpork.conf -v
```

## Migration depuis Snort 2

```bash
snort2lua -c /etc/snort/snort.conf -o snort.lua
snort2lua -c /etc/snort/rules/local.rules -r local3.rules
```

## Journaux

```bash
sudo tail -f /var/log/snort/alert_fast.txt
sudo jq -c '{t: .timestamp, src: .src_addr, dst: .dst_addr, msg: .msg}' /var/log/snort/alert_json.txt | tail
```
