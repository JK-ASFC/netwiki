---
title: BitLocker — aide-mémoire des commandes
description: Commandes BitLocker avec exemples — état (Get-BitLockerVolume, manage-bde -status), activation avec TPM, TPM + PIN, clé de récupération, chiffrement de l'espace utilisé, sauvegarde de la clé de récupération dans AD DS et Entra ID, protecteurs, suspension pour mises à jour, déverrouillage automatique des données, lecteurs amovibles (BitLocker To Go), récupération (repair-bde), vérification du TPM.
tags: [aide-mémoire, bitlocker, manage-bde, tpm, chiffrement, windows]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-activation|BitLocker]].

## État et TPM

```powershell
Get-BitLockerVolume | Format-Table MountPoint, VolumeStatus, EncryptionPercentage, ProtectionStatus, EncryptionMethod
manage-bde -status
Get-Tpm | Select-Object TpmPresent, TpmReady, TpmEnabled, ManufacturerVersion
tpm.msc
```

## Activer

```powershell
# Volume système : TPM + clé de récupération, chiffrement de l'espace utilisé, XTS-AES 256
Add-BitLockerKeyProtector -MountPoint C: -RecoveryPasswordProtector
Enable-BitLocker -MountPoint C: -EncryptionMethod XtsAes256 -UsedSpaceOnly -TpmProtector
# TPM + code PIN au démarrage (stratégie « Exiger une authentification supplémentaire au démarrage » requise)
Enable-BitLocker -MountPoint C: -EncryptionMethod XtsAes256 -TpmAndPinProtector -Pin (Read-Host -AsSecureString "PIN")
# Volume de données avec déverrouillage automatique
Enable-BitLocker -MountPoint D: -EncryptionMethod XtsAes256 -RecoveryPasswordProtector
Enable-BitLockerAutoUnlock -MountPoint D:
manage-bde -on C: -RecoveryPassword -UsedSpaceOnly
```

## Clés de récupération

```powershell
(Get-BitLockerVolume -MountPoint C:).KeyProtector | Where-Object KeyProtectorType -eq RecoveryPassword | Select-Object KeyProtectorId, RecoveryPassword
$id = ((Get-BitLockerVolume -MountPoint C:).KeyProtector | Where-Object KeyProtectorType -eq RecoveryPassword).KeyProtectorId
Backup-BitLockerKeyProtector -MountPoint C: -KeyProtectorId $id            # vers AD DS (GPO requise)
BackupToAAD-BitLockerKeyProtector -MountPoint C: -KeyProtectorId $id       # vers Entra ID
manage-bde -protectors -get C:
# Rechercher une clé dans l'AD (outils RSAT)
Get-ADObject -Filter "objectClass -eq 'msFVE-RecoveryInformation'" -SearchBase (Get-ADComputer PC-PARIS-042).DistinguishedName -Properties msFVE-RecoveryPassword | Select-Object Name, msFVE-RecoveryPassword
```

## Maintenance

```powershell
Suspend-BitLocker -MountPoint C: -RebootCount 1        # mise à jour du BIOS/UEFI, du chargeur de démarrage
Resume-BitLocker -MountPoint C:
Remove-BitLockerKeyProtector -MountPoint C: -KeyProtectorId "{ID}"
Disable-BitLocker -MountPoint D:                        # déchiffrer
manage-bde -changepin C:
```

## Lecteurs amovibles (BitLocker To Go)

```powershell
Enable-BitLocker -MountPoint E: -PasswordProtector -Password (Read-Host -AsSecureString "Mot de passe") -EncryptionMethod Aes256
Unlock-BitLocker -MountPoint E: -Password (Read-Host -AsSecureString)
Lock-BitLocker -MountPoint E:
```

## Récupération

```powershell
manage-bde -unlock D: -RecoveryPassword 123456-123456-123456-123456-123456-123456-123456-123456
repair-bde C: D:\Recuperation -RecoveryPassword 123456-...       # disque endommagé : copie des données lisibles vers un autre volume
```

Dans WinRE (écran bleu de récupération), saisir la clé de 48 chiffres ; l'identifiant de clé affiché permet de retrouver la bonne clé dans l'AD, Entra ID ou le portail Microsoft du compte.
