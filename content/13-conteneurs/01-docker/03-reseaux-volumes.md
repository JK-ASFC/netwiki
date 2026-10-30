---
title: Réseaux et volumes
description: Réseaux Docker (bridge par défaut et réseaux définis par l'utilisateur, résolution DNS interne, host, none, macvlan, ipvlan, overlay), publication de ports et interaction avec iptables/nftables (chaîne DOCKER-USER, contournement d'UFW/firewalld), plages d'adresses et conflits avec le réseau d'entreprise, IPv6, et stockage persistant (volumes, montages, tmpfs, pilotes NFS).
tags: [docker, réseau, bridge, macvlan, iptables, docker-user, ipv6, volumes]
icon: network
---

## Pilotes réseau

| Pilote | Comportement | Usage |
| --- | --- | --- |
| `bridge` (défaut) | Pont Linux + NAT vers l'extérieur | Cas général |
| **Réseau bridge défini par l'utilisateur** | Comme `bridge` + **DNS interne** (résolution par nom de conteneur), isolation entre réseaux | Toujours préférer au bridge par défaut |
| `host` | Partage la pile réseau de l'hôte (pas d'isolation, pas de NAT) | Performances, outils réseau |
| `none` | Aucune interface | Traitements isolés |
| **`macvlan`** | Une adresse MAC/IP du LAN par conteneur | Conteneur vu comme une machine du réseau (équipements, DHCP, supervision) |
| `ipvlan` (L2/L3) | Comme macvlan avec la MAC de l'hôte | Commutateurs limitant le nombre de MAC par port, Wi-Fi |
| `overlay` | Réseau multi-hôtes (VXLAN) | Docker Swarm |

```bash
docker network create --driver bridge --subnet 172.30.10.0/24 interne-app
docker run -d --name db --network interne-app postgres:17
docker run -d --name web --network interne-app -p 443:8443 app:1.4
docker exec web getent hosts db          # résolution par le DNS interne (127.0.0.11)
docker network inspect interne-app

# macvlan : conteneur directement sur le VLAN 30 (sous-interface 802.1Q)
docker network create -d macvlan --subnet 10.0.30.0/24 --gateway 10.0.30.1 \
  --ip-range 10.0.30.192/27 -o parent=ens192.30 vlan30
docker run -d --name sonde --network vlan30 --ip 10.0.30.200 sonde:latest
```

> [!NOTE]
> Avec macvlan, l'**hôte** ne peut pas joindre ses propres conteneurs directement (filtrage du noyau) : créez une interface macvlan sur l'hôte dans le même réseau si nécessaire.

## Plages d'adresses : éviter les conflits

Par défaut, Docker utilise `172.17.0.0/16` pour `docker0` puis des plages dans `172.18.0.0/16`…`172.31.0.0/16` et `192.168.0.0/16` pour les nouveaux réseaux. Si ces plages existent dans votre réseau d'entreprise (VPN, sites distants), des **routes en conflit** rendent des sous-réseaux injoignables depuis l'hôte.

```json /etc/docker/daemon.json
{
  "bip": "172.29.0.1/24",
  "default-address-pools": [
    { "base": "172.30.0.0/16", "size": 24 }
  ]
}
```

```bash
sudo systemctl restart docker
ip route | grep -E 'docker|br-'
```

Choisissez une plage **réservée aux conteneurs** dans le plan d'adressage de l'entreprise.

## Publication de ports et pare-feu

```bash
docker run -d -p 8080:80 nginx              # toutes les interfaces de l'hôte
docker run -d -p 127.0.0.1:8080:80 nginx    # seulement en local (derrière un reverse proxy)
docker run -d -p 10.0.30.15:443:443 app     # une adresse précise
docker port web
```

> [!WARNING]
> Docker insère ses propres règles **iptables/nftables** (chaînes `DOCKER`, `DOCKER-FORWARD`, `DOCKER-USER`) : les ports publiés passent **avant** les règles INPUT d'UFW ou de firewalld. Un port publié sur `0.0.0.0` est donc accessible même si le pare-feu de l'hôte semble le bloquer. Publiez sur `127.0.0.1` ou filtrez dans la chaîne **DOCKER-USER**.

```bash
# N'autoriser l'accès aux conteneurs publiés que depuis le réseau d'administration (iptables)
sudo iptables -I DOCKER-USER -i ens192 ! -s 10.0.99.0/24 -j DROP
sudo iptables -I DOCKER-USER -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
```

Pour persister ces règles, utilisez un service systemd exécuté après `docker.service` ou votre outil de pare-feu (firewalld propose une zone `docker`).

## IPv6

```json /etc/docker/daemon.json (extrait)
{
  "ipv6": true,
  "fixed-cidr-v6": "2001:db8:1:ff::/64",
  "ip6tables": true
}
```

```bash
docker network create --ipv6 --subnet 2001:db8:1:fe::/64 app-v6
```

## Stockage

| Type | Syntaxe | Usage |
| --- | --- | --- |
| **Volume nommé** | `-v donnees-db:/var/lib/postgresql/data` | Données persistantes gérées par Docker (`/var/lib/docker/volumes`) |
| Montage de répertoire (*bind mount*) | `-v /srv/app/config:/etc/app:ro` | Configuration, fichiers de l'hôte |
| `tmpfs` | `--tmpfs /tmp:size=64m` | Données temporaires en mémoire |
| Volume NFS | `docker volume create --driver local --opt type=nfs --opt o=addr=nfs01,rw,nfsvers=4.2 --opt device=:/srv/nfs/app app-nfs` | Partage entre hôtes |

```bash
docker volume ls
docker volume inspect donnees-db
# Sauvegarder un volume
docker run --rm -v donnees-db:/donnees:ro -v /srv/sauvegardes:/sauvegarde debian:12 \
  tar czf /sauvegarde/donnees-db-$(date +%F).tgz -C /donnees .
docker volume prune                         # supprime les volumes inutilisés (attention)
```

Pour une base de données, préférez sa **sauvegarde logique** (pg_dump, mariadb-dump) exécutée dans le conteneur à une copie des fichiers en cours d'utilisation.
