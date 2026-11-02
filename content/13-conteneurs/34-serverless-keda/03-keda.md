---
title: KEDA
description: KEDA (CNCF) — mise à l'échelle des charges Kubernetes pilotée par les événements, jusqu'à zéro : architecture (opérateur et serveur de métriques externes qui alimente le HPA), installation Helm, ScaledObject et ScaledJob, plus de 60 scalers (Kafka, RabbitMQ, Redis, PostgreSQL, Prometheus, cron, Azure, AWS SQS), authentification (TriggerAuthentication), comportement de montée et descente, et exemples d'usage.
tags: [keda, autoscaling, kubernetes, événements, kafka, rabbitmq, prometheus]
icon: info
---

Le HPA natif de Kubernetes ne réagit qu'au CPU et à la mémoire. **KEDA** adapte le nombre de pods à des **sources d'événements** : longueur d'une file [[03-rabbitmq/01-presentation-installation|RabbitMQ]], retard d'un groupe [[04-kafka/01-presentation-installation|Kafka]], résultat d'une requête [[02-prometheus/01-presentation-installation|Prometheus]], plage horaire… et peut descendre à **zéro** pod.

```bash
helm repo add kedacore https://kedacore.github.io/charts && helm repo update
helm install keda kedacore/keda -n keda --create-namespace
```

```yaml
apiVersion: keda.sh/v1alpha1
kind: TriggerAuthentication
metadata: { name: rabbitmq-auth, namespace: traitements }
spec:
  secretTargetRef: [{ parameter: host, name: rabbitmq-url, key: amqp }]
---
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: traitement-factures, namespace: traitements }
spec:
  scaleTargetRef: { name: traitement-factures }      # Deployment
  minReplicaCount: 0
  maxReplicaCount: 20
  cooldownPeriod: 300
  triggers:
    - type: rabbitmq
      metadata: { queueName: factures, mode: QueueLength, value: "50" }
      authenticationRef: { name: rabbitmq-auth }
    - type: cron
      metadata: { timezone: Europe/Paris, start: "0 8 * * 1-5", end: "0 19 * * 1-5", desiredReplicas: "2" }
```

```bash
kubectl get scaledobject -n traitements ; kubectl get hpa -n traitements ; kubectl describe scaledobject traitement-factures -n traitements
```

**ScaledJob** crée des Jobs (un par lot de messages) plutôt que de faire varier un Deployment. Commandes : [[90-aide-memoire|aide-mémoire]].
