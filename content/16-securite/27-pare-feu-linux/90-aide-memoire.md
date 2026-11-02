---
title: Pare-feu Linux — aide-mémoire des commandes
description: Commandes nft (list ruleset, list tables, add table/chain/rule/set/element, insert, delete rule handle, flush, -c -f, monitor trace), iptables (-L -n -v, -S, -A, -I, -D, -P, -t nat, -F, iptables-save, iptables-restore, iptables-translate), firewall-cmd (--state, --list-all, --get-zones, --add-service, --add-port, --add-source, --add-rich-rule, --runtime-to-permanent, --reload, --panic-on) et ufw (status verbose, allow, deny, limit, delete, reset, app list) avec exemples.
tags: [aide-mémoire, nftables, iptables, firewalld, ufw, sshguard]
icon: terminal
---

Explications : [[01-nftables-iptables|nftables et iptables]] · [[02-firewalld-ufw|firewalld et UFW]] · [[03-sshguard|SSHGuard]].

```bash
sudo nft list ruleset ; sudo nft list tables ; sudo nft -a list chain inet filtre entree ; sudo nft -c -f /etc/nftables.conf
sudo nft insert rule inet filtre entree position 5 ip saddr 10.0.50.0/24 tcp dport 3306 accept ; sudo nft delete rule inet filtre entree handle 9
sudo nft add rule inet filtre entree meta nftrace set 1 ; sudo nft monitor trace        # suivre le parcours d'un paquet
sudo iptables -S ; sudo iptables -L INPUT -n -v --line-numbers ; sudo iptables -I INPUT 1 -s 10.0.99.5 -j ACCEPT ; sudo iptables -D INPUT 4
sudo iptables-save > sauv.v4 ; sudo iptables-restore < sauv.v4 ; iptables-translate -A INPUT -p udp --dport 53 -j ACCEPT
sudo firewall-cmd --state ; sudo firewall-cmd --list-all-zones | less ; sudo firewall-cmd --add-port=8443/tcp --timeout=10m
sudo firewall-cmd --runtime-to-permanent ; sudo firewall-cmd --reload ; sudo firewall-cmd --list-rich-rules ; sudo firewall-cmd --panic-on
sudo ufw status verbose ; sudo ufw app list ; sudo ufw deny from 198.51.100.77 ; sudo ufw insert 1 allow from 10.0.99.0/24 ; sudo ufw reset
sudo journalctl -u sshguard -f
```
