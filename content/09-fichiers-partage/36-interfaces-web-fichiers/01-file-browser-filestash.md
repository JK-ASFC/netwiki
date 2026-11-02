---
title: File Browser et Filestash
description: Interfaces web de gestion de fichiers — File Browser (Apache 2.0, binaire Go unique : installation Linux, Windows, macOS, Docker, base de données de configuration, utilisateurs et périmètres, partages par lien, commandes et règles, reverse proxy) et Filestash (AGPL : connecteurs FTP, SFTP, S3, SMB, WebDAV, Git, NFS, LDAP ; authentification par plugin, visionneuses, administration /admin), cas d'usage et sécurité.
tags: [file browser, filestash, gestionnaire de fichiers web, sftp, s3, partage]
icon: info
---

Deux interfaces web légères pour donner accès à des fichiers **sans client** : un répertoire d'un serveur (File Browser) ou des stockages distants variés (Filestash).

| | **File Browser** | **Filestash** |
| --- | --- | --- |
| Accès à | Un répertoire local du serveur | FTP, SFTP, S3, SMB, WebDAV, Git, NFS, LDAP… |
| Points forts | Très léger, utilisateurs et périmètres, liens de partage | Universel, visionneuses (images, vidéos, PDF, documents) |
| Licence | Apache 2.0 | AGPL (offre entreprise) |

## File Browser

```bash
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash      # Linux et macOS ; Windows : binaire des versions GitHub
filebrowser config init -d /etc/filebrowser/filebrowser.db
filebrowser config set -d /etc/filebrowser/filebrowser.db --address 127.0.0.1 --port 8080 --root /srv/partage --baseurl /fichiers
filebrowser users add admin "$MDP" --perm.admin -d /etc/filebrowser/filebrowser.db
filebrowser -d /etc/filebrowser/filebrowser.db
docker run -d -v /srv/partage:/srv -v /etc/filebrowser/filebrowser.db:/database.db -p 8080:80 filebrowser/filebrowser
```

Chaque utilisateur peut être limité à un sous-répertoire (*scope*) et à certaines actions (création, suppression, partage, exécution de commandes — à désactiver). Publier derrière [[03-nginx/01-presentation|NGINX]] ou [[04-caddy/01-presentation-installation|Caddy]] en HTTPS.

## Filestash

```bash
curl -O https://downloads.filestash.app/latest/docker-compose.yml && docker compose up -d     # http://<hôte>:8334
```

Premier accès : définir le mot de passe d'administration, puis dans **`/admin`** activer les connecteurs (S3, SFTP, SMB…), l'authentification (LDAP/AD, OIDC, mot de passe) et le stockage par défaut des utilisateurs.

Interface : [[03-interface-graphique|interfaces graphiques]] · suite : [[02-sftpgo|SFTPGo]] · [[90-aide-memoire|aide-mémoire]].
