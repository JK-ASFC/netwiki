---
title: Tests de charge — k6, JMeter, Locust, Gatling, Vegeta, wrk, hey, Siege
description: Mesurer la tenue en charge d'un site ou d'une API — k6 (AGPL, Grafana : scénarios JavaScript, seuils, dépôt apt et rpm, Docker grafana/k6, sortie vers InfluxDB ou Prometheus), Apache JMeter (Apache 2.0 : plans .jmx, mode non graphique -n, rapport HTML), Locust (MIT : scénarios Python, interface web, mode headless et distribué), Gatling (Apache 2.0 : simulations Java, Kotlin, Scala ou JavaScript, Maven gatling:test), outils en ligne de commande Vegeta, wrk, hey et Siege, méthode (paliers, seuils, environnement dédié) et lecture des percentiles.
tags: [tests de charge, performance, k6, jmeter, locust, gatling, vegeta, wrk, hey, siege]
icon: gauge
---

| Outil | Scénarios écrits en | Points forts | Licence |
| --- | --- | --- | --- |
| **k6** | JavaScript | Seuils de réussite pour la CI, faible consommation, export vers [[03-grafana/01-presentation-installation\|Grafana]] | AGPL 3.0 |
| **Apache JMeter** | Interface graphique (fichiers `.jmx`) | Nombreux protocoles (HTTP, JDBC, LDAP, JMS, FTP), très répandu | Apache 2.0 |
| **Locust** | Python | Comportement utilisateur réaliste, interface web en direct, mode distribué | MIT |
| **Gatling** | Java, Kotlin, Scala, JavaScript | Très performant, rapports HTML détaillés | Apache 2.0 |
| **Vegeta** | Ligne de commande | Débit **constant** (requêtes/s), idéal pour une API | MIT |
| **wrk** | Ligne de commande (+ Lua) | Débit maximal d'un serveur HTTP depuis une seule machine | Apache 2.0 |
| **hey** | Ligne de commande | Test rapide « N requêtes, C en parallèle » | Apache 2.0 |
| **Siege** | Ligne de commande | Liste d'URL, simulation de navigation | GPL 3.0 |

## Méthode

1. **Environnement dédié** semblable à la production (jamais la production sans accord, prévenir l'hébergeur et le SOC : une charge ressemble à une attaque par déni de service).
2. Définir l'objectif : nombre d'utilisateurs simultanés, requêtes par seconde, temps de réponse au **95ᵉ percentile** (p95), taux d'erreur maximal.
3. Monter par **paliers** (montée, plateau, descente) ; observer en parallèle le serveur (CPU, mémoire, connexions de base de données) avec la supervision.
4. Lire les **percentiles**, pas la moyenne : une moyenne de 200 ms peut cacher 5 % de requêtes à 4 s.
5. Le générateur de charge ne doit pas être le goulet d'étranglement (CPU de l'injecteur < 70 %).

## k6

Installation : Debian/Ubuntu (dépôt `https://dl.k6.io/deb`), `sudo dnf install https://dl.k6.io/rpm/repo.rpm && sudo dnf install k6`, `winget install k6 --source winget`, `brew install k6`, Docker `grafana/k6`.

```javascript
// charge-api.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },    // montée à 50 utilisateurs virtuels
    { duration: '5m', target: 50 },    // plateau
    { duration: '1m', target: 0 },     // descente
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95 % des requêtes sous 500 ms
    http_req_failed: ['rate<0.01'],    // moins de 1 % d'erreurs
  },
};

export default function () {
  const res = http.get('https://recette-api.corp.exemple.fr/v1/produits');
  check(res, { 'statut 200': (r) => r.status === 200 });
  sleep(1);
}
```

```bash
k6 run charge-api.js                        # code retour non nul si un seuil échoue
k6 run --vus 10 --duration 30s charge-api.js
k6 run --out influxdb=http://influx.corp.exemple.fr:8086/k6 charge-api.js
docker run --rm -i grafana/k6 run - < charge-api.js
```

## Apache JMeter

Java 8 ou plus ; archive de jmeter.apache.org (Linux, Windows, macOS) ou `brew install jmeter`. Construire le plan dans l'interface graphique, puis **exécuter sans interface** (l'interface fausse les mesures) :

```bash
jmeter -n -t plan.jmx -l resultats.jtl -e -o rapport-html
jmeter -n -t plan.jmx -Jutilisateurs=100 -Jduree=600 -l resultats.jtl    # propriétés lues par ${__P(utilisateurs)}
```

Ajouter les extensions par le *Plugins Manager*. Pour une forte charge, utiliser plusieurs injecteurs (`-R hote1,hote2`).

## Locust

```bash
pip install locust
```

```python
# locustfile.py
from locust import HttpUser, task, between

class Visiteur(HttpUser):
    wait_time = between(1, 3)

    @task(3)
    def catalogue(self):
        self.client.get("/v1/produits")

    @task(1)
    def detail(self):
        self.client.get("/v1/produits/42", name="/v1/produits/[id]")
```

```bash
locust -f locustfile.py --host https://recette-api.corp.exemple.fr        # interface sur http://localhost:8089
locust -f locustfile.py --headless -u 200 -r 10 -t 10m --host https://recette-api.corp.exemple.fr --csv resultats --html rapport.html
locust -f locustfile.py --master    # puis sur chaque injecteur : locust -f locustfile.py --worker --master-host=10.0.0.5
```

## Gatling

Projet de démarrage (Maven, Gradle ou JavaScript/TypeScript) téléchargé depuis le site ou les dépôts d'exemples de Gatling ; Java 11 ou plus :

```java
public class ProduitsSimulation extends Simulation {
  HttpProtocolBuilder httpProtocol = http.baseUrl("https://recette-api.corp.exemple.fr");
  ScenarioBuilder scn = scenario("Catalogue")
      .exec(http("liste").get("/v1/produits").check(status().is(200)))
      .pause(1);
  { setUp(scn.injectOpen(rampUsers(200).during(120))).protocols(httpProtocol)
      .assertions(global().responseTime().percentile(95).lt(500)); }
}
```

```bash
./mvnw gatling:test                         # rapport HTML dans target/gatling/
./mvnw gatling:test -Dgatling.simulationClass=ProduitsSimulation
```

## Outils en ligne de commande

```bash
# Vegeta : 100 requêtes/s pendant 30 s, débit constant
echo "GET https://recette-api.corp.exemple.fr/v1/produits" | vegeta attack -rate=100 -duration=30s | tee res.bin | vegeta report
vegeta report -type=hist[0,100ms,200ms,500ms,1s] < res.bin ; vegeta plot < res.bin > graphe.html
# wrk : 4 fils, 100 connexions, 30 s, avec percentiles (Linux, macOS)
wrk -t4 -c100 -d30s --latency https://recette.corp.exemple.fr/
# hey : 2 000 requêtes, 50 en parallèle ; ou pendant 30 s
hey -n 2000 -c 50 https://recette.corp.exemple.fr/
hey -z 30s -c 50 -m POST -T application/json -d '{"q":"test"}' https://recette-api.corp.exemple.fr/v1/recherche
# Siege : 25 utilisateurs pendant 1 minute, liste d'URL, mode banc d'essai sans pause
siege -c 25 -t 1M https://recette.corp.exemple.fr/
siege -c 25 -t 1M -f urls.txt ; siege -b -c 50 -t 30S https://recette.corp.exemple.fr/
```

Installation : `apt install wrk siege` (Debian/Ubuntu), `brew install vegeta wrk hey siege` (macOS), binaires des versions publiées de Vegeta et hey (Windows, Linux) ou `go install github.com/rakyll/hey@latest`.

Voir aussi : [[01-rapports-tests-sonobuoy|rapports de tests]]. Commandes : [[90-aide-memoire|aide-mémoire]].
