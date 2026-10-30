---
title: Nessus
description: Tenable Nessus, scanner de vulnérabilités commercial — éditions (Essentials gratuite limitée à 16 adresses, Professional, Expert, Tenable Vulnerability Management et Security Center), installation (Linux, Windows, macOS, Docker), activation et mises à jour des plugins, modèles de politiques, analyses authentifiées Windows et Linux (prérequis), audits de conformité (CIS), agents Nessus, lecture et priorisation des résultats (VPR, CVSS), cadre et bonnes pratiques.
tags: [nessus, tenable, vulnérabilités, scanner, analyse authentifiée, conformité, cis]
icon: shield-alert
---

**Nessus** (Tenable) est l'un des scanners de vulnérabilités les plus utilisés : base de plugins très riche et rapidement mise à jour, analyses authentifiées précises, audits de conformité. Alternative libre : [[02-reseau-diagnostic/08-greenbone-openvas|Greenbone]].

| Édition | Usage |
| --- | --- |
| **Essentials** | Gratuite, **16 adresses IP**, usage personnel/formation |
| **Professional** | Consultant / auditeur, adresses illimitées, un utilisateur |
| Expert | + surface d'attaque externe, infrastructure as code |
| **Tenable Vulnerability Management** (cloud) / **Security Center** (sur site) | Entreprise : plusieurs scanners, agents, tableaux de bord, suivi de la remédiation, RBAC |

## Installation

```bash
# Linux : paquet téléchargé depuis le site de Tenable
sudo dpkg -i Nessus-10.*-ubuntu1604_amd64.deb      # ou rpm -ivh … (RHEL)
sudo systemctl enable --now nessusd
# Interface : https://serveur:8834 → choix de l'édition, code d'activation, compte administrateur, téléchargement des plugins
```

Windows et macOS : installateur ; Docker : image `tenable/nessus`. Les plugins se mettent à jour automatiquement (accès à `plugins.nessus.org` ou mise à jour hors ligne pour les réseaux isolés : `nessuscli update fichier.tar.gz`).

## Politiques et analyses

| Modèle | Usage |
| --- | --- |
| *Host Discovery* | Découverte des hôtes et services |
| **Basic Network Scan** | Analyse générale |
| **Advanced Scan** | Tout paramétrer (familles de plugins, performances) |
| *Credentialed Patch Audit* | Correctifs manquants via identifiants |
| *Policy Compliance Auditing* | Conformité (benchmarks **CIS**, DISA STIG, configurations personnalisées) |
| Modèles ciblés (ransomware, Log4Shell…) | Vérifications thématiques lors d'alertes |

**Performances** : nombre d'hôtes et de vérifications simultanés, option *safe checks* (activée par défaut) qui évite les tests susceptibles de planter un service.

## Analyses authentifiées

| Cible | Prérequis |
| --- | --- |
| **Windows** | Compte du domaine dédié, membre des **administrateurs locaux** (GPO), service *Registre à distance* démarrable, partage `ADMIN$`, **WMI** et SMB autorisés par le pare-feu depuis le scanner, UAC distant compatible (compte de domaine) |
| **Linux / Unix** | Compte SSH par **clé**, élévation `sudo` (commandes nécessaires), shell standard |
| Équipements réseau | Comptes en lecture (SSH) pour Cisco, Juniper, Fortinet, Palo Alto… |
| VMware, bases de données | Comptes API / base en lecture |

Le plugin **19506** (*Nessus Scan Information*) et **21745** / **110385** indiquent si l'authentification a réussi ou partiellement échoué : vérifiez-les avant de conclure.

## Agents

Les **agents Nessus** (gestion par Tenable VM ou Security Center) analysent localement les machines nomades ou difficiles à joindre (portables, cloud) sans compte d'analyse ni ouverture réseau.

## Lire les résultats

- Gravité **CVSS** (Critique, Élevée, Moyenne, Faible, Info) et, dans les produits Tenable, **VPR** (*Vulnerability Priority Rating*) qui intègre l'exploitation réelle.
- Regrouper par **solution** (*Remediations* : « installer la mise à jour cumulative X corrige 40 vulnérabilités »).
- Distinguer les constats **de configuration** (SMB signing, TLS 1.0, certificats auto-signés) des **correctifs** manquants.
- Exporter (HTML, CSV, `.nessus` XML), comparer deux analyses, suivre la remédiation dans l'outil de tickets.

## Bonnes pratiques

- [ ] Autorisation et calendrier d'analyse validés ; information du SOC (et liste blanche du scanner dans l'IDS si nécessaire)
- [ ] Comptes d'analyse dédiés, mots de passe longs et tournants, droits minimaux ; jamais un compte d'administrateur de domaine
- [ ] Analyses authentifiées régulières (hebdomadaires) + analyse externe depuis Internet
- [ ] Mettre à jour le scanner lui-même ; interface 8834 limitée au réseau d'administration
