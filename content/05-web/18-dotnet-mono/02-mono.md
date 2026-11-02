---
title: Mono
description: Mono — implémentation libre historique du .NET Framework (Linux, macOS, Windows) : état du projet (transféré à WineHQ en 2024, plus d'évolution), cas encore rencontrés (anciennes applications .NET Framework sous Linux, outils, Unity historique), installation (paquets mono-complete, dépôt mono-project), commandes mono, mcs, csc, xbuild/msbuild, mozroots et cert-sync, et migration vers .NET moderne.
tags: [mono, .net framework, migration, linux, historique]
icon: info
---

**Mono** a permis d'exécuter des applications **.NET Framework** hors de Windows. Microsoft a confié le projet à **WineHQ** en 2024 ; il ne reçoit plus d'évolutions significatives. Les nouvelles applications doivent cibler [[01-dotnet|.NET]] (8, 10…), qui est multiplate-forme.

On le rencontre encore pour des outils anciens (par exemple certains utilitaires d'administration ou de jeux), des applications WinForms simples ou des scripts de construction hérités.

## Installation

```bash
sudo apt install mono-complete            # Debian/Ubuntu (paquets de la distribution)
sudo dnf install mono-complete            # Fedora ; RHEL via EPEL selon la version
brew install mono                         # macOS
mono --version
```

## Utilisation

```bash
mono OutilAncien.exe --aide              # exécuter un assemblage .NET Framework
mcs -out:bonjour.exe Bonjour.cs           # compiler (compilateur C# de Mono)
csc Bonjour.cs                            # compilateur Roslyn fourni avec Mono récent
msbuild Projet.sln /p:Configuration=Release
sudo cert-sync /etc/ssl/certs/ca-certificates.crt   # importer les CA du système dans le magasin Mono
```

## Migrer

1. Inventorier les dépendances Windows (registre, WCF serveur, WebForms, COM) avec l'**assistant de mise à niveau .NET** (`dotnet tool install -g upgrade-assistant`).
2. Convertir le projet au format SDK, cibler `net8.0` ou plus récent, remplacer les API absentes.
3. Publier en mode autonome pour Linux.
