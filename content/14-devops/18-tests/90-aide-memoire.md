---
title: Tests — aide-mémoire
description: Commandes Allure Report (run, generate, open, watch, adaptateur pytest), ReportPortal (Docker Compose, agent pytest), Sonobuoy (run quick et conformité, status, retrieve, results, delete), OWASP Juice Shop et WebGoat (Docker).
tags: [aide-mémoire, allure, reportportal, sonobuoy, juice shop, webgoat]
icon: terminal
---

Explications : [[01-rapports-tests-sonobuoy|Allure, ReportPortal et Sonobuoy]] · [[03-applications-vulnerables|Juice Shop et WebGoat]].

## Rapports et conformité

```bash
npx allure run -- npm test ; npx allure generate ./allure-results ; npx allure open allure-report/awesome
pytest --alluredir=allure-results
curl -LO https://raw.githubusercontent.com/reportportal/reportportal/master/docker-compose.yml && docker compose -p reportportal up -d
pytest --reportportal
sonobuoy run --mode quick --wait ; sonobuoy status ; results=$(sonobuoy retrieve) ; sonobuoy results $results ; sonobuoy delete --wait
```

## Applications vulnérables

```bash
docker run -d --name juice-shop -p 127.0.0.1:3000:3000 bkimminich/juice-shop
docker run -it -p 127.0.0.1:8080:8080 -p 127.0.0.1:9090:9090 -e TZ=Europe/Paris webgoat/webgoat
```
