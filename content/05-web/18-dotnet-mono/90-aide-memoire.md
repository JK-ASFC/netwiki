---
title: .NET et Mono — aide-mémoire des commandes
description: Commandes dotnet avec exemples — --info, --list-sdks, --list-runtimes, new (list, webapi, console, worker, sln), add package/reference, restore, build, run, watch, test, publish (-r, --self-contained, PublishSingleFile, PublishTrimmed), tool install, nuget locals, dev-certs, ef migrations, global.json ; commandes Mono.
tags: [aide-mémoire, dotnet, .net, mono, nuget]
icon: terminal
---

Explications : [[01-dotnet|.NET]] · [[02-mono|Mono]].

## dotnet

```bash
dotnet --info ; dotnet --list-sdks ; dotnet --list-runtimes
dotnet new list ; dotnet new worker -n Collecteur ; dotnet new sln -n Infra ; dotnet sln add Collecteur
dotnet add package Serilog.AspNetCore ; dotnet add reference ../Commun/Commun.csproj ; dotnet list package --vulnerable
dotnet restore ; dotnet build -c Release ; dotnet run --project Collecteur ; dotnet watch run
dotnet test --logger trx ; dotnet test --collect:"XPlat Code Coverage"
dotnet publish -c Release -r win-x64 --self-contained -p:PublishSingleFile=true
dotnet publish -c Release -r linux-arm64 --self-contained -p:PublishTrimmed=true
dotnet tool install -g dotnet-ef ; dotnet ef migrations add Initiale ; dotnet ef database update
dotnet nuget locals all --clear ; dotnet nuget add source https://nuget.corp.exemple.fr/v3/index.json -n interne
dotnet new globaljson --sdk-version 8.0.100     # figer le SDK d'un dépôt
dotnet dev-certs https --clean ; dotnet dev-certs https --trust
```

## Mono

```bash
mono --version ; mono app.exe ; mcs -out:app.exe *.cs ; msbuild App.sln ; sudo cert-sync /etc/ssl/certs/ca-certificates.crt
```

## Installation

```bash
sudo apt install dotnet-sdk-8.0                      # Ubuntu 22.04+ (dépôts Ubuntu)
# Debian 12 : dépôt Microsoft
wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb && sudo apt update && sudo apt install dotnet-sdk-8.0
sudo dnf install dotnet-sdk-8.0                      # RHEL / Rocky / Alma
sudo apt install aspnetcore-runtime-8.0              # serveur : runtime seul
brew install --cask dotnet-sdk                       # macOS
winget install Microsoft.DotNet.SDK.8                # Windows
export DOTNET_CLI_TELEMETRY_OPTOUT=1                 # désactiver la télémétrie de la CLI
```

## Service systemd (ASP.NET Core derrière Nginx)

```ini /etc/systemd/system/portail.service
[Unit]
Description=Portail ASP.NET Core
After=network-online.target

[Service]
User=portail
WorkingDirectory=/opt/portail
ExecStart=/usr/bin/dotnet /opt/portail/Portail.dll
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000
Environment=DOTNET_CLI_TELEMETRY_OPTOUT=1
Restart=on-failure
KillSignal=SIGINT

[Install]
WantedBy=multi-user.target
```

## Diagnostic en production

```bash
dotnet tool install -g dotnet-counters
dotnet tool install -g dotnet-trace
dotnet tool install -g dotnet-dump
dotnet-counters ps
dotnet-counters monitor -p 12345 --counters System.Runtime,Microsoft.AspNetCore.Hosting
dotnet-trace collect -p 12345 --duration 00:00:30 -o /tmp/portail.nettrace
dotnet-dump collect -p 12345 -o /tmp/portail.dmp
dotnet-dump analyze /tmp/portail.dmp                 # puis : clrstack, dumpheap -stat, threads
```

Sous IIS, installez le **Hosting Bundle** ASP.NET Core sur le serveur (module ANCM) et réglez le pool d'applications sur « Aucun code managé ».
