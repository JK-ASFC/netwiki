---
title: Rufus et Ventoy — clés USB d'installation
description: Préparer des supports amorçables — Rufus (GPL, Windows : ISO vers clé USB, schéma GPT ou MBR, UEFI ou BIOS, personnalisation de l'installation de Windows 11 sans compte Microsoft ni TPM, partition persistante, vérification des ISO, mode portable) et Ventoy (GPL, Windows et Linux : clé multiboot où l'on copie simplement les ISO, Ventoy2Disk.sh -i -I -u -g, Secure Boot, ventoy.json, installation automatique, persistance), comparaison et bonnes pratiques de l'atelier informatique.
tags: [rufus, ventoy, usb, iso, amorçage, uefi, installation]
icon: usb
---

| | Rufus | Ventoy |
| --- | --- | --- |
| Principe | **Écrit une ISO** sur la clé (effacée à chaque fois) | Installe un chargeur ; on **copie plusieurs ISO** sur la clé |
| Système | Windows (exécutable portable) | Windows, Linux (interface graphique ou script) |
| Points forts | Options d'installation de Windows 11, fiabilité, ISO hybrides | Une seule clé pour Windows, Linux, outils de dépannage |
| Licence | GPL 3.0 | GPL 3.0 |

## Rufus

`winget install --id Rufus.Rufus -e` ou version portable. Choisir le périphérique, l'ISO, le **schéma de partition** (GPT pour UEFI, MBR pour les anciens BIOS) puis *Démarrer*. Pour une ISO Windows 11, Rufus propose de :

- supprimer l'exigence de TPM 2.0, Secure Boot et 4 Go de RAM (matériel ancien, machines de test) ;
- supprimer l'obligation d'un compte Microsoft en ligne et créer un compte local ;
- désactiver la collecte de données et le chiffrement automatique de l'appareil (BitLocker).

Pour les ISO Linux, une **partition persistante** conserve fichiers et réglages. `Alt+…` donne des options avancées (`Alt+E` pour plusieurs partitions sur clés amovibles, etc.) ; le bouton de somme de contrôle vérifie l'ISO téléchargée.

## Ventoy

Linux (archive de la version publiée) :

```bash
lsblk                                         # repérer le disque : /dev/sdb et non /dev/sdb1
sudo sh Ventoy2Disk.sh -i -g /dev/sdb         # installation (GPT), efface la clé
sudo sh Ventoy2Disk.sh -u /dev/sdb            # mise à jour de Ventoy sans toucher aux ISO
sudo sh Ventoy2Disk.sh -l /dev/sdb            # informations
sudo sh Ventoy2Disk.sh -I -r 4096 /dev/sdb    # réinstallation forcée en gardant 4 Go libres en fin de disque
```

Windows : `Ventoy2Disk.exe`. Copier ensuite les fichiers `.iso`, `.wim`, `.vhd(x)` ou `.img` dans la partition exFAT : le menu les liste au démarrage. Le Secure Boot est pris en charge (enregistrer la clé de Ventoy au premier démarrage via MokManager). Le fichier `/ventoy/ventoy.json` règle le thème, les alias, la **persistance** des distributions Linux et l'**installation automatique** (`auto_install` : fichiers `autounattend.xml`, preseed, kickstart).

Ventoy intègre des composants binaires précompilés tiers : dans un environnement sensible, préférer Rufus ou `dd` avec une ISO vérifiée.

## Bonnes pratiques

- Vérifier l'empreinte SHA-256 de chaque ISO (`Get-FileHash`, `sha256sum`) avant de l'écrire.
- Étiqueter les clés et les mettre à jour à chaque nouvelle version de Windows ou de Debian.
- Pour équiper un parc, préférer le déploiement réseau : [[02-fog-opsi-wapt|FOG, opsi, WAPT]] ou [[07-disques-recuperation/02-clonezilla|Clonezilla]].

Commandes : [[90-aide-memoire|aide-mémoire]].
