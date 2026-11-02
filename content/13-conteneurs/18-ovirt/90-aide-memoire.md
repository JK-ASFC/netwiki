---
title: oVirt — aide-mémoire des commandes
description: Commandes oVirt avec exemples — installation et configuration du moteur (engine-setup, engine-config), sauvegarde et restauration (engine-backup), mises à jour (engine-upgrade-check), moteur auto-hébergé (hosted-engine --deploy, --vm-status, --set-maintenance), hôtes et VDSM (vdsm-client, systemctl), journaux, API REST avec curl et collection Ansible ovirt.ovirt.
tags: [aide-mémoire, ovirt, engine-setup, hosted-engine, vdsm, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|oVirt]].

## Moteur

```bash
dnf install -y https://resources.ovirt.org/pub/yum-repo/ovirt-release45.rpm
dnf install -y ovirt-engine
engine-setup
engine-setup --offline                     # reconfigurer sans chercher de mises à jour
engine-config -l | less                    # paramètres disponibles
engine-config -g MaxNumOfVmSockets
engine-config -s VdsmSSLProtocol=TLSv1.2 && systemctl restart ovirt-engine
systemctl status ovirt-engine
engine-upgrade-check && dnf update ovirt\*setup\* && engine-setup
engine-backup --mode=backup --scope=all --file=engine-$(date +%F).tar.gz --log=backup.log
engine-backup --mode=restore --file=engine-2026-11-02.tar.gz --log=restore.log --provision-all-databases --restore-permissions
ovirt-engine-extension-aaa-ldap-setup      # ajouter un annuaire LDAP / Active Directory
```

## Moteur auto-hébergé

```bash
hosted-engine --deploy
hosted-engine --vm-status
hosted-engine --set-maintenance --mode=global    # avant intervention sur le moteur
hosted-engine --set-maintenance --mode=none
hosted-engine --vm-start ; hosted-engine --vm-shutdown
hosted-engine --console
```

## Hôtes (VDSM)

```bash
dnf install -y ovirt-host
systemctl status vdsmd supervdsmd
vdsm-client Host getVMList
vdsm-client Host getCapabilities | less
vdsm-tool configure --force
```

## Journaux

```bash
tail -f /var/log/ovirt-engine/engine.log          # moteur
tail -f /var/log/vdsm/vdsm.log                    # hôte
ls /var/log/ovirt-engine/setup/                   # engine-setup
ls /var/log/ovirt-hosted-engine-setup/            # hosted-engine
```

## API REST

```bash
API=https://engine.corp.exemple.fr/ovirt-engine/api
AUTH='admin@ovirt@internalsso:MotDePasse'
curl -sk -u "$AUTH" -H 'Accept: application/json' "$API/vms?search=name%3Dsrv-*" | python3 -m json.tool
curl -sk -u "$AUTH" -H 'Content-Type: application/xml' -X POST -d '<action/>' "$API/vms/<id>/start"
curl -sk -u "$AUTH" -H 'Accept: application/json' "$API/hosts" | python3 -m json.tool | grep -e '"name"' -e '"status"'
```

## Ansible

```bash
ansible-galaxy collection install ovirt.ovirt
```

```yaml
- hosts: localhost
  tasks:
    - ovirt.ovirt.ovirt_auth:
        url: https://engine.corp.exemple.fr/ovirt-engine/api
        username: admin@ovirt@internalsso
        password: "{{ vault_ovirt_password }}"
    - ovirt.ovirt.ovirt_vm:
        auth: "{{ ovirt_auth }}"
        name: srv-web-01
        template: debian13-modele
        cluster: CLUSTER-PARIS
        state: running
```
