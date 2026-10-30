---
title: Serveur d'accès distant
description: Configuration complète d'un serveur OpenVPN d'accès distant (UDP, TUN, topology subnet, chiffrements, tls-crypt), routes et DNS poussés, tunnel complet ou partiel, adresses fixes par client (client-config-dir), routage et NAT, profil client .ovpn et démarrage du service.
tags: [openvpn, serveur, accès distant, push, nat, split tunnel, ccd]
icon: server
---

## Configuration du serveur

```openvpn /etc/openvpn/server/serveur.conf
# --- Réseau
port 1194
proto udp
dev tun
topology subnet
server 10.8.0.0 255.255.255.0          # pool d'adresses des clients (le serveur prend 10.8.0.1)
server-ipv6 fd42:8::/64
explicit-exit-notify 1

# --- PKI et TLS
ca   /etc/openvpn/server/ca.crt
cert /etc/openvpn/server/vpn.exemple.fr.crt
key  /etc/openvpn/server/vpn.exemple.fr.key
dh none
crl-verify /etc/openvpn/server/crl.pem
tls-crypt /etc/openvpn/server/tc.key
tls-version-min 1.2
remote-cert-tls client
data-ciphers AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305

# --- Paramètres envoyés aux clients
push "route 10.0.0.0 255.0.0.0"                 # tunnel partiel : seulement les réseaux internes
push "dhcp-option DNS 10.0.10.53"
push "dhcp-option DNS 10.0.10.54"
push "dhcp-option DOMAIN corp.exemple.fr"
push "block-outside-dns"                        # Windows : empêche les fuites DNS hors tunnel
# push "redirect-gateway def1 bypass-dhcp"      # tunnel complet : tout le trafic passe par le VPN

# --- Adresses fixes / routes par client
client-config-dir /etc/openvpn/server/ccd

# --- Fonctionnement
keepalive 10 60
persist-key
persist-tun
user nobody
group nogroup                                   # RHEL : group nobody
max-clients 500

# --- Journalisation et gestion
status /run/openvpn-server/status-serveur.log 30
status-version 2
verb 3
mute 20
management 127.0.0.1 7505
```

```bash
sudo systemctl enable --now openvpn-server@serveur      # lit /etc/openvpn/server/serveur.conf
sudo systemctl status openvpn-server@serveur
ip -br addr show tun0
```

## Tunnel partiel ou complet

| Mode | Directive | Avantages / inconvénients |
| --- | --- | --- |
| **Partiel** (*split tunnel*) | `push "route …"` pour chaque réseau interne | Trafic Internet direct (performances) ; l'accès Internet du poste n'est pas filtré par l'entreprise |
| **Complet** (*full tunnel*) | `push "redirect-gateway def1 bypass-dhcp"` | Tout passe par l'entreprise (proxy, filtrage, journalisation) ; charge et bande passante plus importantes |

Avec le tunnel complet, prévoyez le **NAT** vers Internet et un DNS qui résout aussi les noms publics.

## Adresses fixes et réglages par client

```openvpn /etc/openvpn/server/ccd/alice
ifconfig-push 10.8.0.50 255.255.255.0
push "route 10.50.0.0 255.255.0.0"      # route supplémentaire pour ce client seulement
```

Le nom du fichier est le **CN** du certificat client (ou le nom d'utilisateur avec `username-as-common-name`). Avec `ccd-exclusive`, un client sans fichier est refusé (liste blanche).

Associez ces adresses fixes à des **règles de pare-feu** par profil : administrateurs (10.8.0.0/26) vers tout le réseau d'administration, collaborateurs (10.8.0.64/26) vers les seules applications métier.

## Routage et NAT

```bash
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/90-openvpn.conf
echo "net.ipv6.conf.all.forwarding=1" | sudo tee -a /etc/sysctl.d/90-openvpn.conf
sudo sysctl --system
```

Deux possibilités :

1. **Routage** (préférable) : déclarer sur le routeur du cœur de réseau une route `10.8.0.0/24 → IP du serveur VPN`. Les serveurs internes voient les vraies IP des clients VPN (journalisation, filtrage).
2. **NAT** : les clients sortent avec l'IP du serveur VPN.

```bash /etc/nftables.d/openvpn.nft
table ip openvpn_nat {
  chain postrouting {
    type nat hook postrouting priority srcnat;
    ip saddr 10.8.0.0/24 oifname "ens192" masquerade
  }
}
table inet openvpn_filtre {
  chain forward {
    type filter hook forward priority filter; policy drop;
    ct state established,related accept
    iifname "tun0" ip saddr 10.8.0.0/26  ip daddr 10.0.0.0/8 accept          # administrateurs
    iifname "tun0" ip saddr 10.8.0.64/26 ip daddr { 10.0.20.10, 10.0.20.11 } tcp dport { 443 } accept   # collaborateurs : applications web
  }
}
```

```bash
sudo firewall-cmd --permanent --add-port=1194/udp            # RHEL (firewalld)
sudo firewall-cmd --permanent --add-masquerade
sudo firewall-cmd --reload
```

## Profil client

```openvpn /etc/openvpn/client-modele.ovpn
client
dev tun
proto udp
remote vpn.exemple.fr 1194
remote vpn-secours.exemple.fr 1194
remote-random
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
verify-x509-name vpn.exemple.fr name
tls-version-min 1.2
data-ciphers AES-256-GCM:AES-128-GCM:CHACHA20-POLY1305
auth-nocache
verb 3
```

Le script de [[02-installation-pki]] y ajoute les blocs `<ca>`, `<cert>`, `<key>`, `<tls-crypt>` pour obtenir un fichier unique à importer dans le client.

> [!TIP]
> `verify-x509-name` empêche un client de se connecter à un faux serveur qui posséderait un **autre** certificat signé par la même AC (par exemple un certificat client volé utilisé comme serveur). Combiné à `remote-cert-tls server`, c'est indispensable.

## Plusieurs instances

Un même serveur peut faire tourner plusieurs configurations (une par profil, une en UDP et une en TCP 443) :

```bash
sudo systemctl enable --now openvpn-server@tcp443      # /etc/openvpn/server/tcp443.conf : proto tcp, port 443, server 10.9.0.0 …
```

Chaque instance a son propre pool d'adresses et son propre `tun`.

## Vérifications

```bash
sudo journalctl -u openvpn-server@serveur -f
cat /run/openvpn-server/status-serveur.log          # clients connectés, IP réelle, IP VPN, octets
echo "status 3" | nc 127.0.0.1 7505
ip route | grep 10.8.0.0
```
