---
title: Lynis — aide-mémoire des commandes
description: Commandes Lynis avec exemples — audit système (audit system, --quick, --pentest), catégories et tests individuels (show categories, show groups, --tests), rapport et indice de durcissement (lynis-report.dat, hardening_index, suggestions et avertissements), profils personnalisés (ignorer des tests), audit planifié, mise à jour.
tags: [aide-mémoire, lynis, audit, durcissement, linux, sécurité]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-audit|Lynis]].

## Audits

```bash
sudo lynis audit system
sudo lynis audit system --quick                    # sans pause
sudo lynis audit system --pentest                  # en non-privilégié (vue d'un attaquant)
sudo lynis audit system --tests-from-group "ssh firewalls"
sudo lynis audit system --tests "SSH-7408 AUTH-9286"
sudo lynis show categories
sudo lynis show groups
sudo lynis show details SSH-7408
lynis show version
lynis update info
```

## Exploiter le rapport

```bash
sudo grep hardening_index /var/log/lynis-report.dat
sudo grep -E "^warning\[\]" /var/log/lynis-report.dat
sudo grep -E "^suggestion\[\]" /var/log/lynis-report.dat | cut -d'|' -f1,2 | head -30
sudo less /var/log/lynis.log                        # déroulé détaillé
```

## Profil personnalisé

```text
# /etc/lynis/custom.prf
skip-test=FILE-6310
skip-test=SSH-7408:port
config:ssh_daemon_config_file:/etc/ssh/sshd_config
```

## Planification

```bash
echo '30 5 * * 1 root /usr/bin/lynis audit system --cronjob > /var/log/lynis-hebdo.log 2>&1' | sudo tee /etc/cron.d/lynis
```

Comparez l'indice de durcissement d'une semaine sur l'autre et traitez en priorité les **avertissements**, puis les suggestions pertinentes pour le rôle du serveur.
