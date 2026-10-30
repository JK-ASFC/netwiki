---
title: Wazuh — aide-mémoire des commandes
description: Commandes Wazuh avec exemples — gestionnaire (wazuh-control, cluster_control), agents (agent_control, manage_agents, inscription agent-auth, déploiement Linux et Windows avec variables), tests de règles et décodeurs (wazuh-logtest), réponse active, intégrité des fichiers et vulnérabilités, API REST (jeton, agents, groupes, redémarrage), indexeur et tableau de bord, journaux.
tags: [aide-mémoire, wazuh, siem, xdr, agents, wazuh-logtest, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Wazuh]].

## Gestionnaire

```bash
sudo systemctl status wazuh-manager wazuh-indexer wazuh-dashboard
sudo /var/ossec/bin/wazuh-control status
sudo /var/ossec/bin/wazuh-control restart
sudo /var/ossec/bin/cluster_control -l          # nœuds de la grappe
sudo tail -f /var/ossec/logs/ossec.log
sudo tail -f /var/ossec/logs/alerts/alerts.json | jq -c '{regle: .rule.id, niveau: .rule.level, desc: .rule.description, agent: .agent.name}'
```

## Agents

```bash
sudo /var/ossec/bin/agent_control -l            # liste et état
sudo /var/ossec/bin/agent_control -i 003        # détail
sudo /var/ossec/bin/agent_control -R -u 003     # redémarrer un agent
sudo /var/ossec/bin/manage_agents -l
sudo /var/ossec/bin/manage_agents -r 007        # supprimer
# Déploiement Linux (variables lues par le paquet)
sudo WAZUH_MANAGER="wazuh.exemple.fr" WAZUH_AGENT_GROUP="linux-serveurs" WAZUH_AGENT_NAME="srv-web01" apt install wazuh-agent
sudo systemctl enable --now wazuh-agent
sudo /var/ossec/bin/agent-auth -m wazuh.exemple.fr -G linux-serveurs     # réinscription manuelle
```

```powershell
# Windows
msiexec.exe /i wazuh-agent-4.9.2-1.msi /q WAZUH_MANAGER="wazuh.exemple.fr" WAZUH_AGENT_GROUP="windows-postes" WAZUH_REGISTRATION_SERVER="wazuh.exemple.fr"
NET START WazuhSvc
Get-Content "C:\Program Files (x86)\ossec-agent\ossec.log" -Tail 20
```

## Règles et décodeurs

```bash
sudo /var/ossec/bin/wazuh-logtest               # coller une ligne de journal : décodeur et règle déclenchés
sudo nano /var/ossec/etc/rules/local_rules.xml
sudo nano /var/ossec/etc/decoders/local_decoder.xml
```

```xml
<group name="reseau,">
  <rule id="100100" level="10">
    <if_sid>5716</if_sid>
    <srcip>!10.0.99.0/24</srcip>
    <description>Échec SSH depuis l'extérieur du réseau d'administration</description>
  </rule>
</group>
```

## API REST

```bash
W=https://wazuh.exemple.fr:55000
TOKEN=$(curl -sk -u wazuh-wui:"$MDP" -X POST "$W/security/user/authenticate?raw=true")
curl -sk -H "Authorization: Bearer $TOKEN" "$W/agents?status=disconnected&select=name,ip,lastKeepAlive" | jq '.data.affected_items'
curl -sk -H "Authorization: Bearer $TOKEN" "$W/agents/summary/status" | jq .data
curl -sk -H "Authorization: Bearer $TOKEN" "$W/groups" | jq '.data.affected_items[].name'
curl -sk -X PUT -H "Authorization: Bearer $TOKEN" "$W/agents/003/restart"
curl -sk -H "Authorization: Bearer $TOKEN" "$W/syscheck/003?limit=5" | jq '.data.affected_items'       # intégrité des fichiers
curl -sk -H "Authorization: Bearer $TOKEN" "$W/manager/info" | jq .data.affected_items[0].version
```

## Indexeur

```bash
curl -sk -u admin:"$MDP" "https://127.0.0.1:9200/_cat/indices/wazuh-alerts-*?v&s=index" | tail -5
curl -sk -u admin:"$MDP" "https://127.0.0.1:9200/_cluster/health?pretty"
```
