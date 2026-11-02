---
title: Interfaces graphiques
description: Interfaces de traçage — Jaeger UI (recherche de traces, chronologie des spans, comparaison, carte des dépendances, Monitor), Zipkin UI (recherche, dépendances) et Grafana avec Tempo (Explore, TraceQL, vue en cascade, graphe des services, liens vers journaux et métriques), avec emplacements de captures d'écran.
tags: [jaeger, zipkin, tempo, grafana, interface graphique, captures]
icon: monitor
---

## Jaeger UI (`http://<hôte>:16686`)

**Search** (service, opération, étiquettes, durée min/max), vue d'une trace en **cascade** (spans, durées, attributs, journaux d'événements), **Compare** (deux traces), **System Architecture** (dépendances), **Monitor** (métriques RED si configurées).

<!-- CAPTURE: Jaeger — recherche de traces d'un service | _assets/jaeger-recherche.png -->
<!-- CAPTURE: Jaeger — vue en cascade d'une trace | _assets/jaeger-trace.png -->

## Zipkin UI (`http://<hôte>:9411`)

Recherche par service et étiquettes, détail d'une trace, page **Dependencies**.

## Grafana + Tempo

*Explore* → source Tempo : TraceQL, **Search**, **Service Graph** ; dans une trace, boutons vers les journaux Loki du même `trace_id` et vers les métriques.

<!-- CAPTURE: Grafana — trace Tempo avec lien vers les journaux Loki | _assets/grafana-tempo-trace.png -->
<!-- CAPTURE: Grafana — graphe des services (Tempo) | _assets/grafana-tempo-graphe.png -->
