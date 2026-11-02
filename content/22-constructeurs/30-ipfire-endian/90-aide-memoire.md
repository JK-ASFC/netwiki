---
title: IPFire et Endian — aide-mémoire des commandes
description: Commandes console d'IPFire et d'Endian avec exemples — setup, pakfire (update, upgrade, install, remove, list), services (/etc/init.d), journaux, iptables et ipset, suricata, état réseau, sauvegarde ; accès SSH (port 222 sur IPFire).
tags: [aide-mémoire, ipfire, endian, pakfire, console]
icon: terminal
---

Explications : [[01-ipfire|IPFire]] · [[02-endian|Endian]].

## IPFire

```bash
ssh -p 222 root@10.0.10.1
setup                                            # réseau, mots de passe, cartes
pakfire update ; pakfire upgrade -y
pakfire install -y nut ; pakfire remove -y nut
cat /opt/pakfire/db/core/mine                    # numéro de Core Update installé
/etc/init.d/unbound restart ; /etc/init.d/squid restart
tail -f /var/log/messages
iptables -L -n -v | less ; ipset list -n
ip -br addr ; ip route
tail -f /var/log/suricata/fast.log
```

## Endian Firewall Community

```bash
ssh root@192.168.0.15
tail -f /var/log/messages
iptables -L -n -v | less
```
