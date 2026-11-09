---
title: Barrier, Input Leap et Synergy
description: Partager un clavier et une souris entre plusieurs ordinateurs (logiciel KVM) avec Barrier, Input Leap et Synergy Core — différences et état des projets, installation Windows, Linux, macOS, BSD, configuration serveur et clients, port 24800, chiffrement TLS, pare-feu, limites Wayland.
tags: [barrier, input leap, synergy, kvm logiciel, clavier souris, linux, windows, macos, wayland]
icon: mouse-pointer-2
---

Ces trois logiciels transforment un réseau local en **KVM logiciel** : un seul clavier et une seule souris contrôlent plusieurs postes ; le curseur passe d'un écran à l'autre en franchissant le bord, et le presse-papiers peut suivre. L'ordinateur qui possède le clavier est le **serveur** ; les autres sont des **clients**.

## Les trois projets

| Projet | Origine | État |
| --- | --- | --- |
| **Synergy Core** | Projet historique, édition libre (GPL) de Synergy | Produit commercial Synergy par ailleurs ; vérifier la branche libre utilisée |
| **Barrier** | Fork de Synergy 1.9 | Dépôt actif ; seules les versions 2.3.4 et ultérieures sont prises en charge |
| **Input Leap** | Fork de Barrier | Successeur de Barrier ; dépôt archivé en lecture seule à la dernière vérification |

Les trois partagent le même principe, le même port et une configuration très proche. Installer **le même produit** sur tous les postes.

## Installation

| Système | Barrier | Input Leap |
| --- | --- | --- |
| Windows 10/11 (64 bits) | Installateur des *releases* GitHub | Installateur des *releases* GitHub |
| macOS ≥ 10.12 | Paquet des *releases* GitHub | Paquet des *releases* GitHub |
| Debian / Ubuntu | `sudo apt install barrier` | `sudo apt install input-leap` (si présent dans la version) |
| Fedora / RHEL | `sudo dnf install barrier` | Paquet de la distribution ou Flatpak |
| Arch | Dépôt de la distribution | Dépôt de la distribution ou AUR |
| Flatpak / Snap | Disponibles pour Barrier | Flatpak selon la distribution |
| FreeBSD / OpenBSD | Fonctionne (paquet `pkg` ou ports) | Fonctionne |
| Conteneur, Kubernetes | Non adapté (accès au clavier et à l'écran) | Non adapté |

Rechercher le paquet exact avec le gestionnaire de la distribution : le nom varie.

## Configuration

1. **Serveur** : lancer l'application, *Configurer le serveur*, ajouter un écran par client, **avec exactement le nom de la machine** (sensible à la casse), puis les placer dans la grille selon leur disposition physique.
2. **Clients** : saisir l'adresse IP du serveur (ou utiliser la configuration automatique Bonjour).
3. Au premier contact, comparer l'empreinte TLS affichée puis l'accepter.

Charger une configuration enregistrée en ligne de commande :

```bash
barriers --config /home/alice/barrier.conf
input-leaps --config /home/alice/input-leap.conf
```

Si le champ de l'adresse du serveur du client reste vide, ajouter dans la section `options` du fichier de configuration : `serverhostname=10.0.1.10`.

## Réseau et sécurité

| Port | Protocole | Usage |
| --- | --- | --- |
| 24800 | TCP | Serveur (valeur par défaut de la famille Synergy) |

```bash
sudo firewall-cmd --permanent --add-port=24800/tcp
sudo firewall-cmd --reload
sudo ufw allow from 10.0.1.0/24 to any port 24800 proto tcp
```

```powershell
New-NetFirewallRule -DisplayName "Partage clavier souris" -Direction Inbound -Protocol TCP -LocalPort 24800 -Action Allow -Profile Private
```

Activer le chiffrement TLS et vérifier l'empreinte du serveur ; ne jamais exposer le port hors du réseau local.

## Interface graphique

<!-- CAPTURE: Fenêtre principale en mode serveur | _assets/barrier-serveur.png -->
<!-- CAPTURE: Configuration du serveur, grille des écrans | _assets/barrier-grille-ecrans.png -->

## Limites

- **Wayland** : le presse-papiers n'est pas partagé et le glisser-déposer ne fonctionne pas sous Linux ; Barrier ne prend pas en charge Wayland. Préférer une session X11.
- Prise en charge limitée d'UTF-8 ; les combinaisons AltGr échouent souvent d'un serveur Linux vers un client Windows.
- Le verrouillage du défilement (*Scroll Lock*) empêche le changement d'écran.

| Symptôme | Cause | Correction |
| --- | --- | --- |
| Le client ne se connecte pas | Nom d'écran différent ou port 24800 filtré | Faire correspondre le nom exact, ouvrir le port |
| Curseur bloqué sur le serveur | Scroll Lock actif | Le désactiver |
| Pas de presse-papiers | Session Wayland | Passer en X11 |

Pour un partage de fichiers entre postes : [[03-localsend|LocalSend]].
