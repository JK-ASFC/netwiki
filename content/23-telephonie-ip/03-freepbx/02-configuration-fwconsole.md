---
title: FreePBX — fwconsole, sauvegarde et dépannage
description: Exploiter FreePBX en ligne de commande avec fwconsole (reload, restart, modules, utilisateurs, pare-feu, chown, mises à jour), personnalisations dans les fichiers custom, sauvegarde et restauration (module Backup & Restore), mises à jour, accès aux journaux et à la CLI Asterisk, sécurisation et problèmes fréquents.
tags: [freepbx, fwconsole, asterisk, sauvegarde, cli, dépannage]
icon: terminal
---

## fwconsole

`fwconsole` est l'outil en ligne de commande de FreePBX (à lancer en `root`) :

| Commande | Usage |
| --- | --- |
| `fwconsole reload` | Équivalent du bouton *Apply Config* |
| `fwconsole restart` / `fwconsole start` / `fwconsole stop` | Redémarrer Asterisk et les services FreePBX |
| `fwconsole ma list` | Modules installés et versions |
| `fwconsole ma upgradeall` / `fwconsole ma upgrade <module>` | Mettre à jour les modules |
| `fwconsole ma downloadinstall <module>` | Installer un module |
| `fwconsole ma disable <module>` / `enable` | Désactiver / activer |
| `fwconsole chown` | Réparer les droits des fichiers (après une copie manuelle) |
| `fwconsole firewall list trusted` / `fwconsole firewall add trusted 10.0.99.0/24` | Gérer les zones du pare-feu |
| `fwconsole firewall stop` / `start` | Arrêter le pare-feu (récupération d'accès, provisoire) |
| `fwconsole unlock <session>` | Débloquer une session web |
| `fwconsole userman --syncall --force` | Resynchroniser les annuaires (User Manager, AD/LDAP) |
| `fwconsole notifications --list` | Notifications du tableau de bord |
| `fwconsole setting <PARAMETRE> <valeur>` | Modifier un paramètre avancé |
| `fwconsole backup --backup=<id>` / `fwconsole backup --restore=<fichier>` | Sauvegarde / restauration en CLI |
| `fwconsole --help` | Liste complète |

```bash
fwconsole ma refreshsignatures
fwconsole ma upgradeall && fwconsole reload
asterisk -rx "pjsip show endpoints"
```

## Personnalisations

| Besoin | Fichier |
| --- | --- |
| Dialplan personnalisé | `/etc/asterisk/extensions_custom.conf` (contextes appelables via *Custom Destinations*) |
| Paramètre PJSIP non proposé | `pjsip.endpoint_custom_post.conf`, `pjsip.transports_custom_post.conf` |
| Options globales d'Asterisk | `*_custom.conf` correspondants |

Exemple : ajouter un contexte appelé depuis une *Custom Destination* `custom-meteo,s,1` :

```asterisk
; /etc/asterisk/extensions_custom.conf
[custom-meteo]
exten => s,1,Answer()
 same => n,Playback(custom/meteo-du-jour)
 same => n,Hangup()
```

## Sauvegarde et restauration

*Admin → Backup & Restore* : définir une sauvegarde (modules à inclure, planification, rétention) vers un stockage local, SFTP, FTP, S3 ou Dropbox. Restauration depuis l'interface (téléversement) ou `fwconsole backup --restore`. Testez la restauration sur une machine virtuelle : c'est aussi la méthode de **migration** vers une nouvelle version de FreePBX.

## Mises à jour

- Modules : *Admin → Module Admin → Check Online* (ou `fwconsole ma upgradeall`), planification automatique des mises à jour de sécurité.
- Système : `apt update && apt upgrade` sur FreePBX 17 (Debian).
- Lire les annonces de sécurité Sangoma : des vulnérabilités d'interface web FreePBX ont été exploitées (par exemple en 2025 sur le module Endpoint Manager) — **aucune interface d'administration exposée à Internet**.

## Journaux et diagnostic

| Outil | Usage |
| --- | --- |
| *Reports → Asterisk Logfiles* | Journal `full` dans l'interface |
| `/var/log/asterisk/full` | Journal détaillé (suivi d'un appel par son identifiant `C-xxxxxxxx`) |
| `/var/log/asterisk/freepbx_security.log` | Connexions à l'interface web |
| `asterisk -rvvvvv` | Console Asterisk (voir [[02-asterisk/04-securite-exploitation-cli\|CLI Asterisk]]) |
| `sngrep` | Échelle des messages SIP (souvent préinstallé) |

```bash
grep "C-0000001a" /var/log/asterisk/full | less
sngrep -d any port 5060
```

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Modification sans effet | *Apply Config* oublié | `fwconsole reload` |
| Bannière rouge « Symlink » ou fichiers modifiés | Fichier généré édité à la main | Déplacer la modification dans un `*_custom.conf` |
| Poste ne s'enregistre pas depuis l'extérieur | Pare-feu FreePBX (zone *Internet*), Responsive Firewall | Ajouter le réseau en *Trusted* ou passer par un VPN/SBC |
| Interface web lente ou erreur 500 | Module défectueux, base de données | `fwconsole ma list`, journaux Apache et `freepbx.log` |
| Accès administrateur perdu | Mot de passe oublié | Réinitialiser en base via `fwconsole` (selon version) ou créer un compte avec *User Manager* depuis la CLI |
