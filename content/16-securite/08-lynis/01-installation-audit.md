---
title: Installation, audit et durcissement
description: Lynis (CISOfy), outil d'audit de sécurité pour Linux, macOS et Unix — installation (paquets, dépôt officiel, archive), lancement d'un audit système, lecture du rapport (avertissements, suggestions, indice de durcissement), profils personnalisés, automatisation et suivi dans le temps, et principaux points de durcissement relevés.
tags: [lynis, audit, durcissement, conformité, cis, linux, macos]
icon: info
---

**Lynis** (CISOfy, GPLv3) audite la configuration d'un système **sans agent ni modification** : plus de 300 contrôles (démarrage, noyau, authentification, comptes, SSH, pare-feu, journaux, services, systèmes de fichiers, logiciels malveillants, cryptographie, conformité). Il produit des **avertissements**, des **suggestions** chiffrées en identifiants de tests, et un **indice de durcissement**. Idéal pour mesurer un serveur avant mise en production et suivre l'effet du durcissement.

## Installation

| Méthode | Commande |
| --- | --- |
| Debian / Ubuntu | `sudo apt install lynis` (version parfois ancienne) |
| Dépôt CISOfy (version récente) | Dépôt `packages.cisofy.com` pour Debian/Ubuntu et RHEL |
| Archive / Git (sans installation) | `git clone https://github.com/CISOfy/lynis && cd lynis && sudo ./lynis audit system` |
| macOS | `brew install lynis` |

Windows n'est pas pris en charge (utilisez les référentiels CIS/Microsoft Security Baselines, *Microsoft Defender Vulnerability Management* ou HardeningKitty).

## Lancer un audit

```bash
sudo lynis audit system
sudo lynis audit system --quick          # sans pause entre les sections
sudo lynis show details SSH-7408         # détail d'un test
sudo lynis show version
```

| Résultat | Emplacement |
| --- | --- |
| Rapport détaillé (format clé=valeur) | `/var/log/lynis-report.dat` |
| Journal d'exécution | `/var/log/lynis.log` |

```bash
sudo grep -E '^(warning|suggestion)\[\]' /var/log/lynis-report.dat | head -40
sudo grep hardening_index /var/log/lynis-report.dat
```

## Lire les résultats

| Élément | Interprétation |
| --- | --- |
| **Warnings** | Problèmes importants à corriger en priorité |
| **Suggestions** | Améliorations (avec identifiant de test et lien vers l'explication) |
| Indice de durcissement | Score de 0 à 100 : indicateur de progression, pas une certification |

### Constats fréquents

| Domaine | Exemples de suggestions |
| --- | --- |
| SSH | Désactiver la connexion root, `MaxAuthTries`, `AllowTcpForwarding`, algorithmes — voir [[01-openssh/03-configuration-durcissement\|durcissement OpenSSH]] |
| Comptes | Durée de validité des mots de passe, `umask`, comptes sans mot de passe |
| Noyau | Paramètres `sysctl` (`kernel.kptr_restrict`, `net.ipv4.conf.all.rp_filter`, redirections ICMP) |
| Journaux | Envoi distant (syslog), `auditd` |
| Intégrité | Outil d'intégrité absent → [[03-aide/01-installation-utilisation\|AIDE]] |
| Logiciels | Mises à jour en attente, dépôts sans signature, compilateurs installés sur un serveur |
| Systèmes de fichiers | Options `nodev,nosuid,noexec` pour `/tmp`, `/var/tmp`, `/dev/shm` |

## Profil personnalisé

```text /etc/lynis/custom.prf
# Ignorer des tests non pertinents pour ce type de serveur
skip-test=FIRE-4512
skip-test=USB-1000
# Paramètres
machine-role=server
```

## Automatiser et suivre

```ini /etc/systemd/system/lynis-audit.service
[Unit]
Description=Audit Lynis

[Service]
Type=oneshot
ExecStart=/usr/bin/lynis audit system --cronjob --quiet
```

```ini /etc/systemd/system/lynis-audit.timer
[Timer]
OnCalendar=weekly
Persistent=true

[Install]
WantedBy=timers.target
```

Conservez les rapports datés (ou envoyez l'indice dans la supervision) pour suivre l'évolution. **Lynis Enterprise** ajoute un tableau de bord central, des plans de conformité et le suivi d'un parc.

> [!NOTE]
> Corrigez les constats par **gestion de configuration** (Ansible : rôles de durcissement CIS/ANSSI) plutôt qu'à la main, pour que les serveurs restent conformes dans le temps.
