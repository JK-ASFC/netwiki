---
title: OpenVPN — aide-mémoire des commandes
description: Commandes OpenVPN avec exemples — PKI avec Easy-RSA 3 (init-pki, build-ca, build-server-full, build-client-full, revoke, gen-crl), clé tls-crypt, service serveur (openvpn-server@), configuration serveur et client type, génération d'un profil .ovpn unifié, interface de gestion (status, kill), journaux, révocation, tests, clients Windows, macOS et Linux.
tags: [aide-mémoire, openvpn, easy-rsa, pki, vpn, tls-crypt]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|OpenVPN]].

## PKI avec Easy-RSA 3

```bash
make-cadir ~/pki-vpn && cd ~/pki-vpn          # ou copier /usr/share/easy-rsa
./easyrsa init-pki
./easyrsa build-ca                             # protéger la clé de l'AC par une phrase de passe
./easyrsa --days=825 build-server-full vpn.exemple.fr nopass
./easyrsa build-client-full amartin nopass     # ou avec phrase de passe (recommandé pour les clients)
./easyrsa show-cert amartin
./easyrsa revoke bpetit && ./easyrsa gen-crl
openvpn --genkey secret ta.key                 # clé tls-crypt (OpenVPN 2.5+ : --genkey secret)
sudo cp pki/ca.crt pki/issued/vpn.exemple.fr.crt pki/private/vpn.exemple.fr.key pki/crl.pem ta.key /etc/openvpn/server/
```

## Serveur

```ini
# /etc/openvpn/server/vpn.conf
port 1194
proto udp
dev tun
ca ca.crt
cert vpn.exemple.fr.crt
key vpn.exemple.fr.key
dh none
tls-crypt ta.key
crl-verify crl.pem
topology subnet
server 10.8.0.0 255.255.255.0
push "route 10.0.0.0 255.0.0.0"
push "dhcp-option DNS 10.0.10.53"
data-ciphers AES-256-GCM:CHACHA20-POLY1305
tls-version-min 1.2
user nobody
group nogroup
persist-key
persist-tun
keepalive 10 60
status /run/openvpn-server/status-vpn.log 30
verb 3
management 127.0.0.1 7505
```

```bash
sudo systemctl enable --now openvpn-server@vpn
sudo journalctl -u openvpn-server@vpn -f
echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-vpn.conf && sudo sysctl --system
```

## Profil client unifié (.ovpn)

```bash
cat > amartin.ovpn <<EOF
client
dev tun
proto udp
remote vpn.exemple.fr 1194
resolv-retry infinite
nobind
remote-cert-tls server
data-ciphers AES-256-GCM:CHACHA20-POLY1305
verb 3
<ca>
$(cat pki/ca.crt)
</ca>
<cert>
$(openssl x509 -in pki/issued/amartin.crt)
</cert>
<key>
$(cat pki/private/amartin.key)
</key>
<tls-crypt>
$(cat ta.key)
</tls-crypt>
EOF
```

## Exploitation

```bash
cat /run/openvpn-server/status-vpn.log                # clients connectés
# Interface de gestion
printf "status\nquit\n" | nc 127.0.0.1 7505
printf "kill amartin\nquit\n" | nc 127.0.0.1 7505      # déconnecter un client
# Après révocation : copier le nouveau crl.pem (relu à chaque connexion)
sudo cp ~/pki-vpn/pki/crl.pem /etc/openvpn/server/crl.pem
```

## Clients

```bash
sudo openvpn --config amartin.ovpn                     # Linux (test)
sudo nmcli connection import type openvpn file amartin.ovpn      # NetworkManager
openvpn3 session-start --config amartin.ovpn            # client OpenVPN 3 Linux
```

Windows : **OpenVPN GUI** (communautaire) ou **OpenVPN Connect** ; importer le fichier `.ovpn`. macOS : **Tunnelblick** ou OpenVPN Connect.

## Dépannage

| Message | Cause |
| --- | --- |
| `TLS Error: TLS key negotiation failed` | Port UDP bloqué, mauvaise adresse, clé tls-crypt différente |
| `VERIFY ERROR` | Certificat client non signé par l'AC, révoqué, horloge fausse |
| Connecté mais pas d'accès au réseau | `push route` manquant, routage de retour vers 10.8.0.0/24, NAT ou `ip_forward` |
| `AEAD Decrypt error` | Chiffrements incompatibles entre versions |
