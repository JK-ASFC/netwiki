---
title: Pools, stockage, réseau et sauvegarde
description: Exploitation de XCP-ng — création d'un pool et ajout d'hôtes, dépôts de stockage (SR local EXT/LVM, NFS, iSCSI, HBA, XOSTOR), multipath, réseaux et VLAN, agrégats (bond), réseau de migration, migration à chaud et de stockage, haute disponibilité, instantanés, sauvegardes et réplication avec Xen Orchestra, mises à jour d'un pool (rolling pool update), sécurité et dépannage.
tags: [xcp-ng, xen, pool, stockage, nfs, iscsi, vlan, migration, haute disponibilité, sauvegarde]
icon: network
---

## Pool

Tous les hôtes d'un pool doivent avoir la **même version** de XCP-ng et des processeurs de la même famille (sinon le pool masque les instructions non communes).

```bash
# Depuis le futur membre (xcp-02), rejoindre le pool de xcp-01
xe pool-join master-address=xcp-01.corp.exemple.fr master-username=root master-password='MotDePasse'
xe host-list params=name-label,address
xe pool-param-set uuid=$(xe pool-list --minimal) name-label="POOL-PARIS"
# Désigner un autre maître (maintenance)
xe pool-designate-new-master host-uuid=<uuid-xcp-02>
```

Dans Xen Orchestra : *Pool → Avancé → Ajouter un hôte*.

## Stockage (SR)

| Type de SR | Partagé | Remarque |
| --- | --- | --- |
| **EXT** local | Non | Fichiers VHD, allocation fine — défaut conseillé en local |
| **LVM** local | Non | Allocation complète, légèrement plus rapide |
| **NFS** | Oui | Simple, allocation fine ; NFSv3 ou v4 |
| **iSCSI** (LVMoISCSI) | Oui | Allocation complète ; multipath conseillé |
| **HBA** (Fibre Channel) | Oui | SAN existant |
| **XOSTOR** | Oui | Stockage hyperconvergé (LINSTOR/DRBD) sur les disques locaux des hôtes |
| **ISO** | — | Bibliothèque d'ISO (NFS, SMB ou local) |

```bash
# NFS partagé
xe sr-create name-label="NFS-VM" shared=true type=nfs content-type=user \
  device-config:server=nas-01.corp.exemple.fr device-config:serverpath=/export/xcp device-config:nfsversion=4.1
# iSCSI : découverte de la cible puis création
xe sr-probe type=lvmoiscsi device-config:target=10.0.50.10 device-config:targetIQN=iqn.2005-10.org.freenas.ctl:xcp
xe sr-create name-label="iSCSI-VM" shared=true type=lvmoiscsi content-type=user \
  device-config:target=10.0.50.10 device-config:targetIQN=iqn.2005-10.org.freenas.ctl:xcp device-config:SCSIid=<scsi-id>
# Bibliothèque d'ISO sur partage SMB
xe sr-create name-label="ISO" type=iso content-type=iso device-config:location=//nas-01/iso device-config:type=cifs device-config:username=xcp device-config:cifspassword='Secret'
xe sr-scan uuid=<uuid-sr-iso>
```

Activez le **multipath** iSCSI/FC hôte par hôte (hôte en maintenance) : Xen Orchestra → *Hôte → Avancé → Multipathing*.

## Réseau

| Réseau | Conseil |
| --- | --- |
| Gestion | Interface dédiée ou VLAN non étiqueté ; IP fixe |
| Stockage | Interfaces dédiées (jumbo frames 9000 de bout en bout si le NAS et les commutateurs le permettent) |
| VM | Réseaux **VLAN** sur un agrégat (*bond*) LACP ou actif/passif |
| Migration | Réseau dédié pour ne pas saturer la gestion |

```bash
xe pif-list params=uuid,device,host-name-label,VLAN
# Réseau VLAN 30 pour les VM, sur l'agrégat bond0 de tous les hôtes
NET=$(xe network-create name-label="VM-VLAN30")
for PIF in $(xe pif-list device=bond0 VLAN=-1 --minimal | tr ',' ' '); do xe vlan-create network-uuid=$NET pif-uuid=$PIF vlan=30; done
# Agrégat LACP (via Xen Orchestra conseillé) : xe bond-create network-uuid=<réseau> pif-uuids=<pif1>,<pif2> mode=lacp
```

## Migration et haute disponibilité

```bash
xe vm-migrate vm=srv-web-01 host=xcp-02 live=true                       # stockage partagé
xe vm-migrate vm=srv-web-01 remote-master=xcp-11 remote-username=root remote-password='…' \
  destination-sr-uuid=<sr> vif:<vif-uuid>=<réseau-dest> live=true      # vers un autre pool (avec stockage)
# Haute disponibilité : SR partagé de « heartbeat » requis
xe pool-ha-enable heartbeat-sr-uuids=<uuid-sr-nfs>
xe vm-param-set uuid=<uuid-vm> ha-restart-priority=restart order=1
```

Mise en **maintenance** d'un hôte : Xen Orchestra → *Hôte → Maintenance* (évacue les VM vers les autres hôtes).

## Instantanés, sauvegarde et réplication

```bash
xe vm-snapshot vm=srv-web-01 new-name-label=avant-maj
xe snapshot-list snapshot-of=$(xe vm-list name-label=srv-web-01 --minimal) params=uuid,name-label
xe snapshot-revert snapshot-uuid=<uuid>
xe vm-export vm=srv-web-01 filename=/mnt/sauvegarde/srv-web-01.xva compress=zstd   # VM arrêtée ou instantané
xe vm-import filename=/mnt/sauvegarde/srv-web-01.xva sr-uuid=<sr>
```

**Xen Orchestra** fournit les sauvegardes planifiées (*Sauvegarde → Nouveau*) :

| Mode | Principe |
| --- | --- |
| Sauvegarde complète | Export XVA complet vers un dépôt distant (NFS, SMB, S3) |
| **Sauvegarde delta (incrémentale)** | Première copie complète puis différences ; rétention par nombre de points |
| Réplication continue | Copie de la VM vers un autre SR ou pool, prête à démarrer (PRA) |
| Sauvegarde de métadonnées | Configuration du pool et de Xen Orchestra |

Restauration : *Sauvegarde → Restaurer* (VM complète) ou *Restauration de fichiers* (montage du disque et récupération de fichiers isolés).

## Mises à jour

```bash
yum update -y          # hôte par hôte, en commençant par le maître, puis redémarrage
xe host-list params=name-label,software-version
```

Xen Orchestra propose la **mise à jour progressive du pool** (*Pool → Correctifs → Rolling pool update*) : évacuation, mise à jour et redémarrage de chaque hôte à tour de rôle sans arrêt des VM (stockage partagé requis).

## Sécurité

- Compte root : mot de passe fort, accès SSH limité au réseau d'administration ; utilisateurs nominatifs et rôles dans Xen Orchestra (authentification LDAP/AD, SAML, OIDC).
- Certificat TLS de l'hôte : remplacer le certificat autosigné (`xe host-install-server-certificate certificate=… private-key=…`).
- Réseau de gestion isolé ; Xen Orchestra et XAPI ne doivent pas être joignables depuis Internet.

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| VM sans adresse IP dans XO, arrêt impossible | Outils invités absents : installer `xe-guest-utilities` / pilotes PV Windows |
| `VDI_IN_USE`, VM bloquée | `xe-toolstack-restart` (redémarre XAPI sans toucher aux VM) |
| SR « non connecté » après redémarrage | Réseau de stockage, montage NFS ou session iSCSI : `xe pbd-plug uuid=…` |
| Migration refusée | Processeurs différents, SR non partagé, réseau absent sur la destination |
| Espace SR qui ne diminue pas | Fusion des instantanés (*coalesce*) en attente : vérifier `/var/log/SMlog` |

Journaux : `/var/log/xensource.log` (XAPI), `/var/log/SMlog` (stockage), `xl dmesg` (hyperviseur). Commandes : [[90-aide-memoire|aide-mémoire]].
