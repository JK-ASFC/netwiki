---
title: Présentation, installation et utilisation
description: OpenSCAP (Red Hat, LGPL) — évaluation automatisée de la conformité et des vulnérabilités selon les standards SCAP (XCCDF, OVAL, DataStreams) : contenus SCAP Security Guide (profils CIS, ANSSI BP-028, STIG DISA, PCI-DSS, HIPAA) pour RHEL, Rocky, Alma, Debian, Ubuntu, SUSE, installation (openscap-scanner, scap-security-guide), oscap xccdf eval (profils, rapports HTML, résultats ARF), remédiation (bash, Ansible, à l'installation avec Anaconda), analyse OVAL des vulnérabilités, SCAP Workbench, conteneurs (oscap-podman), intégration Foreman et CI, et lecture des rapports.
tags: [openscap, scap, conformité, cis, anssi, stig, durcissement, oval]
icon: info
---

**OpenSCAP** vérifie qu'un système respecte un **référentiel de durcissement** (CIS, recommandations **ANSSI BP-028**, STIG, PCI-DSS) et produit un rapport détaillé avec, pour chaque règle non respectée, la **correction** à appliquer (script bash ou tâche Ansible). Il complète [[08-lynis/01-installation-audit|Lynis]] (audit plus général) par une approche normée et reproductible.

## Installation

```bash
sudo dnf install openscap-scanner scap-security-guide          # RHEL/Rocky/Alma/Fedora
sudo apt install openscap-scanner ssg-debian ssg-debderived      # Debian/Ubuntu (contenus parfois plus anciens : sinon versions GitHub de ComplianceAsCode)
ls /usr/share/xml/scap/ssg/content/                              # DataStreams disponibles (ssg-rhel9-ds.xml…)
oscap info /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml | grep -A40 Profiles
```

Windows : pas de scanner OpenSCAP natif (contrôles CIS via d'autres outils). Interface graphique : **SCAP Workbench** (Linux, Windows, macOS) pour choisir un profil, l'adapter et lancer une évaluation locale ou par SSH.

## Évaluer et corriger

```bash
sudo oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_anssi_bp28_intermediary \
  --results-arf arf.xml --report rapport-anssi.html /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml
# Générer les corrections à relire (ne pas les appliquer aveuglément en production)
oscap xccdf generate fix --fix-type ansible --profile xccdf_org.ssgproject.content_profile_cis_server_l1 \
  --output corrections-cis.yml /usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml
oscap xccdf generate fix --fix-type bash --result-id "" arf.xml > corrections.sh     # seulement les règles en échec
```

Durcir **dès l'installation** : dans l'installeur RHEL (Anaconda), section *Security Profile*, ou `%addon com_redhat_oscap` dans un kickstart.

## Vulnérabilités (OVAL)

```bash
wget -O - https://security.access.redhat.com/data/oval/v2/RHEL9/rhel-9.oval.xml.bz2 | bzip2 -d > rhel-9.oval.xml
oscap oval eval --report vulnerabilites.html rhel-9.oval.xml
```

À grande échelle : intégration à Foreman (greffon OpenSCAP), Red Hat Satellite ou analyses planifiées dont les rapports sont centralisés. Conteneurs : `oscap-podman <image> xccdf eval …`.

<!-- CAPTURE: OpenSCAP — rapport HTML (score et règles en échec) | _assets/openscap-rapport.png -->
<!-- CAPTURE: SCAP Workbench — choix du profil et personnalisation | _assets/scap-workbench.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
