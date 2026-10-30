---
title: Asterisk — aide-mémoire des commandes
description: Commandes Asterisk essentielles avec exemples — console (asterisk -r, -rx), état (core show), postes et trunks PJSIP, appels en cours, dialplan, files d'attente, messagerie, conférences, débogage SIP/RTP, journaux, rechargements par module, AMI depuis la ligne de commande, sauvegarde.
tags: [aide-mémoire, asterisk, pjsip, cli, dialplan, voip]
icon: terminal
---

Référence rapide ; la référence détaillée est dans [[04-securite-exploitation-cli|sécurité, exploitation et CLI]].

## Console et état

```bash
sudo asterisk -rvvv
sudo asterisk -rx "core show version"
sudo asterisk -rx "core show uptime"
sudo asterisk -rx "core show channels concise"
sudo asterisk -rx "core show calls"
sudo asterisk -rx "core show hints"
sudo asterisk -rx "module show like pjsip"
```

## PJSIP

```bash
sudo asterisk -rx "pjsip show endpoints"
sudo asterisk -rx "pjsip show endpoint 1001"
sudo asterisk -rx "pjsip show contacts"
sudo asterisk -rx "pjsip show registrations"
sudo asterisk -rx "pjsip send register operateur-reg"
sudo asterisk -rx "pjsip qualify 1001"
sudo asterisk -rx "module reload res_pjsip.so"
```

## Dialplan, files, messagerie, conférences

```bash
sudo asterisk -rx "dialplan reload"
sudo asterisk -rx "dialplan show 0612345678@interne"
sudo asterisk -rx "queue show"
sudo asterisk -rx "queue add member PJSIP/1003 to commercial"
sudo asterisk -rx "queue pause member PJSIP/1003 queue commercial"
sudo asterisk -rx "voicemail show users"
sudo asterisk -rx "confbridge list"
sudo asterisk -rx "database show"
sudo asterisk -rx "channel originate PJSIP/1001 extension 1002@interne"
sudo asterisk -rx "channel request hangup all"
```

## Débogage

```bash
sudo asterisk -rx "pjsip set logger on"
sudo asterisk -rx "pjsip set logger host 198.51.100.20"
sudo asterisk -rx "rtp set debug ip 10.0.40.21"
sudo asterisk -rx "core set verbose 5"
sudo asterisk -rx "core set debug 3"
sudo asterisk -rx "pjsip set logger off" && sudo asterisk -rx "rtp set debug off" && sudo asterisk -rx "core set debug 0"
sudo tail -f /var/log/asterisk/full
grep "C-0000002a" /var/log/asterisk/full | less        # suivre un appel par son identifiant
sudo tail -f /var/log/asterisk/security
```

## Arrêt, redémarrage, sauvegarde

```bash
sudo asterisk -rx "core reload"
sudo asterisk -rx "core restart gracefully"        # attendre la fin des appels
sudo asterisk -rx "core stop when convenient"
sudo tar czf /srv/sauvegardes/asterisk-$(date +%F).tar.gz /etc/asterisk /var/lib/asterisk/astdb.sqlite3 /var/spool/asterisk/voicemail
```
