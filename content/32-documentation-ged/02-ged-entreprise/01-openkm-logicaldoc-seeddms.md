---
title: OpenKM, LogicalDOC et SeedDMS
description: GED d'entreprise en éditions communautaires — principes (arborescence de dossiers, versions et verrouillage, métadonnées, droits, cycle de validation, conservation) ; OpenKM Community (Java/Tomcat, GPL : installation, base MySQL ou PostgreSQL, port 8080, compte okmAdmin, WebDAV, OCR, limites de l'édition), LogicalDOC Community (LGPL : installateur, Tomcat, port 8080, admin par défaut, WebDAV, CMIS, import en masse) et SeedDMS (PHP, GPL : installation sur Apache et MariaDB, workflows de relecture et d'approbation, notifications, WebDAV, conservation) ; sauvegarde, sécurité et choix.
tags: [openkm, logicaldoc, seeddms, ged, gestion documentaire, workflow, webdav, java, php]
icon: archive
---

Ces GED reproduisent le fonctionnement d'un **serveur documentaire d'entreprise** : arborescence de dossiers, **versions** avec verrouillage (extraction/archivage), métadonnées, **droits** par groupe, **cycle de validation** et accès par **WebDAV** ou intégration bureautique. Chacune existe en édition communautaire libre et en édition commerciale plus complète.

## Principes communs

| Fonction | Intérêt |
| --- | --- |
| Versions et verrouillage | Un seul rédacteur à la fois, historique complet |
| Métadonnées et modèles | Recherche et classement par client, projet, nature |
| Droits par dossier | Lecture, écriture, suppression, administration, héritage |
| Validation | Relecture et approbation avant diffusion d'une procédure |
| Audit | Qui a consulté ou modifié quoi |
| WebDAV / CMIS | Monter la GED comme un lecteur réseau, intégrer d'autres logiciels |

## OpenKM Community

**OpenKM** (Java, édition communautaire sous GPL) : interface web, recherche texte intégral (Lucene), OCR, métadonnées, notes, abonnements aux dossiers.

```bash
# Installateur ou archive Tomcat fournie par l'éditeur ; Java requis
# Démarrage avec l'archive
/opt/openkm/bin/startup.sh ; tail -f /opt/openkm/logs/catalina.out
# Interface : http://serveur:8080/OpenKM — compte initial okmAdmin / admin : le changer immédiatement
```

- Base intégrée par défaut (H2/HSQLDB) : passer à **MySQL/MariaDB ou PostgreSQL** en production (`OpenKM.cfg`, propriété `hibernate.dialect` et source de données JNDI).
- WebDAV : `http://serveur:8080/OpenKM/webdav`.
- L'édition communautaire évolue peu et n'a ni workflows complets ni certaines intégrations, réservés à l'édition commerciale.

## LogicalDOC Community

**LogicalDOC CE** (LGPL) : installateur graphique ou en console pour Linux et Windows, avec Tomcat intégré.

```bash
java -jar logicaldoc-community-installer.jar          # assistant d'installation (choix de la base : MySQL, MariaDB, PostgreSQL…)
/opt/logicaldoc/bin/logicaldoc.sh start               # service Windows : LogicalDOC
# Interface : http://serveur:8080 — compte admin / admin à changer
```

- Import en masse depuis un dossier ou un ZIP, extraction automatique du texte, recherche texte intégral.
- Accès **WebDAV** (`/webdav`), **CMIS** (`/service/cmis`) et API SOAP/REST.
- OCR, workflows avancés, signature, intégration Office avancée et réplication : édition commerciale.

## SeedDMS

**SeedDMS** (PHP, GPL) est simple à héberger sur un serveur web classique et propose, dans son édition libre, un **workflow de relecture et d'approbation** complet.

```bash
sudo apt install apache2 mariadb-server php php-mysql php-gd php-mbstring php-xml php-zip php-intl php-imagick poppler-utils
cd /var/www && sudo tar xzf seeddms-quickstart-*.tar.gz        # archive « quickstart » du projet
sudo chown -R www-data:www-data /var/www/seeddms60x
# Créer la base, puis ouvrir http://serveur/install/ ; supprimer ou bloquer le dossier install ensuite (fichier ENABLE_INSTALL_TOOL)
```

- Versions, liens entre documents, **dates d'expiration** (revue périodique des procédures), notifications par courriel.
- Relecture puis approbation par des personnes ou groupes désignés, ou **workflows** définis graphiquement.
- WebDAV (`/webdav/index.php`), extraction du texte pour la recherche (pdftotext, catdoc), import de dossiers, conversion pour l'aperçu.
- Le dossier de données (`data/`) doit être **hors de la racine web** et non accessible directement.

## Sauvegarde et sécurité

- Sauvegarder **ensemble** la base de données et le dépôt de fichiers (cohérence au même instant), puis tester une restauration.
- HTTPS obligatoire, comptes par **LDAP/Active Directory** (pris en charge par les trois), suppression des comptes par défaut.
- Mises à jour régulières : ces applications Java et PHP sont des cibles fréquentes une fois exposées.

## Choisir

| Besoin | Outil |
| --- | --- |
| Validation de procédures, hébergement PHP simple | SeedDMS |
| GED Java avec CMIS et WebDAV, évolution possible vers une offre commerciale | LogicalDOC |
| Existant OpenKM | Maintenir ; comparer avec les alternatives actives avant une extension |
| Dématérialisation de courrier et factures avec OCR et classement automatique | [[01-ged-legere/01-paperless-ngx\|Paperless-ngx]] |
| Partage de fichiers collaboratif plutôt que GED | Nextcloud, Seafile (chapitre Fichiers et partage) |

Commandes : [[90-aide-memoire|aide-mémoire]].
