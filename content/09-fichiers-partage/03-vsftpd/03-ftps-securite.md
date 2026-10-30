---
title: FTPS et sécurité
description: Activer FTPS explicite ou implicite dans vsftpd (certificat Let's Encrypt ou interne, TLS obligatoire pour l'authentification et les données, chiffrements, réutilisation de session), pare-feu et NAT avec FTPS, protection contre le force brute (fail2ban), SELinux et bonnes pratiques.
tags: [vsftpd, ftps, tls, certificat, fail2ban, selinux, sécurité]
icon: shield-check
---

## FTPS explicite

```vsftpd /etc/vsftpd.conf (TLS)
ssl_enable=YES
rsa_cert_file=/etc/letsencrypt/live/ftp.exemple.fr/fullchain.pem
rsa_private_key_file=/etc/letsencrypt/live/ftp.exemple.fr/privkey.pem

# TLS obligatoire pour l'authentification et les données
force_local_logins_ssl=YES
force_local_data_ssl=YES
allow_anon_ssl=NO

# Protocoles et suites
ssl_sslv2=NO
ssl_sslv3=NO
ssl_tlsv1=NO
ssl_ciphers=HIGH:!aNULL:!MD5

# Le canal de données doit réutiliser la session TLS du contrôle (empêche le vol de connexion)
require_ssl_reuse=YES
```

> [!NOTE]
> La version minimale de TLS dépend aussi de la politique OpenSSL du système (`update-crypto-policies` sur RHEL). Avec `ssl_tlsv1=NO`, seules les versions plus récentes (TLS 1.2/1.3 selon la compilation) restent acceptées.

Renouvellement Let's Encrypt : le certificat est relu à chaque connexion (processus par session) ; aucun rechargement n'est nécessaire, mais vérifiez que vsftpd peut lire les fichiers (droits sur `/etc/letsencrypt/live` et `archive`).

### Certificat interne (auto-signé ou AC d'entreprise)

```bash
sudo openssl req -x509 -nodes -days 825 -newkey ec -pkeyopt ec_paramgen_curve:P-256 \
  -keyout /etc/ssl/private/vsftpd.key -out /etc/ssl/certs/vsftpd.crt \
  -subj "/CN=ftp.corp.exemple.fr" -addext "subjectAltName=DNS:ftp.corp.exemple.fr"
sudo chmod 600 /etc/ssl/private/vsftpd.key
```

### FTPS implicite (port 990)

```vsftpd
listen_port=990
implicit_ssl=YES
```

Utilisez une **seconde instance** (fichier de configuration et unité systemd séparés, ex. `vsftpd@implicite`) si vous devez servir explicite et implicite en même temps.

### Test

```bash
openssl s_client -connect ftp.exemple.fr:21 -starttls ftp </dev/null | head -20
curl -v --ssl-reqd --user partenaire1 ftp://ftp.exemple.fr/depot/
lftp -u partenaire1 -e "set ftp:ssl-force true; set ssl:verify-certificate yes; ls; bye" ftp.exemple.fr
```

Dans **FileZilla** : *Exiger FTP explicite sur TLS*.

## Pare-feu avec FTPS

Le contrôle étant chiffré, le pare-feu ne peut pas lire la réponse `PASV` :

```bash
# nftables : port 21 + plage passive explicite
sudo nft add rule inet filter input tcp dport { 21, 40000-40100 } ct state new accept
```

Derrière un NAT : `pasv_address=<IP publique>` et redirection de **toute** la plage passive vers le serveur. Un équilibreur de charge doit conserver l'affinité par IP source (contrôle et données sur le même serveur).

## Force brute : fail2ban

```ini /etc/fail2ban/jail.d/vsftpd.local
[vsftpd]
enabled  = true
port     = ftp,ftp-data,ftps,ftps-data,40000:40100
logpath  = /var/log/vsftpd.log
maxretry = 5
findtime = 10m
bantime  = 1h
```

(`dual_log_enable=YES` ou `vsftpd_log_file` doit être actif pour que les échecs soient journalisés.)

## SELinux (RHEL)

| Besoin | Réglage |
| --- | --- |
| Écriture dans les dossiers des utilisateurs / tout répertoire | `setsebool -P ftpd_full_access on` |
| Dossier public en écriture | Contexte `public_content_rw_t` + `setsebool -P ftpd_anon_write on` |
| Dossier hors des emplacements standard | `semanage fcontext -a -t public_content_t "/srv/ftp(/.*)?"` puis `restorecon -Rv /srv/ftp` |
| Authentification via un service réseau (LDAP) | `setsebool -P ftpd_connect_all_unreserved on` si nécessaire |

## Bonnes pratiques

- [ ] Pas d'anonyme en écriture ; anonyme en lecture seulement si indispensable
- [ ] FTPS obligatoire (`force_local_*_ssl=YES`) ou, mieux, migration vers SFTP
- [ ] Comptes virtuels ou shells `nologin`, chroot, liste d'utilisateurs autorisés
- [ ] Plage passive réduite et explicite dans le pare-feu
- [ ] fail2ban, `max_per_ip`, `delay_failed_login`
- [ ] Dossiers de dépôt en écriture seule si possible (`chmod 733`, l'utilisateur ne voit pas les fichiers des autres)
- [ ] Antivirus sur les dépôts entrants, purge automatique des anciens fichiers
