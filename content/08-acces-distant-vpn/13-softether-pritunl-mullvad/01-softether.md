---
title: SoftEther VPN
description: SoftEther VPN (Université de Tsukuba, Apache 2.0) — serveur VPN multi-protocole : protocole SoftEther (SSL-VPN sur 443, Ethernet sur HTTPS), OpenVPN, L2TP/IPsec, SSTP, WireGuard (branche 5.x), concepts (Virtual Hub, Local Bridge, SecureNAT, cascades site à site), installation Linux (compilation, service systemd), Windows (Server Manager), vpncmd, authentification (mot de passe, certificats, RADIUS, NT Domain), branches stable 4.x et développement 5.x, et précautions de sécurité.
tags: [softether, vpn, ssl-vpn, l2tp, sstp, openvpn, vpncmd, virtual hub]
icon: info
---

**SoftEther VPN** est un serveur VPN **multi-protocole** : un même serveur accepte son protocole natif (Ethernet encapsulé dans HTTPS, très tolérant aux pare-feu), **OpenVPN**, **L2TP/IPsec**, **SSTP** (client natif Windows) et, en branche 5.x, **WireGuard**. Il fonctionne en **niveau 2** : chaque *Virtual Hub* est un commutateur virtuel.

| Concept | Rôle |
| --- | --- |
| **Virtual Hub** | Commutateur virtuel avec ses utilisateurs, groupes, politiques et journaux |
| **Local Bridge** | Relie un hub à une carte réseau physique (les clients obtiennent une adresse du LAN) |
| **SecureNAT** | DHCP + NAT intégrés, sans privilèges réseau (le plus simple, moins performant) |
| **Cascade** | Lien entre deux serveurs (site à site en niveau 2) |
| VPN Bridge / Client | Composants pour relier un site ou un poste |

## Installation (Linux)

```bash
# Branche stable 4.x : archive « softether-vpnserver-v4.xx-…-linux-x64-64bit.tar.gz » depuis softether-download.com
sudo apt install build-essential
tar xzf softether-vpnserver-*.tar.gz && cd vpnserver && make
sudo mv ../vpnserver /opt/ && sudo chmod 600 /opt/vpnserver/* && sudo chmod 700 /opt/vpnserver/vpncmd /opt/vpnserver/vpnserver
sudo tee /etc/systemd/system/vpnserver.service >/dev/null <<'UNIT'
[Unit]
Description=SoftEther VPN Server
After=network-online.target
[Service]
Type=forking
ExecStart=/opt/vpnserver/vpnserver start
ExecStop=/opt/vpnserver/vpnserver stop
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload && sudo systemctl enable --now vpnserver
```

Branche 5.x (développement, avec WireGuard) : compilation depuis `github.com/SoftEtherVPN/SoftEtherVPN` (CMake). Windows : installeur avec **SoftEther VPN Server Manager** (interface graphique, aussi utilisable à distance pour un serveur Linux).

## Configuration avec vpncmd

```text
/opt/vpnserver/vpncmd localhost /SERVER
ServerPasswordSet                       # mot de passe d'administration — à faire en premier
HubCreate CORP /PASSWORD:MdpHubCorp
Hub CORP
SecureNatEnable                         # ou BridgeCreate CORP /DEVICE:eth1 pour un pont local
UserCreate jk /GROUP:none /REALNAME:"JK" /NOTE:""
UserPasswordSet jk
IPsecEnable /L2TP:yes /L2TPRAW:no /ETHERIP:no /PSK:CléPartagéeLongue2026 /DEFAULTHUB:CORP
SstpEnable yes
OpenVpnEnable yes /PORTS:1194
OpenVpnMakeConfig openvpn-config.zip    # profil prêt à importer dans un client OpenVPN
```

> [!WARNING]
> Désactivez les fonctions non utilisées (*VPN Azure*, *Dynamic DNS* de SoftEther, NAT traversal vers des services tiers, protocole L2TP sans IPsec), changez le mot de passe d'administration, limitez le port d'administration (443/5555) et suivez les versions : le projet a corrigé plusieurs failles importantes ces dernières années.

Interface : [[04-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
