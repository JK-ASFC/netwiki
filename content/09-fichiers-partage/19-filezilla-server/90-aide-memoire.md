---
title: FileZilla Server — aide-mémoire des commandes
description: Commandes et réglages FileZilla Server 1.x avec exemples — installation silencieuse, service Windows et Linux, interface d'administration (port 14148), utilisateurs et points de montage, FTPS (certificat Let's Encrypt intégré ou importé), mode passif et pare-feu, filtres d'adresses et blocage automatique, journaux, sauvegarde de la configuration, client FileZilla et tests.
tags: [aide-mémoire, filezilla server, ftp, ftps, windows, service]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-configuration|FileZilla Server]].

## Installation et service

```powershell
# Installation silencieuse (port d'administration local par défaut 14148)
.\FileZilla_Server_1.9.4_win64-setup.exe /S
Get-Service "filezilla-server" | Format-Table Name, Status, StartType
Restart-Service "filezilla-server"
New-NetFirewallRule -DisplayName "FTP FileZilla" -Direction Inbound -Protocol TCP -LocalPort 21, 49152-49200 -Action Allow
```

```bash
# Linux (paquet .deb officiel)
sudo dpkg -i FileZilla_Server_1.9.4_x86_64-linux-gnu.deb
sudo systemctl status filezilla-server
```

## Réglages essentiels (interface d'administration)

| Réglage | Recommandation |
| --- | --- |
| *Server listeners* | Port 21 « Require explicit FTP over TLS », ou 990 implicite |
| *FTP and FTP over TLS → Connection security* | Certificat (Let's Encrypt intégré ou import PEM), TLS 1.2 minimum |
| *Passive mode* | Plage de ports (49152–49200) et adresse publique ; ouvrir/rediriger la plage |
| *Rights management → Users* | Un compte par partenaire, mot de passe fort, **points de montage** (chemin virtuel → dossier natif) avec droits minimaux |
| *Filters* | Adresses autorisées/refusées ; blocage automatique après échecs de connexion |
| *Administration* | Mot de passe d'administration, écoute sur 127.0.0.1 uniquement |
| *Logging* | Niveau, rotation, emplacement |

## Fichiers, sauvegarde, journaux

```powershell
# Emplacements par défaut des versions 1.x (Linux : /opt/filezilla-server/etc/)
Get-ChildItem "C:\ProgramData\filezilla-server\*.xml"          # settings.xml, users.xml, groups.xml
Copy-Item "C:\ProgramData\filezilla-server\*.xml" "D:\Sauvegardes\FileZilla\$(Get-Date -Format yyyy-MM-dd)\" -Force
Get-Content "C:\ProgramData\filezilla-server\Logs\filezilla-server.log" -Tail 30 -Wait
```

## Tests

```bash
curl -v --ssl-reqd --user partenaire1 ftp://ftp.exemple.fr/
lftp -u partenaire1 -e "set ftp:ssl-force true; ls; bye" ftp.exemple.fr
```

Client graphique : **FileZilla** (Windows, macOS, Linux) — chiffrement « Exiger FTP explicite sur TLS ».
