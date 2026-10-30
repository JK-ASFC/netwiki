---
title: OpenSSH sur Windows Server
description: Serveur et client OpenSSH intégrés à Windows — disponibilité (capacité facultative, préinstallé dans Windows Server 2025), installation et démarrage de sshd, fichiers de configuration (C:\ProgramData\ssh\sshd_config), clés autorisées des administrateurs (administrators_authorized_keys et ACL), authentification par mot de passe, clés et comptes AD, shell par défaut PowerShell, SFTP et SCP, PowerShell Remoting sur SSH, sécurité, journaux et dépannage.
tags: [openssh, windows server, sshd, powershell, clés ssh, sftp, active directory]
icon: terminal
---

Windows intègre **OpenSSH** (port Microsoft de la version portable d'OpenBSD) : client `ssh.exe` par défaut et **serveur** `sshd` installable. Il permet d'administrer des serveurs Windows avec les mêmes outils et clés que Linux, de transférer des fichiers en SFTP/SCP et de faire du **PowerShell à distance sur SSH** (PowerShell 7). Les principes généraux de SSH sont dans [[01-presentation|la présentation d'OpenSSH]] et le durcissement dans [[03-configuration-durcissement|configuration et durcissement]].

## Installation

```powershell
# Windows Server 2019/2022 et Windows 10/11 : capacité facultative
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
# Windows Server 2025 : sshd est présent, il suffit de l'activer
Set-Service sshd -StartupType Automatic
Start-Service sshd
Get-NetFirewallRule -Name *OpenSSH* | Format-Table Name, Enabled, Profile
# Limiter la règle créée au réseau d'administration
Set-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -RemoteAddress 10.0.99.0/24
```

Sur les serveurs sans accès Internet, la capacité s'installe depuis un **dépôt de fonctionnalités à la demande** (ISO *Features on Demand*, `-Source`) ; la version MSI du dépôt GitHub `PowerShell/Win32-OpenSSH` offre aussi des versions plus récentes.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| `C:\ProgramData\ssh\sshd_config` | Configuration du serveur |
| `C:\ProgramData\ssh\ssh_host_*_key` | Clés d'hôte (générées au premier démarrage) |
| `C:\ProgramData\ssh\administrators_authorized_keys` | Clés autorisées des membres du groupe **Administrateurs** |
| `%USERPROFILE%\.ssh\authorized_keys` | Clés autorisées des utilisateurs standards |
| `C:\ProgramData\ssh\logs\` | Journaux texte si `SyslogFacility LOCAL0` |

> [!IMPORTANT]
> Pour un compte **administrateur**, sshd **ignore** `%USERPROFILE%\.ssh\authorized_keys` et lit `administrators_authorized_keys` (bloc `Match Group administrators` de la configuration par défaut). Ce fichier doit appartenir à *Administrateurs*/*SYSTEM* avec des droits restreints, sinon il est ignoré.

```powershell
# Déposer une clé d'administration
Add-Content -Path C:\ProgramData\ssh\administrators_authorized_keys -Value "ssh-ed25519 AAAA… admin@poste-admin"
icacls.exe C:\ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "*S-1-5-32-544:F" /grant "SYSTEM:F"
```

## Configuration recommandée

```sshconfig C:\ProgramData\ssh\sshd_config (extraits)
Port 22
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
AllowGroups "corp\gg-admins-serveurs" administrators
# Shell par défaut : défini dans le registre (voir ci-dessous)
Subsystem sftp sftp-server.exe
# Sous-système PowerShell 7 pour le remoting sur SSH
Subsystem powershell c:/progra~1/powershell/7/pwsh.exe -sshs -nologo
SyslogFacility LOCAL0
LogLevel INFO

Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

```powershell
# PowerShell comme shell par défaut (au lieu de cmd.exe)
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Program Files\PowerShell\7\pwsh.exe" -PropertyType String -Force
Restart-Service sshd
sshd -t            # (depuis C:\Windows\System32\OpenSSH) test de la configuration
```

Les noms de groupes et d'utilisateurs dans `AllowGroups`/`AllowUsers` s'écrivent en **minuscules**, au format `domaine\groupe` (guillemets si espaces).

## Comptes Active Directory

```text
ssh corp\alice@srv-app-01.corp.exemple.fr
ssh alice@corp.exemple.fr@srv-app-01.corp.exemple.fr
```

L'authentification par **mot de passe** AD fonctionne ; l'authentification **Kerberos** (GSSAPI) est disponible côté client et serveur dans les versions récentes (`GSSAPIAuthentication yes`), avec un ticket obtenu à l'ouverture de session Windows. Avec un mot de passe, la session dispose des identifiants réseau (accès aux partages) ; avec une **clé**, la session n'a **pas** de jeton réseau (pas d'accès SMB sans nouvelle authentification).

## Transferts et PowerShell sur SSH

```powershell
scp .\script.ps1 admin@srv-app-01:C:/Scripts/
sftp admin@srv-app-01
# PowerShell 7 : session à distance sur SSH (Windows ↔ Linux possible)
Enter-PSSession -HostName srv-app-01 -UserName admin -SSHTransport
Invoke-Command -HostName srv-app-01, srv-lnx-01 -UserName admin -ScriptBlock { $PSVersionTable.OS }
```

Ansible peut aussi gérer Windows en SSH (`ansible_connection: ssh`, `ansible_shell_type: powershell`) — voir [[01-ansible/04-windows-awx-bonnes-pratiques|Ansible et Windows]].

## Sécurité

- [ ] Clés uniquement (`PasswordAuthentication no`) une fois les clés déployées ; clés Ed25519 protégées par phrase de passe ou matériel (FIDO2 `sk-ssh-ed25519` pris en charge)
- [ ] `AllowGroups` restreint, pare-feu limité au réseau d'administration / bastion ([[05-tunnels-bastion|bastion SSH]])
- [ ] Version à jour (correctifs OpenSSH : *regreSSHion* CVE-2024-6387 ne touchait pas Windows, mais d'autres correctifs s'appliquent) via Windows Update ou MSI
- [ ] Journaux envoyés au SIEM ; surveiller les ouvertures de session réseau
- [ ] Désactiver le service là où il n'est pas utilisé

## Journaux et dépannage

| Source | Contenu |
| --- | --- |
| *Journaux des applications et des services → OpenSSH/Operational* | Connexions, échecs d'authentification |
| `C:\ProgramData\ssh\logs\sshd.log` | Avec `SyslogFacility LOCAL0` |
| Débogage | Arrêter le service, lancer `sshd -d` dans une console administrateur |

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Clé refusée pour un administrateur | Clé dans `%USERPROFILE%\.ssh\authorized_keys` au lieu de `administrators_authorized_keys`, ACL trop larges | Bon fichier, `icacls` restrictif |
| `Permission denied` avec un compte AD | Format du nom, `AllowGroups` en majuscules | `domaine\utilisateur` en minuscules dans la configuration |
| Pas d'accès aux partages dans la session | Authentification par clé (pas de jeton réseau) | Mot de passe, Kerberos ou `-Credential` explicite |
| Le service ne démarre pas | Erreur de syntaxe, droits des clés d'hôte | `sshd -t`, journal OpenSSH/Operational, ACL de `C:\ProgramData\ssh` |
| Caractères accentués illisibles | Page de codes de la console | Shell PowerShell 7, `chcp 65001` |
