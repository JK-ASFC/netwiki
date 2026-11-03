---
title: Logiciels de caisse (OSPOS, uniCenta, Floreant, ERPNext POS)
description: Caisses enregistreuses libres — Open Source Point of Sale (MIT, PHP/CodeIgniter : ventes, stocks, clients, fournisseurs, reçus ; Docker Compose, compte admin/pointofsale), uniCenta oPOS (GPL, Java : caisse de bureau Windows, Linux, macOS avec MySQL, imprimantes de tickets et tiroirs), Floreant POS (GPL, Java : restauration, tables, cuisine) et ERPNext POS (point de vente intégré à ERPNext, profils POS, mode hors ligne), matériel, conformité fiscale (certification des logiciels de caisse en France), sauvegarde.
tags: [ospos, unicenta, floreant, erpnext, caisse, pos, point de vente]
icon: shopping-basket
---

| Logiciel | Licence | Type | Usage |
| --- | --- | --- | --- |
| **Open Source POS (OSPOS)** | MIT | Web (PHP, MySQL) | Commerce de détail, stock et clients, plusieurs postes dans le navigateur |
| **uniCenta oPOS** | GPL v3 | Bureau (Java, MySQL) | Commerce et restauration, écran tactile, périphériques |
| **Floreant POS** | GPL | Bureau (Java) | **Restauration** : plan de salle, commandes cuisine, tickets |
| **ERPNext POS** | GPL v3 | Web (dans [[08-erp/02-frappe-erpnext\|ERPNext]]) | Caisse reliée à la comptabilité et aux stocks de l'ERP |

> [!WARNING]
> En France, un commerçant assujetti à la TVA qui enregistre des paiements de particuliers doit utiliser un **logiciel de caisse certifié** (ou attesté par l'éditeur) répondant aux conditions d'inaltérabilité, de sécurisation, de conservation et d'archivage des données. Vérifier cette conformité avant tout usage en production ; ces logiciels libres ne la garantissent pas par défaut.

## Open Source POS

```bash
git clone https://github.com/opensourcepos/opensourcepos.git && cd opensourcepos
docker compose up -d                           # application, base MariaDB ; voir docker-compose.yml et les variables du dépôt
```

Ou l'archive de la dernière version sur un serveur PHP + MySQL (Linux, Windows, macOS), avec import du schéma fourni et configuration de la base dans `app/Config` / `.env` selon la version. Compte initial **`admin` / `pointofsale`** : à changer immédiatement. Modules : ventes et retours, réceptions, articles et kits, clients et fidélité, fournisseurs, rapports, multi-emplacements de stock, impression des reçus et codes-barres.

<!-- CAPTURE: Écran de vente OSPOS | _assets/ospos-vente.png -->

## uniCenta oPOS

Application **Java de bureau** : installateur pour Windows, Linux et macOS (site de l'éditeur), base **MySQL/MariaDB** partagée par les caisses (ou base embarquée pour une caisse unique). Au premier lancement, l'assistant configure la base, puis *Maintenance → Ressources* (ticket, logo), *Périphériques* (imprimante ESC/POS, tiroir-caisse, afficheur client, balance, lecteur de codes-barres), utilisateurs et rôles. Sauvegarder la base MySQL quotidiennement (`mysqldump unicentaopos`).

## Floreant POS

Caisse Java orientée **restaurants** (plan de salle, commandes par table, envoi en cuisine, pourboires, rapports de fin de journée). Installation : archive ou installateur Java (Windows, Linux, macOS), base embarquée Derby ou MySQL pour plusieurs postes. Le projet évolue peu : vérifier sa compatibilité avec votre matériel et vos obligations fiscales.

## ERPNext POS

Le **Point de vente** est inclus dans ERPNext : créer un **profil POS** (*Vente → Profil de point de vente* : entrepôt, modes de paiement, utilisateurs, imprimantes), puis ouvrir l'écran *Point de vente*. Les ventes génèrent des factures et des mouvements de stock ; le mode hors ligne synchronise les ventes au retour du réseau. Ouverture et clôture de caisse par les documents *Ouverture de PDV* et *Clôture de PDV*.

Commandes : [[90-aide-memoire|aide-mémoire]].
