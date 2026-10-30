---
title: Postes IP et provisionnement — aide-mémoire
description: Commandes pour déployer et dépanner les postes IP avec exemples — vérifications du port de commutateur (LLDP-MED, PoE, VLAN voix), options DHCP (Kea, ISC, Windows), serveur de provisionnement HTTPS (journaux, droits, test d'un fichier par adresse MAC), captures DHCP/SIP, réinitialisation et mise à jour des postes.
tags: [aide-mémoire, téléphones ip, provisionnement, dhcp, lldp-med, poe]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-postes-ip-provisionnement|postes IP et provisionnement]].

## Port de commutateur

```cisco
show lldp neighbors GigabitEthernet1/0/12 detail
show power inline GigabitEthernet1/0/12
show interfaces GigabitEthernet1/0/12 switchport
show mac address-table interface GigabitEthernet1/0/12
```

```aoscx
show lldp neighbor-info 1/1/12
show power-over-ethernet 1/1/12
show vlan port 1/1/12
```

## Options DHCP

```powershell
Get-DhcpServerv4OptionValue -ScopeId 10.0.40.0 -All | Where-Object OptionId -in 42, 66, 150, 160
Get-DhcpServerv4Lease -ScopeId 10.0.40.0 | Where-Object ClientId -like "80-5e-c0*"     # postes Yealink
```

```bash
grep -E "tftp-server-name|ntp-servers" /etc/kea/kea-dhcp4.conf
grep -A3 "lease 10.0.40." /var/lib/dhcp/dhcpd.leases | head      # ISC DHCP
```

## Serveur de provisionnement

```bash
curl -sk -u poste:"$MDP" https://prov.exemple.fr/yealink/805ec0a1b2c3.cfg | head      # le fichier est-il servi ?
sudo tail -f /var/log/nginx/access.log | grep -i "yealink\|\.cfg"                     # requêtes des postes
sudo chmod 640 /var/www/prov/yealink/*.cfg && sudo chown root:www-data /var/www/prov/yealink/*.cfg
```

## Captures

```bash
sudo tcpdump -ni eth0 'ether host 80:5e:c0:a1:b2:c3' -w /tmp/poste.pcap           # tout le trafic d'un poste
sudo tcpdump -ni eth0 'port 67 or port 68' -vv                                       # échange DHCP (options reçues)
```

## Postes (interface web ou menu)

| Action | Où |
| --- | --- |
| Réinitialisation usine | Menu du poste → *Paramètres avancés → Réinitialiser* (code d'administration) |
| Forcer le provisionnement | Interface web → *Paramètres → Auto Provision → Autoprovision Now* (Yealink) |
| Micrologiciel | Fichier de configuration (`static.firmware.url`) ou interface web |
| Journaux | Interface web → *Paramètres → Configuration → Export System Log* |
