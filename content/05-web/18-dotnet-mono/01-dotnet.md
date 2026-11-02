---
title: .NET SDK et runtimes
description: .NET (anciennement .NET Core) — plate-forme libre et multiplate-forme de Microsoft : versions LTS et STS, SDK et runtimes (.NET, ASP.NET Core, Windows Desktop), installation Windows (winget, Visual Studio), Ubuntu (paquets de la distribution), Debian et RHEL (dépôt packages.microsoft.com ou paquets de la distribution), macOS, script dotnet-install, conteneurs, commandes dotnet (new, build, run, test, publish autonome ou dépendant du runtime), certificats de développement, hébergement d'une application ASP.NET Core avec Kestrel derrière NGINX et systemd ou sous IIS (Hosting Bundle).
tags: [dotnet, .net, asp.net core, kestrel, sdk, csharp, iis]
icon: info
---

**.NET** (MIT) exécute des applications C#, F# et VB.NET sur Windows, Linux et macOS. Une version sort chaque novembre : les versions **paires** sont **LTS** (3 ans de support), les impaires **STS** (24 mois). Le **SDK** sert à développer et construire ; en production, le **runtime** seul suffit (ou rien du tout pour une publication autonome).

| Composant | Rôle |
| --- | --- |
| **SDK** | Compilateurs, `dotnet new/build/publish`, modèles |
| Runtime .NET | Exécuter des applications console et services |
| **Runtime ASP.NET Core** | Exécuter des applications web (Kestrel) |
| Windows Desktop Runtime | WinForms et WPF (Windows uniquement) |
| **Hosting Bundle** | Runtime ASP.NET Core + module ASP.NET Core pour [[01-iis/01-presentation\|IIS]] |

## Installation

```bash
# Ubuntu 22.04+ : paquets fournis par Ubuntu
sudo apt update && sudo apt install dotnet-sdk-8.0          # ou aspnetcore-runtime-8.0 en production
# Debian : dépôt Microsoft
wget https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb && sudo apt update && sudo apt install dotnet-sdk-8.0
# RHEL/Rocky/Alma 8+ : paquets de la distribution
sudo dnf install dotnet-sdk-8.0
```

Les noms suivent la version (`dotnet-sdk-10.0`, `aspnetcore-runtime-10.0`…) selon ce que propose la distribution ; vérifiez avec `apt search dotnet-sdk` ou `dnf search dotnet-sdk`.

| Système | Commande |
| --- | --- |
| Windows | `winget install Microsoft.DotNet.SDK.8` (ou `.10`), Hosting Bundle pour IIS : `winget install Microsoft.DotNet.HostingBundle.8` |
| macOS | PKG officiel ou `brew install --cask dotnet-sdk` |
| Toutes (script) | `./dotnet-install.sh --channel LTS` (installation utilisateur, CI) |
| Conteneurs | `mcr.microsoft.com/dotnet/sdk`, `…/aspnet`, `…/runtime`, `…/runtime-deps` |

```bash
dotnet --info ; dotnet --list-sdks ; dotnet --list-runtimes
```

## Construire et publier

```bash
dotnet new webapi -n Inventaire.Api && cd Inventaire.Api
dotnet build ; dotnet run ; dotnet test
dotnet publish -c Release -o /opt/inventaire                                   # dépend du runtime installé
dotnet publish -c Release -r linux-x64 --self-contained -p:PublishSingleFile=true -o out   # autonome, un seul fichier
dotnet dev-certs https --trust                                                  # certificat de développement (poste)
```

## Héberger sous Linux (Kestrel + NGINX + systemd)

```ini
# /etc/systemd/system/inventaire.service
[Unit]
Description=Inventaire (ASP.NET Core)
After=network-online.target
[Service]
WorkingDirectory=/opt/inventaire
ExecStart=/usr/bin/dotnet /opt/inventaire/Inventaire.Api.dll
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://127.0.0.1:5000
Restart=always
[Install]
WantedBy=multi-user.target
```

[[03-nginx/01-presentation|NGINX]] en reverse proxy vers `127.0.0.1:5000` (en-têtes `X-Forwarded-For` et `X-Forwarded-Proto`, à prendre en compte dans l'application avec `UseForwardedHeaders`). Sous Windows : Hosting Bundle puis site IIS dont le pool d'applications est en « Aucun code managé ».

Suite : [[02-mono|Mono]] · [[90-aide-memoire|aide-mémoire]].
