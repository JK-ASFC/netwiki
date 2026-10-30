---
title: Serveur Terraria
description: Héberger un serveur Terraria — serveur dédié officiel (Windows, Linux, macOS) et TShock (administration, comptes, droits, API REST), installation sous Linux avec un utilisateur dédié et systemd (tmux), Docker, fichier serverconfig.txt (monde, mot de passe, port 7777, nombre de joueurs), commandes d'administration, sauvegarde des mondes, sécurité et dépannage.
tags: [terraria, serveur de jeux, tshock, serverconfig, systemd, sauvegarde]
icon: gamepad
---

**Terraria** propose un **serveur dédié** gratuit (fourni avec le jeu ou téléchargeable sur le site officiel) pour jouer à plusieurs (jusqu'à 255 joueurs théoriques, en pratique 8 à 16). **TShock** est une surcouche communautaire qui ajoute administration, comptes, groupes de droits, protection de zones et une API REST.

## Installation sous Linux

```bash
sudo apt install unzip tmux
sudo useradd -r -m -d /srv/terraria -s /bin/bash terraria
sudo -iu terraria
# Télécharger l'archive du serveur dédié depuis terraria.org (lien « PC Dedicated Server ») puis :
unzip terraria-server-*.zip -d serveur
chmod +x serveur/*/Linux/TerrariaServer.bin.x86_64
```

```text /srv/terraria/serverconfig.txt
world=/srv/terraria/Mondes/MondeAsso.wld
autocreate=2
worldname=MondeAsso
difficulty=0
maxplayers=8
port=7777
password=MotDePasseServeurPartie
motd=Bienvenue sur le serveur de l'association
worldpath=/srv/terraria/Mondes
secure=1
language=fr-FR
upnp=0
```

| Paramètre | Rôle |
| --- | --- |
| `autocreate` | Taille du monde à créer s'il n'existe pas (1 petit, 2 moyen, 3 grand) |
| `password` | Mot de passe demandé aux joueurs |
| `secure=1` | Protection anti-triche de base |
| `upnp=0` | Pas d'ouverture automatique de port sur le routeur |

```ini /etc/systemd/system/terraria.service
[Unit]
Description=Serveur Terraria
After=network-online.target

[Service]
Type=forking
User=terraria
WorkingDirectory=/srv/terraria
ExecStart=/usr/bin/tmux new-session -d -s terraria '/srv/terraria/serveur/1449/Linux/TerrariaServer.bin.x86_64 -config /srv/terraria/serverconfig.txt'
ExecStop=/usr/bin/tmux send-keys -t terraria "exit" Enter
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Le numéro de dossier (`1449`) correspond à la version du serveur. Console : `sudo -u terraria tmux attach -t terraria` (détacher avec <kbd>Ctrl</kbd>+<kbd>B</kbd> puis <kbd>D</kbd>).

**Windows** : `TerrariaServer.exe -config serverconfig.txt` (ou depuis le jeu via Steam). **Docker** : images communautaires (ex. `ryshe/terraria` pour TShock).

## Commandes du serveur

```text Console
help
playing           liste des joueurs
save              sauvegarde du monde
kick Pseudo
ban Pseudo
password NouveauMotDePasse
say Redémarrage dans 5 minutes
exit              sauvegarde et arrêt
```

## TShock

TShock remplace le binaire officiel (version correspondante du jeu) et ajoute :

- **comptes** joueurs (`/register`, `/login`) et premier administrateur via un jeton de configuration affiché au démarrage (`/setup <jeton>`) ;
- **groupes** et permissions (`/group addperm`), protection de zones (`/region`), journal des actions, bannissements par IP/compte ;
- **API REST** (à garder locale, jeton fort) et greffons.

## Sauvegarde

```bash
# Les mondes (.wld) et leurs sauvegardes (.wld.bak) dans worldpath
sudo -u terraria tmux send-keys -t terraria "save" Enter && sleep 5
tar czf /srv/sauvegardes/terraria/mondes-$(date +%F).tgz -C /srv/terraria Mondes
```

## Sécurité et dépannage

- [ ] Mot de passe de serveur (ou comptes TShock) ; port **7777/TCP** seul exposé, UPnP désactivé
- [ ] API REST de TShock locale uniquement
- [ ] Utilisateur dédié, sauvegardes régulières hors du serveur, version à jour

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Les joueurs ne se connectent pas | Port 7777 non redirigé, version du client différente | Redirection, même version du jeu et du serveur |
| Le serveur demande le monde au démarrage | Chemin `world` erroné, `autocreate` absent | Corriger le chemin, `autocreate` |
| Caractères accentués illisibles | Encodage du fichier de configuration | Enregistrer en UTF-8 |
| Monde corrompu après un arrêt brutal | Arrêt sans sauvegarde | Restaurer `.wld.bak` ou la sauvegarde |
