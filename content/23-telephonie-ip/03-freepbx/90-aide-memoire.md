---
title: FreePBX — aide-mémoire des commandes
description: Commandes FreePBX avec exemples — fwconsole (reload, restart, modules, pare-feu, droits, sauvegarde et restauration, utilisateurs, paramètres), console Asterisk, journaux FreePBX et Asterisk, sngrep, mises à jour du système Debian.
tags: [aide-mémoire, freepbx, fwconsole, asterisk, voip]
icon: terminal
---

Référence rapide ; les explications sont dans [[02-configuration-fwconsole|fwconsole, sauvegarde et dépannage]].

```bash
fwconsole reload                              # = bouton « Apply Config »
fwconsole restart
fwconsole ma list
fwconsole ma refreshsignatures
fwconsole ma upgradeall && fwconsole reload
fwconsole ma downloadinstall callrecording
fwconsole chown
fwconsole firewall list trusted
fwconsole firewall add trusted 10.0.99.0/24
fwconsole firewall stop                       # dépannage uniquement
fwconsole setting SIGNATURECHECK 1
fwconsole backup --list
fwconsole backup --backup=<identifiant>
fwconsole backup --restore=/var/spool/asterisk/backup/sauvegarde.tar.gz
fwconsole userman --syncall --force
fwconsole notifications --list
fwconsole --help
asterisk -rvvvvv
sngrep -d any port 5060
tail -f /var/log/asterisk/full /var/log/asterisk/freepbx_security.log
apt update && apt upgrade                     # FreePBX 17 sur Debian 12
```
