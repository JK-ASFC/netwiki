---
title: FortiSwitch, FortiAP, FortiManager et FortiAnalyzer
description: La Security Fabric de Fortinet — FortiSwitch géré par FortiLink (VLAN, profils de ports, NAC, PoE, empilement) et en mode autonome (CLI et interface web), FortiAP géré par le FortiGate (SSID, VLAN, WPA3-Entreprise), FortiManager (gestion centralisée des politiques, modèles, ADOM, déploiements) et FortiAnalyzer (journaux, rapports, SOC), FortiClient EMS, licences et dépannage.
tags: [fortinet, fortiswitch, fortilink, fortiap, fortimanager, fortianalyzer, security fabric]
icon: network
---

## FortiSwitch

### Géré par FortiLink

En mode **FortiLink**, le FortiSwitch est piloté par le FortiGate : les VLAN sont des interfaces du FortiGate, les ports se configurent dans *WiFi & Switch Controller*.

```fortios
config system interface
    edit "fortilink"
        set fortilink enable
        # agrégat vers le FortiSwitch
        set member "port11" "port12"
    next
end
config switch-controller managed-switch
    edit "S248EF0000000001"
        config ports
            edit "port10"
                set vlan "VLAN20"
                set allowed-vlans "VLAN30"
                set poe-status enable
            next
        end
    next
end
execute switch-controller get-conn-status
diagnose switch-controller switch-info port-stats S248EF0000000001
```

| Fonction | Intérêt |
| --- | --- |
| VLAN et politiques sur le FortiGate | Segmentation et filtrage centralisés |
| **NAC** et profils dynamiques | Affectation automatique de VLAN selon l'équipement (MAC, type, FortiClient) |
| Quarantaine | Isoler un équipement détecté comme compromis depuis la Security Fabric |
| Empilement par FortiLink (MCLAG) | Redondance des commutateurs de cœur |

### Mode autonome

Un FortiSwitch peut aussi fonctionner seul (interface web et CLI de type FortiOS : `config switch vlan`, `config switch interface`) — moins courant.

## FortiAP

Les points d'accès **FortiAP** sont gérés par le FortiGate (contrôleur Wi-Fi intégré) ou par FortiLAN Cloud :

```fortios
config wireless-controller vap
    edit "SSID-CORP"
        set ssid "CORP"
        set security wpa3-enterprise
        set auth radius
        set radius-server "NPS-01"
        set vdom "root"
        set vlanid 20
    next
end
config wireless-controller wtp-profile
    edit "PROFIL-AP-BUREAUX"
        config radio-2
            set band 802.11ax-5G
            set vap-all manual
            set vaps "SSID-CORP"
            set handoff-sta-thresh 30
        end
    next
end
# points d'accès connectés
diagnose wireless-controller wlac -c wtp
```

## FortiManager

**FortiManager** gère centralement des dizaines à des milliers de FortiGate :

| Notion | Description |
| --- | --- |
| **ADOM** | Domaine administratif (par client, par version de FortiOS) |
| Paquets de politiques | Politiques et objets partagés, installés sur plusieurs équipements |
| Modèles (*provisioning templates*) | Système, SD-WAN, IPsec (assistants ADVPN), CLI |
| Révisions | Historique, comparaison et retour arrière des configurations |
| Mises à jour | Micrologiciels et bases FortiGuard (cache local pour les sites isolés) |
| Workflow | Validation des changements par un approbateur |

Règle d'or : un FortiGate géré par FortiManager se modifie **dans FortiManager** ; les changements locaux créent une désynchronisation (à réimporter).

## FortiAnalyzer

**FortiAnalyzer** centralise les **journaux** de la Security Fabric : recherche, rapports (conformité, utilisation, menaces), tableaux de bord **SOC**, corrélation et automatisation de réponse (*playbooks*), conservation longue. Alternative : envoi syslog vers le SIEM de l'entreprise ([[05-wazuh/01-presentation-installation|Wazuh]], Splunk).

## FortiClient EMS

**FortiClient EMS** gère les postes FortiClient (VPN, ZTNA, conformité, protection) et partage leur état avec le FortiGate (règles conditionnées à la conformité du poste).

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| FortiSwitch non autorisé | Autorisation en attente, câblage FortiLink | *WiFi & Switch Controller → Managed FortiSwitches* : autoriser ; `execute switch-controller get-conn-status` |
| FortiAP « Offline » | Pas d'adresse, CAPWAP (UDP 5246/5247) filtré, découverte | DHCP option 138, `set ac-ip` sur l'AP |
| Désynchronisation FortiManager | Changements locaux | Réimporter ou réinstaller la politique |
| Journaux absents dans FortiAnalyzer | Équipement non autorisé, chiffrement OFTP, quota | Enregistrer l'équipement, `diagnose test application miglogd 6` |

Voir aussi [[15-fortigate/01-acces-cli-gui|bases FortiGate]] et [[01-routage-sdwan|routage et SD-WAN]].
