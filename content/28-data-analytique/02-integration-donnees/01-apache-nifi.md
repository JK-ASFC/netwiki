---
title: Apache NiFi
description: Apache NiFi, plate-forme graphique de flux de données — FlowFiles, processeurs, connexions et contre-pression, groupes de processus, provenance, dépôts (flowfile, content, provenance), installation (archive, Docker), nifi.properties, compte initial et HTTPS par défaut, NiFi Registry et versionnage, grappe, services de contrôleur, paramètres, exemples de flux et sécurité.
tags: [apache nifi, nifi, etl, flux de données, ingestion, nifi registry]
icon: git-merge
---

**Apache NiFi** conçoit des **flux de données** dans une interface web en glisser-déposer : récupérer des fichiers, interroger des API ou des bases, transformer, router et livrer vers Kafka, S3, HDFS, Elasticsearch, des bases SQL… Plus de 300 **processeurs** sont fournis.

## Notions

| Notion | Rôle |
| --- | --- |
| **FlowFile** | Unité de donnée : contenu + attributs (métadonnées) |
| **Processeur** | Étape du flux (`GetFile`, `InvokeHTTP`, `ConvertRecord`, `PutDatabaseRecord`, `PublishKafka`…) |
| **Connexion** | File entre deux processeurs, avec **contre-pression** (seuils en nombre ou en taille) |
| Groupe de processus | Regroupe un sous-flux, avec ports d'entrée et de sortie |
| Service de contrôleur | Ressource partagée : pool JDBC, lecteur/écrivain d'enregistrements (CSV, JSON, Avro), contexte SSL |
| **Paramètres** | Valeurs par environnement (URL, mots de passe sensibles) |
| **Provenance** | Historique de chaque FlowFile : d'où il vient, ce qu'il est devenu |

Les données vivent dans trois **dépôts** sur disque : *flowfile*, *content* et *provenance*. Les placer sur des disques rapides et séparés en production.

## Installation

```bash
# Java 21 pour NiFi 2.x ; archive depuis nifi.apache.org
unzip nifi-*-bin.zip -d /opt && ln -s /opt/nifi-* /opt/nifi
/opt/nifi/bin/nifi.sh set-single-user-credentials admin 'Mot-De-Passe-Long-12+'
/opt/nifi/bin/nifi.sh start ; /opt/nifi/bin/nifi.sh status
tail -f /opt/nifi/logs/nifi-app.log
# Interface : https://serveur:8443/nifi (HTTPS et authentification activés par défaut)

docker run -d --name nifi -p 8443:8443 \
  -e SINGLE_USER_CREDENTIALS_USERNAME=admin -e SINGLE_USER_CREDENTIALS_PASSWORD='…' \
  apache/nifi:latest
```

Sans identifiants fixés, NiFi en génère au premier démarrage et les écrit dans `logs/nifi-app.log`.

```properties conf/nifi.properties
nifi.web.https.host=0.0.0.0
nifi.web.https.port=8443
nifi.flowfile.repository.directory=/data/nifi/flowfile_repository
nifi.content.repository.directory.default=/data/nifi/content_repository
nifi.provenance.repository.directory.default=/data/nifi/provenance_repository
nifi.provenance.repository.max.storage.time=7 days
nifi.sensitive.props.key=<clé de chiffrement des propriétés sensibles>
```

Mémoire de la JVM : `conf/bootstrap.conf` (`java.arg.2=-Xms4g`, `java.arg.3=-Xmx4g`).

## Exemple de flux

1. `ListSFTP` + `FetchSFTP` : récupérer les fichiers CSV d'un partenaire.
2. `ConvertRecord` (CSVReader → JsonRecordSetWriter) : conversion.
3. `RouteOnAttribute` : aiguiller selon un attribut (`${filename:startsWith('ventes')}`).
4. `PutDatabaseRecord` vers PostgreSQL et `PublishKafka` vers un topic.
5. Branches `failure` vers un groupe de traitement des erreurs (et non à l'abandon).

Le **langage d'expression** de NiFi (`${attribut:fonction()}`) calcule noms de fichiers, chemins et conditions.

## Versionnage et grappe

- **NiFi Registry** (port 18443 en HTTPS) versionne les groupes de processus ; NiFi 2 peut aussi utiliser directement un dépôt **Git** (GitHub, GitLab) comme registre.
- **Grappe** : plusieurs nœuds exécutent le même flux, coordination par ZooKeeper (ou Kubernetes pour NiFi 2) ; interface accessible depuis n'importe quel nœud.
- **MiNiFi** : agent léger pour collecter à la périphérie et transmettre à NiFi (Site-to-Site).

## Sécurité

- HTTPS obligatoire, comptes par **LDAP**, OIDC ou certificats clients ; politiques d'accès fines (lecture, modification, données, provenance).
- Paramètres **sensibles** pour les mots de passe (jamais en clair dans les propriétés des processeurs).
- La provenance et les files contiennent des **données réelles** : en limiter l'accès et la durée de conservation.

Voir aussi : [[02-seatunnel-airbyte|SeaTunnel et Airbyte]] · [[03-meltano-singer|Meltano et Singer]]. Commandes : [[90-aide-memoire|aide-mémoire]].
