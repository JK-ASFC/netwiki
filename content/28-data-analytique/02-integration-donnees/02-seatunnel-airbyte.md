---
title: Apache SeaTunnel et Airbyte
description: Apache SeaTunnel (synchronisation de données massive, moteur Zeta ou Spark et Flink, fichiers de tâche HOCON source/transform/sink, seatunnel.sh, CDC, interface web) et Airbyte (connecteurs ELT par centaines, installation abctl sur Kubernetes local, sources, destinations, connexions, modes de synchronisation complète et incrémentale, normalisation, API, Terraform, licence ELv2 de la plate-forme et sécurité).
tags: [apache seatunnel, airbyte, elt, etl, synchronisation de données, connecteurs, cdc]
icon: git-merge
---

## Apache SeaTunnel

**SeaTunnel** synchronise de gros volumes de données entre plus d'une centaine de systèmes (bases SQL, Kafka, Hive, Iceberg, Elasticsearch, S3, ClickHouse…). Une tâche se décrit dans un fichier : **source → transformations → destination**, exécuté par son moteur **Zeta** (par défaut) ou par Spark ou Flink.

```bash
# Java 8 ou 11 ; archive depuis seatunnel.apache.org
tar xzf apache-seatunnel-*-bin.tar.gz -C /opt && cd /opt/apache-seatunnel-*
sh bin/install-plugin.sh                       # télécharge les connecteurs listés dans config/plugin_config
./bin/seatunnel.sh --config config/v2.batch.config.template -m local
./bin/seatunnel-cluster.sh -d                  # grappe Zeta
./bin/seatunnel.sh --config tache.conf         # soumission à la grappe
./bin/seatunnel.sh -l                          # liste des tâches
```

```text tache.conf
env { parallelism = 4, job.mode = "BATCH" }

source {
  Jdbc {
    url = "jdbc:mysql://mysql:3306/boutique"
    driver = "com.mysql.cj.jdbc.Driver"
    user = "lecture", password = "…"
    query = "SELECT id, client, montant, date_cmd FROM commandes"
  }
}

sink {
  Clickhouse {
    host = "clickhouse:8123", database = "analyse", table = "commandes"
    username = "ecriture", password = "…"
  }
}
```

Des blocs `transform` (Sql, FieldMapper, Filter, Replace…) peuvent s'intercaler entre source et destination. Le mode `STREAMING` avec les sources **CDC** (MySQL, PostgreSQL, SQL Server…) synchronise les changements en continu. Une interface web (SeaTunnel Web) existe en projet séparé.

## Airbyte

**Airbyte** est une plate-forme **ELT** : elle extrait les données de centaines de **sources** (bases, API SaaS, fichiers) et les charge dans une **destination** (entrepôt, lac, base), les transformations se faisant ensuite (par exemple avec dbt).

> [!NOTE]
> Les connecteurs sont pour la plupart sous licence libre (MIT) ; la plate-forme elle-même est sous **Elastic License 2.0** (code source disponible, usage interne libre, interdiction de la revendre en tant que service).

```bash
# Installation locale (crée une grappe Kubernetes kind dans Docker)
curl -LsfS https://get.airbyte.com | bash -
abctl local install                       # interface : http://localhost:8000
abctl local credentials                   # affiche l'e-mail et le mot de passe
abctl local credentials --password 'Nouveau-Mot-De-Passe'
abctl local status ; abctl local uninstall
# Production : chart Helm « airbyte » sur une grappe Kubernetes
```

| Notion | Rôle |
| --- | --- |
| Source / destination | Connecteur configuré (identifiants, schéma) |
| **Connexion** | Source + destination + flux sélectionnés + planification |
| Synchronisation complète | Recharge tout (écrasement ou ajout) |
| **Incrémentale** | Seulement les nouveautés, via un curseur (date, identifiant) ou en CDC |
| Dédoublonnage | Historique + table à jour par clé primaire |

Les connexions se gèrent aussi par **API**, par le fournisseur **Terraform** ou par le SDK **PyAirbyte** (connecteurs utilisables depuis Python, sans plate-forme).

### Sécurité

- Changer le mot de passe initial, placer l'interface derrière un proxy HTTPS et une authentification (SSO selon édition).
- Comptes de **lecture seule** sur les sources, avec réplication logique dédiée pour le CDC.
- Les identifiants des connecteurs sont stockés par Airbyte : protéger sa base et ses secrets (gestionnaire de secrets externe possible).

Voir aussi : [[01-apache-nifi|Apache NiFi]] · [[03-meltano-singer|Meltano et Singer]] · [[03-cdc-connecteurs/01-debezium-kafka-connect|Debezium]]. Commandes : [[90-aide-memoire|aide-mémoire]].
