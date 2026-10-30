---
title: vsftpd — aide-mémoire des commandes
description: Commandes et options vsftpd avec exemples — service, configuration sécurisée (utilisateurs locaux chrootés, anonyme désactivé, FTPS explicite, mode passif et plage de ports, listes d'utilisateurs), utilisateurs virtuels (PAM, pam_pwdfile), certificats, pare-feu, tests (curl, lftp, openssl s_client), journaux xferlog.
tags: [aide-mémoire, vsftpd, ftp, ftps, chroot, passif]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|vsftpd]].

## Service

```bash
sudo systemctl restart vsftpd && sudo systemctl status vsftpd
vsftpd -v 0>&1                          # version (affichée sur l'entrée standard : redirection nécessaire)
sudo vsftpd /etc/vsftpd.conf             # démarrage manuel : affiche les erreurs de configuration
```

## Configuration sécurisée (extrait)

```ini
# /etc/vsftpd.conf
listen=YES
listen_ipv6=NO
anonymous_enable=NO
local_enable=YES
write_enable=YES
local_umask=027
chroot_local_user=YES
allow_writeable_chroot=NO
userlist_enable=YES
userlist_file=/etc/vsftpd.userlist
userlist_deny=NO
pasv_enable=YES
pasv_min_port=40000
pasv_max_port=40100
pasv_address=203.0.113.25
ssl_enable=YES
force_local_logins_ssl=YES
force_local_data_ssl=YES
ssl_tlsv1_2=YES
ssl_sslv2=NO
ssl_sslv3=NO
require_ssl_reuse=NO
rsa_cert_file=/etc/ssl/certs/ftp.exemple.fr.pem
rsa_private_key_file=/etc/ssl/private/ftp.exemple.fr.key
xferlog_enable=YES
xferlog_std_format=YES
```

```bash
echo amartin | sudo tee -a /etc/vsftpd.userlist          # seuls les comptes listés peuvent se connecter
sudo mkdir -p /srv/ftp/amartin/depot && sudo chown root:root /srv/ftp/amartin && sudo chown amartin: /srv/ftp/amartin/depot
sudo usermod -d /srv/ftp/amartin -s /usr/sbin/nologin amartin
echo /usr/sbin/nologin | sudo tee -a /etc/shells           # pam_shells accepte ce shell
```

## Pare-feu

```bash
sudo nft add rule inet filter input tcp dport { 21, 40000-40100 } ip saddr 10.0.0.0/8 accept
sudo firewall-cmd --permanent --add-service=ftp && sudo firewall-cmd --permanent --add-port=40000-40100/tcp && sudo firewall-cmd --reload
```

## Tests

```bash
curl -v --ssl-reqd --user amartin ftp://ftp.exemple.fr/depot/
lftp -u amartin -e "set ftp:ssl-force true; set ssl:verify-certificate yes; ls; bye" ftp.exemple.fr
openssl s_client -connect ftp.exemple.fr:21 -starttls ftp </dev/null | head
```

## Journaux

```bash
sudo tail -f /var/log/vsftpd.log /var/log/xferlog
sudo journalctl -u vsftpd -f
```
