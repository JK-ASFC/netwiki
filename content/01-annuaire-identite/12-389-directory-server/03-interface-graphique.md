---
title: Interface graphique (console 389 dans Cockpit)
description: Console web de 389 Directory Server dans Cockpit (cockpit-389-ds) — installation, accès, création d'instance, configuration du serveur, base de données et suffixes, réplication (accords, supervision), schéma, plug-ins, sécurité TLS, politique de mots de passe, éditeur LDAP (entrées, ACI), supervision et journaux, équivalents dsconf.
tags: [389 directory server, cockpit, interface graphique, ldap]
icon: app-window
---

La console **389 Directory Server** est un module de Cockpit :

```bash
sudo dnf install -y cockpit cockpit-389-ds
sudo systemctl enable --now cockpit.socket
```

`https://ldap-01.corp.exemple.fr:9090` → menu **389 Directory Server** (accès administrateur requis dans Cockpit).

<!-- CAPTURE: Cockpit 389 — sélection de l'instance et onglets principaux | _assets/389ds-cockpit-instance.png -->

## Onglets

| Onglet | Contenu |
| --- | --- |
| **Server** | Paramètres généraux, SASL, journaux, performances, gestionnaire d'annuaire |
| **Database** | Suffixes, index, politique de mots de passe globale et locale, chaînage |
| **Replication** | Activation par suffixe, accords (créer, initialiser), changelog |
| **Schema** | Classes d'objets, attributs, règles de correspondance |
| **Plugins** | memberOf, intégrité référentielle, unicité, DNA (numérotation automatique), etc. |
| **Monitoring** | Statistiques serveur et bases, état de la **réplication**, journaux en direct |
| **LDAP Browser** | Arborescence, création et modification d'entrées, **ACI**, rôles, CoS |

<!-- CAPTURE: Cockpit 389 — onglet Replication, accords et état | _assets/389ds-cockpit-replication.png -->
<!-- CAPTURE: Cockpit 389 — LDAP Browser, édition d'un utilisateur | _assets/389ds-cockpit-ldap-browser.png -->
<!-- CAPTURE: Cockpit 389 — politique de mots de passe | _assets/389ds-cockpit-pwpolicy.png -->

## Correspondance console ↔ ligne de commande

| Action | Console | Commande |
| --- | --- | --- |
| Créer une instance | Bouton *Create New Instance* | `dscreate from-file instance.inf` |
| Ajouter un index | Database → Indexes | `dsconf corp backend index add --attr mail --index-type eq userroot` |
| Supervision de la réplication | Monitoring → Replication | `dsconf corp replication monitor` |
| Activer memberOf | Plugins | `dsconf corp plugin memberof enable` |
