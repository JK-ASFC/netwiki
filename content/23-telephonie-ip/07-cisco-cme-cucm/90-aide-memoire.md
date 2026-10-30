---
title: Cisco CME et CUCM — aide-mémoire des commandes
description: Commandes Cisco Unified CME (show ephone, voice register, dial-peer, appels actifs, traductions, débogages, réinitialisation des postes) et CLI de la plateforme CUCM (état, services, réplication, NTP, traces, sauvegarde DRS, RIS) avec exemples.
tags: [aide-mémoire, cisco, cme, cucm, dial-peer, ephone]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-cme-ios|Cisco CME]] et [[02-cucm-administration|CUCM]].

## CME (IOS)

```cisco
show telephony-service
show ephone registered
show ephone summary
show ephone-dn summary
show voice register all
show voice register pool all brief
show dial-peer voice summary
show call active voice brief
show voip rtp connections
show ip dhcp binding
test voice translation-rule 1 0123456701
! Réinitialiser les postes après une modification
telephony-service
 create cnf-files
 reset all
! Débogages (puis undebug all)
debug ephone register
debug ccsip messages
debug voip dialpeer
undebug all
```

## CUCM (CLI de la plateforme)

```text
admin:show status
admin:show version active
admin:show network eth0 detail
admin:utils service list
admin:utils service restart Cisco CallManager
admin:utils dbreplication runtimestate
admin:utils ntp status
admin:show risdb query phone
admin:file list activelog cm/trace/ccm/sdl
admin:file get activelog cm/trace/ccm/sdl reltime hours 1
admin:utils disaster_recovery status backup
admin:utils system restart
```
