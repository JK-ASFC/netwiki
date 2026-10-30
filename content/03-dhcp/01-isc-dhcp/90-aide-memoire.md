---
title: ISC DHCP — aide-mémoire des commandes
description: Commandes et syntaxe ISC DHCP avec exemples — vérification (dhcpd -t), service, interfaces d'écoute, baux (dhcpd.leases), sous-réseaux, réservations, options courantes (routeurs, DNS, NTP, 66/150, 43), classes et pools, relais (isc-dhcp-relay), basculement, OMAPI (omshell), DHCPv6, tests (dhclient, nmap, dhcping) et migration vers Kea.
tags: [aide-mémoire, isc-dhcp, dhcpd, dhcp, relais, omshell]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|ISC DHCP]]. ISC DHCP n'est plus maintenu depuis 2022 : préférez [[02-kea/90-aide-memoire|Kea]] pour les nouveaux déploiements.

## Service et vérification

```bash
sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf              # syntaxe
sudo dhcpd -T -lf /var/lib/dhcp/dhcpd.leases        # fichier de baux
sudo systemctl restart isc-dhcp-server               # RHEL : dhcpd
# Interfaces d'écoute (Debian)
sudo sed -i 's/^INTERFACESv4=.*/INTERFACESv4="eth1 eth2"/' /etc/default/isc-dhcp-server
sudo dhcpd -d -f -cf /etc/dhcp/dhcpd.conf eth1      # premier plan, débogage (service arrêté)
sudo journalctl -u isc-dhcp-server -f
```

## Baux

```bash
less /var/lib/dhcp/dhcpd.leases
grep -B1 -A8 "lease 10.0.20.57" /var/lib/dhcp/dhcpd.leases
dhcp-lease-list --lease /var/lib/dhcp/dhcpd.leases   # tableau des baux actifs (paquet isc-dhcp-server)
```

## Configuration type

```dhcp
# /etc/dhcp/dhcpd.conf
authoritative;
default-lease-time 28800;
max-lease-time 86400;
option domain-name "exemple.fr";
option domain-name-servers 10.0.10.53, 10.0.10.54;
option ntp-servers 10.0.10.123;
log-facility local7;

subnet 10.0.20.0 netmask 255.255.255.0 {
  range 10.0.20.50 10.0.20.250;
  option routers 10.0.20.1;
  option broadcast-address 10.0.20.255;
}

# Réservation
host imprimante-rdc {
  hardware ethernet 00:11:22:33:44:55;
  fixed-address 10.0.20.10;
}

# Option 66 / 150 pour la téléphonie
option tftp-server-name "https://prov.exemple.fr/";
option voip-tftp code 150 = ip-address;
subnet 10.0.40.0 netmask 255.255.255.0 {
  range 10.0.40.50 10.0.40.250;
  option routers 10.0.40.1;
  option voip-tftp 10.0.40.5;
}

# Classe par fabricant (ex. postes Yealink) et pool réservé
class "yealink" {
  match if substring(hardware, 1, 3) = 80:5e:c0;
}
subnet 10.0.41.0 netmask 255.255.255.0 {
  option routers 10.0.41.1;
  pool {
    allow members of "yealink";
    range 10.0.41.50 10.0.41.200;
  }
}

# PXE BIOS / UEFI
option arch code 93 = unsigned integer 16;
if option arch = 00:07 { filename "grubx64.efi"; } else { filename "pxelinux.0"; }
next-server 10.0.10.69;
```

## Relais

```bash
sudo apt install isc-dhcp-relay
sudo dhcrelay -d -i eth0 -i eth1 10.0.10.67          # test au premier plan
# Équivalent sur un routeur Cisco : ip helper-address 10.0.10.67 sur l'interface du VLAN
```

## Basculement (failover)

```dhcp
failover peer "dhcp-ha" {
  primary;
  address 10.0.10.67;  port 647;
  peer address 10.0.10.68;  peer port 647;
  max-response-delay 60;  max-unacked-updates 10;
  mclt 3600;  split 128;  load balance max seconds 3;
}
subnet 10.0.20.0 netmask 255.255.255.0 {
  option routers 10.0.20.1;
  pool { failover peer "dhcp-ha"; range 10.0.20.50 10.0.20.250; }
}
```

## OMAPI (modifications à chaud)

```bash
omshell <<'EOF'
server 127.0.0.1
port 7911
key omapi_key "base64=="
connect
new host
set name = "poste-42"
set hardware-address = 00:aa:bb:cc:dd:42
set hardware-type = 1
set ip-address = 10.0.20.42
create
EOF
```

## Tests

```bash
sudo dhclient -v -r eth0 && sudo dhclient -v eth0      # relâcher puis demander une adresse
sudo nmap --script broadcast-dhcp-discover -e eth0      # serveurs DHCP présents (détecter un serveur pirate)
sudo tcpdump -ni eth0 port 67 or port 68 -vv
```
