---
title: SSRS, SSIS et SSAS
description: Services décisionnels de SQL Server — Reporting Services et Power BI Report Server (installation, base ReportServer, URL et certificats, sources de données, abonnements, délégation Kerberos, clé de chiffrement), Integration Services (catalogue SSISDB, déploiement de projets, environnements, exécution par l'Agent, dtexec), Analysis Services (modèles tabulaires et multidimensionnels, rôles, traitement, sauvegarde), sécurité et dépannage.
tags: [sql server, ssrs, power bi report server, ssis, ssisdb, ssas, décisionnel, kerberos]
icon: bar-chart-3
---

## Reporting Services (SSRS)

**SSRS** publie des **rapports** paginés (tableaux, factures, exports PDF/Excel) consultables par un portail web et envoyés par **abonnements**. Depuis 2017, il s'installe **séparément** du moteur. Avec SQL Server 2025, Microsoft oriente le reporting sur site vers **Power BI Report Server** (PBIRS : rapports paginés + rapports Power BI), inclus avec les licences Enterprise sous Software Assurance.

```text
SQLServerReportingServices.exe /quiet /IAcceptLicenseTerms /Edition=STD
```

Configuration avec le **Gestionnaire de configuration de Report Server** :

| Élément | Réglage |
| --- | --- |
| Compte de service | Compte virtuel ou gMSA |
| URL du service web et du portail | `https://rapports.corp.exemple.fr/ReportServer` et `/Reports`, **certificat** lié en HTTPS |
| Base de données | `ReportServer` et `ReportServerTempDB` sur une instance SQL (locale ou distante) |
| Courrier électronique | Serveur SMTP pour les abonnements |
| **Clé de chiffrement** | **Sauvegarder** (fichier `.snk` + mot de passe) : elle protège les identifiants des sources de données ; indispensable pour une restauration ou une migration |

```powershell
# Sauvegarde de la clé (module ReportingServicesTools)
Install-Module ReportingServicesTools
Backup-RsEncryptionKey -Password 'MotDePasseCleTresLong!' -KeyPath 'S:\Cles\ssrs-cle.snk'
```

**Sources de données** : partagées, avec identifiants **stockés** (compte de service applicatif en lecture) ou **Windows intégré** (l'identité de l'utilisateur est transmise : nécessite la **délégation Kerberos contrainte** du compte SSRS vers le SPN `MSSQLSvc` de la base, et le SPN `HTTP/rapports.corp.exemple.fr` sur le compte SSRS).

**Sécurité** : rôles du portail (*Navigateur*, *Éditeur de contenu*, *Publication*, *Gestionnaire de contenu*) attribués à des groupes AD par dossier ; rôles système (*Administrateur système*) restreints.

## Integration Services (SSIS)

**SSIS** exécute des **packages** d'intégration de données (ETL) : extraction depuis des fichiers, des bases, des API, transformations, chargement. Les packages sont développés dans Visual Studio (extension *SQL Server Integration Services Projects*).

```tsql
-- Catalogue SSISDB (une fois par instance) : SSMS → Integration Services Catalogs → Créer le catalogue
-- (active CLR et chiffre le catalogue par un mot de passe à conserver)
SELECT name, created_time FROM SSISDB.catalog.folders;
SELECT TOP 20 execution_id, folder_name, project_name, package_name, status, start_time, end_time
FROM SSISDB.catalog.executions ORDER BY execution_id DESC;   -- status 7 = réussi, 4 = échec
```

| Notion | Rôle |
| --- | --- |
| **Catalogue SSISDB** | Stockage des projets déployés, historique des exécutions, journalisation |
| Projet / package | Unité de déploiement (`.ispac`) / flux de travail |
| **Environnements** | Jeux de variables (chaînes de connexion, chemins) par contexte : DEV, RECETTE, PROD |
| Exécution | Travail de l'**Agent** (étape *Package SSIS*) ou `dtexec` / `catalog.start_execution` |

```text
ISDeploymentWizard.exe /Silent /SourcePath:"C:\Build\Chargement.ispac" /DestinationServer:"srv-sql-01" /DestinationPath:"/SSISDB/Finance/Chargement"
dtexec /ISServer "\SSISDB\Finance\Chargement\Import.dtsx" /Server srv-sql-01 /Env 3
```

**Sécurité** : pas de mot de passe en clair dans les packages (niveau de protection *ServerStorage* + paramètres sensibles), comptes **proxy** de l'Agent pour accéder aux partages et sources externes avec un compte dédié.

## Analysis Services (SSAS)

**SSAS** héberge des **modèles analytiques** interrogés par Excel, Power BI ou des outils de rapport :

| Mode | Langage | Usage |
| --- | --- | --- |
| **Tabulaire** (en mémoire, VertiPaq) | DAX | Mode courant, proche de Power BI |
| Multidimensionnel (cubes OLAP) | MDX | Historique, plus maintenu activement |

- Installation : composant *Analysis Services* de l'installateur SQL Server, instance dédiée (beaucoup de mémoire pour le tabulaire).
- **Rôles** : administrateurs du serveur (groupe AD), rôles de base avec droits de lecture et **sécurité au niveau des lignes** (filtres DAX).
- **Traitement** : actualisation des données planifiée par l'Agent (commande TMSL/XMLA) ; surveiller la durée et la mémoire.
- Sauvegarde : `Backup-ASDatabase` (module SqlServer) ou commande XMLA, fichiers `.abf`.

```powershell
Import-Module SqlServer
Backup-ASDatabase -Server srv-ssas-01 -Name Ventes -BackupFile "Ventes.abf" -AllowOverwrite -ApplyCompression
Invoke-ProcessASDatabase -Server srv-ssas-01 -DatabaseName Ventes -RefreshType Full
```

Ports : 2383/TCP (instance par défaut), 2382/UDP (SQL Server Browser pour SSAS nommé).

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| SSRS : `Login failed for user 'NT AUTHORITY\ANONYMOUS LOGON'` | Double saut sans délégation Kerberos | SPN `HTTP/…`, délégation contrainte vers `MSSQLSvc/…`, ou identifiants stockés |
| SSRS : portail inaccessible après restauration | Clé de chiffrement non restaurée | `Restore-RsEncryptionKey`, ou supprimer le contenu chiffré et ressaisir les identifiants |
| SSRS : abonnements non envoyés | Agent arrêté, SMTP | Les abonnements reposent sur des travaux Agent ; vérifier le serveur SMTP |
| SSIS : échec avec `Login failed` en exécution planifiée | Compte de l'Agent sans accès à la source | Compte proxy, environnement correct |
| SSIS : échec 64 bits / pilote | Pilote ODBC/OLE DB absent en 64 bits | Installer le fournisseur sur le serveur, `Use32BitRuntime` si nécessaire |
| SSAS : traitement très long ou mémoire saturée | Modèle volumineux, partitions | Partitionnement, actualisation incrémentielle, limites `TotalMemoryLimit` |
