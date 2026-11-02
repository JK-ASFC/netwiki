---
title: OpenSCAP — aide-mémoire des commandes
description: Commandes oscap avec exemples — info (profils), xccdf eval (--profile, --rule, --results-arf, --report, --tailoring-file, --remediate), xccdf generate fix (ansible, bash, kickstart), xccdf generate report, oval eval, ds sds-validate, oscap-ssh (évaluation distante), oscap-podman, et autotailor pour adapter un profil.
tags: [aide-mémoire, openscap, oscap, scap]
icon: terminal
---

Explications : [[01-presentation-installation|OpenSCAP]].

```bash
DS=/usr/share/xml/scap/ssg/content/ssg-rhel9-ds.xml
oscap info $DS ; oscap info --profile xccdf_org.ssgproject.content_profile_cis_server_l1 $DS
sudo oscap xccdf eval --profile PROFIL --results-arf arf.xml --report rapport.html $DS
sudo oscap xccdf eval --profile PROFIL --rule xccdf_org.ssgproject.content_rule_sshd_disable_root_login $DS
sudo oscap xccdf eval --profile PROFIL --remediate --results-arf apres.xml $DS          # corriger automatiquement (laboratoire)
oscap xccdf generate fix --fix-type ansible --profile PROFIL $DS > durcissement.yml ; oscap xccdf generate report arf.xml > rapport.html
autotailor --unselect xccdf_org.ssgproject.content_rule_partition_for_tmp --output perso.xml $DS PROFIL
sudo oscap xccdf eval --tailoring-file perso.xml --profile PROFIL_customized $DS
oscap-ssh root@srv-web-01 22 xccdf eval --profile PROFIL --report distant.html $DS ; oscap ds sds-validate $DS
```
