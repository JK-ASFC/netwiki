---
title: Supports et déploiement — aide-mémoire
description: Commandes Rufus (winget), Ventoy (Ventoy2Disk.sh install, update, GPT, réserve), vérification d'ISO, FOG (installfog.sh, options DHCP 66/67, sysprep), opsi (deploy-client-agent, makepackage, package-manager) et WAPT (wapt-get update, install, upgrade).
tags: [aide-mémoire, rufus, ventoy, fog, opsi, wapt]
icon: terminal
---

Explications : [[01-rufus-ventoy|Rufus et Ventoy]] · [[02-fog-opsi-wapt|FOG, opsi et WAPT]].

```bash
winget install --id Rufus.Rufus -e
sudo sh Ventoy2Disk.sh -i -g /dev/sdb ; sudo sh Ventoy2Disk.sh -u /dev/sdb ; sudo sh Ventoy2Disk.sh -l /dev/sdb
sha256sum debian-13.iso ; Get-FileHash .\Win11.iso -Algorithm SHA256
git clone https://github.com/fogproject/fogproject.git fogproject-stable && cd fogproject-stable/bin && sudo ./installfog.sh
# DHCP : option 66 = serveur FOG ; option 67 = ipxe.efi (UEFI) | undionly.kpxe (BIOS)
sysprep /generalize /oobe /shutdown
opsi-deploy-client-agent -u CORP\\admin-deploi pc-compta-01.corp.exemple.fr
opsi-makepackage ; opsi-package-manager -i paquet_1.0-1.opsi ; opsi-package-manager -l
wapt-get update ; wapt-get search firefox ; wapt-get install tis-firefox ; wapt-get upgrade ; wapt-get status
```
