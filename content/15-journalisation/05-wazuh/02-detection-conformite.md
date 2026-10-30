---
title: Règles, intégrité, vulnérabilités, syslog et réponse active
description: Configurer la détection dans Wazuh — collecte des journaux (Linux, canaux d'événements Windows, Sysmon), réception syslog des équipements réseau, décodeurs et règles personnalisés avec wazuh-logtest, intégrité des fichiers (FIM) et du registre, évaluation de configuration (SCA), détection de vulnérabilités, réponse active (blocage d'IP) et intégrations (courriel, Teams, VirusTotal).
tags: [wazuh, règles, décodeurs, fim, sca, vulnérabilités, réponse active, syslog, sysmon]
icon: shield-check
---

## Configuration centralisée des agents

Les agents d'un **groupe** reçoivent automatiquement le fichier partagé `agent.conf` du groupe :

```wazuh /var/ossec/etc/shared/windows/agent.conf
<agent_config>
  <localfile>
    <location>Security</location>
    <log_format>eventchannel</log_format>
    <query>Event/System[EventID != 5156 and EventID != 5158]</query>
  </localfile>
  <localfile>
    <location>Microsoft-Windows-Sysmon/Operational</location>
    <log_format>eventchannel</log_format>
  </localfile>
  <localfile>
    <location>Microsoft-Windows-PowerShell/Operational</location>
    <log_format>eventchannel</log_format>
  </localfile>
</agent_config>
```

```wazuh /var/ossec/etc/shared/linux/agent.conf
<agent_config>
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/nginx/access.log</location>
  </localfile>
  <localfile>
    <log_format>journald</log_format>
    <location>journald</location>
  </localfile>
</agent_config>
```

**Sysmon** (Sysinternals) sur les postes et serveurs Windows enrichit fortement la détection (processus, réseau, registre).

## Syslog des équipements réseau

```wazuh /var/ossec/etc/ossec.conf (serveur, extrait)
<remote>
  <connection>syslog</connection>
  <port>514</port>
  <protocol>udp</protocol>
  <allowed-ips>10.0.0.0/16</allowed-ips>
  <local_ip>10.0.99.50</local_ip>
</remote>
```

Des décodeurs existent pour Cisco IOS/ASA, FortiGate, pfSense, Palo Alto, Juniper, Sophos… ; les autres formats nécessitent des décodeurs personnalisés.

## Décodeurs et règles personnalisés

```wazuh /var/ossec/etc/decoders/local_decoder.xml
<decoder name="appli-inventaire">
  <program_name>inventaire</program_name>
</decoder>

<decoder name="appli-inventaire-connexion">
  <parent>appli-inventaire</parent>
  <regex>connexion (\S+) depuis (\S+) : (\S+)</regex>
  <order>user, srcip, status</order>
</decoder>
```

```wazuh /var/ossec/etc/rules/local_rules.xml
<group name="inventaire,authentification,">
  <rule id="100100" level="3">
    <decoded_as>appli-inventaire</decoded_as>
    <field name="status">echec</field>
    <description>Inventaire : échec de connexion de $(user) depuis $(srcip)</description>
  </rule>
  <rule id="100101" level="10" frequency="8" timeframe="120">
    <if_matched_sid>100100</if_matched_sid>
    <same_source_ip />
    <description>Inventaire : force brute probable depuis $(srcip)</description>
    <mitre><id>T1110</id></mitre>
  </rule>
</group>
```

```bash
sudo /var/ossec/bin/wazuh-logtest          # coller une ligne de journal : décodeur et règle déclenchés
sudo systemctl restart wazuh-manager
```

Niveaux de règle : 0 (ignorer) à 15 (critique) ; les alertes sont indexées à partir du niveau 3 par défaut. Ne modifiez pas les règles d'origine : surchargez-les (`overwrite="yes"`) ou excluez-les dans `local_rules.xml`.

## Intégrité des fichiers (FIM)

```wazuh agent.conf (groupe linux)
<syscheck>
  <frequency>43200</frequency>
  <directories realtime="yes" check_all="yes" report_changes="yes">/etc,/usr/local/bin</directories>
  <directories whodata="yes">/var/www/html</directories>
  <ignore>/etc/mtab</ignore>
</syscheck>
```

| Option | Effet |
| --- | --- |
| `realtime` | Détection immédiate (inotify) |
| `whodata` | Qui a modifié (auditd sous Linux, audit SACL sous Windows) |
| `report_changes` | Différences du contenu (fichiers texte) |
| `<windows_registry>` | Clés de registre surveillées (Windows) |

## Évaluation de configuration (SCA)

Les politiques **CIS** (Debian, RHEL, Windows Server, Windows 11, Apache, Nginx…) sont évaluées périodiquement sur les agents ; le résultat (score, contrôles en échec avec remédiation) s'affiche par agent. Des politiques personnalisées en YAML peuvent être ajoutées.

## Vulnérabilités

Le module **Vulnerability Detection** compare l'inventaire logiciel des agents (paquets, programmes Windows, correctifs KB) aux flux de vulnérabilités (CVE) et produit des alertes et un état par agent. Activé par défaut dans les versions récentes (`<vulnerability-detection>` dans `ossec.conf`).

## Réponse active

```wazuh /var/ossec/etc/ossec.conf (serveur)
<active-response>
  <command>firewall-drop</command>
  <location>local</location>
  <rules_id>5763,100101</rules_id>    <!-- force brute SSH, règle personnalisée -->
  <timeout>3600</timeout>
</active-response>
```

L'agent concerné bloque l'IP source pendant une heure (iptables/nftables sous Linux, commandes `netsh` ou `route-null` sous Windows). Utilisez-la avec prudence (listes d'exclusion `<white_list>` pour les IP d'administration).

## Intégrations

```wazuh /var/ossec/etc/ossec.conf (extrait)
<global>
  <email_notification>yes</email_notification>
  <smtp_server>relais.corp.exemple.fr</smtp_server>
  <email_from>wazuh@exemple.fr</email_from>
  <email_to>soc@exemple.fr</email_to>
</global>
<alerts>
  <email_alert_level>12</email_alert_level>
</alerts>
<integration>
  <name>virustotal</name>
  <api_key>CLE_API</api_key>
  <group>syscheck</group>
  <alert_format>json</alert_format>
</integration>
```

Intégrations fournies : Slack, PagerDuty, VirusTotal, Shuffle (SOAR) ; scripts personnalisés `custom-*` pour Teams, TheHive, ITSM.
