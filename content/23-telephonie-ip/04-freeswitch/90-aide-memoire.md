---
title: FreeSWITCH — aide-mémoire des commandes
description: Commandes FreeSWITCH avec exemples — fs_cli (état, rechargement XML, profils et gateways Sofia, enregistrements, appels, originate, uuid_kill, traces SIP, niveaux de journal, arrêt propre), modules, Windows (fs_cli.exe), FusionPBX (mise à jour, cache).
tags: [aide-mémoire, freeswitch, fs_cli, sofia, fusionpbx, voip]
icon: terminal
---

Référence rapide ; les explications sont dans [[02-configuration-fs-cli|configuration et fs_cli]].

```bash
fs_cli -x "status"
fs_cli -x "version"
fs_cli -x "reloadxml"
fs_cli -x "sofia status"
fs_cli -x "sofia status profile internal reg"
fs_cli -x "sofia status gateway operateur"
fs_cli -x "sofia profile external rescan"
fs_cli -x "sofia profile internal restart"
fs_cli -x "show registrations"
fs_cli -x "show channels"
fs_cli -x "show calls count"
fs_cli -x "originate user/1001 &echo"
fs_cli -x "uuid_kill 3f6c2a1e-…"
fs_cli -x "sofia global siptrace on"
fs_cli -x "sofia loglevel all 9"
fs_cli -x "fsctl loglevel debug"
fs_cli -x "load mod_callcenter"
fs_cli -x "fsctl shutdown elegant"
tail -f /var/log/freeswitch/freeswitch.log
```

```powershell
& "C:\Program Files\FreeSWITCH\fs_cli.exe" -x "sofia status"
```

FusionPBX : *Advanced → Upgrade* (mise à jour du code, des schémas et des menus) ; `fs_cli -x "reloadxml"` puis vider le cache (*Status → SIP Status → Flush Cache*) après une modification manuelle.
