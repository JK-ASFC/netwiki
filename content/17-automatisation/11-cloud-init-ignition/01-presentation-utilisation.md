---
title: Présentation et utilisation
description: Initialisation des machines au premier démarrage — cloud-init (Canonical : sources de données NoCloud, ConfigDrive, OpenStack, Azure, AWS, VMware GuestInfo, Proxmox ; user-data cloud-config : utilisateurs, clés SSH, paquets, fichiers, commandes, réseau v2, montages, growpart ; meta-data ; images cloud Debian, Ubuntu, RHEL, Windows avec Cloudbase-Init ; cloud-init status, schema, clean, journaux) et Ignition (Fedora CoreOS, Flatcar, RHCOS : configuration JSON exécutée une seule fois depuis l'initramfs, écrite en Butane YAML puis convertie), avec exemples Proxmox et VMware.
tags: [cloud-init, ignition, butane, coreos, flatcar, provisioning, user-data]
icon: info
---

Une VM créée à partir d'une **image** générique doit recevoir son identité au premier démarrage : nom, adresse, comptes, clés SSH, paquets. **cloud-init** le fait pour la plupart des distributions (et tous les clouds) ; **Ignition** le fait pour les systèmes immuables (Fedora CoreOS, Flatcar, Red Hat CoreOS).

## cloud-init

```yaml
#cloud-config
hostname: srv-web-03
fqdn: srv-web-03.corp.exemple.fr
timezone: Europe/Paris
users:
  - name: admin
    groups: [sudo]
    shell: /bin/bash
    sudo: "ALL=(ALL) NOPASSWD:ALL"
    ssh_authorized_keys: ["ssh-ed25519 AAAA… jk@poste"]
ssh_pwauth: false
package_update: true
packages: [qemu-guest-agent, chrony, nginx]
write_files:
  - path: /etc/chrony/sources.d/corp.sources
    content: "server ntp1.corp.exemple.fr iburst\n"
runcmd:
  - [systemctl, enable, --now, qemu-guest-agent]
  - [systemctl, restart, chrony]
```

```yaml
# network-config (format v2)
version: 2
ethernets:
  ens18:
    addresses: [10.0.20.33/24]
    routes: [{ to: default, via: 10.0.20.1 }]
    nameservers: { addresses: [10.0.10.53], search: [corp.exemple.fr] }
```

Transmission selon la plate-forme :
- **Proxmox VE** : onglet *Cloud-Init* de la VM (ou `qm set 9000 --cicustom "user=local:snippets/user-data.yaml"`), voir [[11-proxmox-ve/01-presentation-installation|Proxmox]].
- **VMware** : propriétés `guestinfo.userdata` / `guestinfo.metadata` (encodées en base64) ou personnalisation vSphere.
- **NoCloud** : ISO étiquetée `cidata` contenant `user-data`, `meta-data` et `network-config` (`cloud-localds`).

```bash
cloud-init status --wait --long ; cloud-init schema --config-file user-data.yaml --annotate
sudo cat /var/log/cloud-init-output.log ; sudo cloud-init clean --logs --seed   # avant de transformer une VM en modèle
```

Windows : **Cloudbase-Init** joue le même rôle (mêmes formats de user-data, scripts PowerShell).

## Ignition et Butane

```yaml
# serveur.bu (Butane) — converti en Ignition JSON
variant: fcos
version: 1.5.0
passwd:
  users:
    - name: core
      ssh_authorized_keys: ["ssh-ed25519 AAAA… jk@poste"]
storage:
  files:
    - path: /etc/hostname
      contents: { inline: noeud-01 }
systemd:
  units:
    - name: application.service
      enabled: true
      contents: |
        [Service]
        ExecStart=/usr/bin/podman run --rm --name app -p 8080:8080 registry.corp.exemple.fr/infra/app:1.0
        [Install]
        WantedBy=multi-user.target
```

```bash
butane --pretty --strict serveur.bu > serveur.ign      # binaire ou conteneur quay.io/coreos/butane
coreos-installer install /dev/sda --ignition-file serveur.ign
```

Ignition ne s'exécute **qu'une fois**, avant le démarrage du système : une modification ultérieure passe par une réinstallation (philosophie immuable) ou un outil de configuration.

Commandes : [[90-aide-memoire|aide-mémoire]].
