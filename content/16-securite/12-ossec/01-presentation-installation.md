---
title: Présentation, installation et configuration
description: OSSEC HIDS (Atomicorp, GPL) — détection d'intrusions sur les hôtes : architecture serveur/agents ou local, fonctions (analyse de journaux et décodeurs, contrôle d'intégrité syscheck, détection de rootkits rootcheck, réponse active), installation (script install.sh, dépôts Atomicorp pour RHEL et Debian, agent Windows), enregistrement des agents (manage_agents, clés), ossec.conf, règles locales, alertes par e-mail et syslog, et choix entre OSSEC et Wazuh (fork plus actif avec interface).
tags: [ossec, hids, intégrité, rootkit, réponse active, wazuh]
icon: info
---

**OSSEC** surveille les serveurs de l'intérieur : il analyse les **journaux** (authentification, web, système), contrôle l'**intégrité** des fichiers sensibles, cherche des **rootkits** et peut **bloquer** automatiquement une adresse (réponse active). [[05-wazuh/01-presentation-installation|Wazuh]] en est un fork bien plus actif (interface, inventaire de vulnérabilités, conformité) : pour un nouveau déploiement, Wazuh est généralement préférable ; OSSEC reste présent dans des installations existantes et dans certains produits.

## Installation

```bash
# Depuis les sources (Linux, BSD) : choisir « server », « agent » ou « local »
sudo apt install build-essential libevent-dev libpcre2-dev libz-dev libssl-dev
wget https://github.com/ossec/ossec-hids/archive/refs/tags/3.8.0.tar.gz && tar xzf 3.8.0.tar.gz && cd ossec-hids-3.8.0
sudo ./install.sh
sudo /var/ossec/bin/ossec-control start
```

Paquets : dépôts **Atomicorp** (RHEL, Debian/Ubuntu). Agent Windows : installeur `ossec-agent-win32` (configuration dans `C:\Program Files (x86)\ossec-agent\ossec.conf`).

## Enregistrer un agent

```bash
sudo /var/ossec/bin/manage_agents          # sur le serveur : (A)jouter l'agent, puis (E)xtraire sa clé
sudo /var/ossec/bin/manage_agents          # sur l'agent : (I)mporter la clé ; adresse du serveur dans ossec.conf
sudo /var/ossec/bin/ossec-control restart
sudo /var/ossec/bin/agent_control -lc      # agents connectés (serveur)
```

Port **1514/UDP** entre agents et serveur.

## Configuration

```xml
<!-- /var/ossec/etc/ossec.conf (extraits) -->
<ossec_config>
  <global>
    <email_notification>yes</email_notification>
    <smtp_server>smtp.corp.exemple.fr</smtp_server>
    <email_to>soc@corp.exemple.fr</email_to>
  </global>
  <syscheck>
    <frequency>21600</frequency>
    <directories check_all="yes" realtime="yes">/etc,/usr/bin,/usr/sbin</directories>
    <ignore>/etc/mtab</ignore>
  </syscheck>
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/auth.log</location>
  </localfile>
  <active-response>
    <command>firewall-drop</command>
    <location>local</location>
    <rules_id>5712</rules_id>          <!-- attaque SSH par force brute -->
    <timeout>600</timeout>
  </active-response>
</ossec_config>
```

Règles personnalisées : `/var/ossec/rules/local_rules.xml` (identifiants 100000+). Tester une ligne de journal : `/var/ossec/bin/ossec-logtest`.

Commandes : [[90-aide-memoire|aide-mémoire]].
