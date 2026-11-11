---
title: Gestion de stocks — aide-mémoire
description: Ports et déploiement de Grocy, Homebox, Part-DB et InvenTree, et commandes Frappe Bench pour le module Stock d'ERPNext.
tags: [aide-mémoire, grocy, homebox, partkeepr, partdb, inventree, erpnext]
icon: terminal
---

Explications : [[01-grocy-homebox-partkeepr|Grocy, Homebox et PartKeepr]] · [[02-erpnext-openwms-openlmis|ERPNext, OpenWMS et OpenLMIS]].

| Outil | Port | Base |
| --- | --- | --- |
| Grocy | 9283 | SQLite |
| Homebox | 7745 | SQLite (interne) |
| Part-DB | 8080 (conteneur) | SQLite ou MySQL |
| InvenTree | 8000 | PostgreSQL / SQLite |
| ERPNext | 8000 (bench) / 80 (prod) | MariaDB |

```bash
# Grocy
docker run -d -p 9283:80 -v /srv/grocy:/config -e TZ=Europe/Paris lscr.io/linuxserver/grocy:latest

# Homebox
docker run -d -p 7745:7745 -v /srv/homebox:/data -e HBOX_OPTIONS_ALLOW_REGISTRATION=false ghcr.io/sysadminsmedia/homebox:latest

# Part-DB
docker run -d -p 8080:80 -v /srv/partdb:/var/www/html/uploads jbtronics/part-db1:latest

# ERPNext (Frappe Bench)
bench new-site parc.exemple.fr
bench --site parc.exemple.fr install-app erpnext
bench --site parc.exemple.fr backup --with-files

# Sauvegardes SQLite (Grocy, Homebox) : copier le volume à l'arrêt du conteneur
```
