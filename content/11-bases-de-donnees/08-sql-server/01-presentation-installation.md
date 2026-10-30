---
title: Présentation et installation
description: Microsoft SQL Server — versions (2019, 2022, 2025) et éditions (Express, Developer, Standard, Enterprise), composants (moteur, Agent, SSRS, SSIS, SSAS), installation sous Windows (assistant, ligne de commande, fichier de configuration), sous Linux (paquets mssql-server, mssql-conf) et en conteneur, outils (SSMS, sqlcmd, dbatools), réglages initiaux (mémoire, MAXDOP, tempdb, ports 1433 et 1434) et licences.
tags: [sql server, mssql, installation, windows, linux, sqlcmd, ssms, tempdb]
icon: info
---

**Microsoft SQL Server** est le SGBD relationnel de Microsoft, omniprésent dans les applications métier Windows (ERP, paie, supervision, sauvegarde, outils Microsoft comme WSUS ou ConfigMgr). Il fonctionne sous **Windows** et **Linux** (depuis 2017) et en conteneur.

## Versions et éditions

| Version | Points marquants |
| --- | --- |
| 2019 | Big Data Clusters (retirés depuis), récupération de base accélérée (ADR), UTF-8 |
| **2022** | Connexion à Azure (Arc, Synapse Link), groupes de disponibilité **autonomes**, TDS 8.0 (TLS strict), sauvegarde vers **S3** |
| **2025** | Recherche vectorielle et fonctions d'IA intégrées, JSON natif, verrouillage optimisé, améliorations de sécurité (Entra ID, TLS 1.3) |

| Édition | Usage | Limites principales |
| --- | --- | --- |
| **Express** | Petites applications, gratuite | 10 Go par base (relevé avec la version 2025), 1 socket / 4 cœurs, ~1,4 Go de mémoire pour le pool de mémoire tampon, pas d'Agent |
| **Developer** | Développement et tests, gratuite | Toutes les fonctions Enterprise, **interdite en production** |
| **Standard** | Production courante | 24 cœurs et 128 Go de pool de mémoire tampon (relevés avec la version 2025), groupes de disponibilité **de base** (une base, deux réplicas) |
| **Enterprise** | Charges critiques | Sans limite matérielle, groupes de disponibilité complets, chiffrement et compression avancés |

Licence : **par cœur** (minimum 4 cœurs par serveur ou VM) ou **serveur + CAL** (Standard). La virtualisation, le cloud et le basculement passif (avec Software Assurance) obéissent à des règles spécifiques : vérifiez avec votre revendeur.

## Composants

| Composant | Rôle |
| --- | --- |
| **Moteur de base de données** | Service `MSSQLSERVER` (instance par défaut) ou `MSSQL$NOM` (instance nommée) |
| **SQL Server Agent** | Planification des travaux, alertes, opérateurs |
| SQL Server Browser | Indique le port des instances nommées (1434/UDP) |
| **SSRS** / Power BI Report Server | Rapports (installation séparée) |
| **SSIS** | Flux d'intégration et de transformation de données (ETL) |
| **SSAS** | Modèles analytiques (tabulaires, multidimensionnels) |
| Recherche en texte intégral, PolyBase, Machine Learning Services | Fonctions optionnelles |

## Installation sous Windows

Prérequis : serveur Windows dédié, **volumes séparés** (données, journaux, tempdb, sauvegardes) formatés en NTFS ou ReFS avec des unités d'allocation de **64 Ko**, comptes de service (gMSA recommandés ou comptes virtuels par défaut).

```text Installation silencieuse (fichier de configuration généré par l'assistant, puis réutilisé)
setup.exe /Q /ACTION=Install /FEATURES=SQLENGINE,REPLICATION,FULLTEXT /INSTANCENAME=MSSQLSERVER ^
  /SQLSVCACCOUNT="CORP\gmsa-sql01$" /AGTSVCACCOUNT="CORP\gmsa-sqlagt01$" /AGTSVCSTARTUPTYPE=Automatic ^
  /SQLSYSADMINACCOUNTS="CORP\GG-DBA" /SECURITYMODE=SQL /SAPWD="MotDePasseSaTresLong!" ^
  /SQLUSERDBDIR="D:\SQLData" /SQLUSERDBLOGDIR="L:\SQLLogs" /SQLTEMPDBDIR="T:\TempDB" /SQLTEMPDBLOGDIR="T:\TempDB" /SQLBACKUPDIR="S:\Backup" ^
  /SQLTEMPDBFILECOUNT=8 /SQLMAXDOP=8 /USESQLRECOMMENDEDMEMORYLIMITS /IACCEPTSQLSERVERLICENSETERMS /UPDATEENABLED=TRUE
```

Ou avec **dbatools** (module PowerShell communautaire incontournable pour les DBA) :

```powershell
Install-Module dbatools -Scope AllUsers
Install-DbaInstance -SqlInstance srv-sql-01 -Version 2022 -Feature Engine -Path \\srv-depot\SQL2022 `
  -AdminAccount "CORP\GG-DBA" -DataPath D:\SQLData -LogPath L:\SQLLogs -TempPath T:\TempDB -BackupPath S:\Backup -Confirm:$false
```

## Installation sous Linux

```bash
# Ubuntu 22.04 (dépôt Microsoft)
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list
sudo apt update && sudo apt install -y mssql-server
sudo /opt/mssql/bin/mssql-conf setup          # édition, mot de passe sa, acceptation de la licence
sudo /opt/mssql/bin/mssql-conf set memory.memorylimitmb 12288
sudo /opt/mssql/bin/mssql-conf set filelocation.defaultdatadir /var/opt/mssql/data
systemctl status mssql-server
# Outils : paquet mssql-tools18 (sqlcmd, bcp)

# RHEL 9
sudo curl -o /etc/yum.repos.d/mssql-server.repo https://packages.microsoft.com/config/rhel/9/mssql-server-2022.repo
sudo dnf install -y mssql-server && sudo /opt/mssql/bin/mssql-conf setup
sudo firewall-cmd --permanent --add-port=1433/tcp && sudo firewall-cmd --reload
```

```bash
# Conteneur (développement et tests)
docker run -d --name sql2022 -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=MotDePasseSaTresLong!" \
  -p 1433:1433 -v mssql-data:/var/opt/mssql mcr.microsoft.com/mssql/server:2022-latest
```

Sous Linux, pas de SSRS ni de SSAS ; SSIS est disponible en ligne de commande. macOS : uniquement via conteneur (développement).

## Outils

| Outil | Usage |
| --- | --- |
| **SSMS** (SQL Server Management Studio) | Console d'administration Windows |
| VS Code + extension *SQL Server (mssql)* | Requêtes multiplateformes (Azure Data Studio est retiré) |
| **sqlcmd** (ODBC ou nouvelle version Go) | Ligne de commande, scripts |
| **dbatools** | Plus de 600 commandes PowerShell : migration, sauvegarde, tests, inventaire |
| Gestionnaire de configuration SQL Server | Protocoles réseau, services, certificats (Windows) |

```text
sqlcmd -S srv-sql-01.corp.exemple.fr -E -Q "SELECT @@VERSION"
sqlcmd -S srv-sql-01,1433 -U sa -C -Q "SELECT name, state_desc FROM sys.databases"
```

## Réglages initiaux

```tsql
-- Mémoire maximale : laisser 10 à 20 % (au moins 4 Go) au système
EXEC sp_configure 'show advanced options', 1; RECONFIGURE;
EXEC sp_configure 'max server memory (MB)', 57344; RECONFIGURE;
-- Parallélisme
EXEC sp_configure 'max degree of parallelism', 8;
EXEC sp_configure 'cost threshold for parallelism', 50; RECONFIGURE;
-- Compression des sauvegardes par défaut
EXEC sp_configure 'backup compression default', 1; RECONFIGURE;
-- Mode d'optimisation des charges ad hoc
EXEC sp_configure 'optimize for ad hoc workloads', 1; RECONFIGURE;
```

| Réglage | Recommandation |
| --- | --- |
| **tempdb** | Autant de fichiers de données que de cœurs (8 au maximum au départ), taille identique, volume rapide |
| Croissance automatique | En Mo (ex. 512 Mo données, 256 Mo journal), pas en pourcentage |
| Initialisation instantanée des fichiers | Droit *Effectuer les tâches de maintenance de volume* pour le compte du service |
| Plan d'alimentation Windows | **Performances élevées** |
| Port | Instance par défaut **1433/TCP** ; instances nommées : port fixe configuré + 1434/UDP (Browser) ou port dans la chaîne de connexion |

Suite : [[02-securite|sécurité]].
