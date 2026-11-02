---
title: OpenConnect et ocserv — aide-mémoire des commandes
description: Commandes ocserv (occtl show status, users, user, disconnect, reload ; ocpasswd ; journaux) et client openconnect (connexion AnyConnect, GlobalProtect, Fortinet, Pulse, authgroup, servercert, background, script vpnc-script, déconnexion) avec exemples.
tags: [aide-mémoire, ocserv, openconnect, occtl, vpn ssl]
icon: terminal
---

Explications : [[01-presentation-installation|ocserv et OpenConnect]].

## Serveur (ocserv)

```bash
sudo occtl show status
sudo occtl show users
sudo occtl show user jk
sudo occtl show ip bans
sudo occtl disconnect user jk
sudo occtl reload                                   # recharger ocserv.conf sans couper les sessions
sudo ocpasswd -c /etc/ocserv/ocpasswd -g admins jk
sudo ocpasswd -c /etc/ocserv/ocpasswd -d ancien     # supprimer
journalctl -u ocserv -f
```

## Client (openconnect)

```bash
sudo openconnect --user=jk https://vpn.corp.exemple.fr
sudo openconnect --authgroup=ADMINS --user=jk vpn.corp.exemple.fr
sudo openconnect --protocol=gp vpn.partenaire.fr               # GlobalProtect
sudo openconnect --protocol=nc vpn.client.fr                   # Pulse/Juniper Network Connect ; « pulse » pour Pulse Secure
sudo openconnect --protocol=fortinet vpn.client.fr:10443
sudo openconnect -b --user=jk vpn.corp.exemple.fr               # en arrière-plan
sudo pkill -SIGINT openconnect                                  # déconnexion propre
openconnect --version
```
