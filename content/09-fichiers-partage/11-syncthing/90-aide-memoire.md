---
title: Syncthing — aide-mémoire des commandes
description: Commandes Syncthing avec exemples — service utilisateur et système, identifiant d'appareil, CLI (syncthing cli : config, appareils, dossiers, état), API REST (statut, connexions, complétion, rescan, erreurs), interface web, fichiers .stignore, versionnage, relais et découverte, Windows et macOS, dépannage.
tags: [aide-mémoire, syncthing, synchronisation, api, stignore]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Syncthing]].

## Service

```bash
systemctl --user enable --now syncthing.service          # pour l'utilisateur courant
sudo systemctl enable --now syncthing@amartin.service    # service système pour un utilisateur
syncthing --device-id                                     # identifiant de cet appareil
syncthing --version
```

```powershell
winget install Syncthing.Syncthing          # ou SyncTrayzor / Syncthing Windows Setup
```

macOS : `brew install syncthing && brew services start syncthing`. Interface web : `http://127.0.0.1:8384`.

## CLI

```bash
syncthing cli show system | jq '.myID'
syncthing cli config devices add --device-id ABCDEFG-... --name nas-paris
syncthing cli config devices list
syncthing cli config folders add --id projets --label Projets --path ~/Projets
syncthing cli config folders projets devices add --device-id ABCDEFG-...
syncthing cli config folders list
syncthing cli config gui raw-address set 127.0.0.1:8384
syncthing cli operations restart
```

## API REST

```bash
K=$(grep -oP '(?<=<apikey>)[^<]+' ~/.local/state/syncthing/config.xml)     # ancien chemin : ~/.config/syncthing
A=http://127.0.0.1:8384/rest
curl -s -H "X-API-Key: $K" $A/system/status | jq '{myID, uptime}'
curl -s -H "X-API-Key: $K" $A/system/connections | jq '.connections | to_entries[] | {id: .key, connected: .value.connected, address: .value.address}'
curl -s -H "X-API-Key: $K" "$A/db/status?folder=projets" | jq '{state, needFiles, globalFiles}'
curl -s -H "X-API-Key: $K" "$A/db/completion?folder=projets&device=ABCDEFG-..." | jq .completion
curl -s -X POST -H "X-API-Key: $K" "$A/db/scan?folder=projets"
curl -s -H "X-API-Key: $K" $A/system/error | jq .
curl -s -H "X-API-Key: $K" "$A/folder/errors?folder=projets" | jq .
```

## .stignore

```text
// à la racine du dossier synchronisé
(?d).DS_Store
(?d)Thumbs.db
*.tmp
node_modules
/build
!/build/important.txt
```

## Dépannage

| Symptôme | Piste |
| --- | --- |
| Appareil « déconnecté » | Ports 22000/TCP-UDP et 21027/UDP (découverte locale), relais désactivés, identifiant erroné |
| Dossier « hors synchronisation » | Droits, fichiers verrouillés, conflits (`.sync-conflict-…`), `.stignore` différent |
| Synchronisation lente via relais | Activer UPnP/NAT-PMP ou rediriger le port 22000 |
