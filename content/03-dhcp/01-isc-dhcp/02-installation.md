---
title: Installation
description: Installer le serveur ISC DHCP sur Debian/Ubuntu et RHEL/Rocky/Alma, choisir les interfaces d'écoute, emplacements des fichiers, pare-feu, test de syntaxe et premier démarrage.
tags: [isc-dhcp, dhcpd, installation, debian, rhel]
icon: download
---

## Debian / Ubuntu

```bash
sudo apt update
sudo apt install isc-dhcp-server
```

> [!NOTE]
> Le service tente de démarrer immédiatement et **échoue** tant que la configuration ne déclare pas de sous-réseau correspondant à une interface : c'est normal.

### Interfaces d'écoute

```bash /etc/default/isc-dhcp-server
# Interfaces sur lesquelles dhcpd répond (séparées par des espaces)
INTERFACESv4="ens192"
INTERFACESv6=""
# Chemins (valeurs par défaut)
#DHCPDv4_CONF=/etc/dhcp/dhcpd.conf
#DHCPDv6_CONF=/etc/dhcp/dhcpd6.conf
#DHCPDv4_PID=/var/run/dhcpd.pid
```

Si le serveur ne reçoit que des requêtes **relayées** (cas d'un serveur central), une seule interface suffit, mais elle doit porter une adresse appartenant à un `subnet` déclaré (même vide).

### Fichiers Debian

| Chemin | Rôle |
| --- | --- |
| `/etc/dhcp/dhcpd.conf` | Configuration DHCPv4 |
| `/etc/dhcp/dhcpd6.conf` | Configuration DHCPv6 |
| `/etc/default/isc-dhcp-server` | Interfaces et options de démarrage |
| `/var/lib/dhcp/dhcpd.leases` | Baux IPv4 |
| `/var/lib/dhcp/dhcpd6.leases` | Baux IPv6 |
| `isc-dhcp-server.service` / `isc-dhcp-server6.service` | Services systemd |

## RHEL / Rocky Linux / AlmaLinux (8 et 9)

```bash
sudo dnf install dhcp-server
sudo cp /usr/share/doc/dhcp-server/dhcpd.conf.example /etc/dhcp/dhcpd.conf   # exemple commenté
sudo systemctl enable --now dhcpd
sudo firewall-cmd --permanent --add-service=dhcp
sudo firewall-cmd --reload
```

| Chemin | Rôle |
| --- | --- |
| `/etc/dhcp/dhcpd.conf` | Configuration DHCPv4 |
| `/var/lib/dhcpd/dhcpd.leases` | Baux |
| `/etc/systemd/system/dhcpd.service.d/` | Surcharge pour choisir les interfaces |
| `dhcpd.service`, `dhcpd6.service`, `dhcrelay.service` | Services |

Pour restreindre les interfaces sur RHEL :

```ini /etc/systemd/system/dhcpd.service.d/interfaces.conf
[Service]
ExecStart=
ExecStart=/usr/sbin/dhcpd -f -cf /etc/dhcp/dhcpd.conf -user dhcpd -group dhcpd --no-pid ens192
```

```bash
sudo systemctl daemon-reload && sudo systemctl restart dhcpd
```

> [!IMPORTANT]
> RHEL 10 ne fournit plus `dhcp-server` : utilisez **Kea** (`dnf install kea`) sur les nouvelles plateformes.

## Pare-feu

| Flux | Port |
| --- | --- |
| Requêtes DHCPv4 (clients et relais → serveur) | UDP 67 entrant |
| Réponses vers les relais | UDP 67 sortant |
| Failover entre deux serveurs | TCP 647 (configurable) |
| OMAPI (omshell) | TCP 7911 (local de préférence) |
| DHCPv6 | UDP 547 entrant (serveur), 546 (client) |

```bash
# nftables
nft add rule inet filter input udp dport 67 accept
nft add rule inet filter input ip saddr 10.0.10.22 tcp dport 647 accept
```

## Vérifier la configuration

```bash
sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf          # syntaxe
sudo dhcpd -T -lf /var/lib/dhcp/dhcpd.leases    # cohérence du fichier de baux
```

Ajoutez ce test dans vos procédures (ou un `ExecStartPre=` systemd) : une erreur de syntaxe empêche le démarrage et **tous les clients perdent leur renouvellement**.

## Premier démarrage

```dhcpd /etc/dhcp/dhcpd.conf
authoritative;
default-lease-time 28800;
max-lease-time 86400;
ddns-update-style none;
log-facility local7;

subnet 10.0.40.0 netmask 255.255.255.0 {
    range 10.0.40.100 10.0.40.199;
    option routers 10.0.40.1;
    option domain-name-servers 10.0.10.53, 10.0.10.54;
    option domain-name "exemple.fr";
}
```

```bash
sudo dhcpd -t -cf /etc/dhcp/dhcpd.conf && sudo systemctl restart isc-dhcp-server
systemctl status isc-dhcp-server
journalctl -u isc-dhcp-server -f      # voir les DHCPDISCOVER / OFFER / REQUEST / ACK
```

## Lancement manuel au premier plan (débogage)

```bash
sudo systemctl stop isc-dhcp-server
sudo dhcpd -f -d -4 -cf /etc/dhcp/dhcpd.conf -lf /var/lib/dhcp/dhcpd.leases ens192
```

`-f` garde le processus au premier plan, `-d` envoie les journaux sur la console.

## Journalisation dans un fichier dédié

Avec `log-facility local7;` dans `dhcpd.conf` :

```ini /etc/rsyslog.d/dhcpd.conf
local7.*    /var/log/dhcpd.log
& stop
```

```bash
sudo systemctl restart rsyslog
# Rotation
printf '/var/log/dhcpd.log {\n  daily\n  rotate 30\n  compress\n  missingok\n  postrotate\n    systemctl kill -s HUP rsyslog.service\n  endscript\n}\n' | sudo tee /etc/logrotate.d/dhcpd
```
