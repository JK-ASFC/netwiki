---
title: Présentation et activation
description: BitLocker — chiffrement de volumes XTS-AES pour Windows 10/11 et Windows Server, rôle du TPM et du démarrage sécurisé, protecteurs (TPM, TPM + code PIN, clé de démarrage, mot de passe numérique de récupération, clé de récupération, déverrouillage réseau, Active Directory pour les volumes de données), chiffrement automatique des appareils, activation par PowerShell, manage-bde et GPO, BitLocker sur serveurs et VM (vTPM), volumes de données et amovibles (To Go).
tags: [bitlocker, chiffrement, tpm, windows server, xts-aes, déverrouillage réseau, gpo, manage-bde]
icon: lock-keyhole
---

**BitLocker** chiffre des volumes entiers (système, données, amovibles) en **XTS-AES** (128 ou 256 bits). Il protège les données si un disque, un portable ou un serveur est **volé** ou mis au rebut, et garantit avec le **TPM** que le système démarre sans altération (mesures du démarrage).

## Protecteurs

| Protecteur | Usage |
| --- | --- |
| **TPM** seul | Déverrouillage transparent si la chaîne de démarrage est intacte ; ne protège pas contre une attaque avec la machine allumée ou en veille |
| **TPM + code PIN** | Recommandé pour les portables exposés (protection contre les attaques DMA/sur le bus) |
| TPM + clé de démarrage (USB) | Cas particuliers |
| **Mot de passe numérique de récupération** (48 chiffres) | Récupération ; à **sauvegarder dans AD DS ou Entra ID** |
| Clé de récupération (fichier `.bek`) | Récupération |
| **Déverrouillage réseau** | Serveurs et postes fixes : déverrouillage automatique sur le réseau d'entreprise (TPM + clé fournie par un serveur WDS), TPM + PIN hors réseau |
| Protecteur AD (SID) | Volumes de **données** et clusters (CSV) : déverrouillage par le compte d'ordinateur / de cluster |
| Mot de passe | Volumes de données et amovibles |

## Prérequis

- **TPM 2.0** (ou vTPM pour les VM Hyper-V génération 2, VMware vTPM), UEFI et démarrage sécurisé
- Partition système séparée (créée par défaut par l'installation de Windows)
- Windows Server : fonctionnalité `BitLocker` à installer

## Activation

```powershell
# Windows Server
Install-WindowsFeature BitLocker -IncludeAllSubFeature -IncludeManagementTools -Restart

# Volume système : TPM + mot de passe de récupération, chiffrement de l'espace utilisé seulement (nouvelle machine)
Add-BitLockerKeyProtector -MountPoint "C:" -RecoveryPasswordProtector
Enable-BitLocker -MountPoint "C:" -EncryptionMethod XtsAes256 -UsedSpaceOnly -TpmProtector
# Sauvegarder le mot de passe de récupération dans AD (si la GPO l'exige, l'activation échoue sans cette sauvegarde)
$id = (Get-BitLockerVolume -MountPoint C:).KeyProtector | Where-Object KeyProtectorType -eq RecoveryPassword
Backup-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId $id.KeyProtectorId

# Volume de données avec déverrouillage automatique (lié au volume système)
Enable-BitLocker -MountPoint "D:" -EncryptionMethod XtsAes256 -RecoveryPasswordProtector
Enable-BitLockerAutoUnlock -MountPoint "D:"

Get-BitLockerVolume | Format-Table MountPoint, VolumeStatus, EncryptionPercentage, ProtectionStatus, EncryptionMethod
```

```text manage-bde (équivalent)
manage-bde -status
manage-bde -on C: -RecoveryPassword -UsedSpaceOnly -EncryptionMethod xts_aes256
manage-bde -protectors -get C:
manage-bde -protectors -adbackup C: -id {ID-DU-PROTECTEUR}
```

> [!IMPORTANT]
> Vérifiez que la **clé de récupération est sauvegardée** (AD, Entra ID, coffre) **avant** de considérer une machine comme chiffrée. Une mise à jour du micrologiciel, une modification du BIOS, un changement de carte mère ou une erreur de démarrage peuvent déclencher l'écran de récupération.

## GPO

*Configuration ordinateur → Modèles d'administration → Composants Windows → Chiffrement de lecteur BitLocker* :

| Paramètre | Valeur conseillée |
| --- | --- |
| Choisir la méthode et la puissance de chiffrement | XTS-AES 256 (système et fixes), AES-CBC 256 (amovibles lus sur d'anciens systèmes) |
| *Lecteurs du système d'exploitation → Exiger une authentification supplémentaire au démarrage* | TPM obligatoire ; TPM + PIN pour les portables |
| *Choisir comment les lecteurs … peuvent être récupérés* | Mot de passe de récupération autorisé, **enregistrer dans AD DS**, **ne pas activer BitLocker tant que les informations de récupération ne sont pas stockées** |
| Lecteurs amovibles | Refuser l'écriture sur les lecteurs non protégés par BitLocker (selon la politique de fuite de données) |
| Autoriser le déverrouillage réseau au démarrage | Activé (avec le certificat de déverrouillage réseau) |

## Déverrouillage réseau

Composants : rôle **WDS** avec la fonctionnalité *Déverrouillage réseau BitLocker* (`BitLocker-NetworkUnlock`) sur un serveur, certificat de déverrouillage réseau déployé par GPO, DHCP sur l'interface (UEFI avec pile DHCP). Au démarrage, la machine présente sa clé au serveur ; si le réseau d'entreprise est absent, elle demande le PIN. Idéal pour les **serveurs** et postes fixes protégés par TPM + PIN : pas d'intervention lors des redémarrages planifiés.

## Serveurs, clusters et VM

| Cas | Recommandation |
| --- | --- |
| Serveurs physiques (sites distants, agences) | BitLocker système + données, TPM + déverrouillage réseau, ou TPM seul selon le risque |
| VM Hyper-V | vTPM (génération 2) ; les VM protégées chiffrent leurs disques avec BitLocker |
| **CSV / cluster** | BitLocker sur les volumes CSV avec protecteur **AD (compte du cluster)** |
| Avant une mise à jour du micrologiciel | `Suspend-BitLocker -MountPoint C: -RebootCount 1` (évite l'écran de récupération) |

## BitLocker To Go

Les **lecteurs amovibles** sont chiffrés avec un mot de passe ou une carte à puce (`Enable-BitLocker -MountPoint E: -PasswordProtector`) ; la GPO peut imposer le chiffrement avant toute écriture.

Suite : [[02-gestion-recuperation-depannage|gestion, récupération et dépannage]].
