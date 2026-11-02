---
title: CasaOS, Runtipi et Umbrel
description: Plateformes d'applications Docker pour serveur personnel — CasaOS (installation par script, tableau de bord, App Store, applications Compose personnalisées, fichiers, ZimaOS), Runtipi (installation, Traefik et certificats, configuration des applications, mises à jour, sauvegarde), Umbrel (umbrelOS, installation sur Linux, App Store, nœud Bitcoin) — interface web, sécurité et emplacements des données.
tags: [casaos, runtipi, umbrel, docker, auto-hébergement, homelab, tableau de bord]
icon: app-window
---

Trois plateformes qui pilotent **Docker** via une interface web et un catalogue d'applications. Elles s'installent sur une Debian ou Ubuntu minimale (ou Raspberry Pi OS 64 bits).

## CasaOS

```bash
curl -fsSL https://get.casaos.io | sudo bash          # installe Docker si nécessaire
```

Interface : `http://<ip>` (création du compte au premier accès). Tableau de bord : widgets (CPU, RAM, stockage, réseau), **App Store** (installation en un clic), **applications personnalisées** (import d'un fichier `docker-compose.yml` ou paramètres d'image, ports, volumes, variables), **Fichiers** (explorateur, partages Samba), stockage (disques, fusion). Données des applications : `/DATA/AppData/<appli>`.

<!-- CAPTURE: CasaOS — tableau de bord avec widgets et applications | _assets/casaos-tableau-de-bord.png -->
<!-- CAPTURE: CasaOS — App Store | _assets/casaos-app-store.png -->
<!-- CAPTURE: CasaOS — installation d'une application personnalisée (Compose) | _assets/casaos-appli-personnalisee.png -->

```bash
casaos-uninstall                       # désinstallation (les conteneurs et /DATA peuvent être conservés)
sudo systemctl status casaos casaos-gateway casaos-app-management
```

**ZimaOS** (même éditeur, IceWhale) est un système complet dérivé de CasaOS pour les NAS ZimaBoard/ZimaCube et le matériel x86.

## Runtipi

```bash
curl -L https://setup.runtipi.io | bash               # installe dans ./runtipi (Docker requis ou installé)
cd runtipi && sudo ./runtipi-cli start
```

Interface : `http://<ip>` ; **App Store** (≈ 300 applications), formulaire de configuration par application (variables, ports, domaine), **exposition** avec un domaine : Traefik intégré et certificats Let's Encrypt (*Settings → Domain*). Données : `runtipi/app-data/<appli>`, configuration `runtipi/user-config/` (surcharges Compose).

<!-- CAPTURE: Runtipi — App Store | _assets/runtipi-app-store.png -->
<!-- CAPTURE: Runtipi — configuration d'une application avec domaine exposé | _assets/runtipi-config-appli.png -->

```bash
sudo ./runtipi-cli update latest       # mise à jour de Runtipi
sudo ./runtipi-cli restart ; sudo ./runtipi-cli app stop nextcloud ; sudo ./runtipi-cli reset-password
```

Sauvegarde : arrêter Runtipi, archiver le dossier `runtipi` complet (base, `app-data`, `user-config`, `.env`).

## Umbrel

**umbrelOS** s'installe comme système complet (image pour Raspberry Pi 5 et x86, ou appareil *Umbrel Home*). Interface : `http://umbrel.local` — tableau de bord, **App Store** (nœud Bitcoin et Lightning, Nextcloud, Immich, Home Assistant, Pi-hole…), widgets, gestionnaire de fichiers, sauvegarde, accès distant par Tor ou Tailscale.

<!-- CAPTURE: Umbrel — tableau de bord umbrelOS | _assets/umbrel-tableau-de-bord.png -->

Licence **PolyForm Noncommercial** : usage personnel, pas d'usage commercial sans accord.

## Sécurité commune

- Interface **jamais exposée** directement sur Internet : VPN ([[05-tailscale-headscale/01-presentation-installation|Tailscale]]) ou proxy inverse avec authentification ([[06-authelia/01-presentation-configuration|Authelia]]).
- Mots de passe par défaut des applications à changer, mises à jour régulières des applications.
- Sauvegarde des dossiers de données vers un autre support ([[01-restic/01-presentation-installation|Restic]], [[02-borgbackup/01-presentation-installation|BorgBackup]]).
- Docker donne un accès root à l'hôte : n'installez que des applications de confiance.
