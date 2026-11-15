---
title: Kismet et défense contre l'homme du milieu — aide-mémoire
description: Commandes de surveillance et de protection — Kismet (installation, adaptateur en mode moniteur, lancement, kismet_site.conf, alerte apspoof, export kismetdb, API REST, sonde distante), commutateurs Cisco et Aruba (DHCP snooping, inspection ARP, IP Source Guard, port-security, RA Guard, vérifications), arpwatch, Windows (LLMNR, NetBIOS, signature SMB) et hostapd (WPA3, 802.11w).
tags: [aide-mémoire, kismet, wids, dhcp snooping, dai, ra guard, arpwatch, wpa3, 802.11w]
icon: terminal
---

Explications : [[01-kismet|Kismet]] · [[02-defense-homme-du-milieu-wifi|défense contre l'homme du milieu et les attaques Wi-Fi]].

## Kismet (vos réseaux uniquement)

```bash
# Installation (dépôt de la distribution) et droits
sudo apt install kismet
sudo usermod -aG kismet "$USER"

# Adaptateur compatible mode moniteur ?
iw dev
iw list | grep -A 10 "Supported interface modes"
nmcli device set wlx00c0ca123456 managed no

# Lancement (interface web : http://127.0.0.1:2501)
kismet -c wlx00c0ca123456
ssh -L 2501:127.0.0.1:2501 admin@srv-kismet.corp.exemple.fr   # accès distant par tunnel

# Journaux
kismetdb_statistics --in /var/log/kismet/Kismet-20261115-09-00-00-1.kismet
kismetdb_dump_devices --in /var/log/kismet/Kismet-20261115-09-00-00-1.kismet --out appareils.json
kismetdb_strip_packets --in /var/log/kismet/Kismet-20261115-09-00-00-1.kismet --out sonde-a-sans-paquets.kismet

# Alertes en JSON pour le SIEM
curl -s -u admin:MotDePasseLongEtUnique http://127.0.0.1:2501/alerts/all_alerts.json | jq '.[] | .["kismet.alert.header"]'

# Sonde distante vers le serveur central
sudo kismet_cap_linux_wifi --connect 10.0.99.30:3501 --source=wlan1:name=sonde-site-lyon
```

```ini /etc/kismet/kismet_site.conf
server_name=sonde-batiment-a
source=wlx00c0ca123456:name=wifi-batiment-a
httpd_bind_address=127.0.0.1
log_prefix=/var/log/kismet/
log_types=kismet
kis_log_packets=false
apspoof=CorpWifi:ssid="Corp-WiFi",validmacs="00:11:22:33:44:55,00:11:22:33:44:56"
```

## Cisco : DHCP snooping, DAI, IP Source Guard, RA Guard

```text
ip dhcp snooping
ip dhcp snooping vlan 20,30
no ip dhcp snooping information option
ip arp inspection vlan 20,30
ip arp inspection validate src-mac dst-mac ip
interface GigabitEthernet1/0/48
 ip dhcp snooping trust
 ip arp inspection trust
interface range GigabitEthernet1/0/1 - 46
 switchport mode access
 ip dhcp snooping limit rate 15
 ip arp inspection limit rate 15
 ip verify source
 switchport port-security
 switchport port-security maximum 2
 switchport port-security violation restrict
ip source binding 0050.56aa.bb01 vlan 20 10.0.20.15 interface GigabitEthernet1/0/5
ipv6 nd raguard policy HOTES
 device-role host
interface range GigabitEthernet1/0/1 - 46
 ipv6 nd raguard attach-policy HOTES
```

```text
show ip dhcp snooping
show ip dhcp snooping binding
show ip arp inspection statistics vlan 20
show ip verify source
show port-security
show ipv6 nd raguard policy HOTES
show logging | include DAI|DHCP_SNOOPING|PSECURE
```

## Aruba AOS-CX

```text
dhcpv4-snooping
vlan 20
    dhcpv4-snooping
    arp inspection
interface 1/1/48
    dhcpv4-snooping trust
    arp inspection trust
show dhcpv4-snooping binding
show arp inspection statistics
```

## arpwatch (Linux)

```bash
sudo apt install arpwatch
sudo systemctl enable --now arpwatch@ens192
journalctl -u arpwatch@ens192 | grep -E "changed ethernet address|flip flop"
ip neigh show dev ens192
```

## Windows (PowerShell, postes et serveurs)

```powershell
# LLMNR désactivé (équivalent de la GPO)
New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\DNSClient" -Name EnableMulticast -Value 0 -Type DWord

# NetBIOS sur TCP/IP désactivé sur toutes les cartes (2 = désactivé)
Get-ChildItem "HKLM:\SYSTEM\CurrentControlSet\Services\NetBT\Parameters\Interfaces" | ForEach-Object { Set-ItemProperty -Path $_.PSPath -Name NetbiosOptions -Value 2 }

# Signature SMB exigée
Set-SmbClientConfiguration -RequireSecuritySignature $true -Force
Set-SmbServerConfiguration -RequireSecuritySignature $true -Force
Get-SmbClientConfiguration | Select-Object RequireSecuritySignature
```

## Wi-Fi : hostapd en WPA3 avec 802.11w

```ini /etc/hostapd/hostapd.conf
ssid=Corp-WiFi
wpa=2
wpa_key_mgmt=SAE WPA-PSK
rsn_pairwise=CCMP
ieee80211w=1
sae_require_mfp=1
wpa_passphrase=Remplacer-Par-Une-Cle-Aleatoire-De-Plus-De-20-Caracteres
```

```bash
# WPA3 seul, PMF obligatoire : wpa_key_mgmt=SAE et ieee80211w=2
sudo systemctl restart hostapd
# Générer une clé WPA2 longue et aléatoire (anciens appareils)
openssl rand -base64 24
```
