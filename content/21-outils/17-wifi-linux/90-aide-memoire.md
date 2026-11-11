---
title: Wi-Fi sous Linux — aide-mémoire
description: Commandes iw (dev, link, station dump, reg), wpa_supplicant (wpa_passphrase, wpa_cli), iwd (iwctl) et hostapd (démarrage, debug), plus la vérification du mode point d'accès.
tags: [aide-mémoire, iw, wpa_supplicant, iwd, iwctl, hostapd, wifi]
icon: terminal
---

Explications : [[01-hostapd-wpa-supplicant-iw-iwd|hostapd, wpa_supplicant, iw et iwd]].

```bash
# Diagnostic (iw)
iw dev ; iw dev wlan0 link ; iw dev wlan0 station dump
iw phy phy0 info | grep -A10 "Supported interface modes"      # le mode AP est-il disponible ?
iw reg get ; sudo iw reg set FR

# Client wpa_supplicant
wpa_passphrase "SSID" > /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
sudo systemctl enable --now wpa_supplicant@wlan0
wpa_cli -i wlan0 status ; wpa_cli -i wlan0 scan_results ; wpa_cli -i wlan0 reconfigure

# Client iwd
sudo systemctl enable --now iwd
iwctl device list
iwctl station wlan0 scan ; iwctl station wlan0 get-networks
iwctl station wlan0 connect "SSID" ; iwctl station wlan0 show

# Point d'accès hostapd
sudo systemctl enable --now hostapd
sudo hostapd -dd /etc/hostapd/hostapd.conf           # mise au point
iw dev wlan0 station dump                             # clients associés

# Signal en continu
watch -n1 "iw dev wlan0 link | grep -E 'signal|bitrate'"
```
