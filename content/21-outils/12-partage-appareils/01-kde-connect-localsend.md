---
title: KDE Connect, GSConnect et LocalSend
description: Relier ordinateurs et téléphones sur le réseau local — KDE Connect (GPL : notifications, presse-papiers, envoi de fichiers, télécommande, commandes à distance, SMS ; Linux, Windows, macOS, Android, iOS ; ports 1714-1764, appairage chiffré, kdeconnect-cli), GSConnect pour GNOME, et LocalSend (MIT : transfert de fichiers chiffré sans Internet ni compte, port 53317, toutes plates-formes) avec la configuration du pare-feu.
tags: [kde connect, gsconnect, localsend, transfert de fichiers, android, ios, réseau local, pare-feu]
icon: share-2
---

| | KDE Connect | LocalSend |
| --- | --- | --- |
| Rôle | Intégration complète poste ↔ téléphone | Transfert de fichiers et de texte uniquement |
| Licence | GPL | MIT |
| Plates-formes | Linux (KDE ; **GSConnect** pour GNOME), Windows, macOS, Android, iOS (fonctions réduites) | Windows, macOS, Linux, Android, iOS |
| Réseau | Même réseau local, TCP et UDP **1714-1764** | Même réseau local, TCP et UDP **53317** (découverte par multidiffusion) |
| Sécurité | Appairage à valider sur les deux appareils, échanges chiffrés (TLS) | HTTPS avec certificat par appareil, acceptation à chaque envoi (paramétrable) |
| Internet / compte | Non | Non |

Ces outils remplacent avantageusement la clé USB ou l'envoi de fichiers par messagerie pour échanger une capture, un fichier de configuration ou un journal entre un poste d'administration et un téléphone.

## KDE Connect

```bash
sudo apt install kdeconnect                     # KDE ou autre bureau (Debian, Ubuntu)
sudo dnf install kde-connect
# GNOME : extension GSConnect (même protocole)
sudo apt install gnome-shell-extension-gsconnect
# Windows : winget install KDE.KDEConnect ; macOS : version beta sur kdeconnect.kde.org
# Téléphone : KDE Connect sur F-Droid, Google Play ou l'App Store
```

Fonctions (selon les greffons activés sur chaque appareil) :

| Fonction | Usage |
| --- | --- |
| Notifications | Les notifications du téléphone s'affichent sur le poste ; réponse aux SMS |
| Presse-papiers partagé | Copier sur l'un, coller sur l'autre |
| Partage de fichiers et d'URL | Envoyer depuis le menu Partager du téléphone ou le gestionnaire de fichiers |
| Navigateur de fichiers | Parcourir le stockage du téléphone depuis le poste (SFTP) |
| Télécommande | Pavé tactile et clavier distants, contrôle des médias et des présentations |
| Commandes | Lancer depuis le téléphone des commandes prédéfinies sur le poste (verrouiller, mettre en veille, script) |
| Localisation | Faire sonner le téléphone |

### Ligne de commande

```bash
kdeconnect-cli --refresh                      # rechercher les appareils
kdeconnect-cli -l                             # appareils connus (id, nom, appairé, joignable)
kdeconnect-cli -a                             # appareils joignables seulement
kdeconnect-cli -d <id> --pair                 # demander l'appairage (à accepter sur le téléphone)
kdeconnect-cli -n "Téléphone" --ping-msg "Sauvegarde terminée"
kdeconnect-cli -n "Téléphone" --share ~/rapport.pdf
kdeconnect-cli -n "Téléphone" --ring
kdeconnect-cli -n "Téléphone" --send-sms "Texte" --destination 0600000000
```

`--ping-msg` permet d'envoyer une notification au téléphone à la fin d'un long traitement.

### Pare-feu

```bash
# firewalld (le service est fourni)
sudo firewall-cmd --permanent --add-service=kdeconnect && sudo firewall-cmd --reload
# ufw
sudo ufw allow 1714:1764/udp && sudo ufw allow 1714:1764/tcp
```

> [!NOTE]
> Les appareils doivent être sur le **même réseau** et la diffusion doit passer : sur un Wi-Fi invité avec isolation des clients, ou entre deux VLAN, la découverte échoue. On peut alors ajouter l'appareil par son adresse IP dans les réglages.

## LocalSend

```bash
winget install LocalSend.LocalSend             # Windows
brew install --cask localsend                  # macOS
flatpak install flathub org.localsend.localsend_app   # Linux
# Android : F-Droid ou Google Play ; iOS : App Store
```

1. Ouvrir LocalSend sur les deux appareils : ils se découvrent automatiquement.
2. Onglet **Envoyer** : choisir fichiers, dossier, texte ou presse-papiers, puis l'appareil.
3. Le destinataire accepte (ou active l'acceptation automatique pour ses propres appareils).

Réglages utiles : nom de l'appareil, dossier de réception, **chiffrement** (activé par défaut), code PIN exigé, **partage via lien** (le destinataire sans LocalSend télécharge depuis son navigateur sur le réseau local).

Pare-feu : autoriser le port **53317** en TCP et UDP sur le poste qui reçoit.

```bash
sudo ufw allow 53317
sudo firewall-cmd --permanent --add-port=53317/tcp --add-port=53317/udp && sudo firewall-cmd --reload
```

## En entreprise

- Ces outils exposent un service d'écoute sur le poste : à autoriser selon la politique de sécurité, idéalement seulement sur les réseaux de confiance (profil de pare-feu « privé » sous Windows).
- Les fichiers ne transitent pas par Internet, mais ils échappent aux outils de prévention des fuites de données (DLP) : vérifier ce qui est admis.

Voir aussi : [[02-barrier-input-leap-synergy|un clavier et une souris pour plusieurs postes]]. Commandes : [[90-aide-memoire|aide-mémoire]].
