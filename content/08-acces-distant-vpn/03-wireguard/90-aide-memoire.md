---
title: WireGuard — aide-mémoire des commandes
description: Commandes WireGuard avec exemples — clés (wg genkey, pubkey, genpsk), interface (wg-quick up/down, systemd wg-quick@), état (wg show, latest-handshakes, transfer), ajout et retrait de pairs à chaud (wg set, wg syncconf), configurations serveur et client, routage et NAT, codes QR pour mobiles, NetworkManager, Windows et macOS, dépannage.
tags: [aide-mémoire, wireguard, wg, wg-quick, vpn, qrencode]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|WireGuard]].

## Clés

```bash
umask 077
wg genkey | tee serveur.key | wg pubkey > serveur.pub
wg genkey | tee amartin.key | wg pubkey > amartin.pub
wg genpsk > amartin.psk                      # clé pré-partagée additionnelle (optionnelle)
```

## Configurations

```ini
# /etc/wireguard/wg0.conf (serveur)
[Interface]
Address = 10.9.0.1/24
ListenPort = 51820
PrivateKey = <contenu de serveur.key>
PostUp = nft add table ip nat; nft add chain ip nat post { type nat hook postrouting priority 100 \; }; nft add rule ip nat post oifname "eth0" ip saddr 10.9.0.0/24 masquerade
PostDown = nft delete table ip nat

[Peer]
# amartin
PublicKey = <contenu de amartin.pub>
PresharedKey = <contenu de amartin.psk>
AllowedIPs = 10.9.0.2/32
```

```ini
# amartin.conf (client)
[Interface]
Address = 10.9.0.2/32
PrivateKey = <contenu de amartin.key>
DNS = 10.0.10.53

[Peer]
PublicKey = <contenu de serveur.pub>
PresharedKey = <contenu de amartin.psk>
Endpoint = vpn.exemple.fr:51820
AllowedIPs = 10.0.0.0/8, 10.9.0.0/24
PersistentKeepalive = 25
```

`AllowedIPs = 0.0.0.0/0, ::/0` côté client fait passer **tout** le trafic dans le tunnel.

## Interface

```bash
sudo wg-quick up wg0
sudo wg-quick down wg0
sudo systemctl enable --now wg-quick@wg0
sudo wg-quick strip wg0 > /tmp/wg0.stripped      # configuration sans les directives wg-quick
```

## État

```bash
sudo wg show
sudo wg show wg0 latest-handshakes              # horodatage du dernier échange par pair
sudo wg show wg0 transfer
sudo wg show wg0 endpoints
ip -br addr show wg0 && ip route | grep wg0
```

## Pairs à chaud

```bash
sudo wg set wg0 peer "$(cat bpetit.pub)" allowed-ips 10.9.0.3/32
sudo wg set wg0 peer "$(cat bpetit.pub)" remove
sudo wg syncconf wg0 <(sudo wg-quick strip wg0)  # appliquer le fichier sans couper les autres pairs
sudo wg showconf wg0 > /tmp/wg0-actuel.conf
```

## Mobiles et postes

```bash
qrencode -t ansiutf8 < amartin.conf             # QR code pour l'application WireGuard (Android, iOS)
sudo nmcli connection import type wireguard file amartin.conf      # NetworkManager
```

```powershell
# Windows (application officielle)
& "C:\Program Files\WireGuard\wireguard.exe" /installtunnelservice "C:\VPN\amartin.conf"
& "C:\Program Files\WireGuard\wireguard.exe" /uninstalltunnelservice amartin
& "C:\Program Files\WireGuard\wg.exe" show
```

macOS : application WireGuard (App Store) ou `brew install wireguard-tools` puis `sudo wg-quick up ./amartin.conf`.

## Dépannage

| Symptôme | Cause |
| --- | --- |
| Aucun *handshake* | Port UDP 51820 bloqué/non redirigé, mauvaise clé publique, horloge |
| *Handshake* mais pas de trafic | `AllowedIPs` incomplets, `ip_forward`, NAT ou route de retour |
| Coupures derrière NAT | `PersistentKeepalive = 25` côté client |
| Lenteur, sites qui ne chargent pas | MTU : essayer `MTU = 1380` dans `[Interface]` |
