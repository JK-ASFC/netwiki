---
title: WinSCP
description: WinSCP, client SFTP, SCP, FTP(S), WebDAV et S3 pour Windows — installation et déploiement (MSI, winget, configuration INI ou registre), sites enregistrés et dossiers, authentification par clé, synchronisation et comparaison de répertoires, édition à distance, scripts et interface .NET/PowerShell pour l'automatisation des transferts, journaux, sécurité (vérification des clés d'hôte, mots de passe enregistrés, mot de passe maître) et dépannage.
tags: [winscp, sftp, scp, ftps, s3, automatisation, powershell, windows]
icon: folder-sync
---

**WinSCP** (GPL) est le client graphique de transfert de fichiers de référence sous Windows : **SFTP**, SCP, FTP/FTPS, **WebDAV** et **S3**. Au-delà de l'interface, son **mode script** et son **assemblage .NET** en font un outil d'automatisation des échanges de fichiers (flux avec des partenaires, sauvegardes de configurations, dépôts).

## Installation

```powershell
winget install WinSCP.WinSCP
# Déploiement silencieux
WinSCP-6.5-Setup.exe /VERYSILENT /ALLUSERS /NORESTART
```

La configuration (sites, préférences) est stockée dans le registre ou dans un fichier **`WinSCP.ini`** (mode portable, déploiement d'une configuration commune) ; les paramètres peuvent être imposés par l'administrateur (*Preferences → Storage*, et clés `HKLM\Software\Martin Prikryl\WinSCP 2` pour des valeurs par défaut).

## Utilisation

| Fonction | Usage |
| --- | --- |
| Sites enregistrés | Hôte, protocole, utilisateur, **clé privée** (`.ppk` ou OpenSSH), répertoires par défaut, options de proxy et de tunnel SSH |
| Interface Commander / Explorer | Deux panneaux (local / distant) ou explorateur |
| **Synchroniser** | Comparer et synchroniser des répertoires (aperçu avant exécution) |
| Éditer | Ouvrir un fichier distant dans l'éditeur local, renvoyé à l'enregistrement |
| Ouvrir dans PuTTY | Session SSH sur le même hôte |

## Automatisation

```text Script WinSCP (winscp.com /script=envoi.txt /log=envoi.log)
open sftp://depot@sftp.partenaire.fr/ -privatekey="C:\Cles\depot.ppk" -hostkey="ssh-ed25519 255 Qk1N…empreinte…"
cd /entrant
put -transfer=binary -preservetime "D:\Echanges\Sortants\*.csv"
close
exit
```

```powershell
# Assemblage .NET (WinSCPnet.dll) depuis PowerShell
Add-Type -Path "C:\Program Files (x86)\WinSCP\WinSCPnet.dll"
$options = New-Object WinSCP.SessionOptions -Property @{
  Protocol = [WinSCP.Protocol]::Sftp; HostName = "sftp.partenaire.fr"; UserName = "depot"
  SshPrivateKeyPath = "C:\Cles\depot.ppk"; SshHostKeyFingerprint = "ssh-ed25519 255 Qk1N…empreinte…"
}
$session = New-Object WinSCP.Session
try {
  $session.SessionLogPath = "D:\Echanges\Journaux\sftp-$(Get-Date -Format yyyyMMdd).log"
  $session.Open($options)
  $resultat = $session.PutFiles("D:\Echanges\Sortants\*.csv", "/entrant/", $true)   # $true = supprimer après envoi
  $resultat.Check()
  foreach ($t in $resultat.Transfers) { Write-Output "Envoyé : $($t.FileName)" }
} finally { $session.Dispose() }
```

L'interface génère elle-même le code (*Session → Generate Session URL/Code*) pour un site enregistré, avec l'empreinte de la clé d'hôte.

## Sécurité

- [ ] **Vérifier l'empreinte** de la clé d'hôte (et la figer dans les scripts avec `-hostkey`) : jamais `-hostkey=*` en production
- [ ] Mots de passe enregistrés protégés par un **mot de passe maître**, ou mieux : clés SSH, sans mot de passe enregistré
- [ ] Comptes de transfert dédiés côté serveur, chroot SFTP ([[01-openssh/06-sftp-chroot|SFTP chrooté]])
- [ ] FTP en clair proscrit ; FTPS ou SFTP
- [ ] Version à jour (correctifs de sécurité réguliers des bibliothèques SSH/TLS)

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `Host key does not match` | Serveur réinstallé ou attaque | Vérifier l'empreinte auprès de l'administrateur avant de l'accepter |
| `Authentication failed` avec une clé | Format, droits côté serveur, utilisateur | Journal WinSCP (niveau Debug), `authorized_keys`, format OpenSSH/PPK |
| Script bloqué en attente | Question interactive (clé d'hôte, écrasement) | `/ini=nul`, option `batch abort`, `-hostkey` |
| Transferts corrompus (texte) | Mode texte/binaire | `-transfer=binary` |
