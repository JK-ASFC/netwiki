---
title: Palo Alto PAN-OS — aide-mémoire des commandes
description: Commandes PAN-OS avec exemples — mode opérationnel et configuration (set, show, commit, validate, revert), état et ressources, routes et interfaces, sessions, test de politiques de sécurité et de NAT, compteurs de rejets, captures, VPN, User-ID, haute disponibilité, mises à jour de contenu et du logiciel, sauvegarde.
tags: [aide-mémoire, palo alto, pan-os, commit, test security-policy-match]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-acces-cli-webui|accès, CLI et WebUI]], [[02-politiques-nat-globalprotect|politiques, NAT, GlobalProtect]] et [[03-panorama-ha-depannage|Panorama, HA, dépannage]].

```panos
set cli pager off
set cli config-output-format set
show system info
show system resources
show interface all
show routing route
show session all filter source 10.0.20.15
show session info
show counter global filter delta yes severity drop
test security-policy-match from TRUST to UNTRUST source 10.0.20.15 destination 8.8.8.8 protocol 6 destination-port 443 application ssl
test nat-policy-match from TRUST to UNTRUST source 10.0.20.15 destination 8.8.8.8 protocol 6 destination-port 443
show vpn ike-sa
show vpn ipsec-sa
show user ip-user-mapping all
show high-availability state
show jobs all
request content upgrade check
request content upgrade install version latest
request system software check
save config to sauvegarde.xml
configure
show | match "rulebase security"
validate full
commit description "Modification de la règle web"
revert config
exit
```
