---
title: Jaeger et Zipkin
description: Traçage distribué — principes (trace, span, contexte propagé, échantillonnage), Jaeger (CNCF : Jaeger v2 fondé sur le Collector OpenTelemetry, all-in-one pour tester, stockage Elasticsearch/OpenSearch, Cassandra, Badger ou ClickHouse, interface de recherche et de comparaison de traces, Helm et opérateur) et Zipkin (Java, historique : collecteur, stockage, interface, protocole B3), instrumentation des applications via OpenTelemetry, installation et usages de dépannage de latence.
tags: [jaeger, zipkin, traçage distribué, opentelemetry, spans, latence]
icon: info
---

Une **trace** suit une requête à travers tous les services qu'elle traverse ; chaque étape est un **span** (durée, service, attributs, erreurs). On voit immédiatement quel appel ralentit une page ou quel service renvoie l'erreur. Les applications s'instrumentent avec **OpenTelemetry** et envoient leurs spans à un [[17-opentelemetry-alloy/01-presentation-installation|collecteur]].

| | **Jaeger** | **Zipkin** | [[02-tempo\|Tempo]] |
| --- | --- | --- | --- |
| Projet | CNCF (diplômé) | OpenZipkin (historique) | Grafana Labs (AGPL) |
| Stockage | Elasticsearch/OpenSearch, Cassandra, Badger, ClickHouse | Elasticsearch, Cassandra, MySQL, mémoire | **Stockage objet** (peu coûteux) |
| Recherche | Par service, opération, étiquettes, durée | Idem | Par TraceQL, intégré à Grafana |

## Jaeger

```bash
docker run -d --name jaeger -p 16686:16686 -p 4317:4317 -p 4318:4318 jaegertracing/jaeger:2.5.0     # tout-en-un, en mémoire (test)
# Interface : http://localhost:16686 ; les applications envoient en OTLP sur 4317/4318
```

Production : Jaeger v2 configuré comme un Collector OpenTelemetry avec un stockage **OpenSearch/Elasticsearch** ([[02-opensearch/01-presentation-installation|OpenSearch]]) et une rétention (ILM) ; sur Kubernetes, chart Helm `jaegertracing/jaeger` ou opérateur.

## Zipkin

```bash
docker run -d -p 9411:9411 openzipkin/zipkin           # mémoire ; STORAGE_TYPE=elasticsearch ES_HOSTS=… en production
java -jar zipkin.jar                                    # ou binaire Java (Linux, Windows, macOS)
```

Interface : `http://localhost:9411`. Les applications historiques utilisent l'en-tête **B3** ; le Collector OpenTelemetry sait recevoir et exporter le format Zipkin pour faire la transition.

## Instrumenter une application (exemple Java sans modification du code)

```bash
java -javaagent:opentelemetry-javaagent.jar -Dotel.service.name=inventaire -Dotel.exporter.otlp.endpoint=http://otel.corp.exemple.fr:4318 -jar inventaire.jar
```

Agents équivalents : Python (`opentelemetry-instrument`), Node.js, .NET (instrumentation automatique), Go (bibliothèques).

Suite : [[02-tempo|Tempo]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
