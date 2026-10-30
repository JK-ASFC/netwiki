---
title: SQL Server — aide-mémoire des commandes
description: Commandes SQL Server avec exemples — connexion (sqlcmd, SSMS), module SqlServer et dbatools, informations d'instance, bases (création, options, modèle de récupération), connexions et utilisateurs (CREATE LOGIN/USER, rôles), sauvegarde et restauration (BACKUP/RESTORE, vérification, point dans le temps), maintenance (DBCC CHECKDB, index, statistiques), sessions et blocages (DMV), Agent, Always On, SQL Server sous Linux (mssql-conf).
tags: [aide-mémoire, sql server, sqlcmd, t-sql, dbatools, sauvegarde, always on]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|SQL Server]].

## Connexion

```powershell
sqlcmd -S sql01 -E                                         # authentification Windows
sqlcmd -S sql01.corp.exemple.fr,1433 -U sa -C              # -C : faire confiance au certificat (tests)
sqlcmd -S sql01 -E -Q "SELECT @@VERSION" -h -1
sqlcmd -S sql01 -E -i script.sql -o resultat.txt
Install-Module SqlServer, dbatools -Scope CurrentUser
Invoke-Sqlcmd -ServerInstance sql01 -Query "SELECT name, state_desc FROM sys.databases"
```

## Instance et bases

```sql
SELECT @@SERVERNAME, SERVERPROPERTY('ProductVersion'), SERVERPROPERTY('Edition');
SELECT name, recovery_model_desc, state_desc, compatibility_level FROM sys.databases;
CREATE DATABASE AppDB ON (NAME = AppDB, FILENAME = 'D:\Data\AppDB.mdf', SIZE = 1GB, FILEGROWTH = 512MB)
  LOG ON (NAME = AppDB_log, FILENAME = 'L:\Logs\AppDB.ldf', SIZE = 512MB, FILEGROWTH = 256MB);
ALTER DATABASE AppDB SET RECOVERY FULL;
ALTER DATABASE AppDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;   -- maintenance exclusive
ALTER DATABASE AppDB SET MULTI_USER;
EXEC sp_helpdb 'AppDB';
EXEC sp_configure 'max server memory (MB)', 24576; RECONFIGURE;
```

## Connexions, utilisateurs, rôles

```sql
CREATE LOGIN [CORP\GG-App-Lecture] FROM WINDOWS;
CREATE LOGIN app WITH PASSWORD = 'MotDePasseLong2026!', CHECK_POLICY = ON;
USE AppDB;
CREATE USER app FOR LOGIN app;
ALTER ROLE db_datareader ADD MEMBER app;
ALTER ROLE db_datawriter ADD MEMBER app;
CREATE USER [CORP\GG-App-Lecture] FOR LOGIN [CORP\GG-App-Lecture];
ALTER ROLE db_datareader ADD MEMBER [CORP\GG-App-Lecture];
GRANT EXECUTE ON SCHEMA::dbo TO app;
SELECT dp.name, dp.type_desc, r.name AS role FROM sys.database_role_members m JOIN sys.database_principals dp ON m.member_principal_id = dp.principal_id JOIN sys.database_principals r ON m.role_principal_id = r.principal_id;
ALTER LOGIN sa DISABLE;
```

## Sauvegarde et restauration

```sql
BACKUP DATABASE AppDB TO DISK = 'B:\Backup\AppDB_full.bak' WITH COMPRESSION, CHECKSUM, STATS = 10;
BACKUP DATABASE AppDB TO DISK = 'B:\Backup\AppDB_diff.bak' WITH DIFFERENTIAL, COMPRESSION, CHECKSUM;
BACKUP LOG AppDB TO DISK = 'B:\Backup\AppDB_log_1200.trn' WITH COMPRESSION, CHECKSUM;
RESTORE VERIFYONLY FROM DISK = 'B:\Backup\AppDB_full.bak' WITH CHECKSUM;
RESTORE FILELISTONLY FROM DISK = 'B:\Backup\AppDB_full.bak';
RESTORE DATABASE AppDB_Test FROM DISK = 'B:\Backup\AppDB_full.bak'
  WITH MOVE 'AppDB' TO 'D:\Data\AppDB_Test.mdf', MOVE 'AppDB_log' TO 'L:\Logs\AppDB_Test.ldf', NORECOVERY;
RESTORE LOG AppDB_Test FROM DISK = 'B:\Backup\AppDB_log_1200.trn' WITH STOPAT = '2026-10-29T11:45:00', RECOVERY;
SELECT TOP 10 database_name, type, backup_finish_date FROM msdb.dbo.backupset ORDER BY backup_finish_date DESC;
```

```powershell
# dbatools
Backup-DbaDatabase -SqlInstance sql01 -Database AppDB -Path B:\Backup -Type Full -CompressBackup -Checksum
Test-DbaLastBackup -SqlInstance sql01 -Destination sql-test01        # restauration de contrôle automatique
Copy-DbaDatabase -Source sql01 -Destination sql02 -Database AppDB -BackupRestore -SharedPath \\nas\migration
Copy-DbaLogin -Source sql01 -Destination sql02
```

## Maintenance

```sql
DBCC CHECKDB (AppDB) WITH NO_INFOMSGS, ALL_ERRORMSGS;
ALTER INDEX ALL ON dbo.Commandes REBUILD WITH (ONLINE = ON);        -- Enterprise pour ONLINE
ALTER INDEX IX_Commandes_Client ON dbo.Commandes REORGANIZE;
UPDATE STATISTICS dbo.Commandes WITH FULLSCAN;
SELECT OBJECT_NAME(ips.object_id) AS tbl, i.name, ips.avg_fragmentation_in_percent FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ips JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id WHERE ips.avg_fragmentation_in_percent > 30;
DBCC SQLPERF(LOGSPACE);
```

## Sessions et blocages

```sql
SELECT session_id, login_name, host_name, status, program_name FROM sys.dm_exec_sessions WHERE is_user_process = 1;
SELECT r.session_id, r.blocking_session_id, r.wait_type, r.wait_time, t.text FROM sys.dm_exec_requests r CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t WHERE r.blocking_session_id <> 0;
KILL 87;
EXEC sp_who2;
SELECT TOP 10 qs.total_worker_time / qs.execution_count AS cpu_moyen, SUBSTRING(t.text, 1, 100) FROM sys.dm_exec_query_stats qs CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) t ORDER BY cpu_moyen DESC;
```

## Agent et Always On

```sql
EXEC msdb.dbo.sp_help_job;
EXEC msdb.dbo.sp_start_job N'Sauvegarde - complète';
SELECT ag.name, ar.replica_server_name, ars.role_desc, ars.synchronization_health_desc FROM sys.availability_groups ag JOIN sys.availability_replicas ar ON ag.group_id = ar.group_id JOIN sys.dm_hadr_availability_replica_states ars ON ar.replica_id = ars.replica_id;
ALTER AVAILABILITY GROUP AG_App FAILOVER;          -- sur le secondaire synchrone cible
```

## SQL Server sous Linux

```bash
sudo /opt/mssql/bin/mssql-conf setup
sudo /opt/mssql/bin/mssql-conf set memory.memorylimitmb 16384
sudo /opt/mssql/bin/mssql-conf set sqlagent.enabled true
sudo systemctl restart mssql-server
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -Q "SELECT @@VERSION"
```
