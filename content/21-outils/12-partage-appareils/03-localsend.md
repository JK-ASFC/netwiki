---
title: LocalSend
description: LocalSend, transfert de fichiers et de messages entre appareils du réseau local sans cloud — installation Windows (winget), macOS (Homebrew), Linux (Flatpak, AUR, DEB), Android, iOS, port 53317 TCP et UDP, pare-feu, protocole HTTPS, client localsend-cli.
tags: [localsend, transfert fichiers, réseau local, airdrop, winget, flatpak, homebrew]
icon: send
---

**LocalSend** (licence Apache-2.0) est une alternative libre à AirDrop : il envoie des fichiers, dossiers, textes et messages entre appareils d'un **même réseau local**, sans internet ni serveur tiers. Les appareils dialoguent via une API REST en **HTTPS** ; chacun génère son certificat à la volée. Pour intégrer un téléphone au poste (notifications, SMS) : [[01-kde-connect|KDE Connect]].

## Port

| Port | Protocole | Usage |
| --- | --- | --- |
| 53317 | TCP et UDP, entrant | Découverte et transfert |

Le trafic sortant n'a pas de restriction de port. Désactiver l'**isolation des clients** (*AP isolation*) du Wi-Fi sinon les appareils ne se voient pas.

## Installation

| Système | Commande |
| --- | --- |
| Windows | `winget install LocalSend.LocalSend` (ou Scoop, Chocolatey, installateur EXE, ZIP portable) |
| macOS | `brew install --cask localsend` (ou App Store, DMG) |
| Linux | `flatpak install flathub org.localsend.localsend_app` ; AUR `localsend-bin` ; Nixpkgs ; AppImage, DEB ou TAR depuis les *releases* GitHub |
| Android | Google Play, F-Droid ou APK |
| iOS | App Store |
| BSD, conteneur | Pas de paquet officiel documenté ; VM ou client `localsend-cli` |

L'application ne se met pas à jour seule : privilégier un magasin d'applications ou un gestionnaire de paquets.

Pare-feu :

```bash
sudo ufw allow 53317
sudo firewall-cmd --permanent --add-port=53317/tcp --add-port=53317/udp
sudo firewall-cmd --reload
```

```powershell
New-NetFirewallRule -DisplayName "LocalSend" -Direction Inbound -Protocol TCP -LocalPort 53317 -Action Allow -Profile Private
New-NetFirewallRule -DisplayName "LocalSend UDP" -Direction Inbound -Protocol UDP -LocalPort 53317 -Action Allow -Profile Private
```

## Interface graphique

Onglet **Recevoir** : alias de l'appareil, option *Réception rapide*, dossier de destination. Onglet **Envoyer** : choisir fichiers, dossier ou texte, puis cliquer sur l'appareil détecté (ou saisir son adresse IP) ; le destinataire accepte le transfert.

<!-- CAPTURE: Onglet Envoyer avec les appareils détectés | _assets/localsend-envoyer.png -->
<!-- CAPTURE: Onglet Paramètres, alias et dossier de réception | _assets/localsend-parametres.png -->

## Ligne de commande

Le projet `localsend-cli` (protocole LocalSend v2) envoie fichiers, dossiers et textes à un appareil désigné par son alias ou son IP ; il s'installe avec Homebrew (macOS et Linux). Consulter son aide pour la syntaxe exacte.

## Dépannage

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Aucun appareil trouvé | Pare-feu ou isolation Wi-Fi | Ouvrir 53317 TCP/UDP, désactiver l'isolation |
| Découverte impossible entre VLAN | Diffusion non routée | Saisir l'adresse IP manuellement |
