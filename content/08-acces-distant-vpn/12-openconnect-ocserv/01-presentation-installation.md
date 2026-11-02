---
title: Présentation, installation et configuration
description: ocserv et OpenConnect — VPN SSL libre compatible Cisco AnyConnect : serveur ocserv (TLS sur TCP 443 et DTLS sur UDP 443, certificats Let's Encrypt, authentification PAM, fichier de mots de passe ocpasswd, RADIUS, certificats clients, MFA OTP), ocserv.conf (pool d'adresses, routes, DNS, split tunnel, groupes), NAT et pare-feu, installation Debian/Ubuntu, RHEL, Alpine ; client OpenConnect (Linux, NetworkManager, Windows, macOS, OpenConnect GUI) et protocoles pris en charge (AnyConnect, GlobalProtect, Pulse/Ivanti, Fortinet, F5, Array).
tags: [ocserv, openconnect, vpn ssl, anyconnect, globalprotect, dtls, radius]
icon: info
---

**ocserv** (OpenConnect server, GPL) est un **VPN SSL** : il passe par **HTTPS (TCP 443)**, donc traverse la plupart des pare-feu et proxys, avec **DTLS (UDP 443)** pour les performances. Il parle le protocole d'**AnyConnect** : les clients Cisco Secure Client comme le client libre **OpenConnect** s'y connectent. Le client OpenConnect sait aussi se connecter aux passerelles **GlobalProtect** (Palo Alto), **Pulse/Ivanti**, **Fortinet**, **F5** et **Array** — utile pour l'administrateur Linux dans une entreprise équipée.

## Installation du serveur

```bash
sudo apt install ocserv                    # Debian/Ubuntu
sudo dnf install epel-release && sudo dnf install ocserv   # RHEL/Rocky/Alma (EPEL)
sudo apk add ocserv                        # Alpine
```

Certificat : Let's Encrypt ([[03-nginx/04-https-tls|certbot]]) (`certbot certonly --standalone -d vpn.corp.exemple.fr`) ou PKI interne.

## `/etc/ocserv/ocserv.conf` (extraits)

```text
auth = "plain[passwd=/etc/ocserv/ocpasswd]"
# auth = "pam"                                          # comptes système / SSSD (Active Directory)
# auth = "radius[config=/etc/radcli/radiusclient.conf,groupconfig=true]"
tcp-port = 443
udp-port = 443
server-cert = /etc/letsencrypt/live/vpn.corp.exemple.fr/fullchain.pem
server-key = /etc/letsencrypt/live/vpn.corp.exemple.fr/privkey.pem
max-clients = 200
max-same-clients = 2
keepalive = 32400
dpd = 90
mobile-dpd = 1800
try-mtu-discovery = true
tls-priorities = "NORMAL:%SERVER_PRECEDENCE:-VERS-ALL:+VERS-TLS1.3:+VERS-TLS1.2"
device = vpns
ipv4-network = 10.10.0.0
ipv4-netmask = 255.255.255.0
dns = 10.0.10.53
default-domain = corp.exemple.fr
route = 10.0.0.0/8                      # tunnel partagé : seules ces routes passent par le VPN
# route = default                       # tunnel complet
no-route = 10.0.99.0/24
config-per-group = /etc/ocserv/groupes/
cisco-client-compat = true
```

```bash
sudo ocpasswd -c /etc/ocserv/ocpasswd -g admins jk     # créer un utilisateur (mot de passe demandé)
sudo ocpasswd -c /etc/ocserv/ocpasswd -l jk            # verrouiller
echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/90-vpn.conf && sudo sysctl --system
sudo nft add table ip nat && sudo nft add chain ip nat postrouting '{ type nat hook postrouting priority 100; }' \
  && sudo nft add rule ip nat postrouting ip saddr 10.10.0.0/24 oifname "eth0" masquerade
sudo systemctl enable --now ocserv
```

Le masquerade n'est utile que si le réseau interne ne connaît pas de route vers `10.10.0.0/24` ; sinon, ajoutez plutôt cette route sur le routeur interne. Authentification AD : PAM + [[20-sssd-realmd/01-presentation-configuration|SSSD]], ou RADIUS ([[01-freeradius/01-presentation|FreeRADIUS]], NPS) pour ajouter MFA et groupes.

## Client OpenConnect

```bash
sudo apt install openconnect network-manager-openconnect-gnome   # Debian/Ubuntu (+ greffon NetworkManager)
sudo dnf install openconnect NetworkManager-openconnect-gnome    # Fedora/RHEL
brew install openconnect                                          # macOS
sudo openconnect --user=jk https://vpn.corp.exemple.fr
sudo openconnect --protocol=gp --user=jk vpn.partenaire.fr       # GlobalProtect
sudo openconnect --protocol=fortinet --user=jk vpn.client.fr:10443
sudo openconnect --servercert pin-sha256:… https://vpn.corp.exemple.fr   # épingler un certificat non public
```

Windows et macOS : **OpenConnect GUI** ou le client Cisco Secure Client. Commandes : [[90-aide-memoire|aide-mémoire]].

<!-- CAPTURE: NetworkManager — configuration d'un VPN OpenConnect (GNOME) | _assets/openconnect-networkmanager.png -->
<!-- CAPTURE: OpenConnect GUI sous Windows | _assets/openconnect-gui.png -->
