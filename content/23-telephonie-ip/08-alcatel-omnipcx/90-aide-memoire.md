---
title: Alcatel-Lucent OmniPCX et OXO — aide-mémoire
description: Commandes de supervision du Call Server OmniPCX Enterprise (mgr, netadmin, swinst, infocs, role, listerm, trkstat, compvisu, incvisu, tuner) et repères d'administration OXO Connect et Rainbow, avec précautions d'usage.
tags: [aide-mémoire, alcatel, omnipcx, oxe, oxo, rainbow]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-omnipcx-enterprise|OmniPCX Enterprise]] et [[02-oxo-connect-rainbow|OXO Connect et Rainbow]]. Les noms et options exacts dépendent de la version : consultez l'aide en ligne et la documentation ALE.

## OmniPCX Enterprise (Call Server, compte de maintenance)

| Commande | Usage |
| --- | --- |
| `infocs` | Version, rôle et état du Call Server |
| `role` | Rôle dans le duplex (principal / secours) |
| `listerm <numéro>` | État d'un poste (type, enregistrement, adresse IP) |
| `trkstat <faisceau>` | État d'un faisceau de lignes |
| `compvisu` | Ressources de compression et transcodage |
| `incvisu` | Incidents en cours |
| `tuner` | Licences et capacités |
| `mgr` | Outil de gestion à menus (création, modification, consultation d'objets) |
| `netadmin -m` | Configuration réseau du Call Server |
| `swinst` | Versions logicielles, sauvegardes et restaurations |

Précautions : `netadmin` et `swinst` modifient le système ; à utiliser hors production ou en fenêtre de maintenance, après une sauvegarde.

## OXO Connect et Rainbow

| Tâche | Outil |
| --- | --- |
| Administration courante | WBM (`https://<adresse-oxo>`) |
| Configuration complète | OMC (client Windows) |
| Sauvegarde | WBM/OMC → sauvegarde de la configuration avant toute modification |
| Utilisateurs Rainbow | Console d'administration Rainbow (import CSV, synchronisation annuaire, SSO) |
