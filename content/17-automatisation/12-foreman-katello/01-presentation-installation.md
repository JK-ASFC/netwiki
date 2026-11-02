---
title: Présentation, installation et utilisation
description: Foreman et Katello (GPL) — gestion du cycle de vie des serveurs : Foreman (provisionnement bare metal et VM par PXE/iPXE et modèles kickstart, preseed, autoinstall, cloud-init ; ressources de calcul VMware, Proxmox, libvirt, oVirt ; Smart Proxy DHCP, DNS, TFTP ; inventaire et faits ; intégration Puppet, Ansible, Salt, OpenSCAP ; exécution à distance), Katello (dépôts Yum/Apt/conteneurs synchronisés, vues de contenu, environnements de cycle de vie, clés d'activation, errata et correctifs, enregistrement des hôtes), installation (foreman-installer sur RHEL/Alma/Rocky), hammer CLI et base de Red Hat Satellite.
tags: [foreman, katello, provisionnement, pxe, correctifs, satellite, hammer]
icon: info
---

**Foreman** gère un serveur de sa **naissance** (provisionnement PXE ou VM à partir de modèles) à sa **configuration** (Puppet, [[01-ansible/01-presentation-installation|Ansible]], exécution de commandes à distance) et à sa **conformité** (OpenSCAP). **Katello**, son greffon, ajoute la gestion des **contenus** : miroirs de dépôts, vues figées par environnement (dev → recette → prod) et suivi des **correctifs**. L'ensemble est la base libre de **Red Hat Satellite**.

## Installation (Alma/Rocky 9, serveur dédié)

```bash
sudo hostnamectl set-hostname foreman.corp.exemple.fr        # FQDN résolvable dans les deux sens, 4 vCPU, 20 Go RAM pour Katello
sudo dnf install https://yum.theforeman.org/releases/3.13/el9/x86_64/foreman-release.rpm \
  https://yum.theforeman.org/katello/4.15/katello/el9/x86_64/katello-repos-latest.rpm \
  https://yum.puppet.com/puppet8-release-el-9.noarch.rpm      # versions compatibles : voir la matrice du projet
sudo dnf install foreman-installer-katello
sudo foreman-installer --scenario katello --foreman-initial-admin-password 'MdpInitial2026' \
  --enable-foreman-plugin-ansible --enable-foreman-proxy-plugin-ansible --enable-foreman-plugin-remote-execution
```

Interface : `https://foreman.corp.exemple.fr`. Smart Proxies supplémentaires (sites distants) pour DHCP, DNS, TFTP et contenu.

## Contenus et correctifs (Katello)

```bash
hammer product create --name "Rocky 9" --organization "Corp"
hammer repository create --product "Rocky 9" --name BaseOS --content-type yum --url https://dl.rockylinux.org/pub/rocky/9/BaseOS/x86_64/os/ --organization "Corp"
hammer repository synchronize --product "Rocky 9" --name BaseOS --organization "Corp"
hammer content-view create --name cv-rocky9 --repositories BaseOS,AppStream --product "Rocky 9" --organization "Corp"
hammer content-view publish --name cv-rocky9 --organization "Corp"
hammer content-view version promote --content-view cv-rocky9 --to-lifecycle-environment Recette --organization "Corp"
hammer activation-key create --name ak-rocky9-recette --content-view cv-rocky9 --lifecycle-environment Recette --organization "Corp"
# Sur un hôte : enregistrement par la commande générée dans Hosts → Register Host (curl … | bash)
```

Les hôtes ne voient que les paquets de **leur** version de vue : on teste les mises à jour en recette, puis on promeut la même version en production.

Interface : [[02-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
