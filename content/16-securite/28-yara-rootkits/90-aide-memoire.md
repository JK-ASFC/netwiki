---
title: YARA, chkrootkit et rkhunter — aide-mémoire
description: Commandes yara (-r, -s, -m, -p, -f, -w, -c, -t, -d, -x, pid), yarac, YARA-X (yr scan, check, fmt, compile), chkrootkit (-q, -x, -r) et rkhunter (--update, --propupd, --check, --sk, --rwo, --list tests, --enable, --disable, --config-check, --versioncheck) avec exemples.
tags: [aide-mémoire, yara, chkrootkit, rkhunter]
icon: terminal
---

Explications : [[01-yara|YARA]] · [[02-chkrootkit-rkhunter|chkrootkit et rkhunter]].

```bash
yara -v ; yara -r -s -m regles.yar /cible ; yara -c regles.yar fichier ; yara -t Telechargeur regles.yar /tmp ; yara -d seuil=10 regles.yar f
yara -w -p 8 regles.yar /srv ; yarac *.yar index.yarc ; yara -C index.yarc /srv
yr check regles.yar ; yr fmt regles.yar ; yr scan -s regles.yar /tmp ; yr compile regles.yar -o regles.yarx
sudo chkrootkit -q ; sudo chkrootkit -r /mnt/disque-suspect          # analyser un système monté depuis un média sain
sudo rkhunter --versioncheck ; sudo rkhunter --update ; sudo rkhunter --propupd ; sudo rkhunter -c --sk --rwo
sudo rkhunter --list tests ; sudo rkhunter -C ; sudo rkhunter -c --enable hidden_procs,suspscan
```
