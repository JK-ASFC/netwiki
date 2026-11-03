---
title: Windows Terminal, WinGet, Chocolatey et Scoop
description: Outillage de base de l'administrateur Windows — Windows Terminal (MIT : onglets, volets, profils PowerShell, WSL, SSH, settings.json, commande wt), WinGet (gestionnaire de paquets de Microsoft : search, install --id -e, upgrade --all, export et import, configuration DSC, sources privées et stratégies de groupe), Chocolatey (Apache 2.0 : dépôt communautaire, installation silencieuse, sources internes Nexus, paquets maison) et Scoop (Unlicense : installation sans droits administrateur dans le profil, buckets main et extras), comparaison et déploiement sur un parc.
tags: [windows, windows terminal, winget, chocolatey, scoop, paquets, poste de travail]
icon: app-window
---

| Outil | Rôle | Droits | Licence |
| --- | --- | --- | --- |
| **Windows Terminal** | Terminal moderne : onglets, volets, profils | Utilisateur | MIT |
| **WinGet** | Gestionnaire de paquets **intégré** à Windows 10/11 et Server 2025 | Utilisateur ou administrateur selon le paquet | MIT |
| **Chocolatey** | Gestionnaire de paquets historique, très riche, scripts PowerShell | Administrateur | Apache 2.0 (édition communautaire) |
| **Scoop** | Outils en ligne de commande dans le **profil utilisateur** | Aucun droit administrateur | Unlicense / MIT |

## Windows Terminal

Fourni avec Windows 11 ; sinon `winget install --id Microsoft.WindowsTerminal -e`. Les profils (PowerShell 7, Invite de commandes, distributions [[03-wsl-cygwin-msys2-git|WSL]], connexions SSH) se règlent dans *Paramètres* ou directement dans `settings.json` :

```json
{
  "defaultProfile": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
  "profiles": {
    "list": [
      { "name": "Bastion SSH", "commandline": "ssh admin@bastion.corp.exemple.fr", "icon": "🛡️" }
    ]
  }
}
```

Ligne de commande : `wt -p "PowerShell" ; split-pane -p "Ubuntu" ; new-tab -p "Bastion SSH"`. Raccourcis utiles : `Alt+Maj+D` (dupliquer en volet), `Ctrl+Maj+P` (palette de commandes).

## WinGet

```powershell
winget search 7zip
winget install --id 7zip.7zip -e --silent --accept-package-agreements --accept-source-agreements
winget install --id Microsoft.PowerShell -e --scope machine
winget list --upgrade-available ; winget upgrade --all --silent
winget export -o poste-standard.json ; winget import -i poste-standard.json
winget pin add --id Mozilla.Firefox          # bloquer les mises à jour d'un paquet
winget source add -n interne -a https://winget.corp.exemple.fr/api -t Microsoft.Rest
```

Toujours utiliser l'**identifiant exact** (`--id … -e`) dans les scripts. `winget configure configuration.winget` applique une configuration déclarative (YAML, PowerShell DSC) : logiciels, paramètres, fonctions Windows. Les stratégies de groupe (modèles ADMX *DesktopAppInstaller*) permettent d'autoriser uniquement les sources internes. Sous un compte SYSTEM (déploiement), appeler `winget.exe` par son chemin complet dans `C:\Program Files\WindowsApps\Microsoft.DesktopAppInstaller_*`.

## Chocolatey

Installation (PowerShell administrateur) :

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

```powershell
choco install -y git vscode 7zip
choco upgrade all -y
choco list                                   # paquets installés (Chocolatey 2)
choco search keepass
choco pin add -n=firefox
choco source add -n=interne -s="https://nexus.corp.exemple.fr/repository/choco-group/" --priority=1
choco source disable -n=chocolatey
```

En entreprise, ne pas dépendre du dépôt communautaire (limites de débit, paquets qui téléchargent depuis Internet) : **internaliser** les paquets dans un dépôt NuGet ([[14-registres-artefacts/02-nexus-artifactory-verdaccio|Nexus]]) et désactiver la source publique. Créer un paquet maison : `choco new monoutil` puis `choco pack` et `choco push`.

## Scoop

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
scoop install git ripgrep jq
scoop bucket add extras ; scoop install extras/sysinternals
scoop update ; scoop update *
scoop list ; scoop cleanup *
```

Les programmes s'installent dans `%USERPROFILE%\scoop\apps` avec des raccourcis (*shims*) dans le `PATH` : idéal pour les outils d'administration sur un poste où l'utilisateur n'est pas administrateur.

## Quel outil choisir ?

- **Parc géré** : WinGet (intégré, signé par Microsoft) avec une source interne, ou un outil de déploiement ([[06-support-parc/09-pdq-deploy|PDQ Deploy]], Intune, WAPT, opsi).
- **Catalogue le plus large et paquets maison** : Chocolatey avec dépôt interne.
- **Outils personnels de l'administrateur** : Scoop.

Commandes : [[90-aide-memoire|aide-mémoire]].
