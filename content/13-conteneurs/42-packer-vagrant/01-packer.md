---
title: Packer
description: HashiCorp Packer (BSL 1.1) — création automatisée d'images de machines identiques pour plusieurs plates-formes : modèles HCL2 (packer, source, build, variables), plugins (vSphere, Proxmox, Hyper-V, QEMU, VirtualBox, AWS, Azure, Docker), installation automatique de l'OS (preseed, autoinstall Ubuntu, kickstart, autounattend Windows via HTTP intégré ou disquette/CD), approvisionneurs (shell, Ansible, PowerShell, windows-restart), post-traitements, packer init/fmt/validate/build, sysprep et généralisation, intégration CI et Terraform.
tags: [packer, hashicorp, images, modèles, vsphere, proxmox, iac]
icon: info
---

**Packer** fabrique des **modèles de VM** (et images cloud ou conteneur) à partir d'un fichier de configuration : installation automatique du système, durcissement, agents, mises à jour, puis conversion en modèle. Chaque image est reproductible et versionnée ; [[04-terraform/01-presentation-installation|Terraform]] ou [[01-ansible/01-presentation-installation|Ansible]] déploient ensuite à partir de ces modèles. Licence **BSL 1.1** depuis 2023 (usage interne libre).

## Installation

| Système | Commande |
| --- | --- |
| Debian/Ubuntu | Dépôt `apt.releases.hashicorp.com` puis `sudo apt install packer` |
| RHEL | Dépôt `rpm.releases.hashicorp.com` puis `sudo dnf install packer` |
| Windows | `winget install Hashicorp.Packer` |
| macOS | `brew install hashicorp/tap/packer` |

## Modèle Proxmox (Ubuntu autoinstall)

```hcl
packer {
  required_plugins {
    proxmox = { source = "github.com/hashicorp/proxmox", version = ">= 1.2.0" }
    ansible = { source = "github.com/hashicorp/ansible", version = ">= 1.1.0" }
  }
}

variable "pm_token" { sensitive = true }

source "proxmox-iso" "ubuntu" {
  proxmox_url              = "https://pve1.corp.exemple.fr:8006/api2/json"
  username                 = "packer@pve!jeton"
  token                    = var.pm_token
  node                     = "pve1"
  vm_name                  = "modele-ubuntu-2404"
  template_description     = "Ubuntu 24.04 — construit par Packer le ${timestamp()}"
  boot_iso { iso_file = "local:iso/ubuntu-24.04.2-live-server-amd64.iso" }
  memory                   = 4096
  cores                    = 2
  disks { disk_size = "30G", storage_pool = "ceph-vm", type = "scsi" }
  network_adapters { bridge = "vmbr0", model = "virtio", vlan_tag = "20" }
  http_directory           = "http"                       # user-data et meta-data servis par Packer
  boot_command             = ["<wait>e<down><down><down><end> autoinstall ds=nocloud-net\;s=http://{{ .HTTPIP }}:{{ .HTTPPort }}/<F10>"]
  ssh_username             = "packer"
  ssh_private_key_file     = "~/.ssh/id_packer"
  ssh_timeout              = "30m"
  cloud_init               = true
  cloud_init_storage_pool  = "ceph-vm"
}

build {
  sources = ["source.proxmox-iso.ubuntu"]
  provisioner "ansible" { playbook_file = "./durcissement.yml" }
  provisioner "shell" { inline = ["sudo cloud-init clean", "sudo truncate -s 0 /etc/machine-id"] }
}
```

```bash
packer init . ; packer fmt . ; packer validate -var-file=prod.pkrvars.hcl .
packer build -var-file=prod.pkrvars.hcl .
```

Windows : fichier `autounattend.xml` sur un CD virtuel, approvisionneurs `powershell` et `windows-restart`, **sysprep** en fin de construction.

Suite : [[02-vagrant|Vagrant]] · [[90-aide-memoire|aide-mémoire]].
