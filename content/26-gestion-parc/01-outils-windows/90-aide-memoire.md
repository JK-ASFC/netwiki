---
title: Outils Windows — aide-mémoire
description: Commandes Windows Terminal (wt), WinGet (install, upgrade, export, import, pin, source), Chocolatey (install, upgrade, sources), Scoop, NSSM, WinSW, sc.exe, WSL (install, export, import, shutdown), Cygwin, MSYS2 (pacman), Git for Windows, OpenSSH Server (Add-WindowsCapability, sshd) et PowerToys.
tags: [aide-mémoire, windows, winget, chocolatey, scoop, nssm, winsw, wsl, openssh]
icon: terminal
---

Explications : [[01-terminal-gestionnaires-paquets|Terminal et paquets]] · [[02-services-nssm-winsw|NSSM et WinSW]] · [[03-wsl-cygwin-msys2-git|WSL, Cygwin, MSYS2, Git]] · [[04-openssh-powertoys|OpenSSH et PowerToys]].

## Paquets et terminal

```powershell
wt -p "PowerShell" ; split-pane -p "Ubuntu"
winget install --id 7zip.7zip -e --silent --accept-package-agreements --accept-source-agreements
winget upgrade --all --silent ; winget export -o poste.json ; winget import -i poste.json ; winget pin add --id Mozilla.Firefox
choco install -y git 7zip ; choco upgrade all -y ; choco list ; choco source add -n=interne -s="https://nexus.corp.exemple.fr/repository/choco-group/"
scoop install git jq ; scoop bucket add extras ; scoop update * ; scoop cleanup *
```

## Services

```powershell
nssm install ApiInterne "C:\Program Files\nodejs\node.exe" "C:\Apps\api\server.js" ; nssm set ApiInterne AppDirectory C:\Apps\api ; nssm start ApiInterne
nssm remove ApiInterne confirm
.\api-interne.exe install ; .\api-interne.exe start          # WinSW 2 (exécutable renommé + XML)
winsw install api-interne.xml ; winsw status api-interne.xml  # WinSW 3
sc.exe query MonSvc ; sc.exe failure MonSvc reset= 86400 actions= restart/10000
```

## Unix sous Windows

```powershell
wsl --install ; wsl --install -d Debian ; wsl -l -v ; wsl --shutdown ; wsl --update
wsl --export Debian D:\debian.tar ; wsl --import DebianOutils D:\WSL\DebianOutils D:\debian.tar
setup-x86_64.exe -q -P openssh,rsync          # Cygwin
pacman -Syu ; pacman -S mingw-w64-ucrt-x86_64-gcc   # MSYS2
winget install --id Git.Git -e ; git update-git-for-windows
```

## OpenSSH et PowerToys

```powershell
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0 ; Start-Service sshd ; Set-Service sshd -StartupType Automatic
New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Program Files\PowerShell\7\pwsh.exe" -PropertyType String -Force
winget install --id Microsoft.PowerToys -e
```
