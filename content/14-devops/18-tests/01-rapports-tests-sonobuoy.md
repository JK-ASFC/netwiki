---
title: Allure Report, ReportPortal et Sonobuoy
description: Exploiter les résultats de tests — Allure Report (Apache 2.0 : rapport HTML à partir des résultats JUnit, pytest, Playwright, Jest… ; Allure 3 en Node.js avec allure run, generate, open, watch, allurerc), ReportPortal (Apache 2.0 : plate-forme centralisée d'historique et d'analyse automatique des échecs, Docker Compose, comptes par défaut, agents) et Sonobuoy (Apache 2.0 : tests de conformité et de diagnostic d'un cluster Kubernetes, modes quick et certified-conformance, run, status, retrieve, results, delete).
tags: [allure, reportportal, sonobuoy, tests, rapports, kubernetes, conformité]
icon: flask-conical
---

| Outil | Rôle | Hébergement |
| --- | --- | --- |
| **Allure Report** | Rapport HTML lisible (étapes, captures, historique, tendances) | Fichiers statiques publiés par la CI |
| **ReportPortal** | Serveur central : historique de tous les lancements, tri et **analyse automatique** des échecs | Docker Compose ou Kubernetes |
| **Sonobuoy** | Vérifie qu'un cluster Kubernetes est **conforme** et en bonne santé | Binaire qui lance des pods dans le cluster |

## Allure Report

Chaque framework de test écrit ses résultats dans `allure-results` grâce à un adaptateur (`allure-pytest`, `allure-playwright`, `allure-jest`, `allure-junit5`, `allure-testng`…), puis Allure produit le rapport. **Allure 3** est réécrit en Node.js (Linux, Windows, macOS ; Node.js 20 ou plus) :

```bash
npm install -g allure                     # ou npx allure …
npx allure run -- npm test                # lance les tests et produit le rapport
npx allure generate ./allure-results      # rapport dans ./allure-report
npx allure open allure-report/awesome     # serveur local de consultation
npx allure watch ./allure-results         # rapport mis à jour en direct
```

Exemple pytest : `pip install allure-pytest` puis `pytest --alluredir=allure-results`. La configuration (nom, thème, historique, filtres) se place dans `allurerc.mjs`. Allure 2 (Java : `allure serve allure-results`) reste utilisé dans de nombreux pipelines. Publier le dossier généré comme artefact de la CI ou sur un serveur web interne ([[03-nginx/05-reverse-proxy-repartition|Nginx]]) ; conserver le sous-dossier d'historique entre deux exécutions pour les tendances.

## ReportPortal

```bash
mkdir reportportal && cd reportportal
curl -LO https://raw.githubusercontent.com/reportportal/reportportal/master/docker-compose.yml
docker compose -p reportportal up -d
```

Interface sur le port **8080**, comptes initiaux `default` / `1q2w3e` et `superadmin` / `erebus` (mot de passe administrateur réglable par `RP_INITIAL_ADMIN_PASSWORD`) : **les changer immédiatement**. Le fichier fournit PostgreSQL, RabbitMQ, OpenSearch, Traefik et les services ReportPortal ; prévoir au moins 8 Go de mémoire et retirer les intégrations de suivi d'anomalies inutiles. Chaque projet reçoit une clé d'API ; les agents (pytest, JUnit 5, TestNG, Playwright, Cypress, Robot Framework…) envoient les résultats en direct :

```bash
pip install pytest-reportportal
pytest --reportportal          # avec rp_endpoint, rp_project, rp_api_key dans pytest.ini
```

L'**analyseur automatique** rapproche un nouvel échec des échecs déjà classés (défaut produit, problème d'environnement, test à corriger).

## Sonobuoy

Outil de diagnostic d'un cluster [[04-kubernetes/01-presentation-architecture|Kubernetes]] (Linux, Windows, macOS ; binaire des versions publiées ou `brew install sonobuoy`) :

```bash
sonobuoy run --mode quick --wait             # un seul test : valide l'installation
sonobuoy run --mode certified-conformance    # tests de conformité complets (une à deux heures)
sonobuoy status
results=$(sonobuoy retrieve)
sonobuoy results $results                    # résumé ; --mode detailed pour le détail
sonobuoy delete --wait
```

Utile après une installation ou une mise à niveau du cluster (kubeadm, RKE2, k3s) et avant de déclarer un cluster prêt pour la production.

Voir aussi : [[03-applications-vulnerables|applications vulnérables]]. Commandes : [[90-aide-memoire|aide-mémoire]].
