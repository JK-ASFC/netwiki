---
title: Présentation et comparatif
description: Outils IPAM et DCIM alternatifs — GestióIP (IPAM avec découverte réseau et IPv6, Perl), NIPAP (IPAM pour opérateurs, PostgreSQL, API et CLI), Ralph (gestion d'actifs et DCIM d'Allegro, licences, cycle de vie), RackTables (baies, câblage et adresses, historique) : installation, cas d'usage, interfaces, état des projets et comparaison avec NetBox et phpIPAM.
tags: [gestioip, nipap, ralph, racktables, ipam, dcim, gestion d'actifs]
icon: info
---

| Outil | Licence, langage | Points forts | État | Pour qui |
| --- | --- | --- | --- | --- |
| **GestióIP** | GPL, Perl | IPAM avec **découverte** (ping, SNMP, DNS), IPv6, calcul de plans d'adressage | Maintenu | PME, IPAM avec découverte |
| **NIPAP** | MIT, Python/PostgreSQL | IPAM d'**opérateur** (millions de préfixes), API XML-RPC, CLI, VRF, pools | Maintenance réduite | Opérateurs, gros plans d'adressage |
| **Ralph** | Apache 2.0, Python/Django | **Gestion d'actifs** et DCIM (cycle de vie, licences, contrats, baies), API | Maintenu (Allegro) | Inventaire matériel et logiciel d'un datacenter |
| **RackTables** | GPL, PHP/MySQL | Baies, objets, ports et câblage, adresses, historique des modifications | Maintenance réduite | Petits datacenters existants |

Pour un nouveau projet : [[08-netbox-nautobot/01-netbox|NetBox]] (source de vérité complète) ou [[09-phpipam/01-presentation-installation|phpIPAM]] (IPAM simple) couvrent la plupart des besoins.

## GestióIP

Archive de la dernière version depuis `gestioip.net` (SourceForge), puis :

```bash
tar xzf gestioip_*.tar.gz && cd gestioip_*
sudo ./setup_gestioip.sh            # installe Apache, modules Perl et MariaDB ; puis assistant web https://gestioip.corp.exemple.fr/gestioip/install
```

Interface : réseaux et adresses, **découverte** planifiée (*Import/Discovery*), synchronisation DNS, rapports d'occupation, plan d'adressage IPv6.

<!-- CAPTURE: GestióIP — liste des réseaux et occupation | _assets/gestioip-reseaux.png -->

## NIPAP

```bash
# Debian/Ubuntu : dépôt du projet (spritelink) puis
sudo apt install nipapd nipap-www nipap-cli
nipap address add prefix 10.0.20.0/24 type assignment description "Serveurs Paris"
nipap address list 10.0.20.0/24
```

Interface web `nipap-www` (recherche, arborescence de préfixes, pools, VRF).

## Ralph

```bash
git clone https://github.com/allegro/ralph.git && cd ralph/docker && docker compose up -d
docker compose exec web ralphctl createsuperuser
```

Interface : *Data Center* (centres, salles, baies, équipements), *Back Office* (actifs, licences, logiciels, contrats, garanties), *DC View* (vue graphique des baies), API REST.

<!-- CAPTURE: Ralph — vue graphique d'une salle et de ses baies | _assets/ralph-dc-view.png -->

## RackTables

Application PHP (Apache + MySQL, `index.php?module=installer`) : *Rackspace* (sites, rangées, baies), *Objects* (serveurs, commutateurs avec ports), câblage port à port, *IPv4/IPv6 space*, journal des modifications.

<!-- CAPTURE: RackTables — vue d'une baie | _assets/racktables-baie.png -->
