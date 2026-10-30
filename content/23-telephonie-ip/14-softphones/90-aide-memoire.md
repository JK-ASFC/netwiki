---
title: Softphones — aide-mémoire des commandes
description: Commandes d'installation et de test des softphones avec exemples — winget, apt, Flatpak, Homebrew, PJSUA (enregistrement, appel, sans carte son), Baresip (comptes, appels, commandes interactives), vérifications réseau et audio sur Windows, Linux et macOS.
tags: [aide-mémoire, softphone, linphone, microsip, baresip, pjsua]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-softphones|softphones]].

## Installation

```powershell
winget search linphone
winget install --id MicroSIP.MicroSIP -e
```

```bash
sudo apt install linphone-desktop baresip
flatpak install flathub com.belledonnecommunications.linphone
brew install --cask linphone && brew install baresip
```

## Tests en ligne de commande

```bash
pjsua --id sip:1001@pbx.exemple.fr --registrar sip:pbx.exemple.fr --realm '*' --username 1001 --password "$MDP" --null-audio
pjsua --id sip:1001@pbx.exemple.fr --registrar sip:pbx.exemple.fr --realm '*' --username 1001 --password "$MDP" --null-audio --duration 20 sip:1002@pbx.exemple.fr
baresip -f ~/.baresip
# dans baresip : /dial 1002   /hangup   /reginfo   /quit
```

## Vérifications

```powershell
Test-NetConnection pbx.exemple.fr -Port 5061
Get-NetFirewallApplicationFilter | Where-Object Program -like "*MicroSIP*"
Get-PnpDevice -Class AudioEndpoint | Format-Table FriendlyName, Status
```

```bash
nc -vz pbx.exemple.fr 5061
pactl list short sources          # micros (Linux)
arecord -l
```
