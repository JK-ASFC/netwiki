---
title: Dante (proxy SOCKS) — aide-mémoire des commandes
description: Commandes Dante avec exemples — service danted, vérification de la configuration, règles client et socks (pass/block), authentification (username, none), interfaces interne et externe, journalisation, tests avec curl et proxychains, tunnel SOCKS par SSH comme alternative, client socksify.
tags: [aide-mémoire, dante, socks, proxy, curl, proxychains]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|Dante]].

## Service

```bash
sudo apt install dante-server
sudo danted -V -f /etc/danted.conf          # vérifier la configuration
sudo systemctl restart danted
sudo journalctl -u danted -f
```

## Configuration type

```text
# /etc/danted.conf
logoutput: syslog /var/log/danted.log
internal: eth1 port = 1080
external: eth0
socksmethod: username
user.privileged: root
user.unprivileged: nobody

client pass {
    from: 10.0.0.0/8 to: 0.0.0.0/0
    log: error connect disconnect
}
client block {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: connect error
}
socks block {
    from: 0.0.0.0/0 to: 10.0.0.0/8
    log: connect error
}
socks pass {
    from: 10.0.0.0/8 to: 0.0.0.0/0
    command: bind connect udpassociate
    log: error connect disconnect
}
```

```bash
# Comptes pour socksmethod: username (comptes système sans shell)
sudo useradd -r -s /usr/sbin/nologin proxyuser && sudo passwd proxyuser
```

## Tests

```bash
curl --socks5-hostname proxyuser:MotDePasse@10.0.10.80:1080 https://ifconfig.me
curl -x socks5h://proxyuser:MotDePasse@10.0.10.80:1080 -I https://www.exemple.com
sudo ss -ltnp | grep 1080
```

## Clients

```bash
# proxychains : forcer une application à passer par le proxy
echo "socks5 10.0.10.80 1080 proxyuser MotDePasse" | sudo tee -a /etc/proxychains4.conf
proxychains4 nmap -sT -Pn -p 443 www.exemple.com
# socksify (fourni avec dante-client)
SOCKS_SERVER=10.0.10.80:1080 socksify ssh admin@serveur-distant
```

## Alternative : SOCKS dynamique par SSH

```bash
ssh -D 1080 -N -f admin@bastion.exemple.fr     # proxy SOCKS local sur 127.0.0.1:1080
curl --socks5-hostname 127.0.0.1:1080 http://intranet.corp.exemple.fr
```
