---
title: ZAP (OWASP ZAP)
description: ZAP (Zed Attack Proxy), scanner de sécurité des applications web libre — usages (vérification d'une application interne, intégration continue), installation (Windows, Linux, macOS, Docker), proxy et certificat racine, exploration (spider classique et AJAX), analyse passive et active, authentification et contextes, scripts d'analyse de base dans un pipeline (baseline, full, API), framework d'automatisation, rapports, cadre légal.
tags: [zap, owasp, sécurité web, dast, proxy, ci, scanner]
icon: bug
---

**ZAP** (*Zed Attack Proxy*, Apache 2.0), anciennement projet OWASP et désormais soutenu par Checkmarx, est un outil **DAST** : il analyse une application web **en fonctionnement** en se plaçant comme proxy entre le navigateur et l'application, puis en envoyant des requêtes de test. Il détecte en-têtes de sécurité manquants, cookies mal protégés, injections, XSS, fuites d'informations, composants vulnérables.

> [!WARNING]
> Une analyse **active** envoie des charges d'attaque (injections) qui peuvent créer, modifier ou supprimer des données : uniquement sur des applications que vous êtes autorisé à tester, de préférence en **préproduction**.

## Installation

| Système | Méthode |
| --- | --- |
| Windows / macOS / Linux | Installateurs officiels (Java inclus) ; `winget install ZAP.ZAP` |
| Docker | `ghcr.io/zaproxy/zaproxy:stable` (scripts d'analyse inclus) |

## Utilisation interactive

1. **Navigateur piloté** : *Manual Explore* lance un navigateur configuré pour passer par ZAP (certificat racine de ZAP déjà approuvé) ; sinon, configurer le proxy `localhost:8080` et importer le certificat racine de ZAP dans le navigateur de test.
2. **Explorer** l'application (manuellement et avec le *Spider* / *AJAX Spider* pour les applications JavaScript).
3. **Analyse passive** : automatique sur tout le trafic, sans risque (en-têtes, cookies, informations divulguées).
4. **Analyse active** (*Active Scan*) sur le site ou un sous-arbre, avec une politique adaptée.
5. **Alertes** classées par risque et confiance, avec la requête et la réponse en preuve ; rapport HTML/PDF/JSON.

### Applications authentifiées

Créer un **contexte** (périmètre de l'application, exclusions comme `/logout`), définir la méthode d'authentification (formulaire, en-tête, script, navigateur), les utilisateurs de test, et un indicateur de connexion/déconnexion : ZAP analyse alors les pages protégées.

## Intégration continue

```bash
# Analyse de base (spider + passive, quelques minutes, sans attaque) — idéale à chaque déploiement
docker run --rm -v "$(pwd):/zap/wrk" ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t https://appli-preprod.corp.exemple.fr -r rapport-zap.html -c regles.conf

# Analyse complète (active) — planifiée sur la préproduction
docker run --rm -v "$(pwd):/zap/wrk" ghcr.io/zaproxy/zaproxy:stable zap-full-scan.py -t https://appli-preprod.corp.exemple.fr -r complet.html

# API décrite par OpenAPI
docker run --rm -v "$(pwd):/zap/wrk" ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py -t https://api-preprod.corp.exemple.fr/openapi.json -f openapi -r api.html
```

Le fichier `regles.conf` règle chaque alerte (`IGNORE`, `WARN`, `FAIL`) : le pipeline échoue si une règle `FAIL` est déclenchée. Le **framework d'automatisation** (fichier YAML : contextes, authentification, jobs) remplace les scripts pour les scénarios complexes.

## Ce que ZAP vérifie bien (et moins bien)

| Bien couvert | Moins bien couvert |
| --- | --- |
| En-têtes (CSP, HSTS, X-Content-Type-Options), cookies (`Secure`, `HttpOnly`, `SameSite`) | Logique métier, contrôle d'accès entre utilisateurs |
| Injections SQL/commande classiques, XSS réfléchi | Chaînes d'attaque complexes |
| Divulgation d'informations, répertoires exposés | Applications très dynamiques sans configuration soignée |

Pour les tests manuels approfondis, voir [[03-burp-suite|Burp Suite]] ; pour les composants vulnérables, [[05-owasp-dependency-check|Dependency-Check]].
