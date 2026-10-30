---
title: Sécurité
description: Sécuriser SQL Server — modes d'authentification (Windows, mixte, Entra ID), connexions et utilisateurs, rôles serveur et de base, principe du moindre privilège, compte sa, chiffrement des connexions (certificat, Force Encryption, TDS 8 strict), chiffrement transparent des données (TDE), sauvegardes chiffrées, Always Encrypted, audit SQL Server, réduction de la surface d'attaque et comptes de service.
tags: [sql server, sécurité, authentification, tls, tde, always encrypted, audit, rôles]
icon: shield-check
---

## Authentification

| Mode | Principe | Recommandation |
| --- | --- | --- |
| **Windows** (Kerberos/NTLM) | Comptes et groupes AD | À privilégier : mots de passe gérés par AD, groupes |
| Mixte (SQL + Windows) | Comptes SQL avec mot de passe | Seulement si une application l'exige ; stratégie de mot de passe Windows appliquée (`CHECK_POLICY`) |
| Microsoft Entra ID | Comptes Entra (SQL 2022+ avec Azure Arc) | Environnements hybrides |

Pour l'authentification **Kerberos** (indispensable pour la délégation, ex. SSRS), le compte de service doit porter les **SPN** `MSSQLSvc/srv-sql-01.corp.exemple.fr:1433` (automatique avec un gMSA ou un compte disposant du droit d'écrire ses SPN).

```tsql
SELECT session_id, auth_scheme, encrypt_option FROM sys.dm_exec_connections WHERE session_id = @@SPID;   -- KERBEROS attendu
```

## Connexions, utilisateurs, rôles

```tsql
-- Connexion au niveau serveur pour un groupe AD, utilisateur dans la base, rôle applicatif
CREATE LOGIN [CORP\GG-App-Compta] FROM WINDOWS WITH DEFAULT_DATABASE = Compta;
USE Compta;
CREATE USER [CORP\GG-App-Compta] FOR LOGIN [CORP\GG-App-Compta];
CREATE ROLE role_compta_lecture;
GRANT SELECT ON SCHEMA::dbo TO role_compta_lecture;
GRANT EXECUTE ON SCHEMA::rapports TO role_compta_lecture;
ALTER ROLE role_compta_lecture ADD MEMBER [CORP\GG-App-Compta];

-- Compte SQL pour une application qui l'exige
CREATE LOGIN app_erp WITH PASSWORD = 'MotDePasseApplicatifTresLong!', CHECK_POLICY = ON, CHECK_EXPIRATION = OFF;
```

| Rôle | Portée | Remarque |
| --- | --- | --- |
| `sysadmin` | Serveur | Tout ; réservé aux DBA (groupe AD dédié) |
| `securityadmin` | Serveur | Équivaut presque à sysadmin (peut s'accorder des droits) |
| `db_owner` | Base | À éviter pour les applications |
| `db_datareader` / `db_datawriter` | Base | Pratique, mais préférer des rôles personnalisés par schéma |
| Rôles serveur personnalisés (2012+) / `##MS_ServerStateReader##` (2022+) | Serveur | Supervision sans sysadmin |

- [ ] **Désactiver ou renommer `sa`** ; aucun compte applicatif sysadmin
- [ ] Applications : droits limités à leurs bases, `EXECUTE` sur des procédures plutôt que des droits directs sur les tables
- [ ] Revue régulière : `sys.server_principals`, membres de `sysadmin`, connexions orphelines

```tsql
ALTER LOGIN sa DISABLE;
SELECT p.name, p.type_desc FROM sys.server_role_members m
JOIN sys.server_principals r ON r.principal_id = m.role_principal_id
JOIN sys.server_principals p ON p.principal_id = m.member_principal_id
WHERE r.name = 'sysadmin';
```

## Chiffrement des connexions

Par défaut, SQL Server chiffre l'échange d'authentification avec un certificat **autosigné** ; le trafic de données peut rester en clair.

1. Certificat (AD CS ou public) au nom FQDN du serveur (et du **listener** AG), EKU *Authentification du serveur*, clé accessible au compte de service.
2. *Gestionnaire de configuration → Protocoles → Propriétés → Certificat*, puis **Forcer le chiffrement** = Oui (ou *Forcer le chiffrement strict* en 2022+ : **TDS 8.0**, TLS avant toute négociation, compatible TLS 1.3).
3. Redémarrer le service ; côté clients, `Encrypt=True` (défaut des pilotes récents) et **ne pas** utiliser `TrustServerCertificate=True` en production.

```text
sqlcmd -S srv-sql-01.corp.exemple.fr -E -N -Q "SELECT encrypt_option FROM sys.dm_exec_connections WHERE session_id=@@SPID"
```

## Chiffrement des données

| Fonction | Protège contre | Remarques |
| --- | --- | --- |
| **TDE** (chiffrement transparent) | Vol des fichiers de base et des sauvegardes | Chiffrement au repos, transparent pour l'application ; Standard depuis 2019 |
| Sauvegardes chiffrées | Vol des sauvegardes | `WITH ENCRYPTION` (certificat) |
| **Always Encrypted** | Administrateurs du serveur, DBA | Chiffrement côté **client** de colonnes sensibles (clés hors de SQL Server) ; limite les requêtes possibles |
| Masquage dynamique, sécurité au niveau des lignes | Exposition dans les applications | Pas un chiffrement : contrôle d'accès |

```tsql
USE master;
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'PhraseMaitreTresLongue!';
CREATE CERTIFICATE Cert_TDE WITH SUBJECT = 'Certificat TDE';
-- SAUVEGARDER le certificat et sa clé privée immédiatement (indispensable pour restaurer ailleurs)
BACKUP CERTIFICATE Cert_TDE TO FILE = 'S:\Cles\Cert_TDE.cer'
  WITH PRIVATE KEY (FILE = 'S:\Cles\Cert_TDE.pvk', ENCRYPTION BY PASSWORD = 'MotDePasseExportTresLong!');
USE Compta;
CREATE DATABASE ENCRYPTION KEY WITH ALGORITHM = AES_256 ENCRYPTION BY SERVER CERTIFICATE Cert_TDE;
ALTER DATABASE Compta SET ENCRYPTION ON;
SELECT DB_NAME(database_id), encryption_state, percent_complete FROM sys.dm_database_encryption_keys;
```

> [!WARNING]
> Sans la sauvegarde du **certificat TDE** et de sa clé privée, une base chiffrée et ses sauvegardes sont **irrécupérables** sur un autre serveur. Conservez-les hors du serveur (coffre, HSM), avec le mot de passe.

## Audit

```tsql
CREATE SERVER AUDIT Audit_Securite TO FILE (FILEPATH = 'S:\Audit\', MAXSIZE = 256 MB, MAX_ROLLOVER_FILES = 20) WITH (ON_FAILURE = CONTINUE);
ALTER SERVER AUDIT Audit_Securite WITH (STATE = ON);
CREATE SERVER AUDIT SPECIFICATION Spec_Securite FOR SERVER AUDIT Audit_Securite
  ADD (FAILED_LOGIN_GROUP), ADD (SUCCESSFUL_LOGIN_GROUP), ADD (SERVER_ROLE_MEMBER_CHANGE_GROUP),
  ADD (SERVER_PRINCIPAL_CHANGE_GROUP), ADD (DATABASE_PERMISSION_CHANGE_GROUP), ADD (AUDIT_CHANGE_GROUP)
  WITH (STATE = ON);
SELECT event_time, action_id, server_principal_name, statement FROM sys.fn_get_audit_file('S:\Audit\*.sqlaudit', DEFAULT, DEFAULT);
```

Les fichiers d'audit (ou le journal *Sécurité* / *Application* de Windows comme cible) sont envoyés au SIEM.

## Surface d'attaque

- [ ] Fonctions désactivées : `xp_cmdshell`, *Ole Automation Procedures*, CLR non signé, requêtes distribuées ad hoc
- [ ] SQL Server Browser désactivé si les ports sont fixés et connus
- [ ] Pare-feu : 1433 depuis les serveurs applicatifs et le réseau d'administration seulement
- [ ] Comptes de service **non administrateurs** (gMSA), un par service
- [ ] Mises à jour cumulatives (CU) appliquées régulièrement
- [ ] Évaluation : *SQL Vulnerability Assessment*, `Invoke-DbaDbccCheck`/`Test-Dba*` (dbatools)

```tsql
EXEC sp_configure 'xp_cmdshell', 0; EXEC sp_configure 'Ole Automation Procedures', 0; RECONFIGURE;
```

Suite : [[03-sauvegarde-restauration|sauvegarde et restauration]].
