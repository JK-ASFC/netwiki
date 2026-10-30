---
title: Utilisateurs virtuels, TLS, quotas et scripts
description: Configurer Pure-FTPd — utilisateurs virtuels avec pure-pw (quotas en fichiers et en taille, débits, restrictions d'IP et d'horaires, sessions simultanées), FTPS obligatoire, authentification LDAP/MySQL, traitement automatique des dépôts avec pure-uploadscript, et limitation des abus.
tags: [pure-ftpd, pure-pw, puredb, quotas, tls, ldap, pure-uploadscript]
icon: settings-2
---

## Utilisateurs virtuels (PureDB)

Tous les utilisateurs virtuels sont exécutés sous un **compte système unique** sans shell.

```bash
sudo groupadd -g 2001 ftpgroup
sudo useradd -u 2001 -g ftpgroup -d /dev/null -s /usr/sbin/nologin ftpuser
sudo mkdir -p /srv/ftp && sudo chown ftpuser:ftpgroup /srv/ftp

# Créer un utilisateur (le mot de passe est demandé) ; -m met à jour la base .pdb immédiatement
sudo pure-pw useradd partenaire1 -u ftpuser -g ftpgroup -d /srv/ftp/partenaire1 \
     -N 5000 -n 10000 -T 2048 -t 4096 -r 198.51.100.0/24 -y 3 -m
```

| Option `pure-pw` | Effet |
| --- | --- |
| `-d` / `-D` | Dossier avec chroot / sans chroot |
| `-N <Mo>` / `-n <fichiers>` | Quota en taille / en nombre de fichiers |
| `-T <Ko/s>` / `-t <Ko/s>` | Débit maximal en dépôt (upload) / en téléchargement |
| `-q` / `-Q` | Ratios dépôt/téléchargement |
| `-r` / `-R <IP/masque>` | Adresses clientes autorisées / refusées |
| `-z 0800-1900` | Plage horaire autorisée |
| `-y <n>` | Sessions simultanées maximales |

```bash
sudo pure-pw list
sudo pure-pw show partenaire1
sudo pure-pw passwd partenaire1 -m
sudo pure-pw usermod partenaire1 -N 10000 -m       # modifier un quota
sudo pure-pw userdel partenaire1 -m
sudo pure-pw mkdb                                  # recompiler la base si -m n'a pas été utilisé
```

Les quotas reposent sur un fichier `.ftpquota` dans le dossier de l'utilisateur ; activez `Quota` côté serveur si vous imposez aussi un quota global, et recalculez avec `pure-quotacheck -u ftpuser -d /srv/ftp/partenaire1` après des modifications hors FTP.

## FTPS

```bash
# Debian : certificat + clé concaténés dans un seul fichier
sudo cat /etc/letsencrypt/live/ftp.exemple.fr/fullchain.pem \
         /etc/letsencrypt/live/ftp.exemple.fr/privkey.pem | sudo tee /etc/ssl/private/pure-ftpd.pem >/dev/null
sudo chmod 600 /etc/ssl/private/pure-ftpd.pem
echo 2 | sudo tee /etc/pure-ftpd/conf/TLS
echo 'HIGH:!aNULL:!MD5' | sudo tee /etc/pure-ftpd/conf/TLSCipherSuite
sudo systemctl restart pure-ftpd
```

| Valeur `TLS` | Comportement |
| --- | --- |
| `0` | TLS désactivé |
| `1` | FTP et FTPS acceptés |
| `2` | **Connexion en clair refusée** : authentification obligatoirement chiffrée |
| `3` | Contrôle **et** données obligatoirement chiffrés |

Utilisez `2` ou `3` ; les certificats renouvelés doivent être reconcaténés (crochet `deploy` de certbot) puis le service redémarré.

## Authentification LDAP / MySQL

```pureftpd /etc/pure-ftpd/db/ldap.conf
LDAPServer      dc1.corp.exemple.fr
LDAPPort        389
LDAPUseTLS      True            # StartTLS (chiffrement obligatoire du bind)
LDAPBindDN      CN=svc_pureftpd,OU=Services,DC=corp,DC=exemple,DC=fr
LDAPBindPW      MotDePasse
LDAPBaseDN      OU=Utilisateurs,DC=corp,DC=exemple,DC=fr
LDAPFilter      (&(objectClass=user)(sAMAccountName=\L)(memberOf=CN=GG_FTP,OU=Groupes,DC=corp,DC=exemple,DC=fr))
LDAPDefaultUID  2001
LDAPDefaultGID  2001
LDAPHomeDir     unixHomeDirectory
LDAPAuthMethod  BIND
```

```bash
# Debian : activer la méthode LDAP avant PureDB
echo /etc/pure-ftpd/db/ldap.conf | sudo tee /etc/pure-ftpd/conf/LDAPConfigFile
sudo ln -s ../conf/LDAPConfigFile /etc/pure-ftpd/auth/40ldap
```

Le paquet doit être compilé avec la prise en charge LDAP (Debian : `pure-ftpd-ldap`, MySQL : `pure-ftpd-mysql`).

## Traitement automatique des dépôts

```bash
echo yes | sudo tee /etc/pure-ftpd/conf/CallUploadScript
```

```bash /usr/local/bin/apres-depot.sh
#!/bin/sh
# $1 = chemin du fichier déposé ; variables UPLOAD_USER, UPLOAD_SIZE, UPLOAD_VUSER disponibles
logger -t ftp-depot "Dépôt de $UPLOAD_VUSER : $1 ($UPLOAD_SIZE octets)"
clamdscan --no-summary --move=/srv/quarantaine "$1"
```

```bash
sudo chmod 755 /usr/local/bin/apres-depot.sh
sudo pure-uploadscript -B -r /usr/local/bin/apres-depot.sh     # démon (unité systemd conseillée)
```

## Limiter les abus

| Option | Effet |
| --- | --- |
| `MaxClientsPerIP 3` | Connexions par IP |
| `MaxLoad 4` | Refuser les téléchargements si la charge système dépasse la valeur |
| `MaxDiskUsage 90` | Refuser les dépôts au-delà de 90 % d'occupation du disque |
| `KeepAllFiles yes` | Interdire suppression et écrasement (archives de dépôts) |
| `NoChmod yes` | Interdire la modification des droits |
| `TrustedGID` | Seul ce groupe peut sortir du chroot (avec `ChrootEveryone no`) |

Ajoutez fail2ban (filtre `pure-ftpd` fourni) pour bannir les tentatives de force brute.
