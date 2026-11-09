---
title: KDE Connect
description: KDE Connect, intégration téléphone et poste de travail (Windows, Linux, macOS, Android, iOS) — installation, appairage, partage de fichiers, notifications, presse-papiers, commandes à distance, ports 1714-1764 TCP et UDP, pare-feu, kdeconnect-cli et dépannage.
tags: [kde connect, android, ios, notifications, partage fichiers, gsconnect, linux, windows, macos]
icon: smartphone
---

**KDE Connect** (logiciel libre) relie un téléphone et un ou plusieurs postes sur le **réseau local** : transfert de fichiers et de liens, synchronisation des notifications, réponse aux SMS, presse-papiers partagé, télécommande multimédia, pavé tactile et clavier virtuels, commandes prédéfinies (verrouiller l'écran), fonction « faire sonner mon téléphone ». Pour du partage de fichiers sans appairage permanent : [[03-localsend|LocalSend]]. Environnement natif : [[13-kde-plasma/01-presentation-installation|KDE Plasma]].

## Ports

| Port | Protocole | Usage |
| --- | --- | --- |
| 1714-1764 | UDP | Découverte des appareils |
| 1714-1764 | TCP | Échanges chiffrés après appairage |

Les deux appareils doivent être sur le même réseau, sans isolation des clients Wi-Fi ni filtrage de la diffusion UDP.

## Installation

| Système | Méthode |
| --- | --- |
| Linux (toutes distributions) | Paquet de la distribution : `sudo apt install kdeconnect`, `sudo dnf install kdeconnect`, `sudo pacman -S kdeconnect`, `sudo zypper install kdeconnect-kde` |
| GNOME | Extension **GSConnect** à la place du démon KDE |
| Budgie, Cinnamon, LXDE, Pantheon… | Paquet ci-dessus + `kdeconnect-indicator` en démarrage automatique |
| Windows, macOS | Téléchargement depuis [kdeconnect.kde.org](https://kdeconnect.kde.org/) |
| Android | Google Play ou F-Droid |
| iOS | App Store |
| BSD, conteneur, Kubernetes | Paquet de la distribution BSD (`pkg install kdeconnect-kde`) si disponible ; non adapté au conteneur |

Pare-feu (poste Linux) :

```bash
sudo firewall-cmd --permanent --zone=home --add-service=kdeconnect
sudo firewall-cmd --reload
sudo ufw allow from 192.168.1.0/24 to any port 1714:1764 proto tcp
sudo ufw allow from 192.168.1.0/24 to any port 1714:1764 proto udp
```

Windows :

```powershell
New-NetFirewallRule -DisplayName "KDE Connect" -Direction Inbound -Protocol TCP -LocalPort 1714-1764 -Action Allow -Profile Private
New-NetFirewallRule -DisplayName "KDE Connect UDP" -Direction Inbound -Protocol UDP -LocalPort 1714-1764 -Action Allow -Profile Private
```

> [!WARNING]
> N'ouvrir ces ports que sur le profil réseau privé ou le sous-réseau de confiance, jamais sur la zone publique.

## Interface graphique

1. Ouvrir KDE Connect sur le poste et sur le téléphone (même réseau).
2. L'appareil apparaît dans la liste : **Demander l'appairage**, puis accepter sur l'autre appareil.
3. Activer les modules voulus (notifications, fichiers, presse-papiers, commandes) ; chaque module demande ses autorisations sur le téléphone.

<!-- CAPTURE: Page KDE Connect des Paramètres système avec un téléphone appairé | _assets/kde-connect-appareils.png -->
<!-- CAPTURE: Liste des modules d'un appareil appairé | _assets/kde-connect-modules.png -->

## Ligne de commande

L'outil `kdeconnect-cli` pilote le démon (voir `kdeconnect-cli --help` pour la liste complète) :

```bash
kdeconnect-cli --list-devices
kdeconnect-cli --device ID_APPAREIL --ping
kdeconnect-cli --device ID_APPAREIL --share /home/alice/rapport.pdf
kdeconnect-cli --device ID_APPAREIL --ring
```

`ID_APPAREIL` s'obtient avec `--list-devices`.

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Appareils invisibles | Pare-feu ou diffusion UDP bloquée, réseaux différents | Ouvrir 1714-1764 ; tester `nc -z -v IP_TELEPHONE 1714-1764` |
| Plantage à l'appairage | Configuration corrompue | Arrêter `kdeconnectd`, sauvegarder puis supprimer `~/.config/kdeconnect` |
| Démon sans écran (serveur) | Pas d'affichage | Démarrer avec `-platform offscreen` |
| Réseau isolant les clients | Isolation AP Wi-Fi | Désactiver l'isolation ou utiliser un VPN |
