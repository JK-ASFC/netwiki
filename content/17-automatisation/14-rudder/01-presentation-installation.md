---
title: Présentation, installation et utilisation
description: Rudder (Normation, GPL pour la version libre ; abonnements pour les greffons et le support) — gestion de configuration et conformité continue d'origine française : architecture (serveur, relais, agents Linux et Windows fondés sur CFEngine), techniques et éditeur de techniques, directives, règles, groupes dynamiques, conformité en temps réel (respecté, réparé, en erreur, non conforme), mode audit et mode application, inventaire, installation (dépôt Rudder pour Debian, Ubuntu, RHEL, SLES), acceptation des nœuds, API, greffons (CVE, sécurité, reporting) et cas d'usage (référentiels de sécurité, ANSSI).
tags: [rudder, normation, conformité, gestion de configuration, audit, cfengine]
icon: info
---

**Rudder** combine **gestion de configuration** et **mesure de conformité** : chaque règle appliquée indique en continu, pour chaque machine, si l'état attendu est *respecté*, a été *réparé* ou est *en erreur*. Son mode **audit** (constater sans modifier) en fait un bon outil pour suivre un référentiel de durcissement (ANSSI, CIS) avant de corriger. Les agents reposent sur [[08-chef-cfengine/02-cfengine|CFEngine]].

## Installation

```bash
# Serveur (Debian/Ubuntu) : dépôt Rudder (clé et sources selon la version), puis
sudo apt install rudder-server            # interface https://<serveur>/rudder
sudo rudder server create-user -u admin
# Agent sur chaque nœud Linux
sudo apt install rudder-agent && sudo rudder agent policy-server rudder.corp.exemple.fr && sudo rudder agent inventory
```

RHEL et SLES : dépôts RPM ; Windows : agent sous abonnement. Les nouveaux nœuds apparaissent dans *Node management → Pending nodes* et doivent être **acceptés**.

## Logique

| Objet | Rôle |
| --- | --- |
| **Groupe** | Ensemble de nœuds, souvent **dynamique** (OS, propriété, sous-réseau) |
| **Technique** | Modèle de configuration (fournie ou créée dans l'éditeur, sans code) |
| **Directive** | Technique + paramètres (« NTP vers ntp1/ntp2 », « SSH sans root ») |
| **Règle** | Directives appliquées à des groupes, avec **mode audit ou application** |

Exemple : règle « Socle serveurs Linux » = directives NTP, utilisateurs d'administration, configuration SSH, paquets interdits, appliquée au groupe dynamique « Tous les Linux », d'abord en **audit**, puis en **application** une fois les écarts compris.

Interface : [[02-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
