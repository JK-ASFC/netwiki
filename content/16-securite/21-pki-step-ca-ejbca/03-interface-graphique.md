---
title: Interfaces graphiques
description: Interfaces d'EJBCA (Admin Web : autorités de certification, profils de certificats et d'entités finales, recherche et révocation, configuration des protocoles ; RA Web : demandes et inscriptions) et de step-ca (pas d'interface : outils step et API ; console Smallstep commerciale), avec emplacements de captures d'écran.
tags: [ejbca, step-ca, interface graphique, pki, captures]
icon: monitor
---

## EJBCA

| Interface | Contenu |
| --- | --- |
| **Admin Web** (`/ejbca/adminweb/`) | *Certification Authorities*, *Certificate Profiles*, *End Entity Profiles*, *Search End Entities* (révocation), *System Configuration* (protocoles ACME, SCEP, EST), *Roles and Access Rules* |
| **RA Web** (`/ejbca/ra/`) | Demander un certificat, rechercher, approuver, télécharger |

<!-- CAPTURE: EJBCA — Admin Web, liste des autorités de certification | _assets/ejbca-ac.png -->
<!-- CAPTURE: EJBCA — profil de certificat serveur TLS | _assets/ejbca-profil.png -->
<!-- CAPTURE: EJBCA — RA Web, demande de certificat | _assets/ejbca-ra.png -->

## step-ca

Pas d'interface graphique dans la version libre : l'administration passe par `step ca …` et la configuration `ca.json`. La plate-forme commerciale Smallstep fournit une console web.
