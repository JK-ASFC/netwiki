---
title: "Supervision réseau : SNMP, découverte, cartes"
description: Superviser commutateurs, routeurs, pare-feu et Wi-Fi avec Zabbix — interfaces SNMPv2c/v3, modèles réseau officiels, éléments SNMP et walk, découverte des interfaces (LLD), traps SNMP (snmptrapd), découverte réseau automatique et actions, ICMP et dépendances, cartes réseau et NetFlow complémentaire.
tags: [zabbix, snmp, snmpv3, traps, découverte réseau, cartes, icmp, dépendances]
icon: network
---

## Interface SNMP d'un hôte

| Paramètre | Valeur |
| --- | --- |
| Version | SNMPv2c (communauté) ou **SNMPv3** (recommandé) |
| SNMPv3 | Nom de sécurité, niveau `authPriv`, protocole d'authentification (SHA-256…), de chiffrement (AES…), phrases secrètes |
| Requêtes groupées | Activées (plus rapide) ; à désactiver pour les équipements mal compatibles |

Utilisez des **macros** (`{$SNMP_COMMUNITY}`, `{$SNMPV3_AUTHPASS}`) définies au niveau global ou par groupe, en type **secret**.

```bash
# Tester depuis le serveur ou le proxy qui interrogera l'équipement
snmpwalk -v3 -l authPriv -u supervision -a SHA-256 -A 'MotDePasseAuth' -x AES -X 'MotDePassePriv' 10.0.0.2 IF-MIB::ifName
snmpget -v2c -c CommunauteLongue 10.0.0.2 SNMPv2-MIB::sysDescr.0
```

## Modèles réseau

| Modèle officiel | Contenu |
| --- | --- |
| *Network Generic Device by SNMP* | Disponibilité, interfaces (débit, erreurs, état), ICMP |
| *Cisco IOS by SNMP*, *Cisco Catalyst 3750*, *Arista*, *Juniper*, *HPE ProCurve*, *Mikrotik*, *FortiGate*, *Palo Alto*… | CPU, mémoire, températures, ventilateurs, alimentations, interfaces |
| *Interfaces Simple by SNMP* | Interfaces seules |
| *ICMP Ping* | Disponibilité, latence, perte |

Les interfaces sont découvertes par **LLD** (IF-MIB : `ifName`, `ifAlias`, `ifHCInOctets`, `ifOperStatus`) ; filtrez par macros les interfaces inutiles (`Null0`, VLAN internes) et n'alertez que sur les interfaces décrites (`ifAlias`).

## Élément SNMP personnalisé

| Champ | Exemple |
| --- | --- |
| Type | SNMP agent |
| Clé | `bgp.peer.state[10.255.0.1]` |
| OID | `get[1.3.6.1.2.1.15.3.1.2.10.255.0.1]` |
| Valeurs | Table de correspondance (*value mapping*) : 1 idle … 6 established |

Depuis Zabbix 6.4, `walk[OID1,OID2]` récupère des tables entières en une requête, puis des éléments dépendants (prétraitement *SNMP walk to JSON*) les découpent — beaucoup plus efficace.

## Traps SNMP

```bash
sudo apt install snmptrapd
# Script fourni par Zabbix (zabbix_trap_receiver.pl) ou SNMPTT pour formater les traps dans un fichier
```

```ini /etc/zabbix/zabbix_server.conf (extrait)
StartSNMPTrapper=1
SNMPTrapperFile=/var/log/snmptrap/snmptrap.log
```

Élément de type *SNMP trap* : `snmptrap["linkDown"]` ou `snmptrap.fallback` sur l'hôte correspondant à l'adresse source. Déclencheur sur la réception (avec retour à la normale manuel ou par expression).

## Découverte réseau

*Data collection → Discovery* : balayage d'une plage (`10.0.0.0/24`) par ICMP, SNMP (`SNMPv2-MIB::sysName.0`), ports TCP, agent. Les **actions de découverte** créent les hôtes, les placent dans des groupes et leur lient des modèles selon les réponses (`sysDescr` contient « Cisco IOS » → modèle Cisco).

## Dépendances et cause racine

Configurez des **dépendances de déclencheurs** : si le routeur d'un site est injoignable, les alertes des équipements derrière lui sont supprimées. Avec un **proxy** par site, la perte du proxy est aussi un signal clair.

## Cartes

*Monitoring → Maps* : topologie avec icônes, liens colorés selon l'état des déclencheurs (lien saturé, interface down), étiquettes de débit (`{?last(/r1/net.if.out[ifHCOutOctets.10101])}`), sous-cartes par site. Les cartes peuvent être générées par l'API depuis NetBox ou LLDP.

## Compléments

| Besoin | Outil |
| --- | --- |
| Flux (qui consomme la bande passante) | NetFlow/sFlow/IPFIX : ntopng, Akvorado, ElastiFlow — Zabbix ne les traite pas nativement |
| Télémétrie en flux (gNMI) | [[09-telegraf/01-presentation-configuration\|Telegraf]] / Prometheus |
| Configurations d'équipements | Oxidized, RANCID |
