---
title: OpenWrt et OpenWISP — aide-mémoire des commandes
description: Commandes OpenWrt avec exemples — uci (show, get, set, add_list, delete, commit, revert, changes), services (network, firewall, dnsmasq, wifi), diagnostic (ip, bridge vlan, logread, iwinfo, wifi status, nft), paquets (opkg, apk), sysupgrade et sauvegarde, ubus ; agent OpenWISP.
tags: [aide-mémoire, openwrt, uci, openwisp]
icon: terminal
---

Explications : [[01-openwrt|OpenWrt]] · [[02-openwisp|OpenWISP]].

## UCI

```bash
uci show wireless
uci get network.lan.ipaddr
uci set network.lan.ipaddr='10.0.50.1'
uci add_list dhcp.@dnsmasq[0].server='10.0.10.53'
uci delete wireless.default_radio0
uci changes ; uci revert network ; uci commit
```

## Services et diagnostic

```bash
service network reload ; service firewall restart ; service dnsmasq restart ; wifi reload
ip -br addr ; ip route ; bridge vlan show
logread -f ; logread -e dnsmasq
iwinfo ; iwinfo phy0-ap0 assoclist ; wifi status
nft list ruleset
cat /tmp/dhcp.leases
ubus call system board ; ubus call network.interface.wan status
ping -c 3 9.9.9.9 ; nslookup openwrt.org
```

## Paquets, mises à jour et sauvegarde

```bash
opkg update ; opkg list-upgradable ; opkg install tcpdump-mini     # 24.10 et avant
apk update ; apk upgrade ; apk add tcpdump                          # 25.x et après
sysupgrade -b /tmp/sauvegarde.tar.gz
sysupgrade -v /tmp/image-sysupgrade.bin
firstboot && reboot                                                  # réinitialisation usine
```

## Agent OpenWISP

```bash
service openwisp-config restart
logread | grep openwisp
cat /etc/config/openwisp
```
