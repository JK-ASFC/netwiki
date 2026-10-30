---
title: Images, déploiement automatisé et dépannage
description: Gérer les images WDS — image de démarrage WinPE personnalisée (ADK, pilotes réseau et stockage), images d'installation, groupes d'images, fichiers de réponses sans assistance, ajout de pilotes, multidiffusion, déploiement par réseau sans fil impossible, sécurité, journaux et problèmes PXE fréquents.
tags: [wds, winpe, adk, images, unattend, multidiffusion, pxe, dépannage]
icon: settings-2
---

## Image de démarrage WinPE

```powershell
# Sur un poste d'administration avec Windows ADK + module WinPE
copype amd64 C:\WinPE_amd64
Dism /Mount-Image /ImageFile:C:\WinPE_amd64\media\sources\boot.wim /Index:1 /MountDir:C:\WinPE_amd64\mount
Dism /Image:C:\WinPE_amd64\mount /Add-Driver /Driver:C:\Pilotes\WinPE /Recurse          # pilotes réseau et stockage
Dism /Image:C:\WinPE_amd64\mount /Add-Package /PackagePath:"C:\Program Files (x86)\Windows Kits\10\Assessment and Deployment Kit\Windows Preinstallation Environment\amd64\WinPE_OCs\WinPE-PowerShell.cab"
Dism /Unmount-Image /MountDir:C:\WinPE_amd64\mount /Commit

# Sur le serveur WDS
Import-WdsBootImage -Path C:\WinPE_amd64\media\sources\boot.wim -NewImageName "WinPE x64 — déploiement" -NewDescription "WinPE avec pilotes, 2026-10"
Get-WdsBootImage
```

L'image de démarrage contient généralement un script (`startnet.cmd`) qui lance l'outil de déploiement (séquence de tâches, script PowerShell appliquant une image avec `Dism /Apply-Image`, ou client d'un outil tiers).

## Images d'installation

```powershell
New-WdsInstallImageGroup -Name "Windows-11"
Import-WdsInstallImage -ImageGroup "Windows-11" -Path D:\Images\install.wim -ImageName "Windows 11 Entreprise" -UnattendFile D:\Images\unattend-installation.xml
Get-WdsInstallImage -ImageGroup "Windows-11"
```

Préférez une **image de référence** maintenue (mises à jour cumulatives intégrées, applications de base) capturée après **Sysprep** (`sysprep /generalize /oobe /shutdown`), ou l'image Microsoft à jour + post-configuration par l'outil de gestion (Intune, ConfigMgr, GPO).

### Sans assistance

| Fichier | Rôle |
| --- | --- |
| Réponse **WDS client** (`WDSClientUnattend.xml`) | Langue, identifiants WDS, partitionnement, choix de l'image (étape WinPE) |
| Réponse **d'installation** (`unattend.xml`) | Nom de l'ordinateur, jonction au domaine, compte local, OOBE |

```powershell
wdsutil /Set-Server /WdsUnattend /Policy:Enabled /File:WdsClientUnattend\WDSClientUnattend.xml /Architecture:x64uefi
```

Les fichiers se créent avec le **Gestionnaire d'images système Windows** (ADK). Ne laissez pas de mot de passe de compte de domaine en clair : utilisez un compte de jonction dédié aux droits limités à l'OU des postes, ou la jonction en ligne par l'outil de gestion.

## Pilotes

```powershell
Add-WdsDriverPackage -Path D:\Pilotes\Dell-Latitude\*.inf     # dans le magasin de pilotes WDS
New-WdsDriverGroup -Name "Dell-Latitude-7450" -Applicability Matched
```

## Multidiffusion

Pour installer des dizaines de postes simultanément sans saturer le réseau :

```powershell
wdsutil /New-MulticastTransmission /FriendlyName:"Windows 11 — salle de formation" /Image:"Windows 11 Entreprise" /ImageType:Install /ImageGroup:"Windows-11" /TransmissionType:AutoCast
```

Le réseau doit gérer la multidiffusion (**IGMP snooping** et querier sur les commutateurs) ; sinon, la multidiffusion inonde tous les ports du VLAN.

## Sécurité

- [ ] Approbation administrative des clients inconnus, ou comptes pré-créés
- [ ] Déploiements dans un **VLAN dédié** de préparation, relais DHCP/WDS seulement sur les VLAN concernés
- [ ] Partage `REMINST` en lecture pour les utilisateurs authentifiés seulement ; images sans secrets
- [ ] Fichiers de démarrage et WinPE à jour (Secure Boot, révocations)
- [ ] Mot de passe BIOS/UEFI et ordre de démarrage verrouillé sur les postes en production (PXE déclenché volontairement)

## Journaux

| Journal | Contenu |
| --- | --- |
| *Microsoft-Windows-Deployment-Services-Diagnostics/Admin* et *Operational* | Démarrages PXE, transferts, erreurs |
| Traçage WDS | `wdsutil /Set-Server /Trace` ou registre `HKLM\SYSTEM\CurrentControlSet\Services\WDSServer\Providers\WDSPXE` |
| Côté client (WinPE) | `X:\Windows\Temp\…`, `setupact.log` / `setuperr.log` sous `X:\$WINDOWS.~BT\Sources\Panther` |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `PXE-E53: No boot filename received` / `PXE-E16: No offer received` | Relais WDS absent, WDS ne répond pas | `ip helper-address` vers WDS, *AnswerClients*, service démarré |
| UEFI ne démarre pas, BIOS oui | Options 66/67 forcées vers un fichier BIOS | Supprimer 66/67 ou stratégies par architecture |
| `Windows Boot Manager … 0xc0000001` / transfert TFTP très lent | Taille de bloc TFTP, fenêtre variable, MTU | Onglet *TFTP* : taille de bloc (ex. 1456), fenêtre variable désactivée si problème |
| Écran « image non signée » avec Secure Boot | Gestionnaire de démarrage ou WinPE trop ancien / révoqué | Régénérer avec l'ADK et les fichiers de démarrage à jour |
| WinPE démarre mais pas de réseau ni de disque | Pilotes absents de l'image de démarrage | Ajouter les pilotes (DISM) et réimporter |
| Conflit avec le DHCP local | WDS et DHCP sur le même serveur | `/UseDhcpPorts:No /DhcpOption60:Yes` |
