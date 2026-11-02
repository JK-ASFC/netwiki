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
