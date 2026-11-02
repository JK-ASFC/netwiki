---
title: Interfaces graphiques
description: Interfaces web des DNS filtrants — AdGuard Home (tableau de bord, journal des requêtes avec blocage/déblocage en un clic, filtres et listes, réécritures, clients, paramètres DNS et chiffrement) et Pi-hole v6 (tableau de bord, Query Log, listes, groupes, domaines, DNS local, paramètres, Teleporter) ; supervision de Blocky avec Grafana.
tags: [adguard home, pi-hole, blocky, interface graphique, dns filtrant]
icon: app-window
---

## AdGuard Home

`http://<ip>` (port choisi à l'installation) :

| Page | Contenu |
| --- | --- |
| **Tableau de bord** | Requêtes, requêtes bloquées, temps de réponse moyen, meilleurs clients et domaines |
| **Journal des requêtes** | Chaque requête (client, domaine, résultat, règle appliquée) ; boutons **Bloquer / Débloquer** |
| **Filtres** | Listes de blocage et d'autorisation, règles personnalisées, **réécritures DNS**, services bloqués |
| **Paramètres** | Généraux (sécurité, contrôle parental), DNS (amonts, transferts conditionnels, cache, limites), **chiffrement**, clients, DHCP |

<!-- CAPTURE: AdGuard Home — tableau de bord | _assets/adguard-home-tableau-de-bord.png -->
<!-- CAPTURE: AdGuard Home — journal des requêtes avec la règle appliquée | _assets/adguard-home-journal.png -->
<!-- CAPTURE: AdGuard Home — paramètres DNS (amonts et transfert conditionnel) | _assets/adguard-home-parametres-dns.png -->

## Pi-hole (v6)

`https://<ip>/admin` :

| Page | Contenu |
| --- | --- |
| **Dashboard** | Requêtes totales et bloquées, pourcentage, clients actifs, graphiques |
| **Query Log** | Historique filtrable ; autoriser/bloquer un domaine depuis une ligne |
| **Lists** | Listes de blocage (gravity), mise à jour |
| **Groups / Clients / Domains** | Règles par groupe de postes, domaines autorisés/bloqués (exacts ou expressions) |
| **Local DNS** | Enregistrements A et CNAME locaux |
| **Settings** | DNS (amonts, transfert conditionnel), DHCP, API, **Teleporter** (sauvegarde) |

<!-- CAPTURE: Pi-hole — tableau de bord | _assets/pihole-tableau-de-bord.png -->
<!-- CAPTURE: Pi-hole — Query Log | _assets/pihole-query-log.png -->

## Blocky

Pas d'interface intégrée : importer le **tableau de bord Grafana** fourni par le projet (métriques Prometheus : requêtes, blocages, cache, listes) et, si le journal des requêtes est en base (MySQL/PostgreSQL), le tableau de bord associé.

<!-- CAPTURE: Grafana — tableau de bord Blocky | _assets/blocky-grafana.png -->
