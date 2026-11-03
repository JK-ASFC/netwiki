---
title: VNC (TigerVNC, TightVNC, UltraVNC) et X2Go
description: Prise de main et bureaux distants par VNC et NX — TigerVNC (GPL : serveur par utilisateur vncserver@:1 avec systemd, vncserver.users, x0vncserver pour l'écran existant, client vncviewer), TightVNC (GPL : serveur et visionneuse Windows, déploiement MSI silencieux, mots de passe), UltraVNC (GPL : Windows, authentification par groupes Windows MS-Logon, transfert de fichiers, répéteur, SingleClick pour l'assistance), X2Go (GPL : bureaux Linux rapides par SSH, x2goserver, client Windows, Linux et macOS), tunnels SSH et chiffrement.
tags: [vnc, tigervnc, tightvnc, ultravnc, x2go, bureau distant, assistance]
icon: cast
---

VNC transmet **l'image de l'écran** (protocole RFB, port 5900 + numéro d'écran). Simple et universel, il est **peu sûr par défaut** : mot de passe limité à 8 caractères, flux souvent non chiffré. Toujours le faire passer dans un **tunnel SSH**, un VPN ou [[01-apache-guacamole|Guacamole]].

| Outil | Serveur | Client | Particularités |
| --- | --- | --- | --- |
| **TigerVNC** | Linux (sessions virtuelles ou écran existant), Windows (ancien) | Linux, Windows, macOS | Rapide, TLS/X509 intégré, maintenu |
| **TightVNC** | Windows | Windows, Java | Déploiement MSI simple |
| **UltraVNC** | Windows | Windows | Authentification Windows, transfert de fichiers, répéteur, SingleClick |
| **X2Go** | Linux | Linux, Windows, macOS | Protocole NX **par SSH** : session rapide, son, impression, dossiers partagés |

## TigerVNC (serveur Linux)

```bash
sudo apt install tigervnc-standalone-server tigervnc-common     # Debian/Ubuntu
sudo dnf install tigervnc-server                                # RHEL et dérivés
vncpasswd                                                       # en tant qu'utilisateur
echo ":1=jk" | sudo tee -a /etc/tigervnc/vncserver.users
printf 'session=xfce\nlocalhost\ngeometry=1920x1080\n' > ~/.config/tigervnc/config   # selon la version : ~/.vnc/config
sudo systemctl enable --now vncserver@:1                        # écran :1 → port 5901
```

L'option `localhost` n'accepte que des connexions locales : le client passe par SSH.

```bash
ssh -L 5901:localhost:5901 jk@srv-linux01.corp.exemple.fr
vncviewer localhost:5901            # TigerVNC Viewer (Linux, Windows, macOS)
```

Pour prendre la main sur l'**écran physique** déjà ouvert : `x0vncserver -display :0 -rfbauth ~/.vnc/passwd` (X11 uniquement ; sous Wayland, utiliser le partage d'écran du bureau).

## TightVNC (Windows)

Installer le MSI 64 bits (serveur + visionneuse) ; déploiement silencieux par GPO ou outil de déploiement avec les propriétés documentées par l'éditeur (mot de passe de connexion et d'administration, service, ports). Restreindre les adresses autorisées dans *Access Control* et désactiver les connexions en boucle et l'accès web inutiles.

## UltraVNC (Windows)

Atouts en entreprise :

- **MS-Logon II** : connexion avec un compte Windows/AD membre d'un groupe autorisé, au lieu d'un mot de passe VNC partagé ;
- greffon de chiffrement (SecureVNC) ;
- **transfert de fichiers** et discussion ;
- **répéteur** : relais pour joindre des postes derrière NAT ;
- **SingleClick** : petit exécutable personnalisé que l'utilisateur lance pour ouvrir une session d'assistance sortante vers le technicien (aucune installation).

Paramètres dans `ultravnc.ini` (dossier d'installation), déployable par fichier. Pour une assistance moderne avec relais et inventaire, voir aussi [[06-support-parc/02-rustdesk|RustDesk]] ou [[06-support-parc/03-meshcentral|MeshCentral]].

## X2Go

```bash
sudo apt install x2goserver x2goserver-xsession xfce4     # serveur Debian/Ubuntu (EPEL sur RHEL)
```

Aucun port supplémentaire : X2Go utilise le **SSH** existant (clés, [[01-openssh/03-configuration-durcissement|durcissement]]). Le client `x2goclient` (Linux, Windows, macOS) crée une session avec choix du bureau (Xfce, MATE, LXQt ; GNOME et KDE récents sont mal pris en charge), de la résolution, du son et des dossiers partagés. Les sessions survivent à une déconnexion et peuvent être reprises.

Commandes : [[90-aide-memoire|aide-mémoire]].
