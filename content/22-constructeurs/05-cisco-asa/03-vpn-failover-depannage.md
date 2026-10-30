---
title: VPN, haute disponibilité et dépannage
description: Exploiter un Cisco ASA — VPN site à site IKEv2 (crypto map ou VTI), VPN d'accès distant Cisco Secure Client (AnyConnect) avec authentification RADIUS/SAML et MFA, failover actif/passif (liens de failover et d'état, surveillance des interfaces), journaux et supervision, capture de paquets, commandes de diagnostic, durcissement (vulnérabilités exploitées sur les ASA) et problèmes fréquents.
tags: [cisco, asa, vpn, anyconnect, secure client, failover, capture, dépannage]
icon: bug
---

## VPN site à site (IKEv2, crypto map)

```asa
crypto ikev2 policy 10
 encryption aes-gcm-256
 integrity null
 group 19 20
 prf sha384
 lifetime seconds 86400
crypto ikev2 enable outside
crypto ipsec ikev2 ipsec-proposal PROP-GCM
 protocol esp encryption aes-gcm-256
 protocol esp integrity null
!
access-list ACL-VPN-LYON extended permit ip object OBJ-LAN object OBJ-LYON
crypto map CM-OUTSIDE 10 match address ACL-VPN-LYON
crypto map CM-OUTSIDE 10 set peer 198.51.100.20
crypto map CM-OUTSIDE 10 set ikev2 ipsec-proposal PROP-GCM
crypto map CM-OUTSIDE 10 set pfs group19
crypto map CM-OUTSIDE interface outside
!
tunnel-group 198.51.100.20 type ipsec-l2l
tunnel-group 198.51.100.20 ipsec-attributes
 ikev2 remote-authentication pre-shared-key CleTresLongueEtAleatoire
 ikev2 local-authentication pre-shared-key CleTresLongueEtAleatoire
```

Sans oublier l'**exemption de NAT** du trafic VPN ([[02-objets-nat-acl|NAT]]). Les ASA récents prennent aussi en charge les **VTI** (interface tunnel routée), utiles pour le routage dynamique et l'interopérabilité.

## VPN d'accès distant (Cisco Secure Client / AnyConnect)

```asa
webvpn
 enable outside
 anyconnect image disk0:/cisco-secure-client-win-5.1.x-webdeploy-k9.pkg 1
 anyconnect enable
 tunnel-group-list enable
!
ip local pool POOL-VPN 10.0.200.10-10.0.200.250 mask 255.255.255.0
aaa-server RADIUS-NPS protocol radius
aaa-server RADIUS-NPS (inside) host 10.0.10.81
 key CleRadiusTresLongue
 authentication-port 1812
!
group-policy GP-SALARIES internal
group-policy GP-SALARIES attributes
 vpn-tunnel-protocol ssl-client ikev2
 split-tunnel-policy tunnelspecified
 split-tunnel-network-list value ACL-SPLIT
 dns-server value 10.0.10.53 10.0.10.54
 default-domain value corp.exemple.fr
!
tunnel-group SALARIES type remote-access
tunnel-group SALARIES general-attributes
 address-pool POOL-VPN
 authentication-server-group RADIUS-NPS
 default-group-policy GP-SALARIES
tunnel-group SALARIES webvpn-attributes
 group-alias SALARIES enable
```

- **MFA** : RADIUS vers NPS + extension Entra MFA, Duo, ou **SAML** (Entra ID, Okta) — voir [[02-nps/02-8021x-vpn-equipements-depannage|NPS]].
- Certificat public sur l'interface `outside` (`ssl trust-point`), TLS 1.2+.
- **Posture** (HostScan / Secure Firewall Posture) et certificats machine pour n'autoriser que les postes de l'entreprise.

## Failover actif/passif

```asa
! Sur l'unité primaire
failover lan unit primary
failover lan interface FOLINK GigabitEthernet0/5
failover link STATELINK GigabitEthernet0/6
failover interface ip FOLINK 172.31.0.1 255.255.255.252 standby 172.31.0.2
failover interface ip STATELINK 172.31.0.5 255.255.255.252 standby 172.31.0.6
failover key CleFailoverTresLongue
failover
! Adresses de secours sur chaque interface
interface GigabitEthernet0/0
 ip address 203.0.113.2 255.255.255.248 standby 203.0.113.3
monitor-interface outside
monitor-interface inside
!
show failover
! forcer la bascule (depuis l'unité secondaire)
failover active
```

L'unité secondaire reçoit une configuration minimale (mêmes commandes `failover` avec `unit secondary`) puis copie toute la configuration du primaire. Le **lien d'état** réplique les connexions (bascule transparente pour les sessions).

## Journaux et supervision

- Syslog vers le SIEM (niveau *informational* : connexions construites/détruites — volumineux ; filtrer selon le besoin), SNMPv3, NetFlow (NSEL) pour les flux.
- ASDM : tableau de bord, *Real-Time Log Viewer*, graphiques de CPU, mémoire, connexions, sessions VPN.
- Messages utiles : `%ASA-4-106023` (refus par ACL), `%ASA-6-302013/302014` (connexion TCP créée/terminée), `%ASA-4-113019` (fin de session VPN avec motif).

## Capture et diagnostic

```asa
capture CAP-OUT interface outside match tcp host 198.51.100.77 host 203.0.113.5 eq 443
! paquets jetés par l'ASA et motif
capture CAP-ASP type asp-drop all
show capture CAP-OUT
show capture CAP-ASP | include 203.0.113.5
copy /pcap capture:CAP-OUT tftp://10.0.98.30/cap-out.pcap
no capture CAP-OUT
!
show conn address 10.0.30.10
show local-host 10.0.20.15
show vpn-sessiondb summary
show vpn-sessiondb anyconnect filter name alice
show crypto ikev2 sa detail
show crypto ipsec sa peer 198.51.100.20
show cpu usage ; show memory ; show traffic
```

## Sécurité

- [ ] Version d'ASA **à jour** : plusieurs vulnérabilités critiques des ASA/FTD ont été activement exploitées (campagne *ArcaneDoor* en 2024, failles du service web VPN en 2025) ; appliquer les correctifs rapidement et suivre les avis Cisco
- [ ] ASDM et SSH limités au réseau d'administration, jamais sur `outside`
- [ ] VPN avec MFA et certificats ; protection contre la pulvérisation de mots de passe (limitation, *threat detection* pour le VPN)
- [ ] Journaux envoyés hors de l'équipement, sauvegardes chiffrées (elles contiennent des secrets)

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Trafic refusé malgré une règle | ACL avec l'adresse traduite au lieu de la réelle, mauvaise interface | `packet-tracer`, ACL sur l'adresse réelle |
| Ping sortant sans réponse | Inspection ICMP absente | `inspect icmp` |
| VPN établi, pas de trafic | NAT appliquée au trafic VPN, route | Exemption de NAT, `show crypto ipsec sa` (encaps/decaps) |
| Clients Secure Client : erreur de certificat | Certificat autosigné ou incomplet (chaîne) | Certificat public avec chaîne complète |
| Failover : unités toutes deux actives | Lien de failover coupé | Câblage dédié et redondant, `show failover history` |
| ASDM ne se lance pas | Java, image ASDM incompatible, `http` non autorisé | Version d'ASDM compatible, `http <réseau> inside` |
