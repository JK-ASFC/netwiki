---
title: Installation, configuration et sécurité
description: FileZilla Server 1.x, serveur FTP et FTPS libre pour Windows et Linux — installation (téléchargement officiel, service et interface d'administration, port 14148), écoutes FTP et FTPS implicite/explicite, certificats (Let's Encrypt intégré ou certificat d'entreprise), mode passif et pare-feu, utilisateurs, groupes et points de montage, limites de débit, filtres d'adresses et bannissement automatique, journaux, sauvegarde de la configuration et dépannage.
tags: [filezilla server, ftp, ftps, windows, tls, mode passif, transfert de fichiers]
icon: folder-sync
---

**FileZilla Server** (GPL) est un serveur **FTP / FTPS** léger, très répandu sous Windows pour des échanges de fichiers avec des partenaires, des copieurs multifonctions (numérisation vers FTP) ou des équipements qui ne savent pas faire mieux. La version **1.x** (réécrite en 2021) fonctionne sous **Windows** et **Linux** (Debian/Ubuntu) et s'administre par une interface séparée.

> [!NOTE]
> FileZilla Server ne gère **pas SFTP** (le protocole de transfert de SSH) ; l'offre commerciale *FileZilla Pro Enterprise Server* l'ajoute. Pour du SFTP sous Windows, utilisez [[01-openssh/08-windows-server|OpenSSH sur Windows Server]] ou [[20-cerberus-ftp/01-presentation-configuration|Cerberus FTP]] ; sous Linux, voir [[01-openssh/06-sftp-chroot|SFTP chrooté]].

## Installation

- Téléchargement **uniquement** depuis le site officiel (`filezilla-project.org`) ; vérifier l'empreinte publiée. Méfiez-vous des sites tiers et des installateurs groupés.
- L'installateur Windows installe le **service** `filezilla-server` et l'**interface d'administration** (*Administration interface*), qui se connecte au service sur **127.0.0.1:14148** avec un mot de passe défini à l'installation.
- Linux : paquet `.deb` officiel (`sudo dpkg -i FileZilla_Server_1.x_x86_64-linux-gnu.deb`), service systemd, interface d'administration graphique depuis un poste.

Configuration stockée en XML : `C:\ProgramData\filezilla-server\` (Windows), `/opt/filezilla-server/etc/` (Linux).

## Écoutes et TLS

*Server → Configure* :

| Rubrique | Réglage |
| --- | --- |
| **Server listeners** | Port 21 avec *Require explicit FTP over TLS* (FTPS explicite) ; éventuellement 990 en FTPS implicite |
| **FTP over TLS settings** | Certificat : **Let's Encrypt** intégré (nom public + port 80 joignable), certificat d'entreprise (PEM/PFX), ou autosigné (à éviter) ; TLS 1.2 minimum |
| **Passive mode** | Plage de ports dédiée (ex. `50000-50100`) ; adresse IP publique ou nom à annoncer quand le serveur est derrière du NAT |
| Administration | Interface d'administration limitée à `127.0.0.1` (ou adresse d'administration) avec TLS |

```powershell
# Pare-feu Windows : contrôle FTPS + plage passive, depuis les adresses des partenaires
New-NetFirewallRule -DisplayName "FTPS contrôle" -Direction Inbound -Protocol TCP -LocalPort 21 -RemoteAddress 203.0.113.0/24 -Action Allow
New-NetFirewallRule -DisplayName "FTPS passif" -Direction Inbound -Protocol TCP -LocalPort 50000-50100 -RemoteAddress 203.0.113.0/24 -Action Allow
```

> [!IMPORTANT]
> Avec **FTPS**, le canal de commande est chiffré : un pare-feu ne peut plus lire les ports passifs annoncés (pas d'inspection FTP). Il faut **ouvrir la plage passive** explicitement et faire correspondre le NAT ; c'est la première cause de transferts qui échouent (connexion réussie, liste de répertoire bloquée).

## Utilisateurs et points de montage

*Rights management → Users / Groups* :

| Élément | Usage |
| --- | --- |
| **Points de montage** | Chemin virtuel (`/`, `/depot`) associé à un chemin réel (`D:\FTP\partenaire-a`) avec droits (lecture, écriture, suppression, création de dossiers) |
| Groupes | Modèles de droits et de limites partagés |
| Authentification | Mot de passe (haché) par utilisateur ; option de compte Windows (*impersonation*) selon la version |
| Limites | Débit montant/descendant, nombre de sessions |
| Filtres d'adresses | Autoriser seulement les IP du partenaire |

Le placeholder `%u` dans un chemin (`D:\FTP\%u`) donne un répertoire par utilisateur.

## Protection

- **Bannissement automatique** (*Autobanner*) après N échecs de connexion dans un délai.
- Filtres d'adresses globaux (refuser tout sauf les réseaux attendus).
- Comptes **anonymes** désactivés ; mots de passe longs et uniques par partenaire.
- Répertoires FTP sur un volume dédié, **sans exécution** ni partage avec des répertoires applicatifs ; analyse antivirus des fichiers déposés.
- Serveur en **DMZ**, jamais dans le réseau interne avec une redirection de port directe.
- Mises à jour régulières (correctifs de sécurité).

## Journaux et sauvegarde

- *Logging* : niveau, rotation, fichiers dans `C:\ProgramData\filezilla-server\Logs` — à collecter par le SIEM (connexions, transferts, échecs).
- Sauvegarder `settings.xml`, `users.xml`, `groups.xml` et les certificats (export de configuration possible depuis l'interface).

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Connexion OK puis « Failed to retrieve directory listing » | Ports passifs fermés ou adresse annoncée privée derrière du NAT | Ouvrir la plage passive, renseigner l'adresse publique |
| `TLS handshake failed` | Certificat, client qui refuse les anciennes versions ou l'inverse | Certificat valide (nom), TLS 1.2+, client récent |
| `530 Login incorrect` | Mot de passe, compte désactivé, filtre d'adresses | Journal du serveur |
| Copieur qui n'arrive plus à numériser | FTPS exigé alors que l'appareil ne le gère pas | Écoute dédiée limitée à l'IP du copieur, ou passage au SMB signé / courriel |
| Interface d'administration qui ne se connecte pas | Mot de passe d'administration, port 14148, service arrêté | Service `filezilla-server`, paramètres d'administration |
