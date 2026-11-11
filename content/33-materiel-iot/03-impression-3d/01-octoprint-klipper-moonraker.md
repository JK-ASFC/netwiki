---
title: OctoPrint, Klipper, Moonraker, Mainsail et Fluidd
description: Piloter une imprimante 3D en réseau — OctoPrint (serveur web Python relié par USB, téléversement de G-code, surveillance caméra, greffons, OctoPi, port 5000) ; pile Klipper (firmware calculé par un hôte Linux, printer.cfg, mcu) + Moonraker (API) + interfaces Mainsail et Fluidd ; IPP Everywhere pour l'impression bureautique sans pilote ; sécurité (ne jamais exposer sur Internet, risque matériel) et choix OctoPrint ou Klipper.
tags: [octoprint, klipper, moonraker, mainsail, fluidd, impression 3d, ipp everywhere, g-code]
icon: printer
---

Piloter une imprimante 3D « en réseau » consiste à placer un **petit ordinateur** (souvent un Raspberry Pi) entre le réseau et l'imprimante (reliée en USB) : on envoie les fichiers, on lance et on surveille les impressions depuis un navigateur. Deux grandes approches : **OctoPrint** et la pile **Klipper**.

## OctoPrint

**OctoPrint** est un serveur web (Python) qui dialogue avec l'imprimante par USB : téléversement de **G-code**, lancement, pause, contrôle des températures, visualisation par **caméra**, et un vaste écosystème de **greffons**.

```bash
# Image toute prête « OctoPi » pour Raspberry Pi, ou installation manuelle :
python3 -m venv ~/OctoPrint && ~/OctoPrint/bin/pip install octoprint
~/OctoPrint/bin/octoprint serve --host 127.0.0.1 --port 5000
```

- L'assistant initial crée le **compte administrateur** et active le contrôle d'accès : le laisser activé.
- Greffons utiles : Bed Level Visualizer, PrintTimeGenius, thèmes ; la caméra passe par `mjpg-streamer` / `camera-streamer`.
- Convient à une imprimante par instance (une par imprimante).

## La pile Klipper

**Klipper** déporte les calculs de mouvement sur l'**hôte Linux** (plus puissant que la carte de l'imprimante) : vitesses plus élevées, meilleure qualité. Il se compose de plusieurs briques :

| Brique | Rôle |
| --- | --- |
| **Klipper** | Firmware : l'hôte calcule, un micrologiciel léger tourne sur la carte (MCU) |
| **Moonraker** | API web (port 7125) entre Klipper et les interfaces |
| **Mainsail** | Interface web (sobre, complète) |
| **Fluidd** | Interface web (alternative, autre présentation) |

```text ~/printer_data/config/printer.cfg (extrait)
[mcu]
serial: /dev/serial/by-id/usb-Klipper_...

[printer]
kinematics: cartesian
max_velocity: 300
max_accel: 3000

[virtual_sdcard]
path: ~/printer_data/gcodes
```

```bash
# KIAUH (Klipper Installation And Update Helper) installe Klipper, Moonraker et une interface
git clone https://github.com/dw-0/kiauh && ./kiauh/kiauh.sh
# Mettre à jour le firmware de la carte après compilation :
cd ~/klipper && make menuconfig && make
```

Mainsail et Fluidd se servent toutes deux de Moonraker : on peut installer les deux et choisir. Klipper demande plus de configuration qu'OctoPrint, mais donne de meilleurs résultats sur les imprimantes rapides.

## Impression bureautique : IPP Everywhere

Pour les **imprimantes papier**, **IPP Everywhere** est la norme d'**impression sans pilote** : le poste découvre l'imprimante (DNS-SD/Bonjour) et imprime via **IPP** avec un format standard, sans installer de pilote propriétaire. [[18-infrastructure-systeme/03-impression/01-cups-presentation-installation|CUPS]] agit comme client et comme serveur IPP ; côté client, c'est le mécanisme de « driverless printing ».

```bash
lpinfo --include-schemes dnssd -v          # imprimantes IPP découvertes sur le réseau
driverless list                            # imprimantes gérables sans pilote
ipptool -tv ipp://imprimante.local/ipp/print get-printer-attributes.test
```

## Sécurité

> [!WARNING]
> Ne **jamais exposer** OctoPrint, Moonraker ou ces interfaces sur Internet : contrôler une imprimante 3D à distance peut provoquer une **surchauffe** (risque d'incendie si la protection thermique est mal réglée). Accès uniquement sur le réseau local ou via un [[08-acces-distant-vpn/03-wireguard/01-presentation-installation|VPN]]. Garder le contrôle d'accès activé, tenir le logiciel à jour, et pour Moonraker restreindre les réseaux de confiance (`[authorization] trusted_clients`).

## Choisir

| Besoin | Outil |
| --- | --- |
| Pilotage simple, greffons, une imprimante | OctoPrint |
| Performances, imprimantes rapides, multi-interfaces | Klipper + Moonraker + Mainsail/Fluidd |
| Gérer plusieurs imprimantes 3D | Instances séparées, ou solutions multi-imprimantes dédiées |
| Impression papier sans pilote | IPP Everywhere / CUPS |

Commandes : [[90-aide-memoire|aide-mémoire]].
