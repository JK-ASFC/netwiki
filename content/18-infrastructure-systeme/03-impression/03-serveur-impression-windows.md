---
title: Serveur d'impression Windows
description: Rôle Services d'impression et de numérisation de document sous Windows Server — installation, console Gestion de l'impression et cmdlets PrintManagement (pilotes de type 3 et 4, ports TCP/IP, files, partage), déploiement des imprimantes par GPO, sécurité du spouleur après PrintNightmare (Point and Print, RPC, désactivation sur les contrôleurs de domaine), migration avec printbrm, Universal Print, journaux et problèmes fréquents.
tags: [windows server, impression, print server, printnightmare, point and print, gpo, spouleur, printbrm]
icon: printer
---

Le rôle **Services d'impression et de numérisation de document** (fonctionnalité `Print-Server`) centralise les files d'impression d'un parc Windows : pilotes distribués automatiquement aux postes (*Point and Print*), files publiées dans AD, déploiement par GPO et journalisation des travaux.

## Installation

```powershell
Install-WindowsFeature Print-Server -IncludeManagementTools
Get-Service Spooler
# Console : printmanagement.msc
```

## Pilotes, ports et files

| Pilote | Caractéristiques |
| --- | --- |
| **Type 4** (v4) | Modèle moderne : pas de pilote côté serveur à distribuer aux clients (pilote de classe + extensions du constructeur via Windows Update) ; recommandé quand disponible |
| **Type 3** (v3) | Modèle classique : le pilote est téléchargé depuis le serveur par les clients ; nécessite des paquets **signés** et compatibles x64 (et ARM64 si besoin) |
| Pilote universel constructeur | Un pilote pour toute une gamme (HP UPD, Xerox Global, Canon Generic) : moins de pilotes à maintenir |
| Microsoft IPP Class Driver | Impression sans pilote vers les imprimantes IPP |

```powershell
# Pilote (le paquet doit être présent dans le magasin de pilotes : pnputil /add-driver …\*.inf /install)
Add-PrinterDriver -Name "HP Universal Printing PCL 6"

# Port TCP/IP standard (RAW 9100) ; LPR ou IPP selon l'imprimante
Add-PrinterPort -Name "IP_10.0.50.11" -PrinterHostAddress "10.0.50.11" -PortNumber 9100

# File partagée et publiée dans AD
Add-Printer -Name "IMP-RDC-01" -DriverName "HP Universal Printing PCL 6" -PortName "IP_10.0.50.11" `
  -Shared -ShareName "IMP-RDC-01" -Published -Location "Paris/RDC/Bureau 12" -Comment "Multifonction RDC"

Set-PrintConfiguration -PrinterName "IMP-RDC-01" -DuplexingMode TwoSidedLongEdge -Color $false -PaperSize A4
Get-Printer | Format-Table Name, DriverName, PortName, Shared, Published
Get-PrintJob -PrinterName "IMP-RDC-01"
```

Décochez **« État SNMP activé »** dans les propriétés du port si les imprimantes n'ont pas SNMP ouvert : sinon la file peut apparaître hors ligne.

## Déploiement aux postes

| Méthode | Remarque |
| --- | --- |
| **GPO Préférences** (*Configuration utilisateur → Préférences → Paramètres du Panneau de configuration → Imprimantes*) | Ajout/remplacement par groupe, site ou ordinateur (ciblage au niveau de l'élément) ; imprimante par défaut |
| GPO « Imprimantes déployées » (console Gestion de l'impression) | Plus ancienne, moins flexible |
| Script / Intune | `Add-Printer -ConnectionName \\srv-impr-01\IMP-RDC-01` |

## Sécurité : après PrintNightmare

> [!WARNING]
> **PrintNightmare** (CVE-2021-34527 et suivantes) a montré que le spouleur permettait à un utilisateur du domaine d'**exécuter du code en SYSTEM** via l'installation de pilotes. Les correctifs ont durci Point and Print : par défaut, seuls les **administrateurs** peuvent installer des pilotes (`RestrictDriverInstallationToAdministrators = 1`).

- [ ] **Désactiver le spouleur** sur les contrôleurs de domaine et tous les serveurs qui n'impriment pas : `Stop-Service Spooler; Set-Service Spooler -StartupType Disabled`
- [ ] Laisser `RestrictDriverInstallationToAdministrators` à 1 ; **préinstaller** les pilotes sur les postes (image, Intune, SCCM) ou utiliser des pilotes type 4 / IPP
- [ ] GPO *Restrictions Point and Print* : liste de serveurs approuvés, avertissement et élévation conservés
- [ ] *Paquet Point and Print — Serveurs approuvés* activé avec la liste des serveurs d'impression
- [ ] RPC chiffré : *Configurer les paramètres de connexion RPC* (RPC sur TCP, authentification) — défaut des versions récentes
- [ ] Windows 11 24H2 et versions ultérieures : **mode d'impression protégée Windows** (*Windows Protected Print*), qui n'accepte que l'impression sans pilote tiers
- [ ] Imprimantes dans un VLAN dédié, joignables seulement par le serveur d'impression

## Migration et sauvegarde

```powershell
# Exporter files, ports, pilotes et partages (outil printbrm)
C:\Windows\System32\spool\tools\PrintBrm.exe -B -S \\srv-impr-ancien -F C:\Migration\impression.printerExport
# Importer sur le nouveau serveur
C:\Windows\System32\spool\tools\PrintBrm.exe -R -S \\srv-impr-01 -F C:\Migration\impression.printerExport -P all
```

Conservez le même nom de serveur (alias DNS `impression.corp.exemple.fr` → nouveau serveur, avec `DisableStrictNameChecking` et SPN) pour éviter de redéployer les connexions des postes.

## Universal Print

**Universal Print** (Microsoft 365) remplace le serveur sur site par un service cloud : imprimantes compatibles natives ou **connecteur** sur site, postes joints à Entra ID, sans pilote (IPP). Pertinent pour les sites sans serveur ou les postes nomades.

## Journaux

| Journal | Contenu |
| --- | --- |
| `Microsoft-Windows-PrintService/Admin` | Erreurs du spouleur et des pilotes |
| `Microsoft-Windows-PrintService/Operational` | Chaque travail (événement **307** : utilisateur, poste, pages) — à activer |

```powershell
wevtutil sl Microsoft-Windows-PrintService/Operational /e:true
Get-WinEvent -LogName Microsoft-Windows-PrintService/Operational -MaxEvents 20 | Where-Object Id -eq 307
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Postes : « Voulez-vous faire confiance à cette imprimante ? » puis demande d'administrateur | Durcissement Point and Print | Préinstaller le pilote, pilotes type 4, serveurs approuvés |
| `0x0000011b` à la connexion | Durcissement RPC (correctif 2021) | Mettre à jour clients **et** serveur ; ne pas désactiver le durcissement |
| File « Hors connexion » alors que l'imprimante répond | État SNMP | Désactiver SNMP sur le port, vérifier la communauté |
| Spouleur qui plante | Pilote défectueux | Isolation des pilotes (*Isolation de pilote : isolé*), changer de pilote, `printbrm` pour nettoyer |
| Travaux bloqués | Fichier corrompu dans `C:\Windows\System32\spool\PRINTERS` | Arrêter le spouleur, vider le dossier, redémarrer |
| Imprimantes GPO non ajoutées | Ciblage, droits, Point and Print | `gpresult /h`, journal `Group Policy Printers` |
