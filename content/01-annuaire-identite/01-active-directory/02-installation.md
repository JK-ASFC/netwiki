---
title: Planification et installation des contrôleurs de domaine
description: Choisir le nom de domaine, préparer les serveurs (IP, nom, heure), créer une nouvelle forêt en PowerShell ou par l'interface, ajouter des contrôleurs supplémentaires, des RODC, installer depuis un support (IFM), Server Core et vérifications post-installation.
tags: [active directory, installation, dcpromo, install-addsforest, rodc, ifm, windows server]
icon: download
---

## Planification

### Nom du domaine

| Choix | Avis |
| --- | --- |
| `corp.exemple.fr` / `ad.exemple.fr` (sous-domaine d'un domaine **possédé**) | **Recommandé** : unique, certificats publics possibles, pas de conflit |
| `exemple.fr` (même que le domaine public) | Possible mais impose un DNS *split-horizon* et complique la publication web |
| `corp.local`, `.lan`, `.intra` | **À éviter** : `.local` entre en conflit avec mDNS (macOS, Linux, IoT), aucun certificat public possible |
| Nom à un seul label (`CORP`) | **Interdit** en pratique |

- **Nom NetBIOS** : 15 caractères max, souvent le premier label en majuscules (`CORP`). Il apparaît dans `CORP\utilisateur` ; impossible à changer simplement.
- Le renommage d'un domaine existe (`rendom`) mais est complexe et incompatible avec Exchange : **choisir le bon nom dès le départ**.

### Nombre et placement des DC

- **Au moins deux DC par domaine**, sur des hôtes physiques/hyperviseurs différents.
- Un DC par site distant important (ou un RODC si la sécurité physique est faible).
- Tous les DC en **DNS + catalogue global** (forêt mono-domaine).
- Système dédié : **aucun autre rôle** (pas de serveur de fichiers, d'impression, d'applications).

### Virtualisation

> [!WARNING]
> - Ne **jamais** restaurer un DC depuis un instantané (snapshot) d'hyperviseur sans *VM-GenerationID* (Hyper-V 2012+, VMware 5.0U2+ supportent la protection) : risque de **USN rollback** et de corruption de la réplication.
> - Désactiver la synchronisation de l'heure de l'hyperviseur vers les DC (ils doivent suivre la hiérarchie NTP du domaine).
> - Ne pas cloner un DC sans la procédure de clonage officielle (`DCCloneConfig.xml`).

## Préparation du serveur

```powershell
# Nom et IP fixe
Rename-Computer -NewName DC01 -Restart
New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 10.0.10.11 -PrefixLength 24 -DefaultGateway 10.0.10.1
# DNS : pour le premier DC, lui-même ; pour les suivants, un DC existant (voir l'article DNS)
Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 10.0.10.12,127.0.0.1
# Fuseau horaire, mises à jour
Set-TimeZone -Id "Romance Standard Time"
# Vérifier qu'IPv6 n'est pas désactivé dans le registre (laisser activé, même non utilisé)
```

## Créer une nouvelle forêt

### PowerShell

```powershell
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools

Import-Module ADDSDeployment
Install-ADDSForest `
  -DomainName "corp.exemple.fr" `
  -DomainNetbiosName "CORP" `
  -ForestMode "WinThreshold" `
  -DomainMode "WinThreshold" `
  -InstallDns:$true `
  -CreateDnsDelegation:$false `
  -DatabasePath "D:\NTDS" `
  -LogPath "D:\NTDS" `
  -SysvolPath "D:\SYSVOL" `
  -SafeModeAdministratorPassword (Read-Host -AsSecureString "Mot de passe DSRM") `
  -NoRebootOnCompletion:$false `
  -Force:$true
```

| Valeur `-ForestMode` / `-DomainMode` | Niveau |
| --- | --- |
| `Win2012R2` | Windows Server 2012 R2 |
| `WinThreshold` | **Windows Server 2016** (DC 2016/2019/2022/2025) |
| `Win2025` | Windows Server 2025 (tous les DC en 2025) |

> [!TIP]
> Testez la commande avant de l'exécuter avec `Test-ADDSForestInstallation` (mêmes paramètres). Le mot de passe **DSRM** (mode de restauration des services d'annuaire) est indispensable en cas de restauration : stockez-le dans un coffre.

### Assistant graphique

Gestionnaire de serveur → Ajouter des rôles → **Services AD DS** → drapeau de notification → **Promouvoir ce serveur en contrôleur de domaine** → *Ajouter une nouvelle forêt*. L'assistant affiche à la fin le script PowerShell équivalent (bouton *Afficher le script*).

## Ajouter un contrôleur de domaine

```powershell
Install-WindowsFeature AD-Domain-Services -IncludeManagementTools
Install-ADDSDomainController `
  -DomainName "corp.exemple.fr" `
  -Credential (Get-Credential CORP\admin-t0) `
  -SiteName "Paris" `
  -InstallDns:$true `
  -NoGlobalCatalog:$false `
  -ReplicationSourceDC "DC01.corp.exemple.fr" `
  -DatabasePath "D:\NTDS" -LogPath "D:\NTDS" -SysvolPath "D:\SYSVOL" `
  -SafeModeAdministratorPassword (Read-Host -AsSecureString "DSRM") `
  -Force
```

### Installation depuis un support (IFM)

Pour un site distant à faible débit : on prépare une copie de la base sur un DC existant, on la transporte, et le nouveau DC ne réplique que les différences.

```powershell
# Sur un DC existant
ntdsutil "activate instance ntds" "ifm" "create sysvol full C:\IFM" quit quit
# Sur le nouveau serveur, après copie de C:\IFM
Install-ADDSDomainController -DomainName corp.exemple.fr -InstallationMediaPath "C:\IFM" -SiteName "Lyon" -InstallDns -Credential (Get-Credential) -SafeModeAdministratorPassword (Read-Host -AsSecureString)
```

## Contrôleur en lecture seule (RODC)

```powershell
# Pré-création du compte par un administrateur du domaine (délégation de l'installation à un admin local du site)
Add-ADDSReadOnlyDomainControllerAccount -DomainControllerAccountName "RODC-LYON" -DomainName corp.exemple.fr `
  -SiteName "Lyon" -DelegatedAdministratorAccountName "CORP\GG-Admins-Site-Lyon" `
  -AllowPasswordReplicationAccountName "CORP\GG-Utilisateurs-Lyon","CORP\GG-Ordinateurs-Lyon"

# Sur le serveur du site
Install-ADDSDomainController -DomainName corp.exemple.fr -ReadOnlyReplica -UseExistingAccount `
  -Credential (Get-Credential) -SafeModeAdministratorPassword (Read-Host -AsSecureString)
```

| Particularité RODC | Détail |
| --- | --- |
| Base en lecture seule | Les écritures sont renvoyées vers un DC inscriptible |
| **Password Replication Policy** | Seuls les comptes autorisés ont leur mot de passe mis en cache (jamais les administrateurs) |
| Administrateur local délégué | Peut gérer le serveur sans être administrateur du domaine |
| DNS en lecture seule | Les mises à jour dynamiques sont transmises à un DC inscriptible |
| En cas de vol | Réinitialiser les mots de passe des comptes mis en cache (option lors de la suppression du compte RODC) |

## Server Core

Un DC en **Server Core** réduit la surface d'attaque et les mises à jour. Administration à distance (RSAT, Windows Admin Center, PowerShell) :

```powershell
# Configuration initiale sur Server Core
sconfig
# Puis les mêmes commandes Install-WindowsFeature / Install-ADDS* qu'avec l'interface graphique
```

## Vérifications après installation

```powershell
Get-Service NTDS, DNS, Netlogon, KDC, DFSR, W32Time | Select-Object Name, Status
dcdiag /v /c /e /q                      # tous les tests, tous les DC, uniquement les erreurs
repadmin /replsummary
repadmin /showrepl
Get-SmbShare | Where-Object Name -in 'SYSVOL','NETLOGON'
nltest /dsgetdc:corp.exemple.fr
Resolve-DnsName -Type SRV _ldap._tcp.dc._msdcs.corp.exemple.fr
w32tm /query /status
```

> [!IMPORTANT]
> Les partages **SYSVOL** et **NETLOGON** doivent être présents. S'ils manquent après plusieurs minutes, la réplication initiale DFSR n'est pas terminée (événement 4614 en attente, 4604 = succès) : voir [[12-depannage-commandes]].

## Tâches post-installation recommandées

- [ ] Créer la structure d'OU et déplacer les conteneurs par défaut (`redircmp`, `redirusr`) — [[04-utilisateurs-groupes-ou]]
- [ ] Configurer les sites et sous-réseaux — [[06-sites-replication]]
- [ ] Configurer l'**heure** sur l'émulateur PDC — [[07-fsmo-maintenance]]
- [ ] Configurer les **redirecteurs DNS** et le nettoyage — [[03-dns-integre]]
- [ ] Activer la **corbeille AD** — [[08-sauvegarde-restauration]]
- [ ] Mettre en place les sauvegardes d'état système
- [ ] Créer le **magasin central** des modèles ADMX — [[05-gpo]]
- [ ] Renommer/désactiver le compte Administrateur intégré, créer des comptes d'administration nominatifs — [[09-securite-durcissement]]
- [ ] Déployer Windows LAPS
