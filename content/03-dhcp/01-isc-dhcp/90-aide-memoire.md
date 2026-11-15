---
title: ISC DHCP — aide-mémoire des commandes
description: Référence complète des commandes et de la configuration ISC DHCP avec exemples — installation (Debian, RHEL, Alpine, FreeBSD), interfaces d'écoute, pare-feu, vérification et débogage, baux (lecture, comptage, occupation des plages avec dhcpd-pools), configuration (réseau partagé, clients inconnus refusés, détection de conflits, routes statiques option 121, option 43, journalisation de l'option 82, script sur attribution, téléphonie, classes, PXE), mises à jour DNS dynamiques, DHCPv6, relais (Linux et équipements Cisco, Aruba, FortiGate, MikroTik), basculement (état, partner-down), OMAPI (clé, réservation, consultation d'un bail) et tests.
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

## Installation et service

```bash
sudo apt install isc-dhcp-server                   # Debian / Ubuntu (service isc-dhcp-server)
sudo dnf install dhcp-server                       # RHEL / Rocky / Alma (services dhcpd et dhcpd6)
sudo apk add dhcp                                  # Alpine
sudo pkg install isc-dhcp44-server && sudo sysrc dhcpd_enable=YES dhcpd_ifaces="em1"   # FreeBSD
sudo firewall-cmd --permanent --add-service=dhcp && sudo firewall-cmd --reload
sudo ufw allow 67/udp
# RHEL : interfaces d'écoute dans une surcharge du service
sudo systemctl edit dhcpd        # [Service] puis ExecStart= et ExecStart=/usr/sbin/dhcpd -f -cf /etc/dhcp/dhcpd.conf -user dhcpd -group dhcpd --no-pid eth1
```

## Baux : analyse

```bash
grep -c "binding state active" /var/lib/dhcp/dhcpd.leases          # baux actifs (approximation)
grep -A3 "hardware ethernet 00:11:22:33:44:55" /var/lib/dhcp/dhcpd.leases | head
sudo apt install dhcpd-pools && dhcpd-pools -c /etc/dhcp/dhcpd.conf -l /var/lib/dhcp/dhcpd.leases   # occupation de chaque plage
dhcpd-pools -c /etc/dhcp/dhcpd.conf -l /var/lib/dhcp/dhcpd.leases --warning=80 --critical=95   # seuils d'alerte (sonde de supervision)
```

## Configuration : compléments

```dhcp /etc/dhcp/dhcpd.conf (extraits)
# Détecter une adresse déjà utilisée (ping avant attribution)
ping-check true;
one-lease-per-client true;

# Plusieurs sous-réseaux sur le même segment physique
shared-network vlan20 {
  subnet 10.0.20.0 netmask 255.255.255.0 { range 10.0.20.50 10.0.20.250; option routers 10.0.20.1; }
  subnet 10.0.21.0 netmask 255.255.255.0 { range 10.0.21.10 10.0.21.250; option routers 10.0.21.1; }
}

# Refuser les clients sans réservation
subnet 10.0.30.0 netmask 255.255.255.0 {
  option routers 10.0.30.1;
  pool { deny unknown-clients; range 10.0.30.100 10.0.30.150; }
}

# Routes statiques sans classe (option 121) : 10.20.0.0/16 via 10.0.20.254, défaut via 10.0.20.1
option rfc3442-classless-static-routes code 121 = array of integer 8;
option rfc3442-classless-static-routes 16, 10, 20, 10, 0, 20, 254, 0, 10, 0, 20, 1;

# Option 43 pour les points d'accès Cisco : TLV f1, longueur 4, adresse du contrôleur 10.0.10.5
class "ap-cisco" {
  match if substring(option vendor-class-identifier, 0, 8) = "Cisco AP";
  option vendor-encapsulated-options f1:04:0a:00:0a:05;
}

# Journaliser l'option 82 (circuit-id du commutateur relais)
log(info, concat("Bail ", binary-to-ascii(10, 8, ".", leased-address), " circuit-id ", binary-to-ascii(16, 8, ":", option agent.circuit-id)));

# Script à chaque attribution (adresse, MAC)
on commit {
  execute("/usr/local/bin/bail-attribue.sh", binary-to-ascii(10, 8, ".", leased-address), binary-to-ascii(16, 8, ":", substring(hardware, 1, 6)));
}
```

## Mises à jour DNS dynamiques

```dhcp /etc/dhcp/dhcpd.conf (extrait)
ddns-update-style standard;
ddns-domainname "exemple.fr.";
ddns-rev-domainname "in-addr.arpa.";
update-static-leases on;
include "/etc/dhcp/cle-ddns.key";
zone exemple.fr. { primary 10.0.10.53; key cle-ddns; }
zone 20.0.10.in-addr.arpa. { primary 10.0.10.53; key cle-ddns; }
```

```bash
tsig-keygen -a hmac-sha256 cle-ddns | sudo tee /etc/dhcp/cle-ddns.key    # même clé déclarée dans BIND
sudo chmod 640 /etc/dhcp/cle-ddns.key
```

## DHCPv6

```bash
sudo dhcpd -6 -t -cf /etc/dhcp/dhcpd6.conf
sudo systemctl restart isc-dhcp-server             # Debian : INTERFACESv6 dans /etc/default/isc-dhcp-server ; RHEL : dhcpd6
less /var/lib/dhcp/dhcpd6.leases
```

## Relais : équipements

```text
! Cisco IOS / IOS XE (interface du VLAN des clients)
interface Vlan20
 ip helper-address 10.0.10.67
 ip helper-address 10.0.10.68
! Aruba AOS-CX
interface vlan 20
    ip helper-address 10.0.10.67
# FortiGate
config system interface
    edit "vlan20"
        set dhcp-relay-service enable
        set dhcp-relay-ip "10.0.10.67" "10.0.10.68"
    next
end
# MikroTik RouterOS
/ip dhcp-relay add name=relais-vlan20 interface=vlan20 dhcp-server=10.0.10.67,10.0.10.68 disabled=no
```

```bash
# Relais Linux (Debian : /etc/default/isc-dhcp-relay → SERVERS et INTERFACES)
sudo systemctl restart isc-dhcp-relay
```

## Basculement : état et reprise

```bash
grep -A6 'failover peer "dhcp-ha" state' /var/lib/dhcp/dhcpd.leases     # my state / partner state
sudo journalctl -u isc-dhcp-server | grep -i "failover peer"
```

Partenaire définitivement hors service : passer l'autre serveur en *partner-down* (il distribue alors toute la plage après le délai MCLT) :

```bash
omshell <<'EOF'
server 127.0.0.1
port 7911
key omapi_key "c2VjcmV0LW9tYXBpLWJhc2U2NA=="
connect
new failover-state
set name = "dhcp-ha"
open
set local-state = 1
update
EOF
```

## OMAPI : clé et consultation

```dhcp /etc/dhcp/dhcpd.conf (extrait)
omapi-port 7911;
key omapi_key { algorithm hmac-md5; secret "c2VjcmV0LW9tYXBpLWJhc2U2NA=="; }
omapi-key omapi_key;
```

```bash
# Consulter un bail
omshell <<'EOF'
server 127.0.0.1
port 7911
key omapi_key "c2VjcmV0LW9tYXBpLWJhc2U2NA=="
connect
new lease
set ip-address = 10.0.20.57
open
EOF
```
