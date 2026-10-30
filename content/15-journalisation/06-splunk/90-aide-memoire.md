---
title: Splunk — aide-mémoire des commandes
description: Commandes Splunk avec exemples — CLI splunk (start, stop, restart, status, btool, list, add monitor, add forward-server, reload deploy-server, show license), Universal Forwarder (installation Linux/Windows, inputs.conf, outputs.conf), recherches SPL usuelles (stats, timechart, top, rare, transaction, tstats, lookup), API REST (recherche, export), index et rétention, diagnostic (splunk diag, _internal).
tags: [aide-mémoire, splunk, spl, forwarder, btool, siem]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Splunk]]. CLI : `/opt/splunk/bin/splunk` (forwarder : `/opt/splunkforwarder/bin/splunk`).

## CLI

```bash
S=/opt/splunk/bin/splunk
sudo -u splunk $S status
sudo -u splunk $S restart
sudo -u splunk $S btool inputs list --debug | grep -i monitor     # configuration effective et fichier d'origine
sudo -u splunk $S btool check
sudo -u splunk $S list index
sudo -u splunk $S add index reseau -maxTotalDataSizeMB 200000 -frozenTimePeriodInSecs 31536000
sudo -u splunk $S show license
sudo -u splunk $S reload deploy-server
sudo -u splunk $S enable boot-start -systemd-managed 1 -user splunk
sudo -u splunk $S diag                                           # archive pour le support
```

## Universal Forwarder

```bash
sudo /opt/splunkforwarder/bin/splunk start --accept-license
sudo /opt/splunkforwarder/bin/splunk add forward-server splunk.exemple.fr:9997
sudo /opt/splunkforwarder/bin/splunk add monitor /var/log/auth.log -index linux -sourcetype linux_secure
sudo /opt/splunkforwarder/bin/splunk set deploy-poll splunk.exemple.fr:8089
sudo /opt/splunkforwarder/bin/splunk list forward-server
```

```powershell
msiexec.exe /i splunkforwarder-9.3.1-x64-release.msi AGREETOLICENSE=Yes RECEIVING_INDEXER="splunk.exemple.fr:9997" DEPLOYMENT_SERVER="splunk.exemple.fr:8089" WINEVENTLOG_SEC_ENABLE=1 WINEVENTLOG_SYS_ENABLE=1 /quiet
```

```ini
# inputs.conf
[monitor:///var/log/nginx/access.log]
index = web
sourcetype = nginx:plus:kv
[udp://514]
index = reseau
sourcetype = syslog
connection_host = ip
```

## SPL usuel

```text
index=reseau sourcetype=syslog "%LINK-3-UPDOWN" | stats count by host | sort - count
index=linux sourcetype=linux_secure "Failed password" | rex "from (?<ip>\d+\.\d+\.\d+\.\d+)" | top limit=10 ip
index=wineventlog EventCode=4625 | timechart span=15m count by Account_Name limit=5
index=web status>=500 | stats count, avg(request_time) AS tps_moyen by uri_path | where count > 10
index=firewall action=blocked | iplocation src_ip | geostats count by Country
| tstats count where index=* by index, sourcetype
index=_internal sourcetype=splunkd log_level=ERROR | stats count by component
index=reseau earliest=-24h | transaction host maxspan=5m | where eventcount > 50
```

## API REST

```bash
curl -sk -u admin:"$MDP" https://splunk.exemple.fr:8089/services/server/info?output_mode=json | jq '.entry[0].content.version'
curl -sk -u admin:"$MDP" https://splunk.exemple.fr:8089/services/search/jobs/export \
  -d search='search index=reseau earliest=-1h | stats count by host' -d output_mode=csv
```
