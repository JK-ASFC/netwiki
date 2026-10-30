---
title: Configuration et usages (PXE, équipements réseau)
description: Options de tftpd-hpa (secure, create, umask, permissive, map-file, blocksize, port-range), dépôt de fichiers par les équipements, réécriture de chemins, arborescence PXE BIOS/UEFI, sauvegarde et restauration de configurations Cisco (copy, archive), mise à jour de firmware et provisionnement de téléphones IP.
tags: [tftp, tftpd-hpa, pxe, cisco, sauvegarde configuration, firmware, map-file]
icon: settings-2
---

## Options de tftpd-hpa

| Option | Effet |
| --- | --- |
| `--secure` (`-s`) | Le répertoire devient la **racine** (chroot) : les clients demandent `pxelinux.0`, pas `/srv/tftp/pxelinux.0` |
| `--create` (`-c`) | Autorise la création de nouveaux fichiers (sinon seuls les fichiers existants et inscriptibles peuvent être écrasés) |
| `--umask 022` (`-u`) | Droits des fichiers créés |
| `--permissive` (`-p`) | Ne vérifie que les droits Unix effectifs, sans exiger qu'un fichier soit accessible à tous |
| `--map-file <f>` (`-m`) | Réécriture des noms demandés (expressions régulières) |
| `--blocksize <n>` (`-B`) | Taille de bloc maximale acceptée (ex. `1468`) |
| `--port-range 50000:50100` (`-R`) | Plage des ports éphémères du serveur (pare-feu) |
| `--address 10.0.0.5:69` (`-a`) | Adresse d'écoute |
| `--verbose` (`-v`, répétable) | Journalisation des transferts dans syslog |
| `--refuse <option>` (`-r`) | Refuser une option (ex. `blksize` pour des clients bogués) |

## Autoriser les dépôts (sauvegardes d'équipements)

```text /etc/default/tftpd-hpa
TFTP_USERNAME="tftp"
TFTP_DIRECTORY="/srv/tftp"
TFTP_ADDRESS="10.0.0.5:69"
TFTP_OPTIONS="--secure --create --umask 027 --verbose --port-range 50000:50100"
```

```bash
sudo mkdir -p /srv/tftp/sauvegardes
sudo chown tftp:tftp /srv/tftp/sauvegardes && sudo chmod 750 /srv/tftp/sauvegardes
sudo systemctl restart tftpd-hpa
```

Sans `--create`, le fichier doit **préexister** et être inscriptible par tous (`touch fichier && chmod 666 fichier`) : comportement historique qui surprend souvent.

## Réécriture des chemins

```text /etc/tftpd.map
# Barres obliques inverses des clients Windows / PXE Microsoft → barres obliques
rg \\ /
# Supprimer un préfixe absolu demandé par certains clients
r ^/srv/tftp/
# Tout en minuscules (systèmes de fichiers sensibles à la casse)
# r .* \L\0
```

Ajoutez `--map-file /etc/tftpd.map` aux options.

## Arborescence PXE

```text /srv/tftp (exemple BIOS + UEFI)
/srv/tftp/
├── pxelinux.0                 # BIOS (syslinux)
├── ldlinux.c32
├── pxelinux.cfg/default
├── efi64/
│   ├── shimx64.efi            # UEFI avec Secure Boot
│   ├── grubx64.efi
│   └── grub/grub.cfg
├── ipxe.efi / undionly.kpxe   # iPXE : chaîne vers HTTP (plus rapide)
└── images/debian-12/{linux,initrd.gz}
```

Le serveur DHCP indique l'adresse du serveur TFTP (`next-server` / option 66) et le fichier selon l'architecture du client (option 93 : BIOS = 0, UEFI x64 = 7) — voir [[01-isc-dhcp/01-presentation|ISC DHCP]] et [[03-dnsmasq/04-pxe-tftp|dnsmasq]]. Pour les gros fichiers (noyau, initrd, images), chaînez vers **iPXE + HTTP**.

## Équipements Cisco

```cisco
! Source des requêtes TFTP (interface de gestion)
ip tftp source-interface Vlan99
ip tftp blocksize 8192
!
! Sauvegarde ponctuelle
copy running-config tftp://10.0.0.5/sauvegardes/sw-core-01.cfg
! Restauration dans la configuration de démarrage
copy tftp://10.0.0.5/sauvegardes/sw-core-01.cfg startup-config
!
! Sauvegarde automatique à chaque « write memory » et tous les jours
archive
 path tftp://10.0.0.5/sauvegardes/$h-$t
 write-memory
 time-period 1440
!
! Mise à jour d'image
copy tftp://10.0.0.5/images/cat9k_iosxe.17.12.04.SPA.bin flash:
```

Équivalents : `copy running-config tftp <ip> <fichier>` (Aruba/HPE), `file copy` (Juniper), `execute backup config tftp` (FortiGate), ou l'interface web des équipements.

> [!WARNING]
> Une configuration sauvegardée contient des **secrets** (hachages de mots de passe, clés pré-partagées, communautés SNMP). Le répertoire TFTP ne doit être accessible qu'en écriture depuis le réseau de gestion ; déplacez les fichiers vers un stockage protégé (et versionné) après chaque sauvegarde, ou préférez **SCP** (`copy running-config scp://…`) et un outil comme Oxidized.

## Téléphones IP et autres équipements

| Équipement | Fichiers servis |
| --- | --- |
| Téléphones Cisco | `SEP<MAC>.cnf.xml`, firmwares (option DHCP 150 = serveur TFTP) |
| Téléphones Yealink / Poly | Fichiers `<MAC>.cfg` (option 66, souvent HTTP(S) aujourd'hui) |
| Points d'accès, onduleurs, IPMI | Firmwares, configurations |
