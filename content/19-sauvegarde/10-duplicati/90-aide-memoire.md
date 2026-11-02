---
title: Duplicati — aide-mémoire des commandes
description: Commandes Duplicati avec exemples — duplicati-cli backup, list, find, restore, compare, test, repair, delete, compact, purge, list-broken-files ; options (--passphrase, --retention-policy, --keep-versions, --dblock-size, --exclude) ; service et serveur (duplicati-server, ServerUtil), journaux.
tags: [aide-mémoire, duplicati]
icon: terminal
---

Explications : [[01-presentation-installation|Duplicati]].

```bash
duplicati-cli backup URL /srv/donnees --passphrase="$P" --dblock-size=100MB --exclude="*.tmp" --retention-policy="7D:1D,4W:1W,12M:1M"
duplicati-cli list URL --passphrase="$P" ; duplicati-cli find URL "*rapport*" --passphrase="$P" --all-versions
duplicati-cli restore URL "*" --restore-path=/tmp/r --time=2026-10-30 --passphrase="$P"
duplicati-cli compare URL 0 1 --passphrase="$P" ; duplicati-cli test URL all --passphrase="$P"
duplicati-cli repair URL --passphrase="$P" ; duplicati-cli compact URL --passphrase="$P" ; duplicati-cli delete URL --keep-versions=30 --passphrase="$P"
duplicati-cli list-broken-files URL --passphrase="$P" ; duplicati-cli purge-broken-files URL --passphrase="$P"
sudo systemctl status duplicati ; sudo journalctl -u duplicati -f
```
