---
title: Gestion des clés, récupération et dépannage
description: Gérer BitLocker à l'échelle — sauvegarde et consultation des mots de passe de récupération dans Active Directory (outil d'affichage, délégation, PowerShell) et Entra ID / Intune, fin de MBAM, rotation des mots de passe, conformité et rapports, procédure de récupération (écran de récupération, identifiant de clé, repair-bde), suspension pour les mises à jour, révocations du démarrage sécurisé, journaux et problèmes fréquents.
tags: [bitlocker, récupération, active directory, intune, entra id, mbam, repair-bde, dépannage]
icon: settings-2
---

## Clés de récupération dans Active Directory

Avec la GPO *stocker les informations de récupération dans AD DS*, chaque mot de passe est enregistré comme objet `msFVE-RecoveryInformation` **sous l'objet ordinateur**.

```powershell
# Outils : fonctionnalité « Visionneuse de mots de passe de récupération BitLocker » (onglet dans Utilisateurs et ordinateurs AD)
Install-WindowsFeature RSAT-Feature-Tools-BitLocker-RemoteAdminTool, RSAT-Feature-Tools-BitLocker-BdeAducExt

# Retrouver le mot de passe d'un ordinateur
$pc = Get-ADComputer "PC-COMPTA-07"
Get-ADObject -SearchBase $pc.DistinguishedName -Filter 'objectClass -eq "msFVE-RecoveryInformation"' -Properties msFVE-RecoveryPassword, whenCreated |
  Select-Object Name, whenCreated, msFVE-RecoveryPassword

# Rechercher par identifiant de clé (les 8 premiers caractères affichés sur l'écran de récupération)
Get-ADObject -Filter 'objectClass -eq "msFVE-RecoveryInformation" -and Name -like "*4F2A9C1E*"' -Properties msFVE-RecoveryPassword
```

| Bonne pratique | Explication |
| --- | --- |
| **Délégation** de la lecture | Droit de lecture de `msFVE-RecoveryPassword` délégué au support (groupe dédié), pas aux administrateurs de domaine seulement |
| Traçabilité | Audit de l'accès aux objets (événement 4662) |
| Machines existantes | `Backup-BitLockerKeyProtector` par script pour les postes chiffrés avant la GPO |
| Suppression de l'objet ordinateur | Supprime aussi les clés : **corbeille AD** activée, ou désactiver plutôt que supprimer |

## Entra ID et Intune

Pour les postes joints à **Entra ID** (ou hybrides) gérés par **Intune** : la stratégie de chiffrement de disque Intune active BitLocker et **dépose la clé dans Entra ID** ; l'utilisateur peut la retrouver lui-même (portail *Mes appareils*) si l'administrateur l'autorise. **Rotation** du mot de passe de récupération après usage (*rotation automatique initiée par le client*).

```powershell
# Sur un poste joint à Entra ID : envoyer la clé si elle n'y est pas
BackupToAAD-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId $id.KeyProtectorId
```

**MBAM** (*Microsoft BitLocker Administration and Monitoring*) est en fin de support : migrez vers Intune ou, pour un parc sans Intune, AD DS + Configuration Manager (gestion BitLocker intégrée) ou des rapports par script.

## Conformité

```powershell
# Inventaire local (à collecter par l'outil de gestion ou un script)
Get-BitLockerVolume | Select-Object ComputerName, MountPoint, VolumeStatus, ProtectionStatus, EncryptionMethod,
  @{n='Protecteurs';e={($_.KeyProtector.KeyProtectorType) -join ','}}
```

Indicateurs : volumes système chiffrés **et protection active** (`ProtectionStatus On`), méthode XTS-AES, clé sauvegardée, aucune protection suspendue durablement.

## Récupération

L'écran de récupération affiche un **identifiant de clé** ; le support retrouve le mot de passe correspondant (AD, Entra ID) après vérification de l'identité de l'utilisateur.

Causes courantes : mise à jour du BIOS/UEFI sans suspension, changement de l'ordre de démarrage, démarrage depuis une clé USB, TPM réinitialisé, modification du démarrage sécurisé, carte mère changée, trop d'erreurs de PIN (anti-martèlement).

```text Disque illisible (machine morte) : déchiffrer sur une autre machine
repair-bde F: G: -RecoveryPassword 111111-222222-333333-444444-555555-666666-777777-888888 -Force
manage-bde -unlock F: -RecoveryPassword 111111-222222-…
```

Après une récupération, **changez** le mot de passe de récupération (il a été communiqué) :

```powershell
$ancien = (Get-BitLockerVolume C:).KeyProtector | Where-Object KeyProtectorType -eq RecoveryPassword
Remove-BitLockerKeyProtector -MountPoint C: -KeyProtectorId $ancien.KeyProtectorId
Add-BitLockerKeyProtector -MountPoint C: -RecoveryPasswordProtector
# puis Backup-BitLockerKeyProtector / BackupToAAD-BitLockerKeyProtector
```

## Mises à jour et démarrage sécurisé

- **Suspendre** BitLocker avant une mise à jour du micrologiciel : `Suspend-BitLocker -MountPoint C: -RebootCount 1` (les outils des constructeurs et Windows Update le font en général).
- Les **révocations** successives du gestionnaire de démarrage (BlackLotus, CVE-2023-24932) et le renouvellement des certificats UEFI de Microsoft (2023 → expiration des certificats 2011 en 2026) modifient les mesures du démarrage : déployez-les par anneaux et vérifiez qu'aucun écran de récupération massif n'apparaît.

## Journaux

| Journal | Contenu |
| --- | --- |
| *Microsoft-Windows-BitLocker/BitLocker Management* | Activation, protecteurs, sauvegarde de clés (845 : sauvegarde AD réussie ; 846 : Entra ID), erreurs |
| *Microsoft-Windows-BitLocker-API/Management* | Opérations API |
| *Système*, source TPM | État du TPM |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `The TPM is not ready` / activation impossible | TPM désactivé, non initialisé | UEFI, `Get-Tpm`, `Initialize-Tpm` |
| Activation refusée : sauvegarde AD requise | GPO exigeant la sauvegarde, DC injoignable ou droits du compte ordinateur | Connexion au domaine, schéma/droits, `Backup-BitLockerKeyProtector` |
| Écran de récupération à chaque démarrage | Démarrage sur un périphérique en premier, PCR modifiés, dock USB-C | Ordre de démarrage, `manage-bde -protectors -disable C:` puis `-enable` pour remesurer |
| Clé introuvable dans AD | Chiffré avant la GPO, objet ordinateur recréé | Sauvegarde par script ; corbeille AD |
| Chiffrement très lent | Disque entier au lieu de l'espace utilisé | `-UsedSpaceOnly` sur les machines neuves |
| Protection « suspendue » durablement | Suspension sans compteur de redémarrages | `Resume-BitLocker -MountPoint C:` |
