---
title: OpenWrt
description: OpenWrt — système Linux libre pour routeurs, points d'accès et petits pare-feu : matériel compatible (Table of Hardware), images factory et sysupgrade, Firmware Selector, première connexion (SSH, LuCI), configuration UCI (/etc/config, uci show/set/commit), réseau et VLAN (DSA, bridge-vlan), Wi-Fi (radios, SSID, WPA3, 802.11r, mesh 802.11s), pare-feu fw4/nftables (zones, redirections), DHCP et DNS (dnsmasq, odhcpd), paquets (opkg, apk à partir de 25.x), WireGuard, mises à jour (sysupgrade, attended sysupgrade) et sauvegarde.
tags: [openwrt, routeur, point d'accès, uci, luci, wi-fi, vlan, dsa, nftables, wireguard]
icon: info
---

**OpenWrt** (GPL) remplace le micrologiciel constructeur de nombreux **routeurs et points d'accès** (et tourne aussi sur x86, Raspberry Pi, VM) : distribution Linux minimaliste avec gestionnaire de paquets, configuration **UCI** et interface web **LuCI**. On l'utilise pour prolonger la vie du matériel, obtenir des mises à jour de sécurité, des VLAN, du VPN ou un Wi-Fi maîtrisé.

## Installation

1. Vérifier le modèle exact (et sa révision matérielle) dans la *Table of Hardware* ; télécharger l'image avec le **Firmware Selector** (`firmware-selector.openwrt.org`).
2. Image **factory** depuis l'interface constructeur (première installation), image **sysupgrade** depuis OpenWrt (mises à jour).
3. Première connexion : `192.168.1.1`, utilisateur `root` sans mot de passe → définir un mot de passe immédiatement (`passwd` ou LuCI).

```bash
ssh root@192.168.1.1
passwd
cat /etc/openwrt_release
```

x86/VM : image `generic-ext4-combined-efi.img.gz` à écrire sur disque (`dd`) ou à convertir pour [[11-proxmox-ve/01-presentation-installation|Proxmox VE]].

## UCI : configuration unifiée

Tous les réglages vivent dans `/etc/config/*` (`network`, `wireless`, `firewall`, `dhcp`, `system`) ; LuCI et la commande `uci` écrivent les mêmes fichiers.

```bash
uci show network.lan
uci set network.lan.ipaddr='10.0.50.1'
uci set system.@system[0].hostname='ap-bureau-01'
uci set system.@system[0].zonename='Europe/Paris'
uci changes
uci commit && service network reload
```

## Réseau et VLAN (DSA)

Depuis 21.02, la plupart des cibles utilisent **DSA** : chaque port est une interface (`lan1`, `lan2`, `wan`), les VLAN se déclarent sur le pont `br-lan`.

```text
# /etc/config/network
config device
	option name 'br-lan'
	option type 'bridge'
	list ports 'lan1'
	list ports 'lan2'
	list ports 'lan3'

config bridge-vlan
	option device 'br-lan'
	option vlan '10'
	list ports 'lan1:u*'
	list ports 'lan3:t'

config bridge-vlan
	option device 'br-lan'
	option vlan '30'
	list ports 'lan2:u*'
	list ports 'lan3:t'

config interface 'lan'
	option device 'br-lan.10'
	option proto 'static'
	option ipaddr '10.0.10.1'
	option netmask '255.255.255.0'

config interface 'invites'
	option device 'br-lan.30'
	option proto 'static'
	option ipaddr '10.0.30.1'
	option netmask '255.255.255.0'
```

(`u` = non étiqueté, `t` = étiqueté, `*` = VLAN natif/PVID.)

## Wi-Fi

```bash
uci set wireless.radio1.country='FR'
uci set wireless.radio1.disabled='0'
uci set wireless.default_radio1.ssid='Corp-Invites'
uci set wireless.default_radio1.encryption='sae-mixed'     # WPA2/WPA3 ; « sae » = WPA3 seul
uci set wireless.default_radio1.key='Wifi-Invites-2026!'
uci set wireless.default_radio1.network='invites'
uci set wireless.default_radio1.ieee80211r='1'             # itinérance rapide entre points d'accès
uci commit wireless && wifi reload
```

WPA-Entreprise ([[01-freeradius/01-presentation|RADIUS]]) : paquet `wpad` complet (et non `wpad-basic`), `encryption 'wpa2'` + `auth_server`. Maillage : 802.11s ou batman-adv.

## Pare-feu (fw4, nftables)

Zones (`lan`, `wan`, `invites`) avec politiques entrée/sortie/transfert, *forwardings* entre zones, redirections de ports :

```bash
uci add firewall zone
uci set firewall.@zone[-1].name='invites'
uci add_list firewall.@zone[-1].network='invites'
uci set firewall.@zone[-1].input='REJECT'
uci set firewall.@zone[-1].output='ACCEPT'
uci set firewall.@zone[-1].forward='REJECT'
uci add firewall forwarding
uci set firewall.@forwarding[-1].src='invites'
uci set firewall.@forwarding[-1].dest='wan'
uci commit firewall && service firewall restart
nft list ruleset | less
```

Ouvrir DHCP et DNS aux invités (règles `Allow-DHCP-invites`, `Allow-DNS-invites`, ports 67 et 53).

## Paquets

```bash
opkg update && opkg install luci-app-wireguard tcpdump-mini   # jusqu'à 24.10
apk update && apk add luci-app-wireguard                      # à partir de 25.x (apk remplace opkg)
```

Paquets utiles : `luci-ssl` (LuCI en HTTPS), `wireguard-tools`, `luci-app-sqm` (gestion de file d'attente), `adblock`, `luci-app-statistics`, `snmpd`, `openwisp-config` (agent [[02-openwisp|OpenWISP]]).

## WireGuard

```bash
wg genkey | tee /etc/wg.key | wg pubkey > /etc/wg.pub
uci set network.wg0=interface
uci set network.wg0.proto='wireguard'
uci set network.wg0.private_key="$(cat /etc/wg.key)"
uci add_list network.wg0.addresses='10.255.0.2/24'
uci add network wireguard_wg0
uci set network.@wireguard_wg0[-1].public_key='<clé-publique-du-concentrateur>'
uci set network.@wireguard_wg0[-1].endpoint_host='vpn.corp.exemple.fr'
uci set network.@wireguard_wg0[-1].endpoint_port='51820'
uci add_list network.@wireguard_wg0[-1].allowed_ips='10.0.0.0/8'
uci set network.@wireguard_wg0[-1].route_allowed_ips='1'
uci set network.@wireguard_wg0[-1].persistent_keepalive='25'
uci commit network && service network reload
```

Voir [[03-wireguard/01-presentation-installation|WireGuard]] pour le concentrateur.

## Mises à jour et sauvegarde

```bash
sysupgrade -b /tmp/sauvegarde-$(date +%F).tar.gz      # sauvegarde de /etc/config et des fichiers listés
sysupgrade -v /tmp/openwrt-…-sysupgrade.bin            # conserve la configuration par défaut (-n pour repartir de zéro)
```

Les paquets ajoutés ne sont pas conservés par sysupgrade : utiliser **Attended Sysupgrade** (`luci-app-attendedsysupgrade` ou `owut`), qui reconstruit une image incluant vos paquets. Passage de version majeure : lire les notes (changement opkg → apk, DSA).

Suite : [[02-openwisp|OpenWISP]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
