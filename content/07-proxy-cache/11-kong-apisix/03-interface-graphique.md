---
title: Interfaces graphiques (Kong Manager et APISIX)
description: Interfaces web des passerelles d'API — Kong Manager OSS (port 8002 : Gateway Services, Routes, Consumers, Plugins, Upstreams, Certificates) et tableau de bord d'Apache APISIX (routes, upstreams, services, consommateurs, greffons), avec emplacements de captures d'écran.
tags: [kong manager, apisix dashboard, interface graphique, api gateway, captures]
icon: monitor
---

## Kong Manager OSS (`http://<hôte>:8002`)

| Menu | Contenu |
| --- | --- |
| **Gateway Services** | Services, route(s) et greffons associés |
| **Routes** | Chemins, hôtes, méthodes, protocoles |
| **Consumers** | Clients et identifiants (clés, JWT, ACL) |
| **Plugins** | Greffons globaux ou ciblés, formulaire de configuration |
| Upstreams, Certificates, SNIs, Keys | Répartition, TLS |

En mode DB-less, Kong Manager est **en lecture seule** (la configuration vient du fichier déclaratif).

<!-- CAPTURE: Kong Manager — liste des Gateway Services | _assets/kong-manager-services.png -->
<!-- CAPTURE: Kong Manager — ajout du greffon rate-limiting à une route | _assets/kong-manager-greffon.png -->

## Apache APISIX

Les versions récentes intègrent un tableau de bord servi par l'API d'administration (`http://<hôte>:9180/ui/`), qui remplace l'ancien projet séparé *apisix-dashboard* : routes, upstreams, services, consommateurs, certificats SSL, greffons globaux, avec éditeur de formulaire ou JSON.

<!-- CAPTURE: APISIX — liste des routes | _assets/apisix-routes.png -->
<!-- CAPTURE: APISIX — configuration des greffons d'une route | _assets/apisix-greffons.png -->
