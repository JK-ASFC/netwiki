---
title: Présentation, installation et utilisation
description: Plates-formes d'observabilité tout-en-un auto-hébergées fondées sur OpenTelemetry et ClickHouse — SigNoz (APM, traces, journaux, métriques, tableaux de bord, alertes ; installation Docker et Helm ; licence MIT pour l'essentiel), HyperDX (journaux, traces, rejeu de sessions, recherche plein texte ; intégré à ClickStack de ClickHouse) et Uptrace (APM et traces, éditions Community et Enterprise) : architecture, envoi des données OTLP, dimensionnement de ClickHouse, rétention et comparaison avec la pile Grafana (Loki, Tempo, Mimir).
tags: [signoz, hyperdx, uptrace, observabilité, apm, opentelemetry, clickhouse]
icon: info
---

Plutôt qu'assembler [[09-loki-promtail/01-loki|Loki]], [[18-tracage-distribue/02-tempo|Tempo]], un stockage de métriques et [[03-grafana/01-presentation-installation|Grafana]], ces plates-formes offrent **une seule application** pour les trois signaux, avec corrélation immédiate (d'une trace lente au journal de l'erreur). Toutes reçoivent les données en **OTLP** depuis les applications ou un [[17-opentelemetry-alloy/01-presentation-installation|Collector]] et stockent dans [[24-clickhouse/01-presentation-installation|ClickHouse]].

| | **SigNoz** | **HyperDX** | **Uptrace** |
| --- | --- | --- | --- |
| Points forts | APM complet (latences, erreurs par service), alertes, tableaux de bord | Recherche de journaux très rapide, rejeu de sessions navigateur | APM et traces léger, requêtes sur attributs |
| Licence | MIT (fonctions entreprise à part) | MIT (base de ClickStack) | Community (gratuite) / Enterprise |

## SigNoz

```bash
git clone -b main https://github.com/SigNoz/signoz.git && cd signoz/deploy/docker
docker compose up -d            # interface http://<hôte>:8080, OTLP sur 4317/4318
# Kubernetes : helm repo add signoz https://charts.signoz.io && helm install signoz signoz/signoz -n platform --create-namespace
```

## HyperDX (ClickStack)

```bash
docker run -d -p 8080:8080 -p 4317:4317 -p 4318:4318 docker.hyperdx.io/hyperdx/hyperdx-all-in-one   # test tout-en-un
```

## Uptrace

```bash
# Paquets .deb/.rpm ou Docker Compose (dépôt uptrace/uptrace, dossier example/docker) avec ClickHouse et PostgreSQL
```

## Envoyer les données (OTLP)

Les applications (ou un Collector relais) pointent vers la plate-forme par les variables d'environnement standard OpenTelemetry :

| Variable | Rôle |
| --- | --- |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | URL du collecteur (`http://signoz:4318`) |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `grpc` (4317) ou `http/protobuf` (4318) |
| `OTEL_EXPORTER_OTLP_HEADERS` | En-têtes (clé d'ingestion : `signoz-ingestion-key=…`) |
| `OTEL_SERVICE_NAME` | Nom du service (regroupe traces/métriques/journaux) |
| `OTEL_RESOURCE_ATTRIBUTES` | Attributs de ressource (`deployment.environment=prod`) |

```bash
# Instrumentation automatique (exemple Python)
pip install opentelemetry-distro opentelemetry-exporter-otlp && opentelemetry-bootstrap -a install
OTEL_SERVICE_NAME=inventaire OTEL_EXPORTER_OTLP_ENDPOINT=http://signoz:4318 opentelemetry-instrument python app.py
```

## Dimensionnement et rétention

- **ClickHouse** est le facteur dimensionnant : disques rapides (NVMe), RAM généreuse ; c'est lui qui absorbe le volume de journaux et de traces.
- Fixez une **rétention par signal** (TTL ClickHouse) : journaux souvent 7 à 30 jours, traces 7 jours, métriques plus longtemps.
- **Échantillonnage** des traces côté SDK ou Collector (`traces_sample_rate`, `tail_sampling`) pour maîtriser le volume.

| Critère | Pile unifiée (SigNoz/HyperDX/Uptrace) | Pile Grafana (Loki/Tempo/Mimir) |
| --- | --- | --- |
| Déploiement | Une application + ClickHouse | Plusieurs services + Grafana |
| Corrélation | Native, immédiate | Via *data links* configurés |
| Stockage | ClickHouse (un moteur) | Objet (S3) par signal |
| Souplesse | Intégrée, moins modulaire | Très modulaire, à assembler |

<!-- CAPTURE: SigNoz — vue APM d'un service (latence, erreurs, débit) | _assets/signoz-apm.png -->
<!-- CAPTURE: HyperDX — recherche de journaux et trace associée | _assets/hyperdx-recherche.png -->
<!-- CAPTURE: Uptrace — liste des traces | _assets/uptrace-traces.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
