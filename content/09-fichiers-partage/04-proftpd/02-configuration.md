---
title: "Configuration : droits, FTPS, SFTP, utilisateurs virtuels, quotas"
description: Configurer ProFTPD en profondeur — règles par répertoire et par commande (Limit, AllowUser, DenyAll), accès anonyme, FTPS avec mod_tls, serveur SFTP/SCP avec mod_sftp, utilisateurs virtuels (ftpasswd, SQL, LDAP/AD), quotas mod_quotatab, bannissement mod_ban et hôtes virtuels.
tags: [proftpd, limit, mod_tls, mod_sftp, ftpasswd, mod_sql, mod_ldap, quotas, mod_ban]
icon: settings-2
---

## Règles par répertoire et par commande

```proftpd
# Dépôt : écriture sans lecture (les partenaires ne voient pas les fichiers des autres)
<Directory /srv/ftp/*/depot>
  <Limit READ DIRS>
    DenyAll
  </Limit>
  <Limit WRITE>
    AllowAll
  </Limit>
</Directory>

# Diffusion : lecture seule sauf pour le groupe ftp-admins
<Directory /srv/ftp/diffusion>
  <Limit WRITE>
    AllowGroup ftp-admins
    DenyAll
  </Limit>
</Directory>

# Connexion réservée à un groupe
<Limit LOGIN>
  AllowGroup ftp-utilisateurs
  DenyAll
</Limit>
```

| Groupe de commandes | Contenu |
| --- | --- |
| `READ` | Téléchargement (`RETR`) |
| `WRITE` | Dépôt, création de dossier, suppression, renommage (`STOR`, `MKD`, `DELE`, `RNFR`…) |
| `DIRS` | Listages et navigation (`LIST`, `NLST`, `CWD`…) |
| `LOGIN` | Connexion |
| `ALL` | Toutes les commandes |

## Accès anonyme

```proftpd
<Anonymous /srv/ftp/public>
  User            ftp
  Group           nogroup
  UserAlias       anonymous ftp
  RequireValidShell off
  MaxClients      20
  <Limit WRITE>
    DenyAll
  </Limit>
</Anonymous>
```

## FTPS (mod_tls)

```proftpd /etc/proftpd/tls.conf
<IfModule mod_tls.c>
  TLSEngine                  on
  TLSLog                     /var/log/proftpd/tls.log
  TLSProtocol                TLSv1.2 TLSv1.3
  TLSRSACertificateFile      /etc/letsencrypt/live/ftp.exemple.fr/fullchain.pem
  TLSRSACertificateKeyFile   /etc/letsencrypt/live/ftp.exemple.fr/privkey.pem
  TLSRequired                on              # contrôle et données chiffrés obligatoires
  TLSVerifyClient            off
  TLSRenegotiate             none
  TLSOptions                 NoSessionReuseRequired   # seulement si des clients anciens échouent
</IfModule>
```

Sous Debian, activer `Include /etc/proftpd/tls.conf` dans `proftpd.conf` et le module dans `modules.conf` (`LoadModule mod_tls.c`).

## SFTP et SCP (mod_sftp)

ProFTPD peut servir **SFTP** sur un port distinct (OpenSSH reste sur 22), avec les mêmes utilisateurs virtuels, quotas et règles que le FTP.

```proftpd /etc/proftpd/conf.d/20-sftp.conf
<IfModule mod_sftp.c>
  <VirtualHost 0.0.0.0>
    Port                   2222
    SFTPEngine             on
    SFTPLog                /var/log/proftpd/sftp.log
    SFTPHostKey            /etc/proftpd/ssh_host_ecdsa_key
    SFTPHostKey            /etc/proftpd/ssh_host_rsa_key
    SFTPAuthMethods        publickey password
    SFTPAuthorizedUserKeys file:/etc/proftpd/authorized_keys/%u
    SFTPCompression        delayed
    DefaultRoot            ~
    RequireValidShell      off
    MaxLoginAttempts       3
    AuthUserFile           /etc/proftpd/ftpd.passwd
    AuthOrder              mod_auth_file.c
  </VirtualHost>
</IfModule>
```

```bash
sudo ssh-keygen -m PEM -t ecdsa -b 384 -f /etc/proftpd/ssh_host_ecdsa_key -N ''
sudo ssh-keygen -m PEM -t rsa -b 3072 -f /etc/proftpd/ssh_host_rsa_key -N ''
sudo mkdir -p /etc/proftpd/authorized_keys
# Une clé publique par utilisateur ; versions anciennes de mod_sftp : format RFC 4716 exigé
sudo ssh-keygen -e -f partenaire1.pub | sudo tee /etc/proftpd/authorized_keys/partenaire1
```

## Utilisateurs virtuels

### Fichier (mod_auth_file)

```bash
sudo ftpasswd --passwd --file=/etc/proftpd/ftpd.passwd --name=partenaire1 \
     --uid=2001 --gid=2001 --home=/srv/ftp/partenaire1 --shell=/bin/false
sudo ftpasswd --group --file=/etc/proftpd/ftpd.group --name=partenaires --gid=2001 --member=partenaire1
sudo ftpasswd --passwd --file=/etc/proftpd/ftpd.passwd --name=partenaire1 --change-password
sudo chmod 440 /etc/proftpd/ftpd.passwd
```

```proftpd
AuthUserFile    /etc/proftpd/ftpd.passwd
AuthGroupFile   /etc/proftpd/ftpd.group
AuthOrder       mod_auth_file.c
```

### SQL (MySQL/MariaDB)

```proftpd /etc/proftpd/sql.conf
<IfModule mod_sql.c>
  SQLBackend          mysql
  SQLEngine           on
  SQLAuthenticate     users groups
  SQLAuthTypes        Crypt
  SQLConnectInfo      ftp@db01.corp.exemple.fr ftp_lecture MotDePasse
  SQLUserInfo         ftpuser userid passwd uid gid homedir shell
  SQLGroupInfo        ftpgroup groupname gid members
  SQLMinUserUID       2000
  SQLMinUserGID       2000
  SQLLogFile          /var/log/proftpd/sql.log
</IfModule>
AuthOrder mod_sql.c
```

### LDAP / Active Directory

```proftpd /etc/proftpd/ldap.conf
<IfModule mod_ldap.c>
  LDAPServer              ldaps://dc1.corp.exemple.fr/??sub
  LDAPBindDN              "CN=svc_proftpd,OU=Services,DC=corp,DC=exemple,DC=fr" "MotDePasse"
  LDAPUsers               "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr" "(&(sAMAccountName=%u)(memberOf=CN=GG_FTP,OU=Groupes,DC=corp,DC=exemple,DC=fr))"
  LDAPAttr                uid sAMAccountName
  LDAPDefaultUID          2000
  LDAPDefaultGID          2000
  LDAPGenerateHomedir     on 0750
  LDAPGenerateHomedirPrefix /srv/ftp
  LDAPForceGeneratedHomedir on
</IfModule>
AuthOrder mod_ldap.c
```

## Quotas (mod_quotatab)

```proftpd
<IfModule mod_quotatab.c>
  QuotaEngine     on
  QuotaLog        /var/log/proftpd/quota.log
  QuotaShowQuotas on
  <IfModule mod_quotatab_file.c>
    QuotaLimitTable file:/etc/proftpd/ftpquota.limittab
    QuotaTallyTable file:/etc/proftpd/ftpquota.tallytab
  </IfModule>
</IfModule>
```

```bash
cd /etc/proftpd
sudo ftpquota --create-table --type=limit
sudo ftpquota --create-table --type=tally
sudo ftpquota --add-record --type=limit --name=partenaire1 --quota-type=user \
     --bytes-upload=5368709120 --units=B
sudo ftpquota --show-records --type=limit
```

## Bannissement automatique (mod_ban)

```proftpd
<IfModule mod_ban.c>
  BanEngine       on
  BanLog          /var/log/proftpd/ban.log
  BanTable        /var/lib/proftpd/ban.tab
  # 3 dépassements de MaxLoginAttempts en 10 min → bannissement 1 h
  BanOnEvent      MaxLoginAttempts 3/00:10:00 01:00:00
  BanControlsACLs all allow user root
</IfModule>
```

```bash
sudo ftpdctl ban info
sudo ftpdctl permit host 198.51.100.7
```

## Hôtes virtuels

```proftpd
<VirtualHost 203.0.113.21>
  ServerName      "FTP partenaires"
  DefaultRoot     ~
  AuthUserFile    /etc/proftpd/partenaires.passwd
  AuthOrder       mod_auth_file.c
  TransferLog     /var/log/proftpd/partenaires-xfer.log
</VirtualHost>
```

Depuis ProFTPD 1.3.6, la commande FTP `HOST` (RFC 7151) permet aussi des hôtes virtuels **par nom** sur une même IP, si les clients la gèrent.
