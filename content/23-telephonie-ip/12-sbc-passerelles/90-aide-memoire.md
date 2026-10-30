---
title: SBC et passerelles — aide-mémoire
description: Commandes de supervision des SBC avec exemples — AudioCodes Mediant (show voip, proxy sets, IP groups, enregistrements, syslog, sauvegarde de configuration), Oracle Enterprise SBC (ACLI : show sipd, verify/save/activate-config), Cisco CUBE (show sip-ua, show call active voice), tests d'ATA et de fax.
tags: [aide-mémoire, sbc, audiocodes, oracle, cube, ata]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-sbc|SBC]] et [[02-passerelles-analogiques-ata|passerelles et ATA]]. La syntaxe exacte dépend de la version du micrologiciel (`?` dans la CLI).

## AudioCodes Mediant

```audiocodes
show system version
show voip calls active
show voip calls statistics
show voip proxy sets status
show voip ip-group 1 status
show voip register db sbc list
debug syslog-server 10.0.98.20 port 514
copy cli-script to tftp://10.0.99.30/mediant-paris.txt
write
reload now
```

## Oracle Enterprise SBC (ACLI)

```text
show sipd agents
show sipd status
show sipd errors
show health
configure terminal
verify-config
save-config
activate-config
```

## Cisco CUBE

```cisco
show sip-ua status
show sip-ua register status
show call active voice brief
show voice class tenant
show dial-peer voice summary
debug ccsip messages
undebug all
```

## ATA et fax

```bash
sngrep -d any host 10.0.50.40            # échanges SIP de l'ATA
sudo tcpdump -ni any host 10.0.50.40 and udp portrange 10000-20000 -c 50     # présence du flux RTP / T.38
```

Contrôles rapides : enregistrement de chaque port FXS dans l'IPBX, codec G.711 A-law, T.38 négocié dans le SDP (`m=image ... udptl t38`), annulation d'écho et VAD désactivés pour le fax.
