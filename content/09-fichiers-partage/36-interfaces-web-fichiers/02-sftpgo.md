---
title: SFTPGo
description: SFTPGo — serveur de fichiers multi-protocoles (AGPL) : SFTP, SCP, FTP/S, WebDAV et client web HTTPS, stockage local ou distant (S3, Azure Blob, Google Cloud Storage, chiffré, SFTP), installation (paquets Debian/Ubuntu et RHEL, Windows MSI, macOS, Docker), sftpgo.json et variables d'environnement, interface d'administration (port 8080), utilisateurs, groupes, dossiers virtuels, quotas, restrictions d'IP et de protocoles, authentification externe (LDAP via plugin, OIDC), 2FA, événements et actions, protection contre les attaques (defender), API REST.
tags: [sftpgo, sftp, ftps, webdav, s3, serveur de fichiers, transfert]
icon: info
---

**SFTPGo** remplace avantageusement un serveur [[01-openssh/01-presentation|OpenSSH]] partagé ou un [[03-vsftpd/01-presentation-installation|serveur FTP]] pour les échanges avec des partenaires : comptes **virtuels** (aucun compte système), stockage local ou **S3**, plusieurs protocoles, interface web d'administration et client web pour les utilisateurs.

## Installation

```bash
# Debian/Ubuntu : dépôt officiel (ftp.osuosl.org/pub/sftpgo/apt) selon la documentation, puis
sudo apt install sftpgo
sudo systemctl enable --now sftpgo
```

RHEL : dépôt `.repo` officiel ; Windows : MSI (service) ; macOS : `brew install sftpgo` ; Docker : `drakkan/sftpgo`.

| Service | Port par défaut |
| --- | --- |
| SFTP/SCP | **2022** (laisser 22 au SSH d'administration) |
| Interface web et API | **8080** (admin `/web/admin`, utilisateurs `/web/client`) |
| FTP/S, WebDAV | Désactivés par défaut |

Premier accès à `/web/admin` : créer l'administrateur, **activer la 2FA**, puis publier l'interface en HTTPS (certificat ACME intégré ou reverse proxy).

## Configuration

```bash
# /etc/sftpgo/sftpgo.env — surcharge de sftpgo.json par variables
SFTPGO_SFTPD__BINDINGS__0__PORT=2022
SFTPGO_FTPD__BINDINGS__0__PORT=2121
SFTPGO_FTPD__BINDINGS__0__TLS_MODE=1
SFTPGO_WEBDAVD__BINDINGS__0__PORT=10080
SFTPGO_COMMON__DEFENDER__ENABLED=true
```

Utilisateurs (interface ou API) : répertoire racine ou bucket S3, **quotas**, IP autorisées, protocoles permis, clés publiques, expiration du compte, **dossiers virtuels** partagés entre groupes. Les **actions sur événements** déclenchent un script, un webhook ou un e-mail à chaque dépôt de fichier (traitement automatique d'échanges EDI, par exemple).

```bash
curl -s -u admin:"$MDP" http://localhost:8080/api/v2/token | jq -r .access_token
```

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
