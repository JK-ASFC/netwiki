---
title: Impression 3D et IPP — aide-mémoire
description: Ports et commandes d'OctoPrint, de la pile Klipper (KIAUH, make, Moonraker), des interfaces Mainsail et Fluidd, et des outils d'impression IPP sans pilote (driverless, ipptool).
tags: [aide-mémoire, octoprint, klipper, moonraker, mainsail, fluidd, ipp]
icon: terminal
---

Explications : [[01-octoprint-klipper-moonraker|OctoPrint, Klipper, Moonraker, Mainsail et Fluidd]].

| Composant | Port |
| --- | --- |
| OctoPrint | 5000 |
| Moonraker (API Klipper) | 7125 |
| Mainsail / Fluidd | 80 (servies par un serveur web local) |

```bash
# OctoPrint
~/OctoPrint/bin/octoprint serve --host 127.0.0.1 --port 5000
systemctl status octoprint
ls -l /dev/serial/by-id/                 # identifier le port de l'imprimante

# Klipper / Moonraker (via KIAUH)
./kiauh/kiauh.sh                         # installer / mettre à jour
cd ~/klipper && make menuconfig && make  # firmware de la carte
systemctl status klipper moonraker
curl http://127.0.0.1:7125/printer/info  # API Moonraker

# Impression IPP sans pilote
lpinfo --include-schemes dnssd -v
driverless list
ipptool -tv ipp://imprimante.local/ipp/print get-printer-attributes.test
lp -d imprimante document.pdf
```
