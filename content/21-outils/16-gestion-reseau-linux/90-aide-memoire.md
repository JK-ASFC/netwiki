---
title: NetworkManager, systemd-networkd et ConnMan — aide-mémoire
description: Commandes nmcli et nmtui (état, connexions, adresse statique, VLAN, Wi-Fi), networkctl et resolvectl (systemd-networkd), connmanctl, et vérification du gestionnaire actif.
tags: [aide-mémoire, networkmanager, nmcli, systemd-networkd, networkctl, connman]
icon: terminal
---

Explications : [[01-networkmanager-networkd-connman|NetworkManager, systemd-networkd et ConnMan]].

```bash
# Quel gestionnaire est actif ?
systemctl is-active NetworkManager systemd-networkd connman

# NetworkManager
nmcli general status ; nmcli device status ; nmcli connection show
nmcli connection add type ethernet ifname enp3s0 con-name lan ipv4.method manual \
  ipv4.addresses 192.0.2.10/24 ipv4.gateway 192.0.2.1 ipv4.dns 192.0.2.53
nmcli connection up lan ; nmcli connection reload
nmcli device wifi list ; nmcli device wifi connect "SSID" password '…'
nmtui                                   # interface en mode texte

# systemd-networkd
sudo systemctl enable --now systemd-networkd systemd-resolved
networkctl list ; networkctl status enp1s0 ; sudo networkctl reload
resolvectl status ; resolvectl dns enp1s0

# ConnMan
connmanctl services ; connmanctl connect <service> ; connmanctl state

# Vérifications générales (iproute2)
ip -br address ; ip route ; ip -br link
resolvectl query intranet
```
