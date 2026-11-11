---
title: Grocy, Homebox et PartKeepr
description: Gestion de petits stocks et d'inventaire — Grocy (ERP domestique : stocks avec dates de péremption, codes-barres, courses, tâches ; PHP/SQLite, Docker port 9283), Homebox (inventaire de biens et de matériel : emplacements, étiquettes QR, pièces jointes, import CSV ; Go, Docker port 7745), PartKeepr (gestion de composants électroniques : catégories, stockage, distributeurs, fabricants ; projet archivé, alternatives Partdb et InvenTree) ; usage en petite structure IT et sauvegarde.
tags: [grocy, homebox, partkeepr, inventree, partdb, stock, inventaire, consommables]
icon: package-search
---

Pour suivre **consommables, matériel et pièces** sans déployer un ERP complet, ces outils légers suffisent souvent à une petite structure ou à un service informatique.

## Grocy

**Grocy** est un « ERP pour la maison » : il gère un **stock avec dates de péremption**, les courses, les recettes, les tâches et les corvées. Au-delà du foyer, il convient à un **petit stock de consommables** (câbles, piles, fournitures) avec gestion par **codes-barres** et seuils de réapprovisionnement.

```bash
docker run -d --name grocy -p 127.0.0.1:9283:80 \
  -v /srv/grocy:/config -e TZ=Europe/Paris lscr.io/linuxserver/grocy:latest
# Interface : http://serveur:9283 ; compte par défaut admin/admin à changer
```

Données en **SQLite** dans le volume ; une **API REST** (clé dans les réglages) permet l'intégration et l'usage avec une douchette ou une application mobile.

## Homebox

**Homebox** inventorie des **biens** : où ils sont, combien ils ont coûté, garanties, factures et photos jointes, avec **emplacements** imbriqués et **étiquettes QR** à imprimer. Simple et rapide (un binaire Go), idéal pour l'inventaire du matériel d'un bureau, d'une association ou d'un petit parc.

```bash
docker run -d --name homebox -p 127.0.0.1:7745:7745 \
  -v /srv/homebox:/data \
  -e HBOX_OPTIONS_ALLOW_REGISTRATION=false \
  ghcr.io/sysadminsmedia/homebox:latest
```

- Arborescence d'**emplacements** (bâtiment → salle → armoire → étagère), champs personnalisés, import/export **CSV**.
- Étiquettes **QR** renvoyant vers la fiche de l'objet ; recherche et filtres.
- Pas de gestion de péremption : c'est un inventaire de biens, pas de consommables.

## PartKeepr et alternatives

**PartKeepr** gère des **composants électroniques** (résistances, circuits, connecteurs) : catégories, emplacements de stockage, distributeurs, fabricants, fiches techniques, seuils de stock.

> [!WARNING]
> PartKeepr n'est **plus maintenu** (projet archivé). Pour un nouveau déploiement, préférer :
> - **Part-DB** (PHP/Symfony) : gestion de composants, fournisseurs, prix, pièces jointes ;
> - **InvenTree** (Python/Django) : gestion de stock et de composants orientée fabrication (nomenclatures, commandes, API riche), adaptée aussi à un stock de pièces détachées IT.

```bash
# InvenTree (exemple Docker) et Part-DB se déploient en conteneurs ; voir leur documentation
docker run -d --name partdb -p 127.0.0.1:8080:80 -v /srv/partdb:/var/www/html/uploads jbtronics/part-db1:latest
```

## Pour un parc informatique

Si le besoin est de suivre le **matériel informatique** (postes, écrans, licences) plutôt qu'un stock générique, [[21-outils/06-support-parc/04-glpi-installation|GLPI]] (avec son inventaire) ou [[01-inventaire-cmdb/01-fusioninventory-idoit-cmdbuild|i-doit]] sont plus adaptés. Grocy, Homebox et les gestionnaires de composants couvrent les **consommables, biens divers et pièces** que ces outils gèrent mal.

## Sauvegarde

Sauvegarder le **volume de données** (SQLite pour Grocy et Homebox, base pour Part-DB/InvenTree) **et** les **pièces jointes** (factures, photos, fiches techniques), qui sont souvent le contenu le plus précieux. Désactiver l'inscription ouverte et placer l'interface derrière HTTPS.

Voir aussi : [[02-erpnext-openwms-openlmis|ERPNext, OpenWMS et OpenLMIS]]. Commandes : [[90-aide-memoire|aide-mémoire]].
