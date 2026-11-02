---
title: osquery et FleetDM — aide-mémoire
description: Commandes osquery (osqueryi : .tables, .schema, .mode line, --json ; osqueryctl ; osqueryd --flagfile ; tables utiles) et fleetctl (login, config set, get hosts/queries/policies/software, query, apply -f, package, preview), avec requêtes SQL fréquentes pour la sécurité et l'inventaire.
tags: [aide-mémoire, osquery, fleetdm, fleetctl]
icon: terminal
---

Explications : [[01-presentation-installation|osquery et FleetDM]].

```bash
osqueryi ; osqueryi --json "SELECT * FROM system_info" ; osqueryi --line "SELECT * FROM os_version"
sudo osqueryctl start ; sudo osqueryctl config-check ; osqueryd --flagfile /etc/osquery/osquery.flags --verbose
fleetctl login --address https://fleet.corp.exemple.fr ; fleetctl get hosts ; fleetctl get policies ; fleetctl get software --vulnerable
fleetctl query --labels "Tous les hôtes Windows" --query "SELECT name FROM programs WHERE name LIKE '%Chrome%';"
fleetctl apply -f politiques.yml ; fleetctl package --type=deb --fleet-url=https://fleet.corp.exemple.fr --enroll-secret=$SECRET
```

```sql
.tables ; .schema users ; .mode line
SELECT * FROM users WHERE uid >= 1000;  SELECT * FROM logged_in_users;  SELECT * FROM crontab;
SELECT * FROM scheduled_tasks WHERE enabled = 1 AND path NOT LIKE '\Microsoft\%';     -- Windows
SELECT name, version FROM deb_packages WHERE name LIKE 'openssl%';  SELECT * FROM certificates WHERE not_valid_after < strftime('%s','now') + 30*86400;
```
