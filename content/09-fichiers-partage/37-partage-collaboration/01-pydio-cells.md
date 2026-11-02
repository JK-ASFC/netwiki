---
title: Pydio Cells
description: Pydio Cells — plate-forme de partage et de collaboration documentaire en Go (AGPL pour Home, éditions Enterprise) : architecture (microservices, MySQL/MariaDB, stockage local ou S3 via datasources), installation (binaire cells sur Linux, Windows, macOS, Docker), configuration (cells configure), espaces de travail, cellules de partage, liens publics, utilisateurs et groupes, connecteurs LDAP/AD et OIDC, synchronisation (CellsSync), journaux et sauvegarde.
tags: [pydio cells, partage de fichiers, collaboration, ged, s3, ldap]
icon: info
---

**Pydio Cells** est une alternative à [[08-nextcloud/01-presentation-installation|Nextcloud]] centrée sur le **partage de fichiers en entreprise** : espaces de travail, « cellules » de collaboration avec des partenaires, liens publics, règles et journaux d'audit, stockage local ou **S3**. Réécrit en Go, il se déploie avec un binaire unique et une base MySQL/MariaDB.

## Installation

```bash
sudo apt install mariadb-server && sudo mysql -e "CREATE DATABASE cells; CREATE USER 'pydio'@'localhost' IDENTIFIED BY 'MdpCells2026'; GRANT ALL ON cells.* TO 'pydio'@'localhost';"
sudo useradd -m -s /bin/bash pydio
sudo -u pydio bash -c 'cd ~ && wget -O cells "https://download.pydio.com/latest/cells/release/{latest}/linux-amd64/cells"   # lien « latest » de la page de téléchargement && chmod +x cells'
sudo setcap 'cap_net_bind_service=+ep' /home/pydio/cells
sudo -u pydio /home/pydio/cells configure          # assistant (navigateur ou --cli) : base, compte admin, URL
docker run -d -p 8080:8080 -v cells_data:/var/cells pydio/cells       # test
```

Windows et macOS : binaires `cells.exe` / `cells` du site de téléchargement. Service systemd fourni dans la documentation.

## Organisation

| Notion | Rôle |
| --- | --- |
| **Datasource** | Stockage réel (dossier local, bucket S3/MinIO) |
| **Workspace** | Espace d'équipe avec droits par groupe |
| **Cell** | Espace de collaboration créé par un utilisateur avec des internes ou externes |
| Lien public | Partage par URL (mot de passe, expiration, téléchargements limités) |

Annuaire : *Cells Console → Identity Management → Authentication* (LDAP/Active Directory, OIDC). Sauvegarde : base MariaDB + datasources + répertoire de configuration (`~/.config/pydio/cells`).

Suite : [[02-cozy-cloud|Cozy Cloud]] · [[04-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
