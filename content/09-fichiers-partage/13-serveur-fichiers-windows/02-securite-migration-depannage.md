---
title: Sécurité, audit, migration et dépannage
description: Sécuriser un serveur de fichiers Windows (SMB 1 désactivé, signature et chiffrement, NTLM, partages administratifs, ransomware, accès contrôlé aux dossiers), auditer les accès (stratégie d'audit avancée, SACL, événements 4663, 5145), migrer (Storage Migration Service, robocopy avec ACL), haute disponibilité (cluster SOFS, disponibilité continue), supervision et problèmes fréquents.
tags: [windows server, serveur de fichiers, sécurité, audit, robocopy, storage migration service, smb, dépannage]
icon: shield-check
---

## Durcissement

- [ ] **SMB 1 désactivé** (serveur et clients), SMB 2/3 uniquement
- [ ] **Signature SMB** exigée (serveurs et clients) ; **chiffrement** sur les partages sensibles ou `RejectUnencryptedAccess`
- [ ] Réduire **NTLM** (audit puis restriction) ; Kerberos pour l'accès par nom (`\\srv-fic-01.corp.exemple.fr`) — un accès par adresse IP force NTLM
- [ ] Pas de partage `Tout le monde : Contrôle total` ; ACL par groupes de domaine local
- [ ] Partages administratifs (`C$`, `ADMIN$`) réservés aux administrateurs, accès SMB d'administration filtré par le pare-feu (réseau d'administration)
- [ ] **Pare-feu** : 445/TCP seulement depuis les réseaux clients ; jamais exposé sur Internet (utiliser SMB sur QUIC ou VPN)
- [ ] Sauvegardes hors ligne/immuables : un rançongiciel chiffre tout ce que l'utilisateur peut écrire
- [ ] Filtrage des extensions de rançongiciels avec [[15-fsrm/01-quotas-filtrage-classification|FSRM]], alerte et blocage du compte
- [ ] Antivirus avec exclusions adaptées (voir [[09-defender/01-antivirus-configuration|Defender]])

```powershell
Set-SmbServerConfiguration -RequireSecuritySignature $true -EncryptData $false -RejectUnencryptedAccess $true -Force
Set-SmbShare -Name "RH" -EncryptData $true -Force
```

## Audit des accès

```powershell
# Stratégie d'audit avancée (de préférence par GPO)
auditpol /set /subcategory:"Système de fichiers" /success:enable /failure:enable
auditpol /set /subcategory:"Partage de fichiers détaillé" /failure:enable

# SACL : auditer suppressions et modifications sur un dossier sensible
$acl = Get-Acl D:\Partages\RH -Audit
$regle = New-Object System.Security.AccessControl.FileSystemAuditRule("Tout le monde", "Delete,DeleteSubdirectoriesAndFiles,ChangePermissions,TakeOwnership,WriteData", "ContainerInherit,ObjectInherit", "None", "Success,Failure")
$acl.AddAuditRule($regle)
Set-Acl D:\Partages\RH $acl
```

| Événement | Signification |
| --- | --- |
| **4663** | Tentative d'accès à un objet (avec le type d'accès) |
| 4660 | Objet supprimé |
| 4670 | Autorisations modifiées |
| **5145** | Contrôle d'accès à un partage réseau (détaillé : beaucoup de volume — échecs seulement) |
| 5140 | Accès à un partage |

Le volume d'événements peut être énorme : ciblez les dossiers sensibles, transférez vers le SIEM ([[08-windows-event-collector/01-presentation-configuration|collecteur d'événements]]) et dimensionnez le journal Sécurité.

## Migration

### Storage Migration Service

Le **Storage Migration Service** (via [[10-windows-admin-center/01-presentation-installation|Windows Admin Center]]) inventorie un ancien serveur (Windows ou Samba), transfère partages, données, ACL et, en option, **reprend l'identité** (nom, adresses IP) de la source : les postes ne voient pas de changement.

### Robocopy

```powershell
# Copie initiale puis synchronisations (miroir) avec ACL, propriétaires et audit, journal, reprise
robocopy \\ancien-srv\Compta D:\Partages\Compta /MIR /COPYALL /DCOPY:DAT /R:1 /W:1 /MT:32 /XJ /B /NP /LOG+:D:\Migration\compta.log
# Dernière passe pendant la fenêtre de bascule (partage source en lecture seule), puis bascule DFS ou alias DNS
```

| Option | Rôle |
| --- | --- |
| `/MIR` | Miroir (**supprime** à la destination ce qui n'existe plus à la source) |
| `/COPYALL` | Données, attributs, horodatages, **ACL**, propriétaire, audit |
| `/MT:32` | Copie multithread |
| `/B` | Mode sauvegarde (contourne les ACL restrictives, droit *Sauvegarder les fichiers*) |
| `/XJ` | Exclut les points de jonction (évite les boucles) |

Avec un **espace de noms DFS**, la bascule consiste à changer la cible du dossier DFS : aucun chemin à modifier sur les postes.

## Haute disponibilité

| Solution | Usage |
| --- | --- |
| Serveur de fichiers en **cluster** (rôle *Serveur de fichiers à usage général*) | Partages utilisateurs, basculement en quelques secondes |
| **SOFS** (*Scale-Out File Server*) + CSV | Charges applicatives (Hyper-V, SQL) en partages **à disponibilité continue** |
| DFS-N + DFS-R | Plusieurs serveurs, sites distants (réplication asynchrone, attention aux conflits) |
| Storage Replica | Réplication de volume vers un site de secours ([[17-storage-replica/01-presentation-deploiement\|Storage Replica]]) |

## Supervision

| Indicateur | Source |
| --- | --- |
| Espace libre des volumes | Seuils 15 % / 10 % |
| Sessions et fichiers ouverts | `Get-SmbSession`, `Get-SmbOpenFile` |
| Latence disque | Compteurs *Disque logique — Moy. disque s/lecture, écriture* (< 20 ms) |
| Activité anormale (rançongiciel) | Pic de renommages/écritures, alertes FSRM, EDR |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `Accès refusé` alors que le groupe a les droits | Jeton non rafraîchi (ajout récent au groupe), droit de partage plus restrictif | Fermer/rouvrir la session, vérifier l'accès effectif et le partage |
| Ancien copieur / NAS n'arrive plus à écrire | SMB 1 désactivé, signature exigée | Mettre à jour l'équipement (SMB 2/3) ; exception documentée et temporaire |
| Connexion lente à `\\serveur` | Résolution de nom, NetBIOS, NTLM par IP | DNS, accès par FQDN |
| Fichier verrouillé | Session ouverte par un autre utilisateur | `Get-SmbOpenFile \| Where-Object Path -like "*fichier*" \| Close-SmbOpenFile` |
| ABE sans effet | Droits de lecture hérités sur les sous-dossiers | Revoir les ACL ; ABE masque seulement ce qui n'est pas lisible |
| Versions précédentes vides | Clichés non planifiés, espace de stockage VSS insuffisant | `vssadmin list shadowstorage`, planification |
