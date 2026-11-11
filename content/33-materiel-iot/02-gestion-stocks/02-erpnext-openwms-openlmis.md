---
title: ERPNext (stocks), OpenWMS et OpenLMIS
description: Gestion de stocks à l'échelle de l'organisation — module Stock d'ERPNext (entrepôts, articles, écritures de stock, réception et livraison, réapprovisionnement, valorisation FIFO/moyenne, codes-barres ; plate-forme Frappe, bench), OpenWMS (système de gestion d'entrepôt open source orienté flux et automatisation, Java, projet de niche) et OpenLMIS (système d'information logistique pour la santé publique dans les pays en développement, gestion des approvisionnements médicaux) ; quand ces outils dépassent le besoin.
tags: [erpnext, openwms, openlmis, stock, entrepôt, wms, logistique, erp]
icon: warehouse
---

Au-delà du petit inventaire ([[01-grocy-homebox-partkeepr|Grocy, Homebox]]), ces solutions gèrent le stock **à l'échelle d'une organisation**, intégré à des processus d'achat, de vente ou de logistique. Elles dépassent souvent le besoin d'un service informatique, mais peuvent concerner la DSI quand elle héberge l'outil de gestion de l'entreprise.

## ERPNext — module Stock

**ERPNext** (GPL, plate-forme **Frappe**) est un ERP complet ; son module **Stock** gère entrepôts, articles, mouvements et valorisation, relié aux achats et aux ventes.

| Notion | Rôle |
| --- | --- |
| Article (*Item*) | Produit géré en stock (avec code, unité, codes-barres, numéros de série ou lots) |
| Entrepôt | Emplacement logique ou physique, arborescent |
| Écriture de stock (*Stock Entry*) | Entrée, sortie, transfert, fabrication |
| Bon de réception / livraison | Liés aux commandes d'achat et de vente |
| Règle de réapprovisionnement | Seuil et quantité de recommande |
| Valorisation | FIFO, coût moyen mobile |

```bash
# Installation via Frappe Bench (Python, MariaDB, Redis, Node) ou image Docker « frappe/erpnext »
bench new-site parc.exemple.fr
bench --site parc.exemple.fr install-app erpnext
bench start                      # développement ; en production : gunicorn + superviseur + Nginx
```

ERPNext convient si l'on veut lier le stock à la **comptabilité, aux achats et aux ventes**. Pour un simple suivi de matériel, c'est disproportionné.

## OpenWMS

**OpenWMS** est un **système de gestion d'entrepôt** (WMS) open source orienté flux (emplacements, mouvements, préparation de commandes) et interfaçage avec des automatismes (convoyeurs, transstockeurs). Projet Java de **niche**, à la communauté réduite : à n'envisager que pour un vrai besoin WMS, avec les compétences de développement associées.

## OpenLMIS

**OpenLMIS** est un **système d'information de gestion logistique** (*Logistics Management Information System*) conçu pour la **santé publique** dans les pays à faibles ressources : gestion des approvisionnements en médicaments et vaccins, chaîne du froid, multi-établissements. C'est une solution **sectorielle** (ONG, ministères de la santé), sans rapport avec la gestion d'un parc informatique.

## Choisir

| Besoin | Outil |
| --- | --- |
| Petit stock de consommables ou de biens | [[01-grocy-homebox-partkeepr\|Grocy, Homebox]] |
| Composants, pièces détachées | Part-DB, InvenTree |
| Stock intégré aux achats/ventes/compta | ERPNext (module Stock) |
| Entrepôt avec flux et automatismes | OpenWMS (projet de niche) |
| Logistique de santé publique | OpenLMIS (sectoriel) |

> [!NOTE]
> Ces trois dernières solutions sont citées pour complétude du catalogue. Dans un contexte d'administration système et réseau, le besoin réel est presque toujours couvert par un inventaire de parc ([[21-outils/06-support-parc/04-glpi-installation|GLPI]]) ou un petit gestionnaire de stock.

Commandes : [[90-aide-memoire|aide-mémoire]].
