---
title: TFTP — aide-mémoire des commandes
description: Commandes TFTP avec exemples — serveur tftpd-hpa (options, écriture autorisée, répertoire), atftpd, dnsmasq en TFTP, clients (tftp, atftp, curl), sauvegarde et restauration de configurations d'équipements réseau (Cisco copy running-config tftp:, HPE, Fortinet), PXE, serveur TFTP sous Windows, sécurité et dépannage.
tags: [aide-mémoire, tftp, tftpd-hpa, pxe, cisco, sauvegarde]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|TFTP]].

## Serveur tftpd-hpa

```bash
sudo apt install tftpd-hpa
sudo mkdir -p /srv/tftp && sudo chown tftp:tftp /srv/tftp
```

```ini
# /etc/default/tftpd-hpa
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/srv/tftp"
TFTP_ADDRESS="10.0.99.30:69"
TFTP_OPTIONS="--secure --create --verbose"
```

```bash
sudo systemctl restart tftpd-hpa
sudo ss -lunp | grep :69
sudo journalctl -u tftpd-hpa -f
```

`--create` autorise l'écriture de nouveaux fichiers (sauvegardes des équipements) ; sans lui, le fichier doit exister et être inscriptible.

## Clients

```bash
tftp 10.0.99.30 -c get pxelinux.0                  # client tftp-hpa
tftp 10.0.99.30 -c put sw-paris.cfg
atftp --get --remote-file pxelinux.0 --local-file /tmp/pxelinux.0 10.0.99.30
curl -o /tmp/test.bin tftp://10.0.99.30/test.bin
curl -T sauvegarde.cfg tftp://10.0.99.30/
```

## Équipements réseau

```cisco
copy running-config tftp://10.0.99.30/sw-paris-01.cfg
copy tftp://10.0.99.30/c9300-universalk9.17.12.04.SPA.bin flash:
ip tftp source-interface Vlan99
```

```netcli
# FortiGate
execute backup config tftp fgt-paris.conf 10.0.99.30
# HPE Comware
tftp 10.0.99.30 put startup.cfg sw-comware.cfg
# Aruba AOS-S
copy startup-config tftp 10.0.99.30 sw-aruba.cfg
```

## Windows

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName TFTP           # client tftp.exe
tftp -i 10.0.99.30 get firmware.bin
# Serveur : rôle WDS (TFTP intégré) ou logiciels tiers (Tftpd64)
```

## Sécurité et dépannage

- TFTP n'a **ni authentification ni chiffrement** : réseau d'administration uniquement, filtrage par adresse, répertoire dédié, service arrêté hors des fenêtres d'utilisation si possible ; préférer SCP/SFTP quand l'équipement le permet.
- Pare-feu : UDP 69 puis ports éphémères (module de suivi `nf_conntrack_tftp`).

```bash
sudo tcpdump -ni eth0 udp port 69
```
