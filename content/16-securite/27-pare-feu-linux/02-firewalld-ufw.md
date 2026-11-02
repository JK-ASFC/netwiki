---
title: firewalld et UFW
description: Gestionnaires de pare-feu Linux — firewalld (RHEL, Fedora, SUSE : zones, services, ports, sources, masquerade, redirections, rich rules, règles directes, mode permanent et runtime, --reload, firewall-cmd, interface Cockpit) et UFW (Ubuntu, Debian : politique par défaut, allow/deny/limit, profils d'applications, journalisation, règles numérotées, before.rules pour le NAT, ufw-docker), exemples pour un serveur web, un serveur d'administration et une passerelle, et dépannage.
tags: [firewalld, ufw, pare-feu, linux, zones, firewall-cmd]
icon: info
---

**firewalld** et **UFW** simplifient [[01-nftables-iptables|nftables/iptables]] : on raisonne en **services** et en **zones** plutôt qu'en règles brutes. N'en utilisez qu'**un seul** par machine (ne pas mélanger avec des règles nft manuelles).

## firewalld (famille Red Hat, SUSE)

```bash
sudo systemctl enable --now firewalld
sudo firewall-cmd --get-active-zones ; sudo firewall-cmd --list-all
sudo firewall-cmd --permanent --add-service=https --add-service=http
sudo firewall-cmd --permanent --zone=internal --add-source=10.0.99.0/24 && sudo firewall-cmd --permanent --zone=internal --add-service=ssh
sudo firewall-cmd --permanent --zone=public --remove-service=ssh        # SSH seulement depuis le réseau d'administration
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="10.0.20.0/24" port port="5432" protocol="tcp" accept'
sudo firewall-cmd --permanent --add-masquerade ; sudo firewall-cmd --permanent --add-forward-port=port=443:proto=tcp:toaddr=10.0.20.10
sudo firewall-cmd --reload
```

`--permanent` écrit la configuration ; sans lui, la modification est immédiate mais perdue au redémarrage (pratique pour tester : `--timeout=5m`). Zones prédéfinies : `public`, `internal`, `trusted`, `dmz`, `drop`, `block`.

## UFW (Ubuntu, Debian)

```bash
sudo apt install ufw
sudo ufw default deny incoming ; sudo ufw default allow outgoing
sudo ufw allow from 10.0.99.0/24 to any port 22 proto tcp     # AVANT d'activer, pour ne pas se couper l'accès
sudo ufw allow 'Nginx Full'                                   # profil d'application (/etc/ufw/applications.d)
sudo ufw limit 22/tcp                                         # limite les connexions répétées
sudo ufw enable ; sudo ufw status numbered ; sudo ufw delete 3
sudo ufw logging medium
```

Le NAT et la redirection se configurent dans `/etc/ufw/before.rules` (section `*nat`) et `DEFAULT_FORWARD_POLICY` dans `/etc/default/ufw`. Avec **Docker**, les ports publiés contournent UFW : utiliser l'outil `ufw-docker` ou lier les ports à `127.0.0.1`.

Interface graphique : Cockpit pour firewalld ([[15-glances-cockpit/02-cockpit|Cockpit]]), `gufw` pour UFW sur poste de travail.

Suite : [[03-sshguard|SSHGuard]] · [[90-aide-memoire|aide-mémoire]].
