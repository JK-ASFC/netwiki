---
title: Présentation, installation et utilisation
description: Uyuni (SUSE, GPL) — gestion de parc Linux multi-distributions, projet amont de SUSE Manager / SUSE Multi-Linux Manager : fonctions (canaux de logiciels et miroirs, gestion des correctifs et errata, gestion de configuration par Salt, états et formules, conformité OpenSCAP et CVE, inventaire, provisionnement, cycle de vie des contenus, tableaux d'actions planifiées), clients pris en charge (SUSE, openSUSE, RHEL et clones, Debian, Ubuntu), installation (conteneurisée sur openSUSE Leap Micro avec mgradm), proxys, enregistrement des clients (clés d'activation, bootstrap Salt), API et spacecmd.
tags: [uyuni, suse manager, salt, correctifs, gestion de parc, linux]
icon: info
---

**Uyuni** gère les **mises à jour** et la **configuration** de parcs Linux hétérogènes depuis une console unique : on y synchronise les dépôts des distributions, on fige des versions par environnement (*Content Lifecycle Management*), on applique les correctifs par lots planifiés et l'on pilote la configuration avec **Salt**. C'est l'amont de **SUSE Manager** (désormais *SUSE Multi-Linux Manager*).

## Installation (serveur conteneurisé)

```bash
# Hôte : openSUSE Leap Micro (recommandé), 8 vCPU, 32 Go RAM, disques séparés pour /var/lib/containers et les dépôts (plusieurs centaines de Go)
sudo transactional-update pkg install mgradm mgradm-bash-completion && sudo reboot
sudo mgradm install podman uyuni.corp.exemple.fr        # questions : mots de passe, e-mail, certificat (AC fournie ou générée)
mgrctl status
```

Interface : `https://uyuni.corp.exemple.fr`. Un **proxy** Uyuni (`mgrpxy`) par site distant met en cache contenus et communications.

## Utilisation

1. *Admin → Setup Wizard → Products* (SUSE) ou **canaux personnalisés** + `spacewalk-common-channels` pour RHEL clones, Debian, Ubuntu ; synchronisation planifiée.
2. **Content Lifecycle Projects** : sources → environnements dev, recette, prod (versions figées).
3. **Clés d'activation** (canaux, groupes, formules) puis enregistrement des clients : *Systems → Bootstrapping* (SSH) ou script de bootstrap.
4. **Patches** : par système ou groupe, actions planifiées, redémarrages ; rapports d'**audit CVE**.
5. **Salt** : états et formules (NTP, utilisateurs, durcissement) appliqués aux groupes, exécution à distance.

Interface : [[02-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
