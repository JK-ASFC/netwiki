---
title: ProFTPD — aide-mémoire des commandes
description: Commandes ProFTPD avec exemples — vérification (proftpd -t, -vv, -l), service, configuration (DefaultRoot, mode passif, TLS avec mod_tls, SFTP avec mod_sftp), utilisateurs virtuels (ftpasswd), contrôle à chaud (ftpdctl), utilisateurs connectés (ftpwho, ftpcount, ftptop), journaux et tests.
tags: [aide-mémoire, proftpd, ftp, ftps, sftp, ftpasswd]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|ProFTPD]].

## Service et vérification

```bash
sudo proftpd -t                         # syntaxe
sudo proftpd -vv                        # version et modules
sudo proftpd -l                         # modules compilés
sudo systemctl restart proftpd
ftpwho                                  # sessions en cours
ftpcount
ftptop
```

## Configuration (extraits)

```apache
# /etc/proftpd/proftpd.conf
ServerName "FTP Exemple"
DefaultRoot ~
RequireValidShell off
PassivePorts 40000 40100
MasqueradeAddress 203.0.113.26
MaxLoginAttempts 3
<Limit LOGIN>
  AllowGroup ftp-utilisateurs
  DenyAll
</Limit>
Include /etc/proftpd/tls.conf
```

```apache
# /etc/proftpd/tls.conf
<IfModule mod_tls.c>
  TLSEngine on
  TLSRequired on
  TLSProtocol TLSv1.2 TLSv1.3
  TLSRSACertificateFile /etc/ssl/certs/ftp.exemple.fr.pem
  TLSRSACertificateKeyFile /etc/ssl/private/ftp.exemple.fr.key
  TLSOptions NoSessionReuseRequired
</IfModule>
```

```apache
# SFTP sur un port dédié (mod_sftp)
<IfModule mod_sftp.c>
  <VirtualHost 0.0.0.0>
    Port 2222
    SFTPEngine on
    SFTPHostKey /etc/ssh/ssh_host_ed25519_key
    SFTPAuthMethods password publickey
    DefaultRoot ~
  </VirtualHost>
</IfModule>
```

## Utilisateurs virtuels

```bash
sudo ftpasswd --passwd --file=/etc/proftpd/ftpd.passwd --name=partenaire1 --uid=2001 --gid=2001 --home=/srv/ftp/partenaire1 --shell=/bin/false
sudo ftpasswd --passwd --file=/etc/proftpd/ftpd.passwd --name=partenaire1 --change-password
sudo ftpasswd --group --file=/etc/proftpd/ftpd.group --name=partenaires --gid=2001 --member=partenaire1
# proftpd.conf : AuthUserFile /etc/proftpd/ftpd.passwd ; AuthGroupFile /etc/proftpd/ftpd.group ; AuthOrder mod_auth_file.c
```

## Contrôle et tests

```bash
sudo ftpdctl debug level 5               # avec mod_ctrls
sudo ftpdctl kick user partenaire1
curl -v --ssl-reqd --user partenaire1 ftp://ftp.exemple.fr/
sftp -P 2222 partenaire1@ftp.exemple.fr
sudo tail -f /var/log/proftpd/proftpd.log /var/log/proftpd/xferlog
```
