---
title: Visual Studio
description: Visual Studio (Windows) — éditions Community, Professional et Enterprise et conditions de licence, charges de travail (.NET, C++, Azure, outils de données), installation silencieuse et disposition hors ligne (layout) pour les postes sans Internet, fichiers .vsconfig, mises à jour et canaux, Visual Studio Build Tools pour les serveurs de compilation, différence avec VS Code, sécurité et gestion en entreprise.
tags: [visual studio, ide, .net, c#, build tools, installation hors ligne, windows]
icon: code
---

**Visual Studio** est l'IDE complet de Microsoft pour Windows : applications **.NET** (C#, ASP.NET, services Windows, WPF/WinForms), **C++**, extensions, solutions Azure. Il ne faut pas le confondre avec [[01-vscode|Visual Studio Code]], éditeur léger et multiplateforme. Pour une équipe d'infrastructure, il sert à maintenir des outils internes .NET, des modules PowerShell binaires, ou des solutions héritées.

## Éditions

| Édition | Conditions (résumé, à vérifier dans la licence) |
| --- | --- |
| **Community** | Gratuite pour les individus, l'open source, la formation, et les petites organisations (seuils de postes et de chiffre d'affaires) |
| **Professional** | Abonnement par utilisateur |
| **Enterprise** | Outils avancés (tests, diagnostics, architecture) |
| **Build Tools** | Outils de compilation sans IDE, pour les serveurs de CI |

## Installation

Le programme d'installation installe des **charges de travail** (*workloads*) et des composants :

```powershell
# Installation silencieuse avec les charges de travail choisies
vs_professional.exe --quiet --wait --norestart --nocache `
  --add Microsoft.VisualStudio.Workload.ManagedDesktop `
  --add Microsoft.VisualStudio.Workload.NetWeb --includeRecommended

# Disposition hors ligne (réseau isolé) : télécharger une fois, installer partout
vs_professional.exe --layout D:\VSLayout --lang fr-FR --add Microsoft.VisualStudio.Workload.ManagedDesktop --includeRecommended
D:\VSLayout\vs_professional.exe --quiet --wait --noweb --add Microsoft.VisualStudio.Workload.ManagedDesktop

# Exporter / réutiliser une configuration
"C:\Program Files (x86)\Microsoft Visual Studio\Installer\setup.exe" export --installPath "C:\Program Files\Microsoft Visual Studio\2022\Professional" --config C:\Temp\equipe.vsconfig
vs_professional.exe --config \\srv-depot\VS\equipe.vsconfig --quiet --wait
```

Avec winget : `winget install Microsoft.VisualStudio.2022.Community --override "--quiet --add Microsoft.VisualStudio.Workload.ManagedDesktop"` (adapter à la version installée dans votre parc).

## Serveurs de compilation

Sur les agents CI (Jenkins, GitLab Runner, Azure DevOps), installez **Build Tools** (MSBuild, compilateurs, SDK) plutôt que l'IDE complet :

```powershell
vs_buildtools.exe --quiet --wait --norestart --add Microsoft.VisualStudio.Workload.MSBuildTools --add Microsoft.VisualStudio.Workload.NetCoreBuildTools
```

Voir [[05-jenkins/02-pipelines-agents|agents Jenkins]] et [[02-gitlab/03-ci-cd-runners|runners GitLab]].

## Mises à jour

- Canaux **Current** (mises à jour mensuelles) et **LTSC** (versions mineures supportées plus longtemps, pour les environnements qui changent peu).
- Mises à jour administrées : *Visual Studio Administrator updates* via WSUS/ConfigMgr, ou réactualisation de la disposition hors ligne (`--layout` sur le même dossier) puis `vs_installer.exe update`.
- Les versions majeures (2019, 2022 puis 2026) coexistent ; vérifiez la date de fin de support de celle utilisée.

## Sécurité

- [ ] Mettre à jour régulièrement (failles corrigées dans l'IDE, les SDK .NET et les composants comme Git)
- [ ] Extensions de la Marketplace officielle uniquement, en nombre limité
- [ ] Ne pas ouvrir de solution non fiable : les fichiers de projet MSBuild peuvent exécuter du code à l'ouverture ou à la compilation (attaques ciblant des chercheurs en sécurité en 2021)
- [ ] Packages NuGet depuis des sources maîtrisées (flux interne, verrouillage des versions)
