---
title: Agent, maintenance et performances
description: SQL Server Agent (travaux, étapes, planifications, opérateurs, alertes, Database Mail, comptes proxy), maintenance des index et des statistiques, Query Store, vues de gestion dynamique (attentes, requêtes coûteuses, blocages, index manquants), événements étendus, sp_WhoIsActive et kit First Responder, réglages de performance courants.
tags: [sql server, agent, database mail, index, statistiques, query store, dmv, performances]
icon: gauge
---

## SQL Server Agent

L'**Agent** exécute des **travaux** planifiés (T-SQL, PowerShell, SSIS, commandes) ; il n'existe pas en édition Express (utiliser le Planificateur de tâches Windows + `sqlcmd`).

```tsql
USE msdb;
EXEC sp_add_job @job_name = N'Maintenance - CHECKDB hebdomadaire', @owner_login_name = N'sa';
EXEC sp_add_jobstep @job_name = N'Maintenance - CHECKDB hebdomadaire', @step_name = N'CHECKDB',
  @subsystem = N'TSQL', @command = N'EXECUTE dbo.DatabaseIntegrityCheck @Databases = ''ALL_DATABASES''', @database_name = N'master';
EXEC sp_add_schedule @schedule_name = N'Dimanche 01h00', @freq_type = 8, @freq_interval = 1, @freq_recurrence_factor = 1, @active_start_time = 010000;
EXEC sp_attach_schedule @job_name = N'Maintenance - CHECKDB hebdomadaire', @schedule_name = N'Dimanche 01h00';
EXEC sp_add_jobserver @job_name = N'Maintenance - CHECKDB hebdomadaire';
```

Le propriétaire `sa` (désactivé, mais valide comme propriétaire) évite qu'un travail échoue au départ de la personne qui l'a créé.

### Database Mail, opérateurs, alertes

```tsql
-- Profil de messagerie (assistant SSMS ou procédures sysmail_add_*)
EXEC msdb.dbo.sysmail_add_account_sp @account_name = N'SQL-Alertes', @email_address = N'sql-srv-sql-01@corp.exemple.fr',
  @mailserver_name = N'smtp.corp.exemple.fr', @port = 587, @enable_ssl = 1;
EXEC msdb.dbo.sysmail_add_profile_sp @profile_name = N'Alertes';
EXEC msdb.dbo.sysmail_add_profileaccount_sp @profile_name = N'Alertes', @account_name = N'SQL-Alertes', @sequence_number = 1;
EXEC msdb.dbo.sp_add_operator @name = N'DBA', @email_address = N'dba@corp.exemple.fr';

-- Alertes sur les erreurs graves (gravité 17 à 25) et les erreurs d'E/S (823, 824, 825)
EXEC msdb.dbo.sp_add_alert @name = N'Gravité 19', @severity = 19, @include_event_description_in = 1;
EXEC msdb.dbo.sp_add_notification @alert_name = N'Gravité 19', @operator_name = N'DBA', @notification_method = 1;
EXEC msdb.dbo.sp_add_alert @name = N'Erreur 825 (lecture réessayée)', @message_id = 825;
EXEC msdb.dbo.sp_add_notification @alert_name = N'Erreur 825 (lecture réessayée)', @operator_name = N'DBA', @notification_method = 1;
```

Activez le profil dans *Propriétés de l'Agent → Système d'alerte*. Les **comptes proxy** permettent à une étape (PowerShell, CmdExec, SSIS) de s'exécuter sous un autre compte que celui de l'Agent.

## Maintenance

| Tâche | Fréquence | Outil |
| --- | --- | --- |
| Sauvegardes | Voir [[03-sauvegarde-restauration\|sauvegarde]] | Ola Hallengren `DatabaseBackup` |
| Intégrité (`CHECKDB`) | Hebdomadaire (ou sur un secondaire / une restauration) | `DatabaseIntegrityCheck` |
| Index | Hebdomadaire, **réorganiser** de 5–30 % de fragmentation, **reconstruire** au-delà (sur SSD, la fragmentation compte moins que les statistiques) | `IndexOptimize` |
| **Statistiques** | Quotidienne ou hebdomadaire | `IndexOptimize @UpdateStatistics = 'ALL'` |
| Nettoyage de l'historique | Hebdomadaire | `sp_delete_backuphistory`, `sp_purge_jobhistory`, `CommandLog Cleanup` |

```tsql
EXECUTE dbo.IndexOptimize @Databases = 'USER_DATABASES', @FragmentationLow = NULL,
  @FragmentationMedium = 'INDEX_REORGANIZE,INDEX_REBUILD_ONLINE,INDEX_REBUILD_OFFLINE',
  @FragmentationHigh = 'INDEX_REBUILD_ONLINE,INDEX_REBUILD_OFFLINE', @FragmentationLevel1 = 5, @FragmentationLevel2 = 30,
  @UpdateStatistics = 'ALL', @OnlyModifiedStatistics = 'Y';
```

## Query Store

Le **Query Store** (activé par défaut sur les nouvelles bases depuis 2022) conserve l'historique des plans et des performances par requête : retrouver la requête qui a régressé et **forcer** l'ancien plan.

```tsql
ALTER DATABASE Compta SET QUERY_STORE = ON (OPERATION_MODE = READ_WRITE, MAX_STORAGE_SIZE_MB = 2048, QUERY_CAPTURE_MODE = AUTO);
-- SSMS : Base → Magasin des requêtes → Requêtes ayant régressé / Requêtes les plus consommatrices
EXEC sp_query_store_force_plan @query_id = 4210, @plan_id = 7781;
```

## Diagnostic par les vues de gestion dynamique

```tsql
-- Principales attentes depuis le démarrage (hors attentes bénignes)
SELECT TOP 10 wait_type, wait_time_ms / 1000 AS secondes, waiting_tasks_count
FROM sys.dm_os_wait_stats
WHERE wait_type NOT IN ('SLEEP_TASK','BROKER_TASK_STOP','XE_TIMER_EVENT','LAZYWRITER_SLEEP','SQLTRACE_BUFFER_FLUSH','REQUEST_FOR_DEADLOCK_SEARCH','CHECKPOINT_QUEUE','LOGMGR_QUEUE','WAITFOR','DIRTY_PAGE_POLL','HADR_FILESTREAM_IOMGR_IOCOMPLETION','SP_SERVER_DIAGNOSTICS_SLEEP')
ORDER BY wait_time_ms DESC;

-- Requêtes les plus consommatrices de CPU
SELECT TOP 10 qs.total_worker_time / qs.execution_count AS cpu_moyen, qs.execution_count,
       SUBSTRING(st.text, qs.statement_start_offset/2 + 1, 200) AS requete
FROM sys.dm_exec_query_stats qs CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY qs.total_worker_time DESC;

-- Blocages en cours
SELECT session_id, blocking_session_id, wait_type, wait_time, DB_NAME(database_id) AS base, command
FROM sys.dm_exec_requests WHERE blocking_session_id <> 0;

-- Latence des fichiers
SELECT DB_NAME(vfs.database_id) AS base, mf.physical_name,
       vfs.io_stall_read_ms / NULLIF(vfs.num_of_reads, 0) AS ms_lecture, vfs.io_stall_write_ms / NULLIF(vfs.num_of_writes, 0) AS ms_ecriture
FROM sys.dm_io_virtual_file_stats(NULL, NULL) vfs JOIN sys.master_files mf ON mf.database_id = vfs.database_id AND mf.file_id = vfs.file_id;
```

| Attente dominante | Piste |
| --- | --- |
| `PAGEIOLATCH_*` | Lectures disque : mémoire insuffisante, index manquants, stockage lent |
| `WRITELOG` | Écriture du journal lente : volume du journal, synchronisation AG |
| `CXPACKET` / `CXCONSUMER` | Parallélisme : MAXDOP, seuil de coût, requêtes à optimiser |
| `LCK_M_*` | Blocages : transactions longues, index, niveau d'isolement (RCSI) |
| `SOS_SCHEDULER_YIELD` | Saturation CPU |
| `RESOURCE_SEMAPHORE` | Mémoire d'exécution insuffisante (grosses requêtes) |

Outils communautaires : **sp_WhoIsActive** (activité en cours), **First Responder Kit** (`sp_Blitz`, `sp_BlitzCache`, `sp_BlitzIndex`) ; **événements étendus** (session `system_health` : interblocages, erreurs graves).

```tsql
-- Interblocages récents capturés par system_health
SELECT XEventData.XEvent.query('(data/value/deadlock)[1]') AS graphe
FROM (SELECT CAST(target_data AS XML) AS TargetData FROM sys.dm_xe_session_targets st
      JOIN sys.dm_xe_sessions s ON s.address = st.event_session_address WHERE s.name = 'system_health' AND st.target_name = 'ring_buffer') AS Data
CROSS APPLY TargetData.nodes('RingBufferTarget/event[@name="xml_deadlock_report"]') AS XEventData(XEvent);
```

## Réglages courants

- **RCSI** (*Read Committed Snapshot Isolation*) : les lectures ne bloquent plus les écritures (`ALTER DATABASE Compta SET READ_COMMITTED_SNAPSHOT ON`), au prix d'une charge sur tempdb — à valider avec l'éditeur de l'application.
- Niveau de compatibilité de la base aligné sur la version (nouvel estimateur de cardinalité, traitement intelligent des requêtes), après tests avec le Query Store.
- Index : consulter les index manquants suggérés (`sys.dm_db_missing_index_details`) avec discernement ; supprimer les index jamais utilisés.
