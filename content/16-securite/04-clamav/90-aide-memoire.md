---
title: ClamAV — aide-mémoire des commandes
description: Commandes ClamAV avec exemples — mise à jour des signatures (freshclam), analyse à la demande (clamscan, clamdscan avec --multiscan, --fdpass), démon clamd et analyse à l'accès (clamonacc), quarantaine, fichier de test EICAR, intégration à la messagerie (clamav-milter), signatures complémentaires, journaux.
tags: [aide-mémoire, clamav, antivirus, freshclam, clamscan, clamd]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|ClamAV]].

## Signatures

```bash
sudo systemctl stop clamav-freshclam && sudo freshclam && sudo systemctl start clamav-freshclam
sudo systemctl status clamav-freshclam
sigtool --info /var/lib/clamav/daily.cld | head -5
clamscan --version
```

## Analyse à la demande

```bash
clamscan -r --infected --bell /home                        # récursif, n'afficher que les infections
clamscan -r -i --exclude-dir="^/proc|^/sys|^/dev" /
clamscan -r -i --move=/srv/quarantaine /srv/depot          # déplacer les fichiers infectés
clamscan -r -i --log=/var/log/clamav/scan-$(date +%F).log /srv/partage
sudo clamdscan --multiscan --fdpass /srv/partage           # via le démon (plus rapide)
clamdscan --version
```

## Test

```bash
printf 'X5O!P%%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' > /tmp/eicar.txt
clamscan /tmp/eicar.txt          # doit signaler Eicar-Test-Signature
rm /tmp/eicar.txt
```

## Démon et analyse à l'accès

```ini
# /etc/clamav/clamd.conf (extraits)
LocalSocket /run/clamav/clamd.ctl
MaxFileSize 200M
MaxScanSize 400M
OnAccessIncludePath /srv/depot
OnAccessPrevention yes
OnAccessExcludeUname clamav
```

```bash
sudo systemctl restart clamav-daemon
sudo clamonacc --fdpass --log=/var/log/clamav/clamonacc.log
echo PING | socat - UNIX-CONNECT:/run/clamav/clamd.ctl     # répond PONG
```

## Messagerie

```bash
sudo apt install clamav-milter
sudo postconf -e 'smtpd_milters = unix:/var/run/clamav/clamav-milter.ctl' 'milter_default_action = accept'
```

## Journaux

```bash
sudo tail -f /var/log/clamav/clamav.log /var/log/clamav/freshclam.log
```
