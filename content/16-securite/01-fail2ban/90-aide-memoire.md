---
title: fail2ban — aide-mémoire des commandes
description: Commandes fail2ban avec exemples — service, fail2ban-client (status, status prison, banip, unbanip, banned, reload, get/set), test des filtres (fail2ban-regex), prisons usuelles (sshd, nginx, postfix, dovecot, recidive), actions nftables/firewalld, liste blanche, journaux.
tags: [aide-mémoire, fail2ban, fail2ban-client, fail2ban-regex, sécurité, ssh]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|fail2ban]].

## fail2ban-client

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
sudo fail2ban-client status sshd
sudo fail2ban-client banned                               # toutes les adresses bannies
sudo fail2ban-client set sshd banip 203.0.113.50
sudo fail2ban-client set sshd unbanip 203.0.113.50
sudo fail2ban-client unban --all
sudo fail2ban-client reload
sudo fail2ban-client reload sshd
sudo fail2ban-client get sshd bantime
sudo fail2ban-client set sshd bantime 86400
sudo fail2ban-client get sshd ignoreip
sudo fail2ban-client -d | less                            # configuration effective
```

## Tester un filtre

```bash
sudo fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
sudo fail2ban-regex systemd-journal sshd                  # sur le journal systemd
sudo fail2ban-regex /var/log/nginx/access.log /etc/fail2ban/filter.d/nginx-botsearch.conf --print-all-matched
```

## Prisons

```ini
# /etc/fail2ban/jail.local
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
bantime.increment = true
ignoreip = 127.0.0.1/8 ::1 10.0.99.0/24
banaction = nftables-multiport
backend = systemd

[sshd]
enabled = true

[nginx-http-auth]
enabled = true
logpath = /var/log/nginx/error.log
backend = auto

[postfix]
enabled = true
mode = aggressive

[dovecot]
enabled = true

[recidive]
enabled = true
logpath = /var/log/fail2ban.log
backend = auto
bantime = 1w
findtime = 1d
maxretry = 3
```

## Filtre personnalisé

```ini
# /etc/fail2ban/filter.d/appli-connexion.conf
[Definition]
failregex = ^.*Échec de connexion pour .* depuis <HOST>$
ignoreregex =
```

## Vérifications

```bash
sudo nft list set inet f2b-table addr-set-sshd            # adresses bannies côté nftables
sudo tail -f /var/log/fail2ban.log
sudo grep "Ban " /var/log/fail2ban.log | awk '{print $NF}' | sort | uniq -c | sort -rn | head
```
