---
title: chkrootkit et rkhunter
description: Détection de rootkits sous Linux et BSD — chkrootkit (vérification de binaires système modifiés, interfaces en mode promiscuité, traces de rootkits connus) et rkhunter (Rootkit Hunter : base de propriétés des fichiers, propupd, signatures, permissions, comptes, configuration SSH, ports suspects, rapports et alertes par e-mail, cron), installation, exécution, interprétation des avertissements et faux positifs, limites face aux rootkits modernes et complément avec AIDE, Wazuh et osquery.
tags: [chkrootkit, rkhunter, rootkit, linux, audit, intégrité]
icon: info
---

Ces deux outils historiques recherchent des **traces de rootkits connus** et des modifications suspectes des binaires système. Ils restent utiles en contrôle périodique ou lors d'une investigation, mais ne détectent pas les rootkits récents ou ciblés : combinez-les avec un contrôle d'intégrité ([[03-aide/01-installation-utilisation|AIDE]]), un HIDS ([[05-wazuh/01-presentation-installation|Wazuh]]) et l'inventaire [[16-osquery-fleet/01-presentation-installation|osquery]].

```bash
sudo apt install chkrootkit rkhunter          # Debian/Ubuntu ; RHEL : EPEL (rkhunter, chkrootkit)
```

## chkrootkit

```bash
sudo chkrootkit                 # tous les tests
sudo chkrootkit -q              # seulement les résultats « INFECTED » / suspects
```

## rkhunter

```bash
sudo rkhunter --update          # signatures
sudo rkhunter --propupd         # enregistre l'état actuel des binaires (à faire sur un système sain, puis après chaque mise à jour système)
sudo rkhunter --check --sk --rwo            # vérification, sans pause, avertissements seulement
sudo less /var/log/rkhunter.log
```

```ini
# /etc/rkhunter.conf.local — ajustements pour réduire les faux positifs
MAIL-ON-WARNING=soc@corp.exemple.fr
ALLOW_SSH_ROOT_USER=no
SCRIPTWHITELIST=/usr/bin/egrep
SCRIPTWHITELIST=/usr/bin/fgrep
PKGMGR=DPKG                     # RPM sur RHEL : vérifie les fichiers par le gestionnaire de paquets
```

Debian : `/etc/default/rkhunter` active la vérification quotidienne (`CRON_DAILY_RUN="true"`) et la mise à jour de la base après `apt` (`APT_AUTOGEN="true"`).

> [!NOTE]
> Un avertissement n'est pas une infection : vérifiez le fichier signalé (`dpkg -S`, `rpm -Vf`, empreinte comparée à un système sain). Sur une machine réellement compromise, ne faites pas confiance aux outils locaux : analysez le disque depuis un système sain.

Commandes : [[90-aide-memoire|aide-mémoire]].
