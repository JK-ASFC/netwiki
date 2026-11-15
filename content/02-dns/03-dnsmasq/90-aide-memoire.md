---
title: dnsmasq — aide-mémoire des commandes
description: Référence complète des commandes et options dnsmasq avec exemples — installation (Debian/Ubuntu, RHEL, Alpine, Arch, FreeBSD, macOS) et conflit avec systemd-resolved, service et signaux (rechargement, statistiques), options DNS (amont, redirection par domaine, noms locaux, enregistrements host, SRV, MX, TXT, PTR, CNAME, blocage, protection contre le rebinding, DNSSEC, ensembles nftables, journalisation), options DHCP (plages, réservations, étiquettes, clients inconnus refusés, options, routes statiques, relais, script de bail, IPv6 et annonces de routeur), TFTP et PXE, baux, tests et diagnostic.
tags: [aide-mémoire, dnsmasq, dns, dhcp, tftp, pxe]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|dnsmasq]].

## Service et contrôle

```bash
dnsmasq --test                                   # syntaxe de /etc/dnsmasq.conf et /etc/dnsmasq.d/
sudo systemctl restart dnsmasq
sudo dnsmasq --no-daemon --log-queries --log-dhcp      # premier plan, tout est affiché (service arrêté)
sudo pkill -HUP dnsmasq                          # relire /etc/hosts, fichiers addn-hosts et vider le cache
sudo pkill -USR1 dnsmasq                         # statistiques du cache dans le journal
sudo journalctl -u dnsmasq -f
cat /var/lib/misc/dnsmasq.leases                 # baux DHCP (Debian ; RHEL : /var/lib/dnsmasq/dnsmasq.leases)
dnsmasq --version
```

## Options DNS

```ini
# /etc/dnsmasq.d/dns.conf
domain-needed
bogus-priv
no-resolv
server=1.1.1.1
server=9.9.9.9
server=/corp.exemple.fr/10.0.10.11
server=/10.in-addr.arpa/10.0.10.11
local=/maison.lan/
domain=maison.lan
expand-hosts
address=/nas.maison.lan/192.168.1.5
address=/publicite.exemple.net/0.0.0.0
cname=www.maison.lan,nas.maison.lan
cache-size=10000
listen-address=127.0.0.1,192.168.1.1
interface=eth1
```

## Options DHCP

```ini
# /etc/dnsmasq.d/dhcp.conf
dhcp-range=192.168.1.100,192.168.1.200,255.255.255.0,12h
dhcp-range=set:invites,192.168.50.100,192.168.50.200,4h
dhcp-option=option:router,192.168.1.1
dhcp-option=option:dns-server,192.168.1.1
dhcp-option=tag:invites,option:dns-server,9.9.9.9
dhcp-option=option:ntp-server,192.168.1.1
dhcp-option=66,"https://prov.maison.lan/"
dhcp-host=aa:bb:cc:dd:ee:ff,imprimante,192.168.1.20
dhcp-host=11:22:33:44:55:66,ignore
dhcp-authoritative
dhcp-leasefile=/var/lib/misc/dnsmasq.leases
```

## TFTP / PXE

```ini
enable-tftp
tftp-root=/srv/tftp
dhcp-match=set:efi64,option:client-arch,7
dhcp-boot=tag:efi64,grubx64.efi
dhcp-boot=tag:!efi64,pxelinux.0
# Proxy DHCP (un autre serveur distribue déjà les adresses)
dhcp-range=192.168.1.0,proxy
pxe-service=x86PC,"Démarrage réseau",pxelinux
```

## Tests

```bash
dig @192.168.1.1 nas.maison.lan +short
dig @192.168.1.1 -x 192.168.1.5 +short
sudo nmap --script broadcast-dhcp-discover -e eth1     # voir les serveurs DHCP qui répondent
```

## Installation

```bash
sudo apt install dnsmasq                               # Debian / Ubuntu
sudo dnf install dnsmasq                               # RHEL / Rocky / Alma / Fedora
sudo apk add dnsmasq                                   # Alpine
sudo pacman -S dnsmasq                                 # Arch
sudo pkg install dnsmasq && sudo sysrc dnsmasq_enable=YES   # FreeBSD
brew install dnsmasq && sudo brew services start dnsmasq    # macOS (configuration : $(brew --prefix)/etc/dnsmasq.conf)
sudo systemctl enable --now dnsmasq

# Ubuntu : libérer le port 53 occupé par le résolveur local de systemd-resolved
sudo sed -i 's/^#\?DNSStubListener=.*/DNSStubListener=no/' /etc/systemd/resolved.conf
sudo systemctl restart systemd-resolved
sudo ss -ulpn | grep ':53 '
```

## Options DNS complémentaires

```ini /etc/dnsmasq.d/dns-avance.conf
# Écouter seulement sur les interfaces nommées (plusieurs instances possibles)
bind-interfaces
# Interroger les serveurs amont dans l'ordre, ou tous à la fois
strict-order
# Domaine local : jamais transmis à l'amont
local=/maison.lan/
# Fichiers d'hôtes supplémentaires (rechargés par SIGHUP)
addn-hosts=/etc/dnsmasq.hosts
# Enregistrements explicites
host-record=nas.maison.lan,192.168.1.5,fd00::5
srv-host=_ldap._tcp.maison.lan,dc.maison.lan,389,0,100
mx-host=maison.lan,mail.maison.lan,10
txt-record=maison.lan,"v=spf1 mx -all"
ptr-record=5.1.168.192.in-addr.arpa,nas.maison.lan
# Protection contre le rebinding (adresses privées refusées dans les réponses publiques), sauf domaine interne
stop-dns-rebind
rebind-domain-ok=/corp.exemple.fr/
# Validation DNSSEC
dnssec
conf-file=/usr/share/dnsmasq-base/trust-anchors.conf
# Résolutions de certains domaines ajoutées à un ensemble nftables (routage ou filtrage par domaine)
nftset=/vpn.exemple.com/4#inet#filtre#via_vpn
# Cache
cache-size=10000
neg-ttl=60
# Journal détaillé des requêtes dans un fichier
log-queries=extra
log-facility=/var/log/dnsmasq.log
log-async=25
```

## Options DHCP complémentaires

```ini /etc/dnsmasq.d/dhcp-avance.conf
# Plage réservée aux adresses fixes (aucune distribution dynamique)
dhcp-range=192.168.10.0,static,255.255.255.0,12h
# Refuser les clients sans réservation
dhcp-ignore=tag:!known
# Réservation par identifiant client et étiquette
dhcp-host=id:01:aa:bb:cc:dd:ee:ff,poste-direction,192.168.1.30,set:vip
dhcp-option=tag:vip,option:dns-server,192.168.1.1,192.168.1.2
# Suffixes de recherche, MTU, routes statiques sans classe (option 121)
dhcp-option=option:domain-search,maison.lan,corp.exemple.fr
dhcp-option=option:mtu,1400
dhcp-option=121,10.20.0.0/16,192.168.1.254,0.0.0.0/0,192.168.1.1
# Nombre maximal de baux
dhcp-lease-max=500
# Relais vers un serveur DHCP central (dnsmasq en relais sur l'interface eth2)
dhcp-relay=192.168.60.1,10.0.10.67,eth2
# Script lancé à chaque bail (add, old, del)
dhcp-script=/usr/local/bin/bail-dnsmasq.sh
# IPv6 : annonces de routeur et DHCPv6 sans état
enable-ra
dhcp-range=::,constructor:eth1,ra-stateless,64,12h
```

```bash
# Lister les options DHCP connues par nom
dnsmasq --help dhcp
dnsmasq --help dhcp6
```

## Baux, tests, diagnostic

```bash
# Format d'une ligne de bail : expiration (epoch) MAC IP nom identifiant-client
awk '{ printf "%s %-17s %-15s %s\n", strftime("%F %T", $1), $2, $3, $4 }' /var/lib/misc/dnsmasq.leases
sudo pkill -USR1 dnsmasq && sudo journalctl -u dnsmasq -n 20      # statistiques du cache et des serveurs amont
dig @192.168.1.1 _ldap._tcp.maison.lan SRV +short
dig @192.168.1.1 maison.lan MX +short
sudo dhclient -v -1 eth0                                          # demander un bail depuis un client Linux
sudo tcpdump -ni eth1 port 67 or port 68 -vv                      # échanges DHCP
sudo tcpdump -ni eth1 port 69                                     # TFTP (PXE)
sudo tail -f /var/log/dnsmasq.log
```
