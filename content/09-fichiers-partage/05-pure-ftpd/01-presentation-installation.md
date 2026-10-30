---
title: Présentation et installation
description: Pure-FTPd, serveur FTP simple et sûr — fonctions (utilisateurs virtuels PureDB, quotas, débits, TLS, scripts après dépôt), installation sous Debian/Ubuntu (enveloppe pure-ftpd-wrapper et un fichier par option), RHEL et macOS (pure-ftpd.conf), options essentielles et démarrage.
tags: [pure-ftpd, ftp, ftps, installation, puredb, debian, macos]
icon: info
---

**Pure-FTPd** vise la simplicité et la sécurité : pas de fichier de configuration complexe, chroot généralisé facile, **utilisateurs virtuels** intégrés (base PureDB) avec **quotas**, **limites de débit** et restrictions d'IP par utilisateur, TLS, et exécution d'un script après chaque dépôt (traitement automatique de fichiers).

Les concepts FTP (actif/passif, FTPS, pare-feu, NAT) sont décrits dans [[03-vsftpd/01-presentation-installation|FTP, FTPS et vsftpd]].

## Sources d'authentification

| Source | Usage |
| --- | --- |
| **PureDB** | Utilisateurs virtuels (`pure-pw`) — le plus courant |
| Unix / PAM | Comptes système |
| MySQL, PostgreSQL | Utilisateurs en base de données |
| LDAP | Annuaire (dont AD) |
| Authentification externe | Programme ou script personnalisé (`pure-authd`) |

## Installation

### Debian / Ubuntu

```bash
sudo apt install pure-ftpd
sudo systemctl enable --now pure-ftpd
```

Sous Debian, Pure-FTPd est lancé par l'enveloppe `pure-ftpd-wrapper`, qui lit **un fichier par option** :

| Chemin | Rôle |
| --- | --- |
| `/etc/pure-ftpd/conf/<Option>` | Valeur de l'option (ex. fichier `ChrootEveryone` contenant `yes`) |
| `/etc/pure-ftpd/auth/` | Liens symboliques ordonnés vers les méthodes d'authentification (`50pure` → `../conf/PureDB`) |
| `/etc/pure-ftpd/pureftpd.passwd` / `.pdb` | Utilisateurs virtuels (texte / base compilée) |
| `/etc/ssl/private/pure-ftpd.pem` | Certificat + clé TLS |

```bash
echo yes   | sudo tee /etc/pure-ftpd/conf/ChrootEveryone
echo yes   | sudo tee /etc/pure-ftpd/conf/NoAnonymous
echo no    | sudo tee /etc/pure-ftpd/conf/PAMAuthentication
echo no    | sudo tee /etc/pure-ftpd/conf/UnixAuthentication
echo "40000 40100" | sudo tee /etc/pure-ftpd/conf/PassivePortRange
echo 203.0.113.20  | sudo tee /etc/pure-ftpd/conf/ForcePassiveIP
sudo ln -s ../conf/PureDB /etc/pure-ftpd/auth/50pure
sudo systemctl restart pure-ftpd
ps -ef | grep [p]ure-ftpd          # options effectivement passées au démon
```

### RHEL (EPEL) et macOS

```bash
sudo dnf install epel-release && sudo dnf install pure-ftpd      # /etc/pure-ftpd/pure-ftpd.conf
brew install pure-ftpd                                           # $(brew --prefix)/etc/pure-ftpd.conf
```

```pureftpd /etc/pure-ftpd/pure-ftpd.conf (extrait)
ChrootEveryone              yes
NoAnonymous                 yes
PureDB                      /etc/pure-ftpd/pureftpd.pdb
PassivePortRange            40000 40100
ForcePassiveIP              203.0.113.20
MaxClientsNumber            50
MaxClientsPerIP             5
MaxIdleTime                 15
MinUID                      1000
Umask                       133:022
AltLog                      clf:/var/log/pure-ftpd/transfer.log
TLS                         2
TLSCipherSuite              HIGH:!aNULL:!MD5
CertFile                    /etc/ssl/private/pure-ftpd.pem
```

## Options essentielles

| Option | Effet |
| --- | --- |
| `ChrootEveryone yes` | Tous les utilisateurs enfermés dans leur dossier |
| `NoAnonymous yes` | Pas d'accès anonyme |
| `MaxClientsNumber` / `MaxClientsPerIP` | Connexions simultanées |
| `MinUID 1000` | Interdit les comptes système |
| `Umask 133:022` | Droits des fichiers (644) et dossiers (755) créés |
| `CreateHomeDir yes` | Crée le dossier de l'utilisateur virtuel à la première connexion |
| `ProhibitDotFilesWrite yes` | Interdit l'écriture de fichiers cachés (`.htaccess`…) |
| `AutoRename yes` | Renomme au lieu d'écraser |
| `AntiWarez yes` | Un fichier déposé anonymement n'est pas téléchargeable avant validation |
| `CallUploadScript yes` | Exécute un script après chaque dépôt (`pure-uploadscript`) |

## Suite du parcours

1. [[02-configuration|Utilisateurs virtuels, TLS, quotas et scripts]]
2. [[03-exploitation-depannage|Exploitation et dépannage]]
