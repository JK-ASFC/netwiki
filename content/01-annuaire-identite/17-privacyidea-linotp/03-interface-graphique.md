---
title: Interface graphique
description: Interfaces web de privacyIDEA (administration : tableau de bord, jetons, utilisateurs, composants, configuration des résolveurs, royaumes et politiques, audit ; espace utilisateur : inscription d'un jeton par QR code) et de LinOTP (Manage UI, portail d'auto-service), équivalents en ligne de commande.
tags: [privacyidea, linotp, interface graphique, mfa, otp]
icon: app-window
---

## privacyIDEA — administration

`https://mfa.corp.exemple.fr` (compte administrateur créé avec `pi-manage admin add`) :

| Onglet | Contenu |
| --- | --- |
| **Dashboard** | Jetons actifs, authentifications réussies/échouées, abonnements |
| **Tokens** | Liste, recherche, inscription pour un utilisateur, désactivation, resynchronisation, réinitialisation du compteur d'échecs |
| **Users** | Utilisateurs des royaumes et leurs jetons |
| **Machines** | Attribution de jetons à des machines (SSH, hors ligne) |
| **Config** | Résolveurs, royaumes, **politiques**, gestionnaires d'événements (notifications), fournisseurs SMS/e-mail, CA |
| **Audit** | Journal de toutes les actions et authentifications, filtrable |

<!-- CAPTURE: privacyIDEA — liste des jetons | _assets/privacyidea-jetons.png -->
<!-- CAPTURE: privacyIDEA — configuration d'un résolveur LDAP Active Directory | _assets/privacyidea-resolveur-ldap.png -->
<!-- CAPTURE: privacyIDEA — éditeur de politique (scope authentication) | _assets/privacyidea-politique.png -->

## privacyIDEA — espace utilisateur

L'utilisateur se connecte avec son mot de passe d'annuaire (selon la politique), choisit **Enroll Token** → TOTP → scanne le **QR code** avec son application, puis teste le code.

<!-- CAPTURE: privacyIDEA — inscription d'un jeton TOTP avec QR code | _assets/privacyidea-inscription-totp.png -->

## LinOTP

- **Manage UI** (`/manage/`) : jetons (inscrire, assigner, désactiver, resynchroniser), utilisateurs, configuration (résolveurs, royaumes, politiques, fournisseurs), audit.
- **Auto-service** (`/selfservice/`) : inscription et gestion de ses propres jetons.

<!-- CAPTURE: LinOTP — Manage UI, liste des jetons | _assets/linotp-manage.png -->

## Correspondance interface ↔ ligne de commande

| Action | Interface | Commande |
| --- | --- | --- |
| Lister les jetons | Tokens | `pi-manage` / API `GET /token/` |
| Désactiver un jeton | Tokens → Disable | `curl -X POST -H "Authorization: $JWT" -d serial=TOTP0001 https://mfa…/token/disable` |
| Tester une authentification | — | `curl -d user=alice -d pass=… https://mfa…/validate/check` |
