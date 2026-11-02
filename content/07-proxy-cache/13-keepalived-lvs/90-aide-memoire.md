---
title: Keepalived, LVS, Pen et Balance — aide-mémoire des commandes
description: Commandes Keepalived (keepalived -t, --version, systemctl, journaux, signaux USR1/USR2, tcpdump vrrp, ip addr), ipvsadm (-A, -a, -e, -d, -D, -C, -Ln, --stats, --rate, -lnc, --set, ipvsadm-save, ipvsadm-restore), Pen (penctl) et Balance avec exemples.
tags: [aide-mémoire, keepalived, ipvsadm, lvs, pen, balance]
icon: terminal
---

Explications : [[01-keepalived|Keepalived]] · [[02-lvs-ipvs|LVS]] · [[03-pen-balance|Pen et Balance]].

## Keepalived

```bash
sudo keepalived -t -f /etc/keepalived/keepalived.conf
sudo systemctl reload keepalived ; journalctl -u keepalived -f
ip -br addr show eth0                               # la VIP est-elle ici ?
sudo tcpdump -ni eth0 vrrp                          # annonces (priorité, VRID)
sudo kill -USR1 "$(cat /run/keepalived.pid)" && sudo cat /tmp/keepalived.data    # état interne
sudo kill -USR2 "$(cat /run/keepalived.pid)" && sudo cat /tmp/keepalived.stats   # statistiques VRRP
sudo systemctl stop haproxy                         # tester la bascule
```

## ipvsadm

```bash
sudo ipvsadm -Ln                                    # services et serveurs réels
sudo ipvsadm -Ln --stats ; sudo ipvsadm -Ln --rate
sudo ipvsadm -lnc | head                            # table des connexions
sudo ipvsadm -A -t 10.0.20.100:443 -s sh            # hachage de la source (persistance)
sudo ipvsadm -a -t 10.0.20.100:443 -r 10.0.20.21:443 -m -w 1
sudo ipvsadm -e -t 10.0.20.100:443 -r 10.0.20.21:443 -m -w 0   # poids 0 : drainer
sudo ipvsadm -d -t 10.0.20.100:443 -r 10.0.20.21:443
sudo ipvsadm -D -t 10.0.20.100:443 ; sudo ipvsadm -C            # supprimer un service / tout
sudo ipvsadm --set 900 120 300                      # délais TCP, TCP FIN, UDP
sudo ipvsadm-save -n | sudo tee /etc/ipvsadm.rules ; sudo ipvsadm-restore < /etc/ipvsadm.rules
```

## Pen et Balance

```bash
penctl 127.0.0.1:10080 servers ; penctl 127.0.0.1:10080 status
```
