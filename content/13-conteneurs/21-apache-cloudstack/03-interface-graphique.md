---
title: Interface graphique
description: Interface web d'Apache CloudStack (Primate) — connexion, tableau de bord de capacité, assistant d'ajout de zone, infrastructure (zones, pods, clusters, hôtes, stockage, VM système), déploiement d'une instance, réseaux et VPC, comptes, domaines et rôles, offres et modèles, vue utilisateur, équivalents CloudMonkey.
tags: [cloudstack, interface graphique, primate, cloud]
icon: app-window
---

Interface web moderne (projet *Primate*) : `http://cloud-mgmt.corp.exemple.fr:8080/client` — publiez-la en HTTPS derrière un proxy inverse. Connexion avec un compte, un domaine (vide = ROOT) ou par SAML/OAuth/LDAP selon la configuration.

<!-- CAPTURE: CloudStack — tableau de bord de capacité (CPU, mémoire, stockage, IP publiques) | _assets/cloudstack-tableau-de-bord.png -->

## Assistant d'ajout de zone

*Infrastructure → Zones → Ajouter une zone* : type (basique/avancé), DNS, hyperviseur, réseau physique et **étiquettes de trafic**, plages publiques et de gestion, pod, cluster, hôte, stockage primaire et secondaire, puis *Lancer la zone*.

<!-- CAPTURE: CloudStack — assistant d'ajout de zone, étape réseau physique | _assets/cloudstack-assistant-zone.png -->

## Infrastructure

*Infrastructure* : résumé, zones, pods, clusters, **hôtes** (état, maintenance), stockage primaire et secondaire, **VM système** (routeurs virtuels, SSVM, CPVM), alertes.

<!-- CAPTURE: CloudStack — liste des hôtes KVM et leur état | _assets/cloudstack-hotes.png -->

## Instances

*Calcul → Instances → Ajouter une instance* : zone, **modèle** ou ISO, offre de service, disque de données, réseaux, groupes d'affinité, clé SSH, données utilisateur (cloud-init). Ensuite : console (proxy de console), instantanés de VM et de volumes, redimensionnement, migration (administrateur).

<!-- CAPTURE: CloudStack — assistant de déploiement d'instance | _assets/cloudstack-deployer-instance.png -->

## Réseau

*Réseau → Réseaux invités* (isolés, partagés), **VPC** (sous-réseaux, ACL, passerelle VPN), adresses IP publiques (NAT statique, redirection de ports, répartition de charge, pare-feu), VPN d'accès distant.

## Comptes et offres

*Domaines*, *Comptes*, *Utilisateurs* (clés d'API), *Rôles* ; *Offres de service / disque / réseau* ; *Images → Modèles, ISO* ; *Projets* pour les ressources partagées d'une équipe.

## Correspondance interface ↔ CloudMonkey

| Action | Interface | Commande `cmk` |
| --- | --- | --- |
| Lister les instances | Calcul → Instances | `cmk list virtualmachines` |
| Déployer | Ajouter une instance | `cmk deploy virtualmachine …` |
| Hôte en maintenance | Hôtes → Maintenance | `cmk prepare hostformaintenance id=<id>` |
| Clés d'API | Utilisateurs → Générer les clés | `cmk register userkeys id=<id>` |
