---
title: Présentation et installation
description: Conteneurs Windows sous Windows Server et Windows 11 — principe et différences avec les conteneurs Linux, isolation processus ou Hyper-V, images de base (Nano Server, Server Core, Server, Windows), compatibilité de version entre hôte et conteneur, moteurs (Docker CE par le script Microsoft, Mirantis Container Runtime, containerd et nerdctl, Docker Desktop), installation et premiers conteneurs, construction d'images (Dockerfile), cas d'usage et limites.
tags: [conteneurs windows, docker, windows server, nano server, server core, hyper-v, containerd]
icon: container
---

Les **conteneurs Windows** exécutent des applications Windows (IIS, ASP.NET Framework, services .NET, outils PowerShell) dans des environnements isolés, avec les mêmes outils et le même format d'image que les conteneurs Linux ([[01-docker/01-presentation-installation|Docker]]). Un conteneur Windows ne fonctionne que sur un **hôte Windows** (et inversement pour Linux, sauf via une VM).

## Isolation

| Mode | Fonctionnement | Usage |
| --- | --- | --- |
| **Processus** (*process isolation*) | Partage le noyau de l'hôte, comme sous Linux | Défaut sur Windows Server ; densité maximale ; versions hôte/image identiques |
| **Hyper-V** | Chaque conteneur dans une VM légère avec son propre noyau | Isolation plus forte (multi-locataires), tolère des versions d'image plus anciennes ; défaut sur Windows 11 |

## Images de base

| Image | Taille indicative | Contenu |
| --- | --- | --- |
| `mcr.microsoft.com/windows/nanoserver` | ~120 Mo | Minimal : .NET moderne, pas de PowerShell complet ni de .NET Framework |
| `mcr.microsoft.com/windows/servercore` | ~1,5–2 Go (compressée) | API Windows Server : .NET Framework, IIS, la plupart des applications |
| `mcr.microsoft.com/windows/server` | Plus grande | API Windows complètes (DirectX, certaines applications) |
| Images dérivées | — | `dotnet/framework/aspnet`, `dotnet/framework/sdk`, `powershell` |

Les étiquettes suivent la version de Windows : `ltsc2019`, `ltsc2022`, `ltsc2025`.

> [!IMPORTANT]
> En **isolation processus**, la version de l'image doit correspondre à celle de l'hôte (ex. image `ltsc2022` sur Windows Server 2022). Avec l'**isolation Hyper-V**, un hôte récent peut exécuter des images plus anciennes. Planifiez les montées de version de l'hôte avec la reconstruction des images.

## Installation (Windows Server)

```powershell
# Fonctionnalités nécessaires
Install-WindowsFeature -Name Containers, Hyper-V -IncludeManagementTools -Restart     # Hyper-V seulement pour l'isolation Hyper-V

# Docker CE (moteur Moby) avec le script maintenu par Microsoft
Invoke-WebRequest -UseBasicParsing "https://raw.githubusercontent.com/microsoft/Windows-Containers/Main/helpful_tools/Install-DockerCE/install-docker-ce.ps1" -OutFile install-docker-ce.ps1
.\install-docker-ce.ps1
docker version
docker info | Select-String "OSType|Isolation"
```

| Moteur | Remarques |
| --- | --- |
| **Docker CE** (Moby) | Script ci-dessus ; support communautaire |
| Mirantis Container Runtime | Version commerciale supportée (anciennement Docker EE) |
| **containerd** + nerdctl | Runtime de Kubernetes ; installation par script Microsoft (`Install-ContainerdRuntime`) |
| Docker Desktop (Windows 10/11) | Poste de développeur : basculer en *Windows containers* |

## Premiers conteneurs

```powershell
docker pull mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2022
docker run -d --name iis-test -p 8080:80 mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2022
docker ps
docker exec -it iis-test powershell
docker run --rm --isolation=hyperv mcr.microsoft.com/windows/nanoserver:ltsc2022 cmd /c ver
```

## Construire une image

```dockerfile Dockerfile (application ASP.NET Framework)
# escape=`
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2022
SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop';"]
WORKDIR /inetpub/wwwroot
COPY publication/ .
RUN Remove-Website -Name 'Default Web Site'; `
    New-Website -Name 'Appli' -Port 80 -PhysicalPath 'C:\inetpub\wwwroot' -ApplicationPool '.NET v4.5'
HEALTHCHECK CMD powershell -Command "try { (Invoke-WebRequest http://localhost/health -UseBasicParsing).StatusCode -eq 200 } catch { exit 1 }"
```

```powershell
docker build -t registre.corp.exemple.fr/appli:1.0 .
docker push registre.corp.exemple.fr/appli:1.0
```

La première ligne ``# escape=` `` (accent grave) évite les conflits entre la barre oblique inverse des chemins Windows et le caractère d'échappement par défaut.

## Cas d'usage et limites

| Bon usage | Limites |
| --- | --- |
| Moderniser des applications .NET Framework / IIS sans réécriture | Images volumineuses, démarrage plus lent que Linux |
| Environnements de build et de test Windows reproductibles | Pas d'interface graphique ni de RDP dans le conteneur |
| Nœuds Windows dans Kubernetes (applications mixtes) | Licences Windows Server de l'hôte (Datacenter pour la densité en isolation Hyper-V) |
| | Pas de conteneurs Windows sur un hôte Linux |

Suite : [[02-reseau-stockage-gmsa-kubernetes|réseau, stockage, gMSA et Kubernetes]].
