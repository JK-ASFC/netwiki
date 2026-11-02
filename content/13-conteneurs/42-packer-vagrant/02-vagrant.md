---
title: Vagrant
description: HashiCorp Vagrant (BSL 1.1) — environnements de développement et de test virtualisés reproductibles à partir d'un Vagrantfile : fournisseurs (VirtualBox, libvirt, Hyper-V, VMware, Docker), boxes (Vagrant Cloud, création avec Packer), installation Windows, Linux, macOS, commandes (init, up, ssh, provision, halt, destroy, snapshot), réseau (privé, ponté, redirection de ports), dossiers synchronisés, approvisionnement (shell, Ansible), multi-machines pour simuler une architecture (laboratoire réseau, cluster), et limites (Apple Silicon, Hyper-V).
tags: [vagrant, hashicorp, laboratoire, virtualbox, libvirt, ansible, développement]
icon: info
---

**Vagrant** décrit dans un **Vagrantfile** un ou plusieurs machines virtuelles (image de base, réseau, CPU, mémoire, approvisionnement) : `vagrant up` crée le laboratoire, `vagrant destroy` le supprime. Idéal pour tester des rôles [[01-ansible/01-presentation-installation|Ansible]], simuler une architecture (serveurs web + base + répartiteur) ou former.

## Installation

| Système | Commande | Fournisseur courant |
| --- | --- | --- |
| Windows | `winget install Hashicorp.Vagrant` | Hyper-V ou [[12-virtualbox/01-installation-utilisation\|VirtualBox]] (pas les deux à la fois) |
| Debian/Ubuntu | Dépôt HashiCorp puis `sudo apt install vagrant` | libvirt (`vagrant plugin install vagrant-libvirt`) ou VirtualBox |
| RHEL/Fedora | Dépôt HashiCorp ou `sudo dnf install vagrant` | libvirt |
| macOS | `brew install hashicorp/tap/hashicorp-vagrant` | VMware Fusion, Parallels, VirtualBox (Apple Silicon : boxes ARM requises) |

## Laboratoire multi-machines

```ruby
# Vagrantfile
Vagrant.configure("2") do |config|
  config.vm.box = "bento/debian-12"
  config.vm.provider "libvirt" do |v|
    v.memory = 1024
    v.cpus = 1
  end
  { "web1" => "192.168.56.11", "web2" => "192.168.56.12", "lb" => "192.168.56.10" }.each do |nom, ip|
    config.vm.define nom do |m|
      m.vm.hostname = nom
      m.vm.network "private_network", ip: ip
    end
  end
  config.vm.define "lb" do |lb|
    lb.vm.network "forwarded_port", guest: 80, host: 8080
    lb.vm.provision "ansible" do |a|
      a.playbook = "site.yml"
      a.limit = "all"
    end
  end
end
```

```bash
vagrant up ; vagrant status ; vagrant ssh web1 ; vagrant provision lb
vagrant snapshot save propre ; vagrant snapshot restore propre ; vagrant halt ; vagrant destroy -f
```

Boxes : `vagrant box add bento/ubuntu-24.04`, ou boxes maison construites avec [[01-packer|Packer]] (post-traitement `vagrant`). Commandes : [[90-aide-memoire|aide-mémoire]].
