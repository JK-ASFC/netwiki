---
title: Burp Suite
description: Burp Suite (PortSwigger), plateforme de test de sécurité des applications web — éditions Community, Professional et DAST (Enterprise), installation, proxy et certificat, navigateur intégré, outils (Target, Proxy, Repeater, Intruder, Decoder, Comparer, Sequencer), scanner de la version Professional, extensions BApp, usages pour l'administrateur (diagnostic d'en-têtes, d'authentification SSO, de reverse proxy) et cadre légal.
tags: [burp suite, sécurité web, proxy, pentest, repeater, scanner, portswigger]
icon: bug
---

**Burp Suite** est l'outil de référence des **tests d'intrusion web** : un proxy d'interception qui permet de voir, modifier et rejouer chaque requête entre le navigateur et l'application, complété (édition Professional) par un scanner de vulnérabilités. Pour l'administrateur, c'est aussi un excellent outil de **diagnostic** : voir précisément ce qu'un reverse proxy, un SSO (SAML/OIDC) ou une application renvoie.

| Édition | Contenu |
| --- | --- |
| **Community** | Gratuite : proxy, Repeater, Decoder, Comparer, Intruder bridé |
| **Professional** | Licence annuelle : scanner, Intruder complet, outils avancés, extensions Pro |
| Burp Suite DAST (ex-Enterprise) | Analyses automatisées planifiées à l'échelle, intégration CI |

> [!WARNING]
> Intercepter et modifier le trafic d'applications ou d'utilisateurs **sans autorisation** est illégal. Utilisez Burp sur vos propres applications, en environnement de test, ou dans le cadre d'un audit mandaté.

## Installation et proxy

Installateurs Windows, macOS, Linux (`winget install PortSwigger.BurpSuite.Community`). Le **navigateur intégré** (Chromium) est préconfiguré : pas de réglage de proxy ni de certificat. Avec un autre navigateur : proxy `127.0.0.1:8080` et import du certificat de Burp (`http://burp` → *CA Certificate*) dans un **profil de navigateur dédié** aux tests (jamais dans le magasin du système).

## Outils

| Outil | Usage |
| --- | --- |
| **Target** | Plan du site, périmètre (*scope*) pour ne pas sortir de la cible autorisée |
| **Proxy** | Historique HTTP/WebSocket, interception et modification à la volée |
| **Repeater** | Rejouer et modifier une requête à la main (en-têtes, paramètres, jetons) |
| **Intruder** | Variations automatisées d'un paramètre (bridé en Community) |
| Decoder / Comparer | Encodages (Base64, URL, JWT…), comparaison de réponses |
| Sequencer | Qualité aléatoire des jetons de session |
| Scanner (Pro) | Analyse passive et active, vérifications d'API |
| Logger, Collaborator (Pro) | Journal complet, détection d'interactions hors bande (SSRF, injections aveugles) |

## Usages d'administration

- **SSO** : observer les redirections SAML/OIDC, décoder une assertion SAML ou un jeton JWT (Decoder, extensions *SAML Raider*, *JWT Editor*) pour comprendre un échec d'authentification.
- **Reverse proxy / WAF** : vérifier les en-têtes ajoutés ou retirés, les redirections, les cookies (`Secure`, `SameSite`).
- **Contrôle d'accès** : rejouer dans Repeater une requête d'administrateur avec la session d'un utilisateur standard (l'application doit refuser) ; extension *Autorize* pour l'automatiser.
- **API** : construire et tester des requêtes, en complément de [[02-reseau-diagnostic/07-postman-bruno|Postman ou Bruno]].

## Extensions

Le **BApp Store** fournit des extensions (Java ou Python via Jython) : Autorize, Logger++, JWT Editor, SAML Raider, Turbo Intruder, Param Miner. Installez-les depuis le store et maintenez-les à jour.

## Bonnes pratiques

- [ ] Périmètre (*scope*) défini et filtres pour ne capturer que la cible
- [ ] Projets Burp (fichiers `.burp`) protégés : ils contiennent sessions, jetons et données
- [ ] Comptes de test dédiés, données fictives, environnement de préproduction
- [ ] Rapport : constats reproductibles (requête/réponse), gravité, correction proposée

Pour l'automatisation libre en intégration continue, voir [[02-owasp-zap|ZAP]].
