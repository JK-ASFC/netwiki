---
title: Zammad
description: Zammad, système libre de tickets et d'assistance multicanal — fonctions (courriel, formulaire web, chat, téléphone, réseaux sociaux), prérequis (PostgreSQL, Elasticsearch, Redis), installation par paquets ou Docker Compose, configuration initiale, groupes, rôles et organisations, LDAP/Active Directory et SSO, déclencheurs, planificateurs, SLA, macros et modèles, base de connaissances, intégrations (supervision, GitLab), sauvegarde, sécurité et dépannage.
tags: [zammad, helpdesk, tickets, multicanal, elasticsearch, ldap, support]
icon: ticket
---

**Zammad** (AGPL) est un système de **tickets** moderne et multicanal : courriels, formulaire web, chat, téléphone (intégration CTI), Telegram, WhatsApp. Plus orienté **assistance** que [[04-glpi-installation|GLPI]] (qui excelle aussi en gestion de parc), il offre une interface en temps réel très fluide. Hébergement possible chez l'éditeur (Zammad GmbH) ou auto-hébergé.

## Prérequis

| Composant | Rôle |
| --- | --- |
| **PostgreSQL** | Base de données |
| **Elasticsearch** (ou OpenSearch) | Recherche plein texte (fortement recommandé ; indispensable au-delà de quelques milliers de tickets) |
| Redis | Cache et file des tâches |
| Serveur web | nginx/Apache en reverse proxy |
| Mémoire | 4 Go minimum, 8 Go et plus avec Elasticsearch |

## Installation

```bash
# Paquets (Debian/Ubuntu) : dépôt de Zammad (packager.io), installe Zammad, sa configuration nginx et PostgreSQL
curl -fsSL https://dl.packager.io/srv/zammad/zammad/key | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/pkgr-zammad.gpg > /dev/null
echo "deb [signed-by=/etc/apt/trusted.gpg.d/pkgr-zammad.gpg] https://dl.packager.io/srv/deb/zammad/zammad/stable/ubuntu 24.04 main" | sudo tee /etc/apt/sources.list.d/zammad.list
sudo apt update && sudo apt install zammad
# Elasticsearch installé séparément, puis :
sudo zammad run rails r "Setting.set('es_url', 'http://127.0.0.1:9200')"
sudo zammad run rake zammad:searchindex:rebuild
```

Docker : dépôt officiel `zammad-docker-compose` (Zammad, PostgreSQL, Elasticsearch, Redis, memcached, nginx). Voir aussi [[01-elasticsearch/01-presentation-installation|Elasticsearch]].

Assistant initial (`https://support.corp.exemple.fr`) : nom de l'organisation, compte administrateur, courriel sortant et canaux.

## Organisation

| Notion | Usage |
| --- | --- |
| **Groupes** | Files de tickets (Support niveau 1, Réseau, Systèmes) avec droits par agent |
| Rôles | Admin, Agent, Client (personnalisables) |
| Organisations | Sociétés / services des clients (partage des tickets entre membres) |
| **Déclencheurs** | Actions sur événement (affecter selon l'adresse de réception, notifier, étiqueter) |
| Planificateurs | Actions périodiques (relance, fermeture des tickets en attente) |
| **SLA** | Délais de première réponse, de mise à jour, de résolution selon des conditions |
| Macros, modèles de texte | Réponses types, actions groupées |
| Base de connaissances | Articles publics ou internes, multilingue |

## Annuaire et SSO

*Paramètres → Intégrations → LDAP* : serveur LDAPS, compte de liaison, base, correspondance des attributs (`sAMAccountName`, `mail`, `givenName`, `sn`), **correspondance groupes AD → rôles**. SSO : SAML, OIDC (Microsoft 365, Keycloak), Kerberos (SSO Windows), avec **2FA** possible pour les agents.

## Intégrations

- Supervision : intégrations **Checkmk**, **Icinga**, **Nagios**, **Monit** (les alertes ouvrent et ferment des tickets automatiquement).
- GitLab / GitHub (lier des tickets à des tickets de développement), Microsoft 365 (boîtes partagées), téléphonie (Sipgate, Placetel, CTI générique).
- **API REST** et webhooks pour l'automatisation.

## Sauvegarde et mises à jour

```bash
# Script de sauvegarde fourni (base + fichiers)
sudo /opt/zammad/contrib/backup/zammad_backup.sh      # paramètres dans config (copier config.dist)
```

Mises à jour via le gestionnaire de paquets (`apt upgrade zammad`) avec les migrations automatiques ; lire les notes de version (versions majeures, prérequis Elasticsearch/PostgreSQL).

## Sécurité et dépannage

- [ ] HTTPS, 2FA pour les agents, inscription des clients maîtrisée
- [ ] Elasticsearch non exposé (écoute locale, authentification)
- [ ] Mises à jour régulières (correctifs de sécurité)

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Recherche vide ou incomplète | Index Elasticsearch absent ou désynchronisé | `zammad run rake zammad:searchindex:rebuild` |
| Courriels non récupérés | Canal IMAP/Microsoft 365, authentification | *Canaux → E-mail*, journal de production |
| Interface lente | Mémoire, workers en retard | `zammad run rails r 'p Delayed::Job.count'`, ressources |
| Notifications absentes | Déclencheurs, adresse d'expédition | Revoir les déclencheurs et le canal sortant |
