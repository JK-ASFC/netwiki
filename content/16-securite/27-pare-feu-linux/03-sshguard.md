---
title: SSHGuard
description: SSHGuard (BSD) — protection contre les attaques par force brute en lisant les journaux (SSH, FTP, messagerie, serveurs web selon les motifs) et en bloquant les adresses fautives via nftables, iptables, firewalld, ipfw ou pf : installation (Debian/Ubuntu, RHEL, FreeBSD, OpenBSD, macOS), sshguard.conf (BACKEND, LOGREADER journalctl, THRESHOLD, BLOCK_TIME, DETECTION_TIME), liste blanche, comparaison avec Fail2ban et CrowdSec.
tags: [sshguard, force brute, ssh, pare-feu, bsd, fail2ban]
icon: info
---

**SSHGuard** surveille les journaux et **bloque** temporairement les adresses qui multiplient les échecs d'authentification. Plus léger et plus simple que [[01-fail2ban/01-presentation-configuration|Fail2ban]] (aucune expression régulière à écrire, analyseur intégré), il fonctionne aussi sur les **BSD** avec `pf`. Pour une protection collaborative et plus large, voir [[02-crowdsec/01-presentation-installation|CrowdSec]].

```bash
sudo apt install sshguard            # Debian/Ubuntu ; RHEL : EPEL ; FreeBSD : pkg install sshguard ; macOS : brew install sshguard
```

```ini
# /etc/sshguard/sshguard.conf (Debian)
BACKEND="/usr/libexec/sshguard/sshg-fw-nft-sets"     # nftables (ou sshg-fw-iptables, sshg-fw-firewalld, sshg-fw-pf)
LOGREADER="LANG=C /bin/journalctl -afb -p info -n1 -t sshd -t dovecot -t postfix -o cat"
THRESHOLD=30            # score (10 par tentative) avant blocage
BLOCK_TIME=600          # 10 minutes, doublé à chaque récidive
DETECTION_TIME=1800
WHITELIST_FILE=/etc/sshguard/whitelist
```

```bash
echo "10.0.99.0/24" | sudo tee -a /etc/sshguard/whitelist
sudo systemctl enable --now sshguard
sudo nft list table ip sshguard          # adresses bloquées (backend nft-sets)
```

Commandes : [[90-aide-memoire|aide-mémoire]].
