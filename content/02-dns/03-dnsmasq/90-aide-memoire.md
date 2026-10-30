---
title: dnsmasq — aide-mémoire des commandes
description: Commandes et options dnsmasq avec exemples — vérification de la configuration (--test), lancement au premier plan pour le débogage, rechargement (SIGHUP) et statistiques du cache (SIGUSR1), baux DHCP, options DNS (server, address, local, domain, cache-size), DHCP (dhcp-range, dhcp-host, dhcp-option, tags), TFTP/PXE, journaux et tests.
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
