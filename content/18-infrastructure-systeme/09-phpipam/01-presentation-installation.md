---
title: Présentation, installation et utilisation
description: phpIPAM — gestion des adresses IP open source en PHP/MySQL : sections, sous-réseaux et hiérarchie, adresses, VLAN et domaines L2, VRF, découverte par scan (ping, fping, SNMP) et agents, alertes de changement, authentification AD/LDAP/RADIUS/SAML, installation LAMP sur Debian/Ubuntu et RHEL, Docker, configuration, tâches planifiées, API REST, interface web, sauvegarde et comparaison avec NetBox.
tags: [phpipam, ipam, adresses ip, sous-réseaux, vlan, scan, api]
icon: info
---

**phpIPAM** (GPL) est un **IPAM** simple et efficace : on y documente sections, sous-réseaux, adresses et VLAN, et il **scanne** les réseaux pour repérer les adresses réellement utilisées. Plus léger que [[01-netbox|NetBox]] (pas de DCIM complet ni de câblage), il convient aux équipes qui veulent avant tout savoir quelles adresses sont libres.

## Installation (Debian/Ubuntu)

```bash
sudo apt install apache2 mariadb-server php php-{mysql,curl,gd,intl,pear,gmp,mbstring,xml,ldap,snmp} fping git
cd /var/www && sudo git clone --recursive https://github.com/phpipam/phpipam.git && cd phpipam
sudo git checkout "$(git tag --sort=-v:refname | grep -v -i rc | head -1)"   # dernière version stable
sudo cp config.dist.php config.php && sudoedit config.php      # $db['host'], ['user'], ['pass'], ['name']
sudo chown -R www-data:www-data /var/www/phpipam
```

Site Apache pointant sur `/var/www/phpipam` (avec `AllowOverride All` pour les réécritures), puis assistant web : `https://ipam.corp.exemple.fr/install` (création de la base, mot de passe **Admin**).

```bash
docker run -d --name phpipam -p 8081:80 -e IPAM_DATABASE_HOST=db -e IPAM_DATABASE_PASS=MdpPhpipam phpipam/phpipam-www   # + phpipam/phpipam-cron et une base MariaDB
```

## Organisation

| Élément | Usage |
| --- | --- |
| **Section** | Regroupement (Production, DMZ, Laboratoire, sites) avec droits par groupe |
| **Sous-réseau** | Hiérarchie (`10.0.0.0/8` → `10.0.20.0/24`), passerelle, VLAN, VRF, seuil d'alerte d'occupation |
| **Adresse** | Nom d'hôte, description, MAC, propriétaire, équipement, état (actif, réservé, hors ligne, DHCP) |
| **VLAN / domaines L2** | Numéros de VLAN par domaine de commutation |
| **VRF** | Plans d'adressage qui se recouvrent |
| Équipements, NAT, circuits | Documentation complémentaire |

## Découverte

*Administration → Server management* (agents de scan) puis, sur un sous-réseau : cocher **Scan / Discover new hosts** et **Ping check**. Tâches planifiées (cron) :

```bash
*/15 * * * * php /var/www/phpipam/functions/scripts/pingCheck.php
*/15 * * * * php /var/www/phpipam/functions/scripts/discoveryCheck.php
```

Résolution DNS inverse automatique, alertes par e-mail (adresse apparue/disparue), import depuis CSV ou depuis les tables ARP/MAC des équipements par **SNMP**.

## Authentification et API

- *Administration → Authentication methods* : **Active Directory**, LDAP, RADIUS, SAML2 ; groupes phpIPAM liés aux sections.
- **API REST** : *Administration → API* → créer une application (`app_id`) avec jeton.

```bash
curl -s -X GET -H "token: $JETON" https://ipam.corp.exemple.fr/api/automatisation/subnets/cidr/10.0.20.0/24/ | jq '.data[0].id'
curl -s -X GET -H "token: $JETON" https://ipam.corp.exemple.fr/api/automatisation/subnets/42/first_free/ | jq .data
```

## Interface graphique

Menu gauche : **sections** et arborescence des sous-réseaux ; vue d'un sous-réseau : carte des adresses (libres en vert), liste, VLAN, statistiques d'occupation ; **Tools** : recherche globale, calculatrice IP, VLAN, VRF, équipements, *Request IP address* (demandes soumises à validation) ; **Administration** : paramètres, utilisateurs, groupes, authentification, API, agents de scan.

<!-- CAPTURE: phpIPAM — vue d'un sous-réseau avec carte des adresses | _assets/phpipam-sous-reseau.png -->
<!-- CAPTURE: phpIPAM — arborescence des sections et sous-réseaux | _assets/phpipam-sections.png -->
<!-- CAPTURE: phpIPAM — configuration de l'authentification Active Directory | _assets/phpipam-auth-ad.png -->

## Exploitation

Sauvegarde : base MariaDB (`mysqldump phpipam`) et `config.php`. Mise à jour : `git pull` sur le tag de la nouvelle version puis assistant de mise à jour de la base.
