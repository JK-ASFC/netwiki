---
title: Conteneurs Windows — aide-mémoire des commandes
description: Commandes des conteneurs Windows avec exemples — installation de la fonctionnalité et du moteur (Docker CE, Mirantis, containerd), images de base (Nano Server, Server Core, Windows Server), isolation processus et Hyper-V, réseaux HNS (nat, transparent, l2bridge), gMSA (credential spec), volumes, journaux, diagnostic (Get-HnsNetwork, hcsdiag), nœuds Windows dans Kubernetes.
tags: [aide-mémoire, conteneurs windows, docker, hns, gmsa, server core]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|conteneurs Windows]].

## Installation

```powershell
Install-WindowsFeature Containers -Restart
# Docker CE (script officiel de Microsoft)
Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/microsoft/Windows-Containers/Main/helpful_tools/Install-DockerCE/install-docker-ce.ps1" -OutFile install-docker-ce.ps1
.\install-docker-ce.ps1
docker version
docker info | Select-String "Isolation|Operating System"
```

## Images et conteneurs

```powershell
docker pull mcr.microsoft.com/windows/servercore:ltsc2022
docker pull mcr.microsoft.com/windows/nanoserver:ltsc2022
docker run -it --rm mcr.microsoft.com/windows/servercore:ltsc2022 cmd
docker run -d --name iis -p 8080:80 mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2022
docker run -d --isolation=hyperv --name test mcr.microsoft.com/windows/servercore:ltsc2019     # version d'image différente de l'hôte
docker exec -it iis powershell
docker logs iis
docker inspect iis --format "{{.HostConfig.Isolation}}"
```

```dockerfile
# escape=`
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2022
WORKDIR /inetpub/wwwroot
COPY publish/ .
SHELL ["powershell", "-Command"]
RUN Set-WebConfigurationProperty -PSPath 'IIS:\' -Filter system.webServer/directoryBrowse -Name enabled -Value $false
```

## Réseaux (HNS)

```powershell
docker network ls
docker network create -d transparent --subnet=10.0.30.0/24 --gateway=10.0.30.1 -o com.docker.network.windowsshim.interface="Ethernet 2" transparent-lan
docker run -d --network transparent-lan --ip 10.0.30.50 --name web2 mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2022
Import-Module HostNetworkingService      # module HNS (dépôt Windows-Containers)
Get-HnsNetwork | Select-Object Name, Type, Subnets
Get-HnsEndpoint | Select-Object Name, IPAddress
```

## gMSA (authentification Active Directory)

```powershell
Install-Module CredentialSpec
New-CredentialSpec -AccountName gmsa-app             # crée le fichier dans C:\ProgramData\docker\credentialspecs
Get-CredentialSpec
docker run -d --security-opt "credentialspec=file://gmsa-app.json" --hostname gmsa-app --name app registre.exemple.fr/app-windows:1.0
docker exec app nltest /sc_verify:corp.exemple.fr
```

## Diagnostic

```powershell
hcsdiag list                       # conteneurs et VM utilitaires gérés par le Host Compute Service
Get-WinEvent -LogName "Microsoft-Windows-Hyper-V-Compute-Operational" -MaxEvents 20
docker system df
docker system prune -a -f
```
