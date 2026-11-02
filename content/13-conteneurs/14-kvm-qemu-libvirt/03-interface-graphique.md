---
title: Interface graphique (virt-manager, GNOME Boxes, Cockpit)
description: Gérer KVM/libvirt à la souris — virt-manager (connexion locale ou SSH, assistant de création, détails matériels, réseaux et stockage, console SPICE/VNC, instantanés, migration), GNOME Boxes pour le poste de travail, Cockpit et son module Machines pour l'administration web, équivalents en ligne de commande.
tags: [virt-manager, gnome boxes, cockpit, libvirt, kvm, interface graphique]
icon: app-window
---

Trois interfaces graphiques s'appuient sur libvirt ; elles voient les mêmes machines que `virsh` (connexion `qemu:///system`).

| Outil | Pour qui | Installation |
| --- | --- | --- |
| **virt-manager** | Administrateur : création détaillée, matériel, réseaux, stockage, plusieurs hôtes | `apt install virt-manager` · `dnf install virt-manager` · `brew install virt-manager` (client distant sous macOS) |
| **GNOME Boxes** | Poste de travail : VM en quelques clics, téléchargement d'ISO intégré | `apt install gnome-boxes` · Flatpak `org.gnome.Boxes` |
| **Cockpit** (*Machines*) | Administration **web** d'un serveur sans bureau | `apt install cockpit cockpit-machines` puis `https://serveur:9090` |

## virt-manager

### Connexion

*Fichier → Ajouter une connexion* : hyperviseur **QEMU/KVM**, cocher *Se connecter à un hôte distant via SSH*, utilisateur et nom d'hôte (`admin@kvm-01.corp.exemple.fr`). Une clé SSH évite la saisie répétée du mot de passe.

<!-- CAPTURE: virt-manager — fenêtre principale avec deux hôtes et la liste des machines | _assets/virt-manager-fenetre-principale.png -->

### Créer une machine virtuelle

1. *Créer une nouvelle machine virtuelle* → source : média local (ISO), installation réseau, **image disque existante** (image cloud) ou import.
2. Système d'exploitation détecté automatiquement (sinon saisir « Debian 12 », « Windows 11 »…).
3. Mémoire et processeurs, puis disque (taille, pool de stockage).
4. Dernière étape : nom, réseau (NAT `default`, pont `br0`) et **cocher *Personnaliser la configuration avant l'installation*** pour choisir UEFI, virtio et TPM.

<!-- CAPTURE: virt-manager — assistant de création, étape 1 (choix de la source d'installation) | _assets/virt-manager-assistant-source.png -->
<!-- CAPTURE: virt-manager — personnalisation avant installation (Aperçu : chipset Q35, microprogramme UEFI) | _assets/virt-manager-personnalisation-uefi.png -->

### Détails matériels

Bouton *Afficher les détails du matériel virtuel* (icône ampoule) :

| Rubrique | Réglages utiles |
| --- | --- |
| Aperçu | Chipset **Q35**, microprogramme **UEFI** (choix possible uniquement avant installation) |
| CPU | *Copier la configuration du processeur de l'hôte* (`host-passthrough`), topologie |
| Disque | Bus **VirtIO**, mode de cache, *discard* |
| NIC | Source réseau (NAT, pont, macvtap), modèle **virtio** |
| Affichage / Vidéo | SPICE + QXL ou Virtio ; VNC pour les clients sans SPICE |
| Ajouter du matériel | TPM (émulé, CRB, v2.0), périphérique PCI/USB de l'hôte (passthrough), canal *qemu-ga* |

<!-- CAPTURE: virt-manager — détails matériels d'une VM Windows 11 (TPM et disque VirtIO) | _assets/virt-manager-details-materiel.png -->

### Réseaux et stockage de l'hôte

*Édition → Détails de la connexion* : onglets **Réseaux virtuels** (créer un réseau NAT, routé ou isolé, démarrage automatique) et **Stockage** (ajouter un pool répertoire, LVM, NFS ou iSCSI, créer des volumes).

<!-- CAPTURE: virt-manager — détails de la connexion, onglet Stockage avec un pool NFS | _assets/virt-manager-pools-stockage.png -->

### Console, instantanés et migration

- **Console** : clavier et souris capturés (*Ctrl+Alt* pour libérer), envoi de *Ctrl+Alt+Suppr* par le menu *Envoyer une touche*.
- **Instantanés** : bouton *Gérer les instantanés* (dernier bouton de la barre de la VM) → créer, revenir, supprimer.
- **Migration** : clic droit sur la VM → *Migrer* vers un autre hôte connecté (stockage partagé ou copie du disque).

<!-- CAPTURE: virt-manager — gestion des instantanés d'une machine | _assets/virt-manager-instantanes.png -->

## GNOME Boxes

Conçu pour le poste de travail : bouton **+** → *Créer une machine virtuelle* → choisir un système dans la liste (téléchargement automatique de l'ISO) ou un fichier local ; installation **express** (compte et mot de passe saisis à l'avance pour les systèmes reconnus). Les VM tournent en **session utilisateur** (`qemu:///session`) : elles ne démarrent pas avec la machine et n'apparaissent pas dans `virsh -c qemu:///system`.

<!-- CAPTURE: GNOME Boxes — liste des machines et assistant de création | _assets/gnome-boxes-creation.png -->

## Cockpit — module Machines

Interface web légère livrée avec RHEL, Rocky, Alma, Fedora et disponible sur Debian/Ubuntu :

```bash
sudo apt install cockpit cockpit-machines        # ou : sudo dnf install cockpit cockpit-machines
sudo systemctl enable --now cockpit.socket
sudo firewall-cmd --add-service=cockpit --permanent && sudo firewall-cmd --reload   # RHEL et dérivés
```

Connexion sur `https://kvm-01.corp.exemple.fr:9090` avec un compte du serveur (droits *sudo* pour l'administration). Rubrique **Machines virtuelles** : créer (ISO, URL, image cloud avec cloud-init), console VNC/série dans le navigateur, disques, interfaces réseau, instantanés, réseaux et pools de stockage.

<!-- CAPTURE: Cockpit — rubrique Machines virtuelles avec la console d'une VM | _assets/cockpit-machines-console.png -->

## Correspondance interface ↔ ligne de commande

| Action | virt-manager / Cockpit | Commande |
| --- | --- | --- |
| Créer une VM | Assistant de création | `virt-install …` |
| Démarrer / arrêter proprement | Boutons Lecture / Arrêt | `virsh start vm` / `virsh shutdown vm` |
| Modifier la mémoire | Détails → Mémoire | `virsh setmem vm 8G --config` |
| Instantané | Gérer les instantanés | `virsh snapshot-create-as vm nom` |
| Ouvrir la console | Ouvrir | `virt-viewer vm` ou `virsh console vm` |
| Migrer | Clic droit → Migrer | `virsh migrate --live vm qemu+ssh://hote/system` |

Commandes détaillées : [[90-aide-memoire|aide-mémoire]].
