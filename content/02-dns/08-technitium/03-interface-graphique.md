---
title: Interface graphique
description: Console web de Technitium DNS Server — tableau de bord (requêtes, clients, domaines bloqués), zones et enregistrements, DNSSEC, paramètres (général, récursion, transferts, blocage, protocoles chiffrés), listes autorisées et bloquées, applications, DHCP, journaux de requêtes, outil de résolution intégré, administration (utilisateurs, sessions, jetons d'API, sauvegarde).
tags: [technitium, interface graphique, dns]
icon: app-window
---

`https://dns01.corp.exemple.fr:53443` (ou `http://…:5380`) :

| Onglet | Contenu |
| --- | --- |
| **Dashboard** | Requêtes par type et résultat, meilleurs clients, domaines les plus demandés et bloqués |
| **Zones** | Liste, ajout (primaire, secondaire, transfert conditionnel), édition des enregistrements, DNSSEC |
| **Cache** | Parcourir et vider le cache |
| **Allowed / Blocked** | Domaines autorisés et bloqués manuellement |
| **Apps** | App Store et configuration des applications |
| **DNS Client** | Outil de résolution (comme `dig`) depuis le serveur |
| **Settings** | Général, récursion, transferts, proxy et amont, blocage, protocoles optionnels, journalisation |
| **DHCP** | Étendues, baux, réservations |
| **Administration** | Utilisateurs et groupes, sessions, **jetons d'API**, cluster |
| **Logs** | Journaux du serveur et des requêtes |

<!-- CAPTURE: Technitium — tableau de bord | _assets/technitium-tableau-de-bord.png -->
<!-- CAPTURE: Technitium — édition d'une zone et de ses enregistrements | _assets/technitium-zone.png -->
<!-- CAPTURE: Technitium — paramètres de blocage avec listes | _assets/technitium-blocage.png -->
<!-- CAPTURE: Technitium — DNS Client (outil de résolution) | _assets/technitium-dns-client.png -->

## Correspondance interface ↔ API

| Action | Interface | API |
| --- | --- | --- |
| Lister les zones | Zones | `GET /api/zones/list` |
| Ajouter un enregistrement | Zone → Add Record | `GET /api/zones/records/add` |
| Vider le cache | Cache → Flush | `GET /api/cache/flush` |
| Sauvegarde | Settings → Backup | `GET /api/settings/backup` |
