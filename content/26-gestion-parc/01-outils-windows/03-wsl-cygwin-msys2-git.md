---
title: WSL, Cygwin, MSYS2 et Git for Windows
description: Outils Unix sous Windows — WSL 2 (MIT : vraie distribution Linux dans une machine virtuelle légère ; wsl --install, distributions, export et import, .wslconfig, wsl.conf, systemd, réseau en miroir, stratégies d'entreprise), Cygwin (couche POSIX et milliers de paquets, setup en ligne de commande), MSYS2 (pacman, environnements UCRT64 et CLANG64, compilation native MinGW) et Git for Windows (Git, Git Bash, Git Credential Manager, installation silencieuse, fins de ligne), comparaison et choix.
tags: [windows, wsl, cygwin, msys2, git for windows, linux, bash]
icon: terminal-square
---

| Outil | Principe | Usage type |
| --- | --- | --- |
| **WSL 2** | Noyau Linux réel dans une VM légère (Hyper-V) | Outils Linux complets, Docker, développement, scripts d'administration |
| **Cygwin** | Bibliothèque de compatibilité POSIX (`cygwin1.dll`) + paquets | Outils Unix et services (sshd, cron) sur des Windows sans virtualisation |
| **MSYS2** | Shell et `pacman` + chaînes MinGW | Compiler des programmes Windows **natifs** avec GCC ou Clang |
| **Git for Windows** | Git + Git Bash (basé sur MSYS2) | Git et un Bash minimal sur chaque poste |

## WSL

```powershell
wsl --install                       # active WSL et installe Ubuntu (redémarrage)
wsl --list --online ; wsl --install -d Debian
wsl -l -v                           # distributions et version (1 ou 2)
wsl -d Debian -u root               # ouvrir une distribution
wsl --update ; wsl --shutdown
wsl --export Debian D:\Sauvegardes\debian.tar
wsl --import DebianOutils D:\WSL\DebianOutils D:\Sauvegardes\debian.tar
wsl --unregister DebianOutils       # supprime la distribution et ses fichiers
```

Réglages globaux dans `%USERPROFILE%\.wslconfig` :

```ini
[wsl2]
memory=8GB
processors=4
networkingMode=mirrored     ; la distribution partage les adresses de Windows (VPN, IPv6)
dnsTunneling=true
autoProxy=true
```

Réglages par distribution dans `/etc/wsl.conf` :

```ini
[boot]
systemd=true
[automount]
options="metadata,umask=22,fmask=11"
[user]
default=jk
```

Les fichiers Windows sont dans `/mnt/c` (lents) : travailler dans le système de fichiers Linux (`~`), accessible depuis l'Explorateur par `\\wsl$\Debian`. En entreprise, Intune ou les stratégies de groupe permettent de bloquer WSL ou de limiter les distributions et l'accès réseau ; Microsoft Defender for Endpoint sait surveiller WSL.

## Cygwin

Télécharger `setup-x86_64.exe` sur cygwin.com ; installation scriptable :

```powershell
setup-x86_64.exe -q -s https://mirrors.kernel.org/sourceware/cygwin/ -R C:\cygwin64 -P openssh,rsync,curl,vim
```

Relancer `setup-x86_64.exe` pour ajouter ou mettre à jour des paquets. `cygcheck -c` liste les paquets installés ; `cygpath -w /home` convertit un chemin.

## MSYS2

`winget install --id MSYS2.MSYS2 -e`. Plusieurs environnements : **UCRT64** (recommandé, GCC + runtime moderne), CLANG64, MSYS (outils POSIX).

```bash
pacman -Syu                                   # mise à jour (relancer si demandé)
pacman -S mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-cmake make
pacman -Ss openssl ; pacman -Qe
```

Voir aussi [[01-gcc-clang/01-presentation-installation|GCC et Clang]].

## Git for Windows

`winget install --id Git.Git -e`, ou installation silencieuse de l'installateur : `Git-<version>-64-bit.exe /VERYSILENT /NORESTART`. Fournit `git`, **Git Bash** (avec `ssh`, `scp`, `grep`, `sed`, `awk`, `curl`) et **Git Credential Manager** (authentification GitLab, GitHub, Azure DevOps avec MFA).

```bash
git config --global core.autocrlf true        # CRLF dans le poste, LF dans le dépôt
git config --global credential.helper manager
git update-git-for-windows
```

Voir [[01-git/01-presentation-installation|Git]] pour l'usage. Commandes : [[90-aide-memoire|aide-mémoire]].
