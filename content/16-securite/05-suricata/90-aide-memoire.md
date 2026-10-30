---
title: Suricata — aide-mémoire des commandes
description: Commandes Suricata avec exemples — test de configuration (suricata -T), modes IDS (af-packet) et IPS (NFQUEUE), gestion des règles (suricata-update : sources, activation, désactivation, modification), suricatasc (rechargement des règles, statistiques, interfaces), analyse hors ligne d'une capture (-r), lecture d'eve.json avec jq, règles locales, performances.
tags: [aide-mémoire, suricata, ids, ips, suricata-update, eve.json]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Suricata]].

## Configuration et service

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml -v          # tester la configuration et les règles
sudo systemctl restart suricata
suricata --build-info | head
sudo suricata -c /etc/suricata/suricata.yaml --af-packet=eth1 -D       # IDS sur une interface (port miroir)
sudo suricata -c /etc/suricata/suricata.yaml -q 0 -D                    # IPS en ligne via NFQUEUE 0
sudo nft add rule inet filter forward queue num 0 bypass                # envoyer le trafic transité à Suricata
```

## Règles (suricata-update)

```bash
sudo suricata-update                                 # télécharger et compiler (ET Open par défaut)
sudo suricata-update update-sources
sudo suricata-update list-sources
sudo suricata-update enable-source et/open
sudo suricata-update enable-source oisf/trafficid
sudo suricata-update list-enabled-sources
echo "2100498" | sudo tee -a /etc/suricata/disable.conf          # désactiver une règle (SID)
echo "re:emerging-scan" | sudo tee -a /etc/suricata/disable.conf # par expression
echo "group:emerging-policy.rules" | sudo tee -a /etc/suricata/drop.conf   # passer en drop (IPS)
sudo suricata-update && sudo suricatasc -c reload-rules
```

```text
# /etc/suricata/rules/local.rules
alert tcp $HOME_NET any -> $EXTERNAL_NET 23 (msg:"LOCAL Telnet sortant"; flow:to_server,established; sid:1000001; rev:1;)
alert dns $HOME_NET any -> any any (msg:"LOCAL Requête vers domaine interdit"; dns.query; content:"exemple-malveillant.net"; nocase; sid:1000002; rev:1;)
```

## suricatasc

```bash
sudo suricatasc -c version
sudo suricatasc -c uptime
sudo suricatasc -c iface-list
sudo suricatasc -c "iface-stat eth1"
sudo suricatasc -c dump-counters | jq '.message.decoder.pkts, .message.capture.kernel_drops'
sudo suricatasc -c reload-rules
sudo suricatasc -c ruleset-stats
```

## Analyse hors ligne

```bash
suricata -r capture.pcap -l /tmp/analyse -k none
jq -c 'select(.event_type=="alert") | {ts: .timestamp, src: .src_ip, dst: .dest_ip, sig: .alert.signature}' /tmp/analyse/eve.json | head
```

## Lire eve.json

```bash
sudo tail -f /var/log/suricata/fast.log
sudo jq -c 'select(.event_type=="alert") | [.timestamp, .src_ip, .dest_ip, .alert.severity, .alert.signature]' /var/log/suricata/eve.json | tail
sudo jq -r 'select(.event_type=="alert") | .alert.signature' /var/log/suricata/eve.json | sort | uniq -c | sort -rn | head
sudo jq -c 'select(.event_type=="dns") | {q: .dns.rrname, src: .src_ip}' /var/log/suricata/eve.json | tail
sudo jq -c 'select(.event_type=="tls") | {sni: .tls.sni, ver: .tls.version}' /var/log/suricata/eve.json | tail
sudo jq 'select(.event_type=="stats") | .stats.capture' /var/log/suricata/eve.json | tail -8
```
