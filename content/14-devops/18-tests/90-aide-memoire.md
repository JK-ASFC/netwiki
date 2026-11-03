---
title: Tests — aide-mémoire
description: Commandes Allure Report (run, generate, open, watch, adaptateur pytest), ReportPortal (Docker Compose, agent pytest), Sonobuoy (run quick et conformité, status, retrieve, results, delete), OWASP Juice Shop et WebGoat (Docker).
tags: [aide-mémoire, allure, reportportal, sonobuoy, juice shop, webgoat]
icon: terminal
---

Explications : [[01-rapports-tests-sonobuoy|Allure, ReportPortal et Sonobuoy]] · [[02-tests-charge|tests de charge]] · [[03-applications-vulnerables|Juice Shop et WebGoat]].

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

## Tests de charge

Explications : [[02-tests-charge|tests de charge]].

```bash
k6 run charge-api.js ; k6 run --vus 10 --duration 30s charge-api.js ; docker run --rm -i grafana/k6 run - < charge-api.js
jmeter -n -t plan.jmx -l resultats.jtl -e -o rapport-html
locust -f locustfile.py --headless -u 200 -r 10 -t 10m --host https://recette-api.corp.exemple.fr --html rapport.html
./mvnw gatling:test
echo "GET https://recette-api.corp.exemple.fr/v1/produits" | vegeta attack -rate=100 -duration=30s | vegeta report
wrk -t4 -c100 -d30s --latency https://recette.corp.exemple.fr/
hey -n 2000 -c 50 https://recette.corp.exemple.fr/
siege -c 25 -t 1M https://recette.corp.exemple.fr/
```
