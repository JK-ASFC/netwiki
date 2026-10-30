---
title: Serveur SFTP chrooté (Linux et Windows)
description: Mettre en place un serveur SFTP sécurisé avec OpenSSH — sous-système internal-sftp, comptes dédiés sans shell, chroot par utilisateur (droits stricts), dépôts partagés, journalisation des transferts, quotas, SFTP sous Windows et macOS, clients (WinSCP, FileZilla, sftp, rsync, sshfs) et dépannage.
tags: [openssh, sftp, chroot, transfert de fichiers, winscp, windows]
icon: folder-lock
---

## Pourquoi SFTP ?

**SFTP** (*SSH File Transfer Protocol*) transfère des fichiers dans une session SSH chiffrée : un seul port (22), authentification par clé possible, aucun problème de mode passif comme en FTP. C'est le remplaçant naturel de FTP/FTPS pour les échanges avec des partenaires, les sauvegardes d'équipements et les dépôts applicatifs.

## Configuration Linux

### 1. Groupe et comptes sans shell

```bash
sudo groupadd sftp-users
sudo useradd -m -d /srv/sftp/partenaire1 -s /usr/sbin/nologin -G sftp-users partenaire1
sudo passwd partenaire1          # ou mieux : clé publique seulement
```

### 2. Arborescence chroot

> [!IMPORTANT]
> Le dossier de **chroot** et **tous ses parents** doivent appartenir à **root** et ne pas être inscriptibles par un autre utilisateur ou groupe. Sinon : `fatal: bad ownership or modes for chroot directory`. L'utilisateur écrit donc dans un **sous-dossier**.

```bash
sudo mkdir -p /srv/sftp/partenaire1/{depot,retour}
sudo chown root:root /srv/sftp /srv/sftp/partenaire1
sudo chmod 755 /srv/sftp /srv/sftp/partenaire1
sudo chown partenaire1:sftp-users /srv/sftp/partenaire1/depot
sudo chown root:sftp-users /srv/sftp/partenaire1/retour && sudo chmod 750 /srv/sftp/partenaire1/retour   # lecture seule pour le partenaire

# Clé publique du partenaire (authorized_keys hors du chroot)
sudo mkdir -p /etc/ssh/authorized_keys
sudo cp partenaire1.pub /etc/ssh/authorized_keys/partenaire1
sudo chmod 644 /etc/ssh/authorized_keys/partenaire1
```

### 3. sshd_config

```sshconfig /etc/ssh/sshd_config.d/50-sftp.conf
Subsystem sftp internal-sftp -f AUTHPRIV -l INFO

Match Group sftp-users
    ChrootDirectory /srv/sftp/%u
    ForceCommand internal-sftp -f AUTHPRIV -l INFO -u 0027
    AuthorizedKeysFile /etc/ssh/authorized_keys/%u
    PasswordAuthentication no
    AllowTcpForwarding no
    AllowAgentForwarding no
    X11Forwarding no
    PermitTunnel no
    PermitTTY no
```

> [!NOTE]
> La ligne `Subsystem` existe déjà dans le `sshd_config` des distributions (souvent `/usr/lib/openssh/sftp-server`) : une seule déclaration est autorisée. Remplacez-la par `internal-sftp` plutôt que d'en ajouter une seconde.

| Option d'`internal-sftp` | Effet |
| --- | --- |
| `-l INFO` / `-l VERBOSE` | Journalise ouvertures, lectures, écritures, suppressions |
| `-f AUTHPRIV` | Facilité syslog |
| `-u 0027` | Masque de création des fichiers |
| `-R` | Lecture seule |
| `-d /depot` | Dossier de départ dans le chroot |
| `-P remove,rename` / `-p …` | Interdire / n'autoriser que certaines opérations (liste avec `-Q requests`) |

```bash
sudo sshd -t && sudo systemctl reload ssh
sftp -i partenaire1_ed25519 partenaire1@sftp.exemple.fr
```

### Journalisation des transferts dans le chroot

Avec `internal-sftp`, la journalisation fonctionne via le socket syslog créé **dans** le chroot ou par le journal systemd. Pour rsyslog :

```bash
sudo mkdir -p /srv/sftp/partenaire1/dev
echo '$AddUnixListenSocket /srv/sftp/partenaire1/dev/log' | sudo tee /etc/rsyslog.d/20-sftp.conf
sudo systemctl restart rsyslog
```

Les opérations apparaissent ensuite dans `auth.log` / `secure` : `open "/depot/facture.pdf" flags WRITE,CREATE,TRUNCATE`, `close … bytes read 0 written 48213`.

## Dépôt partagé entre plusieurs comptes

```bash
sudo mkdir -p /srv/sftp/commun/echanges
sudo chown root:root /srv/sftp/commun && sudo chmod 755 /srv/sftp/commun
sudo chgrp sftp-equipe /srv/sftp/commun/echanges && sudo chmod 2770 /srv/sftp/commun/echanges   # setgid : les fichiers héritent du groupe
sudo setfacl -d -m g:sftp-equipe:rwx /srv/sftp/commun/echanges
```

```sshconfig
Match Group sftp-equipe
    ChrootDirectory /srv/sftp/commun
    ForceCommand internal-sftp -d /echanges
```

## Quotas et nettoyage

- Quotas de disque par utilisateur (`quota`, XFS project quotas) ou volume dédié.
- Purge automatique des fichiers anciens : `find /srv/sftp/*/depot -type f -mtime +30 -delete` (tâche planifiée), ou traitement par un script déclenché à l'arrivée (`inotifywait`, `systemd.path`).
- Antivirus des dépôts (ClamAV `clamdscan`) avant intégration.

## SFTP sous Windows

OpenSSH pour Windows supporte le SFTP et le **chroot pour les sessions SFTP** :

```sshconfig C:\ProgramData\ssh\sshd_config
Subsystem sftp sftp-server.exe

Match Group sftp-partenaires
    ChrootDirectory D:\SFTP\%u
    ForceCommand internal-sftp
    AllowTcpForwarding no
    PermitTTY no
```

```powershell
New-LocalGroup sftp-partenaires
New-LocalUser partenaire1 -Password (Read-Host -AsSecureString) -PasswordNeverExpires
Add-LocalGroupMember sftp-partenaires -Member partenaire1
New-Item -ItemType Directory D:\SFTP\partenaire1\depot -Force
icacls D:\SFTP\partenaire1\depot /grant "partenaire1:(OI)(CI)M"
Restart-Service sshd
```

Pour des besoins plus avancés sous Windows (comptes virtuels, interface graphique, FTPS et SFTP), voir les serveurs dédiés (prévus dans la feuille de route : FileZilla Server, Cerberus).

## macOS

Activer « Session à distance » suffit : SFTP est inclus. Le chroot se configure comme sous Linux dans `/etc/ssh/sshd_config.d/`.

## Clients

| Client | Plateforme | Remarques |
| --- | --- | --- |
| `sftp`, `scp` | Tous (OpenSSH) | Scripts : `sftp -b commandes.txt` |
| **WinSCP** | Windows | Interface, synchronisation, scripts (`winscp.com /script`), .NET |
| **FileZilla** | Tous | Interface simple |
| `rsync -e ssh` | Linux, macOS | Synchronisation différentielle (nécessite un shell, incompatible avec `ForceCommand internal-sftp`) |
| `sshfs` | Linux, macOS | Monter le dépôt comme un dossier |
| `lftp` | Linux | Miroirs, reprise, parallélisme |
| PowerShell (`Posh-SSH`) | Windows | Automatisation |

```bash
# Envoi automatisé non interactif
sftp -i ~/.ssh/id_partenaire -b - partenaire1@sftp.exemple.fr <<'EOF'
cd depot
put export-2026-01-15.csv
bye
EOF
```

## Dépannage

| Message | Cause | Solution |
| --- | --- | --- |
| `fatal: bad ownership or modes for chroot directory` | Chroot ou parent non possédé par root / inscriptible | `chown root:root`, `chmod 755` sur toute la chaîne |
| `Received unexpected end-of-file from SFTP server` | Shell qui affiche du texte (`.bashrc`) ou `Subsystem` incorrect | Utiliser `internal-sftp`, pas de sortie dans les scripts de login |
| `subsystem request failed on channel 0` | `Subsystem sftp` absent / chemin faux | Corriger la ligne `Subsystem` |
| `Permission denied` à l'écriture | Écriture à la racine du chroot | Écrire dans le sous-dossier prévu |
| `Connection closed` immédiatement | `ForceCommand` sans `internal-sftp`, shell `nologin` avec un sous-système externe | Vérifier `sshd -T -C user=…` |
| Clé ignorée | `AuthorizedKeysFile` dans le chroot, droits | Fichier hors chroot, lisible par sshd |
