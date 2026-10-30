---
title: Zabbix — aide-mémoire des commandes
description: Commandes Zabbix avec exemples — serveur et proxy (zabbix_server -R : config_cache_reload, log_level, housekeeper_execute, diaginfo), agent et agent 2 (-t, -p, test de clés, userparameters), zabbix_get, zabbix_sender et éléments trapper, zabbix_js, API JSON-RPC avec curl (authentification, hôtes, problèmes, maintenance), base de données (partitionnement, sauvegarde), SNMP et diagnostic.
tags: [aide-mémoire, zabbix, zabbix_get, zabbix_sender, api, agent2]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Zabbix]].

## Serveur et proxy (contrôle à chaud)

```bash
sudo systemctl status zabbix-server zabbix-agent2
sudo zabbix_server -R config_cache_reload          # appliquer les changements de configuration sans attendre
sudo zabbix_server -R housekeeper_execute
sudo zabbix_server -R log_level_increase=poller     # plus de détails pour un processus
sudo zabbix_server -R log_level_decrease=poller
sudo zabbix_server -R diaginfo                      # état des caches et files d'attente (dans le journal)
sudo zabbix_server -R ha_status                     # haute disponibilité native
sudo zabbix_proxy -R config_cache_reload
sudo tail -f /var/log/zabbix/zabbix_server.log
```

## Agent

```bash
zabbix_agent2 -t system.cpu.load[all,avg1]          # tester une clé localement
zabbix_agent2 -p | head                              # toutes les clés prises en charge
zabbix_agentd -t vfs.fs.size[/,pused]                # agent classique
sudo systemctl restart zabbix-agent2
```

```ini
# /etc/zabbix/zabbix_agent2.d/perso.conf — paramètres utilisateur
UserParameter=app.connexions,ss -tan state established '( sport = :443 )' | tail -n +2 | wc -l
UserParameter=fichier.age[*],echo $(( $(date +%s) - $(stat -c %Y "$1") ))
```

## zabbix_get et zabbix_sender

```bash
zabbix_get -s 10.0.30.10 -k agent.ping
zabbix_get -s 10.0.30.10 -k "vfs.fs.size[/,pfree]"
zabbix_get -s 10.0.30.10 -k app.connexions
# Envoyer une valeur à un élément de type « Zabbix trapper »
zabbix_sender -z zabbix.exemple.fr -s "srv-web01" -k sauvegarde.statut -o 0
zabbix_sender -z zabbix.exemple.fr -i valeurs.txt           # lignes : hôte clé valeur
zabbix_js -s script.js -p '{"url":"https://api.exemple.fr"}'  # tester un script JavaScript de prétraitement
```

## API JSON-RPC

```bash
Z=https://zabbix.exemple.fr/api_jsonrpc.php
H="Authorization: Bearer $ZABBIX_TOKEN"              # jeton d'API (Zabbix 6.4+)
api() { curl -s -X POST -H "Content-Type: application/json-rpc" -H "$H" -d "$1" $Z | jq .; }
api '{"jsonrpc":"2.0","method":"apiinfo.version","params":{},"id":1}'
api '{"jsonrpc":"2.0","method":"host.get","params":{"output":["hostid","host"],"selectInterfaces":["ip"],"search":{"host":"srv-"}},"id":1}'
api '{"jsonrpc":"2.0","method":"problem.get","params":{"output":"extend","recent":true,"severities":[4,5],"sortfield":["eventid"],"sortorder":"DESC","limit":20},"id":1}'
api '{"jsonrpc":"2.0","method":"host.create","params":{"host":"srv-web02","interfaces":[{"type":1,"main":1,"useip":1,"ip":"10.0.30.11","dns":"","port":"10050"}],"groups":[{"groupid":"2"}],"templates":[{"templateid":"10001"}]},"id":1}'
api '{"jsonrpc":"2.0","method":"maintenance.create","params":{"name":"Maj srv-web01","active_since":'"$(date +%s)"',"active_till":'"$(date -d '+2 hour' +%s)"',"hosts":[{"hostid":"10601"}],"timeperiods":[{"period":7200}]},"id":1}'
```

## Base de données

```bash
sudo -u postgres pg_dump -Fc zabbix > /srv/sauvegardes/zabbix-$(date +%F).dump        # PostgreSQL
mysqldump --single-transaction zabbix | gzip > /srv/sauvegardes/zabbix-$(date +%F).sql.gz   # MariaDB/MySQL
# Avec TimescaleDB, la compression et le nettoyage des historiques sont gérés par la base
```

## SNMP et diagnostic

```bash
snmpwalk -v2c -c Lecture-Supervision 10.0.99.10 IF-MIB::ifDescr
snmpget -v3 -l authPriv -u zabbix -a SHA -A 'Auth2026!' -x AES -X 'Priv2026!' 10.0.99.10 SNMPv2-MIB::sysUpTime.0
sudo -u zabbix /usr/lib/zabbix/externalscripts/mon_script.sh arg1      # tester un script externe
```
