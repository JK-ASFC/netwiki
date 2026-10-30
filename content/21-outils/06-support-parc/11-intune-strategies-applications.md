---
title: Microsoft Intune — stratégies, applications et sécurité
description: Gérer les terminaux avec Intune — catalogue de paramètres, profils de configuration et GPO importées (analyse des stratégies de groupe), bases de référence de sécurité, sécurité des points de terminaison (antivirus, pare-feu, BitLocker, Windows LAPS, ASR), conformité et accès conditionnel, applications (Win32 .intunewin, Microsoft 365, Store, LOB, dépendances, remplacement), mises à jour Windows (anneaux, Autopatch), scripts et corrections proactives, Remote Help, rapports et dépannage.
tags: [intune, conformité, accès conditionnel, applications win32, laps, mises à jour, autopatch]
icon: shield-check
---

## Configuration

| Outil | Usage |
| --- | --- |
| **Catalogue de paramètres** | Méthode principale : des milliers de paramètres Windows, Edge, Office, macOS |
| Modèles (*Templates*) | Wi-Fi, VPN, certificats (SCEP/PKCS), restrictions, kiosque |
| **Analyse de stratégie de groupe** | Importer les GPO existantes, voir ce qui est pris en charge par le MDM, migrer |
| **Bases de référence de sécurité** | Réglages recommandés par Microsoft (Windows, Edge, Defender for Endpoint, Microsoft 365) |
| Fichiers ADMX importés | Applications tierces gérées par ADMX |

## Sécurité des points de terminaison

| Stratégie | Contenu |
| --- | --- |
| Antivirus | [[09-defender/01-antivirus-configuration\|Defender]] : protection en temps réel, cloud, exclusions, protection contre la falsification |
| Pare-feu | Profils, règles (y compris migrées des GPO) |
| **Chiffrement de disque** | [[11-bitlocker/01-presentation-activation\|BitLocker]] (clés dans Entra ID), FileVault (macOS) |
| **Windows LAPS** | Mot de passe unique et tournant du compte administrateur local, stocké dans Entra ID ou AD |
| Réduction de la surface d'attaque | Règles ASR, contrôle d'applications, protection contre les exploits |
| Protection de compte | Windows Hello Entreprise, Credential Guard |
| EDR | Intégration de Defender for Endpoint |

## Conformité et accès conditionnel

Les **stratégies de conformité** définissent un appareil « sain » : système à jour, BitLocker actif, antivirus actif, pas de jailbreak, niveau de risque Defender acceptable. L'**accès conditionnel** d'Entra ID n'autorise l'accès à Microsoft 365 et aux applications qu'aux appareils **conformes** (ou joints hybrides), avec MFA.

| Étape | Recommandation |
| --- | --- |
| 1 | Stratégies de conformité en mode rapport, période de grâce |
| 2 | Accès conditionnel en **mode rapport uniquement**, analyse des impacts |
| 3 | Activation progressive par groupes, comptes de secours exclus |

## Applications

| Type | Usage |
| --- | --- |
| **Win32** (`.intunewin`) | Tout installateur EXE/MSI/script, avec règles de **détection**, conditions, **dépendances**, **remplacement** de versions |
| Microsoft 365 Apps | Suite Office (canaux, langues) |
| Microsoft Store (nouveau) | Applications du Store gérées |
| LOB, VPP (Apple), Google Play géré | Applications mobiles |
| Protection des applications (MAM) | Données professionnelles dans les applications mobiles (BYOD) : copier-coller, sauvegarde, code PIN |

```powershell
# Empaqueter une application Win32 (outil Microsoft Win32 Content Prep Tool)
IntuneWinAppUtil.exe -c C:\Paquets\LogicielMetier -s setup.exe -o C:\Paquets\Sortie
# Commande d'installation dans Intune : setup.exe /S   — désinstallation : "C:\Program Files\Logiciel\uninstall.exe" /S
# Détection : clé de registre, fichier avec version, ou code MSI
```

Affectation **Obligatoire** (installée automatiquement) ou **Disponible** (Portail d'entreprise, libre-service).

## Mises à jour

- **Anneaux de mises à jour Windows** (Windows Update for Business) : pilote (0 jour), large (7 jours), production (14 jours), échéances et redémarrages.
- Stratégies de **mises à jour de fonctionnalités** (version cible de Windows), de **pilotes**, mises à jour **accélérées** pour un correctif critique.
- **Windows Autopatch** : service qui orchestre automatiquement les anneaux pour Windows, Microsoft 365 Apps, Edge et Teams.
- Remplace [[04-wsus/01-presentation-installation|WSUS]] pour les postes gérés par Intune.

## Scripts et corrections

- **Scripts de plateforme** PowerShell (exécution unique) et scripts shell macOS.
- **Corrections** (*Remediations*, licence Windows Enterprise E3/E5) : un script de **détection** et un script de **correction** exécutés périodiquement (ex. service arrêté redémarré, cache nettoyé, paramètre rétabli).

## Dépannage

| Symptôme | Outil / piste |
| --- | --- |
| Stratégie non appliquée | Portail : état par appareil et par paramètre ; poste : *Paramètres → Comptes → Accès professionnel → Info → Synchroniser*, rapport `mdmdiagnosticstool.exe -out C:\Temp\diag` |
| Application Win32 en échec | Journal `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs\IntuneManagementExtension.log` (outil CMTrace), règle de détection |
| Appareil non conforme | Détail de conformité par paramètre, délai d'évaluation |
| Autopilot bloqué sur l'ESP | Applications obligatoires en échec, délai ESP ; journaux `mdmdiagnosticstool -area Autopilot` |
| iOS ne s'inscrit plus | Certificat **APNs expiré** ou renouvelé avec un autre identifiant Apple |

Assistance aux utilisateurs : **Remote Help** (prise en main intégrée à Intune et authentifiée par Entra ID), en alternative à [[01-anydesk-teamviewer|AnyDesk/TeamViewer]].
