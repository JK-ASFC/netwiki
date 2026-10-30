---
title: Présentation et installation
description: ProFTPD, serveur FTP modulaire à configuration de type Apache — architecture (modules mod_tls, mod_sftp, mod_sql, mod_ldap, mod_quotatab, mod_ban), contextes de configuration, installation sous Debian/Ubuntu, RHEL et macOS, structure des fichiers, configuration de base et vérification.
tags: [proftpd, ftp, ftps, sftp, modules, installation]
icon: info
---

**ProFTPD** est un serveur FTP dont la configuration reprend la syntaxe d'**Apache** (directives, sections `<Directory>`, `<Limit>`, `<VirtualHost>`). Sa force est sa **modularité** : FTPS, **SFTP/SCP** (sans OpenSSH), utilisateurs en base SQL ou LDAP, quotas, bannissement automatique, hôtes virtuels.

Les concepts FTP (actif/passif, FTPS, pare-feu, NAT) sont décrits dans [[03-vsftpd/01-presentation-installation|FTP, FTPS et vsftpd]].

## Modules principaux

| Module | Rôle |
| --- | --- |
| `mod_tls` | FTPS explicite/implicite |
| `mod_sftp` | Serveur **SFTP et SCP** intégré (port distinct d'OpenSSH) |
| `mod_auth_file` | Utilisateurs virtuels dans un fichier de type passwd (`ftpasswd`) |
| `mod_sql`, `mod_sql_mysql`, `mod_sql_postgres` | Utilisateurs et journalisation en base de données |
| `mod_ldap` | Utilisateurs dans un annuaire LDAP / AD |
| `mod_quotatab` | Quotas par utilisateur/groupe |
| `mod_ban` | Bannissement automatique (échecs de connexion, abus) |
| `mod_ctrls` | Pilotage à chaud (`ftpdctl`) |
| `mod_wrap2`, `mod_geoip` | Filtrage par règles d'accès / pays |

## Installation

```bash
# Debian / Ubuntu (Debian 12 : proftpd-core ; anciennes versions : proftpd-basic)
sudo apt install proftpd-core proftpd-mod-crypto        # mod-crypto : mod_tls, mod_sftp
# Modules optionnels : proftpd-mod-mysql, proftpd-mod-pgsql, proftpd-mod-ldap
# RHEL (EPEL)
sudo dnf install epel-release && sudo dnf install proftpd proftpd-utils
# macOS
brew install proftpd

sudo systemctl enable --now proftpd
proftpd -v
proftpd -vv | grep -i mod_          # modules compilés/chargés
```

| Distribution | Fichiers |
| --- | --- |
| Debian / Ubuntu | `/etc/proftpd/proftpd.conf` + `modules.conf`, `tls.conf`, `sftp.conf`, `sql.conf`, `ldap.conf`, `conf.d/` |
| RHEL | `/etc/proftpd.conf`, modules activés par `LoadModule` / variables dans `/etc/sysconfig/proftpd` |

## Contextes de configuration

| Contexte | Portée |
| --- | --- |
| *server config* (racine) | Serveur principal |
| `<Global>` | Serveur principal **et** tous les hôtes virtuels |
| `<VirtualHost adresse>` | Serveur distinct (IP/port, ou nom avec FTP `HOST`) |
| `<Anonymous ~ftp>` | Accès anonyme |
| `<Directory /chemin>` | Règles par répertoire |
| `<Limit COMMANDES>` | Autoriser/refuser des commandes FTP (`READ`, `WRITE`, `DIRS`, `LOGIN`, `ALL`…) |

## Configuration de base

```proftpd /etc/proftpd/conf.d/10-base.conf
ServerName            "FTP Exemple"
ServerType            standalone
DefaultServer         on
Port                  21
UseIPv6               on
Umask                 022 022
MaxInstances          50
User                  proftpd
Group                 nogroup

# Enfermer les utilisateurs dans leur dossier personnel
DefaultRoot           ~
RequireValidShell     off
AllowOverwrite        on

# Mode passif et NAT
PassivePorts          40000 40100
MasqueradeAddress     203.0.113.20

# Pas d'identification par ident ni de résolution inverse (lenteurs)
IdentLookups          off
UseReverseDNS         off

# Sécurité
DenyFilter            \*.*/
ServerIdent           on "Serveur FTP"
MaxLoginAttempts      3
TimeoutIdle           600
```

```bash
sudo proftpd -t                 # vérifier la syntaxe (équivalent de apachectl configtest)
sudo systemctl restart proftpd
```

## Suite du parcours

1. [[02-configuration|Configuration : droits, FTPS, SFTP, utilisateurs virtuels, quotas]]
2. [[03-exploitation-depannage|Exploitation et dépannage]]
