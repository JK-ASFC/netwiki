---
title: Dropbear et TinySSH
description: Serveurs SSH légers — Dropbear (MIT : serveur et client SSH de quelques centaines de Ko pour OpenWrt, BusyBox, Yocto, initramfs ; dropbearkey, dropbearconvert, options -s, -w, -g, -p, déverrouillage LUKS à distance avec dropbear-initramfs, sur OpenWrt via UCI) et TinySSH (domaine public : serveur minimaliste sans configuration, uniquement Ed25519 et algorithmes modernes, sans mot de passe, lancé par inetd, systemd socket ou tcpserver, tinysshd-makekey) ; différences avec OpenSSH et durcissement.
tags: [dropbear, tinyssh, ssh, embarqué, openwrt, initramfs, luks, durcissement]
icon: terminal-square
---

[[01-openssh/01-presentation|OpenSSH]] reste le serveur SSH de référence. **Dropbear** et **TinySSH** répondent à deux besoins particuliers : une **très faible empreinte** (routeurs, systèmes embarqués, initramfs) et une **surface d'attaque minimale**.

## Dropbear

**Dropbear** fournit un serveur (`dropbear`), un client (`dbclient`) et des outils de clés, dans un exécutable de quelques centaines de Ko. C'est le serveur SSH par défaut d'**OpenWrt** et de nombreux équipements embarqués.

```bash
sudo apt install dropbear-bin                       # Debian/Ubuntu (binaire seul)
dropbearkey -t ed25519 -f /etc/dropbear/dropbear_ed25519_host_key
dropbearkey -y -f /etc/dropbear/dropbear_ed25519_host_key     # affiche la clé publique et l'empreinte
dropbear -F -E -p 2222 -s -g -w -r /etc/dropbear/dropbear_ed25519_host_key   # premier plan, journal sur stderr
dropbearconvert openssh dropbear ~/.ssh/id_ed25519 ~/.ssh/id_dropbear       # convertir une clé OpenSSH
dbclient -i ~/.ssh/id_dropbear admin@routeur
```

| Option | Effet |
| --- | --- |
| `-s` | Interdit l'authentification par mot de passe |
| `-g` | Interdit le mot de passe pour root |
| `-w` | Interdit toute connexion root |
| `-p [adresse:]port` | Adresse et port d'écoute |
| `-j`, `-k` | Interdit les redirections de ports locales / distantes |
| `-K secondes` | Messages de maintien de connexion |

Les clés autorisées se placent dans `~/.ssh/authorized_keys` (même format qu'OpenSSH).

### Sur OpenWrt

```bash
uci show dropbear
uci set dropbear.@dropbear[0].PasswordAuth='off'
uci set dropbear.@dropbear[0].RootPasswordAuth='off'
uci set dropbear.@dropbear[0].Interface='lan'          # n'écouter que côté LAN
uci commit dropbear && /etc/init.d/dropbear restart
cat >> /etc/dropbear/authorized_keys < cle.pub
```

### Déverrouiller un disque chiffré à distance

Sur un serveur au disque chiffré par **LUKS**, Dropbear peut être intégré à l'**initramfs** : on se connecte en SSH au démarrage pour saisir la phrase de passe.

```bash
sudo apt install dropbear-initramfs
sudo tee /etc/dropbear/initramfs/authorized_keys < ~/cle-admin.pub
echo 'DROPBEAR_OPTIONS="-I 180 -j -k -p 2222 -s -c cryptroot-unlock"' | sudo tee -a /etc/dropbear/initramfs/dropbear.conf
# Adresse IP statique pendant le démarrage (sinon DHCP) : /etc/initramfs-tools/initramfs.conf
#   IP=192.0.2.10::192.0.2.1:255.255.255.0:serveur:eno1:off
sudo update-initramfs -u
ssh -p 2222 root@192.0.2.10                 # au redémarrage : demande directement la phrase LUKS
```

Utiliser une **clé hôte différente** de celle du système démarré (l'initramfs n'est pas chiffré) et un port dédié pour éviter les alertes de changement de clé.

## TinySSH

**TinySSH** est un serveur **minimaliste** : pas de fichier de configuration, pas d'authentification par mot de passe, uniquement des **algorithmes modernes** (Ed25519, ECDH Curve25519, ChaCha20-Poly1305, sntrup761x25519 contre les attaques quantiques). Il ne gère ni redirection de ports, ni agent, ni X11 : seulement des sessions et des commandes (dont SFTP via le binaire externe).

```bash
sudo apt install tinysshd                     # le paquet crée les clés et active le socket systemd
sudo tinysshd-makekey /etc/tinyssh/sshkeydir  # (création manuelle des clés hôtes)
sudo systemctl enable --now tinysshd.socket   # écoute sur 22 ; autre port : tinysshd@2222.socket selon la distribution
tinysshd-printkey /etc/tinyssh/sshkeydir      # clé publique de l'hôte
```

- Chaque connexion est un processus lancé par **systemd (socket)**, **inetd** ou **tcpserver** ; il n'y a pas de démon permanent.
- Les utilisateurs se connectent avec une clé **Ed25519** déclarée dans `~/.ssh/authorized_keys` (les clés RSA sont refusées).
- Idéal pour un bastion ou un serveur d'administration où l'on veut le **strict minimum**.

## Comparatif

| Critère | OpenSSH | Dropbear | TinySSH |
| --- | --- | --- | --- |
| Taille | Plusieurs Mo | ~100–500 Ko | ~100 Ko |
| Configuration | `sshd_config` très riche | Options de ligne de commande | Aucune |
| Mot de passe | Oui (désactivable) | Oui (désactivable) | Non |
| Redirections, agent, X11 | Oui | Partiel | Non |
| Usage typique | Serveurs généraux | Routeurs, embarqué, initramfs | Serveurs minimalistes, bastions |

Les règles générales de [[01-openssh/03-configuration-durcissement|durcissement SSH]] s'appliquent : clés uniquement, pas de root direct, filtrage réseau, surveillance des connexions.

Commandes : [[90-aide-memoire|aide-mémoire]].
