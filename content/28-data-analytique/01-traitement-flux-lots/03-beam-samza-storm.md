---
title: Apache Beam, Samza et Storm
description: Apache Beam (modèle de pipeline unifié lots et flux, SDK Python, Java et Go, exécuteurs Direct, Flink, Spark, Dataflow), Apache Samza (traitement avec état autour de Kafka, YARN ou intégré) et Apache Storm (topologies, spouts, bolts, Nimbus, Supervisor, Storm UI) ; état des projets et tableau de choix entre les moteurs de traitement.
tags: [apache beam, apache samza, apache storm, streaming, traitement de flux, big data]
icon: workflow
---

## Apache Beam

**Beam** n'est pas un moteur mais un **modèle de programmation** : on écrit le pipeline une fois (Python, Java, Go), puis on choisit l'**exécuteur** (*runner*) : Direct (local, tests), **Flink**, **Spark**, Google Cloud Dataflow…

```python
import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions

with beam.Pipeline(options=PipelineOptions()) as p:
    (p
     | beam.io.ReadFromText("journaux/*.log")
     | beam.Filter(lambda l: " 500 " in l)
     | beam.Map(lambda l: (l.split()[0], 1))
     | beam.CombinePerKey(sum)
     | beam.io.WriteToText("sortie/erreurs_par_ip"))
```

```bash
python3 -m pip install apache-beam
python3 pipeline.py --runner DirectRunner
python3 pipeline.py --runner FlinkRunner --flink_master=flink-jm:8081 --environment_type=LOOPBACK
```

Intérêt : portabilité entre moteurs et modèle de fenêtrage très complet ; contrepartie : une couche d'abstraction de plus à déboguer.

## Apache Samza

Traitement de flux **avec état** né chez LinkedIn, très lié à **Kafka** (entrées, sorties et journal de l'état). Il tourne sur YARN, ou **intégré** dans une application Java ordinaire (mode *standalone*, coordination par ZooKeeper).

- API haut niveau (`MessageStream`) et Samza SQL.
- État local RocksDB sauvegardé dans un topic Kafka de *changelog*.
- Projet peu actif aujourd'hui : on le rencontre surtout dans des déploiements existants ; Flink ou Kafka Streams le remplacent dans les nouveaux projets.

## Apache Storm

Premier grand moteur de flux open source (2011). Un traitement est une **topologie** : des **spouts** (sources) et des **bolts** (traitements) reliés en graphe.

| Composant | Rôle |
| --- | --- |
| **Nimbus** | Maître : distribue les topologies |
| **Supervisor** | Sur chaque nœud, lance les *workers* |
| ZooKeeper | Coordination |
| **Storm UI** | Interface web (port 8080 par défaut) |

```bash
storm nimbus & storm supervisor & storm ui &
storm jar topologie.jar fr.exemple.Comptage comptage-prod
storm list
storm rebalance comptage-prod -n 6
storm kill comptage-prod -w 30
```

Garanties « au moins une fois » (accusés par tuple) ou « exactement une fois » avec Trident. Storm reste maintenu mais son usage décline au profit de Flink.

## Choisir un moteur

| Besoin | Choix conseillé |
| --- | --- |
| ETL par lots, SQL sur lac de données, ML | [[01-apache-spark\|Spark]] |
| Flux temps réel avec état, faible latence, exactement une fois | [[02-apache-flink\|Flink]] |
| Pipeline portable entre plusieurs moteurs ou cloud | Beam |
| Traitement simple sur Kafka dans une application Java | Kafka Streams |
| Existant Storm ou Samza | Maintenir, migrer progressivement vers Flink |

Commandes : [[90-aide-memoire|aide-mémoire]].
