---
title: Serveur d'accès distant
description: Configurer un serveur WireGuard d'accès distant (wg0.conf, pairs, AllowedIPs, NAT et pare-feu), les profils clients (tunnel complet ou partiel, DNS, keepalive), la distribution par QR code, l'ajout et le retrait de pairs à chaud et le démarrage automatique.
tags: [wireguard, serveur, accès distant, nat, allowedips, qr code]
icon: server
---

## Plan d'adressage

| Élément | Valeur |
| --- | --- |
| Réseau du tunnel | `10.66.0.0/24` (IPv4), `fd66::/64` (IPv6) |
| Serveur | `10.66.0.1`, port UDP `51820`, `vpn.exemple.fr` |
| Clients | une adresse **/32** fixe par pair (`10.66.0.10`, `10.66.0.11`…) |
| Réseaux internes | `10.0.0.0/8` |

## Configuration du serveur

```wireguard /etc/wireguard/wg0.conf
[Interface]
Address = 10.66.0.1/24, fd66::1/64
ListenPort = 51820
PrivateKey = <contenu de serveur.key>
# Routage + NAT à la montée de l'interface (si les réseaux internes n'ont pas de route de retour vers 10.66.0.0/24)
PostUp   = sysctl -q -w net.ipv4.ip_forward=1
PostUp   = nft add table ip wg_nat; nft add chain ip wg_nat post '{ type nat hook postrouting priority srcnat; }'; nft add rule ip wg_nat post ip saddr 10.66.0.0/24 oifname "ens192" masquerade
PostDown = nft delete table ip wg_nat

# --- Alice (portable)
[Peer]
PublicKey = <clé publique d'alice>
PresharedKey = <alice-serveur.psk>
AllowedIPs = 10.66.0.10/32, fd66::10/128

# --- Bruno (smartphone)
[Peer]
PublicKey = <clé publique de bruno>
AllowedIPs = 10.66.0.11/32, fd66::11/128
```

```bash
sudo chmod 600 /etc/wireguard/wg0.conf
sudo systemctl enable --now wg-quick@wg0
sudo wg show
sudo firewall-cmd --permanent --add-port=51820/udp && sudo firewall-cmd --reload   # RHEL
sudo ufw allow 51820/udp                                                           # Ubuntu
```

> [!IMPORTANT]
> Côté serveur, `AllowedIPs` d'un client doit être **uniquement son adresse** (/32). Si deux pairs déclarent des `AllowedIPs` qui se chevauchent, le dernier « gagne » et le trafic part vers le mauvais pair.

### Pare-feu entre le tunnel et le réseau interne

WireGuard authentifie les pairs, mais ne filtre pas ce qu'ils peuvent joindre : ajoutez des règles `forward`.

```bash /etc/nftables.d/wireguard.nft
table inet wg_filtre {
  chain forward {
    type filter hook forward priority filter; policy drop;
    ct state established,related accept
    iifname "wg0" ip saddr 10.66.0.10 ip daddr 10.0.0.0/8 accept                     # administratrice : tout l'interne
    iifname "wg0" ip saddr 10.66.0.11 ip daddr 10.0.20.10 tcp dport 443 accept      # utilisateur : une application
    iifname "wg0" oifname "ens192" ip daddr != 10.0.0.0/8 accept                     # Internet (tunnel complet)
  }
}
```

## Profil client

```wireguard alice.conf
[Interface]
PrivateKey = <clé privée d'alice, générée sur son poste>
Address = 10.66.0.10/32, fd66::10/128
DNS = 10.0.10.53, corp.exemple.fr          # serveur DNS + domaine de recherche (Windows/macOS/mobiles, wg-quick avec resolvconf)

[Peer]
PublicKey = <clé publique du serveur>
PresharedKey = <alice-serveur.psk>
Endpoint = vpn.exemple.fr:51820
AllowedIPs = 10.0.0.0/8, 10.66.0.0/24, fd66::/64     # tunnel PARTIEL : uniquement les réseaux internes
# AllowedIPs = 0.0.0.0/0, ::/0                        # tunnel COMPLET : tout le trafic
PersistentKeepalive = 25
```

| `AllowedIPs` côté client | Effet |
| --- | --- |
| Réseaux internes | Tunnel partiel (split tunnel) |
| `0.0.0.0/0, ::/0` | Tunnel complet ; `wg-quick` et les applications ajoutent les règles pour ne pas faire passer le trafic du tunnel lui-même dans le tunnel |
| Sous Windows, case *Bloquer le trafic non tunnelisé (kill-switch)* | Disponible quand `AllowedIPs = 0.0.0.0/0` : aucune fuite si le tunnel tombe |

> [!TIP]
> `PersistentKeepalive = 25` n'est utile que pour le pair **derrière un NAT** qui doit rester joignable (ou pour que le serveur connaisse en permanence son adresse). Sur un client nomade qui initie toujours les échanges, il maintient surtout le tunnel « chaud » ; il consomme un peu de batterie sur mobile.

## Distribution par QR code

```bash
sudo apt install qrencode
qrencode -t ansiutf8 < bruno.conf          # affiché dans le terminal, à scanner avec l'application mobile
qrencode -o bruno.png < bruno.conf
```

Le QR code contient la clé privée : affichez-le en présence de l'utilisateur et ne le conservez pas.

## Ajouter ou retirer un pair sans couper les autres

```bash
# Ajouter à chaud
sudo wg set wg0 peer "<clé publique>" preshared-key ./carole.psk allowed-ips 10.66.0.12/32
# Retirer (perte de poste, départ)
sudo wg set wg0 peer "<clé publique>" remove
# Persister : éditer wg0.conf, puis appliquer sans redémarrer l'interface
sudo wg syncconf wg0 <(wg-quick strip wg0)
```

`wg-quick down wg0 && wg-quick up wg0` coupe tous les pairs quelques secondes ; `wg syncconf` applique uniquement les différences.

## Serveur sous systemd-networkd (alternative)

```ini /etc/systemd/network/50-wg0.netdev
[NetDev]
Name=wg0
Kind=wireguard

[WireGuard]
PrivateKeyFile=/etc/wireguard/serveur.key
ListenPort=51820

[WireGuardPeer]
PublicKey=<clé publique d'alice>
AllowedIPs=10.66.0.10/32
```

```ini /etc/systemd/network/50-wg0.network
[Match]
Name=wg0

[Network]
Address=10.66.0.1/24
IPForward=yes
```

```bash
sudo chown root:systemd-network /etc/wireguard/serveur.key && sudo chmod 640 /etc/wireguard/serveur.key
sudo networkctl reload
```

## Vérification

```bash
sudo wg show wg0
# peer: <clé alice>
#   endpoint: 203.0.113.50:51231
#   allowed ips: 10.66.0.10/32
#   latest handshake: 21 seconds ago
#   transfer: 1.24 MiB received, 18.71 MiB sent
ping -c3 10.66.0.10
```

Une poignée de main récente (moins de 2-3 minutes) signifie que le tunnel est établi. Voir [[05-exploitation-depannage]] en cas de problème.
