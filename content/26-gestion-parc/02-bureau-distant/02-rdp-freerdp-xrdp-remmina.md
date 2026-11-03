---
title: RDP sous Linux — FreeRDP, xrdp, Remmina (et RDPY)
description: Utiliser le protocole RDP hors de Windows — FreeRDP 3 (Apache 2.0 : client xfreerdp3 et sdl-freerdp3, options /v /u /d, NLA, passerelle RD Gateway, redirection de lecteurs et presse-papiers, certificats, serveur freerdp-shadow), xrdp (Apache 2.0 : serveur RDP pour bureaux Linux, xorgxrdp, sessions Xfce, TLS, groupe ssl-cert, pare-feu), Remmina (GPL : client graphique RDP, VNC, SSH, SPICE, profils .remmina, Flatpak) et RDPY (Python 2, abandonné : outils de test RDP et pot de miel), avec règles de sécurité RDP.
tags: [rdp, freerdp, xrdp, remmina, rdpy, bureau distant, linux]
icon: monitor
---

| Outil | Rôle | Plates-formes | Licence |
| --- | --- | --- | --- |
| **FreeRDP** | Bibliothèque et client RDP en ligne de commande (base de Remmina et de Guacamole) | Linux, Windows, macOS | Apache 2.0 |
| **xrdp** | **Serveur** RDP pour un bureau Linux | Linux, BSD | Apache 2.0 |
| **Remmina** | Client graphique multi-protocoles | Linux | GPL 2.0 |
| **RDPY** | Implémentation RDP en Python (client, MITM, pot de miel) | Python 2 | GPL 3.0 — **abandonné** |

## FreeRDP (client)

Debian 13 / Ubuntu 24.04 : `apt install freerdp3-x11` (ou `freerdp3-sdl`) ; Fedora/RHEL : `dnf install freerdp` ; macOS : `brew install freerdp` (avec XQuartz) ; Windows : versions publiées du projet.

```bash
xfreerdp3 /v:srv-app01.corp.exemple.fr /u:jk /d:CORP /dynamic-resolution +clipboard
xfreerdp3 /v:srv-app01 /u:jk /d:CORP /f /drive:echange,/home/jk/echange /sound /cert:tofu
xfreerdp3 /v:srv-app01 /u:jk /d:CORP /g:rdgw.corp.exemple.fr /gu:jk /gd:CORP        # via une passerelle RD Gateway
xfreerdp3 /v:srv-app01 /u:jk /d:CORP /app:program:'||Excel'                           # RemoteApp publiée
sdl-freerdp3 /v:srv-app01 /u:jk /d:CORP /size:1920x1080
```

`/cert:tofu` accepte le certificat à la première connexion puis le vérifie (*trust on first use*) ; préférer des certificats émis par la PKI interne. `freerdp-shadow-cli3` partage le bureau X11 courant en RDP (dépannage ponctuel).

## xrdp (serveur RDP Linux)

```bash
sudo apt install xrdp xorgxrdp            # Debian/Ubuntu
sudo dnf install epel-release && sudo dnf install xrdp xorgxrdp      # RHEL, Rocky, Alma
sudo adduser xrdp ssl-cert                # Debian/Ubuntu : accès à la clé TLS
sudo systemctl enable --now xrdp
sudo ufw allow from 10.20.0.0/16 to any port 3389 proto tcp
```

Un utilisateur ne peut pas avoir à la fois une session graphique locale et une session xrdp. Les bureaux légers fonctionnent le mieux : `echo xfce4-session > ~/.xsession` (paquet `xfce4`). Réglages dans `/etc/xrdp/xrdp.ini` (`security_layer=tls`, `certificate=`, `key_file=` pour un certificat de la PKI, `crypt_level=high`) et `/etc/xrdp/sesman.ini` (`AllowRootLogin=false`, `KillDisconnected`, `DisconnectedTimeLimit`). Journaux : `/var/log/xrdp.log`, `/var/log/xrdp-sesman.log`. Ubuntu propose aussi un partage RDP natif de GNOME (*Paramètres → Système → Bureau à distance*).

## Remmina

`sudo apt install remmina remmina-plugin-rdp remmina-plugin-vnc remmina-plugin-secret` ou `flatpak install flathub org.remmina.Remmina`. Profils (RDP, VNC, SSH, SPICE, X2Go via greffon) enregistrés dans `~/.local/share/remmina/*.remmina`, mots de passe dans le trousseau du bureau. Tunnel SSH intégré (onglet *Tunnel SSH*) pour joindre un serveur derrière un bastion. Ligne de commande : `remmina -c rdp://jk@srv-app01.corp.exemple.fr` ou `remmina -c ~/.local/share/remmina/srv-app01.remmina`.

## RDPY

Projet Python 2 sans évolution depuis des années : ne pas l'utiliser en production. Il reste cité pour ses outils de laboratoire (`rdpy-rdpclient`, `rdpy-rdpmitm` pour démontrer l'interception d'une connexion sans NLA, `rdpy-rdphoneypot` pour un pot de miel). Pour des tests de sécurité RDP actuels, préférer FreeRDP, les modules de Nmap (`rdp-enum-encryption`) ou un pot de miel maintenu.

## Sécurité RDP

- **Jamais** de port 3389 ouvert sur Internet : VPN, [[01-apache-guacamole|Guacamole]] ou RD Gateway avec MFA.
- Exiger **NLA** côté Windows et TLS avec certificat de confiance côté xrdp.
- Limiter les comptes autorisés (groupe « Utilisateurs du Bureau à distance », `AllowGroups` équivalents) et surveiller les échecs ([[01-fail2ban/01-presentation-configuration|Fail2ban]] sur `xrdp-sesman.log`).

Commandes : [[90-aide-memoire|aide-mémoire]].
