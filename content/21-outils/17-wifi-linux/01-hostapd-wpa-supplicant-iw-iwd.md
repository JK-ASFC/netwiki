---
title: hostapd, wpa_supplicant, iw et iwd
description: Wi-Fi sous Linux — iw (diagnostic : interfaces, voisins, liens, régulation), wpa_supplicant (client WPA2/WPA3, wpa_cli, wpa_passphrase, EAP d'entreprise), iwd (client moderne d'Intel, iwctl, intégration systemd-networkd) et hostapd (point d'accès et serveur d'authentification : WPA2/WPA3-PSK, WPA-Enterprise 802.1X vers RADIUS, canal, bande, pont réseau) ; carte compatible, réglementation et sécurité.
tags: [wifi, hostapd, wpa_supplicant, iwd, iw, point d'accès, wpa3, 802.1x, linux]
icon: wifi
---

Sous Linux, le Wi-Fi se gère souvent via [[16-gestion-reseau-linux/01-networkmanager-networkd-connman|NetworkManager]], mais il est utile de connaître les briques sous-jacentes pour diagnostiquer, monter un point d'accès ou configurer un client sur un serveur sans interface graphique.

## iw — diagnostic

`iw` interroge et règle les cartes Wi-Fi modernes (pilotes nl80211). Il remplace l'ancien `iwconfig`.

```bash
iw dev                                   # interfaces sans fil et leur mode
iw dev wlan0 link                        # point d'accès associé, débit, signal
iw dev wlan0 station dump                # clients associés (en mode point d'accès)
iw phy phy0 info | less                  # bandes, canaux, modes et débits pris en charge
iw reg get                               # domaine de régulation (canaux et puissances autorisés)
sudo iw reg set FR                       # fixer le pays (respecter la réglementation locale)
```

## wpa_supplicant — client

Le client Wi-Fi historique, utilisé seul ou piloté par NetworkManager. Il gère WPA2, WPA3 et le **802.1X d'entreprise** (EAP-PEAP, EAP-TLS).

```bash
wpa_passphrase "MonSSID" > /etc/wpa_supplicant/wpa_supplicant-wlan0.conf   # saisir la clé ; génère le bloc chiffré
```

```ini /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
ctrl_interface=/run/wpa_supplicant
update_config=1
country=FR

network={
    ssid="MonSSID"
    psk=a1b2c3…            # empreinte, pas la clé en clair
}
```

```ini
# Réseau d'entreprise (WPA2/WPA3-Enterprise, EAP-PEAP)
network={
    ssid="Entreprise"
    key_mgmt=WPA-EAP
    eap=PEAP
    identity="jdupont"
    password="…"
    ca_cert="/etc/ssl/certs/ca-entreprise.pem"
    phase2="auth=MSCHAPV2"
}
```

```bash
sudo systemctl enable --now wpa_supplicant@wlan0      # souvent couplé à systemd-networkd pour l'adresse
wpa_cli -i wlan0 status ; wpa_cli -i wlan0 reconfigure
wpa_cli -i wlan0 scan && wpa_cli -i wlan0 scan_results
```

## iwd — client moderne

**iwd** (iNet Wireless Daemon, Intel) est plus léger et plus rapide que wpa_supplicant, avec son propre client `iwctl`. Il s'intègre à systemd-networkd ou à NetworkManager.

```bash
sudo systemctl enable --now iwd
iwctl
# dans l'invite interactive :
[iwd]# device list
[iwd]# station wlan0 scan
[iwd]# station wlan0 get-networks
[iwd]# station wlan0 connect MonSSID        # demande la clé
[iwd]# station wlan0 show
```

Les profils sont enregistrés dans `/var/lib/iwd/`. Ne pas lancer iwd **et** wpa_supplicant sur la même interface.

## hostapd — point d'accès

`hostapd` transforme une carte Wi-Fi (qui doit **prendre en charge le mode AP**) en **point d'accès**. Il assure aussi l'authentification, en PSK ou en 802.1X vers un serveur RADIUS.

```ini /etc/hostapd/hostapd.conf
interface=wlan0
driver=nl80211
ssid=Entreprise-Interne
country_code=FR
hw_mode=a
channel=36
ieee80211n=1
ieee80211ac=1
wmm_enabled=1

# WPA2 + WPA3 (SAE) par clé partagée
wpa=2
wpa_key_mgmt=WPA-PSK WPA-PSK-SHA256 SAE
rsn_pairwise=CCMP
wpa_passphrase=ChangezCetteCle
ieee80211w=1
```

```ini
# Variante WPA-Enterprise (802.1X) vers un serveur RADIUS
# wpa_key_mgmt=WPA-EAP WPA-EAP-SHA256
# ieee8021x=1
# auth_server_addr=192.0.2.60
# auth_server_port=1812
# auth_server_shared_secret=…
```

```bash
sudo systemctl enable --now hostapd
sudo hostapd -dd /etc/hostapd/hostapd.conf       # mode debug pour mettre au point
```

Pour un vrai point d'accès, relier `wlan0` à un **pont** réseau (`brctl`/`bridge`) avec l'interface filaire, et fournir le DHCP (voir le chapitre DHCP). Pour un réseau d'entreprise, coupler hostapd à [[04-aaa/01-freeradius/01-presentation|FreeRADIUS]].

## Points d'attention

- **Carte compatible** : vérifier le mode AP (`iw phy phy0 info`, section *supported interface modes*), la bande 5 GHz et le nombre de clients supportés ; beaucoup de cartes grand public sont limitées.
- **Réglementation** : le domaine de régulation (`country_code`) fixe les canaux et puissances autorisés ; certains canaux 5 GHz imposent le DFS (détection des radars).
- **Sécurité** : WPA3 (SAE) ou au minimum WPA2-CCMP, `ieee80211w=1` (protection des trames de gestion) ; ne jamais laisser une clé en clair dans un fichier lisible par tous ; pour un parc, préférer le 802.1X avec comptes individuels plutôt qu'une clé partagée.

Commandes : [[90-aide-memoire|aide-mémoire]].
