---
title: Haute disponibilité, diagnostic et dépannage
description: Exploiter un FortiGate — cluster HA FGCP (actif/passif, liens de heartbeat, surveillance des ports, synchronisation, bascule), commandes de diagnostic (debug flow, sessions, sniffer, top, crashlog), dépannage des VPN IPsec (ike, tunnels), des mises à jour FortiGuard et de l'authentification, routage (tables, routes de politique), journaux (FortiAnalyzer, syslog), sécurisation et problèmes fréquents.
tags: [fortinet, fortigate, ha, debug flow, sniffer, diagnostic, dépannage, ipsec]
icon: bug
---

Les commandes ci-dessous reprennent et détaillent l'essentiel des aide-mémoire CLI FortiGate (structure `config`/`edit`/`set`, commandes `get`, `diagnose`, `execute`).

## Haute disponibilité (FGCP)

```fortios
config system ha
    set group-name "CLUSTER-PARIS"
    set group-id 10
    # actif/passif (a-a : actif/actif)
    set mode a-p
    set password CleClusterHaTresLongue
    # liens de heartbeat (deux, dédiés)
    set hbdev "port9" 50 "port10" 50
    # synchronisation des sessions (bascule transparente)
    set session-pickup enable
    # bascule si un port surveillé tombe
    set monitor "port1" "port2"
    # 100 sur l'autre membre
    set priority 200
    set override disable
end
```

| Commande | Rôle |
| --- | --- |
| `get system ha status` / `diagnose sys ha status` | État du cluster, membres, principal |
| `diagnose sys ha history read` | Historique des événements HA |
| `diagnose sys ha checksum cluster` | Sommes de contrôle de configuration des membres (doivent être identiques) |
| `execute ha synchronize start` | Forcer la synchronisation |
| `execute ha manage <id> <admin>` | Se connecter à un membre secondaire depuis le principal |
| `diagnose sys ha reset-uptime` | Réinitialiser le critère d'ancienneté pour provoquer une bascule (si `override` désactivé) |
| `diagnose sniffer packet <hbdev> 'ether[12:2]=0x8890' 6` | Observer les heartbeats |
| `diagnose debug application hatalk 1` / `hasync 1` | Déboguer la négociation / la synchronisation HA |

Les deux membres doivent avoir le **même modèle, la même version et les mêmes licences**. Liens de heartbeat directs (pas à travers un commutateur partagé avec le trafic), redondants.

## Suivre un flux : debug flow

```fortios
diagnose debug reset
diagnose debug flow filter clear
diagnose debug flow filter saddr 10.0.20.15
diagnose debug flow filter daddr 8.8.8.8
diagnose debug flow show function-name enable
diagnose debug flow show iprope enable
diagnose debug console timestamp enable
diagnose debug enable
# 20 paquets
diagnose debug flow trace start 20
# … reproduire le problème …
diagnose debug disable
diagnose debug reset
```

La sortie indique la **route** trouvée, la **politique** appliquée (`Allowed by Policy-12` ou `Denied by forward policy check (policy 0)`), la NAT, la session créée. C'est l'outil de base pour répondre à « pourquoi ce trafic ne passe pas ? ».

## Sessions et capture

```fortios
diagnose sys session filter clear
diagnose sys session filter src 10.0.20.15
diagnose sys session filter dst 8.8.8.8
diagnose sys session list
# supprime les sessions correspondant au filtre (prudence)
diagnose sys session clear

diagnose sniffer packet any 'host 10.0.20.15 and port 443' 4 20 l
# niveau 4 : en-têtes avec nom d'interface ; 20 paquets ; l : horodatage local
```

La sortie du sniffer (niveau 6) se convertit en fichier pcap (script *fgt2eth*) pour [[02-reseau-diagnostic/02-wireshark-analyse|Wireshark]] ; les versions récentes permettent une capture depuis l'interface graphique (*Network → Diagnostics → Packet Capture*).

## Ressources

```fortios
get system performance status
# processus (Maj+P : tri CPU, Maj+M : tri mémoire)
diagnose sys top 5 20
diagnose sys top-summary '-s mem'
# disques et partitions
diagnose hardware deviceinfo disk
# plantages de processus
diagnose debug crashlog read
# collecte complète pour le support
diagnose debug report
```

Le **mode de conservation** (*conserve mode*) se déclenche quand la mémoire est saturée : les profils de sécurité peuvent être contournés ou le trafic bloqué selon la configuration — surveiller la mémoire.

## Routage

```fortios
# table active
get router info routing-table all
# routes configurées (y compris inactives)
get router info routing-table database
# route utilisée vers une adresse
get router info routing-table details 10.60.1.10
# routes de politique et SD-WAN
diagnose firewall proute list
# table du noyau
diagnose ip route list
```

## VPN IPsec

```fortios
# phases 1
diagnose vpn ike gateway list
# phases 2 et compteurs
diagnose vpn tunnel list
# réinitialiser une phase 1
diagnose vpn ike gateway flush name VPN-LYON
# monter une phase 2
diagnose vpn tunnel up VPN-LYON-P2
diagnose debug application ike -1
diagnose vpn ike log-filter dst-addr4 198.51.100.20
diagnose debug enable
```

## FortiGuard et journaux

- `execute update-now`, `diagnose autoupdate versions`, `diagnose debug rating` ; débogage du téléchargement : `diagnose debug application update -1`.
- Journaux : disque local (selon modèle), **FortiAnalyzer** (centralisation, rapports, corrélation), FortiCloud, ou **syslog** vers le SIEM :

```fortios
config log syslogd setting
    set status enable
    set server "10.0.98.20"
    # TCP
    set mode reliable
    set format rfc5424
end
execute log filter category traffic
execute log display
```

## Sécurisation

- [ ] FortiOS sur une version **maintenue et corrigée** ; suivre les avis du PSIRT Fortinet (vulnérabilités critiques fréquemment exploitées sur les interfaces SSL-VPN et d'administration)
- [ ] Administration **jamais** exposée sur Internet (pas de `https`/`ssh` dans `allowaccess` du WAN), hôtes de confiance, MFA
- [ ] Comptes nominatifs, journalisation des actions d'administration
- [ ] VPN avec MFA ; SSL-VPN désactivé s'il n'est pas utilisé
- [ ] Sauvegardes chiffrées de la configuration, hors de l'équipement

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `Denied by forward policy check (policy 0)` | Aucune politique ne correspond (interfaces, adresses, service) | Créer/ajuster la politique, vérifier l'ordre |
| `reverse path check fail, drop` | Route de retour absente ou asymétrique (anti-usurpation) | Corriger le routage ; `set asymroute` en dernier recours |
| Le VPN monte mais pas de trafic | Politique ou route manquante, NAT activée sur la politique VPN | Deux politiques sans NAT, route vers le tunnel |
| Site web cassé avec l'inspection | Inspection profonde sans AC de confiance ou application à épinglage de certificat | Déployer l'AC, exemptions |
| Cluster HA : configurations différentes | Synchronisation bloquée | `diagnose sys ha checksum cluster`, `execute ha synchronize start` |
| Mise à jour FortiGuard impossible | DNS, accès sortant, licence expirée | `diagnose debug rating`, DNS, *System → FortiGuard* |
