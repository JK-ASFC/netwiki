---
title: NetworkManager, systemd-networkd et ConnMan
description: Gestionnaires de configuration réseau sous Linux — NetworkManager (postes et serveurs : nmcli et nmtui, connexions filaires et Wi-Fi, adresses statiques, VLAN, agrégation, ponts, renommage, répartiteurs), systemd-networkd (serveurs, conteneurs et machines virtuelles : fichiers .network, .netdev, .link, networkctl, résolution avec systemd-resolved) et ConnMan (systèmes embarqués et automobile : connmanctl) ; choisir l'un ou l'autre et cohabitation.
tags: [networkmanager, nmcli, systemd-networkd, networkctl, connman, réseau, linux]
icon: network
---

Sous Linux, un **gestionnaire de réseau** applique la configuration des interfaces (adresses, routes, DNS, Wi-Fi) au démarrage et à chaud. Trois outils se partagent les usages ; **un seul doit gérer une interface donnée** pour éviter les conflits.

## NetworkManager

Le standard des **postes de travail** et de beaucoup de serveurs (Red Hat, Fedora, Ubuntu Desktop). Il gère le filaire, le Wi-Fi, le WWAN et le VPN, avec bascule automatique. Outils : `nmcli` (ligne de commande) et `nmtui` (menus).

```bash
nmcli general status
nmcli device status
nmcli connection show

# Adresse statique sur une interface filaire
nmcli connection add type ethernet ifname enp3s0 con-name lan-fixe \
  ipv4.method manual ipv4.addresses 192.0.2.10/24 ipv4.gateway 192.0.2.1 \
  ipv4.dns "192.0.2.53 192.0.2.54" ipv6.method disabled
nmcli connection up lan-fixe

nmcli connection modify lan-fixe +ipv4.routes "10.10.0.0/16 192.0.2.254"
nmcli -f GENERAL,IP4,IP6 device show enp3s0
```

- **VLAN** : `nmcli con add type vlan con-name vlan20 dev enp3s0 id 20 ip4 192.0.2.20/24`.
- **Agrégation et pont** : types `bond`, `team`, `bridge`.
- Configuration stockée dans `/etc/NetworkManager/system-connections/` (format clé-valeur, droits 600 car elle peut contenir des secrets Wi-Fi).
- **nmcli device wifi list** et **... wifi connect** pour le sans-fil ; les scripts de `dispatcher.d` réagissent aux changements d'état.

## systemd-networkd

Léger et déclaratif, idéal pour les **serveurs**, **conteneurs** et **machines virtuelles** : pas de démon lourd, configuration par fichiers, souvent associé à `systemd-resolved`.

```ini /etc/systemd/network/10-lan.network
[Match]
Name=enp1s0

[Network]
Address=192.0.2.10/24
Gateway=192.0.2.1
DNS=192.0.2.53
DNS=192.0.2.54
```

```bash
sudo systemctl enable --now systemd-networkd systemd-resolved
sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
networkctl list
networkctl status enp1s0
sudo networkctl reload           # relit les fichiers .network
resolvectl status
```

- `.netdev` crée des interfaces virtuelles (VLAN, pont, bond, WireGuard), `.link` renomme et règle les interfaces physiques.
- DHCP : `[Network] DHCP=yes` (ou `ipv4`/`ipv6`).
- Pas de gestion du Wi-Fi : la combiner avec `iwd` si nécessaire.

## ConnMan

**ConnMan** (Connection Manager) vise les **systèmes embarqués** et l'automobile (Linux embarqué, AGL) : faible empreinte, bascule automatique entre réseaux, services intégrés.

```bash
connmanctl                       # mode interactif
connmanctl services
connmanctl connect wifi_xxxx_managed_psk
connmanctl config ethernet_xxxx --ipv4 manual 192.0.2.10 255.255.255.0 192.0.2.1
```

## Choisir

| Contexte | Gestionnaire |
| --- | --- |
| Poste de travail, portable (Wi-Fi, VPN, itinérance) | NetworkManager |
| Serveur, conteneur, machine virtuelle | systemd-networkd |
| Système embarqué, faible empreinte | ConnMan |
| Configuration figée minimale (Debian) | `/etc/network/interfaces` (ifupdown), encore présent |

> [!WARNING]
> Ne pas faire gérer la même interface par deux outils (NetworkManager **et** networkd, ou **et** ifupdown) : adresses qui disparaissent, routes en double, DNS instable. Désactiver le gestionnaire inutilisé, ou marquer l'interface comme non gérée (`[keyfile] unmanaged-devices` pour NetworkManager).

Commandes : [[90-aide-memoire|aide-mémoire]].
