---
title: OpenSSH — aide-mémoire des commandes
description: Commandes OpenSSH avec exemples — connexion (options -p, -i, -J, -v), clés (ssh-keygen ed25519, FIDO2, empreintes, known_hosts), agent (ssh-agent, ssh-add), copie (scp, sftp, rsync), tunnels (-L, -R, -D), multiplexage, fichier ~/.ssh/config, serveur sshd (sshd -t, -T, durcissement), certificats SSH, journaux et dépannage, OpenSSH sous Windows.
tags: [aide-mémoire, openssh, ssh, ssh-keygen, tunnel, scp, sftp]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|OpenSSH]].

## Connexion

```bash
ssh amartin@srv-web01.exemple.fr
ssh -p 2222 amartin@srv-web01
ssh -i ~/.ssh/id_ed25519_admin amartin@srv-web01
ssh -J bastion.exemple.fr amartin@10.0.30.10            # rebond par un bastion
ssh -v amartin@srv-web01                                 # débogage (-vvv pour plus)
ssh amartin@srv-web01 'uptime; df -h /'                 # commande à distance
ssh -t amartin@srv-web01 sudo systemctl restart nginx   # avec terminal (sudo)
ssh -o StrictHostKeyChecking=accept-new amartin@nouveau-serveur
```

## Clés

```bash
ssh-keygen -t ed25519 -a 100 -C "amartin@poste-admin"
ssh-keygen -t ed25519-sk -O resident -C "amartin cle FIDO2"     # clé matérielle (YubiKey…)
ssh-copy-id -i ~/.ssh/id_ed25519.pub amartin@srv-web01
ssh-keygen -lf ~/.ssh/id_ed25519.pub                             # empreinte
ssh-keygen -p -f ~/.ssh/id_ed25519                               # changer la phrase de passe
ssh-keygen -R srv-web01                                          # oublier une ancienne clé d'hôte
ssh-keyscan -t ed25519 srv-web01 >> ~/.ssh/known_hosts
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub                 # empreinte du serveur (à comparer)
```

## Agent

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-add -t 4h ~/.ssh/id_ed25519      # durée de vie limitée
ssh-add -l
ssh-add -D
ssh -A bastion                       # transfert d'agent : à éviter, préférer -J
```

## Copie de fichiers

```bash
scp fichier.tar.gz amartin@srv-web01:/tmp/
scp -r amartin@srv-web01:/var/log/nginx ./journaux/
sftp amartin@srv-web01                      # get, put, ls, cd, lcd, mkdir, bye
rsync -avz --progress -e "ssh -p 2222" ./site/ amartin@srv-web01:/var/www/site/
rsync -avz --delete --dry-run ./site/ amartin@srv-web01:/var/www/site/       # simulation
```

## Tunnels

```bash
ssh -L 5433:db.interne:5432 amartin@bastion        # local : localhost:5433 → db.interne:5432
ssh -R 8080:localhost:3000 amartin@serveur          # distant : serveur:8080 → poste:3000
ssh -D 1080 -N -f amartin@bastion                   # proxy SOCKS dynamique
ssh -N -L 3389:pc-distant:3389 amartin@bastion      # RDP à travers SSH
```

## ~/.ssh/config

```sshconfig
Host bastion
    HostName bastion.exemple.fr
    User amartin
    IdentityFile ~/.ssh/id_ed25519

Host srv-*
    User amartin
    ProxyJump bastion
    ControlMaster auto
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m
    ServerAliveInterval 30
```

## Serveur sshd

```bash
sudo sshd -t                                    # tester la configuration
sudo sshd -T | grep -Ei "passwordauthentication|permitrootlogin|kexalgorithms"   # configuration effective
sudo sshd -T -C user=amartin,host=poste,addr=10.0.99.5   # effective pour une connexion donnée (Match)
sudo systemctl reload ssh                        # RHEL : sshd
```

```sshconfig
# /etc/ssh/sshd_config.d/10-durcissement.conf
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowGroups ssh-admins
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
AllowTcpForwarding no
ClientAliveInterval 300
Match Group ssh-admins Address 10.0.99.0/24
    AllowTcpForwarding yes
```

## Certificats SSH

```bash
ssh-keygen -t ed25519 -f ac_utilisateurs                          # autorité
ssh-keygen -s ac_utilisateurs -I amartin -n amartin,admin -V +8h ~/.ssh/id_ed25519.pub     # signer pour 8 h
ssh-keygen -L -f ~/.ssh/id_ed25519-cert.pub                        # afficher le certificat
# Serveur : TrustedUserCAKeys /etc/ssh/ac_utilisateurs.pub
```

## Journaux

```bash
sudo journalctl -u ssh -f
sudo grep "Failed password\|Invalid user" /var/log/auth.log | tail
last -a | head
who
```

## Windows

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
Set-Service sshd -StartupType Automatic; Start-Service sshd
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Program Files\PowerShell\7\pwsh.exe" -PropertyType String -Force
# Clés des administrateurs : C:\ProgramData\ssh\administrators_authorized_keys (droits : Administrateurs et SYSTEM)
icacls C:\ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "*S-1-5-32-544:F" /grant "SYSTEM:F"
ssh amartin@srv-win01
```
