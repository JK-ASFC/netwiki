---
title: EJBCA Community
description: EJBCA Community (Keyfactor, LGPL) — PKI d'entreprise complète en Java : AC multiples et hiérarchies, profils de certificats et d'entités finales, protocoles d'inscription (ACME, SCEP pour MDM et équipements réseau, EST, CMP, REST, web), listes de révocation et OCSP, auto-inscription Windows (édition Enterprise), installation Docker (keyfactor/ejbca-ce) et base MariaDB/PostgreSQL, administration par certificat client, RA Web, sauvegarde, et comparaison avec AD CS et step-ca.
tags: [ejbca, pki, autorité de certification, scep, ocsp, keyfactor]
icon: info
---

**EJBCA** est une PKI de niveau entreprise : plusieurs **AC** (racine hors ligne, intermédiaires), profils de certificats détaillés, **SCEP** pour l'inscription des équipements réseau et des terminaux mobiles (MDM), **ACME**, **EST**, **CMP**, **OCSP** et listes de révocation. L'édition **Community** (LGPL) couvre l'essentiel ; l'édition Enterprise ajoute notamment l'intégration HSM avancée et l'auto-inscription Windows.

| | AD CS (Windows) | EJBCA Community | [[01-step-ca\|step-ca]] |
| --- | --- | --- | --- |
| Cible | Domaine Active Directory | PKI multi-usages, équipements, MDM | Services internes, ACME, SSH |
| Protocoles | DCOM/auto-inscription, NDES (SCEP) | ACME, SCEP, EST, CMP, REST | ACME, API, SSH |
| Complexité | Moyenne | **Élevée** | Faible |

## Installation (Docker)

```bash
docker network create pki
docker run -d --name ejbca-db --network pki -e MARIADB_ROOT_PASSWORD=… -e MARIADB_DATABASE=ejbca -e MARIADB_USER=ejbca -e MARIADB_PASSWORD=MdpEjbca2026 mariadb:11
docker run -d --name ejbca --network pki -p 443:8443 -p 80:8080 -h ca.corp.exemple.fr \
  -e DATABASE_JDBC_URL="jdbc:mariadb://ejbca-db:3306/ejbca?characterEncoding=UTF-8" -e DATABASE_USER=ejbca -e DATABASE_PASSWORD=MdpEjbca2026 \
  -e TLS_SETUP_ENABLED=simple keyfactor/ejbca-ce
docker logs -f ejbca          # attendre la fin de l'initialisation
```

Le mode `TLS_SETUP_ENABLED=simple` donne un accès d'administration initial à `https://ca.corp.exemple.fr/ejbca/adminweb/` ; créer ensuite un **certificat d'administrateur** (authentification par certificat client) et refermer cet accès.

## Mise en place type

1. Créer l'**AC racine** (ou importer une AC existante) et une **AC émettrice**.
2. Définir les **profils de certificats** (serveur TLS, client, équipement réseau) et **d'entités finales** (champs obligatoires, AC autorisées).
3. Activer les protocoles nécessaires (*System Configuration → Protocol Configuration*) : ACME, SCEP (alias avec mot de passe de challenge), EST.
4. Publier CRL et OCSP sur une URL accessible à tous les clients.

Interface : [[03-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
