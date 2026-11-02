---
title: Réseaux, stockage, instantanés et migration
description: Exploitation de KVM avec libvirt — connexions (qemu:///system, qemu+ssh), réseaux virtuels NAT, routé et isolé, pont Linux et VLAN (netplan, NetworkManager), pools et volumes de stockage (répertoire, LVM, NFS, iSCSI), qcow2 et images de base, instantanés, sauvegarde, migration à chaud, passthrough PCI et GPU, démarrage automatique, sécurité (sVirt, SELinux, AppArmor), performances et dépannage.
tags: [libvirt, virsh, kvm, pont, vlan, stockage, migration, instantané, passthrough]
icon: network
---

## Connexions libvirt

| URI | Usage |
| --- | --- |
| `qemu:///system` | VM système de l'hôte (démarrent au boot, réseau ponté) — le cas serveur |
| `qemu:///session` | VM de l'utilisateur courant (sans droits root, réseau limité) — GNOME Boxes l'utilise |
| `qemu+ssh://admin@kvm-01.corp.exemple.fr/system` | Administration à distance par SSH (virsh, virt-manager) |

```bash
export LIBVIRT_DEFAULT_URI=qemu:///system
virsh -c qemu+ssh://admin@kvm-01/system list --all
```

## Réseau

| Type | Comportement | Usage |
| --- | --- | --- |
| **NAT** (`default`, 192.168.122.0/24) | dnsmasq de libvirt fournit DHCP/DNS ; les VM sortent par l'IP de l'hôte | Poste, labo |
| **Routé** | Sous-réseau routé par l'hôte, sans NAT | Réseau de VM annoncé au routeur |
| **Isolé** | Aucune sortie | Tests, maquettes de sécurité |
| **Pont** (*bridge*) | La VM est sur le réseau physique comme un serveur | **Production** |
| **macvtap** | Accès direct à l'interface sans pont (l'hôte ne joint pas ses VM) | Simple, sans reconfiguration réseau |

### Pont Linux avec VLAN (Debian/Ubuntu, netplan)

```yaml /etc/netplan/01-kvm.yaml
network:
  version: 2
  ethernets:
    eno1: {}
  vlans:
    eno1.30:
      id: 30
      link: eno1
  bridges:
    br0:
      interfaces: [eno1]
      addresses: [10.0.20.10/24]
      routes: [{ to: default, via: 10.0.20.1 }]
      nameservers: { addresses: [10.0.10.53], search: [corp.exemple.fr] }
    br30:
      interfaces: [eno1.30]
```

```bash
sudo netplan try          # retour arrière automatique si la connexion est perdue
```

RHEL / Rocky (NetworkManager) :

```bash
nmcli con add type bridge ifname br0 con-name br0 ipv4.method manual ipv4.addresses 10.0.20.10/24 ipv4.gateway 10.0.20.1 ipv4.dns 10.0.10.53
nmcli con add type bridge-slave ifname eno1 master br0
nmcli con up br0
```

### Réseaux libvirt

```bash
virsh net-list --all
virsh net-dumpxml default
virsh net-dhcp-leases default
cat > labo.xml <<'EOF'
<network>
  <name>labo</name>
  <forward mode='nat'/>
  <bridge name='virbr10' stp='on' delay='0'/>
  <ip address='10.99.0.1' netmask='255.255.255.0'>
    <dhcp><range start='10.99.0.100' end='10.99.0.200'/></dhcp>
  </ip>
</network>
EOF
virsh net-define labo.xml && virsh net-start labo && virsh net-autostart labo
```

## Stockage

| Pool | Exemple | Remarque |
| --- | --- | --- |
| Répertoire (`dir`) | `/var/lib/libvirt/images` | Par défaut, fichiers qcow2 |
| LVM (`logical`) | Groupe de volumes `vg_vm` | Volumes bruts performants |
| NFS (`netfs`) | `nas-01:/export/vm` | Stockage partagé → migration à chaud |
| iSCSI | Cible du SAN | Avec multipath |
| ZFS / Ceph RBD | `zvol`, pool Ceph | Instantanés côté stockage |

```bash
virsh pool-define-as vm-nfs netfs --source-host nas-01.corp.exemple.fr --source-path /export/vm --target /var/lib/libvirt/vm-nfs
virsh pool-start vm-nfs && virsh pool-autostart vm-nfs
virsh vol-create-as vm-nfs srv-db-01.qcow2 80G --format qcow2
virsh vol-list vm-nfs
```

### qcow2 et images

```bash
qemu-img info srv-web-01.qcow2
qemu-img create -f qcow2 -F qcow2 -b base-debian13.qcow2 clone-01.qcow2      # image dérivée (copie à l'écriture)
qemu-img convert -O qcow2 -c vieux.vmdk nouveau.qcow2                         # VMware → KVM (VHDX : -f vhdx)
qemu-img resize srv-web-01.qcow2 +20G                                         # puis agrandir la partition dans l'invité
virt-sparsify --in-place srv-web-01.qcow2                                     # récupérer l'espace (libguestfs-tools)
```

## Instantanés et sauvegarde

```bash
virsh snapshot-create-as srv-web-01 avant-maj "Avant mise à jour" --atomic
virsh snapshot-list srv-web-01
virsh snapshot-revert srv-web-01 avant-maj
virsh snapshot-delete srv-web-01 avant-maj
```

Sauvegarde à chaud cohérente : instantané **externe** limité au disque (avec gel du système de fichiers par l'agent invité), copie de l'image figée, puis fusion.

```bash
virsh snapshot-create-as srv-db-01 sauvegarde --disk-only --atomic --quiesce --no-metadata
cp /var/lib/libvirt/images/srv-db-01.qcow2 /sauvegardes/srv-db-01-$(date +%F).qcow2
virsh blockcommit srv-db-01 vda --active --pivot --verbose
virsh dumpxml srv-db-01 > /sauvegardes/srv-db-01.xml
```

libvirt 7.2+ propose aussi `virsh backup-begin` (sauvegardes complètes et incrémentales). Outils dédiés : *virtnbdbackup*, ou les sauvegardes intégrées de [[11-proxmox-ve/03-sauvegarde-securite-exploitation|Proxmox VE]].

## Migration à chaud

Prérequis : stockage partagé (ou copie du disque avec `--copy-storage-all`), même réseau sur les deux hôtes, processeurs compatibles (modèle de CPU commun), horloges synchronisées.

```bash
virsh migrate --live --persistent --undefinesource --verbose srv-web-01 qemu+ssh://kvm-02.corp.exemple.fr/system
# Sans stockage partagé
virsh migrate --live --copy-storage-all --persistent srv-web-01 qemu+ssh://kvm-02/system
```

## Passthrough PCI (GPU, carte réseau, contrôleur)

```bash
# 1. IOMMU : ajouter intel_iommu=on iommu=pt (ou amd_iommu=on) à GRUB_CMDLINE_LINUX puis update-grub
dmesg | grep -e DMAR -e IOMMU
# 2. Identifier le périphérique et son groupe IOMMU
lspci -nn | grep -i nvidia
# 3. Le confier à vfio-pci (identifiants fournisseur:produit)
echo "options vfio-pci ids=10de:2484,10de:228b" | sudo tee /etc/modprobe.d/vfio.conf && sudo update-initramfs -u
# 4. Attacher à la VM
virsh nodedev-list --cap pci | grep 01_00
virsh attach-device srv-ia-01 gpu.xml --config
```

## Démarrage automatique et ressources

```bash
virsh autostart srv-web-01
virsh setvcpus srv-web-01 4 --config --maximum && virsh setvcpus srv-web-01 4 --config
virsh setmaxmem srv-web-01 8G --config && virsh setmem srv-web-01 8G --config
virsh domstats srv-web-01 --vcpu --balloon --block
```

## Sécurité

- **sVirt** : chaque VM a son contexte SELinux (RHEL) ou profil AppArmor (Debian/Ubuntu) ; ne pas désactiver SELinux, déplacer plutôt les images dans un dossier étiqueté (`semanage fcontext -a -t virt_image_t "/vm(/.*)?"` puis `restorecon -R /vm`).
- Accès à libvirt = droits root sur l'hôte : limitez le groupe `libvirt`, préférez `qemu+ssh` avec clés et comptes nominatifs.
- Consoles VNC/SPICE : écoute sur `127.0.0.1` (tunnel SSH) ou mot de passe + TLS.

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| `KVM: disabled by BIOS` / `/dev/kvm` absent | Activer VT-x/AMD-V dans le BIOS ; vérifier `virt-host-validate` |
| VM très lente | Accélération absente (TCG) : `virsh dumpxml vm \| grep type=` doit montrer `kvm` ; pilotes virtio manquants dans l'invité |
| `Permission denied` sur l'image | Image hors de `/var/lib/libvirt/images` : contexte SELinux ou AppArmor, propriétaire `libvirt-qemu`/`qemu` |
| Pas d'adresse IP dans le réseau NAT | Pare-feu de l'hôte (nftables/firewalld) qui bloque dnsmasq ; `virsh net-start default` |
| Migration refusée (CPU) | Modèle de processeur `host-passthrough` : passer à un modèle commun (`virsh domcapabilities`) |

Journaux : `/var/log/libvirt/qemu/<vm>.log`, `journalctl -u libvirtd` (ou `-u virtqemud`). Commandes : [[90-aide-memoire|aide-mémoire]].
