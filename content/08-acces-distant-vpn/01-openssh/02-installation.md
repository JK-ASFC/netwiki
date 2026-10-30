---
title: Installation (Linux, Windows, macOS)
description: Installer et activer le serveur OpenSSH sous Debian/Ubuntu (activation par socket), RHEL (SELinux, port non standard), Windows Server et Windows 10/11 (capacité OpenSSH.Server, shell par défaut, clés des administrateurs), macOS (session à distance), pare-feu et premières vérifications.
tags: [openssh, installation, linux, windows, macos, sshd]
icon: download
---

## Debian / Ubuntu

```bash
sudo apt update && sudo apt install openssh-server
systemctl status ssh
sudo ss -tlnp | grep ':22'
```

> [!NOTE]
> **Ubuntu 22.10+** active `sshd` par **socket systemd** (`ssh.socket`) : le port d'écoute est alors porté par le socket. Depuis 24.04, un générateur lit `Port`/`ListenAddress` de `sshd_config`, mais il faut recharger systemd après modification :
> ```bash
> sudo systemctl daemon-reload && sudo systemctl restart ssh.socket
> ```
> Pour revenir au service classique : `sudo systemctl disable --now ssh.socket && sudo systemctl enable --now ssh.service`.

## RHEL / Rocky / Alma

```bash
sudo dnf install openssh-server
sudo systemctl enable --now sshd
sudo firewall-cmd --permanent --add-service=ssh && sudo firewall-cmd --reload

# Port non standard : SELinux + pare-feu
sudo semanage port -a -t ssh_port_t -p tcp 2222
sudo firewall-cmd --permanent --add-port=2222/tcp && sudo firewall-cmd --reload
```

La politique cryptographique système (`update-crypto-policies --show` : DEFAULT, FUTURE, FIPS) s'applique à OpenSSH sur RHEL : elle définit les algorithmes autorisés (fichier `/etc/crypto-policies/back-ends/openssh*.config`).

## Fichiers (Linux)

| Élément | Emplacement |
| --- | --- |
| Configuration serveur | `/etc/ssh/sshd_config` + `/etc/ssh/sshd_config.d/*.conf` |
| Clés d'hôte | `/etc/ssh/ssh_host_{ed25519,ecdsa,rsa}_key{,.pub}` |
| Configuration client | `/etc/ssh/ssh_config`, `~/.ssh/config` |
| Journaux | `journalctl -u ssh` (Debian), `-u sshd` (RHEL), `/var/log/auth.log` / `/var/log/secure` |
| Service | `ssh` (Debian/Ubuntu), `sshd` (RHEL) |

> [!WARNING]
> Après le **clonage** d'une VM ou d'un modèle, régénérez les clés d'hôte : sinon tous les clones ont la même identité.
> ```bash
> sudo rm /etc/ssh/ssh_host_* && sudo ssh-keygen -A && sudo systemctl restart ssh
> ```

## Windows Server et Windows 10/11

OpenSSH est une **capacité Windows** (installée mais désactivée par défaut sur Windows Server 2025).

```powershell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic
Get-NetFirewallRule -Name OpenSSH-Server-In-TCP | Select-Object Name, Enabled, Profile
```

Sans accès à Windows Update (serveur isolé) : installer le MSI **Win32-OpenSSH** publié sur GitHub (`PowerShell/Win32-OpenSSH`), qui suit aussi les versions plus récentes.

### Fichiers Windows

| Élément | Emplacement |
| --- | --- |
| Configuration | `C:\ProgramData\ssh\sshd_config` |
| Clés d'hôte | `C:\ProgramData\ssh\ssh_host_*` |
| Clés des **administrateurs** | `C:\ProgramData\ssh\administrators_authorized_keys` |
| Clés des autres utilisateurs | `C:\Users\<user>\.ssh\authorized_keys` |
| Binaires | `C:\Windows\System32\OpenSSH\` |
| Journaux | Observateur d'événements → *Applications et services → OpenSSH → Operational* |

### Clés des comptes administrateurs

Par défaut, `sshd_config` sous Windows contient :

```sshconfig
Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

```powershell
# Déposer la clé et appliquer les ACL exigées (sinon la clé est ignorée)
Add-Content -Path C:\ProgramData\ssh\administrators_authorized_keys -Value "ssh-ed25519 AAAAC3Nza… alice@poste"
icacls.exe C:\ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

### Shell par défaut

```powershell
# PowerShell 7 comme shell SSH (sinon cmd.exe)
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Program Files\PowerShell\7\pwsh.exe" -PropertyType String -Force
```

### Comptes de domaine

Connexion avec un compte Active Directory : `ssh CORP\\alice@srv01.corp.exemple.fr` ou `ssh alice@corp.exemple.fr@srv01`. L'authentification Kerberos (GSSAPI) n'est pas activée par défaut côté serveur Windows ; les clés publiques et les mots de passe fonctionnent.

### PowerShell à distance sur SSH

```powershell
# Sur le serveur, dans sshd_config :
#   Subsystem powershell c:/progra~1/powershell/7/pwsh.exe -sshs -nologo
Restart-Service sshd
# Depuis un client (Windows, Linux ou macOS avec PowerShell 7)
Enter-PSSession -HostName srv01.corp.exemple.fr -UserName CORP\alice
Invoke-Command -HostName srv01, srv02 -UserName CORP\alice -ScriptBlock { Get-Service sshd }
```

## macOS

```bash
# Interface : Réglages Système → Général → Partage → Session à distance
sudo systemsetup -setremotelogin on
sudo systemsetup -getremotelogin
# Restreindre aux membres d'un groupe (com.apple.access_ssh) depuis l'interface ou :
sudo dseditgroup -o edit -a alice -t user com.apple.access_ssh
```

Configuration : `/etc/ssh/sshd_config` et `/etc/ssh/sshd_config.d/` (les mises à jour de macOS peuvent réécrire le fichier principal : placez vos réglages dans un fichier du dossier `.d`).

## Équipements réseau

Les commutateurs, routeurs et pare-feu embarquent leur propre serveur SSH. Exemple Cisco IOS :

```cisco
hostname sw-core-01
ip domain name corp.exemple.fr
crypto key generate rsa modulus 3072
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3
ip ssh server algorithm encryption aes256-gcm aes128-gcm aes256-ctr
line vty 0 15
 transport input ssh
 login authentication ADMIN
 access-class ACL-ADMIN in
```

Authentification centralisée des administrateurs : voir [[01-freeradius/09-administration-equipements|RADIUS pour les équipements]].

## Vérifications

```bash
sudo sshd -t                         # syntaxe
sudo sshd -T | grep -Ei 'port|permitrootlogin|passwordauthentication|pubkey'   # configuration effective
ssh -v utilisateur@serveur           # côté client : algorithmes négociés, méthodes proposées
ssh-keyscan -t ed25519 serveur | ssh-keygen -lf -     # empreinte de la clé d'hôte (à comparer avec celle affichée au premier accès)
```

```powershell
& "$env:WINDIR\System32\OpenSSH\sshd.exe" -T | Select-String "port|passwordauthentication"
```
