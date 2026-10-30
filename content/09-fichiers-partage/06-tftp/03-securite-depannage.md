---
title: Sécurité, pare-feu et dépannage
description: Sécuriser un serveur TFTP (lecture seule, réseau de gestion, pare-feu, aide conntrack nf_conntrack_tftp avec nftables, SELinux), le tester (tftp, curl, tcpdump), journaliser, et résoudre les erreurs fréquentes (délai dépassé, File not found, Permission denied, PXE-E32, transferts lents, gros fichiers, NAT).
tags: [tftp, sécurité, conntrack, nftables, selinux, dépannage, pxe]
icon: shield-check
---

## Sécurité

TFTP n'a **ni authentification ni chiffrement** : toute machine qui joint le serveur peut lire (et parfois écrire) les fichiers dont elle connaît le nom.

| Mesure | Mise en œuvre |
| --- | --- |
| Lecture seule par défaut | Pas de `--create` ; dépôts dans un sous-dossier dédié uniquement si nécessaire |
| Exposition minimale | Écoute sur l'interface de gestion (`--address`), pare-feu limité aux VLAN de déploiement/gestion |
| Pas de secrets durables | Purger ou déplacer les configurations sauvegardées ; ne pas laisser de fichiers de préconfiguration contenant des mots de passe |
| Chroot | `--secure` toujours |
| Service à la demande | Activer le service le temps d'une opération (portable d'intervention, macOS) |
| Alternatives | SCP/SFTP pour les équipements, HTTPS pour le démarrage (iPXE avec certificats, UEFI HTTP Boot) |

## Pare-feu

Le serveur répond depuis un **port éphémère** : un pare-feu à états doit associer ces paquets à la requête initiale.

### Sur le serveur

```bash
# nftables : la réponse part du serveur, le reste du transfert est « established »
sudo nft add rule inet filter input ip saddr 10.0.0.0/16 udp dport 69 accept
sudo nft add rule inet filter input ct state established,related accept
# firewalld
sudo firewall-cmd --permanent --add-service=tftp && sudo firewall-cmd --reload
```

### Sur un pare-feu ou routeur intermédiaire (NAT notamment) : aide conntrack

```nft /etc/nftables.d/tftp-helper.nft
table inet filter {
    ct helper tftp-standard {
        type "tftp" protocol udp
    }
    chain prerouting {
        type filter hook prerouting priority filter; policy accept;
        udp dport 69 ct helper set "tftp-standard"
    }
    chain forward {
        type filter hook forward priority filter; policy drop;
        ct state established,related accept
        ip saddr 10.20.0.0/16 ip daddr 10.0.0.5 udp dport 69 accept
    }
}
```

Depuis les noyaux récents, l'aide n'est plus attribuée automatiquement : il faut l'assigner explicitement comme ci-dessus (module `nf_conntrack_tftp`, et `nf_nat_tftp` en cas de NAT). Alternative sans aide : fixer `--port-range` et ouvrir cette plage.

### SELinux (RHEL)

| Besoin | Réglage |
| --- | --- |
| Lecture dans `/var/lib/tftpboot` | Contexte `tftpdir_t` par défaut |
| Racine personnalisée | `semanage fcontext -a -t tftpdir_rw_t "/srv/tftp(/.*)?"` puis `restorecon -Rv /srv/tftp` |
| Dépôts | `setsebool -P tftp_anon_write on` + contexte `tftpdir_rw_t` |

## Tests

```bash
tftp 10.0.0.5 -v -m binary -c get pxelinux.0           # client tftp-hpa
curl -o /tmp/test.bin tftp://10.0.0.5/pxelinux.0       # curl gère TFTP
curl -T config.txt tftp://10.0.0.5/sauvegardes/config.txt
atftp --option "blksize 1468" --get -r images/debian-12/linux -l /tmp/linux 10.0.0.5
sudo tcpdump -ni ens192 udp port 69 or portrange 50000-50100
```

## Journaux

Avec `--verbose`, tftpd-hpa journalise chaque requête dans syslog :

```bash
sudo journalctl -u tftpd-hpa -f        # Debian
sudo journalctl -t in.tftpd -f         # RHEL
# RRQ from 10.20.3.41 filename pxelinux.0 / WRQ from … / sending NAK (1, File not found)
```

## Erreurs fréquentes

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Délai dépassé (`Transfer timed out`) | UDP 69 filtré, réponse depuis un port éphémère bloquée, NAT sans aide | Pare-feu (aide conntrack ou plage fixe), `tcpdump` des deux côtés |
| `File not found` | Chemin absolu demandé avec `--secure`, casse, barres obliques inverses | Chemin relatif à la racine, `--map-file` |
| `Permission denied` en lecture | Fichier non lisible par l'utilisateur `tftp`, SELinux | `chmod o+r`, contexte SELinux |
| `Permission denied` / `Access violation` en écriture | Fichier inexistant sans `--create`, dossier non inscriptible | `--create` + droits du dossier, ou fichier précréé en `666` |
| Cisco `%Error opening tftp://… (Timed out)` | Mauvaise interface source, ACL, VRF | `ip tftp source-interface`, `copy … vrf` |
| PXE : `PXE-E32: TFTP open timeout` | `next-server`/option 66 incorrecte, serveur arrêté, pare-feu | Vérifier le DHCP et le service TFTP |
| PXE : `PXE-T01: File not found` | Nom de fichier (option 67) erroné ou architecture BIOS/UEFI mal détectée | Journaux TFTP (nom demandé), classes DHCP par architecture |
| Transfert très lent (images, initrd) | Blocs de 512 octets, un acquittement par bloc | `blksize`, `windowsize`, ou chaînage iPXE + HTTP |
| Échec vers 32 Mio | Compteur de blocs 16 bits sans rebouclage | `blksize` plus grand ou HTTP |
| Blocs perdus avec `blksize` élevé | Fragmentation IP filtrée (bloc > MTU) | `blksize 1468` (≤ MTU − en-têtes) |
| Fonctionne en local mais pas à travers un routeur | Relais DHCP sans `next-server`, ou pare-feu intermédiaire | `ip helper-address`, règles du pare-feu |
