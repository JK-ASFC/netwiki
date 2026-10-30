---
title: Installation et arborescence
description: Installer BIND9 sur Debian/Ubuntu et RHEL/Rocky/Alma, arborescence des fichiers selon la distribution, service systemd, pare-feu, AppArmor/SELinux, clé rndc, premier test et conteneur Docker.
tags: [bind9, installation, debian, rhel, selinux, apparmor, docker]
icon: download
---

## Debian / Ubuntu

```bash
sudo apt update
sudo apt install bind9 bind9-utils bind9-dnsutils bind9-doc
systemctl status named          # le service s'appelle « named » (alias « bind9 »)
named -V | head -1
```

### Arborescence Debian

| Fichier / dossier | Rôle |
| --- | --- |
| `/etc/bind/named.conf` | Fichier principal : n'inclut que les trois suivants |
| `/etc/bind/named.conf.options` | Bloc `options { }` (récursion, écoute, redirecteurs) |
| `/etc/bind/named.conf.local` | **Vos zones** |
| `/etc/bind/named.conf.default-zones` | Zones par défaut : racine (`hint`), localhost, 127/0/255 |
| `/etc/bind/rndc.key` | Clé du canal de contrôle (générée à l'installation) |
| `/etc/bind/db.*` | Fichiers de zone d'exemple |
| `/var/cache/bind/` | Répertoire de travail (`directory`) : zones secondaires, cache, journaux `.jnl` |
| `/var/lib/bind/` | Zones **dynamiques** (écriture autorisée par AppArmor) |
| `/etc/default/named` | Options de démarrage (`OPTIONS="-u bind"`, `-4` pour IPv4 seul) |

> [!TIP]
> Placez les zones primaires statiques dans `/etc/bind/zones/` et les zones dynamiques ou secondaires dans `/var/lib/bind/` ou `/var/cache/bind/` : le profil **AppArmor** n'autorise l'écriture que dans ces derniers.

## RHEL / Rocky Linux / AlmaLinux

```bash
sudo dnf install bind bind-utils
sudo systemctl enable --now named
sudo firewall-cmd --permanent --add-service=dns
sudo firewall-cmd --reload
```

### Arborescence RHEL

| Fichier / dossier | Rôle |
| --- | --- |
| `/etc/named.conf` | Fichier principal (options + zones) |
| `/etc/named.rfc1912.zones` | Zones localhost par défaut (inclus) |
| `/etc/named.root.key` | Ancre de confiance DNSSEC de la racine |
| `/etc/rndc.key` | Clé rndc |
| `/var/named/` | `directory` : fichiers de zone primaires (`named.ca` = indices racine) |
| `/var/named/slaves/` | Zones secondaires (écriture autorisée par SELinux) |
| `/var/named/dynamic/` | Zones dynamiques et clés DNSSEC |
| `/var/named/data/` | Journaux et fichiers de statistiques/dump |
| `/etc/sysconfig/named` | Options de démarrage |

> [!WARNING]
> Par défaut, `/etc/named.conf` sur RHEL n'écoute que sur **127.0.0.1** et `::1` (`listen-on port 53 { 127.0.0.1; };`, `allow-query { localhost; };`). Pensez à l'adapter avant de chercher pourquoi le serveur ne répond pas sur le réseau.

### SELinux

```bash
# Contexte attendu des fichiers de zone
ls -Z /var/named/
sudo restorecon -Rv /var/named /etc/named.conf
# Autoriser named à écrire dans les zones primaires (DDNS, DNSSEC inline sur des zones hors dynamic/)
sudo setsebool -P named_write_master_zones on
# Diagnostiquer un refus
sudo ausearch -m avc -c named --start recent
```

## Service systemd

```bash
sudo systemctl enable --now named
sudo systemctl reload named          # équivalent à « rndc reload »
journalctl -u named -f               # journaux (si logging vers syslog/stderr)
```

## Pare-feu

Le DNS a besoin d'**UDP et TCP 53** (TCP pour les réponses > 1232 octets, DNSSEC, transferts de zone).

```bash
# UFW (Ubuntu)
sudo ufw allow 53/udp && sudo ufw allow 53/tcp
# nftables
nft add rule inet filter input udp dport 53 accept
nft add rule inet filter input tcp dport 53 accept
# DoT / DoH si utilisés
sudo firewall-cmd --permanent --add-port=853/tcp --add-port=443/tcp
```

## Clé rndc

La clé est générée automatiquement à l'installation. Pour la régénérer :

```bash
sudo rndc-confgen -a -A hmac-sha256 -k rndc-key   # écrit /etc/bind/rndc.key (Debian) ou /etc/rndc.key (RHEL)
sudo chown root:bind /etc/bind/rndc.key && sudo chmod 640 /etc/bind/rndc.key
```

```named /etc/bind/named.conf (extrait)
include "/etc/bind/rndc.key";
controls {
    inet 127.0.0.1 port 953 allow { 127.0.0.1; } keys { "rndc-key"; };
};
```

## Vérifier la configuration avant tout redémarrage

```bash
sudo named-checkconf                          # syntaxe
sudo named-checkconf -z                       # syntaxe + chargement de toutes les zones
sudo named-checkzone exemple.fr /etc/bind/zones/db.exemple.fr
sudo rndc reconfig                            # recharge la config (nouvelles zones) sans toucher aux zones existantes
sudo rndc reload                              # recharge config + zones modifiées
```

> [!IMPORTANT]
> Prenez l'habitude de lancer `named-checkconf -z` **avant** chaque `reload`. Une erreur de syntaxe dans `named.conf` empêche le rechargement (le serveur garde l'ancienne configuration) mais **empêche aussi le démarrage** en cas de redémarrage.

## Premier test

```bash
dig @127.0.0.1 localhost
dig @127.0.0.1 www.isc.org +dnssec      # récursion + validation : drapeau « ad » attendu
dig @127.0.0.1 version.bind CH TXT      # version (à masquer en production)
sudo rndc status
```

## Mise à jour vers une version ISC plus récente

L'ISC publie des paquets officiels :

- **Debian/Ubuntu** : PPA `ppa:isc/bind` (Ubuntu) ou dépôt `https://deb.isc.org` (BIND 9.18 / 9.20 ESV).
- **RHEL/Rocky/Alma** : dépôts COPR `isc/bind` (paquets `isc-bind-bind`, installés sous `/opt/isc/isc-bind/` avec le service `isc-bind-named`).

```bash
# Ubuntu
sudo add-apt-repository ppa:isc/bind
sudo apt install bind9
```

## Conteneur Docker

Image officielle `internetsystemsconsortium/bind9:<version>` :

```bash
docker run -d --name bind9 --restart=always \
  -p 53:53/udp -p 53:53/tcp -p 127.0.0.1:953:953/tcp \
  -v /srv/bind/config:/etc/bind \
  -v /srv/bind/cache:/var/cache/bind \
  -v /srv/bind/records:/var/lib/bind \
  -v /srv/bind/log:/var/log \
  internetsystemsconsortium/bind9:9.20
```

> [!NOTE]
> Sur un hôte Ubuntu, `systemd-resolved` écoute déjà sur `127.0.0.53:53`. Il ne gêne pas une écoute sur l'IP de l'hôte, mais si vous publiez `-p 53:53` sur toutes les adresses, désactivez son *stub listener* (`DNSStubListener=no` dans `/etc/systemd/resolved.conf`).

## Organisation conseillée des fichiers

```text
/etc/bind/
├── named.conf                  # includes uniquement
├── named.conf.options          # options globales
├── named.conf.acl              # ACL réutilisables
├── named.conf.keys             # clés TSIG (chmod 640)
├── named.conf.logging          # journalisation
├── named.conf.local            # zones
└── zones/
    ├── db.exemple.fr
    └── db.10.20.in-addr.arpa
/var/lib/bind/                  # zones dynamiques / signées
/var/cache/bind/secondary/      # copies des zones secondaires
/var/log/named/                 # journaux (logrotate)
```

Versionnez `/etc/bind` avec **Git** (ou un outil comme etckeeper) et déployez avec Ansible : chaque modification devient traçable et réversible.
