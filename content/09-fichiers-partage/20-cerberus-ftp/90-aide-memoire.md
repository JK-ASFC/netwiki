---
title: Cerberus FTP Server — aide-mémoire des commandes
description: Réglages et commandes Cerberus FTP Server avec exemples — service Windows, console web d'administration, protocoles (FTPS, SFTP, HTTPS), utilisateurs natifs, Active Directory et LDAP, répertoires virtuels et droits, sécurité (TLS, chiffrements, verrouillage, HIPAA/FIPS), API REST, journaux et rapports, sauvegarde de la configuration, tests clients.
tags: [aide-mémoire, cerberus ftp, sftp, ftps, windows, transfert de fichiers]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|Cerberus FTP Server]].

## Service

```powershell
Get-Service | Where-Object DisplayName -like "*Cerberus*" | Format-Table Name, DisplayName, Status
Restart-Service -DisplayName "Cerberus FTP Server"
New-NetFirewallRule -DisplayName "Cerberus SFTP" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow
New-NetFirewallRule -DisplayName "Cerberus FTPS" -Direction Inbound -Protocol TCP -LocalPort 21, 990, 50000-50100 -Action Allow
```

## Réglages clés (console web d'administration)

| Domaine | Réglage |
| --- | --- |
| *Interfaces* | Activer SFTP (22), FTPS explicite (21) ou implicite (990), HTTPS ; désactiver FTP en clair |
| *Security → TLS/SSL* | Certificat valide, TLS 1.2+, chiffrements forts |
| *Security → SSH* | Clés d'hôte, algorithmes (désactiver les anciens) |
| *User Manager* | Utilisateurs natifs ou **Active Directory/LDAP**, groupes, répertoires virtuels, droits (télécharger, déposer, supprimer, lister) |
| *Security → Blocking* | Blocage automatique des adresses après échecs, listes d'autorisation |
| *Events* | Règles d'événements (courriel, script, transfert) à la réception d'un fichier |
| *Reports / Logging* | Journaux de transfert, rapports d'activité |

Les éditions supérieures exposent une **API REST** d'administration (utilisateurs, comptes, événements) : reportez-vous à la documentation de votre version pour les points d'accès et l'authentification.

## Sauvegarde et journaux

```powershell
# Emplacements par défaut (à vérifier selon la version installée)
Copy-Item "C:\ProgramData\Cerberus LLC\Cerberus FTP Server\*" "D:\Sauvegardes\Cerberus\$(Get-Date -Format yyyy-MM-dd)\" -Recurse -Force
Get-ChildItem "C:\ProgramData\Cerberus LLC\Cerberus FTP Server\log" | Sort-Object LastWriteTime | Select-Object -Last 1 | Get-Content -Tail 30
```

## Tests clients

```bash
sftp -P 22 partenaire1@sftp.exemple.fr
curl -v --ssl-reqd --user partenaire1 ftp://sftp.exemple.fr/
ssh-keyscan -p 22 sftp.exemple.fr        # empreinte de la clé d'hôte à communiquer aux partenaires
```
