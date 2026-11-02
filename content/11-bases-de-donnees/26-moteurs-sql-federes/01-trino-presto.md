---
title: Trino et Presto
description: Trino (ex-PrestoSQL) et Presto (PrestoDB, Linux Foundation) — moteurs SQL distribués pour interroger lacs de données et bases hétérogènes sans copier les données : histoire du fork, architecture (coordinateur et workers), installation (archive, Docker, Helm), configuration (node.properties, jvm.config, config.properties, catalogues), connecteurs (Hive/Iceberg/Delta sur S3 ou MinIO, PostgreSQL, MySQL, Elasticsearch, Kafka), CLI, requêtes fédérées, sécurité (TLS, LDAP/OAuth2, contrôle d'accès), console web et supervision.
tags: [trino, presto, sql distribué, lac de données, iceberg, fédération]
icon: info
---

**Trino** et **Presto** exécutent du SQL **sur place** : une requête peut joindre une table Iceberg sur [[07-minio/01-presentation-installation|MinIO]], une table [[02-postgresql/01-presentation|PostgreSQL]] et un index Elasticsearch. Ils ne stockent rien eux-mêmes.

| | **Trino** | Presto (PrestoDB) |
| --- | --- | --- |
| Origine | Fork des créateurs de Presto (2019, ex-PrestoSQL) | Projet initial de Facebook, Linux Foundation |
| Rythme | Versions fréquentes, large communauté | Moteur natif C++ (Prestissimo/Velox) en développement |
| Éditeur | Starburst | Ahana (IBM) |

Pour un nouveau déploiement, **Trino** est le choix le plus courant ; les concepts et la configuration sont très proches.

## Installation (Trino)

```bash
docker run -d --name trino -p 8080:8080 -v /srv/trino/catalog:/etc/trino/catalog trinodb/trino
# Archive (Java 23+ selon la version) depuis trino.io : trino-server-<version>.tar.gz, puis etc/ :
```

```ini
# etc/config.properties — coordinateur
coordinator=true
node-scheduler.include-coordinator=false
http-server.http.port=8080
discovery.uri=http://trino-coord.corp.exemple.fr:8080
# etc/node.properties : node.environment=prod, node.id=<unique>, node.data-dir=/srv/trino/data
# etc/jvm.config : -Xmx16G et options recommandées
```

```ini
# etc/catalog/lac.properties — Iceberg sur MinIO avec un métastore REST
connector.name=iceberg
iceberg.catalog.type=rest
iceberg.rest-catalog.uri=http://catalogue.corp.exemple.fr:8181
fs.native-s3.enabled=true
s3.endpoint=https://minio.corp.exemple.fr
s3.path-style-access=true
s3.region=us-east-1
# etc/catalog/netbox.properties
connector.name=postgresql
connection-url=jdbc:postgresql://srv-db-01:5432/netbox
connection-user=lecture
connection-password=MdpLecture2026
```

```bash
trino --server http://trino-coord.corp.exemple.fr:8080 --catalog lac --schema reseau
```

```sql
SHOW CATALOGS;
SELECT d.name AS equipement, sum(f.octets) AS volume
FROM lac.reseau.flux f JOIN netbox.public.dcim_device d ON f.equipement = d.name
WHERE f.ts > current_timestamp - INTERVAL '1' DAY GROUP BY 1 ORDER BY 2 DESC LIMIT 10;
```

Sécurité : HTTPS obligatoire dès qu'on active l'authentification (LDAP, OAuth2/OIDC, certificats), contrôle d'accès par fichier de règles ou Apache Ranger. Interface : `http://<coordinateur>:8080/ui/`.

Suite : [[02-apache-drill|Apache Drill]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
