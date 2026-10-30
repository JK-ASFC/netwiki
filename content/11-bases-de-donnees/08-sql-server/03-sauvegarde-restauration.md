---
title: Sauvegarde et restauration
description: Protéger les bases SQL Server — modes de récupération (simple, complet, journalisé en bloc), sauvegardes complètes, différentielles et du journal des transactions, compression, chiffrement, sauvegarde vers un partage, Azure Blob ou S3, scripts d'Ola Hallengren, vérification (CHECKDB, RESTORE VERIFYONLY, tests de restauration avec dbatools), restauration à un instant donné, bases système et logiciels de sauvegarde tiers.
tags: [sql server, sauvegarde, restauration, journal des transactions, recovery model, ola hallengren, dbatools, checkdb]
icon: archive-restore
---

## Modes de récupération

| Mode | Journal des transactions | Restauration possible |
| --- | --- | --- |
| **Simple** | Tronqué automatiquement aux points de contrôle | Jusqu'à la **dernière sauvegarde** complète ou différentielle |
| **Complet** (*Full*) | Conservé jusqu'à la **sauvegarde du journal** | **À la seconde près** (point dans le temps) |
| Journalisé en bloc | Opérations en bloc minimalement journalisées | Comme Complet, sauf pendant les opérations en bloc |

> [!WARNING]
> Une base en mode **Complet sans sauvegarde du journal** voit son journal grossir jusqu'à saturer le disque (erreur 9002). Choisissez le mode selon le **RPO** : Complet + sauvegardes du journal toutes les 5 à 15 minutes pour les bases de production ; Simple pour les bases reconstructibles.

```tsql
SELECT name, recovery_model_desc, log_reuse_wait_desc FROM sys.databases;
ALTER DATABASE Compta SET RECOVERY FULL;
```

## Types de sauvegarde

```tsql
-- Complète (hebdomadaire ou quotidienne)
BACKUP DATABASE Compta TO DISK = N'\\srv-sav-01\SQL\srv-sql-01\Compta\Compta_FULL_20261029.bak'
  WITH COMPRESSION, CHECKSUM, STATS = 10,
       ENCRYPTION (ALGORITHM = AES_256, SERVER CERTIFICATE = Cert_Sauvegarde);

-- Différentielle (quotidienne) : changements depuis la dernière complète
BACKUP DATABASE Compta TO DISK = N'…\Compta_DIFF_20261029.bak' WITH DIFFERENTIAL, COMPRESSION, CHECKSUM;

-- Journal (toutes les 15 min)
BACKUP LOG Compta TO DISK = N'…\Compta_LOG_20261029_1015.trn' WITH COMPRESSION, CHECKSUM;

-- Copie ponctuelle qui ne casse pas la chaîne des différentielles
BACKUP DATABASE Compta TO DISK = N'…\Compta_COPY.bak' WITH COPY_ONLY, COMPRESSION, CHECKSUM;
```

| Destination | Remarques |
| --- | --- |
| Disque local puis copie | Rapide ; copier ensuite hors du serveur |
| **Partage SMB** | Compte du service SQL avec droits d'écriture sur le partage |
| Azure Blob (`BACKUP … TO URL`) | Identifiant SAS |
| **Stockage S3** (2022+) | `TO URL = 's3://s3.corp.exemple.fr/sql/Compta.bak'` avec identifiant S3 (MinIO, voir [[07-minio/01-presentation-installation\|MinIO]]) |

## Ola Hallengren

Les scripts **Maintenance Solution** d'Ola Hallengren (gratuits) sont la référence pour sauvegardes, vérifications d'intégrité et maintenance des index : ils créent des procédures et des travaux Agent.

```tsql
EXECUTE dbo.DatabaseBackup @Databases = 'USER_DATABASES', @Directory = N'\\srv-sav-01\SQL', @BackupType = 'FULL',
  @Verify = 'Y', @Compress = 'Y', @CheckSum = 'Y', @CleanupTime = 168;
EXECUTE dbo.DatabaseBackup @Databases = 'USER_DATABASES', @Directory = N'\\srv-sav-01\SQL', @BackupType = 'LOG',
  @Compress = 'Y', @CheckSum = 'Y', @CleanupTime = 72;
EXECUTE dbo.DatabaseIntegrityCheck @Databases = 'ALL_DATABASES', @CheckCommands = 'CHECKDB';
```

## Vérifier

```tsql
RESTORE VERIFYONLY FROM DISK = N'…\Compta_FULL_20261029.bak' WITH CHECKSUM;   -- lisible, mais ne prouve pas la cohérence de la base
DBCC CHECKDB (Compta) WITH NO_INFOMSGS, ALL_ERRORMSGS;                         -- intégrité (hebdomadaire)
SELECT TOP 20 database_name, type, backup_finish_date, backup_size/1048576 AS Mo
FROM msdb.dbo.backupset ORDER BY backup_finish_date DESC;
```

Le seul vrai test est la **restauration** : automatisez-la sur un serveur de test.

```powershell
# dbatools : restaure la dernière sauvegarde de chaque base sur un serveur de test, exécute CHECKDB, supprime
Test-DbaLastBackup -SqlInstance srv-sql-01 -Destination srv-sql-test -Database Compta, Paie | Format-Table Database, RestoreResult, DbccResult
```

## Restaurer

```tsql
-- 1. Sauvegarder la fin du journal si la base est encore accessible (« tail-log »)
BACKUP LOG Compta TO DISK = N'…\Compta_TAIL.trn' WITH NORECOVERY;

-- 2. Complète, différentielle, puis journaux, jusqu'à un instant donné
RESTORE DATABASE Compta FROM DISK = N'…\Compta_FULL_20261026.bak' WITH NORECOVERY, REPLACE;
RESTORE DATABASE Compta FROM DISK = N'…\Compta_DIFF_20261029.bak' WITH NORECOVERY;
RESTORE LOG Compta FROM DISK = N'…\Compta_LOG_20261029_1000.trn' WITH NORECOVERY;
RESTORE LOG Compta FROM DISK = N'…\Compta_LOG_20261029_1015.trn' WITH STOPAT = '2026-10-29T10:12:00', RECOVERY;

-- Restaurer sous un autre nom à côté (récupérer une table supprimée)
RESTORE DATABASE Compta_Recup FROM DISK = N'…\Compta_FULL_20261026.bak'
  WITH MOVE 'Compta' TO 'D:\SQLData\Compta_Recup.mdf', MOVE 'Compta_log' TO 'L:\SQLLogs\Compta_Recup.ldf', NORECOVERY;
```

```powershell
# dbatools : reconstruit automatiquement la chaîne de restauration depuis un dossier de sauvegardes
Restore-DbaDatabase -SqlInstance srv-sql-02 -Path \\srv-sav-01\SQL\srv-sql-01\Compta -DatabaseName Compta -RestoreTime '2026-10-29 10:12' -WithReplace
```

## Bases système et éléments hors bases

| Élément | Sauvegarde |
| --- | --- |
| `master` | Connexions, configuration, liste des bases — complète quotidienne |
| `msdb` | Travaux Agent, historique des sauvegardes, packages SSIS — complète quotidienne |
| `model` | Après modification |
| Certificats (TDE, sauvegardes chiffrées), clé principale du service | Exportés et conservés hors du serveur |
| Connexions et travaux (pour une reconstruction) | `Export-DbaLogin`, `Export-DbaInstance` (dbatools) |

## Logiciels de sauvegarde

Les solutions d'entreprise ([[05-veeam/02-travaux-restauration|Veeam]], NAKIVO, Commvault…) sauvegardent SQL Server via **VSS** avec traitement applicatif (troncature du journal). N'utilisez **qu'une seule** méthode pour les sauvegardes du journal : deux outils qui sauvegardent le journal cassent mutuellement leurs chaînes de restauration.
