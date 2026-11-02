---
title: Réseau, stockage, profils et cluster
description: Exploitation d'Incus (et LXD) — profils, limites de ressources, cloud-init, réseaux gérés (pont NAT, macvlan, pont physique, VLAN, OVN), redirections de ports et proxys, pools de stockage (ZFS, Btrfs, LVM, Ceph), volumes personnalisés, instantanés et sauvegardes (export, copie vers un autre serveur), projets, accès distant et certificats, cluster, sécurité (conteneurs non privilégiés, imbrication de Docker) et dépannage.
tags: [incus, lxd, réseau, stockage, zfs, profils, cluster, sauvegarde, cloud-init]
icon: network
---

## Profils et limites

Un **profil** regroupe configuration et périphériques appliqués aux instances (`default` est appliqué à toutes).

```bash
incus profile list
incus profile create serveur
incus profile set serveur limits.cpu=2 limits.memory=2GiB boot.autostart=true
incus profile device add serveur eth0 nic network=incusbr0 name=eth0
incus profile device add serveur root disk pool=default path=/ size=20GiB
incus launch images:debian/13 srv-web-02 --profile serveur
incus config set srv-web-02 limits.memory=4GiB          # à chaud pour un conteneur
incus config show srv-web-02 --expanded
```

### cloud-init

Utilisez les images `…/cloud` (cloud-init préinstallé) :

```bash
cat > web.yaml <<'EOF'
#cloud-config
packages: [nginx]
users:
  - name: admin
    groups: sudo
    shell: /bin/bash
    ssh_authorized_keys: ["ssh-ed25519 AAAAC3Nza... admin@poste"]
EOF
incus launch images:debian/13/cloud srv-web-03 -c cloud-init.user-data="$(cat web.yaml)"
```

## Réseau

| Type | Usage |
| --- | --- |
| **bridge** géré (`incusbr0`) | NAT, DHCP et DNS fournis par Incus (dnsmasq) — défaut |
| **macvlan** | Instances sur le réseau physique sans pont (l'hôte ne les joint pas) |
| Pont **physique** (`br0` de l'hôte) | Instances visibles sur le LAN, VLAN possibles |
| **OVN** | Réseaux virtuels distribués dans un cluster |

```bash
incus network list
incus network create labo ipv4.address=10.99.0.1/24 ipv4.nat=true ipv6.address=none
incus network set incusbr0 dns.domain=lxd.corp.exemple.fr
# Instance sur le pont physique de l'hôte, VLAN 30
incus config device add srv-web-02 eth0 nic nictype=bridged parent=br0 vlan=30
# Adresse fixe sur le réseau géré
incus config device override srv-dns-02 eth0 ipv4.address=10.62.10.53
# Exposer un port de l'instance sur l'hôte
incus config device add srv-web-02 http proxy listen=tcp:0.0.0.0:8080 connect=tcp:127.0.0.1:80
```

## Stockage

| Pilote | Atouts |
| --- | --- |
| **ZFS** | Instantanés et clones instantanés, quotas, compression — recommandé |
| **Btrfs** | Instantanés, intégré au noyau |
| **LVM** (thin) | Classique, instantanés |
| **Ceph RBD / CephFS** | Stockage partagé de cluster |
| dir | Simple, sans instantané efficace (labo) |

```bash
incus storage list
incus storage create rapide zfs source=/dev/nvme1n1
incus storage volume create rapide donnees size=50GiB
incus storage volume attach rapide donnees srv-db-01 /var/lib/postgresql
incus storage info rapide
```

## Instantanés, copies et sauvegardes

```bash
incus snapshot create srv-web-02 avant-maj
incus snapshot list srv-web-02
incus snapshot restore srv-web-02 avant-maj
incus config set srv-web-02 snapshots.schedule="0 3 * * *" snapshots.expiry=7d     # instantanés automatiques
incus export srv-web-02 /sauvegardes/srv-web-02-$(date +%F).tar.gz --optimized-storage
incus import /sauvegardes/srv-web-02-2026-11-02.tar.gz
incus copy srv-web-02 incus-02:srv-web-02 --refresh   # réplication incrémentale vers un autre serveur
incus move srv-web-02 incus-02:                       # migration (à chaud pour les VM avec migration.stateful)
```

## Accès distant et projets

```bash
# Sur le serveur
incus config set core.https_address :8443
incus config trust add poste-admin                    # renvoie un jeton à usage unique
# Sur le poste
incus remote add incus-01 https://incus-01.corp.exemple.fr:8443 --token <jeton>
incus list incus-01:
# Projets : isolation par équipe (instances, images, profils, quotas)
incus project create equipe-web -c features.images=false -c limits.instances=20
incus project switch equipe-web
```

Authentification centralisée : **OIDC** (Keycloak, Authentik) et autorisations fines **OpenFGA** — voir [[05-keycloak/01-presentation-installation|Keycloak]].

## Cluster

```bash
# Premier membre : incus admin init → « Would you like to use clustering? yes »
incus cluster add incus-02                             # renvoie un jeton
# Sur incus-02 : incus admin init → rejoindre un cluster existant, coller le jeton
incus cluster list
incus launch images:debian/13 srv-app-05 --target incus-02
incus cluster evacuate incus-02                         # maintenance : déplace les instances
incus cluster restore incus-02
```

Trois membres minimum pour la tolérance de panne de la base de données distribuée (dqlite) ; stockage partagé (Ceph) et OVN pour déplacer les instances librement.

## Sécurité

- Conteneurs **non privilégiés** par défaut (UID décalés) : ne pas activer `security.privileged=true` sans nécessité.
- Docker dans un conteneur Incus : `incus config set srv-docker-01 security.nesting=true` (plus simple et plus isolé : une VM Incus).
- Le groupe `incus-admin` équivaut à root sur l'hôte ; préférer `incus` (accès restreint au projet de l'utilisateur) pour les non-administrateurs.
- API exposée : TLS par certificats clients ou OIDC, filtrage du port 8443 au réseau d'administration.

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| Pas d'accès Internet depuis les conteneurs | Pare-feu de l'hôte (Docker ajoute des règles `DROP` sur FORWARD) : autoriser `incusbr0`, ou `incus network set incusbr0 ipv4.firewall=false` et règles manuelles |
| `Failed to create instance: ... no space left` | Pool plein : `incus storage info default`, agrandir le pool ZFS |
| VM qui ne démarre pas | KVM absent (`/dev/kvm`), image non « vm » : utiliser une image compatible VM ou `--vm` |
| Conteneur systemd lent ou en échec | Image ancienne, AppArmor : consulter `incus info --show-log srv-web-02` |

Journaux : `incus info --show-log <instance>`, `journalctl -u incus`, `incus monitor --pretty`. Commandes : [[90-aide-memoire|aide-mémoire]].
